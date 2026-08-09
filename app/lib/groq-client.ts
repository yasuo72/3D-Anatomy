const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const GROQ_KEY = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY || "";

export type TutorTone = "med-student" | "high-school" | "board-specialist";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ClinicalCase = {
  title: string;
  patientProfile: string;
  history: string;
  physicalExam: string;
  labResults: string;
  imaging: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const TONE_PROMPTS: Record<TutorTone, string> = {
  "high-school":
    "Explain concepts using clear, intuitive analogies accessible to high school biology students. Keep tone encouraging and educational.",
  "med-student":
    "Explain concepts at a 1st-year medical student level (USMLE Step 1 focus). Integrate anatomical terminology, histology cell types, and physiological pathways.",
  "board-specialist":
    "Explain at an attending physician & clinical board specialist level. Focus on differential diagnosis, pathophysiology, surgical anatomy, and pharmacological targets.",
};

export async function askGroqTutor(
  userQuery: string,
  history: ChatMessage[] = [],
  organContext?: { name: string; system: string; function: string; parts?: any[] },
  tone: TutorTone = "med-student"
): Promise<string> {
  const contextStr = organContext
    ? `Current Active Specimen: ${organContext.name} (${organContext.system} system). Function: ${organContext.function}. Key Structures: ${JSON.stringify(organContext.parts || [])}.`
    : "General Human Anatomy & Medical Research context.";

  const systemPrompt = `You are Dr. Rohit AI — an elite medical research professor and 3D anatomy tutor powered by Groq Llama 3.3 70B.
${TONE_PROMPTS[tone]}
Context: ${contextStr}

Format your answers with clean Markdown headings (###), bold text (**bold**), and structured bullet points (* item). Be concise, highly accurate, clinical, and engaging. Do NOT generate Python or programming code snippets unless the user explicitly asks for programming code.`;

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...history.slice(-6),
    { role: "user", content: userQuery },
  ];

  try {
    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Groq API Error (${res.status}): ${err}`);
    }

    const data: any = await res.json();
    return data.choices?.[0]?.message?.content || "No response received from Groq AI.";
  } catch (error: any) {
    console.error("Groq AI Call Error:", error);
    return `Dr. Rohit AI Assistant is currently operating offline. (${error.message || "Network Error"})`;
  }
}

export async function generateClinicalCase(organName: string): Promise<ClinicalCase> {
  const prompt = `Generate a realistic clinical vignette case study for a patient with pathology involving the ${organName}.
Respond ONLY with a single JSON object without markdown fences, in this exact format:
{
  "title": "Case Title",
  "patientProfile": "Age, sex, occupation",
  "history": "Chief complaint and history of present illness",
  "physicalExam": "Key physical examination findings",
  "labResults": "Relevant laboratory and biomarker values",
  "imaging": "Imaging findings (CT, MRI, Ultrasound, or X-ray)",
  "question": "What is the most likely diagnosis?",
  "options": ["Diagnosis A", "Diagnosis B", "Diagnosis C", "Diagnosis D"],
  "correctIndex": 0,
  "explanation": "Detailed physiological explanation of why the correct diagnosis is right and others are incorrect."
}`;

  try {
    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: "You are a clinical board examination author. Return raw valid JSON only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    const data: any = await res.json();
    const raw = data.choices?.[0]?.message?.content || "";
    const cleanJson = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson) as ClinicalCase;
  } catch {
    // High-quality fallback clinical case
    return {
      title: `${organName} Clinical Vignette`,
      patientProfile: "58-year-old male",
      history: `Presents to the emergency department with acute onset discomfort localized to the ${organName.toLowerCase()} region over 4 hours.`,
      physicalExam: "Vital signs: BP 145/90 mmHg, HR 98 BPM, RR 20/min, Temp 37.8°C.",
      labResults: "Elevated inflammatory markers and organ-specific enzyme elevation.",
      imaging: "Diagnostic imaging demonstrates focal tissue alterations and vascular changes.",
      question: "Which pathophysiological mechanism best accounts for this presentation?",
      options: ["Ischemic Hypoxia", "Autoimmune Inflammation", "Metabolic Accumulation", "Infectious Necrosis"],
      correctIndex: 0,
      explanation: "Acute ischemic hypoxia leads to rapid cell swelling, ATP depletion, and cellular dysfunction.",
    };
  }
}
