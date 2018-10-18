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

// Use the current date/time as a folder name
function folderNameGen() {
  var now = new Date();
  var y = now.getFullYear();
  var m = now.getMonth() + 1;
  var d = now.getDate();
  var mm = m < 10 ? '0' + m : m;
  var dd = d < 10 ? '0' + d : d;
  var hour = now.getHours();
  var min = now.getMinutes();
  var ms = now.getMilliseconds();
  
  return '' + y + mm + dd + '_' + hour + min + '_' + ms;
}

// Checks to make sure a directory is there. If not, create it.
function dirExist(d) {
  if (!fs.existsSync(d)){
    fs.mkdirSync(d);
	console.log('  creating ' + d);
  }
}

var screenMainDir = './screenshots/';
var snapshotDir = screenMainDir + folderNameGen();

// Make sure the above directories are available
console.log('Checking to make sure screenshots directories exist.');
dirExist(screenMainDir);
dirExist(snapshotDir);

console.log('Capturing sites.....');

// Loop through the sites and get a screenshot
for (let i = 0, len = sites.length; i < len; i++) {
  let site = sites[i];
  
  (async () => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--headless', '--disable-gpu']
    });
    const page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1024});
	await page.setDefaultNavigationTimeout(90000)
	
	try {
      await page.goto(site.url);
      await page.screenshot({path: snapshotDir + '/' + site.filename});	  
	} catch (error) {
      console.log(error);
    }

    await browser.close();
  })();
};
