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
  await page.goto('http://the-internet.herokuapp.com/drag_and_drop')
  await page.setViewport({width: 1000, height: 600})
  await delay(3000)

  await page.mouse.move (88,162);
  await page.mouse.down();
  await page.mouse.move (304,148);
  await page.mouse.up();
 
})()