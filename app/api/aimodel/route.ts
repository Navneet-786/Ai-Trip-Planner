

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { aj } from "../arcjet/route";
import { useUser } from "@clerk/nextjs";
import { useUserDetail } from "@/app/Provider";
import { auth } from "@clerk/nextjs/server";



//  Allow countries directly 
const COUNTRIES = new Set([
  "afghanistan",
  "albania",
  "algeria",
  "andorra",
  "angola",
  "antigua and barbuda",
  "argentina",
  "armenia",
  "australia",
  "austria",
  "azerbaijan",

  "bahamas",
  "bahrain",
  "bangladesh",
  "barbados",
  "belarus",
  "belgium",
  "belize",
  "benin",
  "bhutan",
  "bolivia",
  "bosnia and herzegovina",
  "botswana",
  "brazil",
  "brunei",
  "bulgaria",
  "burkina faso",
  "burundi",

  "cambodia",
  "cameroon",
  "canada",
  "cape verde",
  "central african republic",
  "chad",
  "chile",
  "china",
  "colombia",
  "comoros",
  "congo",
  "costa rica",
  "croatia",
  "cuba",
  "cyprus",
  "czech republic",

  "denmark",
  "djibouti",
  "dominica",
  "dominican republic",

  "ecuador",
  "egypt",
  "el salvador",
  "equatorial guinea",
  "eritrea",
  "estonia",
  "eswatini",
  "ethiopia",

  "fiji",
  "finland",
  "france",

  "gabon",
  "gambia",
  "georgia",
  "germany",
  "ghana",
  "greece",
  "grenada",
  "guatemala",
  "guinea",
  "guinea-bissau",
  "guyana",

  "haiti",
  "honduras",
  "hungary",

  "iceland",
  "india",
  "indonesia",
  "iran",
  "iraq",
  "ireland",
  "israel",
  "italy",

  "jamaica",
  "japan",
  "jordan",

  "kazakhstan",
  "kenya",
  "kiribati",
  "kuwait",
  "kyrgyzstan",

  "laos",
  "latvia",
  "lebanon",
  "lesotho",
  "liberia",
  "libya",
  "liechtenstein",
  "lithuania",
  "luxembourg",

  "madagascar",
  "malawi",
  "malaysia",
  "maldives",
  "mali",
  "malta",
  "marshall islands",
  "mauritania",
  "mauritius",
  "mexico",
  "micronesia",
  "moldova",
  "monaco",
  "mongolia",
  "montenegro",
  "morocco",
  "mozambique",
  "myanmar",

  "namibia",
  "nauru",
  "nepal",
  "netherlands",
  "new zealand",
  "nicaragua",
  "niger",
  "nigeria",
  "north korea",
  "north macedonia",
  "norway",

  "oman",

  "pakistan",
  "palau",
  "panama",
  "papua new guinea",
  "paraguay",
  "peru",
  "philippines",
  "poland",
  "portugal",

  "qatar",

  "romania",
  "russia",
  "rwanda",

  "saint kitts and nevis",
  "saint lucia",
  "saint vincent and the grenadines",
  "samoa",
  "san marino",
  "sao tome and principe",
  "saudi arabia",
  "senegal",
  "serbia",
  "seychelles",
  "sierra leone",
  "singapore",
  "slovakia",
  "slovenia",
  "solomon islands",
  "somalia",
  "south africa",
  "south korea",
  "south sudan",
  "spain",
  "sri lanka",
  "sudan",
  "suriname",
  "sweden",
  "switzerland",
  "syria",

  "taiwan",
  "tajikistan",
  "tanzania",
  "thailand",
  "timor-leste",
  "togo",
  "tonga",
  "trinidad and tobago",
  "tunisia",
  "turkey",
  "turkmenistan",
  "tuvalu",

  "uganda",
  "ukraine",
  "united arab emirates",
  "united kingdom",
  "uk",
  "united states",
  "usa",
  "uruguay",
  "uzbekistan",

  "vanuatu",
  "vatican city",
  "venezuela",
  "vietnam",

  "yemen",

  "zambia",
  "zimbabwe"
]);



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
  if (step === "groupSize") return ["solo","just me", "couple", "family", "friends"].some(v => val.includes(v));
  if (step === "budget") return ["low", "medium", "high", "cheap", "moderate", "luxury"].some(v => val.includes(v));
  return true;
}


async function isValidPlaceAI(place: string): Promise<boolean> {
  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Answer strictly with yes or no. No punctuation.",
        },
        {
          role: "user",
          content: `Is "${place}" a real city or country name?`,
        },
      ],
      temperature: 0,
    });

    const reply =
      completion.choices[0]?.message?.content
        ?.toLowerCase()
        .trim();

    return reply?.startsWith("yes") ?? false;
  } catch {
    return false;
  }
}



function isValidTripDuration(answer: string): boolean {
  if (!answer) return false;

  const val = answer.toLowerCase().trim();

  // number nikaal lo ( "5 days" → 5 )
  const match = val.match(/\d+/);
  if (!match) return false;

  const days = Number(match[0]);

  if (Number.isNaN(days)) return false;
  if (days < 1 || days > 30) return false; // safe limit

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
    
  

//   if (!isFinal && step !== "final") {
//   // validate answer
//     if (step!="source" && !isValidAnswer(step, answer)) {
//       return NextResponse.json({
//         resp: `Sorry  I didn't quite get that.\n\n${getFallbackQuestion(step)}`,
//         ui: step,
//         collected: newCollected, // same data, no change
//       });
//   }

//   // only store if valid
//   newCollected[step] = answer;

//   const nextStep = NEXT_STEP[step as Step];

//   return NextResponse.json({
//     resp: getFallbackQuestion(nextStep),
//     ui: nextStep,
//     collected: newCollected,
//   });
// }

if (!isFinal && step !== "final") {

  // SOURCE ke liye koi validation nahi
  if (step !== "source") {

    // 🔥 DESTINATION special validation
   if (step === "destination") {
      const value = answer.trim().toLowerCase();

      // ✅ Country → directly allow
      if (!COUNTRIES.has(value)) {
        // 🔍 City → AI validation
        const isRealCity = await isValidPlaceAI(answer);

        if (!isRealCity) {
          return NextResponse.json({
            resp: "Please enter a valid city or country name (e.g. Paris, Tokyo, India).",
            ui: "destination",
            collected: newCollected,
          });
        }
      }

    }
    else if (step === "tripDuration") {
      if (!isValidTripDuration(answer)) {
        return NextResponse.json({
          resp: "Please enter a valid trip duration (e.g. 3 days, 5, 7 days). Max 30 days allowed.",
          ui: "tripDuration",
          collected: newCollected,
        });
      }
    }

    // 🔹 baaki steps norma l validation
    else if (!isValidAnswer(step, answer)) {
      return NextResponse.json({
        resp: `Sorry I didn't quite get that.\n\n${getFallbackQuestion(step)}`,
        ui: step,
        collected: newCollected,
      });
    }
  }

  // ✅ validation pass → store answer
  newCollected[step] = answer;

  const nextStep = NEXT_STEP[step];

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
