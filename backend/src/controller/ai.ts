import { Request, Response } from "express";
import OpenAIService from "../services/openai";

export const getSummaryByAi = async (req: Request, res: Response) => {
  try {
    const highlightedText = req.body?.highlightedText;

    if (!highlightedText) {
      return res
        .status(400)
        .json({ message: "Please provide highlighted text" });
    }

    const openAIService = new OpenAIService();
    const messages = [
      {
        role: "system",
        content: `You are a TextSummarizerAI. Your primary objective is to distill the essence of the provided text snippet, denoted as ${highlightedText}, into a crystal-clear and concise summary. This summary should capture only the most critical information and be free from any extraneous details. It may be formatted as bullet points for easier readability or as a single, succinct paragraph. Where necessary, structure the summary to include line breaks ('/n'). Use plain text format and avoid JSON or other data formats. If the prompt is unclear, invalid, or beyond the scope of your capabilities, promptly respond with an error string formatted as: '[CUSTOM_ERROR_MESSAGE]'. Adhere strictly to these guidelines to ensure the summary is of the highest quality possible.`,
      },
    ];

    const completion = await openAIService.getCompletion({
      messages,
    });

    return res.status(200).json({
      summary: completion.content,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
