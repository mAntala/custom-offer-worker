import fs from 'node:fs';
import { program } from 'commander';
import { load } from 'cheerio';
import {
    tasksPipeline,
    fetchWebsite,
    convertBulletsToList,
    removeLinkTags,
    removeEmptyParagraphs,
    wrapBrToParagraph,
} from './utils/helpers.js';

program
    .name('Custom offer worker')
    .description('Scraper, that will get and create custom offers')
    .version('1.0.0');

program
    .command('get')
    .description('Get data from provided URL with CSS selector and save it to file')
    .argument('<url>', 'URL to scrape')
    .requiredOption('-s, --selector <selector>', 'CSS selector to extract data')
    .requiredOption('-d, --dir <folder>', 'Directory to save the extracted data')
    .option('-f, --file <file>', 'File to save the extracted data', 'index.html')
    .action(async (url, options) => {
        try {
            console.log(`🚀 Getting data from ${url}`);

            const data = await fetchWebsite(url);
            const $ = load(data);
            const content = $(options.selector);
            const fileName = options.file || 'index.html';

            if (content.length === 0) {
                console.warn(`🥲 No elements found with selector: ${options.selector}`);
                return;
            }

            let offerHtml = '';
            content.each((index, element) => {
                const siteHtml = $(element).html();
                const tasksResult = tasksPipeline(siteHtml, [
                    removeLinkTags,
                    wrapBrToParagraph,
                    removeEmptyParagraphs,
                    convertBulletsToList,
                ]);
                offerHtml += tasksResult;
            });

            const dirPath = `offers/${options.dir}`;
            fs.mkdirSync(dirPath, { recursive: true });

            const filePath = `${dirPath}/${fileName}`;
            fs.writeFileSync(filePath, offerHtml);

            console.log(`✅ Successfully saved data to: ${filePath}`);
        } catch (error) {
            console.error('❌ Error:', error.message);
            process.exit(1);
        }
    });

program.parse();
