
/**
 sideBar.test.ts

 This test checks the basic functionality of the left side bar
 
 [smoke][full regression]
 
  
 */



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

