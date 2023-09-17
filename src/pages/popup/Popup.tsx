import useStorage from "@src/shared/hooks/useStorage";
import toggleStorage from "@src/shared/storages/toggleStorage";
import extensionStorage from "@root/src/shared/storages/extensionStorage";
import withSuspense from "@src/shared/hoc/withSuspense";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useForm } from "react-hook-form";
import cross from "@root/src/assets/img/cross.svg";

const Popup = () => {
  const toggle = useStorage(toggleStorage);
  const store = useStorage(extensionStorage);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [selectedTag, setSelectedTag] = useState("All");
  const [isModalVisible, setModalVisible] = useState(false);
  const [contentData, setContentData] = useState({
    tags: store.tags,
    isExtensionEnabled: toggle["extension-enabled"],
    highlightsWithSummary: store.highlightsWithSummary,
  });
  const [highlightScreenData, setHighlightScreenData] = useState(null);

  const highlightSummaryData = useMemo(
    () =>
      store.highlightsWithSummary.filter((highlight) => {
        if (selectedTag === "All") {
          return true;
        }

        return highlight.tags.includes(selectedTag);
      }),
    [selectedTag, store.highlightsWithSummary]
  );

  const onSubmit = (data) => {
    reset();
    setContentData((prev) => ({
      ...prev,
      tags: [...prev.tags, data.tag?.toLocaleLowerCase()],
    }));
    extensionStorage.update("tags", [
      ...store.tags,
      data.tag?.toLocaleLowerCase(),
    ]);
    setModalVisible((prev) => !prev);
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "updateData",
        newData: contentData,
      });
    });
  }, [contentData]);

  return (
    <div className="bg-noble-600 h-[550px]">
      <header className="flex flex-row justify-between items-center border-b border-b-[#FFFFFF14] p-3 bg-gradient-to-l from-[#ccebeb00] to-[#d7eded26]">
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center h-5 w-5 self-center mr-2">
            <img src="/icon-128.png" className="App-logo" alt="logo" />
          </div>
          <h1 className="text-base font-medium text-white bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
            QuickSight AI
          </h1>
        </div>

        <label className="relative cursor-pointer">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            checked={toggle["extension-enabled"]}
            onChange={() => {
              setContentData((prev) => ({
                ...prev,
                isExtensionEnabled: !prev.isExtensionEnabled,
              }));
              toggleStorage.change("extension-enabled");
            }}
          />
          <div className="w-11 h-6 rounded-full peer bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-lime-200 peer-checked:via-lime-400 peer-checked:to-lime-500"></div>
        </label>
      </header>
      <div>
        <div
          id="authentication-modal"
          tabIndex={-1}
          aria-hidden="true"
          className={twMerge(
            "fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50 transition-opacity",
            isModalVisible ? "block" : "hidden"
          )}
        >
          <div className="relative w-full max-w-md max-h-full p-4">
            <div className="relative rounded-lg shadow bg-[#1A1D21]">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white"
                data-modal-hide="authentication-modal"
                onClick={() => {
                  reset();
                  setModalVisible((prev) => !prev);
                }}
              >
                <svg
                  className="w-3 h-3"
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
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="px-6 py-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-white">
                  Create a new tag
                </h3>
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <label
                      htmlFor="tag"
                      className="block mb-2 text-sm font-medium text-white"
                    >
                      Tag
                    </label>
                    <input
                      name="tag"
                      id="tag"
                      className={twMerge(
                        "border text-sm rounded-lg block w-full p-2.5 bg-gray-600 placeholder-gray-400 text-white",
                        errors.tag
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-500 focus:ring-blue-500 focus:border-blue-500"
                      )}
                      placeholder="Science"
                      required
                      {...register("tag", {
                        required: true,
                        maxLength: 20,
                        minLength: 2,
                        validate: (value: string) =>
                          !store?.tags?.includes(value?.toLocaleLowerCase()) &&
                          !(value?.toLocaleLowerCase() === "all"),
                      })}
                    />
                    {errors.tag && (
                      <div className="mt-1">
                        <span className="text-red-500 text-xs">
                          {errors.tag.type === "required"
                            ? "Tag is required"
                            : errors.tag.type === "maxLength"
                            ? "Tag is too long"
                            : errors.tag.type === "minLength"
                            ? "Tag is too short"
                            : "Tag already exists"}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800"
                  >
                    Add Tag
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        {!highlightScreenData && (
          <div className="bg-noble-600 p-3">
            <span className="text-xm font-medium text-noble-300">
              Recent Highlights
            </span>
            <div className="flex flex-row justify-start my-2">
              <span className="text-xs font-medium text-noble-400 mr-2 mt-2">
                Tags:{" "}
              </span>
              <div className="flex flex-row items-center flex-wrap mr-1">
                {[
                  ...(store?.tags?.length ? ["All"] : []),
                  ...(store?.tags || []),
                  "+ ADD",
                ].map((tag) => (
                  <div
                    key={tag}
                    className={twMerge(
                      "mt-2 rounded-[12px] bg-gradient-to-r from-[#A6B0F229] to-[#D7EDED29] text-noble-300 pb-[2px] mr-1 cursor-pointer px-3 justify-center items-center flex h-6",
                      selectedTag === tag &&
                        "text-green-600 border border-green-600",
                      tag === "+ ADD" &&
                        "bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 text-noble-500"
                    )}
                    onClick={() => {
                      if (tag === "+ ADD") {
                        setModalVisible((prev) => !prev);
                        return;
                      }
                      if (!store.tags.includes(tag) && tag !== "All") return;

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
                          setContentData((prev) => ({
                            ...prev,
                            tags: prev.tags.filter((t) => t !== tag),
                          }));
                          setSelectedTag("All");
                          extensionStorage.update(
                            "tags",
                            store.tags.filter((t) => t !== tag)
                          );
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
                ))}
              </div>
            </div>
            <div className="flex flex-col mt-2">
              {highlightSummaryData.length === 0 && (
                <div className="flex flex-col justify-center items-center p-3 bg-noble-800 mb-3 rounded-lg h-32 w-full overflow-hidden cursor-pointer">
                  <img
                    src="/icon-128.png"
                    className="h-8 w-8 object-contain mb-4"
                  />
                  <span className="text-sm font-medium text-noble-300">
                    No highlights yet
                  </span>
                </div>
              )}
              {highlightSummaryData.map((highlight) => (
                <div
                  key={highlight.id}
                  className="flex flex-row justify-between items-center p-3 bg-noble-800 mb-3 rounded-lg h-20 w-full overflow-hidden cursor-pointer"
                  onClick={() => {
                    console.log(highlight);

                    setHighlightScreenData(highlight);
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
                          const updatedHighlights =
                            store.highlightsWithSummary.filter(
                              (h) => h.id !== highlight.id
                            );
                          setContentData((prev) => ({
                            ...prev,
                            highlightsWithSummary: updatedHighlights,
                          }));
                          extensionStorage.update(
                            "highlightsWithSummary",
                            updatedHighlights
                          );
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
              ))}
            </div>
          </div>
        )}
        {highlightScreenData && (
          <div className="p-3 bg-noble-600">
            {/* Back Button */}
            <div className="flex flex-row justify-between items-center mb-2">
              <button
                className="flex flex-row items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 rotate-180"
                onClick={() => {
                  setHighlightScreenData(null);
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
              <label
                htmlFor="message"
                className="text-sm font-medium text-noble-300"
              >
                Title
              </label>
              <div className="rounded-lg overflow-hidden mt-1">
                <span
                  id="message"
                  className="w-full text-sm text-noble-100 font-semibold line-clamp-1"
                >
                  {highlightScreenData.highlightedText}
                </span>
              </div>
            </div>
            <label
              htmlFor="message"
              className="text-sm font-medium text-noble-300"
            >
              Summary
            </label>
            <div className="rounded-lg overflow-hidden mt-1">
              <span
                id="message"
                className="block p-2.5 w-full text-sm text-noble-100/70 font-medium custom-scroll bg-green-900/40 tracking-wide leading-1.5"
              >
                {highlightScreenData.summary}
              </span>
            </div>
            <div className="flex flex-row justify-start mb-2">
              <span className="text-xs font-medium text-noble-400 mr-2 mt-2">
                Tags:{" "}
              </span>
              <div className="flex flex-row items-center flex-wrap mr-1">
                {highlightScreenData?.tags.map((tag) => (
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
            <div className="flex flex-row justify-between mt-4 w-full">
              <button
                type="button"
                className="text-gray-900 w-[46%] bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                onClick={() => {
                  setHighlightScreenData(null);
                  chrome.tabs.create({
                    url: highlightScreenData.url,
                  });
                }}
              >
                Visit Website
              </button>
              <button
                type="button"
                className="text-white bg-gradient-to-r w-[46%] from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                onClick={() => {
                  const updatedHighlights = store.highlightsWithSummary.filter(
                    (h) => h.id !== highlightScreenData.id
                  );
                  setContentData((prev) => ({
                    ...prev,
                    highlightsWithSummary: updatedHighlights,
                  }));
                  extensionStorage.update(
                    "highlightsWithSummary",
                    updatedHighlights
                  );
                  setHighlightScreenData(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withSuspense(Popup);
