import { expect, test } from '@playwright/test';

test('mobile detective journey: retry, hint, save, branch, finish and restart', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('./');
  await page.getByRole('button',{name:'Begin your story'}).click();
  await page.getByRole('button',{name:'Choose Detective'}).click();
  await page.getByRole('button',{name:'Start adventure'}).click();
  await page.getByRole('button',{name:'Simulate tap: The Starry Night'}).click();
  await page.getByRole('button',{name:'Circle: Hint'}).click();
  await expect(page.getByText('Start at the bottom-left', {exact:false})).toBeVisible();
  await page.getByRole('button',{name:'Square: Answer'}).click();
  await page.getByRole('button',{name:'Triangle: A church tower'}).click();
  await expect(page.getByText('Take another look', {exact:false})).toBeVisible();
  await page.getByRole('button',{name:'Circle: A dark tree'}).click();
  await expect(page.getByRole('heading',{name:'Clue collected'})).toBeVisible();
  await page.reload();
  await page.getByRole('button',{name:'Resume your story'}).click();
  await expect(page.getByRole('heading',{name:'Clue collected'})).toBeVisible();
  await page.getByRole('button',{name:'Square: Continue'}).click();
  await page.getByRole('button',{name:'Triangle: Follow the landscape'}).click();
  for(const [title,answer] of [['The Olive Trees','Triangle: They bend and twist'],['Portrait of Joseph Roulin','Square: POSTES']]) {
    await page.getByRole('button',{name:`Simulate tap: ${title}`}).click();
    await page.getByRole('button',{name:'Square: Answer'}).click();
    await page.getByRole('button',{name:answer}).click();
    await page.getByRole('button',{name:'Square: Continue'}).click();
  }
  await page.getByRole('button',{name:'Circle: Follow the gathering'}).click();
  for(const [title,answer] of [['The Potato Eaters','Circle: Five'],['Portrait of Dr. Gachet','Triangle: A pipe']]) {
    await page.getByRole('button',{name:`Simulate tap: ${title}`}).click();
    await page.getByRole('button',{name:'Square: Answer'}).click();
    await page.getByRole('button',{name:answer}).click();
    await page.getByRole('button',{name:'Square: Continue'}).click();
  }
  await expect(page.getByRole('heading',{name:'Keeper of Human Stories'})).toBeVisible();
  await page.getByRole('button',{name:'Start a new story'}).click();
  await page.getByRole('button',{name:'Restart adventure'}).click();
  expect((await page.context().cookies()).some(c=>c.name==='cluezeum_progress_v1')).toBe(false);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('desktop artwork, source information, keyboard role selection and invalid cookies', async ({page,context}) => {
  await context.addCookies([{name:'cluezeum_progress_v1',value:'%broken',url:'http://127.0.0.1:4173/rpg-game-cluezeum/'}]);
  await page.goto('./');
  await expect(page.getByText('Your previous save could not be read', {exact:false})).toBeVisible();
  await page.getByRole('button',{name:'About this exhibition'}).click();
  await expect(page.getByRole('dialog')).toContainText('virtual exhibition');
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Begin your story'}).click();
  await page.keyboard.press('2');
  await expect(page.getByRole('button',{name:'Choose Collector',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.keyboard.press('3');
  await expect(page.getByRole('heading',{name:'Find The Starry Night',exact:true})).toBeVisible();
  await expect(page.locator('.play-heading')).toContainText('The Collector');
  await expect.poll(()=>page.locator('img').evaluateAll(imgs => imgs.every(i=>(i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth > 0))).toBe(true);
});

test('game stays playable when cookies and speech are unavailable', async ({page}) => {
  await page.addInitScript(() => {
    Object.defineProperty(document,'cookie',{get:()=>'',set:()=>{},configurable:true});
    Object.defineProperty(window,'speechSynthesis',{value:undefined,configurable:true});
    Object.defineProperty(window,'SpeechSynthesisUtterance',{value:undefined,configurable:true});
  });
  await page.goto('./');
  await page.getByRole('button',{name:'Begin your story'}).click();
  await page.getByRole('button',{name:'Start adventure'}).click();
  await expect(page.getByText('Cookies unavailable.',{exact:false})).toBeVisible();
  await page.getByRole('button',{name:'Enable audio'}).click();
  await expect(page.getByRole('dialog')).toContainText('Audio is unavailable');
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'View The Olive Trees',exact:true}).click();
  await page.getByRole('button',{name:'Simulate tap: The Olive Trees'}).click();
  await expect(page.getByText('Your current lead is The Starry Night.',{exact:false})).toBeVisible();
  await page.getByRole('button',{name:'Square: Tap artwork'}).click();
  await expect(page.getByRole('heading',{name:'The cypress clue'})).toBeVisible();
});

test('small screens contain the interface and all artwork files load', async ({page}) => {
  await page.setViewportSize({width:320,height:740});
  await page.goto('./');
  await expect.poll(()=>page.locator('img').evaluateAll(imgs=>imgs.every(i=>(i as HTMLImageElement).complete&&(i as HTMLImageElement).naturalWidth>0))).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Begin your story'}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Start adventure'}).click();
  // The journal control appears only after starting: check all header controls remain on screen.
  for (const name of ['Cluezeum home','About this exhibition','Open journal','Enable audio']) {
    const button=page.getByRole('button',{name,exact:true});
    await expect(button).toBeVisible();
    const bounds=await button.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(320);
    expect(bounds!.width).toBeGreaterThanOrEqual(44);
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
  }
  const overflow = await page.evaluate(()=>({
    viewport: innerWidth, width: document.documentElement.scrollWidth,
    elements: Array.from(document.querySelectorAll('body *')).filter(el=>el.getBoundingClientRect().right>innerWidth).map(el=>({tag:el.tagName,classes:el.className,right:el.getBoundingClientRect().right}))
  }));
  expect(overflow.width,JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.viewport);
  await page.screenshot({path:'test-results/mobile-game.png',fullPage:true});
});

test('home device resumes saved progress and page transitions move keyboard focus', async ({page}) => {
  await page.goto('./');
  await page.getByRole('button',{name:'Begin your story'}).click();
  await expect(page.getByRole('heading',{name:'Who will you become?'})).toBeFocused();
  await page.getByRole('button',{name:'Start adventure'}).click();
  await page.getByRole('button',{name:'Square: Tap artwork'}).click();
  await page.getByRole('button',{name:'Cluezeum home'}).click();
  await expect(page.getByRole('heading',{name:'A little curiosity.',exact:false})).toBeFocused();
  await page.reload();
  await page.keyboard.press('3');
  await expect(page.getByRole('heading',{name:'The cypress clue'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Start adventure'})).toHaveCount(0);
  await page.getByRole('button',{name:'Restart',exact:true}).click();
  await page.getByRole('button',{name:'Restart adventure',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Who will you become?'})).toBeFocused();
});
