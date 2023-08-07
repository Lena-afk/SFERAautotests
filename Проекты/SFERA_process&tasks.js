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

  const info = {name: 'Действия / Поиск',
  };
  info.key = rand(4)
  proc = ["Первый процесс", "Второй процесс", "Третий процесс",];
  task = "Тест 1";

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
    }
    await delay(1000);
  
    await(await page.waitForXPath("//div[@class='modal-layout']//button//span[contains (text(), 'Создать')]")).click();
    greenLog("Процесс " + proc[i] + " создан!")
    await delay(1000);
  }

  //~Зайти в процесс и создать задачу
  await(await page.waitForXPath("//div[@class='process-list']//div[contains(text(), '"+proc[0]+"')]")).click();
  await(await page.waitForXPath("//button//span[contains(text(), 'Создать задачу')]")).click();
  await(await page.waitForXPath("//input[@placeholder='Новая задача']")).type(task);

  try{
    await page.waitForXPath("//div[contains (text(), 'Задача')]", {timeout:3000});
  } catch(err){
    await(await page.waitForXPath("//div[@class='col col-5']//div[@class='v-select__slot']")).click();
    await(await page.waitForXPath("//div[@class='v-list-item__content']//div[contains(text(), 'Задача')]")).click();
  };
  await delay(500);
  await(await page.waitForXPath("//div[@class='modal-layout__footer']//button//span[contains(text(), 'Создать')]")).click();
  await delay(500);

  //~Проверка что открылась задача после создания
  yellowLog("Проверка, что задача открылась после создания...");
  try{
    await page.waitForXPath("(//div[@class='container pa-0 container--fluid fill-height']//div[contains(text(), '"+task+"')])[1]", {timeout:3000});
    greenLog("Задача создана!")
  }catch(err){
    redLog("Задача не открылась!");
  };

  //~Закрыть задачу
  await(await page.waitForXPath("//button[@title='Свернуть задачу']")).click();

  //~Создать этап
  await(await page.waitForXPath("//button[@title='Добавить этап']")).click();
  await(await page.waitForXPath("//div[@class='kanban-column-appender-panel__input']//input")).type("В работе");
  await(await page.waitForXPath("//button[@title='Сохранить']")).click();

  //~Проверка, что после создания предлагает создание еще еще этапа
  yellowLog("Проверка, что предлагает создать еще этап...");
  try{
    await page.waitForXPath("//input[@class='kanban-column-appender-panel__control']", {timeout:3000});
    greenLog("Этап создан! Предлагает создать следующий этап");
  }catch(err){
    redLog("Не предлагает создать еще один этап!");
  };

  //[ ]Перенос задачи в другой этап
  await DnD ([200,290], [440,300]);
  greenLog("Этап создан! Предлагает создать следующий этап");

  await delay(1000);
  await browser.close()
})()