/* eslint-disable no-var */
/* eslint-disable spaced-comment */
/* eslint-disable no-undef */

/**
 sideBar.test.ts

 This test verifies the following Code Editor page functionality


 [smoke][full regression]
 */

import { bpConfig } from '../../jest-puppeteer.config'
import { clickOn, fillField } from '../expectPuppeteer'
var utils = require('../utils');

describe('Admin - Init', () => {
  beforeAll(async () => {
    const page = await utils.getPage()
    await page.goto(bpConfig.host)
    await page.setDefaultNavigationTimeout(15000)
    await page.evaluate(() => {
      window.localStorage.setItem('guidedTour11_9_0', 'true')
    })
  })

  it('Enter credentials and submit and load workspace', async () => {
    await fillField('#email', bpConfig.email)
    await fillField('#password', bpConfig.password)

    if (page.url().includes('/register')) {
      await fillField('#confirmPassword', bpConfig.password)
      await clickOn('#btn-register')
      await page.waitForNavigation()
      await page.waitForTimeout(500);
      await expect(page.url()).toMatch(`${bpConfig.host}/admin`)
    }
    else {
      await clickOn('#btn-signin')
      await page.waitForNavigation()
      await page.waitForTimeout(500);
      await expect(page.url()).toMatch(`${bpConfig.host}/admin`)
    }
  })





  it('Hover on the Code Editor icon to verify the tooltip appears', async () => {
    await page.waitForSelector('#btn-menu-code-editor', { visible: true })
    await page.hover('#btn-menu-code-editor')
    const elements = await page.$$('span[class="bp3-popover-target bp3-popover-open"]')// Note: I do not know how to verify the text 
    await expect(await elements.length).toBe(1) // Verifies one tooltip appears
  })

  it('Verify that clicking on the Code Editor icon redirects to the code-editor page', async () => {
    await clickOn('#btn-menu-code-editor')
    expect(page.url().includes('code-editor'))
  })


  it('Changes bot converse config to disable public endpoint', async () => {
    await clickOn('#btn-menu-code-editor') // Navigate to admin code editor
    //await page.waitFor(1000) // Wait for code editor to display
    await clickOn('span.bp3-button-text', { text: 'Advanced Editor' }) // Display raw editor
    //await page.waitFor(500)
    await clickOn('span.bp3-tree-node-label', { text: 'bots' })
    await clickOn('span.bp3-tree-node-label', { text: bpConfig.botId })
    await clickOn('span.bp3-tree-node-label', { text: 'bot.config.json' })
    await page.focus('#monaco-editor')
    await page.mouse.click(500, 100)
    //await page.waitFor(500) // Required so the editor is correctly focused at the right place
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





})