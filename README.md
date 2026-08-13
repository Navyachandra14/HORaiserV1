# HORAISER — Personal Operating System
### *Capture • Understand • Rise*

> **Monk-Like Discipline & Revenue-Driven Execution System**  
> A 100% Local-First, Privacy-Focused, Zero-Cost Personal Operating System designed to align daily action, protect focus blocks, track revenue proof, and eliminate mental overload.

---

## 🌟 Key Features

- **🎯 Double Diamond Filter**: Ensures every task passes two critical filters: *"Is this my ONE thing?"* & *"Does this create value or revenue?"*
- **⏰ Top-of-Hour Check-In Engine**: Prompted hourly logs with soft Web Audio chimes, snooze timers, and state resets.
- **🛡️ 3-Hour Protected Focus Runner**: Immersive full-screen focus block timer with task lock-in and anti-drift protocols.
- **💰 Daily Revenue Proof Tracker**: Logs outreach, sales calls, proposals, and created assets with verifiable proof.
- **🧘 State Reset Protocol**: Quick 6-step reset sequence (*Stop → Name → Locate → Separate → Reset → Return*) when feeling overwhelmed or unfocused.
- **📊 11 Core Discipline Buckets & Analytics**: Visual tracking across Meditation, Gratitude, Exercise, Sleep, Deep Work, Learning, Finances, and Service.
- **💾 100% Local-First & Offline Ready**: All data resides securely in your browser's **IndexedDB**. Includes 1-click JSON backup import/export.
- **💸 Zero Paid APIs or Subscriptions**: Built using native browser APIs (Web Audio, SpeechSynthesis, Web Notifications) for $0 total operating cost.

---

## 🔰 Step-by-Step Beginner Guide: Exporting, Pushing to GitHub & Deploying to Vercel

If you are a complete beginner, follow these simple step-by-step instructions.

---

### Step 1: Export Your Project Code

You have two easy ways to get your code out of AI Studio:

#### **Method A: Direct Export to GitHub (Easiest & Fastest)**
1. In the top-right corner or Settings menu of Google AI Studio, click **Export** → **Export to GitHub**.
2. Connect your GitHub account when prompted.
3. Choose a repository name (e.g., `horaiser-app`) and click **Create & Push**.
4. Your repository is now live on GitHub! Skip straight to **Step 3: Deploy to Vercel**.

#### **Method B: Download as a ZIP File**
1. Click **Export** → **Download ZIP** in AI Studio.
2. Unzip the downloaded file on your computer (e.g., inside your `Documents` or `Desktop` folder).

---

### Step 2: Push Your Local Folder to GitHub (If you downloaded a ZIP)

1. Open **[GitHub.com](https://github.com)** in your browser and sign in (or create a free account).
2. Click the **`+`** icon in the top right corner and select **New repository**.
3. Set **Repository name** to `horaiser-app`.
4. Choose **Public** (or **Private**), and leave all initialization checkboxes unchecked.
5. Click **Create repository**.
6. Open your terminal (or Command Prompt on Windows / Terminal on Mac):
   ```bash
   # Navigate to your unzipped folder
   cd path/to/unzipped-horaiser-folder

   # Initialize Git
   git init
   git add .
   git commit -m "Initial commit: HORaiser Personal OS"

   # Link your local folder to GitHub
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/horaiser-app.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 3: Deploy to Vercel (Free 1-Click Production Link)

1. Go to **[Vercel.com](https://vercel.com)** and click **Sign Up** → **Continue with GitHub**.
2. Once logged in, click **Add New...** → **Project**.
3. Under **Import Git Repository**, find your `horaiser-app` repository and click **Import**.
4. Vercel will automatically detect the configuration:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.
6. Wait 20–30 seconds. You will see a celebration animation with your live link (e.g., `https://horaiser-app.vercel.app`)!

---

### Step 4: How to Update Your App in the Future

Whenever you make changes or add features in the future:
1. Make your edits in AI Studio or locally.
2. Push your changes to GitHub (`git add .`, `git commit -m "Update features"`, `git push`).
3. **Vercel will automatically rebuild and publish your site** within seconds whenever you push to the `main` branch!

---

## 💡 Why Vercel vs. GitHub Pages?

| Feature | Vercel (Recommended ⭐) | GitHub Pages |
| :--- | :--- | :--- |
| **Ease of Setup** | 1-Click connect to GitHub | Requires workflow file or gh-pages branch |
| **Routing / SPA Support** | Automatic fallback to `index.html` | Requires `404.html` copy script |
| **Build Speed** | Under 30 seconds | 1-2 minutes |
| **Custom Domains & SSL** | Free automatic SSL on custom domain | Free SSL on custom domain |
| **Live Link Format** | `https://your-app.vercel.app` | `https://username.github.io/repo` |

---

## 💻 Local Development Setup

If you want to run the project on your computer:

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🛡️ Privacy & Security Assurance

- **No Data Collection**: No analytics trackers, no telemetry, no cloud servers.
- **100% Local Browser Storage**: All check-ins and logs stay inside your browser's IndexedDB.
- **Your Data Remains Yours**: Export your complete state anytime via **Settings → Backup Data** to a clean `.json` file.

---

### *Capture • Understand • Rise*
