const puppeteer = require('puppeteer'); //Подключение модуля (билбиотеки puppeteer)

//Объявление глобальной функции js (функция для паузы)
function delay(time) {
  return new Promise(function(resolve) {
      setTimeout(resolve, time)
  });
}

//Асинхронный блок
(async () => {
  const browser = await puppeteer.launch({headless: false}) //Запуск браузера (безголовной режим отключен)
  const page = await browser.newPage() //Объявление переменной page
  await page.goto('http://the-internet.herokuapp.com/checkboxes') //Команда перехода по ссылке
  await delay(3000)

  const checkbox_1 = "(//input[@type='checkbox'])[1]"
  const checkbox_2 = "(//input[@type='checkbox'])[2]"
  await delay(1500)

  await (await page.waitForXPath(checkbox_1)).click()
  await delay(1500)

  await (await page.waitForXPath(checkbox_2)).click()
  await delay(1500)

  await (await page.waitForXPath(checkbox_1)).click()
  await delay(1500)

  await (await page.waitForXPath(checkbox_1)).click()
  await delay(1500)

  await (await page.waitForXPath(checkbox_2)).click()
  await delay(1500)

  await (await page.waitForXPath(checkbox_1)).click()
})()