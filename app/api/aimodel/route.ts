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

const prompt = `You are an AI Trip Planner Agent.
Your job is to collect trip details step-by-step by asking ONE question at a time in the following order:
1. Starting location (source)
2. Destination city or country
3. Group size (Solo, Couple, Family, Friends)
4. Budget (Low, Medium, High)
5. Trip duration (number of days)
6. Travel interests
7. Special requirements (optional)
Rules you MUST follow:
- Ask only ONE question at a time.
- Carefully evaluate the user's last response.
- If the user's answer is irrelevant, unclear, incomplete, or does not match the current question:
  - Politely repeat the SAME question.
  - Ask the user to clarify or give a valid answer.
  - Do NOT move to the next step.
- Only proceed to the next question when a valid answer is provided.
- Never ask multiple questions together.
- Maintain a polite, friendly, and conversational tone.
Response format rules (VERY IMPORTANT):
- Return ONLY valid JSON.
- Do NOT include explanations, markdown, or extra text.
- Follow this exact JSON schema:
{
  "resp": "Your response text to the user",
  "ui": "source/destination/groupSize/budget/tripDuration/interests/Final"
}
If all required information is collected, set "ui" to "Final" and generate the complete trip plan.
`;


export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const safeMessages = messages.filter(
      (m: any) => typeof m.content === "string" && m.content.trim() !== ""
    );

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        ...safeMessages,
      ],
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json({
        resp: "Where are you starting your trip from?",
        ui: "source",
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json({
        resp: content,
        ui: "source",
      });
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("AI ERROR:", error);
    return NextResponse.json(
      { resp: "AI error. Please try again.", ui: "source" },
      { status: 500 }
    );
  }
}
