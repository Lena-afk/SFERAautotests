const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const { del } = require('request');

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
  await page.goto('https://its-tula.appmath.ru/')

  names1 = ['Детекторы транспорта', 'Проезды и нарушения', 'Прогноз транспортной обстановки', 'Светофорные объекты', 
  'Видеонаблюдение', 'Проиcшествия', 'Работоспособность оборудования', 'Информирование на дорогах', 'Общественный транспорт', 
  'Парковочное пространство', 'Состояние дорог', 'Уведомления', 'Отчеты и аналитика']
  
  names2 = []

  await(await page.waitForXPath("(//input[@class='loginLandscape__input'])[1]")).type("spiridonov_fl")
  await(await page.waitForXPath("(//input[@class='loginLandscape__input'])[2]")).type("mtb!9@-s#Y[MMjX!")
  await delay (10000)
  await(await page.waitForXPath("//button[contains (text(), 'Войти')]")).click()

  //Подсчет количества разделов
  await delay(2000)
  const countText = await page.$x("//button[@class='btn modules__module' and text()]", {timeout:5000})
  const count1 = countText.length
  console.log(count1)

  //Запись в массив
  for(a=1;a<=count1;a++){
    await delay(2000)
    await(await page.waitForXPath("(//div[@class='modules']/button[text()])["+a+"]", {timeout:15000})).click() 

    await delay(2000)
    let element = await page.waitForXPath("(//div[@class='modules']/button[text()])["+a+"]", {timeout:15000})
    let value = await page.evaluate(element => element.textContent, element)

    let value_edit = value.trim()
    names2.push(value_edit)

    await(await page.waitForXPath("//button[@class='btn back landscape__back']")).click() 
    
}

  //Проверка
  for (a=0; a<count1; a++) {
    await delay(500)
    if (names1[a]=== names2[a]) {
        console.log(a + " Совпадает")
    }
    else {
        redLog(a + " Не совпадает")
    }
  }
  console.log (names2)


  await browser.close()
} )()