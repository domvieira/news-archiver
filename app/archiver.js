const puppeteer = require('puppeteer');
const fs = require('fs')
const yaml = require('js-yaml');

// Load the sites config file
try {
  var doc = yaml.safeLoad(fs.readFileSync('config/sites.yml', 'utf8'));
  var sites = doc.sites;
  console.log('Loading Sites Config from config/sites.yml');
} catch (e) {
  console.log(e);
}

// Create the screenshot directory
var dir = './screenshots';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

console.log('Capturing the following sites:');

// Loop through the sites and get a screenshot
for (let i = 0, len = sites.length; i < len; i++) {
  let site = sites[i];
  
  console.log('  ' + site.url);
  
  (async () => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--headless', '--disable-gpu']
    });
    const page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1024});
	await page.setDefaultNavigationTimeout(90000)
	
	try {
      await page.goto(site.url);
      await page.screenshot({path: dir + '/' + site.filename});	  
	} catch (error) {
      console.log(error);
    }

    await browser.close();
  })();
};
