/**
 * Utility functions for processing HTML content.
 * These functions can be used to clean up and format HTML data extracted from web pages.
 * @param {string} url - The URL of the website to fetch.
 * @returns {Promise<string>} - The HTML content of the website.
 */
export const fetchWebsite = async (url) => {
    try {
        const request = await fetch(url);

        if (!request.ok) {
            throw new Error(`HTTP error! status: ${request.status}`);
        }

        const response = await request.text();
        return response;
    } catch (error) {
        console.error('❌ Error fetching website:', error.message);
        throw error;
    }
};

/**
 * Converts bullet points in text to an HTML list.
 * @param {string} text - The input text containing bullet points.
 * @returns {string} - The text with bullet points converted to an HTML list.
 */
export function convertBulletsToList(text) {
    const parts = text.includes('-') ? text.split('-') : [text];

    const listItems = parts.map((item) => item.trim()).filter((item) => item.length > 0);

    if (listItems.length === 0) {
        return text;
    }

    const hasIntro = !text.trim().startsWith('-');
    const intro = hasIntro ? listItems.shift() : '';

    const listItemsHtml = listItems.map((item) => `<li>${item}</li>`).join('\n');

    const result = hasIntro
        ? `${intro}\n<ul>\n${listItemsHtml}\n</ul>`
        : `<ul>\n${listItemsHtml}\n</ul>`;

    return result;
}

/**
 * Processes a series of tasks on the input data.
 * @param {string} input - The input data to process.
 * @param {Array<Function>} tasks - An array of functions to apply to the input.
 * @returns {string} - The processed data after applying all tasks.
 */
export function tasksPipeline(input, tasks) {
    let result = input;

    for (const task of tasks) {
        result = task(result);
    }

    return result;
}

/**
 * Removes link tags from the text.
 * @param {string} text - The input text containing link tags.
 * @returns {string} - The text with link tags removed.
 */
export function removeLinkTags(text) {
    return text.replace(/<a[^>]*>(.*?)<\/a>/g, '$1');
}

/**
 * Removes <br> tags from the text.
 * @param {string} text - The input text containing <br> tags.
 * @returns {string} - The text with <br> tags removed.
 * @note Currently not in use
 */
export function removeBrTags(text) {
    return text.replace(/<br\s*\/?>/g, '\n');
}

/**
 * Removes empty paragraphs from the text.
 * @param {string} text - The input text containing paragraphs.
 * @returns {string} - The text with empty paragraphs removed.
 */
export function removeEmptyParagraphs(text) {
    return text.replace(/<p>\s*<\/p>/g, '');
}

/**
 * Wraps <br> tags in paragraphs.
 * @param {string} text - The input text containing <br> tags.
 * @returns {string} - The text with <br> tags wrapped in <p>
 */
export function wrapBrToParagraph(text) {
    const parts = text
        .split(/<br\s*\/?>/gi)
        .map((part) => part.trim())
        .filter((part) => part.length > 0);

    if (parts.length === 0) {
        return text;
    }

    return parts.map((part) => `<p>${part}</p>`).join('');
}
