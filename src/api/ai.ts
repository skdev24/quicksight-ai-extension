import QuickSightAPI from "./index";

export const getHighlightedTextSummary = async (highlightedText: string) => {
  try {
    const response = await QuickSightAPI.post("ai/summary", {
      highlightedText,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch user data: ${error}`);
  }
};
