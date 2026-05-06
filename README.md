# Ghost Job Scanner 🚫👻
A browser extension designed for **Information Assurance** and job market triage.

### 📜️ Mission statement
Being a data farm should be an option when applying for jobs, not a requirement.

## 🧪 Project Status: Alpha (Experimental)
This Project is in **early development(Alpha)**
- **Beta Testers Welcome:** If you are testing this tool and encountering bugs or "False Positives" (a good job being marked as a ghost), please feel free to open an **issue** or reach out with feedback.
- **Open for Contribution:** I am specifically looking to help refining the CSS selectors for different job boards and optimizing the MutationObserver performance.

## 🔍 The Problem
Job boards often host "Ghost Job" postings that are not intended to be filled but are used to harvest resumes or project artifical growth. Additionally, a pile of applicants can be used for corporate bullying. This wastes time, potentially puts applicants in an unaware unethical situation, and turns personal data into a commodity.

## ⚙️ How it Works
This extension acts as a **Heuristic Scanner** for your browser:
**Signature Matching**: It scans job cards for patterns like "30+ days ago" "Reposted," or "Actively Recruiting (Talent Pool)."
**Visual Triage**: It applies color-coded warnings (Red/Orange) directly to the UI so you can skip low-quality leads instantly.
**Local Persistence**: It uses `chrome.storage.local` to remember jobs you've seen, allowing it to detect when a job is "silently" reposting with a new ID.

## 🌐 Supported Sites
- **LinkedIn:** ✅️ Supported (Alpha)
- **Indeed:** 🚧️ Under Development (comming soon)
- **Glassdoor:** 🗓️ Planned for future release

## 🔒 Privacy & Security (OPSEC)
- **Local Only:** No data is sent to a backend. Your history stays in your browser.
- **Permission-Light:** Only requires the storage and scripting permissions necessary to function.

## 🛠️ For Beta Testers
1. Download this repo.
2. Go to `chrome://extensions`.
3. Enable **Developer Mode**.
4. Click **Load Unpacked** and select this folder.
