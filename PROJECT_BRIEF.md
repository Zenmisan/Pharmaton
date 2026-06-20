# PharmaConnect AI — Project Brief

**Version 1.0 · June 2026**
**Author: Zenmi**

---

## What Is This?

PharmaConnect AI is a platform that connects people who need medicine with pharmacists who have it — and helps pharmacists run their business better.

The idea is simple: finding medicine in Nigeria should not involve calling five different numbers, sending WhatsApp voice notes, or travelling to a pharmacy only to be told they don't have what you need. PharmaConnect AI fixes that. A patient types in what they need, sees who has it nearby, what it costs, and whether there are cheaper options — all in seconds.

For the pharmacist on the other side, the platform means patients can find them, their inventory is organised, and they have a tool that actually helps them manage their work instead of just adding more paperwork.

---

## The Name

**PharmaConnect AI**

- *Pharma* — the pharmaceutical / medicine world
- *Connect* — the bridge between patients and pharmacists
- *AI* — artificial intelligence powers the search, the suggestions, the language support, and the insights

Tagline: **Medicine Access, Reimagined for Africa**

The logo is a map pin with a medical cross inside it — representing location + healthcare, which is exactly what the platform does.

---

## The Problem We Are Solving

Nigeria has tens of thousands of pharmacies. Most of them have medicine. Most patients need medicine. The two sides almost never find each other efficiently.

Here is what actually happens today:

- A patient needs Augmentin. They walk to their nearest pharmacy. It is out of stock. They walk to the next one. Also out. They call a relative who knows a pharmacist. Maybe that works. Maybe it doesn't.
- A patient cannot afford the brand-name version and does not know that a generic alternative exists for a fraction of the price.
- A patient speaks Yoruba or Hausa and cannot communicate exactly what they need, or they spell the drug name wrong and no one understands them.
- A pharmacist has no way of knowing if patients nearby are looking for something they have in stock. They just wait.
- A pharmacist is out of a medicine and does not know which other pharmacy nearby might be able to help or supply them.

These are not edge cases. This is daily life. PharmaConnect AI is built specifically to solve this.

---

## Who Is This For?

### Primary Users (Phase 1 — what we are building now)

**1. Patients / General Public**

Anyone who needs to buy medicine. This could be:
- Someone managing a chronic condition (diabetes, hypertension) who buys medication regularly
- A parent looking for medicine for a sick child
- Someone who just received a prescription and needs to fill it
- Someone who cannot afford the branded version and wants to know what else exists

What they need from this platform:
- Find out who has their medicine nearby, right now
- Know the price before they travel
- Understand if a cheaper option exists
- Be able to search in their language
- Know the pharmacy is legitimate and not selling counterfeits

**2. Community Pharmacists**

Licensed pharmacists who run retail pharmacies — on high streets, in markets, in residential areas. This is not a hospital. This is the Grace Pharmacy on your street corner.

What they need from this platform:
- Patients to be able to find them
- A simple tool to manage their inventory so they know what they have and what is running low
- A way to see demand in their area (what are people searching for?)
- AI-powered insights to help with sourcing decisions

### Future Users (Phase 2 — planned but not yet built)

**3. Pharmaceutical Suppliers / Distributors**
Companies that supply medicine in bulk to pharmacies. They will be able to receive orders from pharmacists, manage their stock, and use demand data to plan their supply.

**4. Hospital Pharmacists**
Pharmacies within hospitals managing larger volumes, critical medicine needs, and bulk procurement. This will come after the core patient-pharmacist connection is solid.

---

## What the Platform Does — Feature by Feature

### For Patients

**Medicine Search**
The patient types in the name of a medicine. The AI understands what they mean even if the spelling is off, even if they use a local brand name or a generic name. It finds it.

**Branded vs Generic vs Local Alternatives**
This is one of the most important features. A patient searches for Panadol. The AI tells them:
- Panadol (branded) costs ₦800–₦1,200 in Lagos pharmacies
- Generic Paracetamol 500mg costs ₦150–₦300 and is the same active ingredient
- There is also a local off-brand option at ₦120

The patient can now make an informed choice. This alone can save Nigerian families significant money every month.

**Budget Filter**
The patient enters their budget (e.g. ₦500). The search automatically prioritises pharmacies and options that fall within that budget and tells them what is achievable.

**Language Support**
Search works in English, Yoruba, Hausa, Igbo, and French. The AI responds in the same language the patient uses. This is not a translation gimmick — it means a Hausa-speaking patient in Kano can search for "magani" and get a meaningful response.

**Nearby Pharmacy Listing**
After searching, the patient sees a list of pharmacies near them that have the medicine. Each pharmacy listing shows:
- Name and address
- Distance from the patient
- Whether the medicine is in stock, low, or out of stock
- Price range
- Star rating
- Whether the pharmacy is NAFDAC and PCN verified (i.e., legitimate)
- A button to get directions (opens Google Maps)
- A button to call the pharmacy directly

**Safety and Recall Alerts**
The platform publishes alerts when NAFDAC recalls a batch of medicine, when counterfeits are reported, or when there are packaging changes. Every patient using the platform sees these alerts so they know what to avoid.

---

### For Community Pharmacists

**Patient Visibility**
When a patient searches for a medicine and the pharmacist has it in stock, the pharmacist's pharmacy appears in the results. This is free, passive marketing — patients find the pharmacy without the pharmacist having to advertise.

**Inventory Management**
Pharmacists maintain their stock list on the platform:
- Add medicines to their inventory
- Update quantities as stock changes
- Mark items as In Stock, Low Stock, or Out of Stock
- Set prices
- Track expiry dates

When inventory is updated, the patient-facing search results update automatically. A pharmacist who marks Augmentin as "Out of Stock" will no longer appear in Augmentin search results.

**AI Demand Insights**
Pharmacists can ask the AI questions like: "What medicine is in high demand in Surulere right now?" or "Should I stock more Metformin?" The AI uses public pharmaceutical data and platform usage patterns to give practical, actionable advice — not generic answers.

**Order Management**
Pharmacists can see and manage orders coming in — whether from the platform or from suppliers they have dealt with before.

---

## What Makes This Different

**1. It is built for Nigeria, not adapted for it.**
The language support is not an afterthought. The NAFDAC compliance layer is built in. The price ranges are in Naira. The pharmacies listed are real Nigerian pharmacies. This is not a global platform that happens to work in Nigeria — it is built from the ground up for this context.

**2. It tackles the affordability problem head-on.**
Showing generic and local alternatives alongside branded medicines is not just a feature — it is a statement about what this platform believes. Medicine should be accessible to people who cannot afford the premium option. If a cheaper, equally effective option exists, the patient deserves to know about it.

**3. It is built on trust.**
Every pharmacy and supplier on the platform must be PCN licensed, CAC registered, and NAFDAC approved before appearing. There is no self-registration that bypasses verification. Patients need to trust that what they find on this platform will not harm them.

**4. The AI is actually useful, not decorative.**
The AI in PharmaConnect AI does real work: it understands misspelled drug names, responds in local languages, explains what a medicine treats, suggests alternatives, and advises pharmacists on demand. It is not a chatbot people will click once and ignore.

---

## What We Are NOT Building (Right Now)

Being clear about what is out of scope is as important as the feature list.

- **Delivery / courier service** — We connect patients to pharmacies. We do not deliver medicine. The patient either calls, gets directions, or the pharmacist arranges their own delivery.
- **Prescription verification** — We are not a prescription platform. Patients do not upload prescriptions. This may come in a later version.
- **Payments** — We do not process payments. The patient pays at the pharmacy, in cash or transfer, as they always have.
- **Manufacturing or distribution** — We are a connection platform, not a supply chain company.
- **Hospital procurement systems** — This comes later. Right now the focus is street-level pharmacies and everyday patients.

---

## The Goal — What Does Success Look Like?

**In 6 months:**
- A patient in Lagos can search for any common medicine and find at least three verified pharmacies near them with real-time stock and price information.
- A pharmacist in Surulere is getting visible patient inquiries through the platform without doing anything except keeping their inventory updated.
- A patient who was previously buying Panadol at ₦1,200 now knows they can get generic Paracetamol at ₦200.

**In 1 year:**
- The platform covers major Nigerian cities: Lagos, Abuja, Port Harcourt, Kano, Ibadan.
- Pharmacists are actively using the inventory management tool as a core part of how they run their business.
- The supplier layer is live, meaning pharmacists can source restocks through the platform when they run low.

**Long term:**
- PharmaConnect AI becomes the default way Nigerians find and access medicine.
- The data generated by the platform (what people are searching for, what is out of stock, where shortages are happening) becomes a public health resource that can help NAFDAC and the government plan supply chain interventions.

---

## The Business Model (Future)

This document is not a business plan, but the thinking on revenue is:

- **Free for patients.** Always. Charging patients for a healthcare search tool would defeat the entire purpose.
- **Subscription for pharmacists.** A monthly fee for pharmacists to be listed on the platform, maintain their inventory, and access AI insights. Basic listing could be free; advanced features (analytics, priority placement) paid.
- **Supplier marketplace fees.** When suppliers use the platform to receive and fulfil orders, a small transaction or subscription fee applies.
- **Data and insights partnerships.** Anonymised, aggregated demand data has value to pharmaceutical companies, government health agencies, and NGOs. This is a potential long-term revenue stream, handled ethically and transparently.

---

## How the Platform Works — A Simple Walkthrough

**As a patient:**
1. Open PharmaConnect AI
2. Tap "I'm a Patient"
3. Type in the medicine you need (or tap one of the quick suggestions)
4. Select your language and your budget if relevant
5. See which pharmacies near you have it, at what price, and whether there is a cheaper alternative
6. Call the pharmacy or get directions
7. Done

**As a pharmacist:**
1. Sign up as a Community Pharmacist
2. Enter your pharmacy name, location, and PCN license number
3. Add your medicines and stock quantities
4. Your pharmacy now appears in patient searches for medicines you stock
5. Keep your inventory updated as stock changes
6. Use the AI assistant for demand insights when you need them

---

## The Name of the App and Product

| | |
|---|---|
| **Full name** | PharmaConnect AI |
| **Short name** | PharmaConnect |
| **Platform** | Web app (works on all devices, no download needed) |
| **Primary market** | Nigeria |
| **Language** | English, Yoruba, Hausa, Igbo, French |
| **Logo** | Map pin with medical cross — teal-to-blue gradient |
| **Primary colours** | Deep navy/teal gradient (brand), green (positive/in-stock), amber (warning/low), red (alert/critical) |

---

## Summary

PharmaConnect AI exists because finding medicine in Nigeria should be as easy as finding a restaurant. It connects patients who need medicine with pharmacists who have it, uses AI to bridge language and knowledge gaps, and makes sure patients know when a cheaper option is available. Phase 1 is the patient-pharmacist connection. Phase 2 adds suppliers. The long-term vision is to become the infrastructure layer that makes pharmaceutical access in Nigeria reliable, affordable, and transparent.

This is not a healthcare app for people who already have good healthcare. It is a tool for the millions of Nigerians navigating the pharmacy system with WhatsApp voice notes and guesswork. That is who we are building for.

---

*This document was written as a project charter for PharmaConnect AI. It is the reference document for product decisions, feature scope, and stakeholder communication throughout the build phase. When there is doubt about whether a feature belongs on the platform, refer back to the goals and the audience described here.*