const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });

    await page.goto('https://www.javascripttutorial.net/sample/webapis/drag-n-drop-basics/');

    await page.waitForSelector('.item');
    const draggable = await page.$('.item')
    const droppable = await page.$('.box:nth-of-type(2)');
    await page.setDragInterception(true);
    // This is where the actual issue is
    console.log('Before drag and drop');
    await draggable.dragAndDrop(droppable);
    console.log('After drag and drop');

    await page.screenshot({ path: './image.jpg', type: 'jpeg' });
    await browser.close();
})();