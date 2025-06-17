Oi.ai – Tasks Breakdown
🚀 PHASE 1: WhatsApp Intelligence MVP
 Set up WhatsApp webhook + Claude message relay

 Claude prompt scaffold with tool injection

 Implement Claude intent parsing logic

 Add Redis-based memory injection

 Build dynamic Claude + tools → WhatsApp reply loop

 Add fallback + Claude re-asks for missing info

🌧 PHASE 2: Predictive Hotspot AI
 Tool: get_hotspots(lat, lon) – merge:

PredictHQ weather

Events within 1hr

Flight/train disruption nearby

 Social scraper: trending X/Reddit posts in zone

 Claude prompt template: "Where's the money at?"

 Footfall forecast scoring system

 Response formatting: Top 3 zones + ETA + event + signal type

🔥 PHASE 3: Uber Surge Prediction Engine
 Build scraper or API monitor for Uber zone data

 Add Claude tool: predict_surge(location)

 Inference logic: combine social + surge + traffic data

 Claude reply: “Uber surge likely in 15m at Shoreditch”

 Add: toggle for daily surge alerts (subscription-based)

🧠 PHASE 4: Under-the-Radar Event Detection
 Twitter/X hashtag + geo-based event detection

 TikTok trends monitor (popular locations, live videos)

 Reddit scraper (events, r/london)

 Claude tool: scrape_social_signals(lat, lon)

 Merge with PredictHQ events (undetected event score)

📄 PHASE 5: PCN Appeal Generator
 WhatsApp image → OCR → PCN extractor

 Claude tool: generate_pcn_appeal(pcn_data)

 Claude outputs: appeal letter text

 Generate formatted PDF

 WhatsApp auto-response: “Appeal ready, download here”

 (Optional) Email/fax appeal to council

📬 PHASE 6: Daily Hustle Briefing (Auto-Message)
 Scheduled Claude job: every morning at 7 AM

 Inject: latest location, PredictHQ, social, surge data

 Claude generates natural language report

 Send to user via WhatsApp

⚠ PHASE 7: Driver Risk Dashboard
 Claude memory: PCNs, points, past appeals

 Tool: get_driver_risk(driver_id)

 Claude generates legal summary: “9 points, 2 appeals filed”

 Add proactive risk alerts if near limits

💳 PHASE 8: Payments + Subscriptions
 Stripe integration (monthly or day pass)

 Claude tool: check_subscription(driver_id)

 Only allow premium tools if active

 Auto-reply: “Oi Guv, your pass ran out. Tap to renew.”

🧭 PHASE 9: Future (V2+)
 Passive GPS integration (optional app layer)

 B2B jobs from businesses (restaurants, nightclubs)

 Insurance comparison integration

 Driver-to-driver chatter (“Oi Club”)

 AI co-pilot (Claude memory per driver, earnings, routes)