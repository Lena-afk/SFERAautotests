const puppeteer = require('puppeteer');
const fs = require('fs');

function delay(time) {
  return new Promise(function(resolve) {
      setTimeout(resolve, time)
  });
}



(async () => {
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  await page.goto('https://notepadonline.ru/app')

  const dataArray = fs.readFileSync('./cats.txt', {encoding:'utf8', flag:'r'});
  
  await(await page.waitForXPath("//textarea[@id='n_text']")).type(dataArray)
  console.log('Открыли')

    
  await browser.close()
} )()