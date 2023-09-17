import {
  BaseStorage,
  createStorage,
  StorageType,
} from "@src/shared/storages/base";

type Theme = {
  "prefers-color-scheme": "light" | "dark";
  "extension-enabled": boolean;
};

type ThemeStorage = BaseStorage<Theme> & {
  change: (type: keyof Theme) => void;
};

const toggle = createStorage<Theme>(
  "toggle",
  {
    "prefers-color-scheme": "light",
    "extension-enabled": false,
  },
  {
    storageType: StorageType.Local,
  }
);

const toggleStorage: ThemeStorage = {
  ...toggle,
  change: (type: keyof Theme) => {
    toggle.set((prev) => {
      if (type === "prefers-color-scheme") {
        return {
          ...prev,
          [type]: prev[type] === "light" ? "dark" : "light",
        };
      }
      if (type === "extension-enabled") {
        return {
          ...prev,
          [type]: !prev[type],
        };
      }
      return prev;
    });
  },
};

export default toggleStorage;
