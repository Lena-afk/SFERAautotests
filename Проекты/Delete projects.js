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

function rand(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

(async () => {
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  await page.goto('https://dev.sfera-project.com/signin')
  await page.setViewport({width:1200, height:700})

  const textMessage = 'Ошибка авторизации';
  const info = {
    name1: 'Тест',
    context1: 'О п и с а н и е',
    date: '22.06.2023',
    name2: 'Test smth',
    context2: 'AaBbCc Dd',
  };
  info.key =  rand(4)


  //Ввод данных в поле Электронная почта
  await(await page.waitForXPath("//div[@class='ui-input-email']//input")).type("admin@admin.com");
  
  //Ввод данных в поле Пароль
  await(await page.waitForXPath("//div[@class='ui-input-password']//input")).type("admin");
  await delay(1000);

  //Клик на кнопку Войти
  await(await page.waitForXPath("//button/span[contains (text(), 'Войти')]", {timeout:1000})).click();

  //Проверка на наличие уведомления об ошибке входа
  console.log("Проверка на наличие уведомления об ошибке...")
  try{
    await page.waitForXPath("//div[text()='"+textMessage+"']", {timeout:1000});
    redLog("Уведомление о введенных неверных данных появилось");
  } catch (err) {
    greenLog("Уведомление о введенных неверных данных не появилось!");
  };

  //Клик на проекты
  await(await page.waitForXPath("//div[@title='Проекты']", {timeout:1000})).click();

  await delay(1000);

  let countText = await page.$x("//div[contains (text(), 'Тест проект')]/../../..//span[@class='v-btn__content']");
  let del = countText.length

  //Удалить проект
  console.log("Удаление проекта...")
  for(i=0; i < del; i++){
    await(await page.waitForXPath("(//div[@class='ui-menu']//button)[1]", {timeout:1000})).click();
    await delay(500);
    await(await page.waitForXPath("//div[@role='menuitem']//div[contains (text(), 'В корзину')]", {timeout:1000})).click();
    await delay(500);
    await(await page.waitForXPath("//button/span[contains (text(), 'Переместить в корзину')]", {timeout:1000})).click();
    await delay(500);
  }    
  await delay(1000);
  await(await page.waitForXPath("//div[@title='Фильтр по состоянию проекта']//button", {timeout:1000})).click();
  await delay(1000);
  await(await page.waitForXPath("//div[contains (text(), 'Удаленные')]", {timeout:1000})).click();
  
  countText = await page.$x("//div[contains (text(), 'Тест проект')]/../../..//span[@class='v-btn__content']");
  del = countText.length

  for(i=0; i < del; i++){
    await(await page.waitForXPath("(//div[@class='ui-menu']//button)[1]", {timeout:1000})).click();
    await delay(500);
    await(await page.waitForXPath("//div[@role='menuitem']//div[contains (text(), 'Удалить')]", {timeout:1000})).click();
    await delay(500);
    await(await page.waitForXPath("//button/span[contains (text(), 'Подтвердить удаление')]", {timeout:1000})).click();
    await delay(500);
}

greenLog("Удаление завершено")

  await browser.close()
})()