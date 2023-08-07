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
  const { scrollPageToBottom } = require('puppeteer-autoscroll-down'); 

  const info = {name: 'Метки / Задачи / Лимит',
  };
  info.key = rand(4)
  const proc = ["Первый процесс", "Второй процесс", "Третий процесс",];
  const phase = ["В работе", "Выполнено"];
  const mark = "Тест метка";
  const task = [["В начало списка", "Тест 1"], ["В конец списка", "Тест 2"], ["В конец списка", "Тест 3"]];
  const textMessage = 'Ошибка авторизации';

  async function DnD([x,y],[x1,y1]){
    await page.mouse.move(x,y)
    await delay(500)
    await page.mouse.down()
    await delay(500)
    await page.mouse.move(x1,y1)
    await delay(500)
    await page.mouse.up()
    await delay(500)
}

  //Ввод данных в поле Электронная почта
  await(await page.waitForXPath("//div[@class='ui-input-email']//input")).type("admin@admin.com");
  
  //Ввод данных в поле Пароль
  await(await page.waitForXPath("//div[@class='ui-input-password']//input")).type("admin");
  await delay(1000);

  //~Клик на кнопку Войти
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

  //~Создание процессов
  await (await page.waitForXPath("//tr//td[contains (text(), '"+info.key+"')]")).click();
  await delay(500);

  for (i = 0; i < 3; i++){
    await(await page.waitForXPath("//button[@title='Создать проект']")).click();
    await delay(500);
    await(await page.waitForXPath("//input[@placeholder='Новый процесс']")).type(proc[i]);

    try{
        await page.waitForXPath("//div[contains (text(), 'Kanban')]");
    } catch(err){
        await(await page.waitForXPath("(//div[@class='v-select__slot']//i)[1]")).click();
        await(await page.waitForXPath("//div[@role='option']//div[contains (text(), 'Kanban')]")).click();
    };
    await delay(1000);
    
    await(await page.waitForXPath("//div[@class='modal-layout']//button//span[contains (text(), 'Создать')]")).click();
    greenLog("Процесс " + proc[i] + " создан!");
    await delay(1000);
  }

  //~Зайти в процесс и создать пару этапов
  console.log("Создание этапов...");
  await(await page.waitForXPath("//div[@class='process-list']//div[contains(text(), '"+proc[0]+"')]")).click();

  await(await page.waitForXPath("//button[@title='Добавить этап']")).click();
  for (i = 0; i < 2; i++){
    await(await page.waitForXPath("//div[@class='kanban-column-appender-panel__input']//input")).type(phase[i]);
    await(await page.waitForXPath("//button[@title='Сохранить']")).click();
    greenLog("Этап " + phase[i] + " создан");
    await delay(500);
  }

  await(await page.waitForXPath("//span[contains (text(), '"+info.name+"')]")).click();
  await delay(1000);
  await(await page.waitForXPath("//div[@class='process-list']//div[contains(text(), '"+proc[0]+"')]")).click({button: "right"});
  await delay(1000);
  await(await page.waitForXPath("//div[@title='Настроить процесс']//div[contains (text(), 'Настройки')]")).click();
  await delay(1000);

  //~Поставить метку в процессе и финальный этап
  await(await page.waitForXPath("//label[contains (text(), 'Финальный этап')]/../../../..//div[@class='v-input__icon v-input__icon--append']")).click();
  await delay(1000);
  await(await page.waitForXPath("//div[contains(text(), '"+phase[1]+"')]")).click();
  await(await page.waitForXPath("//div[@class='field-tag']//button")).click();
  await(await page.waitForXPath("//div[contains(text(), 'Название метки')]")).type(mark);
  await(await page.waitForXPath("(//div[@class='field-tag__tools']//button)[1]")).click();
    await scrollPageToBottom(page, {
    size: 500,
    delay: 250,
    stepsLimit: 3
  }) 
  await(await page.waitForXPath("//button//span[contains (text(), 'Сохранить')]")).click();

  //~Проверка фильтра по метке
  yellowLog("Проверка фильтра по метке...");
  await(await page.waitForXPath("//div[@title='Фильтр по тегам']//button")).click();
  await(await page.waitForXPath("//span[contains(text(), '"+mark+"')]/../../../../..//input[@type='checkbox']")).click();
  try{
    await page.waitForXPath("//div[@class='process-list']//div[contains(text(), '"+proc[0]+"')]");
    greenLog("Процесс с этой меткой найден");
  } catch(err){
    redLog("Процесс с этой меткой не найден");
  };

  //~Создать задачу в начале/конце списка (этапа)
  console.log("Создание задач...");
  await delay(1000);
  await(await page.waitForXPath("//div[@class='process-list']//div[contains(text(), '"+proc[0]+"')]")).click();
  for (i = 0; i < 3; i++){
    await delay(1000);
    await(await page.waitForXPath("//div[contains (text(), 'В очереди')]/..//button//span")).click();
    await delay(500);
    await(await page.waitForXPath("//div[contains (text(), '"+task[i][0]+"')]")).click();
    await delay(500);
    await(await page.waitForXPath("//input[@placeholder='Новая задача']")).type(task[i][1]);
    await(await page.waitForXPath("//div[@class='modal-layout']//button//span[contains (text(), 'Создать')]")).click();
    await delay(500);
    await(await page.waitForXPath("//button[@title='Свернуть задачу']")).click();
    greenLog("Задача " + task[i][1] + " создана");
  };

  // Проверка, что есть установленный финальный этап
  yellowLog("Проверка установленного финального этапа...");
  try{
    await page.waitForXPath("//i[@title='Финальный этап']")
    greenLog("Финальный этап установлен");      
  } catch(err){
    redLog("Финальный этап не установлен");
  };

  //~Проверка, что задача в начале/конце списка
  yellowLog("Проверка, что задача в начале/конце списка...");
  await page.screenshot({path: 'Check the tasks order screen.png'});
  console.log("Сделан скриншот");

  //~Установить лимит у списка (этапа)
  await delay(1000);
  await(await page.waitForXPath("//span[contains (text(), 'В работе')]/../..//button//span")).click();
  await delay(500);
  await(await page.waitForXPath("//div[contains(text(), 'Установить лимит')]")).click();
  await delay(500);
  await(await page.waitForXPath("//label[contains(text(), 'Лимит')]/../../../..//input")).type("2");
  await(await page.waitForXPath("//button//span[contains(text(), 'Сохранить')]")).click();

  //~Проверка лимита в списке
  yellowLog("Проверка лимита на этапе 'В работе'...");
  await DnD ([250,280], [480,300]);
  await DnD ([250,280], [480,300]);
  await DnD ([250,280], [480,300]);
  await delay(1000);
  try {
    await page.$$(".v-application .error.kanban-column-footer__limit[data-v-1c47881e]")
    greenLog("Состояние списка поменялось");
  }catch(err){
    redLog("Состояние списка не поменялось");
  };

  //~Редактирование этапа
  console.log("Редактирование этапа...");
  await delay(1000);
  await(await page.waitForXPath("//span[contains (text(), 'В работе')]/../..//button//span")).click();
  await delay(500);
  await(await page.waitForXPath("//div[@title='Настроить этап']//i")).click();
  await delay(500);
  await (await page.waitForXPath("//label[contains(text(), 'Лимит')]/../../../..//input")).click({clickCount: 3});
  await (await page.waitForXPath("//label[contains(text(), 'Лимит')]/../../../..//input")).press('Backspace'); 
  await(await page.waitForXPath("//label[contains(text(), 'Лимит')]/../../../..//input")).type("3");
  await (await page.waitForXPath("//input[@placeholder='Новый этап']")).click({clickCount: 3});
  await (await page.waitForXPath("//input[@placeholder='Новый этап']")).press('Backspace'); 
  await(await page.waitForXPath("//input[@placeholder='Новый этап']")).type("В процессе");
  await(await page.waitForXPath("//button//span[contains(text(), 'Сохранить')]")).click();

  //~Проверка отредактированного этапа
  yellowLog("Проверка отредактирвоанного этапа...");
  try{
    await page.waitForXPath("//span[contains (text(), 'В процессе')]");
    greenLog("Название этапа поменялось");
  }catch(err){
    redLog("Название этапа не поменялось");
  };
  try{
    await page.waitForXPath("//div[@title='Максимальное количество задач на этапе']//span[contains (text(), '3')]");
    greenLog("Значение лимита поменялось");
  } catch(err){
    redLog("Значение лимита не поменлось");
  };

  await delay(1000);
  await browser.close()
})()