const puppeteer = require('puppeteer');
const Nexmo = require('nexmo');
const ENV = require('./env');

const SIGN_UP_SELECTOR = '._2dYiw';
const INPUT_USERNAME_SELECTOR = '._3pS6m._2_H_L.UAs0U';
const INPUT_PASSWORD_SELECTOR = '._3pS6m._2_H_L.UAs0U';
const SUBMIT_LOGIN_SELECTOR = '.ug-auth--btn__success';
const TAB_SELECTOR = '._335bj a';
const ARTIST_SELECTOR = TAB_SELECTOR + ' td:nth-child(1)';
const SONG_SELECTOR = TAB_SELECTOR + ' td:nth-child(2)';
const ARTIST_TEST = 'The Velvet Underground';
const SONG_TEST = 'Sweet Jane';
const production = ENV.production;
const from = 'ug to spotify';
const to = ENV.number;
const nexmo = new Nexmo({
    apiKey: ENV.NEXMO_API_KEY,
    apiSecret: ENV.NEXMO_API_SECRET
});

handleError = (reason) => {
    if (production) nexmo.message.sendsms(from, to, reason);
    else console.log(reason);
    process.exit(1);
};

(async () => {
    console.log(new Date() + ' script start');
    const browser = await puppeteer.launch().catch(handleError);
    const page = await browser.newPage().catch(handleError);
    page.on('console', msg => {
        for (let i = 0; i < msg.args.length; ++i)
            console.log(`${i}: ${msg.args[i]}`);
    });
    await page.goto('https://www.ultimate-guitar.com/').catch(handleError);
    await page.evaluate(() => {
        const spans = document.querySelectorAll('span');
        for (const span in spans) {
            if (spans[span].innerText === "Sign in")
                spans[span].click();
        }
    }).catch(handleError);
    await page.waitFor(1000).catch(handleError);
    await page.click(INPUT_USERNAME_SELECTOR).catch(handleError);
    await page.keyboard.type(ENV.username).catch(handleError);
    await page.keyboard.press('Tab').catch(handleError);
    await page.keyboard.type(ENV.password).catch(handleError);
    await page.evaluate(() => {
        const spans = document.querySelectorAll('footer span');
        for (const span in spans) {
            if (spans[span].innerText === "SIGN IN") {
                spans[span].click();
            }
        }
    }).catch(handleError);
    await page.waitFor(1000).catch(handleError);
    await page.goto('https://www.ultimate-guitar.com/user/mytabs').catch(handleError);
    await page.waitFor(1000).catch(handleError);
    const [artist, song] = await page.evaluate((sel) => {
        const allLinks = document.querySelectorAll(sel);
        return [
            allLinks[0].innerText.trim(),
            allLinks[1].innerText.trim()
        ];
    }, TAB_SELECTOR).catch(handleError);
    if (artist !== ARTIST_TEST || song !== SONG_TEST) {
        const text = 'it seems to be a problem with the extension';
        if (production) nexmo.message.sendsms(from, to, text);
        console.log('error, message sent');
    }
    await browser.close().catch(handleError);
    console.log(new Date() + ' script ended');
})();

