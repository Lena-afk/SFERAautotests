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

  let info2 = {};

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

  //~Создание нового проекта
  console.log("Создание проекта...")

  await(await page.waitForXPath("//button[@title='Создать проект']")).click();

  await delay(1000);

  await(await page.waitForXPath("//input[@placeholder='Новый проект']")).type(info.name1);
  await(await page.waitForXPath("//div[@class='ui-textarea']//textarea")).type(info.context1)
    
  //~Сохранение значений в объект
  let element = await page.waitForXPath("//input[@placeholder='Новый проект']", {timeout:500});
  info2.name1 = await page.evaluate(element=>element.value,element);
  console.log('Название: ' + info2.name1)

  element = await page.waitForXPath("//input[@placeholder='TX']", {timeout:500});
  info2.key1 = await page.evaluate(element=>element.value,element);
  console.log('Ключ: ' + info2.key1)

  element = await page.waitForXPath("(//div[@class='v-select__selection v-select__selection--comma'])[1]", {timeout:500});
  info2.state = await page.evaluate(element=>element.textContent,element);
  console.log('Состояние: ' + info2.state)

  element = await page.waitForXPath("(//div[@class='v-select__selection v-select__selection--comma'])[2]", {timeout:500});
  info2.access = await page.evaluate(element=>element.textContent,element);
  console.log('Тип доступа: ' + info2.access)

  element = await page.waitForXPath("//div[@class='ui-textarea']//textarea", {timeout:500});
  info2.context1 = await page.evaluate(element=>element.value,element);
  console.log('Краткое описание: ' + info2.context1)


  await delay(1000);

  //Клик на создание
  await(await page.waitForXPath("(//button/span[contains (text(), 'Создать')])[2]", {timeout:1000})).click();

  await delay(1000);

  //~Проверка на успешное создание проекта
  console.log("Проверка, что проект создан...")
  try{
    await page.waitForXPath("(//div[contains (text(), '"+info.name1+"')])[1]", {timeout:1000});
    greenLog("Проект с таким именем существует");
  } catch (err){
    redLog("Проект с таким именем не найден");
  };

  try{
    await page.waitForXPath("//td[contains (text(), '"+info.date+"')]", {timeout:1000});
    greenLog("Проект с сегодняшней датой существует");
  } catch (err){
    redLog("Проект с сегодняшней датой не найден");
  };

  //Проверка ключа
  console.log("Проверка ключа...")
  const countText = await page.$x("//thead[@class='v-data-table-header']/..//td[contains (text(), '"+info2.key1+"')]")
  const n = countText.length
  greenLog("Проект с таким ключом " + info2.key1 + " существует " + n + " раз")

  //~Редактирование проекта (имя, ключ, описание)
  console.log("Редактирование проекта...")
  
  await delay(1000);

  await(await page.waitForXPath("(//div[@class='ui-menu']//span)[1]")).click();
  await delay(3000);
  await(await page.waitForXPath("//div[@role='menuitem']//div[contains (text(), 'Настройки')]")).click();
  await delay(3000);

  //Очистка поля для ввода названия проекта
  await(await page.waitForXPath("//button[@aria-label='clear icon']")).click();

  await(await page.waitForXPath("//input[@placeholder='Новый проект']")).type(info.name2);

  await(await page.waitForXPath("//div[@class='ui-textarea']//textarea")).type(". " + info.context2);

  //Очистка поля для ввода ключа
  await (await page.waitForXPath("//input[@placeholder='TX']")).click({clickCount: 3});
  await (await page.waitForXPath("//input[@placeholder='TX']")).press('Backspace'); 

  //Ввод данных в поле Ключ
  await(await page.waitForXPath("//input[@placeholder='TX']")).type(info.key);

  //~ Сохранение изменениий в объект
  //Применить изменения
  console.log ("Применение изменений...")

  await(await page.waitForXPath("//button/span[contains (text(), 'Применить')]", {timeout:500})).click();

  try {
    await page.waitForXPath("//button/span[contains (text(), 'Применить')]", {timeout:500})
    await delay(1000);
    greenLog("Изменения применились!")

  } catch(err){
    redLog("Ошибка изменения")
  }

  //Сохранить в объект info2 новое название
  console.log("Сохранение измененных полей в объект...")

  element = await page.waitForXPath("//input[@placeholder='Новый проект']", {timeout:500});
  info2.name2 = await page.evaluate(element=>element.value,element);
  console.log('Новое название: ' + info2.name2)

  //Сохранить в объект info2 новый ключ
  element = await page.waitForXPath("//span//input[@placeholder='TX']", {timeout:500});
  info2.key2 = await page.evaluate(element => element.value, element);
  console.log('Новый ключ: ' + info2.key2)

  //Сохранить в объект info2 новый краткое описание
  element = await page.waitForXPath("//div[@class='ui-textarea']//textarea", {timeout:500});
  info2.context2 = await page.evaluate(element=>element.value,element);
  console.log('Новое краткое описание: ' + info2.context2)

  console.log("Проверка измененных полей...")
  //~Проверка названия
  if (info2.name1 == info2.name2) {
    redLog("Название не поменялось");
  } else{
    console.log("Название поменялось с: '" + info2.name1 + "' на: '" + info2.name2 + "'");
  };

  //Проверка ключа
  if (info2.key1 == info2.key2) {
    redLog("Ключ не поменялся");
  } else{
    console.log("Ключ поменялся с: '" + info2.key1 + "' на: '" + info2.key2 + "'");
  };

  //Проверка описания
  if (info2.context1 == info2.context2) {
    redLog("Описание не поменялось");
  } else{
    console.log("Описание поменялось с: '" + info2.context1 + "' на: '" + info2.context2 + "'");
  };

  //Удалить проект
  console.log("Удаление проекта...")
  await(await page.waitForXPath("//button//span[contains (text(), 'Закрыть')]", {timeout:1000})).click();
  await(await page.waitForXPath("(//div[@class='ui-menu']//button)[1]", {timeout:1000})).click();
  await delay(3000);
  await(await page.waitForXPath("//div[@role='menuitem']//div[contains (text(), 'В корзину')]", {timeout:1000})).click();
  await delay(3000);
  await(await page.waitForXPath("//button/span[contains (text(), 'Переместить в корзину')]", {timeout:1000})).click();

  //Проверка, что проект в корзине
  console.log("Проверка, что проект в корзине...")
  try{
    await page.waitForXPath("(//div[contains (text(), '"+info2.key2+"')])[1]", {timeout:1000});
    redLog("Проект с таким ключом не в корзине");
  } catch (err){
    greenLog("Проект с таким ключом в корзине");
  };

  await delay(1000);
  await(await page.waitForXPath("//div[@title='Фильтр по состоянию проекта']//button", {timeout:1000})).click();
  await delay(1000);
  await(await page.waitForXPath("//div[contains (text(), 'Удаленные')]", {timeout:1000})).click();
  await(await page.waitForXPath("(//div[@class='ui-menu']//button)[1]", {timeout:1000})).click();
  await delay(1000);
  await(await page.waitForXPath("//div[@role='menuitem']//div[contains (text(), 'Удалить')]", {timeout:1000})).click();

  await(await page.waitForXPath("//button/span[contains (text(), 'Подтвердить удаление')]", {timeout:1000})).click();
  //Проверка, что проект удален
  console.log("Проверка, что проект удален...")
  try{
    await page.waitForXPath("(//div[contains (text(), '"+info2.key2+"')])[1]", {timeout:1000});
    redLog("Проект с таким ключом не удален");
  } catch (err){
    greenLog("Проект с таким ключом удален");
  };
  

  await browser.close()
})()