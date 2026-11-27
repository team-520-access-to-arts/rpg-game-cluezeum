import { expect, test } from '@playwright/test';

test('Met mobile chapter: sources, seven works, branching, save/resume and switching', async ({page}) => {
 await page.setViewportSize({width:390,height:844});
 await page.goto('./');
 await page.getByRole('button',{name:'Select The Sky Archive'}).click();
 await page.getByRole('button',{name:'About this exhibition'}).click();
 await expect(page.getByRole('dialog')).toContainText('February 28, 2027');
 await expect(page.getByRole('dialog')).toContainText('Physical availability');
 await expect(page.getByRole('link',{name:'Exhibition object list'})).toHaveAttribute('href','https://www.metmuseum.org/exhibitions/chasing-clouds/exhibition-objects');
 await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Begin your story'}).click();
 await page.getByRole('button',{name:'Start adventure'}).click();
 await expect(page.locator('.gallery-thumbnails button')).toHaveCount(7);
 await expect.poll(()=>page.locator('img').evaluateAll(imgs=>imgs.every(i=>(i as HTMLImageElement).complete&&(i as HTMLImageElement).naturalWidth>0))).toBe(true);
 await expect(page.getByRole('link',{name:'Source: The Met collection record',exact:true})).toHaveAttribute('href','https://www.metmuseum.org/art/collection/search/370637');
 await page.getByRole('button',{name:'Square: Tap artwork'}).click();
 await expect(page.locator('.play-device')).toContainText('Fictional mission');
 await page.getByRole('button',{name:'Square: Answer'}).click();
 await page.getByRole('button',{name:'Circle: Across the bottom edge'}).click();
 await expect(page.getByText('Take another look',{exact:false})).toBeVisible();
 await page.getByRole('button',{name:'Triangle: At the upper right'}).click();
 await page.reload();
 await page.getByRole('button',{name:'Resume your story'}).click();
 await expect(page.locator('.play-heading')).toContainText('1 / 7');
 await page.getByRole('button',{name:'Square: Continue'}).click();
 await page.getByRole('button',{name:'Triangle: Explore image-making'}).click();
 for(const answer of ['Circle: Yellow and orange','Square: Rooftops and a dome','Triangle: At the horizon']) {
  await page.getByRole('button',{name:'Square: Tap artwork'}).click();
  await page.getByRole('button',{name:'Square: Answer'}).click();
  await page.getByRole('button',{name:answer,exact:true}).click();
  await page.getByRole('button',{name:'Square: Continue'}).click();
 }
 await page.getByRole('button',{name:'Circle: Follow observation'}).click();
 for(const answer of ['Square: The sky and clouds','Circle: Blue','Triangle: Graphite']) {
  await page.getByRole('button',{name:'Square: Tap artwork'}).click();
  await page.getByRole('button',{name:'Square: Answer'}).click();
  await page.getByRole('button',{name:answer,exact:true}).click();
  await page.getByRole('button',{name:'Square: Continue'}).click();
 }
 await expect(page.getByRole('heading',{name:'The Observation Case'})).toBeVisible();
 await page.getByRole('button',{name:'Read your journal'}).click();
 await expect(page.locator('.journal-list li')).toHaveCount(7);
 await page.keyboard.press('Escape');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'Cluezeum home'}).click();
 await page.getByRole('button',{name:'Select The Van Gogh Chapter'}).click();
 await page.getByRole('button',{name:'Keep this story'}).click();
 await page.getByRole('button',{name:'Resume your story'}).click();
 await expect(page.getByRole('heading',{name:'The Observation Case'})).toBeVisible();
 await page.getByRole('button',{name:'Cluezeum home'}).click();
 await page.getByRole('button',{name:'Select The Van Gogh Chapter'}).click();
 await page.getByRole('button',{name:'Restart adventure'}).click();
 await page.getByRole('button',{name:'Start adventure'}).click();
 await expect(page.getByRole('heading',{name:'Find The Starry Night',exact:true})).toBeVisible();
});

test('Met content fits a 320px phone including long titles and source dialogs',async ({page})=>{
 await page.setViewportSize({width:320,height:740});
 await page.goto('./');
 await page.getByRole('button',{name:'Select The Sky Archive'}).click();
 for(const action of ['Begin your story','Start adventure','Triangle: Observe']) {
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:action,exact:true}).click();
 }
 await expect(page.getByRole('dialog')).toContainText('Joseph Michael Gandy');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'test-results/met-mobile.png',fullPage:true});
});
