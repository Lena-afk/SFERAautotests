const puppeteer = require('puppeteer');

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
  await page.goto('https://garrypotter.net/')
  await delay(5000)
  
  let nameParts = [{name: 'Книги о Гарри Поттере', good: '1'}, {name: 'Гарри Поттер на английском языке', good: '2'},
  {name: 'Настольные игры Гарри Поттер', good: '3'}, {name:'Новогодние игрушки', good:'4'}, {name:'Ручки Гарри Поттер', good:'5'}]
  let qty = ['1', '2', '3', '4', '5']
  let texts_gp = []
  //Добавляем все товары в корзину
for (const namePart of nameParts){
  await delay(1000)
  await(await page.waitForXPath("//button//span[text()='Каталог']")).click()
  await delay(1000)
  await(await page.waitForXPath("//div[@class='catalog-btn__menu-item']/a[text()='"+namePart.name+"']", {timeout:70000})).click()

  //Проверка на правильность открывшегося раздела
  let element = await page.waitForXPath("(//button[@title='Купить'])["+namePart.good+"]/../../a[@class='lnk goods__name' and text()]")
  let value = await page.evaluate(element => element.textContent, element)
  texts_gp.push(value)
  console.log(texts_gp)
  try{
    console.log("Открыт верный раздел")
    await page.waitForXPath("//h1[text()='"+namePart.name+"']")

} catch(err){
    redLog("Открыт неверный раздел")
}
//Добавление в корзину товара
await(await page.waitForXPath("(//button[@title='Купить'])["+namePart.good+"]")).click()
await delay(1000)
await(await page.waitForXPath("//button[@class='modal__close']")).click()
await delay(1000)
//Переход к главной странице
await(await page.waitForXPath("//a[@title='Каталог товаров']")).click()
}

//Переход к корзине
await(await page.waitForXPath("//button[@title='Корзина']")).click()
try{
    console.log("Корзина открыта")
    await page.waitForXPath("//span[text()='Корзина заказов']")

} catch(err){
    redLog("Корзина не открыта")
}

//Проверка на наличие товаров в корзине
for (num of qty){
    await delay(1000)
    try{
        console.log("Товар в корзине")
        await page.waitForXPath("(//div[@class='cart__product cart__row'])["+num+"]")
    
    } catch(err){
        redLog("Товар не найден в корзине")
    }
}
//Удаляем первый товар
console.log ("Удаляем товар")
await(await page.waitForXPath("(//div[@class='cart__product-table']//span[@title='Удалить товар'])[1]")).click()
for (text_ of texts_gp){
    await delay(1000)
    try{
        await page.waitForXPath ("//div[@class='cart__product cart__row']//a[text()='"+text_+"']")
    
    } catch(err){
        console.log("Товар "+text_+" удален")
    }
}

await delay(1000)
await browser.close()
})()