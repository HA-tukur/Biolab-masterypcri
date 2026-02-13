import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  requestId: string;
  action: "approve" | "reject";
}

function isAdmin(userEmail: string | undefined, appMetadata: any): boolean {
  if (!userEmail) return false;

  if (appMetadata?.role === "admin") {
    return true;
  }

  const adminEmailsEnv = Deno.env.get("ADMIN_EMAILS") || "";
  const adminEmails = adminEmailsEnv
    .split(",")
    .map((email) => email.trim())
    .filter((email) => email.length > 0);

  return adminEmails.includes(userEmail);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!isAdmin(user.email, user.app_metadata)) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { requestId, action }: RequestBody = await req.json();

    if (!requestId || !action || !["approve", "reject"].includes(action)) {
      throw new Error("Invalid request body");
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { data: request, error: fetchError } = await adminClient
      .from("instructor_requests")
      .select("user_id, status")
      .eq("id", requestId)
      .single();

    if (fetchError || !request) {
      throw new Error("Instructor request not found");
    }

    if (request.status !== "pending") {
      throw new Error("Request has already been processed");
    }

    if (action === "approve") {
      const { error: updateUserError } = await adminClient.auth.admin.updateUserById(
        request.user_id,
        {
          app_metadata: { role: "instructor" },
        }
      );

      if (updateUserError) {
        throw new Error(`Failed to update user: ${updateUserError.message}`);
      }
    }

    const { error: updateRequestError } = await adminClient
      .from("instructor_requests")
      .update({
        status: action === "approve" ? "approved" : "rejected",
        decision_by_admin_id: user.id,
        decision_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (updateRequestError) {
      throw new Error(`Failed to update request: ${updateRequestError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Request ${action}d successfully`,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
