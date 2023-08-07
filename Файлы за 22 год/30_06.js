const puppeteer = require('puppeteer');
const { scrollPageToBottom } = require('puppeteer-autoscroll-down');

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
  await page.goto('https://www.saucedemo.com/')
  await delay(5000)
//Вход в систему
await(await page.waitForXPath ("//input [@placeholder='Username']")).type("standard_user")
await(await page.waitForXPath ("//input [@placeholder='Password']")).type("secret_sauce")
await(await page.waitForXPath ("//input [@data-test='login-button']")).click()

const countText = await page.$x("//div[@class='inventory_item_name']")
// const read = (await page.$x("(//div[@class='inventory_item_name'])")).length
const read = countText.length
console.log(read)

let nameGoods = []
for (var i = 1; i < read; i++){
    // await page.waitForXPath("//div[@class='inventory_item_name' and text()]["+i+"]")
    try{
      let element1 = await page.waitForXPath("(//div[@class='inventory_item_name' and text()])["+i+"]",{timeout:500})
      let value = await page.evaluate(element1 => element1.textContent, element1)
      nameGoods.push(value)
      console.log(i, value)
    } catch(err){
      console.log(i, "  xpath не найден")
    }
  }

//Добавляем все товары в корзину
for (const nameGood of nameGoods){
  await delay(1000)
  await(await page.waitForXPath("//div [@class='inventory_list']//div[text()='"+nameGood+"']", {timeout:10000})).click()
  await(await page.waitForXPath("//button[contains(text(), 'Add to cart')]")).click()
  await(await page.waitForXPath("//button[@name='back-to-products']")).click()
}
//Переход в корзину
await(await page.waitForXPath("//a[@class='shopping_cart_link']")).click()
await(await page.waitForXPath("//button[@id='remove-sauce-labs-bike-light']")).click()
await delay(3000)


//Проверка удаления
for (nameGood of nameGoods){
    try {
        console.log("Товар "+nameGood+" не удален")
  await page.waitForXPath("//div [text()='"+nameGood+"']", {timeout: 500})

    } catch(err){
        redLog("Товар "+nameGood+" удален")
    }
} 
 
await(await page.waitForXPath("//a[@class='shopping_cart_link']")).click()
await(await page.waitForXPath("//button [@name='checkout']")).click()
await(await page.waitForXPath("//input [@data-test='continue']")).click()

//Проверка на отсутствие информации в полях
try{
  console.log ("Информация не введена")
  await page.waitForXPath("//div[@class='error-message-container error']")

} catch(err){
  redLog("Введены какие-то данные")
}

//Вводим данные
await(await page.waitForXPath("//input [@placeholder='First Name']")).type("1")
await(await page.waitForXPath("//input [@placeholder='Last Name']")).type("2")
await(await page.waitForXPath("//input [@placeholder='Zip/Postal Code']")).type("123")
await(await page.waitForXPath("//input [@data-test='continue']")).click()

//Нажимаем на Finish
await(await page.waitForXPath("//button [@name='finish']")).click()

//Проверка, что появился текст "Thank you for your order"
try{
  console.log ("Появился итог")
  await page.waitForXPath("//h2 [contains(text(), 'THANK YOU')]")

} catch(err){
  redLog("Не появился")
}

await browser.close()
})()