const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');

function delay(time) {
  return new Promise(function(resolve) {
      setTimeout(resolve, time)
  });
}

(async () => {
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  await page.goto('https://www.purina.ru/dogs/breed-library')

  //Выбрать любую собаку
  await (await page.waitForXPath("//input[@class='form-autocomplete form-text ui-autocomplete-input']",{timeout:5000})).click({clickCount:3})
  await page.keyboard.type("Японский сиба-ину")
  await page.keyboard.press("Enter")
  await delay(500)

  await (await page.waitForXPath("//span[text()='Японский сиба-ину']")).click()

  await delay(1000)

  const imgUrl = await page.$eval('#block-nppe-purinamain-theme-content > article > div > div > div.nppe-bs-breed-box-image > img', img => img.src)

  https.get(imgUrl, res => {
    const stream = fs.createWriteStream('dog.png');
    res.pipe(stream);
    stream.on('finish', () => {
      stream.close();
    })
  })
  
  await browser.close()
} )()