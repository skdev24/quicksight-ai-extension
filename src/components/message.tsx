import React from "react";
import Loading from "./loading";

export default function Message({
  isEmpty,
  error,
  isLoading,
  isApiError,
}: {
  isEmpty?: boolean;
  error?: string;
  isLoading?: boolean;
  isApiError?: boolean;
}) {
  return (
    <div className="flex mt-2 flex-col justify-center items-center p-3 bg-noble-800 mb-3 rounded-lg h-32 w-full overflow-hidden cursor-pointer">
      {!isLoading && (
        <img
          src={chrome.runtime.getURL("/icon-128.png")}
          className="h-8 w-8 object-contain mb-4"
        />
      )}
      {!error && isEmpty && (
        <span className="text-sm font-medium text-noble-300">
          {"No highlights yet"}
        </span>
      )}
      {(!isLoading || isApiError) && (
        <span className="text-sm font-medium text-red-400">{error}</span>
      )}
      {isLoading && !isApiError && <Loading />}
    </div>
  );
}
