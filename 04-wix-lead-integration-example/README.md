# Wix Velo Lead & Scheduling Integration — Code Sample

## What this is

A representative **Wix Velo** (Wix's built-in JavaScript custom-code layer) code
sample showing how a lead-capture form on a real estate site can be wired into:

- a Wix CMS collection (lead log)
- a Wix CRM contact record
- an automatic internal notification email to the agent
- an external CRM / spreadsheet via an outbound webhook (Zapier, Make, HubSpot, etc.)
- an inbound scheduling webhook (e.g. Calendly) that updates the CRM contact when a
  showing gets booked
- a basic analytics event fired on successful submission

This mirrors the exact tasks in the job description: *"Connect website forms with
email notifications and lead-management systems," "Integrate CRM, lead-generation,
scheduling, analytics, and other real-estate-related tools."*

**Note on running it live:** Velo code only executes inside a Wix site that has
Dev Mode (Velo) turned on — it isn't something that can be hosted as a standalone
static page like the three demo sites in this repo. This folder is provided as a
portfolio code sample: the files below are exactly what would be pasted into a
Wix site's Page Code and Backend panels, and can be dropped into any Wix site with
Velo enabled and wired up in minutes.

## Files

| File | Where it lives in Wix | Purpose |
|---|---|---|
| `velo-lead-form.js` | Page Code (e.g. Home or Contact page) | Handles the form submit, calls the backend, shows a success state, fires an analytics event |
| `backend/leadRouter.jsw` | Backend web module | Validates the lead, logs it to a CMS collection, upserts a Wix CRM contact, sends the agent a notification email, forwards the lead to an external CRM webhook |
| `backend/http-functions.js` | Backend HTTP functions | Exposes an inbound endpoint for a scheduling tool (Calendly) to notify the site when a showing is booked, and updates the matching CRM contact |

## Data flow

```
Visitor submits "Book a Showing" form
        │
        ▼
velo-lead-form.js  (page code, runs in the visitor's browser)
        │  calls backend function over Velo's built-in RPC
        ▼
backend/leadRouter.jsw
        ├─▶ wix-data: insert into "Leads" collection
        ├─▶ wix-crm-backend: create/update CRM contact + label "Website Lead"
        ├─▶ wix-crm-backend triggeredEmails: notify the agent by email
        └─▶ fetch(): forward lead JSON to external CRM/webhook (Zapier/HubSpot/Sheets)

Calendly booking happens later
        │
        ▼
backend/http-functions.js  (post_calendlyWebhook)
        └─▶ wix-crm-backend: find contact by email, add "Showing Booked" label
```

## Job-requirement mapping

- **Wix / website builder comfort** → all files use native Velo APIs (`wix-data`, `wix-crm-backend`, `wix-http-functions`).
- **Form → email notifications / lead management** → `leadRouter.jsw` (CMS log + CRM contact + notification email).
- **CRM / lead-gen / scheduling / analytics integrations** → external webhook forward, Calendly inbound webhook, `wixWindow.trackEvent` call.
- **Troubleshooting / independent work** → code includes input validation and try/catch error handling with clear fallback messaging, matching how a solo contractor would ship this without hand-holding.
