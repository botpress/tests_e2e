import axios from 'axios'
import path from 'path'

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

describe('Admin - Bot Management', () => {
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
    await page.waitForNavigation()
    await page.goto(`${bpConfig.host}/admin/workspace/${workspaceId}/bots`)
    if (page.url()!==`${bpConfig.host}/admin/workspace/${workspaceId}/bots`){
      await page.waitForNavigation()
    }

  })

  it('Import bot from archive', async () => {
    await page.waitForSelector('#btn-create-bot',{visible: true})
    await clickOn('#btn-create-bot')
  
    await clickOn('#btn-import-bot')
    await fillField('#input-botId', importBotId)

    await uploadFile('input[type="file"]', path.join(__dirname, '../assets/bot-import-test.tgz'))
    await clickOn('#btn-upload')
    await page.waitForTimeout(3000)
    //await expectAdminApiCallSuccess(`workspace/bots/${importBotId}/import`, 'POST')
    page.waitForSelector(page.$(`a[href*="studio/${importBotId}"]`)[0],{visible: true})

    await expect(page.$(`a[href*="studio/${importBotId}"]`)[0] !== null)  

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
    await expect(page.$(`a[href*="studio/${importBotId}"]`)[0] === null)
  })






  it('Create temporary bot', async () => {
    await page.waitForSelector('#btn-create-bot',{visible: true})

    await clickOn('#btn-create-bot')
    await page.waitFor(100)
    await clickOn('#btn-new-bot')

    await fillField('#input-bot-name', tempBotId)
    await clickOn('#select-bot-templates')
    await fillField('#select-bot-templates', 'Welcome Bot') // Using fill instead of select because options are created dynamically
    await clickOn('#btn-modal-create-bot')  //Simulates user clicking the UI button with the mouse
    
    await Promise.all([expectAdminApiCallSuccess('workspace/bots', 'POST'), clickOn('#btn-modal-create-bot')])

 
  })

  it('Train Warning', async () => {
   // await page.waitForTimeout(30000); 
       //await expectModuleApiCallSuccess('nlu', tempBotId, 'training/en', 'GET')
       //await page.screenshot({ path: 'page.png', fullPage: true })
       await expect(page.$('span[icon="warning-sign"]')[0] !== null)  
 
  })
/** 
  it('Export bot', async () => {
    await clickButtonForBot('#btn-export', tempBotId)

    const response = await page.waitForResponse(`${bpConfig.host}/api/v2/admin/workspace/bots/${tempBotId}/export`)
    expect(response.status()).toBe(200)

    const responseSize = Number(response.headers()['content-length'])
    expect(responseSize).toBeGreaterThan(100)
  })

  it('Create revision', async () => {
    await Promise.all([
      expectAdminApiCallSuccess(`workspace/bots/${tempBotId}/revisions`, 'POST'),
      clickButtonForBot('#btn-createRevision', tempBotId)
    ])
    await closeToaster()
  })

  it('Rollback revision', async () => {
    await clickButtonForBot('#btn-rollbackRevision', tempBotId)
    await expectMatchElement('#select-revisions')

    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    await clickOn('#chk-confirm')

    await Promise.all([
      expectAdminApiCallSuccess(`workspace/bots/${tempBotId}/rollback`, 'POST'),
      clickOn('#btn-submit')
    ])
    await page.waitFor(500)
  })

  it('Delete temporary bot', async () => {
    await clickButtonForBot('#btn-delete', tempBotId)
    await page.waitFor(1000)
    await clickOn(CONFIRM_DIALOG.ACCEPT)
    await expectAdminApiCallSuccess(`workspace/bots/${tempBotId}/delete`, 'POST')
    await page.waitFor(200)
  })

  it('Changes bot converse config to disable public endpoint', async () => {
    await clickOn('#btn-menu-code-editor') // Navigate to admin code editor
    await page.waitFor(1000) // Wait for code editor to display
    await clickOn('span.bp3-button-text', { text: 'Advanced Editor' }) // Display raw editor
    await page.waitFor(500)
    await clickOn('span.bp3-tree-node-label', { text: 'bots' })
    await clickOn('span.bp3-tree-node-label', { text: bpConfig.botId })
    await clickOn('span.bp3-tree-node-label', { text: 'bot.config.json' })
    await page.focus('#monaco-editor')
    await page.mouse.click(500, 100)
    await page.waitFor(500) // Required so the editor is correctly focused at the right place
    await triggerKeyboardShortcut('End', false)
    await page.keyboard.type('"converse": {"enableUnsecuredEndpoint": false},') // Edit bot config
    await clickOn('svg[data-icon="floppy-disk"]')

    let status
    try {
      const resp = await axios.post(`${bpConfig.apiHost}/api/v1/bots/${bpConfig.botId}/converse/test`)
      status = resp.status
    } catch (err) {
      status = err.response.status
    }

    expect(status).toEqual(403)
  })

*/

})
