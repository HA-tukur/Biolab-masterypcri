import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  message: string;
  conversationHistory: Array<{ role: string; content: string }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    console.log("=== AI Assistant Debug ===");
    console.log("API Key exists:", !!apiKey);
    console.log("API Key length:", apiKey?.length || 0);
    console.log("API Key prefix:", apiKey?.substring(0, 10) || "N/A");

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      console.error("ERROR: GEMINI_API_KEY is not set or is placeholder value");
      throw new Error("Gemini API key not configured");
    }

    const { message, conversationHistory }: RequestBody = await req.json();
    console.log("Received message:", message.substring(0, 50));

    const systemPrompt = `You are an AI Lab Assistant for a molecular biology simulation application called BioSim. You help students understand PCR (Polymerase Chain Reaction), primer design, gel electrophoresis, and other molecular biology techniques.

You should:
- Explain concepts clearly and concisely
- Help students understand why their experiments succeed or fail
- Provide guidance on primer design and validation
- Explain PCR conditions and their effects
- Be encouraging and educational
- Use scientific terminology but explain it when needed

Keep responses conversational and helpful, like a friendly lab instructor.`;

    const conversationText = conversationHistory
      .slice(-10)
      .map((msg) => `${msg.role === "user" ? "Student" : "Assistant"}: ${msg.content}`)
      .join("\n");

    const prompt = `${systemPrompt}\n\nConversation History:\n${conversationText}\n\nStudent: ${message}\n\nAssistant:`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    console.log("Calling Gemini API...");

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    console.log("Gemini API response status:", response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error("=== GEMINI API ERROR ===");
      console.error("Status:", response.status);
      console.error("Status Text:", response.statusText);
      console.error("Error Body:", errorData);
      console.error("========================");
      throw new Error(`Gemini API error ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    console.log("Response data structure:", JSON.stringify(data).substring(0, 200));

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble generating a response. Please try again.";
    console.log("Extracted text length:", text.length);

    return new Response(
      JSON.stringify({ response: text }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("=== FUNCTION ERROR ===");
    console.error("Error type:", error?.constructor?.name);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
    console.error("======================");

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        response: "I'm having trouble connecting right now. Please try again in a moment.",
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
