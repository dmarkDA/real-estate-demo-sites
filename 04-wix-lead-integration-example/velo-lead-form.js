// Page Code — e.g. src/pages/Home.c1dmp.js or Contact.js
// Wired to a "Book a Showing" lightbox/form with the following elements:
//   #nameInput, #emailInput, #phoneInput, #propertyDropdown, #messageInput,
//   #submitButton, #formMessage, #formSection

import { submitLead } from 'backend/leadRouter.jsw';
import wixWindow from 'wix-window';

$w.onReady(function () {
	$w('#submitButton').onClick(handleSubmit);
});

async function handleSubmit() {
	const lead = {
		name: $w('#nameInput').value.trim(),
		email: $w('#emailInput').value.trim(),
		phone: $w('#phoneInput').value.trim(),
		property: $w('#propertyDropdown').value,
		message: $w('#messageInput').value.trim(),
		source: 'Website — Book a Showing form',
	};

	if (!lead.name || !isValidEmail(lead.email)) {
		showMessage('Please enter your name and a valid email address.', true);
		return;
	}

	setLoading(true);

	try {
		const result = await submitLead(lead);

		if (result.success) {
			showMessage("Thanks! We've received your request — a member of our team will reach out shortly.", false);
			$w('#formSection').collapse();

			// Fire a client-side analytics event so this shows up as a
			// tracked conversion in Wix Analytics / connected GA / Meta Pixel.
			wixWindow.trackEvent('Lead', {
				name: 'showing_request_submitted',
				property: lead.property,
			});
		} else {
			showMessage('Something went wrong sending your request. Please try again or call us directly.', true);
		}
	} catch (err) {
		console.error('Lead submission failed:', err);
		showMessage('Something went wrong sending your request. Please try again or call us directly.', true);
	} finally {
		setLoading(false);
	}
}

function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setLoading(isLoading) {
	$w('#submitButton').disable = isLoading;
	$w('#submitButton').label = isLoading ? 'Sending…' : 'Request a Showing';
}

function showMessage(text, isError) {
	$w('#formMessage').text = text;
	$w('#formMessage').style.color = isError ? '#c0392b' : '#1e824c';
	$w('#formMessage').expand();
}
