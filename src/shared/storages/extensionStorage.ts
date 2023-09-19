import {
  BaseStorage,
  createStorage,
  StorageType,
} from "@src/shared/storages/base";

export interface HighlightWithSummary {
  id: string;
  highlightedText: string;
  url: string;
  date: string;
  tags: string[];
  summary: string;
}

type StorageExtensionType = {
  tags: string[];
  highlightsWithSummary: HighlightWithSummary[];
};

type ThemeStorage = BaseStorage<StorageExtensionType> & {
  update: (
    type: keyof StorageExtensionType,
    value: string[] | HighlightWithSummary[],
    previousData?: StorageExtensionType
  ) => void;
};

const store = createStorage<StorageExtensionType>(
  "quick-sight-ai-storage",
  {
    tags: [],
    highlightsWithSummary: [],
  },
  {
    storageType: StorageType.Local,
  }
);

const extensionStorage: ThemeStorage = {
  ...store,
  update: (
    type: keyof StorageExtensionType,
    value: string[] | HighlightWithSummary[],
    previousData?: StorageExtensionType
  ) => {
    store.set((prev: StorageExtensionType) => {
      return {
        ...prev,
        ...previousData,
        [type]: value,
      };
    });
  },
};

export default extensionStorage;
