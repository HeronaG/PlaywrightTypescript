import {test, expect } from "@playwright/test";
import sharp from 'sharp';



test.beforeEach(async ({ page}) => {
    await page.goto('https://hacktheicon.scramblerducati.com/');
    await page.getByRole('button', { name: 'Accept All Cookies' }).click();
    
    await page.getByRole('link', { name: 'Start to create' }).click();
    }); 

    test('Test Text visible 1', async ({ page }) => {

        // Expect the following heading.
        await expect(page.getByRole('heading', { name: 'CREATE YOUR CUSTOM SCRAMBLER'})).toBeVisible();
      });

      test('Count images rendered', async ({ page }) => {
      await page.getByRole('button', { name: 'Generate', exact: true }).click();
      //Wait until Spinning Animated Scrabbler is enable.
      await page.getByRole('img', { name: 'Spinning animated Scrambler' }).isEnabled( {timeout: 10000 });
      await page.getByRole('img', { name: 'Spinning animated Scrambler' }).isDisabled({ timeout: 20000 });
      
      // Wait until at least one image appears before proceeding
        await page.waitForSelector('div.relative', { timeout: 10000 });
    
      // Get all images in the 'relative'class
        const motorcycleImages = await page.$$('div.relative');
    
        console.log(`Number of motorcycle images: ${motorcycleImages.length}`);
        expect(motorcycleImages.length).toEqual(4)
    });

    test('Download and Save image', async ({ page }) => {
      await page.getByRole('button', { name: 'Generate', exact: true }).click();
    //Wait until Spinning Animated Scrabbler is enable.
    await page.getByRole('img', { name: 'Spinning animated Scrambler' }).isEnabled( {timeout: 15000 });
    await page.getByRole('img', { name: 'Spinning animated Scrambler' }).isDisabled({ timeout: 20000 });
    
    // Wait until at least one image appears before proceeding
      await page.waitForSelector('div.relative', { timeout: 25000 });
     // Get all images in the 'relative'class
            const motorcycleImages = await page.$$('div.relative');
    
            console.log(`Number of motorcycle images: ${motorcycleImages.length}`);


      await page.getByRole('textbox', { name: 'First Name' }).fill('tester');

      await page.getByRole('textbox', { name: 'Last Name' }).click();
      await page.getByRole('textbox', { name: 'Last Name' }).fill('chester');


      await page.getByRole('textbox', { name: 'Email' }).click();
      await page.getByRole('textbox', { name: 'Email' }).fill('tester.chester@test.com');
  
      await page.getByRole('combobox', { name: 'Select Country' }).click();
      await page.getByRole('option', { name: 'Australia' }).click();
      await page.getByRole('checkbox', { name: 'for marketing activities via' }).click();
      await page.getByRole('checkbox', { name: 'to understand your' }).click();
      await page.getByRole('button', { name: 'Submit' }).click();

   const image = page.locator('img[src*="undefined_0"]').first();
//await image.scrollIntoViewIfNeeded();
await image.waitFor({ state: 'visible', timeout: 60000 });
await image.click();
      
await page.getByRole('button', { name: 'Next' }).click();


 // Trigger the download and wait for the download event
  const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('button', { name: 'DOWNLOAD' }).click()
]);

await download.path();

const uniqueFilename = `downloads/newimage_${Date.now()}.jpeg`;
await download.saveAs(uniqueFilename);

// Read the image metadata using sharp
const metadata = await sharp(uniqueFilename).metadata();

// Check that the resolution equals 2056 x 1368
expect(metadata.width).toBe(2056);
expect(metadata.height).toBe(1368);

      
  });