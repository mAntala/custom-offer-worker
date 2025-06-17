export const fetchWebsite = async(url) => {
    const request = await fetch(url);

    if (!request.ok) {
        throw new Error(`HTTP error! status: ${request.status}`);
    }

    const response = await request.text();
    return response;
}

export function convertBulletsToList(text) {
    const parts = text.split('•');
    
    const listItems = parts
        .map(item => item.trim())
        .filter(item => item.length > 0);
    
    if (listItems.length === 0) {
        return text;
    }
    
    const hasIntro = !text.trim().startsWith('•');
    const intro = hasIntro ? listItems.shift() : '';
    
    const listItemsHtml = listItems
        .map(item => `<li>${item}</li>`)
        .join('\n');
    
    const result = hasIntro 
        ? `${intro}\n<ul>\n${listItemsHtml}\n</ul>`
        : `<ul>\n${listItemsHtml}\n</ul>`;
    
    return result;
}