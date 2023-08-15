const {Given,When, And, Then} = require('@cucumber/cucumber');
const expect = require("chai");
const puppeteer = require("puppeteer");

var {setDefaultTimeout} = require("@cucumber/cucumber");
setDefaultTimeout(60*1000);

Given('The browser is open', async function () {
    this.browser = await puppeteer.launch({headless:false})
    this.page = await this.browser.newPage();
    console.log("The browser is open!");
  });

  When('open the google page', async function () {
    await this.page.goto("https://google.com");
  });

  When('search for chercher tech', async function () {
    await this.page.waitForSelector("[name='q']");
    await this.page.type("[name='q']", "chercher tech");
    await this.page.click("[name='btnK']", {time});
  });

  Then('Count the results', async function () {
    var linkTexts = await this.page.$$eval(".plan-features a", elements => elements.map(item => item.textContent));
    console.log(linkTexts.length);
  });