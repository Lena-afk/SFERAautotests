const reporter = require("cucumber-html-reporter");
const { launch } = require("puppeteer");
const options = {
    theme: 'bootstrap',
    jsonFile: 'cucumber-report.json',
    output: 'cucumber-html-result.html',
    reportSuiteAsScenaros: true,
    launchReport: false,
}

reporter.generate(options);