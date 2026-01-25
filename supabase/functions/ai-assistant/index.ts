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

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      console.error("GEMINI_API_KEY is not set or is placeholder value");
      throw new Error("Gemini API key not configured");
    }

    console.log("API Key found, length:", apiKey.length);

    const { message, conversationHistory }: RequestBody = await req.json();

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

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
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
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble generating a response. Please try again.";

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
    console.error("Error in ai-assistant function:", error);

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
