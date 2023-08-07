const puppeteer = require('puppeteer');
function delay(time) {
  return new Promise(function(resolve) {
      setTimeout(resolve, time)
  });
}

async function redLog(str){
  console.log("\x1b[41m%s\x1b[0m", str)
};


(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://dev.sfera-project.com/signin');
  const title = await page.title();
  console.log(title);

  const textMessage = 'Ошибка авторизации';

  const loginAndPass = [{login:'123', password:'456', name:'Все неправильно'}, {login:'admin@admin.com', password:'789', name:'Неправильный пароль'}, 
  {login:'012', password:'admin', name:'Неправильный логин'}, {login:'admin@admin.com', password:'admin', name:'Все правильно'},
];

for (const logAndPass of loginAndPass) {
  //Перезагрузка страницы
  // await page.reload();
  await delay(4000);

  //Очистка поля для ввода логина
  await (await page.waitForXPath("//div[@class='ui-input-email']//input")).click({clickCount: 3});
  await (await page.waitForXPath("//div[@class='ui-input-email']//input")).press('Backspace'); 

  //Ввод данных в поле Электронная почта
  await(await page.waitForXPath("//div[@class='ui-input-email']//input")).type(logAndPass.login);
  
  //Ввод данных в поле Пароль
  await(await page.waitForXPath("//div[@class='ui-input-password']//input")).type(logAndPass.password);
 
  //Чтобы уведомление с прошлой попыткой входа успело убраться
  await delay(4000);

  //Клик на кнопку Войти
  await(await page.waitForXPath("//button/span[contains (text(), 'Войти')]", {timeout:10000})).click();

  //Проверка на наличие уведомления об ошибке входа
  try{
    await page.waitForXPath("//div[text()='"+textMessage+"']", {timeout:10000});

    let element = await page.waitForXPath("//div[@class='toaster__message']", {timeout:15000});
    let value = await page.evaluate(element => element.textContent, element);

    let reason = value.trim();

    redLog(logAndPass.name + ': ' + reason);

  } catch (err) {
    console.log(logAndPass.name + ': ' + "Уведомление о введенных неверных данных не появилось!");
    try{
      await page.waitForXPath("//div[contains (text(), 'Рабочий стол')]", {timeout:10000});
      console.log("Успешный вход");
    }catch(err){
      redLog("Ошибка");
    };
  };
};

  await browser.close();
})()
