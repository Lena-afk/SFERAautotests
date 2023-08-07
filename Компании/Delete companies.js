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
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://dev.sfera-project.com/signin')
  await page.setViewport({width:1200, height:700})

  const textMessage = 'Ошибка авторизации';

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

  //[ ]Удаление компаний
  //Клик на компании
  await(await page.waitForXPath("//a[@title='Компании']", {timeout:1000})).click();
  await delay(500);
  let countText = await page.$x("//span[contains(text(), 'Тест')]/../../../..//span[@class='v-btn__content']");
  let del = countText.length

  //Удалить компании
  console.log("Удаление компаний...")
  for(i=0; i < del; i++){
    await(await page.waitForXPath("(//div[@class='ui-menu']//button)[1]", {timeout:1000})).click();
    await delay(500);
    await(await page.waitForXPath("//div[@role='menuitem']//div[contains (text(), 'Удалить')]", {timeout:1000})).click();
    await delay(500);
    await(await page.waitForXPath("//button/span[contains (text(), 'Подтвердить удаление')]", {timeout:1000})).click();
    await delay(500);
  }    
 greenLog("Удаление компаний прошло успешно!")

   //[ ]Удаление пользователей
  //Клик на поьзователи
  await(await page.waitForXPath("//a[@title='Пользователи']", {timeout:1000})).click();
  await delay(500);
  countText = await page.$x("//tr//td[contains(text(),'01.08.2023')]/..//button");
  del = countText.length

  //Удалить пользователей
  console.log("Удаление пользователей...")
  for(i=0; i < del; i++){
    await(await page.waitForXPath("(//tr//td[contains(text(),'01.08.2023')]/..//button)[1]")).click();
    await delay(500);
    await(await page.waitForXPath("//div[@role='menuitem']//div[contains (text(), 'Удалить')]", {timeout:1000})).click();
    await delay(500);
    await(await page.waitForXPath("//button/span[contains (text(), 'Подтвердить удаление')]", {timeout:1000})).click();
    await delay(500);
  }    
 greenLog("Удаление пользователей прошло успешно!")
  await browser.close()
})()