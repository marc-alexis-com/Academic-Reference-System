/**
 * Academic Reference System
 * A lightweight JavaScript library for managing academic references and citations in HTML documents
 * 
 * @author Marc-Alexis
 * @version 1.0.0
 * @license MIT
 */

document.addEventListener('DOMContentLoaded', function () {
	// Configuration variables - Easy to modify
	const highlightDuration = 2000;         // Highlight duration in milliseconds
	const highlightClass = 'reference-highlight';     // CSS class for highlighting
	const referenceSelector = '.reference'; // Selector for reference elements
	const refListId = 'reference-list';     // ID of the references list
	const scrollBehavior = 'smooth';        // Scroll behavior ('smooth' or 'auto')

	// Prefixes for generated IDs
	const refIdPrefix = 'ref-';
	const occurrenceIdPrefix = 'ref-occurrence-';

	// Display format for references
	const refFormatText = ', <span class="ref-author">%author%</span>, <span class="ref-date">%date%.</span>'; // %author% and %date% will be replaced

	// Text and styles for back links
	const backLinkText = '↑%index%';   // %index% will be replaced by the occurrence number
	const backLinksSeparator = ', ';     // Separator between back links
	const backLinksMarginLeft = '10px';  // Left margin of the back links container
	const separatorFontSize = '0.8em';   // Font size of the separator
	const separatorColor = '#333333';    // Color of the separator

	// Accessibility attributes
	const backLinkAriaLabel = 'Back to text for reference %refId%, occurrence %index%';
	const refRole = 'link';
	const refTabIndex = '0';

	// Attributes for external links
	const externalLinkTarget = '_blank';
	const externalLinkRel = 'noopener noreferrer';

	// Step 1: Identify all unique references and assign them an ID
	const refElements = document.querySelectorAll(referenceSelector);
	const uniqueUrls = new Map(); // URL -> Reference ID
	const references = new Map(); // ID -> Reference info

	// First pass: identify unique references and assign them an ID
	let nextRefId = 1;
	refElements.forEach(el => {
		const url = el.dataset.url;
		if (!uniqueUrls.has(url)) {
			uniqueUrls.set(url, nextRefId);

			// Ensure attributes are defined and escape special characters
			const title = el.dataset.title || "";
			const author = el.dataset.author || "";
			const date = el.dataset.date || "";

			// Create a new reference entry
			references.set(nextRefId, {
				id: nextRefId,
				url: url,
				title: title,
				author: author,
				date: date,
				occurrences: []
			});

			nextRefId++;
		}
	});

	// Step 2: Process each occurrence in document order
	let occurrenceCounter = 1;

	refElements.forEach(el => {
		const url = el.dataset.url;
		const refId = uniqueUrls.get(url);
		const ref = references.get(refId);

		// Generate an ID for this occurrence
		const occurrenceId = `${occurrenceIdPrefix}${refId}-${occurrenceCounter}`;
		el.id = occurrenceId;

		// Add occurrence information to the reference
		ref.occurrences.push({
			id: occurrenceId,
			index: occurrenceCounter // Use global index to distinguish occurrences
		});

		// Update the element's text
		el.textContent = `[${refId}]`;
		el.setAttribute('role', refRole);
		el.setAttribute('tabindex', refTabIndex);

		// Set up click events
		el.onclick = () => {
			document.getElementById(`${refIdPrefix}${refId}`).scrollIntoView({ behavior: scrollBehavior });
			highlightElement(`${refIdPrefix}${refId}`);
		};

		el.onkeypress = (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				document.getElementById(`${refIdPrefix}${refId}`).scrollIntoView({ behavior: scrollBehavior });
				highlightElement(`${refIdPrefix}${refId}`);
			}
		};

		occurrenceCounter++;
	});

	// Step 3: Generate the references list
	const refList = document.getElementById(refListId);

	// Go through references in order of their ID
	for (let refId = 1; refId < nextRefId; refId++) {
		const ref = references.get(refId);
		const li = document.createElement('li');
		li.id = `${refIdPrefix}${refId}`;

		// Create the reference content
		const refContent = document.createElement('span');

		// Create the link
		const refLink = document.createElement('a');
		refLink.href = ref.url;
		refLink.textContent = ref.title;
		refLink.target = externalLinkTarget;
		refLink.rel = externalLinkRel;
		refContent.appendChild(refLink);

		// Add metadata (author, date)
		if (refFormatText.includes('<span')) {
			const formattedText = refFormatText
				.replace('%author%', ref.author)
				.replace('%date%', ref.date);
			const textContainer = document.createElement('span');
			textContainer.innerHTML = formattedText;
			refContent.appendChild(textContainer);
		} else {
			const formattedText = refFormatText
				.replace('%author%', ref.author)
				.replace('%date%', ref.date);
			refContent.appendChild(document.createTextNode(formattedText));
		}

		li.appendChild(refContent);

		// Create container for back links
		const backLinksContainer = document.createElement('span');
		backLinksContainer.classList.add('back-links-container');
		backLinksContainer.style.marginLeft = backLinksMarginLeft;
		li.appendChild(backLinksContainer);

		// Use a Set to track reference numbers already added
		// We only want to display one back link per reference number
		const addedRefIds = new Set();

		// Add back links
		ref.occurrences.forEach((occurrence, idx) => {
			// If we've already added a back link for this reference, skip
			if (addedRefIds.has(refId)) {
				return;
			}

			// Add a separator if this isn't the first link
			if (backLinksContainer.childNodes.length > 0) {
				const separator = document.createElement('span');
				separator.textContent = backLinksSeparator;
				separator.style.fontSize = separatorFontSize;
				separator.style.color = separatorColor;
				backLinksContainer.appendChild(separator);
			}

			// Create the back link
			const backLink = document.createElement('a');
			backLink.classList.add('back-to-text');
			backLink.textContent = backLinkText.replace('%index%', refId);
			backLink.href = `#${occurrence.id}`;

			// Configure accessibility
			const ariaLabelText = backLinkAriaLabel
				.replace('%refId%', refId)
				.replace('%index%', idx + 1); // Index relative to the reference
			backLink.setAttribute('aria-label', ariaLabelText);

			// Configure click event
			backLink.onclick = (e) => {
				e.preventDefault();

				const element = document.getElementById(occurrence.id);

				// Center the element in the window
				const elementRect = element.getBoundingClientRect();
				const absoluteElementTop = elementRect.top + window.pageYOffset;
				const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);

				window.scrollTo({
					top: middle,
					behavior: scrollBehavior
				});

				// Apply highlighting
				highlightElement(occurrence.id);
			};

			backLinksContainer.appendChild(backLink);

			// Mark this reference as already added
			addedRefIds.add(refId);
		});

		refList.appendChild(li);
	}

	// Function to highlight an element
	function highlightElement(id) {
		const element = document.getElementById(id);
		element.classList.add(highlightClass);
		setTimeout(() => {
			element.classList.remove(highlightClass);
		}, highlightDuration);
	}
});