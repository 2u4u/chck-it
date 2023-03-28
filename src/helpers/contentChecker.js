import puppeteer from 'puppeteer';
import fs from 'fs';
// import path, { dirname } from 'path';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const ensureValidUrl = (url) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'http://' + url;
  }
  return url;
}

const saveScreenshot = async(savePath, currentHtml, page, url, browser) => {
  // console.log('__dirname', __dirname);
  // const screenshotPath = path.join(__dirname, `../../assets/${url}.png`);
  const folderPath = 'assets';
  console.log('folderPath', folderPath);

  if (!fs.existsSync(folderPath)) {
    console.log('folderPath does not exist');
    fs.mkdirSync(folderPath);
  }

  const screenshotPath = `assets/${url}.png`;
  await page.screenshot({ path: screenshotPath });
  
  fs.writeFileSync(savePath, currentHtml);
  
  await browser.close();
  return screenshotPath;
}

export const checkForChanges = async(rawUrl, savePath) => {
  try {
    const url = ensureValidUrl(rawUrl);  
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.goto(url);  
    await page.waitForSelector('body');

    const currentHtml = await page.content();

    if (fs.existsSync(savePath)) {
      const savedHtml = fs.readFileSync(savePath, 'utf8');
      if (currentHtml !== savedHtml) {
        const screenshot = await saveScreenshot(savePath, currentHtml, page, rawUrl, browser);
        return screenshot;
      } else {
        await browser.close();
        return null;
      }
    } else {
      const screenshot = await saveScreenshot(savePath, currentHtml, page, rawUrl, browser);
      return screenshot;
    }
  } catch (error) {
    console.log('error', error);
  }
}