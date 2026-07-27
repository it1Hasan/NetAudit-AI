# NetAudit AI 🛡️

> **AI-powered security auditor for Cisco IOS & MikroTik RouterOS configurations**

[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

---

## 🔗 Live Demo

**Public URL:** [https://net-audit-ai.vercel.app](https://net-audit-ai.vercel.app)

---

## 📌 Overview & Problem Statement

Manually reading through hundreds of lines of a Cisco or MikroTik `running-config` to spot security holes is slow, tedious, and easy to get wrong—even for experienced network engineers. A single missed line (Telnet left enabled, a default SNMP community string, or a VTY line without an Access Control List) can be the difference between an enterprise network and an open doorway for unauthorized access.

**NetAudit AI** solves this for network administrators, security students, and IT teams managing campus or enterprise infrastructure. You paste a raw device configuration into the application, and within seconds you get a full security audit: every vulnerability detected, its corresponding severity level, an overall health score, and the exact CLI remediation commands required to fix it—no line-by-line manual review required.

This tool was inspired by real-world network administration workflows (drawing from hands-on data center environment management at MUST) and the reality that configuration auditing remains one of the most repetitive, error-prone tasks in infrastructure operations.

---

## ✨ Features

* **Instant Config Paste:** Paste any Cisco IOS or MikroTik RouterOS `running-config` directly into the browser—no file uploads required.
* **One-Click Samples:** Pre-loaded Cisco and MikroTik sample configurations to demo the application instantly.
* **AI Platform Detection:** Automatically identifies whether the syntax belongs to Cisco IOS or MikroTik RouterOS.
* **Comprehensive Vulnerability Scanning:** Flags weak/missing authentication, unencrypted management protocols (Telnet, HTTP, SNMP v1/v2c), open management services, missing ACLs, unencrypted passwords, and protocol misconfigurations.
* **Severity Scoring:** Categorizes every identified issue into distinct risk tiers (**Critical**, **High**, **Medium**, **Low**).
* **Overall Health Score:** Calculates an overall device security posture rating from **0 to 100**.
* **Exact CLI Remediation:** Generates copy-pasteable CLI commands tailored to the specific platform to fix every flagged vulnerability.
* **Persistent Session History:** Saves past audit logs in Firebase Firestore, scoped per anonymous session with zero login friction.
* **Risk Posture Tracking:** Visualizes average security score trends across all past audits.
* **PDF Export:** Export comprehensive audit history reports for documentation and compliance.
* **Responsive Dashboard:** Built with a clean dark-mode UI optimized for desktop and mobile monitoring.

---

## 🧠 The AI Architecture

### How It Works

The core engine of NetAudit AI utilizes a structured system prompt that instructs the AI model to act as a **Senior Network Security Auditor**. It parses raw configuration text, detects the target platform, evaluates security posture line-by-line, and outputs structured JSON data. This JSON output dynamically powers the entire frontend dashboard—including severity rings, vulnerability cards, and CLI fix snippets.

* **Model Used:** Google Gemini API (`gemini-3.6-flash`)

### System Prompt (Location: `/app/api/audit/route.ts`)

```text
You are a Senior Network Security Auditor with 15+ years of experience hardening enterprise Cisco IOS and MikroTik RouterOS deployments. You are reviewing a raw running-config pasted by a network administrator.

Your job:
1. Detect the device platform (Cisco IOS/IOS-XE or MikroTik RouterOS) from the syntax. If you cannot tell, use "unknown".
2. Carefully scan the config line by line for security vulnerabilities and misconfigurations, including but not limited to:
   - Unencrypted management protocols (Telnet, HTTP management, unencrypted SNMP v1/v2c with default community strings)
   - Missing or weak authentication (no enable secret, plaintext passwords, missing AAA)
   - VTY/management lines with no ACL restricting access
   - Missing or overly permissive interface ACLs
   - No password encryption service enabled
   - Unused/insecure services left enabled
   - Missing logging/NTP/syslog configuration
   - Routing protocol misconfigurations (no neighbor authentication)
   - MikroTik-specific: default admin user not renamed/disabled, API/Winbox open to any address, no firewall filter rules, insecure services enabled
3. Assign a severity to every issue: critical, high, medium, or low.
4. Provide exact CLI remediation commands for the detected platform.
5. Compute an overallScore from 0–100 (100 = fully secure).
6. Write a 1–2 sentence plain-English summary of the security posture.

Respond with ONLY valid JSON matching a fixed schema — no markdown, no preamble.
```

---

## 🛠️ Tech Stack & Services

| Category | Technology / Service |
|---|---|
| Frontend Framework | Next.js (App Router, React, TypeScript) |
| Styling | Tailwind CSS |
| Database | Firebase Firestore |
| Authentication | Firebase Authentication (Anonymous Auth) |
| AI Integration | Google Gemini API (`@google/genai`) |
| Deployment | Vercel |

---

## 📸 Screenshots

### Home Page — Configuration Input & Sample Selectors
![Home Page]
<img width="959" height="476" alt="Home Page" src="https://github.com/user-attachments/assets/a0e8935c-9d0f-4414-aaaf-9bdc5be6d67e" />

### Audit Results — Severity-Coded Findings & CLI Commands
![Audit Results]
<img width="959" height="512" alt="Cisco Audit Report" src="https://github.com/user-attachments/assets/5cd17c30-83c7-4235-998d-f8d8c8fa54f0" />
<img width="959" height="474" alt="Cisco Audit Report 2" src="https://github.com/user-attachments/assets/0e3ed7ff-a5c3-4d54-b690-55209824d364" />

### History & Analytics — Risk Posture & Export Options
![Audit History]
<img width="959" height="509" alt="Audit History" src="https://github.com/user-attachments/assets/1194ca50-e31b-4f2a-8c29-b2779b3c71ae" />


### Firebase Firestore — Database
![Audit Records]
<img width="959" height="508" alt="Firebase Saved Audits" src="https://github.com/user-attachments/assets/7701f585-8481-4f56-8f9e-499b03b5a0be" />


---

## 🚀 Local Development Setup

Follow these steps to run the project locally on your machine:

### 1. Clone the Repository

```bash
git clone https://github.com/it1Hasan/NetAudit-AI.git
cd NetAudit-AI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Fill in your respective API keys and Firebase credentials in `.env.local`:

```
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🔥 Firebase Setup Instructions

If setting up your own Firebase instance:

1. Go to the [Firebase Console](https://console.firebase.google.com) and create a new project.
2. Navigate to **Firestore Database** and enable it.
3. Navigate to **Authentication → Sign-in method** and enable **Anonymous** authentication.
4. Register a **Web Application** under Project Settings and copy the configuration keys into your `.env.local`.
5. Deploy or add the security rules to the **Firestore → Rules** tab:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /audits/{auditId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 👤 Author

**Built by Hasan Mukhtar**
BSIT — Mirpur University of Science and Technology (MUST)
Developed for the *Act AI* Final Assessment Project.
