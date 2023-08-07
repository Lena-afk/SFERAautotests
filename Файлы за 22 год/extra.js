//это замена к puppeteer, для добавления дополнений
const puppeteer = require("puppeteer-extra");

//пакет StealthPlugin для предотвращения обнаружения
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

//пакет AdblockerPlugin, блокирующий рекламу и трекеров
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");

puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

function delay(time) {
  return new Promise(function(resolve) {
      setTimeout(resolve, time)
  });
}

//Используется другая схема запуска, надо добавить function
(async function() { 
  const browser = await puppeteer.launch({headless: false});
  //Выбор первой вкладки и оставаться в нем
  const page = (await browser.pages())[0];
  //время ожидания окончательной загрузки страницы
  page.setDefaultNavigationTimeout(0);
  await page.goto("https://www.ozon.ru/");
  
  //попробуй написать тест, который нажимает на кнопку Каталог, выбрать Электронику и другие разделы на твой вкус
  await (await page.waitForXPath("//span[@class='ui-g2' and text()='Каталог']", {timeout:2000})).click()
  await (await page.waitForXPath("//a[@class='a4 lc1 cl2']/span[text()='Электроника']")).click()
  await delay(2000)
  await (await page.waitForXPath("//span[@class='ui-g2' and text()='Каталог']")).click()
  await (await page.waitForXPath("//a[@class='a4 lc1 cl2']/span[text()='Одежда']")).click()
  await delay(2000)
  
  await browser.close();
})();