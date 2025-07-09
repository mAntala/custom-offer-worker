
# Custom offer worker

Simple Node.js program to get text from website as formatted HTML.

## Before use
Clone this repository, then navigate to `/app` and use `npm install` to install all dependencies.

## Usage
Use `node app/index.js get <URL>` or navigate to `app` folder and use `node index.js get <URL>`

As alternative, you can use `npm run get-offers <URL> -- *rest of your arguments*`

### Arguments
- `-s, --selector` - required - CSS selector to get text from
- `-d, --dir` - required - name of folder to save file to
- `-f, --file` - optional - name of file to save HTML output 

### Example
`node index.js get https://www.amazon.jobs/en/jobs/2999737/account-manager-german-speaker-amazon-business-amazon-business -s '#job-detail-body .section' -d PROFM-12345 -f index-24.html`


## Bugs
- [x] If there is search param, e. g. `someurl.com?param=true`, program return error
- [ ] CSS selectors has to be inside single or doble quates `'` or `"`