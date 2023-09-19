import useStorage from "@src/shared/hooks/useStorage";
import toggleStorage from "@src/shared/storages/toggleStorage";
import extensionStorage from "@root/src/shared/storages/extensionStorage";
import withSuspense from "@src/shared/hoc/withSuspense";
import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useForm } from "react-hook-form";
import SummaryPage from "@root/src/components/summary-page";
import Message from "@root/src/components/message";
import Tags from "@root/src/components/tags";
import HighlightCard from "@root/src/components/highlight-card";
import AddTagModal from "@root/src/components/add-tag";

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
  const [summaryPageData, setSummaryPageData] = useState(null);
  const [filterType, setFilterType] = useState<"none" | "new" | "old">("none");

  const highlightSummaryData = useMemo(
    () =>
      store.highlightsWithSummary
        .filter((highlight) => {
          if (selectedTag === "All") {
            return true;
          }

          return highlight.tags.includes(selectedTag);
        })
        .sort((a, b) => {
          if (filterType === "new") {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          } else if (filterType === "old") {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          }

          return 0;
        }),
    [selectedTag, store.highlightsWithSummary, filterType]
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
        <AddTagModal
          {...{
            isModalVisible,
            setModalVisible,
            reset,
            onSubmit,
            tags: store?.tags,
          }}
        />
        {!summaryPageData && (
          <div className="bg-noble-600 p-3">
            <div className="flex flex-row justify-between items-center">
              <span className="text-xm font-medium text-noble-300">
                Recent Highlights
              </span>
              <select
                id="countries"
                className="border text-xs rounded-lg block p-1 bg-noble-600 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                onChange={(event) => {
                  console.log("event.target.value", event.target.value);

                  setFilterType(event.target.value as "none" | "new" | "old");
                }}
              >
                <option selected value="none">
                  Filter by time
                </option>
                <option value="new">New to Old</option>
                <option value="old">Old to New</option>
              </select>
            </div>
            <Tags
              {...{
                tags: store.tags,
                selectedTag,
                onDeleteTagPress: (tag) => {
                  setContentData((prev) => ({
                    ...prev,
                    tags: prev.tags.filter((t) => t !== tag),
                  }));
                  setSelectedTag("All");
                  extensionStorage.update(
                    "tags",
                    store.tags.filter((t) => t !== tag)
                  );
                },
                setSelectedTag,
                setModalVisible,
              }}
            />
            <div className="flex flex-col mt-2">
              {highlightSummaryData.length === 0 && <Message isEmpty={true} />}
              {highlightSummaryData.map((highlight) => (
                <HighlightCard
                  key={highlight.id}
                  {...{
                    highlight,
                    setSummaryPageData,
                    onDeleteHighlight: () => {
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
                    },
                  }}
                />
              ))}
            </div>
          </div>
        )}
        {summaryPageData && (
          <SummaryPage
            summaryPageData={summaryPageData}
            setSummaryPageData={setSummaryPageData}
            onDeletion={() => {
              const updatedHighlights = store.highlightsWithSummary.filter(
                (h) => h.id !== summaryPageData.id
              );
              setContentData((prev) => ({
                ...prev,
                highlightsWithSummary: updatedHighlights,
              }));
              extensionStorage.update(
                "highlightsWithSummary",
                updatedHighlights
              );
              setSummaryPageData(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default withSuspense(Popup);
