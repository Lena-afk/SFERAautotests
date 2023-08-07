const puppeteer = require('puppeteer');
const fs = require('fs');


function delay(time) {
  return new Promise(function(resolve) {
      setTimeout(resolve, time)
  });
}

async function redLog(str){
    console.log("\x1b[41m%s\x1b[0m", str)
  }
  

(async () => {
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  await page.goto('https://its-tula.appmath.ru/')

  //Поля для ввода логина и пароля, кнопка для входа
  console.log("Проверка полей")
  try{
    await page.waitForXPath("//div[contains(text(),'Логин')]/..//input[@type='text']")
  } catch(err){
    redLog("Нет поля ввода 'Логин'")
  }
  try{
    await page.waitForXPath("//div[contains(text(),'Пароль')]/..//input[@type='password']")
  } catch(err){
    redLog("Нет поля ввода 'Пароль'")
  }
  try{
    await page.waitForXPath("//button[contains(text(),'Войти')]")
  } catch(err){
    redLog("Нет кнопки 'Войти'")
  }
  await delay(5000)

  //Авторизация с незаполненными полями
  console.log("Проверка авторизации с незаполненными полями")
  await(await page.waitForXPath("//button[contains(text(),'Войти')]")).click()
  try{
    await page.waitForXPath("(//div[@class='loginLandscape__inputWrapper loginLandscape__inputWrapper_error'])[1]")
    await page.waitForXPath("(//div[@class='loginLandscape__inputWrapper loginLandscape__inputWrapper_error'])[2]")

  } catch(err){
    redLog("Нет предупреждения о незаполненных полях")
  }

  //Авторизация с неверными данными
  console.log("Проверка авторизации с неверными данными")
  await(await page.waitForXPath("(//input[@class='loginLandscape__input'])[1]")).type("1")
  await(await page.waitForXPath("(//input[@class='loginLandscape__input'])[2]")).type("1")
  await delay (10000)
  await(await page.waitForXPath("//button[contains (text(), 'Войти')]")).click()

  //Ошибки
  try{
    await page.waitForXPath("//div[@class='toast__message']//span[contains(text(),'Ошибка авторизации')] | //div[contains(text(),'Неправильный логин или пароль')]")
  
  } catch(err){
    redLog("Нет предупреждений об ошибке")
  }
  
  //Маскирует ли символы
  console.log("Проверка возможность маскировать символы")
  try{
    await page.waitForXPath("//div[@class='loginLandscape__eyeWrapper']")
  
  } catch(err){
    redLog("Не предлагает скрыть/раскрыть написанные символы")
  }

  //Чувствительность к регистру
  console.log("Проверка чувствительности к регистру")
  await page.reload()
  await delay(2000)
  try{
    await(await page.waitForXPath("(//input[@class='loginLandscape__input'])[1]")).type("spiridonov_fl")
    await(await page.waitForXPath("(//input[@class='loginLandscape__input'])[2]")).type("MTB!9@-s#Y[MMjX!")
    await delay (5000)
    await(await page.waitForXPath("//button[contains (text(), 'Войти')]")).click()
    await page.waitForXPath("//div[@class='toast__message']//span[contains(text(),'Ошибка авторизации')] | //div[contains(text(),'Неправильный логин или пароль')]")
  
  } catch(err){
    redLog("Не чувствителен к регистру")
  }

  //Проверка на иероглифы
  console.log("Проверка на иероглифы")
  await page.reload()
  await delay(2000)
  try{
    await(await page.waitForXPath("(//input[@class='loginLandscape__input'])[1]")).type("دَالٌ")
    await(await page.waitForXPath("(//input[@class='loginLandscape__input'])[2]")).type("诶")
    await delay (5000)
    await(await page.waitForXPath("//button[contains (text(), 'Войти')]")).click()
    await page.waitForXPath("//div[@class='toast__message']//span[contains(text(),'Ошибка написания')]")
  
  } catch(err){
    redLog("Не предусмотрено")
  }

  //Ошибка с ограничением количества вводимых символов
  console.log("Проверка ограничения на количество символов")
  try{
    await(await page.waitForXPath("(//input[@class='loginLandscape__input'])[1]")).type("12345678901234567890123456789012345678901234567890")
    await(await page.waitForXPath("(//input[@class='loginLandscape__input'])[2]")).type("12345678901234567890123456789012345678901234567890")
    await delay (5000)
    await(await page.waitForXPath("//button[contains (text(), 'Войти')]")).click()
        await page.waitForXPath("//div[@class='toast__message']//span[contains(text(),'Ошибка авторизации')] //div[contains(text(),'символов')]")
  } catch(err){
    redLog("Ошибки с ограничением символов нет")
  }

  //Возможность зайти с действительными данными
  console.log("Проверка авторизации с верными данными")
  await page.reload()
  await delay(2000)
  try{
    await(await page.waitForXPath("(//input[@class='loginLandscape__input'])[1]")).type("spiridonov_fl")
    await(await page.waitForXPath("(//input[@class='loginLandscape__input'])[2]")).type("mtb!9@-s#Y[MMjX!")
    await delay (5000)
    await(await page.waitForXPath("//button[contains (text(), 'Войти')]")).click()
  } catch(err){
    redLog("Невозможно зайти с действительными данными")
  }

  //Как реагирует система на кнопки браузера(вперед, назад)
  console.log("Как реагирует на кнопки назад?")
  await page.goBack()
  try{
    await page.waitForXPath("//button[contains (text(), 'Войти')]")

  }catch(err){
    redLog("Не срегаировал на кнопку назад")
  }
  
  try{
    await(await page.waitForXPath("//button[contains (text(), 'Войти')]")).click()
    await page.waitForXPath("//div[@class='toast__message']//span[contains(text(),'Ошибка авторизации')] | //div[contains(text(),'Неправильный логин или пароль')] | (//div[@class='loginLandscape__inputWrapper loginLandscape__inputWrapper_error'])[1]")

  } catch(err){
    console.log("При использовании кнопки назад, сохранил данные в полях")
  }
  
  await browser.close()
} )()