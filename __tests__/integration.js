import 'expect-puppeteer'

jest.setTimeout(600000)



const { Cluster } = require('puppeteer-cluster');

const TEST_URL = 'http://localhost:3000/login'

describe('gameplay', () => {

  let endRound = 0
  let judges = 0
  let room =' ';

  it("Creates a four player Lobby", async() => {
    // expect.assertions(21)

    

    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 4,
      timeout: 600000,
      puppeteerOptions: {
        headless: true,
        timeout: 600000
      }
    })

    cluster.on('taskerror', (err) => {
          throw err;
        });

  cluster.task(async({page, data: {url, name}}) => {
    await page.goto(url)
    console.log("Testing Login")
    if(name == 'host'){
      await page.waitFor(2000)
      await page.waitForSelector('#login-name-input', {timeout: 60000})
      await page.waitForSelector('#hostGame')
      await page.type('#login-name-input', 'host')
      await page.click('#hostGame')
      await page.waitForNavigation()
      await page.screenshot({path: './__tests__/screenshots/lobby.png'});
      await expect(page).toMatch('Lobby')
      room = await page.$eval('#roomCode', el => el.textContent);
      room = room.substr(6)
      console.log("ROOM: ", room)
      await page.waitFor(5000)
      await page.click('#startGame')
    }
    else{
      await page.waitFor(5000)
      await page.waitForSelector('#login-name-input', {timeout: 60000})
      await page.waitForSelector('#join')
      await page.type('#login-name-input', name)
      await page.click('#join')
      await page.waitForSelector('#room-code-input')
      await page.type('#room-code-input', room)
      await page.click('#enter')
      await page.waitForNavigation()
      await page.screenshot({path: './__tests__/screenshots/'+ name +'lobby.png'});
      await expect(page).toMatch(name)
      await expect(page).toMatch("is the host")
      await page.waitFor(4000)
    }

    console.log("Testing Round1")
    let turn = 0
    while(turn < 4){
      let judge = ''
      try{
        await page.$eval('#selectButton', el => el.textContent);
        judges +=1
        judge = true
        console.log("Turn", turn)
      }
      catch(err){
        judge =false
        }
      if(judge){
        await expect(page).toMatch('Upload')
        let uploadArea = await page.$("#uploadButton")
        await uploadArea.uploadFile('./images/home_page.png')
        await page.click('#selectButton')
        await page.waitFor(1000)
        await page.screenshot({path: './__tests__/screenshots/round1/caption/'+ name +'_judge1.png'});
        await expect(page).toMatch("Players Submitting Captions")
        await page.waitFor(5000)
        await page.screenshot({path: './__tests__/screenshots/round1/vote/'+ name +'_judge1.png'});
        await expect(page).toMatch("Vote")
      }
      else{
        await page.waitFor(4000)
        await page.screenshot({path: './__tests__/screenshots/round1/caption/'+ name +'_player.png'});
        const img = await page.$eval('#captionImg', el => el.src)
        await expect(img).toContain('https://firebasestorage.googleapis.com')
        await page.type("#caption-input", name)
        await page.click("#submit")
        await page.waitFor(4000)
        await page.screenshot({path: './__tests__/screenshots/round1/vote/'+ name +'_player.png'});
        await expect(page).toMatch("Vote")

      }

      await page.click("#voteButton")
      await page.waitFor(5000)
      await page.screenshot({path: './__tests__/screenshots/round1/score/'+ name +'_player.png'});
      await expect(page).toMatch("Scores")

      console.log(1)
      if(judge){
          await page.waitFor(5000)
          const contin = await page.$eval('#continueButton', el => el.textContent)
          await page.click('#continueButton')
      }else{
        endRound += 1
        await page.waitFor(6000)
      }

      await expect(endRound).toBe(3)
      await page.waitFor(2000)

      turn += 1
      endRound =0
    }
    
    await expect(judges).toBe(4)

  })

  cluster.queue({url: TEST_URL, name: "host"})
  cluster.queue({url: TEST_URL, name: "play1"})
  cluster.queue({url: TEST_URL, name: "play2"})
  cluster.queue({url: TEST_URL, name: "play3"})

  await cluster.idle();
  await cluster.close();


  })



  



})