const axios = require('axios');
const EmailHistory = require('../models/EmailHistory');

// Robust JSON extraction and parser
const parseAIResponse = (text) => {
    if (!text) return null;

    let clean = text.trim();
    // Strip markdown code fences if present
    clean = clean.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/g, '').trim();

    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        clean = clean.substring(firstBrace, lastBrace + 1);
    }

    try {
        return JSON.parse(clean);
    } catch (e) {
        // Clean up common JSON issues from LLMs (unescaped newlines inside strings)
        try {
            const sanitized = clean.replace(/("(?:\\.|[^"\\])*")/g, (match) => {
                return match.replace(/\r?\n/g, '\\n').replace(/\t/g, '\\t');
            });
            return JSON.parse(sanitized);
        } catch (err) {
            console.error('JSON parsing failed. Raw response was:', text);
            return null;
        }
    }
};

exports.generateEmail = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        if (typeof prompt !== 'string') {
            return res.status(400).json({ message: 'Prompt must be a string' });
        }

        if (prompt.trim().length === 0) {
            return res.status(400).json({ message: 'Prompt cannot be empty' });
        }

        if (prompt.length > 2000) {
            return res.status(400).json({ message: 'Prompt cannot exceed 2000 characters' });
        }

        const groqApiKey = process.env.GROQ_API_KEY;
        if (!groqApiKey) {
            return res.status(500).json({ message: 'AI service is not configured' });
        }

        const systemPrompt = `You are an expert cold email assistant.
Return ONLY a valid JSON object with exactly these 4 keys:
"subject", "emailBody", "linkedInDM", "followUpEmail"

Do NOT output any markdown, code blocks, backticks, or preamble. Return pure JSON only.`;

        const userPrompt = `Target job/role or company context: "${prompt.trim()}". Return the JSON object now.`;

        const aiResponse = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'openai/gpt-oss-20b',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 1024
            },
            {
                headers: {
                    'Authorization': `Bearer ${groqApiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        if (!aiResponse.data.choices || !aiResponse.data.choices[0] || !aiResponse.data.choices[0].message) {
            throw new Error('Invalid response from Groq API');
        }

        const generatedText = aiResponse.data.choices[0].message.content;
        const parsedResponse = parseAIResponse(generatedText);

        if (!parsedResponse) {
            return res.status(500).json({
                message: 'Failed to parse AI response',
                error: 'The AI generated invalid JSON. Please try again.'
            });
        }

        const emailData = {
            subject: parsedResponse.subject || "Exciting Opportunity Outreach",
            emailBody: parsedResponse.emailBody || "",
            linkedInDM: parsedResponse.linkedInDM || "",
            followUpEmail: parsedResponse.followUpEmail || ""
        };

        if (!emailData.subject || !emailData.emailBody) {
            return res.status(500).json({
                message: 'AI generated incomplete email data. Please try again.'
            });
        }

        // Save to history in MongoDB
        const historyEntry = await EmailHistory.create({
            userId: req.user._id,
            prompt: prompt.trim(),
            subject: emailData.subject,
            emailBody: emailData.emailBody,
            linkedInDM: emailData.linkedInDM,
            followUpEmail: emailData.followUpEmail
        });

        res.status(200).json(historyEntry);
    } catch (error) {
        console.error('AI Generation Error:', error.response?.data || error.message);

        if (error.response?.status === 429) {
            return res.status(429).json({
                message: 'Too many requests. Please wait a moment before trying again.',
                error: 'Rate limit exceeded'
            });
        }

        res.status(500).json({
            message: 'Failed to generate email',
            error: error.response?.data?.error?.message || error.message
        });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const history = await EmailHistory.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch history' });
    }
};
