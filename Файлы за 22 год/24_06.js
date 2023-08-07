const puppeteer = require('puppeteer');

function delay(time) {
  return new Promise(function(resolve) {
      setTimeout(resolve, time)
  });
}

(async () => {
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  await page.goto('https://www.youtube.com/')
  await page.setViewport({width: 1000, height: 600})
  await delay(3000)
  
})()