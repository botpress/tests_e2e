/**
 login.test.ts

 The purpose of this test is to verify that:

    First time can create an account
    afterward existing user can log in using credentials
    Load workspace and Verify  is empty 
    Log out
    Log again, this time the account should already exist 
    Verify the Bottom Panel toggle is visible and click on it
    Verify the Logs option of the Bottom Panel is visible
    Verify the Logs option on the Bottom Panel is visible
    Verify the Debug option on the Bottom Panel is visible
    Verify the All Bots drop down filter on the Bottom Panel is visible 
    Verify the Scroll to Follow Logs icon on the Bottom Panel is visible 
    Verify the Download Logs icon on the Bottom Panel is visible 
    Verify a log file has been saved after clicking the Download Logs icon on the Bottom Panel
    Verify the Delete button on the Bottom Panel is visibl )
    Verify the Minimize/Maximize button on the Bottom Panel is visible 
    Click the Verify the Minimize/Maximize button and verify it changes state 
    Verify there is a [X] button on the bar above the bottom panel 
    Update the profile 
    Change the password 
    Change the language to French (from English)
    Change the language to Spanish (from French)
    Change back the password, so other tests can work and Log out 
    Log again using the new (actually the original) pwd
    Change the language to English (from Spanish)
    Verify the language change and log out
    
 It assumes there are not no other bots and the user has the appropriate rights 
 
 [smoke][full regression]
 
  
 */


import { bpConfig } from '../../jest-puppeteer.config'
import { clickOn, fillField } from '../expectPuppeteer'


//import { getPage, getDateTime,fileExist } from '../utils'

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
      await page.waitForTimeout(500); 
      await expect(page.url()).toMatch(`${bpConfig.host}/admin`)
    } 
    else {
      await clickOn('#btn-signin')
      //await page.waitForNavigation({waitUntil: "networkidle2"});
      await page.waitForNavigation()
      await page.waitForTimeout(500); 
      await expect(page.url()).toMatch(`${bpConfig.host}/admin`)
     }

  })

  it('Verify workspace is empty', async () => {  
    const elements = await  page.$x('//h4[contains(text(),"This workspace has no bots, yet")]')
    await expect(elements.length).toBeGreaterThan(0)

  })


  it('Log out', async () => {  
    await clickOn('#btn-menu')
    await clickOn('#btn-logout')
    await page.waitForTimeout(500); 
    await expect(page.url()).toMatch(`${bpConfig.host}/admin/login/default`)
  })

  it('Log again, this time the account should already exist', async () => {
    await fillField('#email', bpConfig.email)
    await fillField('#password', bpConfig.password)
      await clickOn('#btn-signin')

      await page.waitForNavigation()
      await page.waitForTimeout(500); 
      await expect(page.url()).toMatch(`${bpConfig.host}/admin`) 
  })

//In this section we check different elements of the UI
it('Verify the Bottom Panel toggle is visible and click on it', async () => {
  const isVisible = await page.$eval('span[icon="console"]', (elem) => {
    return window.getComputedStyle(elem).getPropertyValue('visibility') 
    });
    await clickOn('span[icon="console"]')

  await expect(isVisible).toBe("visible")
})

it('Verify the Logs option of the Bottom Panel is visible', async () => {
  const isVisible = await page.$eval('#bp3-tab-title_undefined_logs', (elem) => {
    return window.getComputedStyle(elem).getPropertyValue('visibility') 
    });
  await expect(isVisible).toBe("visible")
})

it('Verify the Logs option on the Bottom Panel is visible', async () => {
  const isVisible = await page.$eval('#bp3-tab-title_undefined_logs', (elem) => {
    return window.getComputedStyle(elem).getPropertyValue('visibility') 
    });
  await expect(isVisible).toBe("visible")
})

it('Verify the Debug option on the Bottom Panel is visible', async () => {
  const isVisible = await page.$eval('#bp3-tab-title_undefined_debug', (elem) => {
    return window.getComputedStyle(elem).getPropertyValue('visibility') 
    });
  await expect(isVisible).toBe("visible")
})



it('Verify the All Bots drop down filter on the Bottom Panel is visible', async () => {
  const isVisible = await page.$eval('button[class="bp3-button style__btn___2mfAm"]', (elem) => {
    return window.getComputedStyle(elem).getPropertyValue('visibility') 
    });
  await expect(isVisible).toBe("visible")
})

it('Verify the Scroll to Follow Logs icon on the Bottom Panel is visible', async () => {
  const isVisible = await page.$eval('svg[data-icon="sort"]', (elem) => {
    return window.getComputedStyle(elem).getPropertyValue('visibility') 
    });
  await expect(isVisible).toBe("visible")
})

it('Verify the Download Logs icon on the Bottom Panel is visible', async () => {
  const isVisible = await page.$eval('svg[data-icon="import"]', (elem) => {
    return window.getComputedStyle(elem).getPropertyValue('visibility') 
    });
  await expect(isVisible).toBe("visible")
})

it('Verify a log file has been saved after clicking the Download Logs icon on the Bottom Panel', async () => {
  await clickOn('svg[data-icon="import"]')
  const myDateTime= utils.getDateTime() //function in utils.ts

  await page.waitForTimeout(500); //Downloading takes some time, and the browser is aware when it ends
  
  const myLogName="logs-"+myDateTime[2] + "-" + myDateTime[1] + "-" + myDateTime[0] + "-" + myDateTime[3]
  const path = process.env.HOME + '/Downloads/'
  const myFlag= await utils.fileExist(path,myLogName)

  await expect(myFlag).toBe(true)
})


it('Verify the Delete button on the Bottom Panel is visibl', async () => {
  const isVisible=await  utils.isElementVisible('#botpress-tooltip-3-trigger') //function in utils.ts
  await expect(isVisible).toBe(true)
})


it('Verify the Minimize/Maximize button on the Bottom Panel is visible', async () => {
  const isVisible=await  utils.isElementVisible('#botpress-tooltip-4-trigger') //function in utils.ts
  await expect(isVisible).toBe(true)
})

it('Click the Verify the Minimize/Maximize button and verify it changes state', async () => {
  if (await utils.doesElementExist('span[icon="minimize"]',300)){
    await clickOn('#botpress-tooltip-4-trigger') //Click on the button to minimize
    await expect(await utils.doesElementExist('span[icon="maximize"]',300)).toBe(true)
  }
  else{//The Log screen was maximized
    await clickOn('#botpress-tooltip-4-trigger') //Click on the button to maximize it
    await expect(await utils.doesElementExist('span[icon="minimize"]',300)).toBe(true)
  }
})


it('Verify there is a [X] button on the bar above the bottom panel', async () => {
  const isVisible=await  utils.isElementVisible('#botpress-tooltip-5-trigger') //function in utils.ts
  await expect(isVisible).toBe(true)
})


it('Update the profile', async () => {  
  await clickOn('#btn-menu')
  await clickOn('#btn-profile')
  await fillField('#input-firstname', "Bot")
  await fillField('#input-lastname', "Press")
  await clickOn('#btn-submit')
  await clickOn('#btn-menu') //click on the menu again to make the text 'Signed in as...' appear
  const elements = await  page.$x("//h6[contains(text(),'Signed in as Bot Press')]")

  await expect(elements.length).toBeGreaterThan(0)
  })


it('Change the password', async () => {  
 
  await clickOn('#btn-changepass')
  await fillField('#input-password', bpConfig.password)
  await fillField('#input-newPassword', '654321')
  await fillField('#input-confirmPassword', '654321')
  await clickOn('#btn-submit')
  await page.waitForTimeout(500); 
  await clickOn('#btn-menu')  //log out 
  await clickOn('#btn-logout')
  await page.waitForTimeout(500); 
  await fillField('#email', bpConfig.email) //log in again
  await fillField('#password', '654321') //this time using the new password
  await clickOn('#btn-signin')
  await page.waitForNavigation()
  await page.waitForTimeout(500); 
  await expect(page.url()).toMatch(`${bpConfig.host}/admin`) 
  })


    it('Change the language to French (from English)', async () => {
      await clickOn('#btn-menu')
      await clickOn('#btn-changeLanguage')
      const elements = await  page.$$('span[icon="double-caret-vertical"]')  
      await elements[1].click();//There are two of these elements, clicking opens the drop down
      const langOptions = await  page.$$('div[class="bp3-text-overflow-ellipsis bp3-fill"]')
      await langOptions[1].click() //0- English; 1-  Français; 2- Espanol
      await clickOn('#btn-submit')

      await page.goBack();//otherwise it thows an "Execution context was destroyed..." error, go figure...
      const detectLanguage = await  page.$x("//span[contains(text(),'Créer un bot')]")
    
      await expect(detectLanguage.length).toBeGreaterThan(0)
    })


    it('Change the language to Spanish (from French)', async () => {
      await clickOn('#btn-menu')
      await clickOn('#btn-changeLanguage')
      const elements = await  page.$$('span[icon="double-caret-vertical"]')  
      await elements[1].click();//There are two of these elements, clicking opens the drop down
      const langOptions = await  page.$$('div[class="bp3-text-overflow-ellipsis bp3-fill"]')
      await langOptions[2].click() //0- English; 1-  Français; 2- Espanol
      await clickOn('#btn-submit')

      await page.goBack();//otherwise it thows an "Execution context was destroyed..." error, go figure...
      const detectLanguage = await  page.$x("//span[contains(text(),'Create Bot')]")
      await expect(detectLanguage.length).toBeGreaterThan(0)
    })
    

    it('Change back the password, so other tests can work', async () => {  
      await clickOn('#btn-menu')
      await clickOn('#btn-changepass')
      await fillField('#input-password', '654321')
      await fillField('#input-newPassword', bpConfig.password)
      await fillField('#input-confirmPassword', bpConfig.password)
      await clickOn('#btn-submit')
      await page.waitForTimeout(500); 
      await clickOn('#btn-menu')  //log out 
      await clickOn('#btn-logout')
      await page.waitForTimeout(500); 
      await fillField('#email', bpConfig.email) //log in again
      await fillField('#password', bpConfig.password) //this time using the original password
      await clickOn('#btn-signin')
      await page.waitForNavigation()
      await page.waitForTimeout(500); 
      await expect(page.url()).toMatch(`${bpConfig.host}/admin`) 
      })
    

    it('Log out', async () => {  
      await clickOn('#btn-menu')
      await clickOn('#btn-logout')
      await page.waitForTimeout(500); 
      await expect(page.url()).toMatch(`${bpConfig.host}/admin/login/default`)
    })
  

    it('Log again', async () => {
      await fillField('#email', bpConfig.email)
      await fillField('#password', bpConfig.password)
        await clickOn('#btn-signin')
  
        await page.waitForNavigation()
        await page.waitForTimeout(500); 
        await expect(page.url()).toMatch(`${bpConfig.host}/admin`) 
    })

    it('Change the language to English (from Spanish)', async () => {
      await clickOn('#btn-menu')
      await clickOn('#btn-changeLanguage')
      const elements = await  page.$$('span[icon="double-caret-vertical"]')  
      await elements[1].click();//There are two of these elements, clicking opens the drop down
      const langOptions = await  page.$$('div[class="bp3-text-overflow-ellipsis bp3-fill"]')
      await langOptions[0].click() //0- English; 1-  Français; 2- Espanol
      await clickOn('#btn-submit')

      await page.goBack();//otherwise it thows an "Execution context was destroyed..." error, go figure...
      const detectLanguage = await  page.$x("//span[contains(text(),'Create Bot')]")
      await expect(detectLanguage.length).toBeGreaterThan(0)
    })


})

