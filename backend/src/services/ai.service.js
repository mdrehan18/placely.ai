export const generateMockRoadmap = async (goal, duration) => {
  // Simulate AI delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const plan = [];
  const durationLower = duration.toLowerCase();

  if (durationLower.includes('1 month') || durationLower.includes('week')) {
    // Fast-paced plan: 28 days, multiple topics per day
    const totalDays = 28;
    for (let i = 1; i <= totalDays; i++) {
      plan.push({
        day: i,
        title: `Core Concept & Practice Phase ${Math.ceil(i/7)}`,
        tasks: [
          { title: `Learn Theory Topic ${i}A`, completed: false },
          { title: `Solve 3 Easy Problems on Topic ${i}A`, completed: false },
          { title: `Learn Theory Topic ${i}B`, completed: false },
          { title: `Solve 2 Medium Problems on Topic ${i}B`, completed: false },
        ],
        completed: false
      });
    }
  } else {
    // Slower-paced plan (3 months): 84 days, 1 topic per day, includes revision
    const totalDays = 84;
    for (let i = 1; i <= totalDays; i++) {
      if (i % 7 === 0) {
        // Revision day every 7th day
        plan.push({
          day: i,
          title: `Weekly Revision & Assessment`,
          tasks: [
            { title: `Review notes from Day ${i-6} to ${i-1}`, completed: false },
            { title: `Take a 1-hour mock test on previous topics`, completed: false },
          ],
          completed: false
        });
      } else {
        // Normal deeper learning day
        plan.push({
          day: i,
          title: `Deep Dive: Topic ${i}`,
          tasks: [
            { title: `In-depth theory and edge cases for Topic ${i}`, completed: false },
            { title: `Solve 1 Easy and 1 Medium Problem`, completed: false },
          ],
          completed: false
        });
      }
    }
  }

  return plan;
};

export const analyzeMockResume = async (resumeText) => {
  const apiKey = process.env.GROQ_API_KEY;
  console.log("API KEY EXISTS:", !!apiKey);

  if (!apiKey) {
    console.warn("GROQ_API_KEY not found. Returning fallback message.");
    return {
      error: true,
      message: "AI analysis not available. Please add API key.",
      ats_score: 0,
      strengths: [],
      weaknesses: [],
      suggestions: [],
      missing_keywords: [],
      final_summary: "No API key provided."
    };
  }

  try {
    const prompt = `You are an expert ATS (Applicant Tracking System) and senior technical recruiter.
Analyze the following resume and provide a detailed evaluation.

Resume:
${resumeText.substring(0, 3000)}

Instructions:
- Be professional and precise
- Do not give generic answers
- Focus on real hiring standards
- Return ONLY valid JSON

Output strictly in this JSON format (no markdown code blocks):
{
  "ats_score": number (0-100),
  "strengths": [list of strong points],
  "weaknesses": [list of issues],
  "suggestions": [specific improvements],
  "missing_keywords": [important keywords missing],
  "final_summary": "short professional summary"
}`;

    // Add a simple timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

    console.log("Calling Groq API...");
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }]
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Groq API error text: ${errText}`);
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content;
    console.log("API response received. Length:", content?.length || 0);

    if (!content) {
      throw new Error("Empty response from AI");
    }

    // Clean up potential markdown formatting from AI
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const parsedData = JSON.parse(content);
      // Validate structure to prevent frontend crashes
      return {
        ats_score: typeof parsedData.ats_score === 'number' ? parsedData.ats_score : 50,
        strengths: Array.isArray(parsedData.strengths) ? parsedData.strengths : [],
        weaknesses: Array.isArray(parsedData.weaknesses) ? parsedData.weaknesses : [],
        suggestions: Array.isArray(parsedData.suggestions) ? parsedData.suggestions : [],
        missing_keywords: Array.isArray(parsedData.missing_keywords) ? parsedData.missing_keywords : [],
        final_summary: typeof parsedData.final_summary === 'string' ? parsedData.final_summary : "Analysis completed."
      };
    } catch (parseError) {
      console.error("Failed to parse AI JSON response:", content);
      throw new Error("AI returned malformed JSON");
    }
  } catch (error) {
    console.error("Failed to analyze resume with AI:", error);
    return {
      error: true,
      message: error.name === 'AbortError' ? 'AI request timed out' : error.message,
      ats_score: 0,
      strengths: [],
      weaknesses: [],
      suggestions: [],
      missing_keywords: [],
      final_summary: "Analysis failed due to a server error."
    };
  }
};

export const processInterviewTurn = async (chatHistory, userAnswer) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return {
      feedback: "AI Interview Coach is in offline mode. (Missing API Key)",
      rating: 5,
      improvement: "Ensure GROQ_API_KEY is set in .env",
      next_question: "Can you tell me about your favorite programming language?"
    };
  }

  try {
    const prompt = `You are a professional software engineering interviewer. Your goal is to simulate a real interview experience.

Rules:
- Do NOT repeat questions
- Maintain a natural conversation
- Ask one question at a time
- Adjust difficulty based on user's answers
- Move through phases: 1. Introduction, 2. Behavioral, 3. Technical

After every user answer:
1. Give short feedback (2-3 lines)
2. Give a rating (1-10)
3. Suggest 1 improvement
4. Ask the next relevant question

Chat History:
${chatHistory.map(m => `${m.sender.toUpperCase()}: ${m.content}`).join('\n')}

User's Latest Answer:
"${userAnswer}"

Output format strictly JSON (no markdown):
{
  "feedback": "short evaluation",
  "rating": number,
  "improvement": "one clear suggestion",
  "next_question": "next interview question"
}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    if (!response.ok) throw new Error("Groq API error");

    const data = await response.json();
    let content = data.choices[0].message.content;
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(content);
  } catch (error) {
    console.error("Interview turn error:", error);
    return {
      feedback: "I noticed some connection issues, but let's continue.",
      rating: 0,
      improvement: "Check your network connection.",
      next_question: "Could you describe your experience with web development?"
    };
  }
};

export const generateFinalInterviewSummary = async (messages) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return {
      rating: 8,
      overallSummary: "Great practice session! (Mock Summary)",
      improvementSuggestions: "Keep practicing common coding patterns."
    };
  }

  try {
    const prompt = `You are a senior technical recruiter. Provide a final summary of this software engineering interview.
    
    Interview Transcript:
    ${messages.map(m => `${m.sender.toUpperCase()}: ${m.content}`).join('\n')}
    
    Output strictly JSON (no markdown):
    {
      "rating": number (1-10),
      "overallSummary": "comprehensive feedback on candidate performance",
      "improvementSuggestions": "key areas candidate should work on"
    }`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    let content = data.choices[0].message.content;
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(content);
  } catch (error) {
    console.error("Final summary error:", error);
    return {
      rating: 7,
      overallSummary: "You performed well, though we had some trouble generating the full report.",
      improvementSuggestions: "Review core CS fundamentals."
    };
  }
};

export const getNextInterviewQuestion = async (askedQuestions) => {
  // Use a simpler prompt just for the very first question if needed
  return "Could you start by introducing yourself and telling me about your background in software engineering?";
};

