// Backend HTTP Functions — backend/http-functions.js
// Wix auto-exposes any exported "post_<name>" / "get_<name>" function at:
//   https://<your-site>.wixsite.com/<site>/_functions/<name>
// This endpoint receives Calendly's "invitee.created" webhook when a lead
// books a showing directly off the site, and reflects that back into the
// Wix CRM contact so the agent sees booking status without checking two tools.

import { ok, badRequest, serverError } from 'wix-http-functions';
import { contacts } from 'wix-crm-backend';
import wixData from 'wix-data';

export async function post_calendlyWebhook(request) {
	try {
		const body = await request.body.json();
		const event = body?.event;
		const invitee = body?.payload?.invitee;
		const eventDetails = body?.payload?.event;

		if (event !== 'invitee.created' || !invitee?.email) {
			return badRequest({ body: { received: true, ignored: true } });
		}

		// Find the matching lead we logged earlier and mark it booked.
		const matchingLeads = await wixData
			.query('Leads')
			.eq('email', invitee.email)
			.find();

		if (matchingLeads.items.length > 0) {
			const leadItem = matchingLeads.items[0];
			await wixData.update('Leads', {
				...leadItem,
				status: 'Showing Booked',
				showingTime: eventDetails?.start_time,
			});
		}

		// Tag the CRM contact so it's visible in the Wix Inbox/CRM too.
		const existingContacts = await contacts.queryContacts()
			.eq('info.emails.email', invitee.email)
			.find();

		if (existingContacts.items.length > 0) {
			const contactId = existingContacts.items[0]._id;
			await contacts.updateContact(contactId, {
				labels: ['Website Lead', 'Showing Booked'],
			});
		}

		return ok({ body: { received: true } });
	} catch (err) {
		console.error('Calendly webhook handler failed:', err);
		return serverError({ body: { received: false, error: err.message } });
	}
}
