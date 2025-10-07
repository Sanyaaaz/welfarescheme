import { NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(req: Request) {
  const { age, caste, description } = await req.json()
  const prompt = `
You are an assistant for an Indian government welfare portal under the PCR Act, 1955 and SC/ST PoA Act, 1989.
Given age: ${age}, caste: ${caste}, and situation: ${description}
- Suggest likely applicable schemes (Relief under PoA/PCR, Inter-caste Marriage Incentive).
- List basic eligibility checks (identity, case FIR, caste certificate).
- Keep it short (3-5 bullet points), plain language, avoid legal jargon.
`
  const { text } = await generateText({
    model: "openai/gpt-5-mini",
    prompt,
  })
  return NextResponse.json({ result: text })
}
