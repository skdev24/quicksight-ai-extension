import { useEffect, useState, useRef } from "react";
import { twMerge } from "tailwind-merge";
import crossBlack from "@root/src/assets/img/cross-black.svg";
import useStorage from "@src/shared/hooks/useStorage";
import toggleStorage from "@src/shared/storages/toggleStorage";
import extensionStorage from "@root/src/shared/storages/extensionStorage";
import { v4 as uuidv4 } from "uuid";
import { getHighlightedTextSummary } from "@root/src/api/ai";
import Message from "@root/src/components/message";
import SummaryContent from "@root/src/components/summary-content";

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
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [aiSummaryData, setAiSummaryData] = useState("");

  const tooltipRef = useRef(null);
  const isDragging = useRef(null);
  const selectedTextRef = useRef(null);
  const positionRef = useRef(null);
  const offsetX = useRef(0);
  const offsetY = useRef(0);

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
    // if (isDragging) return;
    const onMouseUp = (event) => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      let currentPosition = positionRef.current;

      if (
        currentPosition &&
        selectedText.length > 0 &&
        selectedTextRef.current !== selectedText
      ) {
        currentPosition = null;
      }

      if (selectedText?.length > 0 && !currentPosition) {
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
  }, []);

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
    if (
      selectedText &&
      contentData.isExtensionEnabled &&
      !isLoading &&
      !aiSummaryData &&
      !isOverLimit
    ) {
      (async () => {
        try {
          setIsLoading(true);
          const response = await getHighlightedTextSummary(selectedText);

          if (response?.summary) {
            const formattedSummary = response.summary.replace(/\n/g, "<br>");
            setAiSummaryData(formattedSummary);
          } else {
            setApiError("Something went wrong");
          }
          setIsLoading(false);
        } catch (error) {
          console.log("API ERROR", error);
          setApiError("Something went wrong");
          setIsLoading(false);
        }
      })();
    }
  }, [selectedText, contentData, isLoading, aiSummaryData, isOverLimit]);

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const tooltipStyle = twMerge(
    "absolute p-4 w-[400px] rounded-md shadow-md !z-[9999] rounded-md border-2 border-lime-400",
    `top-[${position?.top}px] left-[${position?.left}px]`,
    "bg-noble-700 text-white"
  );

  const reset = () => {
    selectedTextRef.current = null;
    positionRef.current = null;
    setPosition(null);
    setSelectedText("");
    setAiSummaryData("");
    setApiError("");
    setIsLoading(false);
  };

  function handleMouseDown(e) {
    isDragging.current = true;

    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      offsetX.current = e.clientX - rect.left;
      offsetY.current = e.clientY - rect.top;

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
  }

  function handleMouseMove(e) {
    e.stopPropagation();
    e.preventDefault();

    if (isDragging.current) {
      const top = e.clientY + window.scrollY - offsetY.current;
      const left = e.clientX + window.scrollX - offsetX.current;

      setPosition({ top, left });
    }
  }

  function handleMouseUp() {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }

  return selectedText.length > 0 ? (
    <div
      ref={tooltipRef}
      className={tooltipStyle}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center justify-center mb-2">
        <h1 className="text-lg font-medium">QuickSight AI</h1>
      </div>

      <div className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 flex items-center justify-center">
        <button
          className="text-[16px] text-black font-medium leading-none"
          onClick={reset}
        >
          <img
            src={chrome.runtime.getURL(crossBlack)}
            className="w-4 h-4"
            alt=""
          />
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

      {(!contentData.isExtensionEnabled || apiError || isLoading) && (
        <Message
          isLoading={isLoading}
          error={apiError || "Extension is disabled"}
          isApiError={!!apiError}
        />
      )}

      {!isOverLimit &&
        contentData.isExtensionEnabled &&
        aiSummaryData &&
        !isLoading && (
          <SummaryContent
            {...{
              aiSummaryData,
              contentData,
              selectedTag,
              setSelectedTag,
              onAddSummary: () => {
                extensionStorage.update(
                  "highlightsWithSummary",
                  [
                    ...contentData.highlightsWithSummary,
                    {
                      id: uuidv4() as string,
                      highlightedText: selectedText,
                      url: window.location.href,
                      date: new Date().toISOString(),
                      tags: [selectedTag || "none"],
                      summary: aiSummaryData,
                    },
                  ],
                  {
                    tags: contentData.tags,
                    highlightsWithSummary: contentData.highlightsWithSummary,
                  }
                );
                reset();
              },
            }}
          />
        )}
    </div>
  ) : null;
}
