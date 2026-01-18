import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch user's profile and dietary preferences
    const [profileResult, preferencesResult] = await Promise.all([
      supabaseClient.from("profiles").select("calorie_goal").eq("user_id", user.id).maybeSingle(),
      supabaseClient.from("dietary_preferences").select("preference, allergies").eq("user_id", user.id).maybeSingle(),
    ]);

    const calorieGoal = profileResult.data?.calorie_goal || 2000;
    const dietaryPreference = preferencesResult.data?.preference || "none";
    const allergies = preferencesResult.data?.allergies || [];

    const { mealType } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a nutrition expert that creates personalized meal recommendations. 
Always respond with valid JSON matching the exact schema requested.
Consider the user's calorie goals, dietary preferences, and allergies when creating meals.
Make meals practical, delicious, and nutritious.`;

    const userPrompt = `Generate a ${mealType || "complete daily"} meal plan for someone with:
- Daily calorie goal: ${calorieGoal} kcal
- Dietary preference: ${dietaryPreference}
- Allergies/restrictions: ${allergies.length > 0 ? allergies.join(", ") : "none"}

Create ${mealType ? "1 meal" : "4 meals"} (breakfast, lunch, dinner, snack if complete day).
Each meal should fit proportionally within the daily calorie goal.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_meal_plan",
              description: "Create a personalized meal plan with nutritional information",
              parameters: {
                type: "object",
                properties: {
                  meals: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["breakfast", "lunch", "dinner", "snack"] },
                        time: { type: "string", description: "Suggested time like 08:00 AM" },
                        title: { type: "string", description: "Name of the meal" },
                        ingredients: { type: "string", description: "Main ingredients, comma separated" },
                        calories: { type: "number", description: "Estimated calories" },
                        tag: { type: "string", description: "Diet tag like High Protein, Vegan, Keto Friendly, Low Carb, High Fiber" },
                        protein: { type: "number", description: "Grams of protein" },
                        carbs: { type: "number", description: "Grams of carbohydrates" },
                        fat: { type: "number", description: "Grams of fat" },
                      },
                      required: ["type", "time", "title", "ingredients", "calories", "tag", "protein", "carbs", "fat"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["meals"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_meal_plan" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate meals");
    }

    const aiResponse = await response.json();
    console.log("AI Response:", JSON.stringify(aiResponse));

    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in response");
    }

    const mealPlan = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(mealPlan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating meals:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to generate meals" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
