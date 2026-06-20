import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const LANGUAGE_FENCE: Record<string, string> = {
  python: 'python',
  javascript: 'js',
  java: 'java',
  cpp: 'cpp',
}

const BASE_PROMPT = `You are Telery, a programming tutor. Keep responses concise — 3 sentences max unless explaining a concept.`

const MODE_PROMPTS: Record<string, string> = {
  Socratic: `Use the Socratic method: guide students to discover answers themselves. Ask one focused question per response that nudges toward the next insight. Never give solutions directly. Acknowledge what they got right before pointing to what needs work. If they ask "just tell me the answer", redirect: "What have you tried so far?"`,
  Hint: `Give a single specific hint — one sentence that nudges in the right direction without revealing the solution. If their approach is fundamentally wrong, say so briefly and point to the right data structure or algorithm concept.`,
  Review: `Review the student's code. Point out correctness issues, edge cases they may have missed, and one concrete improvement. Be specific: name the line or pattern that's problematic. Don't rewrite their code — describe what to change.`,
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function getAIResponse(
  history: Message[],
  problemTitle: string,
  problemDescription: string,
  currentCode: string,
  mode: string = 'Socratic',
  language: string = 'python',
): Promise<string> {
  const fence = LANGUAGE_FENCE[language] ?? language
  const modeInstructions = MODE_PROMPTS[mode] ?? MODE_PROMPTS.Socratic

  const systemPrompt = `${BASE_PROMPT}\n\n${modeInstructions}\n\nAdjust depth to the student's apparent level based on how they write.`

  const contextBlock = `Problem: ${problemTitle}\n\nDescription:\n${problemDescription}\n\nStudent's current code (${language}):\n\`\`\`${fence}\n${currentCode || '// (empty)'}\n\`\`\``

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'system', content: contextBlock },
      ...history,
    ],
    temperature: 0.7,
    max_tokens: 400,
  })

  return response.choices[0].message.content ?? ''
}
