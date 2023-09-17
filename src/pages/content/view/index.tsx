import { createRoot } from "react-dom/client";
import App from "@root/src/pages/content/view/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import { attachTwindStyle } from "@src/shared/style/twind";
import "./app.css";

refreshOnUpdate("pages/content");

const root = document.createElement("div");
root.id = "quicksight-chrome-extension-content-view-root";

document.body.append(root);

const rootIntoShadow = document.createElement("div");
rootIntoShadow.id = "shadow-root";

const shadowRoot = root.attachShadow({ mode: "open" });
shadowRoot.appendChild(rootIntoShadow);

attachTwindStyle(rootIntoShadow, shadowRoot);

createRoot(rootIntoShadow).render(<App />);
