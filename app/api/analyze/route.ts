import OpenAI from "openai";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase.config";// Adjust based on your project setup
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Fetch tasks from Firestore
    const taskRef = collection(db, "user", user_id, "task");
    const snapshot = await getDocs(taskRef);

    const tasks = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        title: data.title,
        description: data.description,
        expectedTime: data.expectedTime ? data.expectedTime.toDate().toISOString() : "No Date",
        elapsedTime: data.elapsedTime || 0,
      };
    });

    // Format tasks for AI analysis
    const formattedTasks = tasks.map(task => `
      Task: ${task.title} - ${task.description}
      Expected Time: ${task.expectedTime}
      Elapsed Time: ${task.elapsedTime} seconds
    `).join("\n");

    // AI Prompt
    const prompt = `
      Here is a list of completed tasks with expected and actual times:
      ${formattedTasks}

      Analyze this and suggest how I can improve my time management. Identify any patterns where I take longer than expected and provide actionable advice.
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a time management expert." },
        { role: "user", content: prompt },
      ],
      max_tokens: 100,
    });

    return NextResponse.json({ analysis: response.choices[0].message.content });

  } catch (error) {
    console.error("Error generating analysis:", error);
    return NextResponse.json({ error: "Failed to generate analysis" }, { status: 500 });
  }
}
