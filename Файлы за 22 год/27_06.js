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
  await page.goto('https://shazoo.ru/')
  await page.setViewport({width:1000, height:600})
  await delay(5000)

  let news=[]
  let platforms=[]
  let articles=[]
  let more=[]
//Подсчет количества элементов
  const countText = await page.$x("(//a [@href='/news'])[1]/..//a[@class='block px-4 py-2 hover:bg-gray-800' and text()]")
  const read = countText.length
  console.log(read)

//Заполним массив с Новостями
await page.mouse.move(172,28)
for (var i=1; i <= read; i++) {
  try{
    let element=await page.waitForXPath("((//a [@href='/news'])[1]/..//a[@class='block px-4 py-2 hover:bg-gray-800' and text()])["+i+"]", {timeout:500})
    let value= await page.evaluate(element=>element.textContent,element)
    news.push(value)
    console.log("Новости", value)

  } catch(err){
    console.log("Новости", "xpath не найден")
  }
}

//Подсчет количества элементов
const countText1 = await page.$x("(//a [@href='/platforms'])[1]/..//a[@class='block px-4 py-2 hover:bg-gray-800' and text()]")
const read1 = countText1.length
console.log(read1)

//Заполним массив с Платформами
await page.mouse.move(280,24)
for (var i=1; i <= read1; i++) {
  try{
    let element=await page.waitForXPath("((//a [@href='/platforms'])[1]/..//a[@class='block px-4 py-2 hover:bg-gray-800' and text()])["+i+"]", {timeout:500})
    let value= await page.evaluate(element=>element.textContent,element)
    platforms.push(value)
    console.log("Платформы", value)

  } catch(err){
    console.log("Платформы", "xpath не найден")
  }
}

//Подсчет количества элементов
const countText2 = await page.$x("(//a [@href='/editorial'])[1]/..//a[@class='block px-4 py-2 hover:bg-gray-800' and text()]")
const read2 = countText2.length
console.log(read2)


//Заполним массив со Статьями
await page.mouse.move(365,35)
for (var i=1; i <= read2; i++) {
  try{
    let element=await page.waitForXPath("((//a [@href='/editorial'])[1]/..//a[@class='block px-4 py-2 hover:bg-gray-800' and text()])["+i+"]", {timeout:500})
    let value= await page.evaluate(element=>element.textContent,element)
    articles.push(value)
    console.log("Статьи", value)

  } catch(err){
    console.log("Статьи", "xpath не найден")
  }
}

//Подсчет количества элементов
const countText3 = await page.$x("(//a [@href='/discounts'])[1]/..//a[@class='block px-4 py-2 hover:bg-gray-800' and text()]")
const read3 = countText3.length
console.log(read3)


//Заполним массив с Большей информацией
await page.mouse.move(444,32)
for (var i=1; i <= read3; i++) {
  try{
    let element=await page.waitForXPath("((//a [@href='/discounts'])[1]/..//a[@class='block px-4 py-2 hover:bg-gray-800' and text()])["+i+"]", {timeout:500})
    let value= await page.evaluate(element=>element.textContent,element)
    more.push(value)
    console.log("Больше", value)

  } catch(err){
    console.log("Больше", "xpath не найден")
  }
}

await delay(1000)
await browser.close()
})()