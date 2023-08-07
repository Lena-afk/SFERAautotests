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
  await page.goto('https://www.youtube.com/')
  await page.setViewport({width: 1000, height: 600})
  await delay(3000)

  await (await page.waitForXPath ('//input [@id = "search"]')).click()
  await (await page.waitForXPath ('//input [@id = "search"]')).type("QA")
  try{
    await (await page.waitForXPath ('//input [@id = "searchge554656tyugygjh"]')).type("QA")
    console.log("Не работает")
  } catch(err){
    await (await page.waitForXPath ('//input [@id = "search"]')).type("QA")
    redLog("Работает")
  }

  await delay(1000)
  await page.keyboard.press('Enter')
  await (await page.waitForXPath ('(//a [@id= "video-title"])[1]')).click()
  await delay(1000)
 
  await page.mouse.move (674,20)
  await delay (1000)
  await page.mouse.click(674,20)
  await delay(1000)

  await page.mouse.move (611,477)
  await delay (1000)
  await page.mouse.click(611,477)
})()