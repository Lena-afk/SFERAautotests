const fs = require('fs');
const https = require('https');

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
  }
   
async function downloadWithLinks() {
   const browser = await puppeteer.launch({
       headless: false
   });
   const page = await browser.newPage();
   await page.goto(
      'https://unsplash.com/photos/tn57JI3CewI', 
      { waitUntil: 'networkidle2' }
   );
   const imgUrl = await page.$eval('._2UpQX', img => img.src);        
   https.get(imgUrl, res => {
      const stream = fs.createWriteStream('somepic.png');
      res.pipe(stream);
      stream.on('finish', () => {
         stream.close();
      })
   })

   await delay(500)
   browser.close()
}