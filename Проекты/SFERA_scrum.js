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
  await page.setViewport({width:1200, height:800})
  const { scrollPageToBottom } = require('puppeteer-autoscroll-down'); 

  const info = {name: 'Скрам',
  };
  info.key = rand(4)
  const proc = "Первый процесс";
  const phase = ["В работе", "Выполнено"];
  const mark = "Тест метка";
  const task = "Тест 1";
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

  //~Создание процесса
  await (await page.waitForXPath("//tr//td[contains (text(), '"+info.key+"')]")).click();
  await delay(500);
  await(await page.waitForXPath("//button[@title='Создать проект']")).click();
  await delay(500);
  await(await page.waitForXPath("//input[@placeholder='Новый процесс']")).type(proc);
  try{
    await page.waitForXPath("//div[contains (text(), 'Scrum')]/..//input", {timeout:1000});
  } catch(err){
    await(await page.waitForXPath("(//div[@class='v-select__slot']//i)[1]")).click();
    await delay(500);
    await(await page.waitForXPath("//div[@role='option']//div[contains (text(), 'Scrum')]")).click();
  };
  await delay(500);
  await(await page.waitForXPath("//div[@class='modal-layout']//button//span[contains (text(), 'Создать')]")).click();
  greenLog("Процесс " + proc + " создан!");
  await delay(500);
  await(await page.waitForXPath("//div[contains (text(), '"+proc+"')]")).click();
  
  //~Создать спринт
  console.log("Создание спринта...");
  await delay(500);
  await(await page.waitForXPath("//button//span[contains(text(), 'Создать спринт')]")).click();
  await delay(500);
  await(await page.waitForXPath("//button[@title='Настройки спринта']")).click();
  await delay(500);
  await(await page.waitForXPath("//div[@title='Редактировать спринт']")).click();
  await delay(500);
  await(await page.waitForXPath("//div[contains (text(), 'Определяется пользователем')]")).click();
  await delay(500);
  await(await page.waitForXPath("//div[contains (text(), '1 неделя')]")).click();
  await delay(500);
  await(await page.waitForXPath("//label[contains(text(), 'Дата начала')]/../../../..//input")).click();
  await delay(500);
  await(await page.waitForXPath("//button//div[contains(text(), '22')]")).click();
  await delay(500);
  await(await page.waitForXPath("//div[@class='v-window__container']//span[text() = '0']")).click();
  await delay(500);
  await(await page.waitForXPath("//div[@class='v-window__container']//span[text() = '00']")).click();
  await(await page.waitForXPath("//div[@class='v-card__actions']//span[text() = 'Применить']")).click();
  await(await page.waitForXPath("//button//span[contains(text(), 'Сохранить')]")).click();
  let element = await page.waitForXPath("//div[@class='sprint__title']", {timeout:1000});
  let value = await page.evaluate(element => element.outerText, element);
  const sprint = value.trim();

  try{
    await page.waitForXPath("//div[@class='sprint__title'][contains(text(),'"+sprint+"')]");
    greenLog("Спринт " + sprint + " создан");
  }catch(err){
    redLog("Спринт " + sprint + " не создан");
  };

  //~Создать эпик
  //Включить панель эпик
  console.log("Создание эпика...");
  await(await page.waitForXPath("//button//span[contains(text(), 'Эпик')]")).click();

  try{
    await page.waitForXPath("//input[@aria-checked='true']");
  }catch(err){
    await(await page.waitForXPath("//div//span[contains(text(),'Панель Эпик')]")).click();
  };

  await(await page.waitForXPath("//div//span[contains(text(),'Создать Эпик')]")).click();
  await(await page.waitForXPath("//input[@placeholder='Укажите название Эпика…']")).type("Тест Эпик 1");
  await page.keyboard.press('Enter');
  
  element = await page.waitForXPath("//div[@class='epic-drag-handle epic-card__title px-3 col']", {timeout:1000});
  value = await page.evaluate(element => element.outerText, element);
  const epic = value.trim();
  try{
    await page.waitForXPath("//span[text()='"+epic+"']");
    greenLog("Эпик " + epic + " создан...");
  } catch(err){
    redLog("Эпик " + epic + " не создан...");
  };

  //~Создать задачу
  console.log("Создание задачи...");
  await(await page.waitForXPath("//div[contains(text(), '"+proc+"')]")).click();
  await(await page.waitForXPath("(//span[contains(text(), 'Создать задачу')])[2]")).click();
  await(await page.waitForXPath("//input[@placeholder='Что нужно сделать?']")).type(task);
  await page.keyboard.press("Enter");
  try{
    await page.waitForXPath("//span[text() = '"+task+"']");
    greenLog("Задача " + task + " создана!");
  } catch(err){
    redLog("Задача " + task + " не создана");
  };

  //~Перемещение задачи из бэклога в спринт
  await DnD([750,525], [770,270]);

  //~Проверка успешного перемещения задачи
  yellowLog("Проверка успешного перемещения задачи...")
  try{
    await page.waitForXPath("//div[contains(text(), 'Новый спринт')]/../../..//span[contains(text(), 'Тест 1')]", {timeout: 10000});
    greenLog("Задача переместилась");
  }catch(err){
    redLog("Задача не переместилась!");
  }

  //[ ]Запуск спринта
  await(await page.waitForXPath("//span[contains(text(), 'Запустить')]")).click();
  await delay(500);
  await(await page.waitForXPath("//div[@class='modal-layout']//span[contains(text(), 'Запустить')]")).click();
  await delay(500);
  await(await page.waitForXPath("//span[contains(text(),'Завершить')]")).click();
  await delay(500);
  await(await page.waitForXPath("//span[contains(text(),'Завершить спринт')]")).click();
  await delay(500);
  yellowLog("Проверка, что спринт исчез...");
  try{
    await page.waitForXPath("//div[@class='sprint__title'][contains(text(),'"+sprint+"')]", {timeout:10000});
    redLog("Спринт " + sprint + " не исчез");
  }catch(err){
    greenLog("Спринт " + sprint + " исчез");
  };
  await delay(1000);
  await browser.close()
})()