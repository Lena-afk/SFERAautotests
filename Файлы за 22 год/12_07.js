const puppeteer = require('puppeteer');

function delay(time) {
  return new Promise(function(resolve) {
      setTimeout(resolve, time)
  });
}

async function redLog(str){
    console.log("\x1b[41m%s\x1b[0m", str)
  }
  

(async () => {
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  await page.goto('https://www.adidas.com/us')

  await(await page.waitForXPath("//img[@alt='Superstar Bonega Shoes']")).click()

  await delay(2000)
  await page.screenshot({path: 'pic1.png'})

  await delay(2000)
  let div_selector_to_remove = '#modal-root > div';
  await page.evaluate((sel) => {
    var elements = document.querySelectorAll(sel);
    for (var i=0; i<elements.length; i++) {
        elements[i].parentNode.removeChild(elements[i]);

    }
  }, div_selector_to_remove)

  await delay(1000)
  await page.screenshot({path: 'pic2.png'})

await delay(5000)
await browser.close()
} )()
