

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { aj } from "../arcjet/route";
import { useUser } from "@clerk/nextjs";
import { useUserDetail } from "@/app/Provider";
import { auth } from "@clerk/nextjs/server";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

//defining step type
type Step =
  | "source"
  | "destination"
  | "groupSize"
  | "budget"
  | "tripDuration"
  | "interests"
  | "final";

type RequestBody = {
  step?: Step;
  answer?: string;
  isFinal?: boolean;
  collected?: Partial<Record<Step, string>>;
};


//define next steps after currentSteps
const NEXT_STEP: Record<Step, Step> = {
  source: "destination",
  destination: "groupSize",
  groupSize: "budget",
  budget: "tripDuration",
  tripDuration: "interests",
  interests: "final",
  final: "final",
};


//these are fallback question if needed then these question are asked
function getFallbackQuestion(step: Step) {
  switch (step) {
    case "source": return "Where are you starting your trip from?";
    case "destination": return "Which city or country do you want to visit?";
    case "groupSize": return "Are you traveling solo, as a couple, with family, or friends?";
    case "budget": return "What is your budget? Low, Medium, or High?";
    case "tripDuration": return "How many days is your trip?";
    case "interests": return "What kind of trip do you prefer? Adventure, sightseeing, food, relaxation?";
    default: return "Please provide the required information.";
  }
}

// CHANGE 1: Validate answer
function isValidAnswer(step: Step, answer: string) {
  if (!answer || answer.trim().length === 0) return false;
  const val = answer.trim().toLowerCase();
  if (step === "groupSize") return ["solo", "couple", "family", "friends"].some(v => val.includes(v));
  if (step === "budget") return ["low", "medium", "high", "cheap", "moderate", "luxury"].some(v => val.includes(v));
  return true;
}

export async function POST(req: NextRequest) {
  
  try {
    const body = (await req.json()) as RequestBody;
    const step: Step = body.step ?? "source";
    const answer = body.answer ?? "";
    const isFinal = body.isFinal ?? false;
    const collected =  body.collected ?? {};


    const data =await auth();
    const has = data?.has 
    const hasPremiumAccess1 = has({ plan: 'monthy' })
    const hasPremiumAccess2 = has({ plan: '6_months' })

    if (!data?.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
        );
    }


  const decision = await aj.protect(req, {
    userId:data?.userId ?? 'anonymous',
    requested: isFinal?5:0 
  });

// @ts-expect-error Arcjet runtime RATE_LIMIT reason
  if(decision?.reason?.remaining == 0 &&  !hasPremiumAccess1 && !hasPremiumAccess2){
      return NextResponse.json({
        resp: "No Free Credit Remaining , Upgrade Your Plan",
        ui: "limit"
      })
  }

  const newCollected = { ...collected };
    
  

  if (!isFinal && step !== "final") {
  // validate answer
    if (step!="source" && !isValidAnswer(step, answer)) {
      return NextResponse.json({
        resp: `Sorry  I didn't quite get that.\n\n${getFallbackQuestion(step)}`,
        ui: step,
        collected: newCollected, // same data, no change
      });
  }

  // only store if valid
  newCollected[step] = answer;

  const nextStep = NEXT_STEP[step as Step];

  return NextResponse.json({
    resp: getFallbackQuestion(nextStep),
    ui: nextStep,
    collected: newCollected,
  });
}

if(isFinal || step === "final") {
      // CHANGE 3: Check all required keys
  const requiredKeys:Step[] = ["source","destination","groupSize","budget","tripDuration","interests"];
    for(const key of requiredKeys){
      if(!newCollected[key]){
        return NextResponse.json({
          resp: `Missing answer for ${key}`,
          ui: step,
          collected: newCollected
        });
      }
    }

      const { source, destination, groupSize, budget, tripDuration, interests } = newCollected;

      // CHANGE 4: Full strict JSON schema prompt for AI
const finalPrompt = `
    You are a professional travel planner AI.
    Generate a complete trip plan ONLY using these details:
    Origin: ${source}
    Destination: ${destination}
    Group Size: ${groupSize}
    Budget: ${budget}
    Trip Duration: ${tripDuration}
    Travel Interests: ${interests}
    Return strictly JSON following this schema:
    {
      "trip_plan": {
        "destination": "${destination}",
        "duration": "${tripDuration}",
        Note: Generaate Trip Data for exactly ${tripDuration} days
        "origin": "${source}",
        "budget": "${budget}",
        "group_size": "${groupSize}",
        "hotels": [
          {
            "hotel_name": "string",
            "hotel_address": "string",
            "price_per_night": "string",
            "hotel_image_url": "string",
            "geo_coordinates": {"latitude": 0, "longitude": 0},
            "rating": 0,
            "description": "string"
          }
        ],
        "itinerary": [
          {
            "day": 1,
            "day_plan": "string",
            "best_time_to_visit_day": "string",
            "activities": [
              {
                "place_name": "string",
                "place_details": "string",
                "place_image_url": "string",
                "geo_coordinates": {"latitude": 0, "longitude": 0},
                "place_address": "string",
                "ticket_pricing": "string",
                "time_travel_each_location": "string",
                "best_time_to_visit": "string"
              }
            ]
          }
        ]
      }
    }
      make sure that atleast 4 to 5 hotels included and minimum 2 activities on each day 
`;

      // CHANGE 5: Call AI with GPT-4o-mini
const completion = await openai.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: [{ role: "system", content: finalPrompt }],
    temperature: 0.3,
    response_format: { type: "json_object" }, // ensures GPT returns JSON
});

const aiResp = completion.choices[0]?.message?.content;

if (!aiResp) {
  return NextResponse.json(
    { resp: "AI did not return any response", ui: "final" },
    { status: 500 }
    );
}
let parsed;
  try {
    parsed = JSON.parse(aiResp); 
      // CHANGE 6: Validate that AI returned correct schema
      if(!parsed.trip_plan) throw new Error("trip_plan missing in AI response");
      } catch {
        parsed = { resp: aiResp, ui: "final" };
      }

    return NextResponse.json(parsed);
    }

    // Non-final step
    const nextStep = NEXT_STEP[step];
    return NextResponse.json({
      resp: getFallbackQuestion(nextStep),
      ui: nextStep,
      collected: newCollected
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ resp: "Something went wrong", ui: "source" }, { status: 500 });
  }
}
