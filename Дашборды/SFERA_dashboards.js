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

(async () => {
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()

  await page.goto('https://dev.sfera-project.com/signin')
  await page.setViewport({width:1200, height:800})
  const info = {name: 'Тест 1',
  widget: 'Тест виджет',
  };
  a = 0;
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
  await(await page.waitForXPath("//div/a[@title='Дашбоарды']", {timeout:1000})).click();
  
  //~Создание дашборда
  console.log("Создание дашборда...");
  await(await page.waitForXPath("//button[@title='Создать дашборд']")).click();
  await(await page.waitForXPath("//input[@placeholder='Новый дашборд']")).type(info.name);
  await(await page.waitForXPath("//div[@class='modal-layout']//span[contains(text(), 'Создать')]")).click();
  await delay(500);

  try{
    await(await page.waitForXPath("//td//span[text()='"+info.name+"']", {timeout:5000})).click();
    greenLog("Дашборд " + info.name + " создался");
  }catch(err){
    redLog("Дашборд " + info.name + " не создался!");
  };

  //[ ]Редактирование дашборда
  console.log("Редактирование дашборда...");
  await(await page.waitForXPath("//button[@title='Редактировать']")).click();
  await DnD([1001,400], [920,400]);
  await delay(500);
  const countText = await page.$x("//div[@class='widget-list__around-button']");
  const widget = countText.length;

  //~Закреп виджетов на доске
  for(i = 2; i <= widget; i++){
    await(await page.waitForXPath("(//div[@class='widget-list__around-button'])["+i+"]")).click();
    await DnD([137, 253],[360, 377]);
    if(a % 2 == 0){
        await DnD([230,210],[480,230]);
    } else{
        await DnD([230,210],[750,230]);
    }
    a++;
  };
  
  //~Создание собственного виджета
  console.log("Создание собственного виджета...");
  await delay(500);
  await(await page.waitForXPath("(//div[@class='widget-list__around-button'])[1]")).click();
  await delay(500);
  await(await page.waitForXPath("//input[@placeholder='Новый виджет']")).type(info.widget);
  await delay(500);
  await(await page.waitForXPath("(//div[@class='v-select__selections'])[3]")).click();
  await delay(500);
  await(await page.waitForXPath("//div[contains(text(), 'Линейный график')]")).click();
  await delay(500);
  await(await page.waitForXPath("//input[@placeholder='URL изображения']")).type("https://gas-kvas.com/uploads/posts/2023-02/1675434183_gas-kvas-com-p-fonovie-prozrachnie-risunki-37.jpg");
  await delay(500);
  await(await page.waitForXPath("//button//span[contains(text(), '...')]")).click();
  await delay(500);
  await(await page.waitForXPath("//input[@placeholder='Укажите заголовок виджета']")).type(info.widget);
  await(await page.waitForXPath("//span[text()='Сохранить']")).click();
  await(await page.waitForXPath("//span[text()='Создать']")).click();
  await delay(500);
  await(await page.waitForXPath("//span[contains(text(),'"+info.widget+"')]")).click();
  await delay(500);
  await DnD([137, 253],[849, 546]);
  
  //Проверка
  yellowLog("Проверка на спешное создание нового виджета...");
  try{
    await page.waitForXPath("//span[contains(text(),'"+info.widget+"')]", {timeout:5000});
    greenLog("Виджет "+ info.widget + " создался");
  } catch(err){
    redLog("Виджет "+ info.widget + " не создался");
  };

  //~Изменение масштаба доски
  console.log("Изменение масштаба...");
  await delay(500);
  await page.screenshot({path: 'Before changes.png'});
  await delay(500);
  await(await page.waitForXPath("//button[@title='Настройки']")).click();
  await delay(500);
  await(await page.waitForXPath("(//div[@class='ui-input-number']//button[@aria-label='clear icon'])[1]")).click();
  await delay(500);
  await(await page.waitForXPath("//input[@placeholder='Размер ширины в частях (1 .. 100)']")).type('10');
  await delay(500);
  await(await page.waitForXPath("(//div[@class='ui-input-number']//button[@aria-label='clear icon'])[2]")).click();
  await delay(500);
  await(await page.waitForXPath("//input[@placeholder='Размер высоты в частях (1 .. 100)']")).type('5');
  await delay(500);
  await(await page.waitForXPath("//span[contains(text(),'Сохранить')]")).click();
  await delay(500);
  await page.screenshot({path: 'After changes.png'});

  //~Сохранение доски
  console.log("Сохранение дашборда...");
  await(await page.waitForXPath("//button[@title='Сохранить']")).click();

  //Полноэкранный режим
  yellowLog("Проверка полноэкранного режима");
  await(await page.waitForXPath("//button[@title='Развернуть']")).click();
  try{
    await page.waitForXPath("//span[text()='Тест 1']", {timeout:5000});
    redLog("Полноэкранный режим не включен");
  }catch(err){
    greenLog("Полноэкранный режим включен");
  }
  await(await page.waitForXPath("//button[@title='Свернуть']")).click();

  //~Удаление созданного виджета
  yellowLog("Удаление созданного виджета...")
  await(await page.waitForXPath("//button[@title='Редактировать']")).click();
  await(await page.waitForXPath("//span[text()='Тест виджет']/../../../../../../../../../../../..//div[@class='widget-list__around-button']/button[@title='Удалить']")).click();
  try{
    await page.waitForXPath("//div[contains(text(), 'TypeError')]", {timeout:5000});
    console.log("Вылезла ошибка");
  }catch(err){
    redLog("Не вылезла ошибка");
  };
  await delay(1000);
  await browser.close()
})()