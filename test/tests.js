const puppeteer = require('puppeteer');
const Nexmo = require('nexmo');
const ENV = require('./env');

const SIGN_UP_SELECTOR = '.js-auth-sign-in-btn';
const INPUT_USERNAME_SELECTOR = '.sign_in .ug-auth--input';
const INPUT_PASSWORD_SELECTOR = '.sign_in .ug-auth--input';
const SUBMIT_LOGIN_SELECTOR = '.ug-auth--btn__success';
const TAB_SELECTOR = '.tr__lg.tr__actionable.js-favorite';
const ARTIST_SELECTOR = TAB_SELECTOR + ' td:nth-child(1)';
const SONG_SELECTOR = TAB_SELECTOR + ' td:nth-child(2)';
const ARTIST_TEST = 'The Velvet Underground';
const SONG_TEST = 'Sweet Jane';

(async () => {
    console.log('script start');
    const nexmo = new Nexmo({
        apiKey: ENV.NEXMO_API_KEY,
        apiSecret: ENV.NEXMO_API_SECRET
    })
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.ultimate-guitar.com/');
    await page.click(SIGN_UP_SELECTOR);
    await page.waitFor(1000);
    await page.click(INPUT_USERNAME_SELECTOR);
    await page.keyboard.type(ENV.username); 
    await page.keyboard.press('Tab');
    await page.keyboard.type(ENV.password); 
    await page.click(SUBMIT_LOGIN_SELECTOR);
    await page.waitFor(1000);
    await page.goto('https://www.ultimate-guitar.com/user/mytabs');
    await page.waitFor(1000);
    const artist = await page.evaluate((sel) => {
        return document.querySelector(sel).innerText.trim();
    }, ARTIST_SELECTOR);
    const song = await page.evaluate((sel) => {
        return document.querySelector(sel).innerText.trim();
    }, SONG_SELECTOR);
    if (artist !== ARTIST_TEST || song !== SONG_TEST) {
        const from = 'ug to spotify';
        const to = env.number;
        const text = 'it seems to be a problem with the extension';
        nexmo.message.sendsms(from, to, text);
        console.log('error, message sent');
    }
    console.log('script ended');
    await browser.close();
})();
