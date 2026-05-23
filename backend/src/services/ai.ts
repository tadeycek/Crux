import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `You are Crux, a Socratic programming tutor. Your job is to help students learn by guiding them to discover answers themselves — never give solutions directly.

Rules:
- Ask one focused question per response that nudges the student toward the next insight
- When the student shares code, identify the first conceptual gap and ask about it
- Never write working code for them; small illustrative snippets (2-3 lines) showing unrelated concepts are OK
- Acknowledge what they got right before pointing to what needs work
- If they ask "just tell me the answer", redirect: "What have you tried so far?"
- Keep responses concise — 3 sentences max unless the student needs a concept explained
- Adjust depth to their apparent level based on how they write and what they ask`

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function getAIResponse(
  history: Message[],
  problemTitle: string,
  problemDescription: string,
  currentCode: string,
): Promise<string> {
  const contextBlock = `Problem: ${problemTitle}\n\nDescription:\n${problemDescription}\n\nStudent's current code:\n\`\`\`python\n${currentCode || '# (empty)'}\n\`\`\``

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'system', content: contextBlock },
      ...history,
    ],
    temperature: 0.7,
    max_tokens: 400,
  })

  return response.choices[0].message.content ?? ''
}
