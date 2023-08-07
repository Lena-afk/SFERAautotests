const puppeteer = require('puppeteer');
function delay(time) {
  return new Promise(function(resolve) {
      setTimeout(resolve, time)
  });
}

function email(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

async function redLog(str){
  console.log("\x1b[41m%s\x1b[0m", str)
}

async function greenLog(str){
  console.log("\x1b[32m%s\x1b[0m", str)
}

(async () => {
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  await page.goto('https://dev.sfera-project.com/signin')
  await page.setViewport({width:1200, height:700})

  let company = ['Тест компания 1', 'Тест компания 2'];
  const user = [['user1@test.ru', 'тестов', 'тест'], ['user2@test.ru', 'Testov', 'Test']];
  const project = 'Тест проект';
  edit = ['Тест', 'Тестов', 'Тестович'];
  const textMessage = 'Ошибка авторизации';

  user[0][0] = email(5) + '@' + email(2) + '.' + email(2);
  user[1][0] = email(4) + '@' + email(3) + '.' + email(3);

  //~Вход
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

  //~Создание 2 компаний
  console.log("Создание компаний...")
  await(await page.waitForXPath("//a[@title='Компании']", {timeout:1000})).click();
  await delay(500);
  for(i = 0; i < company.length; i++){
    await(await page.waitForXPath("//span[contains(text(), 'Создать')]")).click();
    await delay(500);
    await(await page.waitForXPath("//input[@placeholder='Новая компания']")).type(company[i]);
    await(await page.waitForXPath("//div[@class='modal-layout']//span[text()='Создать']")).click();
    await delay(500);
    try{
      await page.waitForXPath("//span[text()= '"+company[i]+"']")
      greenLog("Компания " + company[i] + " создана");
    }catch(err){
      redLog("Компания " + company[i] + " не создана!");
    }
  }

  //~Создание 2 пользователей
  console.log("Создание пользователей...");
  await(await page.waitForXPath("//a[@title='Пользователи']")).click();
  await delay(500);
  for(i = 0; i < user.length; i++){
    await(await page.waitForXPath("//button[@title='Создать пользователя']")).click();
    await(await page.waitForXPath("//input[@placeholder='username@website.com']")).type(user[i][0]);
    await(await page.waitForXPath("//input[@placeholder='Иванов']")).type(user[i][1]);
    await(await page.waitForXPath("//input[@placeholder='Иван']")).type(user[i][2]);
    await(await page.waitForXPath("//div[@class='modal-layout']//span[contains(text(), 'Создать')]")).click();
    try{
      await page.waitForXPath("//td[text()='"+user[i][0]+"']");
      greenLog("Пользователь с почтой " + user[i][0] + " создан");
    }catch(err){
      redLog("Пользотватель с почтой " + user[i][0] + " не создан!");
    }
  }

  //~Добавление пользователя в компанию
  console.log("Добавление пользователей в компании...");
  await delay(500);
  for(i = 0; i < user.length; i++){
    await(await page.waitForXPath("//tr//td[text()='"+user[i][0]+"']/..//button", {timeout:1000})).click();
    await delay(1000);
    await(await page.waitForXPath("(//div[contains(text(),'Добавить в компанию')])["+(i+1)+"]", {timeout:1000})).click();
    await delay(1000);
    await(await page.waitForXPath("//div[text()='"+company[i]+"']/../..//input[@role='checkbox']")).click();
    await(await page.waitForXPath("//span[contains(text(),'Сохранить')]")).click();
    greenLog("Пользователь с почтой " + user[i][0] + " был добавлен в компанию " + company[i])
    await delay(1000);
  }
  await page.screenshot({path: 'users with companies.png'});

  //~Создание проекта
  console.log("Создание проекта...");
  await delay(500);
  await(await page.waitForXPath("//a[@title='Проекты']")).click();
  await delay(500);
  await(await page.waitForXPath("//button[@title='Создать проект']")).click();
  await delay(500);
  await(await page.waitForXPath("//input[@placeholder='Новый проект']")).type(project);

  //~Добавление проекта в компанию
  console.log("Добавление проекта в компанию...");
  await(await page.waitForXPath("//label[contains(text(), 'Компания')]/../../../..//input[@placeholder='Не выбрана']")).click();
  try{
    await page.waitForXPath("//div[text()='Отсутствуют данные']");
    redLog("Информация о компаниях не найдена!");
  } catch(err){
    greenLog("Информация о компаниях найдена");
  };
  await(await page.waitForXPath("//div[@class='modal-layout']//span[text()='Создать']")).click();
  try{
    await page.waitForXPath("//td[@class='text-start']//div[contains(text(), '"+project+"')]");
    greenLog("Проект создан!");
  } catch(err){
    redLog("Проект не создан!");
  }

  //~Редактирование компании
  console.log("Редактирование компании...");
  await(await page.waitForXPath("//a[@title='Компании']")).click();
  await delay(500);
  await(await page.waitForXPath("//span[contains(text(),'"+company[0]+"')]")).click({button: 'right'});
  await delay(500);
  await(await page.waitForXPath("//div[contains(text(),'Редактировать')]")).click();
  await delay(500);
  await(await page.waitForXPath("//input[@placeholder='Новая компания']")).click({clickCount: 3});
  await(await page.waitForXPath("//input[@placeholder='Новая компания']")).press('Backspace'); 
  await(await page.waitForXPath("//input[@placeholder='Новая компания']")).type("Тест ну это точно последнее название...");
  await delay(500);
  await(await page.waitForXPath("//div[@class='v-input__control']//textarea")).type("Редактирование компании ~!@#$%^&*()_+{}|:”>?<Ё!”№;%:?*()_+/Ъ,/.,;’[]\| (😀🐶🌈)");
  await delay(500);
  await(await page.waitForXPath("//span[text()='Сохранить']")).click();

  let element = await page.waitForXPath("//table//span[text()='Тест ну это точно последнее название...']", {timeout:15000})
  let value = await page.evaluate(element => element.textContent, element)

  let value_edit = value.trim()
  company[0] = value_edit;

  try{
    await page.waitForXPath("//table//span[text()='Тест ну это точно последнее название...']");
    greenLog("Успешное редактирование!");
  }catch(err){
    redLog("Не успешное редактирование!");
  }

  //~Редактирование пользователя
  console.log("Редактирование пользователя...");
  await(await page.waitForXPath("//a[@title='Пользователи']")).click();
  await delay(500);
  await(await page.waitForXPath("//td[text()='"+user[0][0]+"']")).click({button: 'right'});
  await delay(500);
  await(await page.waitForXPath("//div[contains(text(), 'Редактировать')]")).click();
  await delay(500);
  await(await page.waitForXPath("//label[text()='Пол']/../../../..//input[@placeholder='Не указан']")).click();
  await delay(500);
  await(await page.waitForXPath("//div[contains(text(), 'Мужской')]")).click();
  await delay(500);
  let a = 0;
  for(i = 5; i <= 7; i++){
    await(await page.waitForXPath("(//div[@class='modal-layout__body']//input)["+i+"]")).click({clickCount: 3});
    await(await page.waitForXPath("(//div[@class='modal-layout__body']//input)["+i+"]")).press('Backspace'); 
    await(await page.waitForXPath("(//div[@class='modal-layout__body']//input)["+i+"]")).type(edit[a]);
    a++;
    await delay(500);
  }
  await(await page.waitForXPath("//span[text()='Сохранить']")).click();

  //[ ]Смена у пользователя компании
  console.log("Смена у пользователя компании...");
  await delay(500);
  await(await page.waitForXPath("(//div[@title='Фильтр по тексту'])[1]")).click();
  await delay(500);
  await(await page.waitForXPath("//div[@title='Фильтр по тексту']//input")).type(user[0][0]);
  await delay(1000);
  await(await page.waitForXPath("//td[text()='"+user[0][0]+"']")).click({button: 'right'});
  await delay(1000);
  await(await page.waitForXPath("//div[contains(text(),'Добавить в компанию')]")).click();
  await delay(500);
  await(await page.waitForXPath("//div[text()='"+company[1]+"']")).click();
  await(await page.waitForXPath("//span[text()='Сохранить']")).click();

  //[ ]Удаление компании
  console.log("Удаление компании...");
  await(await page.waitForXPath("//a[@title='Компании']")).click();
  await delay(1000);
  await(await page.waitForXPath("//span[text()='"+company[1]+"']/../../../..//span[@class='v-btn__content']")).click();
  await delay(500);
  await(await page.waitForXPath("//div[contains(text(),'Удалить')]")).click();
  await delay(500);
  await(await page.waitForXPath("//span[contains(text(),'Подтвердить удаление')]")).click();
  await delay(500);
  try{
    await page.waitForXPath("//span[text()='"+company[1]+"']", {timeout:5000});
    redLog("Компания не удалена");
  } catch(err){
    greenLog("Компания успешно удалена");
  }
  await delay(500);

  //[ ]Удаление пользователя
console.log("Удаление пользователя...");
await delay(500);
await(await page.waitForXPath("//a[@title='Пользователи']")).click();
await delay(1000);
await(await page.waitForXPath("//td[text()='"+user[0][0]+"']/..//button")).click();
await delay(500);
await(await page.waitForXPath("//div[contains(text(), 'Удалить')]")).click();
await delay(500);
await(await page.waitForXPath("//button//span[contains (text(),'Подтвердить удаление')]")).click();
await delay(500);
try{
  await page.waitForXPath("//td[text()='"+user[0][0]+"']", {timeout:5000});
  redLog("Пользователь не удален");
} catch(err){
  greenLog("Пользователь успешно удален");
}

  await delay(1000);
  await browser.close()
})()