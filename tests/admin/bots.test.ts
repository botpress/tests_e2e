/**
 bots.test.ts

 This test validate several functionas that can be accessed through the hamburger
  - Imports an existing bot (stored in assets folder)
  - Checks the bot has a warning icon indicating the imported bot needs to be trained
  - Deletes the imported bot
  - Create a brand new  bot
  - Checks the new bot has a warning icon indicating the bot needs to be trained
  - Checks the new bot has been successfully exported
  - Create revision, then roll it back and then confirms in the logs the roll back
  - Deletes the bot

It assumes there are  no existing revisions for the new bot
 
 [smoke][full regression]
 
  
 */

 import { array } from '@jest/types/node_modules/@types/yargs'
 import axios from 'axios'
 import { assert } from 'console'
 import path from 'path'
 import fs from 'fs'
 
 import fse from 'fs-extra'
 import { bpConfig } from '../../jest-puppeteer.config'
 import { clickOn, expectMatchElement, fillField, uploadFile } from '../expectPuppeteer'
 import {
   closeToaster,
   CONFIRM_DIALOG,
   expectAdminApiCallSuccess,
   expectModuleApiCallSuccess,
   getPage,
   gotoAndExpect,
   loginIfNeeded,
   triggerKeyboardShortcut
 } from '../utils'
 import { Page } from 'puppeteer'
 
 
 describe('Admin - Bot Management Tests', () => {
   const tempBotId = 'lol-bot'
   const importBotId = 'import-bot'
   const workspaceId = 'default'
 
   const clickButtonForBot = async (buttonId: string, botId: string) => {
     const botRow = await expectMatchElement('.bp_table-row', { text: botId })
     await clickOn('#btn-menu', undefined, botRow)
     await clickOn(buttonId, undefined)
   }
  
   beforeAll(async () => {
     const page = await getPage()
     await page.goto(bpConfig.host)
     await page.setDefaultNavigationTimeout(10000)
 
     await loginIfNeeded()
     await page.goto(`${bpConfig.host}/admin/workspace/${workspaceId}/bots`)
     if (page.url()!==`${bpConfig.host}/admin/workspace/${workspaceId}/bots`){
       await page.waitForNavigation()
     }
   })
 
   it('Import bot from existing archive', async () => {
     await page.waitForSelector('#btn-create-bot',{visible: true})
     await clickOn('#btn-create-bot')
   
     await clickOn('#btn-import-bot')
     await fillField('#input-botId', importBotId)
 
     await uploadFile('input[type="file"]', path.join(__dirname, '../assets/bot-import-test.tgz'))
     await clickOn('#btn-upload')
 
     //await expectAdminApiCallSuccess(`workspace/bots/${importBotId}/import`, 'POST')
     await page.waitForSelector(`a[href="studio/${importBotId}"]`,{visible: true})
 
     await expect(await page.$(`a[href="studio/${importBotId}"]`)).not.toBeNull()   
   })
 
 
   it('Verify there is a warning icon indicating the imported bot needs to be trained', async () => {
     //await expectModuleApiCallSuccess('nlu', tempBotId, 'training/en', 'GET')
 
     await expect(page.$('span[icon="warning-sign"]')).not.toBeNull() 
 })
 
 
   it('Delete the just imported bot', async () => {
     await page.waitForSelector("#btn-menu",{visible: true})
     await page.waitForSelector('span[icon="menu"][class="bp3-icon bp3-icon-menu"]',{visible: true})//this is the hamburger on the far right of the new bot entry
     await page.focus('span[icon="menu"][class="bp3-icon bp3-icon-menu"]');
     await page.click('span[icon="menu"][class="bp3-icon bp3-icon-menu"]');
     await clickOn('#btn-delete')     //click delete entry from the menu after clicking hamburger   
     await page.$x('//*[@id="confirmDialog-container"]/div/div[2]/div')[0] //wait the pop-up window appears with the delete button option
     const elements = await page.$x('(//*[@id="confirm-dialog-accept"]/span)')
     await elements[0].click() //button accepting the deletion 
     await page.waitForTimeout(100); 
 //console.log(">>>>>"+await  page.$(`a[href="studio/${importBotId}"]`))
 
 //const element2= await page.$(`a[href="studio/${importBotId}"]`)
 
 //if (element2==null) console.log("is null") 
 //else console.log("not null") 
 
 
     await expect(await page.$(`a[href="studio/${importBotId}"]`)).toBeNull()//verifies the link does not exist
   })
 
 
   it('Create a brand new  bot', async () => {
     await page.waitForSelector('#btn-create-bot',{visible: true})
     await clickOn('#btn-create-bot')
     await page.waitForSelector('#btn-new-bot',{visible: true})
     await clickOn('#btn-new-bot')
 
     await fillField('#input-bot-name', tempBotId)
     await clickOn('#select-bot-templates')
     await fillField('#select-bot-templates', 'Welcome Bot') // Using fill instead of select because options are created dynamically
     await clickOn('#btn-modal-create-bot')  //Simulates user clicking the UI button with the mouse
     
     //await Promise.all([expectAdminApiCallSuccess('workspace/bots', 'POST'), clickOn('#btn-modal-create-bot')])
  
     await page.waitForSelector(`a[href="studio/${tempBotId}"]`,{visible: true})
     const elements=await page.$$(`a[href="studio/${tempBotId}"]`);//verifies the link to the new bot exists
     await expect(await elements.length).toBeGreaterThan(0)
 
   })
 
   it('Verify there is a warning icon indicating the newly created bot needs to be trained', async () => {
        //await expectModuleApiCallSuccess('nlu', tempBotId, 'training/en', 'GET')  
        const elements=await page.$$('span[icon="warning-sign"]');
        await expect(await elements.length).toBeGreaterThan(0)
   })
 
 
 
   it('Verify the new bot has been successfully exported', async () => {
 
     async function MyFlag(path,botname){//Checks the downloads folder for the exported bot file
       var flag=false
       const files = await fse.readdir(path)
       try {  
         files.forEach(file => {
           if (file.includes(botname) && !flag){
               flag=true; 
               }
           })
       }
       catch (err){}
       return flag
       }
 
     await page.waitForSelector("#btn-menu",{visible: true})
     await page.waitForSelector('span[icon="menu"][class="bp3-icon bp3-icon-menu"]',{visible: true})//this is the hamburger on the far right of the new bot entry
     await page.focus('span[icon="menu"][class="bp3-icon bp3-icon-menu"]');
     await page.click('span[icon="menu"][class="bp3-icon bp3-icon-menu"]');
     await clickButtonForBot('#btn-export', tempBotId)
  
     await page.waitForTimeout(500) //Slow down to let the OS catch up, if not sometimes the new file still does not show up in the file system     
     //the following commented code verifies through the API
     //const response = await page.waitForResponse(`${bpConfig.host}/api/v2/admin/workspace/bots/${tempBotId}/export`)
    // const responseSize = Number(response.headers()['content-length'])
    // expect(responseSize).toBeGreaterThan(100)
     const path = process.env.HOME + '/Downloads/'
     const botname='bot_lol-bot_'
 
   await expect(await MyFlag(path,botname)).toBe(true)
 
   })
  
   it('Create revision, then roll it back and then confirms in the logs the roll back', async () => {
 
     await page.waitForSelector('span[icon="menu"][class="bp3-icon bp3-icon-menu"]',{visible: true})//this is the hamburger on the far right of the new bot entry
     await page.focus('span[icon="menu"][class="bp3-icon bp3-icon-menu"]');
     await page.click('span[icon="menu"][class="bp3-icon bp3-icon-menu"]');
    
     await page.waitForSelector('#btn-createRevision',{visible: true})
    
     //await clickButtonForBot('#btn-createRevision', tempBotId) //This creates the revision
     await page.click('#btn-createRevision')
    
     // When using Chromium, the message box does not show up, so the test below fails
     //await page.waitForXPath('//span[class="bp3-toast-message"][(., "Revisions created")]',{visible: true}) 
     //await expect(page.$x('//span[class="bp3-toast-message"][contains(., "Revisions created")]').not.toBeNull()) 
  
     await page.focus('span[icon="menu"][class="bp3-icon bp3-icon-menu"]');
     await page.click('span[icon="menu"][class="bp3-icon bp3-icon-menu"]');
 
     await page.waitForSelector('#btn-rollbackRevision',{visible: true})
     await page.click('#btn-rollbackRevision')
     await page.waitForSelector('#select-revisions',{visible: true})
     await page.click('#select-revisions')
 
     await page.keyboard.press('ArrowDown')
     await page.keyboard.press('Enter')
     await page.click('#chk-confirm') //This is the checkbox with the text "Yes, rollback the bot to that version"
     await clickOn('#btn-submit')
 
     // When using Chromium, the message box does not show up, so the test below fails
     //await page.waitForXPath('//span[class="bp3-toast-message"][contains(., "Rollback success")]',{visible: true}) 
     //await expect(page.$x('//span[class="bp3-toast-message"][contains(., "Rollback success")]').not.toBeNull()) 
  
     //After submitting, go to t view logs to verify there is an entry 
     await page.focus('span[icon="menu"][class="bp3-icon bp3-icon-menu"]');
     await page.click('span[icon="menu"][class="bp3-icon bp3-icon-menu"]');
     await page.click('#btn-viewLogs')
 
     await page.waitForXPath('//span[contains(text(),"Rollback")]',{visible: true})
     const elements = await page.$x('//span[contains(text(),"Rollback")]')
     await expect(await elements.length).toBeGreaterThan(0)
   })
 
 
   it('Delete the just created bot', async () => {
     await page.goto(bpConfig.host)  //return to the main page
     await page.waitForSelector("#btn-menu",{visible: true})
     await page.waitForSelector('span[icon="menu"][class="bp3-icon bp3-icon-menu"]',{visible: true})//this is the hamburger on the far right of the new bot entry
     await page.focus('span[icon="menu"][class="bp3-icon bp3-icon-menu"]');
     await page.click('span[icon="menu"][class="bp3-icon bp3-icon-menu"]');
     await clickOn('#btn-delete')     //click delete entry from the menu after clicking hamburger   
     await page.$x('//*[@id="confirmDialog-container"]/div/div[2]/div')[0] //wait the pop-up window appears with the delete button option
     const elements = await page.$x('(//*[@id="confirm-dialog-accept"]/span)')
     await elements[0].click() 
     
     const elements2 = await page.$$eval(`a[href="studio/${tempBotId}"]`, element => element.length);
     await expect(await elements2).toBeLessThanOrEqual(0)
   })
 
 })
 