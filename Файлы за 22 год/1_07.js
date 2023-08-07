const puppeteer = require('puppeteer');
const { scrollPageToBottom } = require('puppeteer-autoscroll-down');

function delay(time) {
  return new Promise(function(resolve) {
      setTimeout(resolve, time)
  });
}

(async () => {
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    await page.goto('https://kleki.com')
    await page.setViewport({width:1000, height:600})

    async function DnD([x,y],[x1,y1]){
        await page.mouse.move(x,y)
        await delay(500)
        await page.mouse.down()
        await delay(500)
        await page.mouse.move(x1,y1)
        await delay(500)
        await page.mouse.up()
        await delay(500)
    }

    await DnD([300,300],[300,100])
    await DnD([300,100],[500,100])
    await DnD([500,100],[500,300])
    await DnD([500,300],[300,300])
    await DnD([300,300],[400,400])
    await DnD([400,400],[500,300])
    await delay(1000)
    await browser.close()
})()