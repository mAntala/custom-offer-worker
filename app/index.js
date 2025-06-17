import fs from 'node:fs';
import { program } from 'commander';
import { load } from 'cheerio';
import { fetchWebsite, convertBulletsToList } from './utils/helpers.js';

program
    .name('Custom offer worker')
    .description('Scraper, that will get and create custom offers')
    .version('1.0.0');

program
    .command('get')
    .argument('<url>', 'URL to scrape')
    .requiredOption('--selector <selector>', 'CSS selector to extract data')
    .requiredOption('--folder <folder>', 'File to save the extracted data')
    .option('--file <file>', 'File to save the extracted data', 'index.html')
    .action((url, options) => {
        console.log(`Getting data from ${url}`);

        fetchWebsite(url)
            .then((data) => {
                const $ = load(data);
                const content = $(options.selector);
                const fileName = options.file || 'index.html';

                let fullHtml = '';

                content.each((index, element) => {
                    const siteHtml = $(element).html();
                    const offerHtml = convertBulletsToList(siteHtml);
                    fullHtml += offerHtml;
                });

                if(!fs.existsSync(options.folder)) {
                    fs.mkdirSync('offers', { recursive: true });
                }

                if(!fs.existsSync(`offers/${options.folder}`)) {
                    fs.mkdirSync(`offers/${options.folder}`, { recursive: true });
                }

                fs.writeFile(`offers/${options.folder}/${fileName}`, fullHtml, (err) => {
                    if(err) {
                        throw new Error(`Error writing file: ${err.message}`);
                    }
                });
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    });

program.parse();
