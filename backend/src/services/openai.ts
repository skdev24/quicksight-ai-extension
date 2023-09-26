import OpenAIApi from "openai";

interface OpenAICompletion {
  prompt?: string;
  max_tokens?: number;
  messages?: {
    role: string;
    content: string;
  }[];
}

export default class OpenAIService {
  private apiKey: string;
  // private organization: string;
  private openai: OpenAIApi;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || "";

    this.openai = new OpenAIApi({
      apiKey: this.apiKey,
    });
  }

  public async getCompletion(completion: OpenAICompletion): Promise<{
    content: string;
    usage: OpenAIApi.Completions.CompletionUsage;
  }> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613", // text-davinci-003
        messages: completion?.messages,
        temperature: 0.5, // A higher value makes the output more random, a lower value makes it more deterministic.
        n: 1, // Generate one completion for each prompt.
        presence_penalty: 0.7, // Penalizes new tokens based on their presence in the text so far. A high value makes the model more likely to introduce new topics.
        frequency_penalty: 0.7, // Penalizes tokens based on their frequency in the text so far. A high value makes the model less likely to repeat itself.
        max_tokens: 200, // The maximum number of tokens to generate. Requests can use up to 2048 tokens shared between prompt and completion.
        top_p: 1,
      } as OpenAIApi.Chat.Completions.ChatCompletionCreateParamsNonStreaming);

      return {
        content: response.choices[0]?.message?.content,
        usage: response.usage,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
