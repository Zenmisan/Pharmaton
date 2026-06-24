# PharmaConnect — Hackathon Pitch Script
**Total time: 5 minutes | 3 speakers**

---

## SPEAKER ORDER
1. **[PM_NAME]** — Product Manager · Problem + Vision *(~1:30)*
2. **[DESIGNER_NAME]** — Designer / Product Manager 2 · Product Walkthrough *(~1:40)*
3. **[DEV_NAME]** — Developer · Tech + What We Built *(~1:10)*

---

---

## SPEAKER 1 — [PM_NAME] | Problem & Vision
**Screen: Landing page — `pharmaton.web.app`**
**Time: 0:00 – 1:30**

---

Imagine you're in Lagos at 10pm. Your child has a fever. You have a prescription. You leave your house, you go to the first pharmacy — closed. You go to the second — they don't have the medicine. The third is 4km away and you don't know if they have it either.

This is not a rare situation. This is Tuesday in Lagos.

Nigeria has over 120,000 registered pharmacies — but patients have no way to know what's in stock, where the nearest open one is, or whether the price is fair. So they guess. They travel. Sometimes they give up.

We built **PharmaConnect** — a platform that connects patients directly to pharmacies in real time. Patients search for a medicine, find who has it nearby, get directions, and go. Pharmacists manage their live inventory, get visibility to patients who need what they carry, and build a digital presence they've never had before.

This is not a delivery app. We are not trying to replace the pharmacy. We are making pharmacies findable, and making medicines accessible — for the first time, at scale.

---

---

## SPEAKER 2 — [DESIGNER_NAME] | Product Walkthrough
**Screen: Live app demo — navigate as you speak**
**Time: 1:30 – 3:10**

---

Let me show you what this looks like for a real user.

*(Navigate to the landing page)*

When you land on PharmaConnect, you choose who you are — a patient, or a pharmacist. Two sides of the same platform.

*(Click "I'm a Patient" → Auth screen → log in as demo patient)*

As a patient, you sign up, verify your email, and you're in. Your home screen shows you pharmacies near you — real pharmacies, with real stock data, with distance from your location.

*(Go to Search page, type "Paracetamol")*

You search for a medicine. Not just by exact name — if you type "pain reliever" or "fever medicine," our system understands what you mean and maps it to the right drug. It then shows you every pharmacy nearby that has it in stock, sorted by distance.

*(Click a pharmacy card → Pharmacy Detail page)*

You tap a pharmacy — you see their full inventory, live status, price, and expiry. One tap to get directions. One tap to call them directly.

*(Switch to pharmacist demo account)*

On the pharmacist side — they have a full dashboard. They manage their inventory, update stock levels, see demand trends. They appear in patient searches automatically. And they get a public listing — a profile page their customers can find.

*(Show the sidebar navigation — Dashboard, Inventory, Safety & Alerts)*

Everything is organised. Dashboard overview. Inventory management. Safety and recall alerts from NAFDAC — so pharmacists are always informed about what they should or shouldn't be dispensing.

Two types of users. One platform. Both solving a real problem.

---

---

## SPEAKER 3 — [DEV_NAME] | Technology
**Screen: Stay on pharmacist dashboard or show code briefly if projector allows**
**Time: 3:10 – 4:40**

---

Let me tell you how this was actually built — and why the decisions we made matter.

The frontend is built in **React with Vite** — fast to load, works on low-end devices, fully responsive down to an iPhone 8. The pharmacist side has a full sidebar layout. The patient side is clean and touch-optimised. We used **Tailwind CSS v4** for the design system — every spacing, colour, and component is consistent across the whole app.

The backend runs on **Express with a SQLite database** — deployed on Railway with persistent storage volumes. It handles authentication, inventory, orders, alerts, and pharmacy data. For authentication, we used **Firebase Auth** — email and password, plus Google Sign-In, with full email verification before access.

The pharmacy data is real. We pulled it from **OpenStreetMap's Overpass API** — 30+ actual Lagos pharmacies with real coordinates. The medicine catalog is sourced from the **WHO Essential Medicines List**, cross-referenced with Nigerian brand names.

The AI features use **Claude by Anthropic**. When a patient searches "antibiotic" or "something for malaria," the AI translates that into actual drug names and returns relevant results. It also powers the pharmacist's demand insight tool — natural language questions about stock trends and market conditions, answered in seconds.

We built this in a weekend. It is deployed. It is live. You can use it right now.

*(pause)*

The infrastructure scales. The data is real. And the problem it solves — is real.

---

---

## CLOSING — Any Speaker (Optional, if time allows ~20s)

**PharmaConnect. Real pharmacies. Real stock. Real time.**

We'd love your questions.

---

---

## QUICK REFERENCE — Screen Navigation Cues

| Speaker | What to show |
|---|---|
| PM | Landing page hero — `pharmaton.web.app` |
| Designer | Patient login → Home → Search "Paracetamol" → Pharmacy detail → Switch to pharmacist → Dashboard → Inventory → Alerts |
| Developer | Pharmacist dashboard (sidebar visible) — optionally show mobile view for responsiveness point |

## Demo Login Credentials (keep handy)
- **Patient demo:** use a registered test account
- **Pharmacist demo:** use Grace Pharmacy demo account (PCN: `12345678`)

---

## Timing Guard
| Segment | Target | Hard Stop |
|---|---|---|
| Speaker 1 | 1:30 | 1:40 |
| Speaker 2 | 1:40 | 1:55 |
| Speaker 3 | 1:30 | 1:45 |
| Buffer / close | 0:20 | — |
| **Total** | **5:00** | **5:20** |
