import React from "react";
import { HighlightWithSummary } from "../shared/storages/extensionStorage";
import dayjs from "dayjs";
import cross from "@root/src/assets/img/cross.svg";

export default function HighlightCard({
  highlight,
  setSummaryPageData,
  onDeleteHighlight,
}: {
  highlight: HighlightWithSummary;
  setSummaryPageData: React.Dispatch<
    React.SetStateAction<HighlightWithSummary | null>
  >;
  onDeleteHighlight: () => void;
}) {
  return (
    <div
      className="flex flex-row justify-between items-center p-3 bg-noble-800 mb-3 rounded-lg h-20 w-full overflow-hidden cursor-pointer"
      onClick={() => {
        setSummaryPageData(highlight);
      }}
    >
      <div className="flex flex-row items-start">
        <div className="flex-none h-8 w-8 bg-noble-600 rounded-xl flex items-center justify-center mr-2">
          <img
            src={`https://logo.clearbit.com/${highlight.url?.replace(
              /\/[^/]+$/,
              ""
            )}`}
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = "/icon-128.png";
            }}
            className="h-4 w-4 object-contain"
          />
        </div>
        <div>
          <span className="text-sm font-medium text-noble-200 line-clamp-2">
            {highlight.highlightedText}
          </span>
          <div className="flex flex-row items-center mt-1">
            <span className="text-xs font-medium text-noble-400 mr-2">
              {dayjs(highlight.date).format("DD MMM YYYY")}
            </span>
            <div className="flex flex-row items-center h-1 w-1 rounded-full bg-noble-400 mr-2" />
            <div className="flex flex-col">
              {highlight.tags.map((tag) => (
                <div
                  key={tag}
                  className="rounded-[12px] bg-gradient-to-r from-[#A6B0F229] to-[#D7EDED29] text-green-600 pb-[2px]"
                >
                  <span className="text-[8px] leading-none mx-3 my-1 font-bold uppercase">
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-16 flex items-center justify-center ml-1">
          <button
            className="h-3 w-3 justify-center items-center flex"
            onClick={(event) => {
              event.stopPropagation();
              onDeleteHighlight();
            }}
          >
            <img
              src={chrome.runtime.getURL(cross)}
              className="h-3 w-3"
              alt=""
            />
          </button>
        </div>
      </div>
    </div>
  );
}
