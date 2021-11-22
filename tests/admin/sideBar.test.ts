/* eslint-disable no-undef */

/**
 sideBar.test.ts

 This test checks for the left bar icons the following:
 - A tooltip appears when hovering on the icons. Note: I do not know how to check
 the text of the tooltip, so the test only checks tha a tooltip appears
 - After clicking on the icon we are redirected to the expected page

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

  it('Hover on the Logs icon to verify the tooltip appears', async () => {
    await page.waitForSelector('#btn-menu-logs', { visible: true })
    await page.hover('#btn-menu-logs');
    const elements = await page.$$('span[class="bp3-popover-target bp3-popover-open"]')// Note: I do not know how to verify the text  
    await expect(await elements.length).toBe(1) // Verifies one tooltip appears
  })

  it('Verify that clicking on the Logs icon redirects to the Logs page', async () => {
    await clickOn('#btn-menu-logs')
    expect(page.url().includes('logs'))
  })

  it('Hover on the Bots icon to verify the tooltip appears', async () => {
    await page.waitForSelector('#btn-menu-bots', { visible: true })
    await page.hover('#btn-menu-bots')
    const elements = await page.$$('span[class="bp3-popover-target bp3-popover-open"]');// Note: I do not know how to verify the text 
    await expect(await elements.length).toBe(1) // Verifies one tooltip appears
  })

  it('Verify that clicking on the Bogs icon redirects to the Bots page', async () => {
    await clickOn('#btn-menu-bots')
    expect(page.url().includes('bots'))
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



  it('Hover on the Source Control icon to verify the tooltip appears', async () => {
    await page.waitForSelector('#btn-menu-version', { visible: true })
    await page.hover('#btn-menu-version')
    const elements = await page.$$('span[class="bp3-popover-target bp3-popover-open"]')// Note: I do not know how to verify the text 
    await expect(await elements.length).toBe(1) // Verifies one tooltip appears
  })

  it('Verify that clicking on the Source Control icon redirects to the code-editor page', async () => {
    await clickOn('#btn-menu-version')
    expect(page.url().includes('version'))
  })

  it('Hover on the Server License icon to verify the tooltip appears', async () => {
    await page.waitForSelector('#btn-menu-license', { visible: true })
    await page.hover('#btn-menu-license')
    const elements = await page.$$('span[class="bp3-popover-target bp3-popover-open"]')// Note: I do not know how to verify the text 
    await expect(await elements.length).toBe(1) // Verifies one tooltip appears
  })

  it('Verify that clicking on the Server License icon redirects to the code-editor page', async () => {
    await clickOn('#btn-menu-license')
    expect(page.url().includes('license'))
  })



  it('Hover on the Languages icon to verify the tooltip appears', async () => {
    await page.waitForSelector('#btn-menu-language', { visible: true })
    await page.hover('#btn-menu-language')
    const elements = await page.$$('span[class="bp3-popover-target bp3-popover-open"]')// Note: I do not know how to verify the text 
    await expect(await elements.length).toBe(1) // Verifies one tooltip appears
  })

  it('Verify that clicking on the Languages icon redirects to the code-editor page', async () => {
    await clickOn('#btn-menu-language')
    expect(page.url().includes('languages'))
  })


  it('Hover on the Modules icon to verify the tooltip appears', async () => {
    await page.waitForSelector('#btn-menu-modules', { visible: true })
    await page.hover('#btn-menu-modules')
    const elements = await page.$$('span[class="bp3-popover-target bp3-popover-open"]')// Note: I do not know how to verify the text 
    await expect(await elements.length).toBe(1) // Verifies one tooltip appears
  })

  it('Verify that clicking on the Modules icon redirects to the code-editor page', async () => {
    await clickOn('#btn-menu-modules')
    expect(page.url().includes('modules'))
  })


  it('Hover on the Production Checklist icon to verify the tooltip appears', async () => {
    await page.waitForSelector('#btn-menu-checklist', { visible: true })
    await page.hover('#btn-menu-checklist')
    const elements = await page.$$('span[class="bp3-popover-target bp3-popover-open"]')// Note: I do not know how to verify the text 
    await expect(await elements.length).toBe(1) // Verifies one tooltip appears
  })

  it('Verify that clicking on the Production Checklist icon redirects to the checklist page', async () => {
    await clickOn('#btn-menu-checklist')
    expect(page.url().includes('checklist'))
  })

  it('Hover on the Monitoring icon to verify the tooltip appears', async () => {
    await page.waitForSelector('#btn-menu-monitoring', { visible: true })
    await page.hover('#btn-menu-monitoring')
    const elements = await page.$$('span[class="bp3-popover-target bp3-popover-open"]')// Note: I do not know how to verify the text 
    await expect(await elements.length).toBe(1) // Verifies one tooltip appears
  })

  it('Verify that clicking on the Monitoring icon redirects to the monitoring page', async () => {
    await clickOn('#btn-menu-monitoring')
    expect(page.url().includes('monitoring'))
  })

  it('Hover on the Alerting icon to verify the tooltip appears', async () => {
    await page.waitForSelector('#btn-menu-alerting', { visible: true })
    await page.hover('#btn-menu-alerting')
    const elements = await page.$$('span[class="bp3-popover-target bp3-popover-open"]')// Note: I do not know how to verify the text 
    await expect(await elements.length).toBe(1) // Verifies one tooltip appears
  })

  it('Verify that clicking on the Alerting icon redirects to the alerting page', async () => {
    await clickOn('#btn-menu-alerting');
    expect(page.url().includes('alerting'))
  })


  it('Hover on the Latest Releases icon to verify the tooltip appears', async () => {
    await page.waitForSelector('#btn-menu-releases', { visible: true })
    await page.hover('#btn-menu-releases');
    const elements = await page.$$('span[class="bp3-popover-target bp3-popover-open"]')// Note: I do not know how to verify the text 
    await expect(await elements.length).toBe(1) // Verifies one tooltip appears
  })

  it('Verify that clicking on the Latest Releases icon redirects to the latestReleases page', async () => {
    await clickOn('#btn-menu-releases');
    expect(page.url().includes('latestReleases'))
  })

  /** 
  
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
  
   */



})