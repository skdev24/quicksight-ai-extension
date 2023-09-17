import { useEffect, useState, useRef } from "react";
import { twMerge } from "tailwind-merge";
import cross from "@root/src/assets/img/cross.svg";
import useStorage from "@src/shared/hooks/useStorage";
import toggleStorage from "@src/shared/storages/toggleStorage";
import extensionStorage from "@root/src/shared/storages/extensionStorage";
import { v4 as uuidv4 } from "uuid";

const charLimit = 3000;

export default function App() {
  const toggle = useStorage(toggleStorage);
  const store = useStorage(extensionStorage);

  const [selectedText, setSelectedText] = useState("");
  const [position, setPosition] = useState(null);
  const [isOverLimit, setIsOverLimit] = useState(false);
  const [contentData, setContentData] = useState({
    tags: store.tags,
    isExtensionEnabled: toggle["extension-enabled"],
    highlightsWithSummary: store.highlightsWithSummary,
  });
  const [selectedTag, setSelectedTag] = useState("");

  const tooltipRef = useRef(null);
  const selectedTextRef = useRef(null);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request) => {
      if (request.action === "updateData") {
        // Update your local state or DOM here with request.newData
        setContentData(request.newData);
      }
    });
  }, []);

  // Keep track of mouseup event to capture position
  useEffect(() => {
    const onMouseUp = (event) => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();

      if (
        position &&
        selectedText.length > 0 &&
        selectedTextRef.current !== selectedText
      ) {
        setPosition(null);
      }

      if (selectedText?.length > 0 && !position) {
        let top = event.clientY + window.scrollY;
        const left = event.clientX + window.scrollX;
        setPosition({ top, left });

        // Force a re-render to update tooltipRef
        setTimeout(() => {
          const tooltipHeight = tooltipRef.current?.offsetHeight || 0;
          if (top + tooltipHeight > window.innerHeight) {
            top = top - tooltipHeight - 220;
            setPosition({ top, left });
          }
        }, 0);
      }
    };

    document.addEventListener("mouseup", onMouseUp);
    return () => document.removeEventListener("mouseup", onMouseUp);
  }, [position]);

  useEffect(() => {
    // Listen to messages from the background script
    const onMessage = (request) => {
      if (request.action === "getSummary") {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (
          selectedText.length > 0 &&
          selectedTextRef.current !== selectedText
        ) {
          setIsOverLimit(selectedText.length > charLimit);
          setSelectedText(selectedText.substring(0, charLimit));
          selectedTextRef.current = selectedText;
        }
      }
    };
    chrome.runtime.onMessage.addListener(onMessage);

    return () => chrome.runtime.onMessage.removeListener(onMessage);
  }, [position]);

  useEffect(() => {
    if (tooltipRef.current) {
      const tooltipHeight = tooltipRef.current.offsetHeight;
      if (position.top + tooltipHeight > window.innerHeight + window.scrollY) {
        setPosition((prev) => ({ ...prev, top: prev.top - tooltipHeight }));
      }
    }
  }, [position]);

  const tooltipStyle = twMerge(
    "absolute p-4 w-[400px] rounded-md shadow-md !z-[9999] rounded-md border-2 border-lime-400",
    `top-[${position?.top}px] left-[${position?.left}px]`,
    "bg-noble-700 text-white"
  );

  return selectedText.length > 0 ? (
    <div className={tooltipStyle} ref={tooltipRef}>
      <div className="flex items-center justify-center mb-2">
        <h1 className="text-lg font-medium">QuickSight AI</h1>
      </div>

      <div className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-green-400 flex items-center justify-center">
        <button
          className="text-[16px] text-black font-medium leading-none"
          onClick={() => {
            setPosition(null);
            setSelectedText("");
          }}
        >
          <img src={chrome.runtime.getURL(cross)} className="w-4 h-4" alt="" />
        </button>
      </div>
      <label
        htmlFor="message"
        className="mb-4 text-sm font-medium text-noble-300"
      >
        Selected Text
      </label>
      <div
        className={twMerge(
          "rounded-lg overflow-hidden border",
          isOverLimit ? "border-red-600" : "border-noble-500"
        )}
      >
        <span
          id="message"
          className="block p-2.5 w-full text-sm text-noble-200 h-16 overflow-y-auto custom-scroll bg-noble-600"
        >
          {selectedText}
        </span>
      </div>

      <div
        className={twMerge(
          "text-xs font-medium mt-1",
          isOverLimit ? "text-red-600" : "text-noble-300"
        )}
      >
        {isOverLimit
          ? "Text limit exceeded"
          : `Character count: ${selectedText.length}/${charLimit}`}
      </div>

      {!isOverLimit && (
        <div className="mt-4">
          <label
            htmlFor="message"
            className="text-sm font-medium text-noble-300"
          >
            Summary
          </label>
          <div className="rounded-lg overflow-hidden mt-1">
            <span
              id="message"
              className="block p-2.5 w-full text-sm text-noble-100 font-semibold max-h-72 overflow-y-auto custom-scroll bg-green-900/30"
            >
              {selectedText}
            </span>
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
                    selectedTag === tag &&
                      "text-green-600 border border-green-600"
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
            onClick={() => {
              extensionStorage.update("highlightsWithSummary", [
                ...contentData.highlightsWithSummary,
                {
                  id: uuidv4() as string,
                  highlightedText: selectedText,
                  url: window.location.href,
                  date: new Date().toISOString(),
                  tags: [selectedTag || "none"],
                  summary: selectedText,
                },
              ]);
              setPosition(null);
              setSelectedText("");
            }}
          >
            Save Summary
          </button>
        </div>
      )}
    </div>
  ) : null;
}
