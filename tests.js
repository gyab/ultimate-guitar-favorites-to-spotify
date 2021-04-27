const puppeteer = require('puppeteer');
const INPUT_USERNAME_SELECTOR = '._12b3b._10B_q._1icVK';
const GDPR_SELECTOR = 'css-cdi241';

const TAB_SELECTOR = '._2amQf a';
const ARTIST_TEST = 'The Velvet Underground';
const SONG_TEST = 'Sweet Jane'

handleError = (reason) => {
    console.log(reason);
    process.exit(1);
};

module.exports = (async () => {
    console.log(new Date() + ' script start');
    const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ],
        slowMo: 50
      }).catch(handleError);
    //const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true}).catch(handleError);
    const page = await browser.newPage().catch(handleError);
    page.on('console', msg => {
        for (let i = 0; i < msg.args.length; ++i)
            console.log(`${i}: ${msg.args[i]}`);
    });
    await page.goto('https://www.ultimate-guitar.com/', {
        timeout: 0
    }).catch(handleError);
    await page.waitFor(2000).catch(handleError);
    //await page.click(GDPR_SELECTOR).catch(handleError);
    await page.evaluate((GDPR_SELECTOR) => {
        const gdpr_button = document.getElementsByClassName(GDPR_SELECTOR);
        if (gdpr_button) {
            gdpr_button[0].click();
        }
    }, GDPR_SELECTOR).catch(handleError);
    await page.waitFor(2000).catch(handleError);
    await page.evaluate(() => {
        const spans = document.querySelectorAll('span');
        for (const span in spans) {
            if (spans[span].innerText === "LOG IN") 
                spans[span].click();
        }
    }).catch(handleError);
    await page.waitFor(2000).catch(handleError);
    await page.click(INPUT_USERNAME_SELECTOR).catch(handleError);
    await page.keyboard.type(username).catch(handleError);
    await page.keyboard.press('Tab').catch(handleError);
    await page.keyboard.type(password).catch(handleError);
    await page.keyboard.press('Enter').catch(handleError);
    await page.waitFor(2000).catch(handleError);
    await page.goto('https://www.ultimate-guitar.com/user/mytabs', {
        timeout: 0
    }).catch(handleError);
    await page.waitFor(2000).catch(handleError);
    await page.evaluate(() => {
        const pageButtons = document.querySelectorAll("._3P7G9");
        let hasBeenClicked = false;
        for(let button in pageButtons) {
            if (pageButtons[button] && pageButtons[button].innerText === "ALL") {
                hasBeenClicked = true;
                break;
            }
        }
        if (!hasBeenClicked) handleError();
    }).catch(handleError);
    const [artist, song] = await page.evaluate((sel) => {
        const allLinks = document.querySelectorAll(sel);
        return [
            allLinks[0].innerText.trim(),
            allLinks[1].innerText.trim()
        ];
    }, TAB_SELECTOR).catch(handleError);
    if (artist !== ARTIST_TEST || song !== SONG_TEST) {
        handleError('invalid artist or song');
    }
    await browser.close().catch(handleError);
    console.log(new Date() + ' script ended');
})();

