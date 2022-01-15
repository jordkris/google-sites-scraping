const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const fs = require('fs-extra');
const path = require('path');
const { nanoid } = require('nanoid');
const csv = require('csvtojson');
const readline = require('readline');
const chalk = require('chalk');
const process = require('process');
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
puppeteer.use(StealthPlugin());
puppeteer.use(require('puppeteer-extra-plugin-anonymize-ua')())
puppeteer.use(require('puppeteer-extra-plugin-user-preferences')({
    userPrefs: {
        webkit: {
            webprefs: {
                default_font_size: 16
            }
        }
    }
}));

class SiteCreator {
    constructor(content, profile = 'Default') {
        this.content = content;
        this.executablePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
        this.userDataDir = 'C:/Users/ASUS A407UA/AppData/Local/Google/Chrome/User Data';
        this.templateDir = path.join(__dirname, 'template')
        this.args = [];
        this.defaultTimeOut = 10000;
        this.timer;
        this.pageCounter = 0;
        // this.gmail = '';
        // this.gpass = '';
        this.setProfile(profile);
    }

    setProfile(profile) {
        const sourceDir = path.join(this.userDataDir, profile);
        const projectDir = path.join(__dirname, profile);
        // console.log(!profile);
        // console.log(!fs.existsSync(path.join(sourceDir, 'Google Profile.ico')));
        try {
            // if (!profile || !fs.existsSync(path.join(sourceDir, 'Google Profile.ico')))
            //     throw new Error(`Profile is invalid, for available chrome profile!`);
            // if (!fs.existsSync(projectDir)) fs.copySync(this.templateDir, projectDir);
            // else fs.unlinkSync(path.join(projectDir, 'Default'));
            // fs.ensureSymlinkSync(sourceDir, path.join(projectDir, 'Default'), 'junction');
            this.profile = profile;
        } catch (e) {
            console.log(e);
        }
    }

    getChromeProfiles() {
        const profileDirs = fs.readdirSync(this.userDataDir);
        const profiles = profileDirs.filter(dir => fs.existsSync(path.join(this.userDataDir, dir, 'Google Profile.ico')));
        return profiles;
    }

    async boldFont() {
        await this.page.keyboard.down('Control');
        await this.page.keyboard.press('B');
        await this.page.keyboard.up('Control');
    }

    async underlineFont() {
        await this.page.keyboard.down('Control');
        await this.page.keyboard.press('U');
        await this.page.keyboard.up('Control');
    }

    async italicFont() {
        await this.page.keyboard.down('Control');
        await this.page.keyboard.press('I');
        await this.page.keyboard.up('Control');
    }

    async alignCenter() {
        await this.page.keyboard.down('Control');
        await this.page.keyboard.down('Shift');
        await this.page.keyboard.press('E');
        await this.page.keyboard.up('Shift');
        await this.page.keyboard.up('Control');
    }

    async header(text) {
        //membuat judul
        this.timer = this.consoleTimer('Creating title ..');
        await this.page.waitForSelector('#yDmH0d > div.MUd2qe.gJ9tsd > div.y3IDJd.CatYBe.Fx3kmc.fmzcZd > span > div > div > div.bWTzgc > div > div > span > div > div.rZHESd > div > div > article > section > div.LS81yb.TZTnI.IKVHqc.aVXSwc.yaqOZd.LB7kq.gk8rDe > div.zXDYWd.guoAab.mYVXT > group > div.JNdkSc-SmKAyb > div > row > div > div.oKdM2c.guoAab.row_Default > tile > div.jXK9ad-SmKAyb.v7v1sb > div > div.BdNftd', { visible: true }); //ini
        await this.page.click('#yDmH0d > div.MUd2qe.gJ9tsd > div.y3IDJd.CatYBe.Fx3kmc.fmzcZd > span > div > div > div.bWTzgc > div > div > span > div > div.rZHESd > div > div > article > section > div.LS81yb.TZTnI.IKVHqc.aVXSwc.yaqOZd.LB7kq.gk8rDe > div.zXDYWd.guoAab.mYVXT > group > div.JNdkSc-SmKAyb > div > row > div > div.oKdM2c.guoAab.row_Default > tile > div.jXK9ad-SmKAyb.v7v1sb > div > div.BdNftd');
        await this.page.keyboard.down('Control');
        await this.page.keyboard.press('A');
        await this.page.keyboard.up('Control');
        await this.page.keyboard.press('Backspace');
        await this.page.type('div.BdNftd', text);
        this.clearTimer(this.timer);
    }

    async inputSection2(title, author) {
        this.timer = this.consoleTimer('Input section 2 ..');
        await this.page.click('#wWGgfe > div > div.GxjTuf > div:nth-child(1) > div > span > span > span')
        await this.page.waitForTimeout(500)
        await this.boldFont()
        await this.page.keyboard.type('Read ')
        await this.boldFont()
        await this.page.keyboard.type('and ')
        await this.italicFont()
        await this.page.keyboard.type('download ')
        await this.italicFont()
        await this.boldFont()
        await this.page.keyboard.type(title)
        await this.boldFont()
        await this.page.keyboard.type(' in PDF, EPub, Mobi, Kindle online. Free book ')
        await this.italicFont()
        await this.page.keyboard.type('Behind Your Smiles: Eternity Publishing by ' + author)
        await this.italicFont()
        await this.alignCenter()
        await this.page.keyboard.press('Enter')
        await this.boldFont()
        await this.page.keyboard.type(title + ' PDF')
        await this.boldFont()
        await this.page.keyboard.press('Enter')
        await this.page.keyboard.type('By - ' + author)
        this.clearTimer(this.timer);
    }

    async insertImg(link) {
        // image
        this.timer = this.consoleTimer('Inserting image ..');
        await this.page.waitForSelector('.d6wWde', { visible: true })
        await this.page.waitForTimeout(500)
        await this.page.click('.d6wWde')
        await this.page.waitForTimeout(500)
        await this.page.waitForSelector('span.Ix4kpb:nth-child(2) > div:nth-child(2) > div:nth-child(1)', { visible: true })
        await this.page.click('span.Ix4kpb:nth-child(2) > div:nth-child(2) > div:nth-child(1)')

        await this.page.waitForSelector('.OGNeob > iframe', { visible: true })
        const elementHandle = await this.page.$('.OGNeob > iframe');
        const frame = await elementHandle.contentFrame()
        await frame.waitForSelector('div.ThdJC:nth-child(2) > span:nth-child(2)', { visible: true })
        await frame.click('div.ThdJC:nth-child(2) > span:nth-child(2)')
        await frame.waitForSelector('.whsOnd', { visible: true })
        await frame.evaluate((val) => {
            document.querySelector("input[type='text']").value = val
        }, link);
        await frame.type('.whsOnd', String.fromCharCode(13));
        await frame.waitForTimeout(2500);

        await frame.waitForSelector('#yDmH0d > div.Q6HCU.IzuY1c.tJJJGe > div.H0U9m > div.WY4Fyb > div > div > div > div > div.hSF15e > div:nth-child(2)', { visible: true })
        await frame.click('div.U26fgb:nth-child(2) > span:nth-child(3) > span:nth-child(1)')
        await this.page.waitForTimeout(1000)

        for (let j = 0; j < 4; j++) {
            await this.page.waitForTimeout(100)
            await this.page.keyboard.press("ArrowRight")
        }
        await this.page.waitForTimeout(500)
        this.clearTimer(this.timer);
    }

    async clickButtonWhenEnabled(selector) {
        await this.page.evaluate((sel) => {
            return new Promise((resolve, reject) => {
                let retry = 8;
                let id = setInterval(() => {
                    let el = document.querySelector(sel);
                    if (el != null && el.ariaDisabled == null) {
                        el.click();
                        clearInterval(id);
                        return resolve(true);
                    } else {
                        retry--;
                    }

                    if (retry <= 0) {
                        clearInterval(id);
                        return reject('Gagal klik tombol');
                    }
                }, 2500);
            });
        }, selector);

        await this.page.waitForTimeout(2500);
    }

    async headingLink(text) {
        this.timer = this.consoleTimer('Input heading link ..');
        await this.page.waitForTimeout(500)
        await this.page.waitForSelector('.zgFouf > svg:nth-child(1) > path:nth-child(1)', { visible: true })
        await this.page.click('.zgFouf > svg:nth-child(1) > path:nth-child(1)')
        await this.page.waitForTimeout(500);
        await this.page.keyboard.type(text)
        await this.page.keyboard.down('Control');
        await this.page.keyboard.press('A');
        await this.page.keyboard.up('Control');
        await this.page.waitForTimeout(300);
        await this.page.waitForSelector('.vuEmub', { visible: true })
        await this.page.click('.vuEmub')
        await this.page.waitForTimeout(500);
        await this.page.waitForSelector('.nK92pf > div:nth-child(2) > div:nth-child(3)', { visible: true })
        await this.page.click('.nK92pf > div:nth-child(2) > div:nth-child(3)')
        await this.page.waitForSelector('div.W9wDc:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', { visible: true })
        await this.page.click('div.W9wDc:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)')
        await this.page.waitForTimeout(500)
        await this.page.type('div.W9wDc:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', '18', { delay: 10 })
        await this.page.waitForTimeout(500)
        this.clearTimer(this.timer);
    }

    async downloadButton(text, link) {
        this.timer = this.consoleTimer('Create download btn..');
        await this.page.waitForTimeout(500)
        await this.page.click('.zgFouf > svg:nth-child(1) > path:nth-child(1)')
        await this.page.waitForTimeout(500)
        await this.underlineFont()
        await this.page.waitForTimeout(200)
        await this.boldFont()
        await this.page.waitForTimeout(200)
        await this.page.keyboard.sendCharacter('⇒')
        await this.page.waitForTimeout(200)
        await this.page.keyboard.type(' ' + text + ' ')
        await this.page.waitForTimeout(200)
        await this.page.keyboard.sendCharacter('⇐')
        await this.page.waitForTimeout(200)
        await this.underlineFont()
        await this.page.waitForTimeout(200)
        await this.boldFont()
        await this.page.waitForTimeout(200)
        await this.alignCenter()
        await this.page.waitForTimeout(200)
        await this.page.keyboard.down('Control');
        await this.page.keyboard.press('A');
        await this.page.keyboard.up('Control');
        await this.page.waitForTimeout(300);
        await this.page.waitForSelector('div.W9wDc:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', { visible: true })
        await this.page.click('div.W9wDc:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)')
        await this.page.waitForTimeout(500)
        await this.page.type('div.W9wDc:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', '18', { delay: 200 })
        await this.page.waitForTimeout(200)
        await this.page.waitForSelector('.bFhy9b > div:nth-child(12) > div:nth-child(1) > span:nth-child(2) > span:nth-child(1) > span:nth-child(1)', { visible: true })
        await this.page.click('.bFhy9b > div:nth-child(12) > div:nth-child(1) > span:nth-child(2) > span:nth-child(1) > span:nth-child(1)')
        await this.page.waitForTimeout(200)
        await this.page.keyboard.type(link)
        await this.page.waitForTimeout(200)
        await this.page.click('.Sd2wDb > div:nth-child(1) > span:nth-child(3)')
        await this.page.waitForTimeout(200)
        this.clearTimer(this.timer);
    }

    async initBrowser() {
        console.log(`Open browser with '${this.profile}' profile..`);
        this.browser = await puppeteer.launch({
            executablePath: this.executablePath,
            headless: false,
            defaultViewport: null,
            userDataDir: this.userDataDir,
            args: [
                '--start-maximized', // you can also use '--start-fullscreen'
                // `--user-data-dir=${this.userDataDir}`,
                `-profile-directory=${this.profile}`
            ]
        });
    }

    async readLine() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return new Promise(resolve => {

            rl.question('"menunggu setting halaman muka selesai (pause)" ketik y dan tekan enter untuk melanjutkan !!!!', (answer) => {
                rl.close();
                resolve(answer)
            });
        })
    }

    consoleTimer(message, timeout = this.defaultTimeOut) {
        let diff = 1;
        let initTime = new Date().getTime();
        let realTime;
        let id = setInterval(() => {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                realTime = (new Date().getTime() - initTime) / 1000;
                process.stdout.write(message + ',\t' + chalk.yellow(`Elapsed time : ${realTime}s`));
            },
            diff);
        return id;
    }

    clearTimer(timer) {
        clearInterval(timer);
        process.stdout.write('\n');
    }

    async googleLogin() {
        // const browser = await puppeteer.launch({ headless: false })
        // const page = await browser.newPage()

        // const navigationPromise = page.waitForNavigation()

        // await page.goto('https://accounts.google.com/')

        await this.page.waitForSelector('input[type="email"]')
        await this.page.click('input[type="email"]')
        await this.page.type('input[type="email"]', this.gmail)
        await this.page.waitForSelector('#identifierNext')
        await this.page.click('#identifierNext')
        await this.page.waitForTimeout(1500);
        await this.page.waitForSelector('input[type="password"]');
        // await this.page.waitForTimeout(1000);
        await this.page.click('input[type="password"]')
        await this.page.type('input[type="password"]', this.gpass)
        await this.page.waitForSelector('#passwordNext')
        await this.page.click('#passwordNext')
        console.log('success login');
        // await navigationPromise

        //await browser.close()
    }

    async createNewTheme() {
        await this.page.waitForSelector('div.docs-homescreen-templates-templateview-preview.docs-homescreen-templates-templateview-preview-showcase > img');
        await this.page.click('div.docs-homescreen-templates-templateview-preview.docs-homescreen-templates-templateview-preview-showcase > img');

        await this.page.waitForTimeout(500) // tunggu 15 detik, gak diklik anggap error tanpa retry
        await this.page.waitForSelector('#yDmH0d > div.MUd2qe.gJ9tsd > div.y3IDJd.CatYBe.Fx3kmc.fmzcZd > span > div > div > div.bWTzgc > div > div > span > div > div.rZHESd > div > div > article > section', { visible: true })
        await this.page.waitForSelector('.Av8pHf');
        const test = await this.page.$eval('.Av8pHf', el => {
            el.setAttribute('class', 'Av8pHf siiXfe LeqrYe')
            el.setAttribute('aria-hidden', 'false')
        });

        await this.page.waitForSelector('#yDmH0d > div.MUd2qe.gJ9tsd > div.y3IDJd.CatYBe.Fx3kmc.fmzcZd > span > div > div > div.bWTzgc > div > div > span > div > div.rZHESd > div > div > article > section > div.LS81yb.TZTnI.IKVHqc.aVXSwc.yaqOZd.LB7kq.O13XJf.nyKByd > div:nth-child(3) > div.Av8pHf.siiXfe > div.U26fgb.O0WRkf.oG5Srb.C0oVfc.YYHIke.i65P1d.Keh7oc.null.M9Bg4d');
        await this.page.evaluate(() => {
            let el = document.querySelector('#yDmH0d > div.MUd2qe.gJ9tsd > div.y3IDJd.CatYBe.Fx3kmc.fmzcZd > span > div > div > div.bWTzgc > div > div > span > div > div.rZHESd > div > div > article > section > div.LS81yb.TZTnI.IKVHqc.aVXSwc.yaqOZd.LB7kq.O13XJf.nyKByd > div:nth-child(3) > div.Av8pHf.siiXfe > div.U26fgb.O0WRkf.oG5Srb.C0oVfc.YYHIke.i65P1d.Keh7oc.null.M9Bg4d');
            el.click();
        });
        await this.page.waitForTimeout(1000);

        await this.page.waitForSelector('#yDmH0d > div.MUd2qe.gJ9tsd > div.y3IDJd.CatYBe.Fx3kmc.fmzcZd > span > div > div > div.bWTzgc > div > div > span > div > div.rZHESd > div > div > article > section > div.LS81yb.TZTnI.IKVHqc.aVXSwc.yaqOZd.LB7kq.O13XJf.nyKByd > div:nth-child(3) > div:nth-child(3) > div:nth-child(5) > span > span > span.DPvwYc.rvGaTc', { visible: true });
        await this.page.evaluate(() => {
            document.querySelector('#yDmH0d > div.MUd2qe.gJ9tsd > div.y3IDJd.CatYBe.Fx3kmc.fmzcZd > span > div > div > div.bWTzgc > div > div > span > div > div.rZHESd > div > div > article > section > div.LS81yb.TZTnI.IKVHqc.aVXSwc.yaqOZd.LB7kq.O13XJf.nyKByd > div:nth-child(3) > div:nth-child(3) > div:nth-child(5) > span > span > span.DPvwYc.rvGaTc').click();
        });

        //atur format
        // await this.page.waitForTimeout(500);
        // await this.page.waitForSelector('div.ThdJC:nth-child(3)', { visible: true })
        // await this.page.click('div.ThdJC:nth-child(3)')
        // await this.page.waitForTimeout(500);
        // await this.page.mouse.wheel({ deltaY: 1000 })
        // await this.page.waitForTimeout(2000);
        // await this.page.waitForSelector('div.m6xOQ:nth-child(6)', { visible: true })
        // await this.page.click('div.m6xOQ:nth-child(6)');
        // await this.page.waitForTimeout(500)
        // await this.clickButtonWhenEnabled("div[guidedhelpid='at-appbar-publish']");

        // const weblink = `${nanoid(16)}`.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase()
        // console.log(weblink)
        // await this.page.waitForTimeout(200)
        // await this.page.waitForSelector('.rXTzdc > div:nth-child(1) > input:nth-child(1)', { visible: true })
        // await this.page.click('.rXTzdc > div:nth-child(1) > input:nth-child(1)')
        // await this.page.type('.rXTzdc > div:nth-child(1) > input:nth-child(1)', weblink)
        // await this.page.waitForSelector('.yfzDSb > svg:nth-child(1)', { visible: true })
        // await this.page.waitForSelector('.OE6hId > div:nth-child(2)', { visible: true })
        // await this.page.click('.OE6hId > div:nth-child(2)')

        // await this.page.waitForTimeout(2000)
        // await this.page.waitForSelector('div.ThdJC:nth-child(1) > span:nth-child(2) > div:nth-child(1)', { visible: true })
        // await this.page.click('div.ThdJC:nth-child(1) > span:nth-child(2) > div:nth-child(1)')
        // await this.page.waitForTimeout(200)
    }

    async openCurrentTheme(header = '') {
        await this.page.waitForSelector('div.docs-homescreen-grid-item:nth-child(1)');
        await this.page.click('div.docs-homescreen-grid-item:nth-child(1)');
        await this.page.waitForTimeout(200);
        //click tab
        await this.page.waitForSelector('div.ThdJC:nth-child(2) > span:nth-child(2) > div:nth-child(1)', { visible: true })
        await this.page.click('div.ThdJC:nth-child(2) > span:nth-child(2) > div:nth-child(1)')
        await this.page.waitForTimeout(200);
        // click last page
        await this.page.waitForSelector('.Duxokd:nth-last-child(1)', { visible: true })
        await this.page.click('.Duxokd:nth-last-child(1)');
        if (header != '') {
            await this.deleteCurrentPage(header);
        }
    }

    async deleteCurrentPage(header1) {
        // pilih tab halaman
        await this.page.waitForSelector('div.ThdJC:nth-child(2) > span:nth-child(2) > div:nth-child(1)', { visible: true })
        await this.page.click('div.ThdJC:nth-child(2) > span:nth-child(2) > div:nth-child(1)')
        await this.page.waitForTimeout(200);
        await this.page.waitForFunction((header) => {
            // document.querySelector(`div.Duxokd > div:nth-child(2) > div:nth-child(1)[aria-label="${header}."]`).click();
            console.log(`click div.Duxokd > div:nth-child(2) > div:nth-child(1)[aria-label="${header.substring(0,75)}."] > div:nth-child(3)`)
            document.querySelector(`div.Duxokd > div:nth-child(2) > div:nth-child(1)[aria-label="${header.substring(0,75)}."] > div:nth-child(3)`).click();
            return true;
        }, {}, header1);
        // klik option page
        // await this.page.waitForSelector(`.Duxokd:nth-last-child(${currentPageIndex}) > .RzVr4e.oJeWuf > .DNVrtd.Zvzobf > .U26fgb.JRtysb.WzwrXb.BvWn8e`, { visible: true })
        // await this.page.click(`.Duxokd:nth-last-child(${currentPageIndex}) > .RzVr4e.oJeWuf > .DNVrtd.Zvzobf > .U26fgb.JRtysb.WzwrXb.BvWn8e`)
        // await this.page.waitForTimeout(500);
        // klik hapus
        await this.page.waitForTimeout(2000);
        await this.page.waitForSelector('div.qjTEB > div > div > span:nth-last-child(1)', { visible: true })
        await this.page.click('div.qjTEB > div > div > span:nth-last-child(1)');
        await this.page.waitForTimeout(500);
    }

    async initPage() {
        if (this.page) {
            try {
                await this.page.close();
            } catch (error) {
                console.log('Page is not initiated ..');
            }
        }
        this.page = await this.browser.newPage();
        await this.page.goto('https://sites.google.com');
        //set global timeout
        await this.page.setDefaultTimeout(this.defaultTimeOut);
        // const current_url = this.page._target._targetInfo.url;
        // if (!(current_url == 'https://sites.google.com/new')) {
        //     if (current_url.includes('https://accounts.google.com/ServiceLogin/signinchooser')) {
        //         await this.page.waitForSelector('ul.OVnw0d li:nth-last-child(2)', { visible: true })
        //         await this.page.click('ul.OVnw0d li:nth-last-child(2)')
        //     }
        //     await this.googleLogin();
        // }
        await this.createNewTheme();
        return true;
    }

    async publishSite() {
        //click publish bagian ini rubah auto nya
        let retry = 0,
            maxRetry = 10;
        while (retry < maxRetry) {
            try {
                this.timer = this.consoleTimer(`publish... (percobaan ke ${retry+1})`);
                await this.page.waitForTimeout(500)
                await this.page.waitForSelector('div.QelWNb.F8Wqud > div:nth-child(1)', { visible: true });
                await this.page.click('div.QelWNb.F8Wqud > div:nth-child(1)');
                await this.page.waitForSelector('div.jzUkrb > div:nth-child(2)', { visible: true });
                await this.page.click('div.jzUkrb > div:nth-child(2)');
                this.clearTimer(this.timer);
                console.log(chalk.green('Situs ini berhasil dipublish'));
                await this.page.waitForSelector('div.jFptUc > div:nth-child(1)', { visible: true });
                await this.page.click('div.jFptUc > div:nth-child(1)');
                break;
            } catch (e) {
                this.clearTimer(this.timer);
                console.log(chalk.red('Gagal publish, error dengan pesan : ', (e.message || e)));
                await this.page.reload();
                retry++;
            }
            if (retry == 10) {
                console.log(chalk.red(`Gagal publish 5x, proses publish dibatalkan`));
            }
        }
    }

    async createNewSite(item, isNewPage) {
        // let {
        //     header: header1,
        //     title,
        //     author,
        //     pages,
        //     publisher,
        //     language,
        //     description,
        //     tags,
        //     'ISBN-10': isbn_10,
        //     'ISBN-13': isbn_13,
        //     'Front Cover': linkimg,
        //     'read online link': linkDownBt,
        //     'read online text': textDownBt,
        //     'read online img': imgDownBt,
        // } = item;
        // var itemArr = item.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        let
            header1 = item['header'],
            title = item['title'],
            author = item['author'],
            pages = item['pages'],
            publisher = item['publisher'],
            language = item['language'],
            description = item['description'],
            tags = item['tags'],
            isbn_10 = item['ISBN-10'],
            isbn_13 = item['ISBN-13'],
            linkimg = item['Front Cover'],
            linkDownBt = item['read online link'],
            textDownBt = item['read online text'],
            imgDownBt = item['read online img'];
        let header2 = header1.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s\s+/g, ' ');
        isbn_13 = isbn_13.replace(/[^a-zA-Z0-9 ]/g, "");
        // await this.page.waitForSelector('input.poFWNe');
        // await this.page.click('input.poFWNe');
        // await this.page.type('input.poFWNe', title);
        if (isNewPage) {
            await this.page.waitForTimeout(200)
            await this.page.waitForSelector('div.ThdJC:nth-child(2) > span:nth-child(2) > div:nth-child(1)', { visible: true })
            await this.page.click('div.ThdJC:nth-child(2) > span:nth-child(2) > div:nth-child(1)')
            await this.page.waitForTimeout(200)
            await this.page.waitForSelector('.xmAgjb > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', { visible: true })
            await this.page.hover('.xmAgjb > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)')
            await this.page.waitForTimeout(200)
            await this.page.waitForSelector('.Duxokd:nth-last-child(1)', { visible: true })
            await this.page.click('.Duxokd:nth-last-child(1)');
            // options page
            // await this.page.waitForSelector('div.JRtysb:nth-child(3) > span:nth-child(2) > span:nth-child(1) > svg:nth-child(1)', { visible: true })
            // await this.page.click('div.JRtysb:nth-child(3) > span:nth-child(2) > span:nth-child(1) > svg:nth-child(1)')
            // await this.page.waitForTimeout(500)
            // menu after click
            // await this.page.waitForSelector('span.tHuOYd:nth-child(2) > div:nth-child(2) > div:nth-child(1)', { visible: true })
            // await this.page.click('span.tHuOYd:nth-child(2) > div:nth-child(2) > div:nth-child(1)')
            await this.page.waitForTimeout(200)
            await this.page.waitForSelector('span.Ip8zfc > span:nth-child(1)', { visible: true })
            await this.page.hover('span.Ip8zfc > span:nth-child(1)')
            await this.page.waitForTimeout(200)
            await this.page.waitForSelector('.es0ex', { visible: true })
            await this.page.click('.es0ex')

            await this.page.waitForTimeout(200)
            await this.page.waitForSelector('.WnONLb > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', { visible: true })
            await this.page.click('.WnONLb > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)')
            await this.page.waitForTimeout(200)
            await this.page.waitForSelector('.WnONLb > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', { visible: true })
            await this.page.keyboard.down('Control');
            await this.page.keyboard.press('A');
            await this.page.keyboard.up('Control');
            await this.page.keyboard.press('Backspace');

            await this.page.type('.WnONLb > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', header1)
            await this.page.waitForTimeout(200)
            await this.page.waitForSelector('div.HQ8yf:nth-child(1)', { visible: true })
            await this.page.click('div.HQ8yf:nth-child(1)')
            await this.page.waitForTimeout(200)
            await this.page.$eval('.RRvhed > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', (el) => {
                el.setAttribute('maxlength', '1000')
            })
            await this.page.waitForSelector('.RRvhed > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', { visible: true })
            await this.page.type('.RRvhed > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', header2)
            await this.page.waitForTimeout(200)
            await this.page.waitForSelector('div.HQ8yf:nth-child(2)', { visible: true })
            await this.page.click('div.HQ8yf:nth-child(2)')
            await this.page.waitForTimeout(200)
            await this.page.waitForSelector('div.ThdJC:nth-child(1) > span:nth-child(2) > div:nth-child(1)', { visible: true })
            await this.page.click('div.ThdJC:nth-child(1) > span:nth-child(2) > div:nth-child(1)')
            await this.page.waitForTimeout(200)
        } else {
            //jika bukan homepage 
            await this.page.waitForTimeout(2500)
            await this.page.waitForSelector('div.ThdJC:nth-child(2) > span:nth-child(2) > div:nth-child(1)', { visible: true })
            await this.page.evaluate(() => {
                document.querySelector('div.ThdJC:nth-child(2) > span:nth-child(2) > div:nth-child(1)').click()
            })
            await this.page.waitForSelector('.Duxokd:nth-last-child(1)', { visible: true })
            await this.page.click('.Duxokd:nth-last-child(1)');
            await this.page.waitForTimeout(200)
            await this.page.waitForSelector('span.Ip8zfc > span:nth-child(1)', { visible: true })
            await this.page.hover('span.Ip8zfc > span:nth-child(1)')
            await this.page.waitForTimeout(200)
            await this.page.waitForSelector('.es0ex', { visible: true })
            await this.page.click('.es0ex')

            await this.page.waitForTimeout(200)

            await this.page.waitForSelector('.WnONLb > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', { visible: true })
            await this.page.click('.WnONLb > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)')
            await this.page.waitForTimeout(200)
            await this.page.waitForSelector('.WnONLb > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', { visible: true })
            await this.page.type('.WnONLb > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', header1)
            await this.page.waitForTimeout(200)
            await this.page.waitForSelector('div.HQ8yf:nth-child(1)', { visible: true })
            await this.page.click('div.HQ8yf:nth-child(1)')
            await this.page.waitForTimeout(200)
            await this.page.$eval('.RRvhed > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', (el) => {
                el.setAttribute('maxlength', '1000')
            })
            await this.page.waitForSelector('.RRvhed > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', { visible: true })
            await this.page.type('.RRvhed > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', header2)
            await this.page.waitForTimeout(200)

            await this.page.waitForSelector('div.HQ8yf:nth-child(2)', { visible: true })
            await this.page.click('div.HQ8yf:nth-child(2)')
            await this.page.waitForTimeout(800)
        }
        //back to insert submenu
        await this.page.waitForSelector('#yDmH0d > div.MUd2qe.gJ9tsd > div.vW7mGd.XM6wle.mkDbPd.M3Aaxc.NVNv2d.Y3eu4c > span > div > div.BFsh9 > div.mrslJ.ZjAUM.q21cab.H3UEIb > div:nth-child(1) > span > div', { visible: true })
        await this.page.click('#yDmH0d > div.MUd2qe.gJ9tsd > div.vW7mGd.XM6wle.mkDbPd.M3Aaxc.NVNv2d.Y3eu4c > span > div > div.BFsh9 > div.mrslJ.ZjAUM.q21cab.H3UEIb > div:nth-child(1) > span > div')
        await this.page.waitForTimeout(200)

        await this.header(header1);
        await this.inputSection2(title, author);
        await this.insertImg(linkimg);
        await this.page.waitForTimeout(200)

        //section3
        this.timer = this.consoleTimer('Input section ..');
        await this.page.mouse.wheel({ deltaY: 300 })
        await this.page.waitForTimeout(500)
        await this.page.mouse.wheel({ deltaY: 200 })
        await this.page.click('.zgFouf > svg:nth-child(1) > path:nth-child(1)')
        await this.page.waitForTimeout(500)
        await this.page.keyboard.type('√')
        await this.page.waitForTimeout(200)
        await this.page.keyboard.type('PDF | ')
        await this.page.waitForTimeout(200)
        await this.page.keyboard.sendCharacter('√')
        await this.page.waitForTimeout(200)
        await this.page.keyboard.type('KINDLE | ')
        await this.page.waitForTimeout(200)
        await this.page.keyboard.sendCharacter('√')
        await this.page.waitForTimeout(200)
        await this.page.keyboard.type('EPUB')
        await this.alignCenter()
        await this.page.click('.zgFouf > svg:nth-child(1) > path:nth-child(1)')
        await this.page.waitForTimeout(500)
        await this.boldFont()
        await this.page.waitForTimeout(100)
        await this.page.keyboard.type('⇓⇓⇓')
        await this.page.waitForTimeout(100)
        await this.boldFont()
        await this.page.waitForTimeout(100)
        await this.alignCenter()
        this.clearTimer(this.timer);
        //download button upper
        await this.downloadButton(textDownBt, linkDownBt)
        await this.headingLink('BOOK DETAILS:')
        await this.page.keyboard.down('Control');
        await this.page.keyboard.press('A');
        await this.page.keyboard.up('Control');
        //Book details    
        this.timer = this.consoleTimer('Input book details ..');
        await this.page.waitForSelector('.cQgVbe > div:nth-child(2) > div:nth-child(1) > div:nth-child(4)', { visible: true })
        await this.page.waitForTimeout(500)
        await this.page.waitForSelector('.zgFouf > svg:nth-child(1) > path:nth-child(1)', { visible: true })
        await this.page.click('.zgFouf > svg:nth-child(1) > path:nth-child(1)')
        await this.page.waitForTimeout(500);
        await this.page.keyboard.type('Title : ')
        await this.boldFont()
        await this.page.keyboard.type(title)
        await this.boldFont()
        await this.page.keyboard.press('Enter')

        await this.page.keyboard.sendCharacter('Author : ')
        await this.page.keyboard.sendCharacter(author)
        await this.page.waitForTimeout(200);
        await this.page.keyboard.press('Enter')

        await this.page.keyboard.sendCharacter('Release : ')
        await this.page.keyboard.sendCharacter(pages)
        await this.page.waitForTimeout(200);
        //await page.keyboard.type(' pages')
        await this.page.keyboard.press('Enter')

        await this.page.keyboard.sendCharacter('Language : ')
        await this.page.keyboard.sendCharacter(publisher)
        await this.page.waitForTimeout(200);
        await this.page.keyboard.press('Enter')
        await this.page.mouse.wheel({ deltaY: 200 })
        await this.page.keyboard.sendCharacter('Category : ')
        await this.page.keyboard.sendCharacter(language)
        await this.page.waitForTimeout(200);
        await this.page.keyboard.press('Enter')
        await this.page.keyboard.type('ISBN : ')
        await this.page.keyboard.type(isbn_10)
        await this.page.keyboard.press('Enter')
        await this.page.mouse.wheel({ deltaY: 300 })
            //await page.keyboard.type('ISBN-13 : ')
            //await page.keyboard.type(isbn_13)
            //await page.keyboard.press('Enter')
        await this.page.mouse.wheel({ deltaY: 400 })
        await this.page.waitForTimeout(200);
        await this.page.keyboard.down('Control');
        await this.page.waitForTimeout(300);
        await this.page.mouse.wheel({ deltaY: 300 })
        await this.page.click('.zgFouf > svg:nth-child(1) > path:nth-child(1)')
        await this.page.waitForTimeout(200)
        await this.boldFont()
        await this.page.waitForTimeout(100)
        await this.page.keyboard.type('⇓⇓⇓')
        await this.page.waitForTimeout(100)
        await this.boldFont()
        await this.page.waitForTimeout(100)
        await this.alignCenter()
        this.clearTimer(this.timer);

        await this.insertImg(imgDownBt);
        await this.page.waitForTimeout(200)
        await this.page.waitForSelector('.bFhy9b > div:nth-child(3) > div:nth-child(1)', { visible: true })
        await this.page.click('.bFhy9b > div:nth-child(3) > div:nth-child(1)')
        await this.page.waitForTimeout(500)
        await this.page.waitForSelector('.YTWiWc > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', { visible: true })
        await this.page.click('.YTWiWc > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)')
        await this.page.waitForTimeout(200)
        await this.page.keyboard.type(linkDownBt)
        await this.page.waitForTimeout(200)
        await this.page.click('.Sd2wDb > div:nth-child(1)')
        await this.page.waitForTimeout(200)

        //heading link2
        await this.headingLink(title + ' Review by ' + author)

        //keterangan2
        this.timer = this.consoleTimer('Input description ..');
        await this.page.waitForTimeout(200)
        await this.page.waitForSelector('.zgFouf > svg:nth-child(1) > path:nth-child(1)', { visible: true })
        await this.page.click('.zgFouf > svg:nth-child(1) > path:nth-child(1)')
        await this.page.waitForTimeout(200);
        await this.page.keyboard.type(description)
        await this.page.waitForTimeout(200);
        this.clearTimer(this.timer);

        //subheading
        this.timer = this.consoleTimer('Input subheading ..');
        await this.page.waitForTimeout(200);
        await this.page.waitForSelector('.zgFouf > svg:nth-child(1) > path:nth-child(1)', { visible: true })
        await this.page.click('.zgFouf > svg:nth-child(1) > path:nth-child(1)')
        await this.page.waitForTimeout(200);
        await this.page.keyboard.type(title + ' by ' + author)
        await this.page.keyboard.down('Control');
        await this.page.keyboard.press('A');
        await this.page.keyboard.up('Control');
        await this.page.waitForTimeout(300);
        await this.page.waitForSelector('.vuEmub', { visible: true })
        await this.page.click('.vuEmub')
        await this.page.waitForTimeout(200);
        await this.page.waitForSelector('.nK92pf > div:nth-child(2) > div:nth-child(4)', { visible: true })
        await this.page.click('.nK92pf > div:nth-child(2) > div:nth-child(4)')
        await this.page.waitForTimeout(500)
        this.clearTimer(this.timer);

        //Tags
        this.timer = this.consoleTimer('Input tags ..\t');
        await this.page.waitForTimeout(200)
        await this.page.waitForSelector('.zgFouf > svg:nth-child(1) > path:nth-child(1)', { visible: true })
        await this.page.click('.zgFouf > svg:nth-child(1) > path:nth-child(1)')
        await this.page.waitForTimeout(200);
        await this.page.keyboard.type('Tags: ' + title + ' by ' + author + 'Free download, epub, pdf, docs, New York Times, ppt, audio books, books to read, good books to read, cheap books, good books,online books, books online, book reviews, read books online, books to read online, online library, greatbooks to read, best books to read, top books to ' + title + ' by ' + author + 'book to read online.')
        this.clearTimer(this.timer);
        await this.page.waitForTimeout(5000);
        //copy link 
        // await this.page.waitForTimeout(300);
        // await this.page.waitForSelector('.odraff > svg:nth-child(1)', { visible: true });
        // // await page.click('.odraff > svg:nth-child(1)') 
        // // id="ilet4c"

        // await this.clickButtonWhenEnabled("#ilet4c");

        // await this.page.waitForSelector('.ocNfZ > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', { visible: true })
        // let weblink1 = await this.page.$eval('.ocNfZ > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', el => { return el.getAttribute('value') })
        // let weblink2 = { link: weblink1 }
        // console.log(weblink2);
        // // linkdata.push(weblink2)
        // // console.log(linkdata)
        // await this.page.waitForTimeout(200)
        // //close copy link
        // await this.page.waitForSelector('.VY7JQd > div:nth-child(1) > span:nth-child(2) > span:nth-child(1) > svg:nth-child(1)', { visible: true })
        // await this.page.click('.VY7JQd > div:nth-child(1) > span:nth-child(2) > span:nth-child(1) > svg:nth-child(1)')

        // return weblink2
    }

    async start() {
        // const linkdata = [];
        let isNewPage = true;
        try {
            await this.initBrowser();
            console.log(chalk.green('Success init browser'));
            this.timer = this.consoleTimer('Init page');
            isNewPage = await this.initPage();
            this.clearTimer(this.timer);
            console.log(chalk.green('Success init page'));
            await this.readLine();
        } catch (error) {
            console.log('Gagal membuka browser:', (error.message || error));
            return 'Failed to open browser!';
        }
        let counter = 1;
        for (var item in this.content) {
            // console.log(item);
            let retry = 0,
                // maxRetry = 10;
                maxRetry = 1;
            while (retry < maxRetry) {
                try {
                    await this.page.setDefaultTimeout(this.defaultTimeOut);
                    // await this.clickButtonWhenEnabled("div[guidedhelpid='at-appbar-publish']");
                    console.log(chalk.blue(`start new page (content ke-${counter}, percobaan ke-${retry+1})`));
                    await this.createNewSite(this.content[item], isNewPage);
                    // linkdata.push(link);
                    let saveTimeOut = 5000;
                    for (let k = 1; k <= 10; k++) {
                        this.timer = this.consoleTimer('menyimpan progress... (percobaan ke ' + k + ')', saveTimeOut);
                        try {
                            await this.page.setDefaultTimeout(saveTimeOut);
                            await this.page.waitForFunction(
                                selector => document.querySelector(selector).innerHTML == "Semua perubahan disimpan di Drive", {},
                                '#mBEqFd'
                            );
                            this.clearTimer(this.timer);
                            break;
                        } catch (e) {
                            this.clearTimer(this.timer);
                            console.log(chalk.red('Gagal menyimpan, error dengan pesan : ', (e.message || e)));
                        }

                        if (k == 10) {
                            throw new Error(`Gagal menyimpan 10x, progress akan dihapus`);
                        }
                    }
                    console.log(chalk.green('berhasil menyimpan progress'));
                    isNewPage = false;
                    console.log(chalk.green(`finish current page (content ke-${counter}, percobaan ke-${retry+1})`));
                    retry = maxRetry;
                    this.pageCounter++;
                    if (this.pageCounter % 5 == 0) {
                        await this.page.setDefaultTimeout(this.defaultTimeOut);
                        await this.publishSite();
                    }
                    break;
                } catch (error) {
                    this.clearTimer(this.timer);
                    this.pageCounter++;
                    if (this.pageCounter % 5 == 0) {
                        await this.page.setDefaultTimeout(this.defaultTimeOut);
                        await this.publishSite();
                    }
                    console.log(chalk.red(`error: `, (error.message || error)));
                    while (true) {
                        try {
                            await this.page.waitForTimeout(2000);
                            this.timer = this.consoleTimer('close dan buka tab baru');
                            const current_page = this.page._target._targetInfo.url;
                            await this.page.close();
                            this.page = await this.browser.newPage();
                            this.clearTimer(this.timer);
                            this.page.goto(current_page);
                            await this.page.waitForTimeout(3000);
                            await this.page.evaluate(() => { window.stop(); });
                            // await this.openCurrentTheme();
                            await this.page.setDefaultTimeout(this.defaultTimeOut);
                            break;
                        } catch (err) {
                            this.clearTimer(this.timer);
                            await this.page.waitForTimeout(2000);
                            console.log(chalk.red(err));
                        }
                    }
                    // let statusDelete = false,
                    //     statusReload = false;
                    // try {
                    //     await this.page.setDefaultTimeout(this.defaultTimeOut);
                    //     console.log(chalk.red(`Percobaan ke-${retry + 1}, error dengan pesan: `, (error.message || error)));
                    //     await this.page.waitForTimeout(2000)
                    //         // pilih halaman terakhir
                    //         // await this.page.waitForSelector('div.U26fgb.JRtysb.WzwrXb.BvWn8e:nth-last-child(1)', { visible: true })
                    //         // await this.page.hover('div.U26fgb.JRtysb.WzwrXb.BvWn8e:nth-last-child(1)')
                    //         // await this.page.waitForTimeout(200);
                    //     await this.deleteCurrentPage(this.content[item]['header']);
                    //     statusDelete = true;
                    //     console.log(chalk.red(`delete current page (content ke-${counter}, percobaan ke-${retry+1}), deleted_header = ${this.content[item]['header']}`));
                    //     // simpan & reload
                    //     let isReload = false;
                    //     let saveTimeOut = 5000;
                    //     for (let m = 1; m <= 30; m++) {
                    //         this.timer = this.consoleTimer('menyimpan progress... (percobaan ke ' + m + ')', saveTimeOut);
                    //         try {
                    //             await this.page.setDefaultTimeout(saveTimeOut);
                    //             await this.page.waitForFunction(
                    //                 selector => document.querySelector(selector).innerHTML == "Semua perubahan disimpan di Drive", {},
                    //                 '#mBEqFd'
                    //             );
                    //             isReload = true;
                    //             this.clearTimer(this.timer);
                    //             break;
                    //         } catch (e) {
                    //             this.clearTimer(this.timer);
                    //             console.log(chalk.red('Gagal menyimpan, error dengan pesan : ', (e.message || e)));
                    //         }
                    //         if (m == 30) {
                    //             console.log(chalk.red(`Gagal menyimpan 5x, halaman tidak direload`));
                    //         }
                    //     }
                    //     await this.page.setDefaultTimeout(this.defaultTimeOut);
                    //     if (isReload) {
                    //         console.log(chalk.green('berhasil menyimpan progress, halaman reload'));
                    //         await this.page.reload();
                    //     }
                    //     statusReload = true;
                    //     await this.page.waitForTimeout(200);
                    //     //click tab
                    //     await this.page.waitForSelector('div.ThdJC:nth-child(2) > span:nth-child(2) > div:nth-child(1)', { visible: true })
                    //     await this.page.click('div.ThdJC:nth-child(2) > span:nth-child(2) > div:nth-child(1)')
                    //     await this.page.waitForTimeout(200);
                    //     // click last page
                    //     await this.page.waitForSelector('.Duxokd:nth-last-child(1)', { visible: true })
                    //     await this.page.click('.Duxokd:nth-last-child(1)');
                    //     // await this.page.evaluate(() => {
                    //     //     await location.reload(true);
                    //     // })
                    //     await this.page.waitForTimeout(2000);
                    // } catch (e) {
                    //     this.clearTimer(this.timer);
                    //     if (!statusDelete) {
                    //         console.log(chalk.red(`Proses hapus gagal, tab di-close, proses hapus diulang, error : ${e}`));
                    //         while (true) {
                    //             try {
                    //                 await this.page.waitForTimeout(2000);
                    //                 this.timer = this.consoleTimer('close dan buka tab baru');
                    //                 await this.page.close();
                    //                 this.page = await this.browser.newPage();
                    //                 await this.page.goto('https://sites.google.com');
                    //                 this.clearTimer(this.timer);
                    //                 await this.openCurrentTheme(this.content[item]['header']);
                    //                 console.log(chalk.red(`delete current page (content ke-${counter}, percobaan ke-${retry+1}), deleted_header = ${this.content[item]['header']}`));
                    //                 await this.page.setDefaultTimeout(this.defaultTimeOut);
                    //                 break;
                    //             } catch (err) {
                    //                 this.clearTimer(this.timer);
                    //                 await this.page.waitForTimeout(2000);
                    //                 if (err.message.includes("Cannot read properties of null (reading 'click')")) {
                    //                     console.log(chalk.red(`Halaman sudah dihapus, proses hapus dibatalkan`));
                    //                     break;
                    //                 } else if (err.message.includes("Protocol error: Connection closed. Most likely the page has been closed.")) {
                    //                     console.log(chalk.red(`tab utama sudah diclose, create tab baru`));
                    //                     this.page = await this.browser.newPage();
                    //                     continue;
                    //                 }
                    //                 console.log(chalk.red(err));
                    //             }
                    //         }
                    //     } else {
                    //         if (!statusReload) {
                    //             console.log(chalk.red(`Proses reload gagal, tab di-close, error : ${e}`));
                    //         }
                    //         while (true) {
                    //             try {
                    //                 await this.page.waitForTimeout(2000);
                    //                 this.timer = this.consoleTimer('close dan buka tab baru');
                    //                 await this.page.close();
                    //                 this.page = await this.browser.newPage();
                    //                 this.clearTimer(this.timer);
                    //                 await this.page.goto('https://sites.google.com');
                    //                 await this.openCurrentTheme();
                    //                 await this.page.setDefaultTimeout(this.defaultTimeOut);
                    //                 break;
                    //             } catch (err) {
                    //                 this.clearTimer(this.timer);
                    //                 await this.page.waitForTimeout(2000);
                    //                 console.log(chalk.red(err));
                    //             }
                    //         }
                    //     }
                    // }
                    retry++;
                    // this.clearTimer(this.timer);
                }
                if (retry === maxRetry) {
                    //create new other site
                    break;
                }
            }
            this.clearTimer(this.timer);
            counter++;
        }
        console.log('Done, close browser ..');
        await this.browser.close();
        // return linkdata;
    }
}

module.exports = SiteCreator;


(async() => {
    // const fileContent = fs.readFileSync(path.join('./format1.csv'), { encoding: 'utf-8' });
    // const content = fileContent.split('\n');
    // const csvFilePath = './format1.csv'
    const csvFilePath = './database ebook puplar 2.csv'
    csv()
        .fromFile(csvFilePath)
        .then((content) => {
            // const defaultTool = new SiteCreator(content, 'Default');
            // const profileOneTool = new SiteCreator(content, path.join('User Data', 'Default'));
            const profileOneTool = new SiteCreator(content, 'Default');
            // const profileOneTool = new SiteCreator(content, 'User Data 2');
            // const profileOneTool = new SiteCreator(content, 'Profile 8');
            // defaultTool.start();
            // const linkData = profileOneTool.start();
            profileOneTool.start();
            // console.log(linkData);
        });

})()