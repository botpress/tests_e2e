/**
 login.test.ts

 The purpose of this test is to verify that an existing user 
 - can log into Studio, 
 - can create a new bot
 - can delete the newly created bot
  
 It assumes there are not no other bots and the user has the appropriate rights 
 
 [smoke][full regression]
 
  
 */


import { bpConfig } from '../../jest-puppeteer.config'
import { clickOn, fillField } from '../expectPuppeteer'


import { getPage } from '../utils'
describe('Admin - Init', () => {

  beforeAll(async () => {
   
    const page = await getPage()
    await page.goto(bpConfig.host)
    await page.setDefaultNavigationTimeout(15000)
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
      //await page.waitForNavigation({waitUntil: "networkidle2"});
      await page.waitForNavigation()
      await expect(page.url()).toMatch(`${bpConfig.host}/???????`)
    } 
    else {
      await clickOn('#btn-signin')
      //await page.waitForNavigation({waitUntil: "networkidle2"});
      await page.waitForNavigation()
      await console.log("Workspace1--->"+page.url() )
     }

  })

  it('Load workspaces', async () => {
    await page.waitForNavigation()
    await expect(page.url()).toMatch(`${bpConfig.host}/admin/workspace/default/bots`)
  })

    it('Create test bot and check it appears in the list', async () => {
      if (bpConfig.recreateBot) {
      await clickOn('#btn-create-bot')
      await clickOn('#btn-new-bot')
      await fillField('#input-bot-name', bpConfig.botId)
      await clickOn('#select-bot-templates')
      await fillField('#select-bot-templates', 'Welcome Bot')
      await page.keyboard.press('Enter')  //It simulates the user pressing the Enter key on the keyboard
      //await page.click('#btn-modal-create-bot')  //these two commented lines are completely equivalent
      //await clickOn('#btn-modal-create-bot')     //They simulate the user clicking with mouse the UI button
     
     page.waitForSelector(page.$('a[href*="studio/test-bot"]')[0],{visible: true})

      await expect(page.$('a[href*="studio/test-bot"]')[0] !== null)  
      }
      else{
      //no bot created
      await browser.close();
      }

     })

     it('Check we are still in the bot page', async () => {
      await expect(page.url()).toMatch(`${bpConfig.host}/admin/workspace/default/bots`)
    })

    it('Delete the just created bot', async () => {
      await page.waitForSelector("#btn-menu",{visible: true})
      await page.waitForSelector('span[icon="menu"][class="bp3-icon bp3-icon-menu"]',{visible: true})//this is the hamburger on the far right of the new bot entry
      await page.focus('span[icon="menu"][class="bp3-icon bp3-icon-menu"]');
      await page.click('span[icon="menu"][class="bp3-icon bp3-icon-menu"]');
      await clickOn('#btn-delete')     //click delete entry from the menu after clicking hamburger   
      await page.$x('//*[@id="confirmDialog-container"]/div/div[2]/div')[0] //wait the pop-up window appears with the delete button option
      const elements = await page.$x('(//*[@id="confirm-dialog-accept"]/span)')
      await elements[0].click() 
      
      //await page.screenshot({ path: 'page.png', fullPage: true })
      await expect(page.$('a[href="studio/test-bot"]') === null)
    })



})
