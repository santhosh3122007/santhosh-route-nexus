
import { GoogleGenAI, Type } from "@google/genai";
import { AGENT_NAMES } from '../constants';
import type { AnalyzedTicketData } from '../types';
import { Category, Priority } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a mock service.");
}

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        category: {
            type: Type.STRING,
            description: 'The category of the support ticket.',
            enum: Object.values(Category),
        },
        priority: {
            type: Type.STRING,
            description: 'The priority level of the ticket.',
            enum: Object.values(Priority),
        },
        estimatedTime: {
            type: Type.STRING,
            description: 'A realistic estimated time for resolution, e.g., "2-4 hours", "1 business day".',
        },
        assignedAgent: {
            type: Type.STRING,
            description: `The name of the agent best suited to handle this ticket.`,
            enum: AGENT_NAMES,
        },
    },
    required: ['category', 'priority', 'estimatedTime', 'assignedAgent'],
};

const systemInstruction = `You are an expert AI for a customer support ticket routing system called RouteNexus. Your task is to analyze a user's issue description and classify it.
You must return a JSON object that matches the provided schema.
- Classify the issue into one of the following categories: ${Object.values(Category).join(', ')}.
- Determine the priority: ${Object.values(Priority).join(', ')}. High for critical issues like service outages or security concerns, Medium for functional problems, Low for general questions.
- Provide a realistic estimated resolution time.
- Assign the ticket to the most appropriate agent from this list: ${AGENT_NAMES.join(', ')}. Base the assignment on a logical (but fictional) specialization for each agent. For example, you can decide Alex is good with Billing, Maria with Technical issues, etc. Be consistent with your assignments.`;

export const analyzeTicket = async (description: string): Promise<AnalyzedTicketData> => {
    if (!ai) {
        // Mock response for development if API key is not available
        console.log("Using mock Gemini service.");
        await new Promise(res => setTimeout(res, 1500));
        const categories = Object.values(Category);
        const priorities = Object.values(Priority);
        return {
            category: categories[Math.floor(Math.random() * categories.length)],
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            estimatedTime: `${Math.floor(Math.random() * 5) + 1} hours`,
            assignedAgent: AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)],
        };
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following support ticket description: "${description}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
            },
        });

        const jsonStr = response.text.trim();
        const data = JSON.parse(jsonStr);
        
        // Basic validation
        if (!data.category || !data.priority || !data.assignedAgent || !data.estimatedTime) {
            throw new Error("Invalid response structure from AI.");
        }
        
        return data as AnalyzedTicketData;
    } catch (error) {
        console.error("Error analyzing ticket with Gemini API:", error);
        throw new Error("Failed to analyze the ticket. Please try again.");
    }
};
