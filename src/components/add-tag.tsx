import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export default function AddTagModal({
  isModalVisible,
  setModalVisible,
  onSubmit,
  tags,
}: {
  isModalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: { tag: string }) => void;
  tags: string[];
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    return () => {
      reset();
    };
  }, [isModalVisible]);

  return (
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
                      !tags?.includes(value?.toLocaleLowerCase()) &&
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
                className="w-full text-gray-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-lime-700 focus:ring-lime-800"
              >
                Add Tag
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
