import { NextResponse } from "next/server";
import { askGroqTutor, generateClinicalCase } from "../../lib/groq-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, query, history, organContext, tone, organName } = body;

    if (action === "case-study") {
      const caseData = await generateClinicalCase(organName || "heart");
      return NextResponse.json({ success: true, data: caseData });
    }

    const answer = await askGroqTutor(
      query || "Explain the function of this organ.",
      history || [],
      organContext,
      tone || "med-student"
    );

    return NextResponse.json({ success: true, answer });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process AI request" },
      { status: 500 }
    );
  }
}
