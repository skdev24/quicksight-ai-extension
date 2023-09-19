import React from "react";
import { twMerge } from "tailwind-merge";
import cross from "@root/src/assets/img/cross.svg";

export default function Tags({
  tags,
  selectedTag,
  setSelectedTag,
  onDeleteTagPress,
  setModalVisible,
}: {
  tags: string[];
  selectedTag: string;
  onDeleteTagPress: (tag: string) => void;
  setSelectedTag: React.Dispatch<React.SetStateAction<string>>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex flex-row justify-start my-2">
      <span className="text-xs font-medium text-noble-400 mr-2 mt-2">
        Tags:{" "}
      </span>
      <div className="flex flex-row items-center flex-wrap mr-1">
        {[...(tags?.length ? ["All"] : []), ...(tags || []), "+ ADD"].map(
          (tag) => (
            <div
              key={tag}
              className={twMerge(
                "mt-2 rounded-[12px] bg-gradient-to-r from-[#A6B0F229] to-[#D7EDED29] text-noble-300 pb-[2px] mr-1 cursor-pointer px-3 justify-center items-center flex h-6",
                selectedTag === tag && "text-green-600 border border-green-600",
                tag === "+ ADD" &&
                  "bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 text-noble-500"
              )}
              onClick={() => {
                if (tag === "+ ADD") {
                  setModalVisible((prev) => !prev);
                  return;
                }
                if (!tags.includes(tag) && tag !== "All") return;

                setSelectedTag(tag);
              }}
            >
              <span className="text-[8px] leading-none font-extrabold uppercase">
                {tag}
              </span>
              {tag !== "+ ADD" && tag !== "All" && (
                <button
                  className="h-3 w-3 justify-center items-center ml-1 flex"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDeleteTagPress(tag);
                  }}
                >
                  <img
                    src={chrome.runtime.getURL(cross)}
                    className="h-3 w-3"
                    alt=""
                  />
                </button>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
