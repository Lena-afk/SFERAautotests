const puppeteer = require('puppeteer');
function delay(time) {
  return new Promise(function(resolve) {
      setTimeout(resolve, time);
  });
}

async function redLog(str){
  console.log("\x1b[41m%s\x1b[0m", str);
}

async function greenLog(str){
  console.log("\x1b[32m%s\x1b[0m", str);
}

async function yellowLog(str){
  console.log("\x1b[43m%s\x1b[0m", str);
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

  const info = {name: 'Действия / Поиск', author: 'Администратор', date: '10.07.2023', 
  context: 'Тестирование поиска по проектам и действий с проектами (скрыть, в архив) ~!@#$%^&*()_+{}|:”>?<Ё!”№;%:?*()_+/Ъ,/.,;’[]\| (😀🐶🌈)',
  };
  info.key = rand(4)
  const textMessage = 'Ошибка авторизации';

  //Ввод данных в поле Электронная почта
  await(await page.waitForXPath("//div[@class='ui-input-email']//input")).type("admin@admin.com");
  
  //Ввод данных в поле Пароль
  await(await page.waitForXPath("//div[@class='ui-input-password']//input")).type("admin");
  await delay(1000);

  //Клик на кнопку Войти
  await(await page.waitForXPath("//button/span[contains (text(), 'Войти')]", {timeout:1000})).click();

  //Проверка на наличие уведомления об ошибке входа
  yellowLog("Проверка на наличие уведомления об ошибке...");
  try{
    await page.waitForXPath("//div[text()='"+textMessage+"']", {timeout:1000});
    redLog("Уведомление о введенных неверных данных появилось");
  } catch (err) {
    greenLog("Уведомление о введенных неверных данных не появилось!");
  };

  //Клик на проекты
  await(await page.waitForXPath("//div[@title='Проекты']", {timeout:1000})).click();
  
  //~Создание нового проекта
  console.log("Создание проекта...");

  await(await page.waitForXPath("//button[@title='Создать проект']")).click();
  await delay(1000);

  await(await page.waitForXPath("//input[@placeholder='Новый проект']")).type(info.name);

  await (await page.waitForXPath("//input[@placeholder='TX']")).click({clickCount: 3});
  await (await page.waitForXPath("//input[@placeholder='TX']")).press('Backspace'); 
  await(await page.waitForXPath("//input[@placeholder='TX']")).type(info.key);

  await(await page.waitForXPath("//div[@class='ui-textarea']//textarea")).type(info.context);
  
  //Клик на создание
  await(await page.waitForXPath("//div[@class='modal-layout__footer']//span[contains (text(), 'Создать')]")).click();
  await delay(1000);
  
  //Проверка на успешное создание проекта
  yellowLog("Проверка, что проект создан...");
  try{
    await page.waitForXPath("(//td[contains (text(), '"+info.key+"')])[1]", {timeout:1000});
    greenLog("Проект с таким ключом существует");
  } catch (err){
    redLog("Проект с таким ключом не найден");
  };

  //~Скрыть
  console.log("Скрыть проект...");
  await(await page.waitForXPath("(//div[@class='ui-menu']//span)[1]")).click();
  await delay(1000);
  await(await page.waitForXPath("//div[@class='v-menu__content theme--light menuable__content__active']//div[contains (text(), 'Скрыть')]")).click();
  await delay(1000);

  await(await page.waitForXPath("//button//span[contains (text(), 'Снять с публикации')]")).click();
  await delay(1000);

  //Переход в скрытые
  await(await page.waitForXPath("//div[@title='Фильтр по состоянию проекта']//button")).click();
  await delay(1000);
  await(await page.waitForXPath("//div[@class='v-list-item__content menu-list__content']//div [contains (text(), 'Скрытые')]")).click();
  await delay(1000);

  //Проверка, что проект в скрытых
  yellowLog("Проверка, что проект в скрытых...");
  try{
    await page.waitForXPath("(//td[contains (text(), '"+info.key+"')])[1]", {timeout:1000});
    greenLog("Проект с таким ключом в скрытых");
  } catch (err){
    redLog("Проект с таким ключом не найден в скрытых");
  };

  //~В архив
  console.log("Переместить проект в архив...");
  await(await page.waitForXPath("(//div[@class='ui-menu']//span)[1]")).click();
  await delay(1000);
  await(await page.waitForXPath("//div[@class='v-menu__content theme--light menuable__content__active']//div[contains (text(), 'В архив')]")).click();
  await delay(1000);

  await(await page.waitForXPath("//button//span[contains (text(), 'Переместить в архив')]")).click();
  await delay(1000);

  //Переход в архив
  await(await page.waitForXPath("//div[@title='Фильтр по состоянию проекта']//button")).click();
  await delay(1000);
  await(await page.waitForXPath("//div[@class='v-list-item__content menu-list__content']//div [contains (text(), 'Архивные')]")).click();

  await delay(1000);

  //Проверка, что проект в архиве
  yellowLog("Проверка, что проект в архиве...");
  try{
    await page.waitForXPath("(//td[contains (text(), '"+info.key+"')])[1]", {timeout:1000});
    greenLog("Проект с таким ключом в архиве");
  } catch (err){
    redLog("Проект с таким ключом не найден в архиве");
  };

  
  //~В опубликованные
  console.log("Переместить проект в опубликованные...");
  await(await page.waitForXPath("(//div[@class='ui-menu']//span)[1]")).click();
  await delay(1000);
  await(await page.waitForXPath("//div[@class='v-menu__content theme--light menuable__content__active']//div[contains (text(), 'Опубликовать')]")).click();
  await delay(1000);

  await(await page.waitForXPath("//button//span[contains (text(), 'Опубликовать проект')]")).click();
  await delay(1000);

  //Переход в опубликованные
  await(await page.waitForXPath("//div[@title='Фильтр по состоянию проекта']//button")).click();
  await delay(1000);
  await(await page.waitForXPath("//div[@class='v-list-item__content menu-list__content']//div [contains (text(), 'Опубликованные')]")).click();
  await delay(1000);

  //Проверка, что проект в опубликованных
  yellowLog("Проверка, что проект в опубликованных...");
  try{
    await page.waitForXPath("(//td[contains (text(), '"+info.key+"')])[1]", {timeout:1000});
    greenLog("Проект с таким ключом в опубликованных");
  } catch (err){
    redLog("Проект с таким ключом не найден в опубликованных");
  };

  //~Сохранение значений в объект
  await(await page.waitForXPath("(//div[@class='ui-menu']//span)[1]")).click();
  await delay(1000);
  await(await page.waitForXPath("//div[@role='menuitem']//div[contains (text(), 'Настройки')]")).click();
  await delay(1000);

  let element = await page.waitForXPath("(//div[@class='v-select__selection v-select__selection--comma'])[1]", {timeout:500});
  info.state = await page.evaluate(element=>element.textContent,element);

  element = await page.waitForXPath("(//div[@class='v-select__selection v-select__selection--comma'])[2]", {timeout:500});
  info.access = await page.evaluate(element=>element.textContent,element);

  element = await page.waitForXPath("//div[@class='ui-textarea']//textarea", {timeout:500});
  info.context = await page.evaluate(element=>element.value,element);

  await(await page.waitForXPath("//button//span[contains (text(), 'Закрыть')]")).click();

  //Преобразование объекта в массив
  let infos = Object.entries(info);

  //Поиск
  await(await page.waitForXPath("(//div[@title='Фильтр по тексту'])[1]")).click();

  //~Регистрозависимость
  yellowLog("Тестирование на регистрозависимость");
  await delay(5000)
  await(await page.waitForXPath("//div[@title='Фильтр по тексту']//input")).type("дЕйСтВиЯ / пОиСк");
  try {
    await page.waitForXPath("//tr//div[contains (text(), '"+info.name+"')]");
    console.log("Регистронезависимый");
  } catch(err){
    console.log("Регистрозависимый");
  }


  //~Поля для поиска
  for (i=0; i < infos.length; i++) {
    yellowLog("Тестирование на поиск по " + infos[i][0] + "...");

    await (await page.waitForXPath("//div[@title='Фильтр по тексту']//input")).click({clickCount: 3});
    await (await page.waitForXPath("//div[@title='Фильтр по тексту']//input")).press('Backspace'); 
    await(await page.waitForXPath("//div[@title='Фильтр по тексту']//input")).type(infos[i][1]);
    
    try {
      await page.waitForXPath("//td[contains (text(), '"+infos[4][1]+"')]", {timeout:500});
      console.log("Ищет по полю " + infos[i][0]);
    } catch(err){
      console.log("Не ищет по полю " + infos[i][0]);
    }  
  }

  //~Поиск по выбранному состоянию
  //Переход в скрытые
  await(await page.waitForXPath("//div[@title='Фильтр по состоянию проекта']//button")).click();
  await delay(1000);
  await(await page.waitForXPath("//div[@class='v-list-item__content menu-list__content']//div [contains (text(), 'Скрытые')]")).click();
  await delay(1000);

  yellowLog("Тестирование поиска в скрытом состоянии опубликованного проекта...");
  try {
    await page.waitForXPath("//td[contains (text(), '"+infos[4][1]+"')]", {timeout:500});
    console.log("В скрытом состоянии нашел проект другого состояния");
  } catch(err){
    console.log("В скрытом состоянии нет опубликованного проекта");
  }

  //~Поиск по включению или полному соответствию
  yellowLog("Тестирование поиска на включение или полное соответствие...");

  //Переход в опубликованные
  await(await page.waitForXPath("//div[@title='Фильтр по состоянию проекта']//button")).click();
  await delay(1000);
  await(await page.waitForXPath("//div[@class='v-list-item__content menu-list__content']//div [contains (text(), 'Опубликованные')]")).click();
  await delay(1000);

  await (await page.waitForXPath("//div[@title='Фильтр по тексту']//input")).click({clickCount: 3});
  await (await page.waitForXPath("//div[@title='Фильтр по тексту']//input")).press('Backspace'); 
  await(await page.waitForXPath("//div[@title='Фильтр по тексту']//input")).type("Действ");
  try {
    await page.waitForXPath("//td[contains (text(), '"+infos[4][1]+"')]", {timeout:500});
    console.log("Поиск по включению");
  } catch(err){
    console.log("Поиск по полному соответствию");
  }

  const tests = [  ["Тестирование поиска c видоизмененным названием...", "Поиск / Действия"], 
  ["Тестирование поиска c несколькими полями...", infos[0][1] + " " + infos[4][1]], 
  ["Тестирование поиска при опечатках...", "Дествия / Поиск"], ["Тестирование поиска при неправильной раскладке...", "Ltqcndbz"],
  ["Тестирование поиска на другом языке...", "Actions"], ["Тестирование поиска с лишними пробелами", "    Действия    /    Поиск        "], ]

  //~Поменять слова местами из поля Имя
  for (i = 0; i < tests.length; i++){
      yellowLog(tests[i][0]);
      await (await page.waitForXPath("//div[@title='Фильтр по тексту']//input")).click({clickCount: 3});
      await (await page.waitForXPath("//div[@title='Фильтр по тексту']//input")).press('Backspace'); 
      await(await page.waitForXPath("//div[@title='Фильтр по тексту']//input")).type(tests[i][1]);
      try {
        await page.waitForXPath("//td[contains (text(), '"+infos[4][1]+"')]", {timeout:500});
        console.log("Успешно");
      } catch(err){
        console.log("Не успешно");
      }
    }

  await delay(1000);
  await browser.close()
})()