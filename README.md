# Academic Reference System

A lightweight JavaScript library for managing academic references and citations in HTML documents. This system creates numbered references that are clickable and links back to where they appear in the text.

## Features

-   **Automatic reference numbering** based on unique URLs
-   **Clickable references** that smoothly scroll to the reference list
-   **Back links** from the reference list to each occurrence in the text
-   **Visual highlighting** of references when clicked
-   **Fully customizable** through CSS and configuration variables
-   **Accessibility support** with keyboard navigation and ARIA attributes
-   **Support for multiple occurrences** of the same reference
-   **Proper handling** of special characters and edge cases

## Examples
![2025-04-13 15 59 50](https://github.com/user-attachments/assets/bf277e84-de50-465a-944c-afbafb38222d)
![2025-04-13 15 59 58](https://github.com/user-attachments/assets/dcfc014f-bd86-4232-bf00-37865273d6a5)

## Demo

Check out the [demo page](https://marc-alexis.fun/references/refs.html) to see all features in action.

## Installation

1. Clone this repository or download the files
2. Include the references.js script in your HTML:

```html
<script src="./js/references.js"></script>
```

3. Include the CSS styles (or customize them to your needs)
4. Add references to your document as described below

## Usage

### Basic Structure

Your HTML document should include:

1. References in the text using spans with the `reference` class
2. A container (usually an ordered list) with the id `reference-list`

Example:

```html
<p>
	Here is a reference
	<span class="reference" data-url="https://example.com/article" data-title="Article Title" data-author="Author Name" data-date="2023"></span>
	in your text.
</p>

<!-- Later in the document -->
<h2>References</h2>
<ol id="reference-list"></ol>
```

### Reference Attributes

Each reference span should have the following data attributes:

-   `data-url` (required): The URL of the reference
-   `data-title` (optional): The title of the reference
-   `data-author` (optional): The author(s) of the reference
-   `data-date` (optional): The date or year of the reference

### Configuration Options

You can customize the library by modifying the configuration variables at the top of the `references.js` file:

```javascript
// Configuration variables
const highlightDuration = 2000; // Highlight duration in milliseconds
const highlightClass = "reference-highlight"; // CSS class for highlighting
const referenceSelector = ".reference"; // Selector for reference elements
const refListId = "reference-list"; // ID of the references list
const scrollBehavior = "smooth"; // Scroll behavior ('smooth' or 'auto')

// Prefixes for generated IDs
const refIdPrefix = "ref-";
const occurrenceIdPrefix = "ref-occurrence-";

// Display format for references
const refFormatText = ', <span class="ref-author">%author%</span>, <span class="ref-date">%date%.</span>';

// Text and styles for back links
const backLinkText = "↑%index%"; // %index% will be replaced by the occurrence number
const backLinksSeparator = ", "; // Separator between back links
```

## CSS Customization

The library adds several classes that you can style:

-   `.reference`: The reference numbers in the text
-   `.reference-highlight`: Applied to elements when they are highlighted
-   `.back-to-text`: Back links in the reference list
-   `.ref-author`: The author span in references
-   `.ref-date`: The date span in references
-   `.back-links-container`: Container for back links

Example CSS (included in demo):

```css
.reference {
	cursor: pointer;
	font-weight: bold;
	color: #2874a6;
	padding: 0 2px;
}

.reference-highlight {
	background-color: #ffeaa7;
	transition: background-color 0.5s ease;
}

.ref-author {
	font-style: italic;
}

.ref-date {
	font-weight: bold;
}

.back-to-text {
	color: #2874a6;
	text-decoration: none;
	font-weight: bold;
}

.back-to-text:hover {
	text-decoration: underline;
}
```

## Accessibility

The library implements several accessibility features:

-   Keyboard navigation for references
-   ARIA labels for back links
-   Proper roles for interactive elements

## Browser Compatibility

Tested and working in:

-   Chrome 90+
-   Firefox 88+
-   Safari 14+
-   Edge 90+

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
