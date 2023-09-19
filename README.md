<p align="center">
  <img src="public/icon-128.png" alt="QuickSight Chrome Extension Logo"/>
  <h1 align="center">QuickSight AI Chrome Extension</h1>
</p>

---

## 📖 Table of Contents

- [Installation](#installation)
  - [Frontend Procedures](#frontend-procedures)
  - [Backend Procedures](#backend-procedures)
- [Screenshots](#screenshots)
  - [Extension](#extension)

---

## 🛠 Installation <a name="installation"></a>

### 📋 Frontend Procedures <a name="procedures"></a>

1. **Clone this Repository**

   ```bash
   git clone https://github.com/skdev24/quicksight-ai-extension
   ```

2. **Update Metadata**

   - Change `name` and `description` in `package.json`. This will auto-synchronize with the manifest.

3. **Install Dependencies**

   ```bash
   yarn install  # or npm i
   ```

   > Note: Make sure your Node.js version is >= 16.6 (>= 18 recommended).

4. **Run Development Server**

   ```bash
   yarn dev  # or npm run dev
   ```

5. **Load Extension on Chrome**

   1. Open Chrome browser.
   2. Navigate to `chrome://extensions`.
   3. Enable Developer Mode.
   4. Click on "Load unpacked extension".
   5. Select the `dist` folder in this project (generated after running dev or build).

6. **Production Build**
   ```bash
   yarn build  # or npm run build
   ```

### 📋 Backend Procedures <a name="backend-procedures"></a>

1. **Navigate to Backend Folder**

   ```bash
   cd backend
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   ```

3. **Set OpenAI API Key**

   - Add `OPENAI_API_KEY` to `.env` file.

4. **Start Backend Server**
   ```bash
   yarn start
   ```
   Your server will run on [http://localhost:8080](http://localhost:8080).

## 📸 Screenshots <a name="screenshots"></a>

### 🌟 Extension <a name="extension"></a>

![QuickSight Chrome Extension Screenshot](./quicksight-ai-screenshot.png)
