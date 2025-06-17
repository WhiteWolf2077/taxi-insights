# Oi.ai – Architecture Overview

Oi.ai is a real-time, Claude-powered WhatsApp intelligence system for licensed London cab drivers. It combines predictive AI, dynamic social/media scraping, and driver tools to deliver hyperlocal, moment-by-moment hustle advice directly in WhatsApp.

---

## 🔧 1. System Architecture

### 1.1 User Interface: WhatsApp

* Powered via Meta WhatsApp Business API
* No app required – chat-only experience
* Inputs: text, photo (for PCNs), voice (optional), location pin

### 1.2 Core Brain: Claude LLM (via API)

* Interprets user messages
* Detects intent ("Oi, where's busy?", "Appeal this PCN")
* Injects memory: vehicle, PCN history, location, driver tier
* Decides on action/tool execution

### 1.3 Contextual Memory Engine

* Lightweight memory using Redis or KV store
* Per-driver: last known location, fine history, points tally, subscriptions
* Injected as structured prompt context

### 1.4 Toolchain (Modular Tools)

* `get_hotspots(lat, lon)`
* `get_uber_surge_predictions()`
* `get_live_events(lat, lon)`
* `scrape_social_signals(lat, lon)`
* `generate_pcn_appeal(image_url|text)`
* `generate_daily_brief(driver_id)`
* `get_driver_risk(driver_id)`

Claude is prompted to use one or more tools and returns structured output.

### 1.5 External Data Sources

* **PredictHQ** → events, weather, flights, transport
* **Social Media APIs (X, Reddit, TikTok)** → trends, crowds
* **TfL API** → disruptions, traffic
* **Uber API/Scraper** → surge hints

### 1.6 Media Handling

* Image OCR → extract PCN info
* Voice-to-text via local Whisper
* File uploads temporarily stored (S3 or local bucket)

### 1.7 PDF Generator (Fine Appeals)

* Claude outputs legal letter text
* System converts to formatted PDF
* Delivered to driver over WhatsApp

### 1.8 Subscriptions + Access

* Stripe integration for payments
* Tier logic: Pro, Daily Pass, Free Trial
* Subscription memory injected into Claude prompt

---

## 🔄 2. Core Workflows

### ➤ Predictive Hotspot Query

Driver: "Oi, where's busy?"
→ Inject location + current context
→ Claude decides: pull events + weather + social data
→ Response: "Soho: pubs closing in 30 mins. Covent Garden: rain + theatre."

### ➤ Fine Appeal Flow

Driver: Sends photo of PCN
→ OCR extracts data
→ Claude generates letter
→ System replies with legal PDF

### ➤ Daily Brief

Automatic message every morning
→ Claude builds custom message: top 3 zones, risks, Uber zones

### ➤ Driver Risk Dashboard

On request: "Oi, how's my licence lookin'?"
→ Claude responds with points tally, PCNs, appeal status

---

## 🧱 3. Stack

| Layer         | Tech                             |
| ------------- | -------------------------------- |
| Frontend      | WhatsApp (Meta API)              |
| Backend       | Node.js / FastAPI                |
| LLM           | Claude 3 (Anthropic API)         |
| OCR           | Tesseract / PaddleOCR            |
| Transcription | Whisper.cpp                      |
| Storage       | Redis (memory), S3 (media), DB   |
| Payments      | Stripe                           |
| PDF           | Puppeteer / pdfkit               |
| Admin         | Optional (logs, appeals, briefs) |

---

## 📡 4. Future v2 Modules

* Passive GPS tracking
* Insurance optimization scraper
* Local business B2B job leads
* Community chat: "Who's driving where?"
* Multi-driver smart routing + Uber prediction map
