import React from "react";
import { twMerge } from "tailwind-merge";
import { HighlightWithSummary } from "../shared/storages/extensionStorage";

export default function SummaryPage({
  summaryPageData,
  setSummaryPageData,
  onDeletion,
}: {
  summaryPageData: HighlightWithSummary;
  setSummaryPageData: React.Dispatch<
    React.SetStateAction<HighlightWithSummary | null>
  >;
  onDeletion: () => void;
}) {
  return (
    <div className="p-3 bg-noble-600">
      <div className="flex flex-row justify-between items-center mb-2">
        <button
          className="flex flex-row items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 rotate-180"
          onClick={() => {
            setSummaryPageData(null);
          }}
        >
          <svg
            className="w-3 h-3 text-gray-800"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 7h12m-6-6 6 6m0 0-6 6"
            />
          </svg>
        </button>
      </div>
      <div className="mb-2">
        <label htmlFor="message" className="text-sm font-medium text-noble-300">
          Title
        </label>
        <div className="rounded-lg overflow-hidden mt-1">
          <span
            id="message"
            className="w-full text-sm text-noble-100 font-semibold line-clamp-1"
          >
            {summaryPageData.highlightedText}
          </span>
        </div>
      </div>
      <label htmlFor="message" className="text-sm font-medium text-noble-300">
        Summary
      </label>
      <div className="rounded-lg overflow-hidden mt-1">
        <span
          id="message"
          className="block p-2.5 w-full text-sm text-noble-100/70 font-medium custom-scroll bg-green-900/40 tracking-wide leading-1.5"
          dangerouslySetInnerHTML={{
            __html: summaryPageData.summary,
          }}
        ></span>
      </div>
      <div className="flex flex-row justify-start mb-2">
        <span className="text-xs font-medium text-noble-400 mr-2 mt-2">
          Tags:{" "}
        </span>
        <div className="flex flex-row items-center flex-wrap mr-1">
          {summaryPageData?.tags.map((tag) => (
            <div
              key={tag}
              className={twMerge(
                "mt-2 rounded-[12px] bg-gradient-to-r from-[#A6B0F229] to-[#D7EDED29] text-noble-300 pb-[2px] mr-1 px-3 justify-center items-center flex h-6"
              )}
            >
              <span className="text-[8px] leading-none font-bold uppercase">
                {tag}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-between mt-4 w-full">
        <button
          type="button"
          className="text-gray-900 w-[46%] bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          onClick={() => {
            setSummaryPageData(null);
            chrome.tabs.create({
              url: summaryPageData.url,
            });
          }}
        >
          Visit Website
        </button>
        <button
          type="button"
          className="text-white bg-gradient-to-r w-[46%] from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          onClick={onDeletion}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
