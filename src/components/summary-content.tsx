import React from "react";
import { twMerge } from "tailwind-merge";

export default function SummaryContent({
  onAddSummary,
  aiSummaryData,
  contentData,
  selectedTag,
  setSelectedTag,
}: {
  onAddSummary: () => void;
  aiSummaryData: string;
  contentData: {
    tags: string[];
  };
  selectedTag: string;
  setSelectedTag: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="mt-4">
      <label htmlFor="message" className="text-sm font-medium text-noble-300">
        Summary
      </label>
      <div className="rounded-lg overflow-hidden mt-1">
        <span
          id="message"
          className="block p-2.5 w-full text-sm text-noble-100 font-semibold max-h-72 overflow-y-auto custom-scroll bg-green-900/30"
          dangerouslySetInnerHTML={{ __html: aiSummaryData }}
        ></span>
      </div>
      <div className="flex flex-row justify-start mb-2">
        <span className="text-xs font-medium text-noble-400 mr-2 mt-2">
          Tags:{" "}
        </span>
        <div className="flex flex-row items-center flex-wrap mr-1">
          {contentData?.tags.map((tag) => (
            <div
              key={tag}
              className={twMerge(
                "mt-2 rounded-[12px] bg-gradient-to-r from-[#A6B0F229] to-[#D7EDED29] text-noble-300 pb-[2px] mr-1 cursor-pointer px-3 justify-center items-center flex h-6",
                selectedTag === tag && "text-green-600 border border-green-600"
              )}
              onClick={() => {
                setSelectedTag(tag);
              }}
            >
              <span className="text-[8px] leading-none font-bold uppercase">
                {tag}
              </span>
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="text-gray-900 mt-2 w-full bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={onAddSummary}
      >
        Save Summary
      </button>
    </div>
  );
}
