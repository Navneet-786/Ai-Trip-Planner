// import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai"
// export const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPENROUTER_API_KEY,

// })


// const prompt = `You are an AI Trip Planner Agent. Your goal is to help the user plan a trip by asking one relevant trip-related question at a time.
// Only ask questions about the following details in order, and wait for the user’s answer before asking the next:
// 1. Starting location (source)
// 2. Destination city or country
// 3. Group size (Solo, Couple, Family, Friends)
// 4. Budget (Low, Medium, High)
// 5. Trip duration (number of days)
// 6. Travel interests (e.g., adventure, sightseeing, cultural, food, nightlife, relaxation)
// 7. Special requirements or preferences (if any)
// Do not ask multiple questions at once, and never ask irrelevant questions.
// If any answer is missing or unclear, politely ask the user to clarify before proceeding.
// Always maintain a conversational, interactive style while asking questions.
// Along with the response, also send which UI component to display for generative UI (for example: budget/groupSize/tripDuration/Final), where Final means AI generating the complete final output. Once all required information is collected, generate and return a strict JSON response only (no explanations or extra text) with the following JSON schema:
// {
//   "resp": "Text Resp",
//   "ui": "budget/groupSize/tripDuration/Final"
// }
// You are an AI Trip Planner Agent...
// (return strict JSON only)`;
// export async function POST(req:NextRequest){
//  try {
//    const {messages} = await req.json();
//    console.log("this is running")
//    const completion = await openai.chat.completions.create({
//     model: "openai/gpt-4o-mini",
//     response_format:{type: 'json_object'},
//     messages: [
//       {
//         role: "system",
//         content:prompt
//       },
//       ...messages
//     ],
//   })

//   const content = completion.choices[0]?.message?.content;

// if (!content || typeof content !== "string") {
//   return NextResponse.json({
//     resp: "Please tell me your starting location.",
//     ui: "source"
//   });
// }
//   console.log("this is msg", completion.choices[0].message)
//   const message  = completion.choices[0].message;
//   return NextResponse.json(JSON.parse(message.content??""))
//  } catch (error) {
//   return NextResponse.json({error})
//  }
// }

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// const prompt = `You are an AI Trip Planner Agent.
// Ask ONE question at a time.
// Return ONLY valid JSON like:
// {
//   "resp": "text",
//   "ui": "source/budget/groupSize/tripDuration/Final"
// }
// Do not add extra text.`;

// const prompt = `You are an AI Trip Planner Agent.
// Your job is to collect trip details step-by-step by asking ONE question at a time in the following order:
// 1. Starting location (source)
// 2. Destination city or country
// 3. Group size (Solo, Couple, Family, Friends)
// 4. Budget (Low, Medium, High)
// 5. Trip duration (number of days)
// 6. Travel interests
// 7. Special requirements (optional)
// Rules you MUST follow:
// - Ask only ONE question at a time.
// - Carefully evaluate the user's last response.
// - If the user's answer is irrelevant, unclear, incomplete, or does not match the current question:
//   - Politely repeat the SAME question.
//   - Ask the user to clarify or give a valid answer.
//   - Do NOT move to the next step.
// - Only proceed to the next question when a valid answer is provided.
// - Never ask multiple questions together.
// - Maintain a polite, friendly, and conversational tone.
// Response format rules (VERY IMPORTANT):
// - Return ONLY valid JSON.
// - Do NOT include explanations, markdown, or extra text.
// - Follow this exact JSON schema:
// {
//   "resp": "Your response text to the user",
//   "ui": "source/destination/groupSize/budget/tripDuration/interests/Final"
// }
// If all required information is collected, set "ui" to "final" and generate the complete trip plan.
// // `;
// const prompt = `You are an AI Trip Planner Agent. Your goal is to help the user plan a trip by **asking one relevant trip-related question at a time**.

//  Only ask questions about the following details in order, and wait for the user’s answer before asking the next: 
// 1. Starting location (source) 
// 2. Destination city or country 
// 3. Group size (Solo, Couple, Family, Friends) 
// 4. Budget (Low, Medium, High) 
// 5. Trip duration (number of days) 
// 6. Travel interests (e.g., adventure, sightseeing, cultural, food, nightlife, relaxation) 
// 7. Special requirements or preferences (if any)
// Do not ask multiple questions at once, and never ask irrelevant questions.
// If any answer is missing or unclear, politely or irrelevant(STRICT) ask the user to clarify before proceeding.
// Always maintain a conversational, interactive style while asking questions.
// Along wth response also send which ui component to display for generative UI for example 'budget/groupSize/tripDuration/final) , where Final means AI generating complete final output
// Once all required information is collected, generate and return a **strict JSON response only** (no explanations or extra text) with following JSON schema:
// {
// resp:'Text Resp',
// ui:'budget/groupSize/tripDuration/final)'
// }
// `


// const prompt = `You are an AI Trip Planner Agent.
// You MUST follow these rules strictly:
// - Ask ONLY ONE question at a time
// - NEVER mention UI inside resp text
// - UI must be sent ONLY inside the "ui" field
// - Response MUST be valid JSON ONLY
// Trip steps order:
// 1. source
// 2. destination
// 3. groupSize
// 4. budget
// 5. tripDuration
// 6. interests
// 7. final
// JSON schema (STRICT):
// {
//   "resp": "text to show user",
//   "ui": "source|destination|groupSize|budget|tripDuration|interests|final"
// }
// `
// export async function POST(req: NextRequest) {
//   try {
//     const { messages } = await req.json();

  

//     const safeMessages = messages.filter(
//       (m: any) => typeof m.content === "string" && m.content.trim() !== ""
//     );

//     const completion = await openai.chat.completions.create({
//       model: "openai/gpt-4o-mini",
//       response_format: { type: "json_object" },
//       messages: [
//         { role: "system", content: prompt },
//         ...safeMessages,
//       ],
//       temperature: 0.3,
//     });

//     const content = completion.choices[0]?.message?.content;

//     if (!content) {
//       return NextResponse.json({
//         resp: "Where are you starting your trip from?",
//         ui: "source",
//       });
//     }

//     let parsed;
//     try {
//       parsed = JSON.parse(content);
//     } catch {
//       return NextResponse.json({
//         resp: content,
//         ui: "source",
//       });
//     }

//     return NextResponse.json(parsed);
//   } catch (error: any) {
//     console.error("AI ERROR:", error);
//     return NextResponse.json(
//       { resp: "AI error. Please try again.", ui: "source" },
//       { status: 500 }
//     );
//   }
// }




// import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPENROUTER_API_KEY,
// });


const FINAL_PROMPT = `Generate Travel Plan with give details, give me Hotels options list with HotelName, 
Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and  suggest itinerary with placeName, Place Details, Place Image Url,
 Geo Coordinates,Place address, ticket Pricing, Time travel each of the location , with each day plan with best time to visit in JSON format.
 Output Schema:
 {
  "trip_plan": {
    "destination": "string",
    "duration": "string",
    "origin": "string",
    "budget": "string",
    "group_size": "string",
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string",
        "hotel_image_url": "string",
        "geo_coordinates": {
          "latitude": "number",
          "longitude": "number"
        },
        "rating": "number",
        "description": "string"
      }
    ],
    "itinerary": [
      {
        "day": "number",
        "day_plan": "string",
        "best_time_to_visit_day": "string",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string",
            "geo_coordinates": {
              "latitude": "number",
              "longitude": "number"
            },
            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string"
          }
        ]
      }
    ]
}}`


type Step =
  | "source"
  | "destination"
  | "groupSize"
  | "budget"
  | "tripDuration"
  | "interests"
  | "final";

const NEXT_STEP: Record<Step, Step> = {
  source: "destination",
  destination: "groupSize",
  groupSize: "budget",
  budget: "tripDuration",
  tripDuration: "interests",
  interests: "final",
  final: "final",
};

function getFallbackQuestion(step: Step) {
  switch (step) {
    case "source":
      return "Where are you starting your trip from?";
    case "destination":
      return "Which city or country do you want to visit?";
    case "groupSize":
      return "Are you traveling solo, as a couple, with family, or friends?";
    case "budget":
      return "What is your budget? Low, Medium, or High?";
    case "tripDuration":
      return "How many days is your trip?";
    case "interests":
      return "What kind of trip do you prefer? Adventure, sightseeing, food, relaxation?";
    default:
      return "Please provide the required information.";
  }
}

function isValidAnswer(step: Step, answer: string) {
  if (!answer || answer.trim().length === 0) return false;
  const val = answer.trim().toLowerCase();
  if (step === "groupSize") return ["solo", "couple", "family", "friends"].some(v => val.includes(v));
  if (step === "budget") return ["low", "medium", "high","cheap", "moderate","luxury"].some(v => val.includes(v));
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const { step = "source", answer = "", isFinal = false, messages = [] } = await req.json();

    // Validate answer for intermediate steps
    if (!isFinal && !isValidAnswer(step, answer)) {
      return NextResponse.json({
        resp: getFallbackQuestion(step),
        ui: step,
      });
    }

    // Final step: generate full trip plan
    if (isFinal || step === "final") {
      // Map messages to GPT format
      const gptMessages = [
        { role: "system", content: FINAL_PROMPT },
        ...messages.map((m: any) => ({ role: m.role, content: m.content })),
      ];

      const completion = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: gptMessages,
        temperature: 0.3,
        response_format: { type: "json_object" }, // ensures JSON only
      });

      const aiResp = completion.choices[0]?.message?.content;

      if (!aiResp) {
        return NextResponse.json({ resp: "Failed to generate trip plan", ui: "final" });
      }

      let parsed;
      try {
        parsed = JSON.parse(aiResp); // strict JSON
      } catch {
        parsed = { resp: aiResp, ui: "final" };
      }

      return NextResponse.json(parsed);
    }

    // Intermediate steps: ask next question
    const nextStep = NEXT_STEP[step];
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: `Ask ONE simple question to collect the "${nextStep}". Only ask the question.` },
      ],
      temperature: 0.3,
    });

    const resp = completion.choices[0]?.message?.content ?? getFallbackQuestion(nextStep);

    return NextResponse.json({ resp, ui: nextStep });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ resp: "Something went wrong", ui: "source" }, { status: 500 });
  }
}

