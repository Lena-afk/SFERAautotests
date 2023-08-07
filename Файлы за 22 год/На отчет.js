const puppeteer = require('puppeteer');

function delay(time) {
  return new Promise(function(resolve) {
      setTimeout(resolve, time)
  });
}

async function redLog(str){
    console.log("\x1b[41m%s\x1b[0m", str)
  }
async function greenLog(str){
    console.log("\x1b[32m%s\x1b[0m", str)
  }
  
(async () => {
  const browser = await puppeteer.launch({headless: false, slowMo:100})
  const page = await browser.newPage()
  await page.goto('https://its-tula.appmath.ru/')
  await page.setViewport({width:1400, height:600})

  //TODO

  names1 = ['Детекторы транспорта', 'Проезды и нарушения', 'Прогноз транспортной обстановки', 'Светофорные объекты', 
  'Видеонаблюдение', 'Проиcшествия', 'Работоспособность оборудования', 'Информирование на дорогах', 'Общественный транспорт', 
  'Парковочное пространство', 'Состояние дорог', 'Уведомления', 'Отчеты и аналитика']
  
  names2 = []

  subnames1 = ['Детекторы транспорта', 'Wi-Fi', 'КФВФ', 'ВГК', 'Транзитные потоки', 'Поиск фиксаций', 'Активные планы', 
  'Выбор плана координации', 'Перейти в управление СО', 'Ситуационный центр', 'ДТП', 'Потенциально опасные и аварийные участки', 
  'УДЗ', 'Табло отображения информации', 'Управление ТОИ', 'Парковки', 'Нарушения на парковках' , 'Службы эвакуации', 'Освещение', 
  'Метеостанции', 'Экология', 'Ремонты', 'Перекрытия', 'Цифровая карта', 'Сводная информация', 'Отчёты', 'Аналитические графики']

  subnames2 = []

  await(await page.waitForXPath("(//input[@class='loginLandscape__input'])[1]")).type("egorov_admin")
  await(await page.waitForXPath("(//input[@class='loginLandscape__input'])[2]")).type("1Asw34!")
  // await delay (10000)
  await(await page.waitForXPath("//button[contains (text(), 'Войти')]", {timeout:10000})).click()

  //Подсчет количества разделов
  await delay(2000)
  const countText = await page.$x("//button[@class='btn modules__module' and text()]", {timeout:5000})
  const count1 = countText.length
  console.log(count1)

  //Запись в массив
  for(a=1;a<=count1;a++){
    await delay(500)
    await(await page.waitForXPath("(//div[@class='modules']/button[text()])["+a+"]", {timeout:15000})).click() 

    let element = await page.waitForXPath("(//div[@class='modules']/button[text()])["+a+"]", {timeout:15000})
    let value = await page.evaluate(element => element.textContent, element)

    let value_edit = value.trim()
    names2.push(value_edit)

    //Подсчет количества подразделов
    await delay(2000)
    const countText = await page.$x("//div[@class='scrollbar menu__right']//button[@class='btn layer__header' and text()]", {timeout:3000})
    const count2 = countText.length
    console.log(count2)

    //Запись в массив подразделов
    try{
        for(i=1;i<=count2;i++) {
          let element1 = await page.waitForXPath("(//div[@class='scrollbar menu__right']//button[@class='btn layer__header' and text()])["+i+"]", {timeout:15000})
          let value1 = await page.evaluate(element1 => element1.textContent, element1)
      
          let value_edit1 = value1.trim()
          subnames2.push(value_edit1)
        }
  
      } catch{}

    await(await page.waitForXPath("//button[@class='btn back landscape__back']")).click() 
    
}

subnames2.splice(6, 0, 'Активные планы')
  //Проверки
  redLog("Проверка разделов")
  for (a=0; a<names1.length; a++) {
    await delay(500)
    if (names1[a]=== names2[a]) {
        console.log(names1[a] + '=' + names2[a] + " - Совпадает")
    }
    else {
        redLog(names1[a] + '=' + names2[a] + " - Не совпадает")
    }
  }

  redLog("Проверка подразделов")

  for (a=0; a<subnames1.length; a++) {
    await delay(500)
    if (subnames1[a]=== subnames2[a]) {
        console.log(subnames1[a] + ' = ' + subnames2[a] + " - Совпадает")
    }
    else {
        redLog(subnames1[a] + ' = ' + subnames2[a] + " - Не совпадает")
    }
  }
  await page.reload()
  await delay(1000)

  //Открываем раздел Происшествия -> ДТП -> Отметить ДТП
  await(await page.waitForXPath("//button[contains (text(),'"+names2[5]+"')]", {timeout:5000})).click()
  await delay(500)
  await(await page.waitForXPath("//button[contains (text(),'"+subnames2[10]+"')]", {timeout:5000})).click()
  await delay(500)
  await(await page.waitForXPath("//span[contains(text(),'Отметить ДТП')]")).click()
  await delay(500)

  await page.mouse.move(733,452)
  await delay(500)
  await page.mouse.click(733,452)
  //Проверить все в окне создания ДТП

  //Отметить ДТП на карте 




  await delay(2000)
  await browser.close()
} )()
