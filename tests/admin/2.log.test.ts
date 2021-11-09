import { bpConfig } from '../../jest-puppeteer.config'
import { clickOn, fillField } from '../expectPuppeteer'
//import { expectAdminApiCallSuccess } from '../utils'
//import { Page } from 'puppeteer'
//import { launch, Page } from 'puppeteer';
//import { getPage } from '../utils'
const puppeteer = require('puppeteer');

describe('Admin - Init', () => {

  beforeAll(async () => {
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768});
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' })
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36')
    
    await page.goto(bpConfig.host)
    //await page.setDefaultNavigationTimeout(15000)
    await page.evaluate(() => {
      window.localStorage.setItem('guidedTour11_9_0', 'true')
    })
  })


  it('Load Login page', async () => {
    expect(page.url().includes('login') || page.url().includes('register')).toBeTruthy()
  })

  it('Enter credentials and submit and load workspace', async () => {
    await fillField('#email', bpConfig.email)
    await fillField('#password', bpConfig.password)

    if (page.url().includes('/register')) {
      await fillField('#confirmPassword', bpConfig.password)
      await clickOn('#btn-register')
      await page.waitForNavigation({waitUntil: "networkidle2"});
      await expect(page.url()).toMatch(`${bpConfig.host}/???????`)
    } 
    else {
      await clickOn('#btn-signin')
      await page.waitForNavigation({waitUntil: "networkidle2"});
      await console.log("Workspace1--->"+page.url() )

     // await expect(page.url()).toMatch(`${bpConfig.host}/admin/workspace/default/bots`)
     }

  })

  it('Load workspaces', async () => {
    await page.waitForNavigation({waitUntil: "networkidle2"});
    await console.log("Workspace2--->"+ `${bpConfig.host}/admin/workspace/default/bots` )
    await console.log("Workspace2--->"+page.url() )
   await expect(page.url()).toMatch(`${bpConfig.host}/admin/workspace/default/bots`)
  })

    it('Create test bot and check it appears in the list', async () => {
      if (bpConfig.recreateBot) {
      await clickOn('#btn-create-bot')
      await clickOn('#btn-new-bot')

      await fillField('#input-bot-name', bpConfig.botId)
      await clickOn('#select-bot-templates')
      await fillField('#select-bot-templates', 'Welcome Bot')
      await console.log("Before clicking the bot creation button--->"+page.url() )

      await page.keyboard.press('Enter')

      page.waitForSelector(page.$('a[href*="studio/test-bot"]')[0],{visible: true})
      await console.log("Bot created--->"+page.url() )
      await expect(page.$('a[href*="studio/test-bot"]')[0] !== null)  
      }
      else{
      //no bot created
      await browser.close();
      }

     })


     it('Check we are still in the bot page', async () => {

      console.log('Check we are still in the bot page')
      await expect(page.url()).toMatch(`${bpConfig.host}/admin/workspace/default/bots`)
    })

    it('Delete the just created bot', async () => {
      await console.log("Before hover--->"+page.url() )
      await page.waitForSelector("#btn-menu",{visible: true})

      await page.waitForSelector('span[icon="menu"][class="bp3-icon bp3-icon-menu"]',{visible: true})

//const hamburger = await page.$('span[icon="menu"][class="bp3-icon bp3-icon-menu"]');
await page.focus('span[icon="menu"][class="bp3-icon bp3-icon-menu"]');
await page.click('span[icon="menu"][class="bp3-icon bp3-icon-menu"]');



await page.waitForTimeout(3000);


await console.log("hamburger visible--->"+page.url() )
 await clickOn('#btn-delete')     //click delete entry from the menu after clicking hamburger
     
        
        // this works and selects the bot url
        //await page.waitForSelector('a[href="studio/test-bot"]',{visible: true})
     
        //*[@id="confirm-dialog-accept"]/span
  
        //*[@id="confirm-dialog-accept"]/span
        //*[@id="confirmDialog-container"]/div/div[2]/div
        await page.$x('//*[@id="confirmDialog-container"]/div/div[2]/div')[0] //wait the pop-up window appears with the delete button option
        const elements = await page.$x('(//*[@id="confirm-dialog-accept"]/span)')
await elements[0].click() 
        
        //await page.$x('//*[@id="confirm-dialog-accept"]/span')[0].click() 
        await page.waitForTimeout(3000); 
        await page.screenshot({ path: 'page.png', fullPage: true })
        await console.log("<----After screenshot--->" )
        await expect(page.$('a[href="studio/test-bot"]') === null)
    })



 //   it('end test', async () => {
  //     await browser.close()
  //  })

})
