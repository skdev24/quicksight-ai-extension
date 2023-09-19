import { useEffect, useState, useRef } from "react";
import { twMerge } from "tailwind-merge";
import crossBlack from "@root/src/assets/img/cross-black.svg";
import useStorage from "@src/shared/hooks/useStorage";
import toggleStorage from "@src/shared/storages/toggleStorage";
import extensionStorage from "@root/src/shared/storages/extensionStorage";
import { v4 as uuidv4 } from "uuid";
import { getHighlightedTextSummary } from "@root/src/api/ai";

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
      let currentPosition = position;

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

          console.log("RESPONSE", response);

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

      <div className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 flex items-center justify-center">
        <button
          className="text-[16px] text-black font-medium leading-none"
          onClick={() => {
            setPosition(null);
            setSelectedText("");
            setAiSummaryData("");
            setApiError("");
            setIsLoading(false);
          }}
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
        <div className="flex flex-col justify-center items-center p-3 bg-noble-800 mb-3 rounded-lg h-32 w-full overflow-hidden cursor-pointer mt-3">
          {(!isLoading || apiError) && (
            <>
              <img
                src={chrome.runtime.getURL("/icon-128.png")}
                className="h-6 w-6 object-contain mb-2"
              />
              <span className="text-sm font-medium text-red-400">
                {apiError || "Extension is disabled"}
              </span>
            </>
          )}
          {isLoading && (
            <div role="status" className="flex flex-col items-center">
              <div className="my-2">
                <svg
                  aria-hidden="true"
                  className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
              <span
                className="text-sm font-medium text-noble-300 mb-2
            "
              >
                Ai is working on it...
              </span>
            </div>
          )}
        </div>
      )}

      {!isOverLimit &&
        contentData.isExtensionEnabled &&
        aiSummaryData &&
        !isLoading && (
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
                    summary: aiSummaryData,
                  },
                ]);
                setPosition(null);
                setAiSummaryData("");
                setApiError("");
                setIsLoading(false);
              }}
            >
              Save Summary
            </button>
          </div>
        )}
    </div>
  ) : null;
}
