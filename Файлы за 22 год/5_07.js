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
  await page.goto('https://www.purina.ru/cats/breed-library')
  await page.setViewport({width:1200, height:600})
  await delay(3000)

  let cats=[[]]
  
  //Подсчет количества страниц
  const countPages = await page.$x("//li[@class='pager__item']", {timeout:3000})
  const count = countPages.length
  console.log(count)

  //Добавление в массив котиков
  for (i=0;i<=count;i++){
    // await delay(500)
    try{
      await(await page.waitForXPath("(//li[@class='pager__item'])["+i+"]", {timeout:2000})).click()
      // await delay(500)

    } catch(err){
        console.log('Первая страница')
    }
    const countText = await page.$x("//div[@class='results-view-name']", {timeout:3000})
    const count1 = countText.length

    //Добавление в двумерный массив пород и характеристик
      for(a=1;a<=count1;a++){
        try {
        await delay(3000)
        let element = await page.waitForXPath("(//div[@class='results-view-name']/span[text()])["+a+"]", {timeout:5000})
        let value = await page.evaluate(element => element.textContent, element)
        await delay(3000)
        await(await page.waitForXPath("(//div[@class='results-view-name']/span[text()])["+a+"]", {timeout:5000})).click()
        let element1 = await page.waitForXPath("//li[@class='traffic-light-char-none' and text()]", {timeout:5000})
        let value1 = await page.evaluate(element1 => element1.textContent, element1)
        cats.push("["+value+"]:["+value1+"]")
        // console.log(cats)
        // await delay(500)
        await(await page.waitForXPath("//a[text()='Библиотека пород']", {timeout:5000})).click()

        await delay(500)
        try{
          await delay(500)
          await(await page.waitForXPath("(//li[@class='pager__item'])["+i+"]", {timeout:500})).click()
          // await delay(1000)

        } catch(err){
            console.log('Первая страница')
        }
        }catch{}
        }
  }
  // console.log(cats)

  //Выбираем поиск и вводим породу
  // const handle=await page.waitForXPath("//a[text()='Линия заботы']", {timeout:5000})
  // await page.hover(handle)
  await page.reload()
  // await delay(3000)
  try{
  await page.waitForXPath("//div[@class='results-content']",{timeout:10000})
  } catch {console.log('Потрачено')}
  // await page.mouse.click(139,288)
  await (await page.waitForXPath("//input[@class='form-autocomplete form-text ui-autocomplete-input']",{timeout:5000})).click({clickCount:3})
  await page.keyboard.type("Турецкий Ван")
  await page.keyboard.press("Enter")
  await delay(500)
  //Заменим породу котика в поиске
  await (await page.waitForXPath("//input[@class='form-autocomplete form-text ui-autocomplete-input']",{timeout:5000})).click({clickCount:3})
  // await page.mouse.click({clickCount:3})
  await page.keyboard.type("Сиамская")
  await page.keyboard.press("Enter")
  await delay(500)
  await page.screenshot({path:'screen_cats_search.png'})
  //Создадим файл в формате txt с данными из массива
  fs.writeFileSync('cats.txt', JSON.stringify(cats));
  
  // await browser.close()
} )()