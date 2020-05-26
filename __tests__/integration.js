import 'expect-puppeteer'

jest.setTimeout(30000)

// describe('MemeMeUp', () => {
//   beforeAll(async () => {
//     await page.goto('http://localhost:3000/login')
//     await page.screenshot({path: './__tests__/screenshots/login.png'});
//   })

//   it('should display "Meme" text on page', async () => {
//     await expect(page).toMatch('Enter')
//   })
// })

const { Cluster } = require('puppeteer-cluster');

const TEST_URL = 'http://localhost:3000/login'

describe('gameplay', () => {

  async function loginScreen() {
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 2,
    })

    cluster.task(async ({page, data:{url, count}}) => {
      await page.goto(url)
      await page.screenshot({path: './__tests__/screenshots/login' + count + '.png'});
      await expect(page).toMatch('Enter')
      testNum += 1
    })

    cluster.queue({url: TEST_URL, count: 1})
    cluster.queue({url: TEST_URL, count: 2})

    await cluster.idle();
    await cluster.close();

  }

  it("should have the ENTER login form", async() => {
    expect.assertions(2)
    await loginScreen()
  })

  it("generates room code on HOST GAME", async() => {
    expect.assertions(1)

    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 2,
    })

    cluster.on('taskerror', (err) => {
      throw err;
    });

    cluster.task(async({page, data: url}) => {
      await page.goto(url)

      await page.waitFor(2000)
      await page.waitForSelector('#login-name-input', {timeout: 60000})

      await page.waitForSelector('#hostGame')
      await page.type('#login-name-input', 'host')
      await page.click('#hostGame')
      await page.waitForNavigation()
      await page.screenshot({path: './__tests__/screenshots/lobby.png'});
      await expect(page).toMatch('Lobby')
      await page.on('console')

    })

    cluster.queue(TEST_URL)

    await cluster.idle();
    await cluster.close();

  })

  



})