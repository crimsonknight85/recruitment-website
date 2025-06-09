import { NextResponse } from 'next/server';

export async function POST(req) {
  const { resumeUrl, jobDescription } = await req.json();

  const prompt = `
You are a recruitment AI assistant.

Evaluate the candidate resume at this URL: ${resumeUrl}
for the following job:

${jobDescription}

Return ONLY valid JSON like this:
{
  "score": 83,
  "strengths": ["Strong React experience", "Tailwind CSS", "Portfolio website"],
  "concerns": ["No CMS experience", "Limited team projects"],
  "recommendation": "This candidate is a strong match for frontend roles. I recommend moving to interview, especially if CMS training is available."
}

DO NOT add explanation or wrap it in triple backticks.
Respond with only a raw JSON object, nothing more.
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  });

  const json = await response.json();
  console.log('[GPT RAW RESPONSE]', json);

  const content = json.choices?.[0]?.message?.content;

  let parsed = null;
  try {
    parsed = JSON.parse(content); // Expecting raw JSON only
  } catch (err) {
    parsed = {
      error: 'Invalid GPT response',
      raw: content || 'No response content received',
    };
  }

  return NextResponse.json({ result: parsed });
}
