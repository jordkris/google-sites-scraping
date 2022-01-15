const puppeteer = require('puppeteer-extra');
const fs = require('fs-extra');
const path = require('path');
const { nanoid } = require('nanoid');
const csv = require('csvtojson');
const readline = require('readline');
const chalk = require('chalk');
const process = require('process');
const moment = require('moment');
const _ = require('underscore');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
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
        // this.executablePath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
        // this.userDataDir = 'C:/Users/ASUS A407UA/AppData/Local/Microsoft/Edge/User Data';

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
        // const sourceDir = path.join(this.userDataDir, profile);
        // const projectDir = path.join(__dirname, profile);
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
        console.log(path.join(this.userDataDir, this.profile));
        this.browser = await puppeteer.launch({
            executablePath: this.executablePath,
            headless: false,
            defaultViewport: null,
            userDataDir: path.join(this.userDataDir),
            // devtools: true,
            args: [
                '--start-maximized', // you can also use '--start-fullscreen'
                '--profile-directory=' + this.profile
                // '--auto-open-devtools-for-tabs'
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

        // atur format
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
            maxRetry = 5;
        while (retry < maxRetry) {
            try {
                this.timer = this.consoleTimer(`publish... (percobaan ke ${retry+1})`);
                await this.page.waitForTimeout(2000)
                await this.page.waitForSelector('div.QelWNb.F8Wqud > div:nth-child(1)', { visible: true });
                await this.page.click('div.QelWNb.F8Wqud > div:nth-child(1)');
                // await this.page.waitForTimeout(500)
                // await this.page.waitForSelector('div.jzUkrb > div:nth-child(2)', { visible: true });
                // await this.page.click('div.jzUkrb > div:nth-child(2)');
                await this.page.waitForTimeout(3000)
                await this.page.waitForFunction(
                    selector => document.querySelector(selector).innerHTML == "Situs Anda berhasil dipublikasikan", {},
                    'div.VYTiVb'
                );
                this.clearTimer(this.timer);
                console.log(chalk.green('Situs ini berhasil dipublish'));
                // await this.page.waitForSelector('div.jFptUc > div:nth-child(1)', { visible: true });
                // await this.page.click('div.jFptUc > div:nth-child(1)');
                break;
            } catch (e) {
                this.clearTimer(this.timer);
                // if (e.message.includes('`div.jzUkr > div:nth-child(2)`')) {
                //     console.log(chalk.red('Halaman telah dipublish, proses publish dibatalkan'));
                //     break;
                // } else {
                console.log(chalk.red('Gagal publish, error dengan pesan : ', (e.message || e)));
                // }
                await this.page.reload();
                retry++;
            }
            if (retry == 5) {
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

        await this.page.keyboard.type('Author : ')
        await this.page.keyboard.type(author)
        await this.page.keyboard.press('Enter')

        await this.page.keyboard.type('Release : ')
        await this.page.keyboard.type(pages)
            //await page.keyboard.type(' pages')
        await this.page.keyboard.press('Enter')

        await this.page.keyboard.type('Category : ')
        await this.page.keyboard.type(publisher)
        await this.page.keyboard.press('Enter')
        await this.page.mouse.wheel({ deltaY: 200 })
        await this.page.keyboard.type('Language : ')
        await this.page.keyboard.type(language)
        await this.page.keyboard.press('Enter')
        await this.page.keyboard.type('Niche : ')
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

    async initPage1() {
        // if (this.page) {
        //     try {
        //         await this.page.close();
        //     } catch (error) {
        //         console.log('Page is not initiated ..');
        //     }
        // }
        // this.page = (await this.browser.pages())[0];
        // this.page = await this.browser.newPage();
        // await this.page.goto('https://studio.youtube.com/channel/UCXZe8Ih82LyUAPQ9mCj5iXg/videos/upload');
        // await this.page.goto('https://google.com');
        try {
            const formatDate = 'MM/DD/YYYY';

            const setting = {
                "url": {
                    "goto": "https://www.maxpreps.com/list/schedules_scores.aspx?date={date}&gendersport={sport}&state={state}",
                }
            }

            const STATE = {
                "AL": "Alabama",
                "AK": "Alaska",
                "AZ": "Arizona",
                "AR": "Arkansas",
                "CA": "California",
                "CO": "Colorado",
                "CT": "Connecticut",
                "DE": "Delaware",
                "FL": "Florida",
                "GA": "Georgia",
                "HI": "Hawaii",
                "ID": "Idaho",
                "IL": "Illinois",
                "IN": "Indiana",
                "IA": "Iowa",
                "KS": "Kansas",
                "KY": "Kentucky",
                "LA": "Louisiana",
                "ME": "Maine",
                "MD": "Maryland",
                "MA": "Massachusetts",
                "": "Mexico",
                "MI": "Michigan",
                "MN": "Minnesota",
                "MS": "Mississippi",
                "MO": "Missouri",
                "MT": "Montana",
                "NE": "Nebraska",
                "NV": "Nevada",
                "NH": "New Hampshire",
                "NJ": "New Jersey",
                "NM": "New Mexico",
                "NY": "New York",
                "NC": "North Carolina",
                "ND": "North Dakota",
                "OH": "Ohio",
                "OK": "Oklahoma",
                "OR": "Oregon",
                "PA": "Pennsylvania",
                "PS": "Prep Schools",
                "RI": "Rhode Island",
                "SC": "South Carolina",
                "SD": "South Dakota",
                "TN": "Tennessee",
                "TX": "Texas",
                "UT": "Utah",
                "VT": "Vermont",
                "VA": "Virginia",
                "WA": "Washington",
                "DC": "Washington, DC",
                "WV": "West Virginia",
                "WI": "Wisconsin",
                "WY": "Wyoming"
            };
            const SPORT = {
                "boys,baseball": "Boys Baseball",
                "boys,basketball": "Boys Basketball",
                "boys,football": "Boys Football",
                "boys,lacrosse": "Boys Lacrosse",
                "boys,soccer": "Boys Soccer",
                "boys,trackfield": "Boys Track & Field",
                "girls,basketball": "Girls Basketball",
                "girls,lacrosse": "Girls Lacrosse",
                "girls,soccer": "Girls Soccer",
                "girls,softball": "Girls Softball",
                "girls,trackfield": "Girls Track & Field",
                "girls,volleyball": "Girls Volleyball",
                "boys,badminton": "Boys Badminton",
                "boys,baseball": "Boys Baseball",
                "boys,basketball": "Boys Basketball",
                "boys,bowling": "Boys Bowling",
                "boys,crosscountry": "Boys Cross Country",
                "boys,flagfootball": "Boys Flag Football",
                "boys,football": "Boys Football",
                "boys,golf": "Boys Golf",
                "boys,icehockey": "Boys Ice Hockey",
                "boys,indoortrackfield": "Boys Indoor Track & Field",
                "boys,lacrosse": "Boys Lacrosse",
                "boys,rugby": "Boys Rugby",
                "boys,skisnowboard": "Boys Ski & Snowboard",
                "boys,soccer": "Boys Soccer",
                "boys,swimming": "Boys Swimming",
                "boys,tennis": "Boys Tennis",
                "boys,trackfield": "Boys Track & Field",
                "boys,volleyball": "Boys Volleyball",
                "boys,waterpolo": "Boys Water Polo",
                "boys,weightlifting": "Boys Weight Lifting",
                "boys,wrestling": "Boys Wrestling",
                "co-ed,cheer": "Co-ed Cheer",
                "co-ed,danceteam": "Co-ed Dance Team",
                "co-ed,drill": "Co-ed Drill",
                "co-ed,speech": "Co-ed Speech",
                "girls,basketball": "Girls Basketball",
                "girls,bowling": "Girls Bowling",
                "girls,crosscountry": "Girls Cross Country",
                "girls,fieldhockey": "Girls Field Hockey",
                "girls,flagfootball": "Girls Flag Football",
                "girls,golf": "Girls Golf",
                "girls,gymnastics": "Girls Gymnastics",
                "girls,icehockey": "Girls Ice Hockey",
                "girls,indoortrackfield": "Girls Indoor Track & Field",
                "girls,lacrosse": "Girls Lacrosse",
                "girls,skisnowboard": "Girls Ski & Snowboard",
                "girls,slowpitchsoftball": "Girls Slow Pitch Softball",
                "girls,soccer": "Girls Soccer",
                "girls,softball": "Girls Softball",
                "girls,swimming": "Girls Swimming",
                "girls,tennis": "Girls Tennis",
                "girls,trackfield": "Girls Track & Field",
                "girls,volleyball": "Girls Volleyball",
                "girls,waterpolo": "Girls Water Polo",
                "girls,weightlifting": "Girls Weight Lifting"
            };
            let page = [];
            async function run(browser, log, output, values, loop, retry = 0) {
                let fixDate = values.date.split("/");
                fixDate[0] = parseInt(fixDate[0]).toString();
                fixDate[1] = parseInt(fixDate[1]).toString();
                values.date = fixDate.join("/");
                let availableSchedule;
                page[loop] = (await browser.newPage());
                let targetUrl = setting.url.goto.replace('{date}', values.date).replace('{sport}', values.sport).replace('{state}', values.state.toLowerCase());
                let result = [];
                console.log(chalk.blue(loop + '. open ' + targetUrl));
                // console.log("test 2");
                try {
                    // output.log(JSON.stringify(values));
                    // page = await this.page;
                    await page[loop].goto(targetUrl, { waitUntil: 'domcontentloaded' });
                    availableSchedule = await page[loop].evaluate(() => {
                        return [...document.querySelectorAll('.month li > a')].map((val) => {
                            return [new URL(val.href).searchParams.get("date"), val.href];
                        });
                    });
                    // console.log(chalk.gray(availableSchedule.map((val) => { return val[0]; })));
                    // console.log(chalk.gray(values.date));
                    if (!(await availableSchedule.map((val) => { return val[0]; }).includes(values.date))) {
                        await page[loop].close();
                        return result;
                    }
                    // console.log("test 3")
                    await page[loop].waitForTimeout(1000);
                    // result = await availableSchedule.map((val) => { return val[1]; });
                    result = await page[loop].evaluate((additional) => {
                        let els = document.querySelectorAll('.no-data');
                        if (els.length) {
                            return [];
                        } else {
                            let teams = document.querySelectorAll("[data-teams]");
                            if (teams.length) {
                                let cup = document.querySelector("header h1").textContent.trim();

                                if (cup.includes("Schedule")) {
                                    cup = cup.replace('Schedule', '').replace(additional[additional.length - 1], '').trim();
                                    let result = [];
                                    for (let i = 0; i < teams.length; i++) {
                                        console.log('data' + i);
                                        let contest = teams[i].querySelectorAll(".teams li .name");
                                        let link = teams[i].querySelector('a.c-c') || 'link not found';
                                        if (!(link == 'link not found')) {
                                            link = teams[i].querySelector('a.c-c').href;
                                        }
                                        if (contest.length == 2) {
                                            let home = contest[0].textContent.trim();
                                            let away = contest[1].textContent.trim();

                                            if (home.toLowerCase() === 'tba' || away.toLowerCase() === 'tba') {

                                            } else {
                                                result.push([home, away, link].concat(additional));
                                            }
                                        }
                                    }

                                    return result;
                                }
                            }
                            return [];
                        }
                    }, [values.date, SPORT[values.sport], STATE[values.state]]);
                    // console.log(result);
                    for (let i = 0; i < result.length; i++) {
                        if (result[i][2] !== 'link not found') {
                            await page[loop].goto(result[i][2], { waitUntil: 'domcontentloaded' });
                            await page[loop].waitForSelector('p.contest-description');
                            result[i][2] = await page[loop].$eval('p.contest-description', e => e.innerHTML);
                        }
                    }

                    // output.log(chalk.green(userOpts + '. values ' + JSON.stringify(values)));

                    await page[loop].close();

                    return result;
                } catch (er) {
                    if (2 > retry && !await browser._connection._closed) {
                        retry++;
                        output.log(chalk.gray('Retry-' + retry + " : " + JSON.stringify(values) + "," + er));
                        if (await page[loop] && !(await page[loop]._closed)) {
                            await page[loop].close();
                        }
                        return await run(browser, log, output, values, loop, retry);
                    } else {
                        // await log(er, page);
                        if (await page[loop] && !(await page[loop]._closed)) {
                            await page[loop].close();
                        }
                        return new Error(er);
                    }
                }
            }
            async function runMaxpreps(browser, log, output, values, userOpts) {
                let start = values.start.format(formatDate);
                let end = values.end.format(formatDate);
                let date = [start];
                if (start !== end) {
                    let diff = values.end.diff(values.start, 'days');
                    for (let i = 0; i < diff; i++) {
                        date.push(values.start.add(1, 'days').format(formatDate));
                    }
                    console.log(date);
                }

                let data = [];
                let queue = [];
                let loop = 0;
                let bestThread = [date.length, values.sport.length, values.state.length];
                bestThread = bestThread.reduce((a, b) => { return a * b; }) / Math.max(...bestThread);
                for (let i = 0; i < date.length; i++) {
                    for (let j = 0; j < values.sport.length; j++) {
                        for (let k = 0; k < values.state.length; k++) {
                            queue.push(run(browser, log, output, {
                                date: date[i],
                                sport: values.sport[j],
                                state: values.state[k]
                            }, loop).then((result) => {
                                // console.log(chalk.blue((loop - 1) + '. result : ', result));
                                data = _.union(data, result);
                            }).catch(chalk.red(console.error)));
                            loop++;
                            if (loop % bestThread === 0) {
                                await Promise.all(queue);
                                queue = [];
                                console.log(chalk.green('Promise success for this batch'));
                            }
                        }
                    }
                }

                if (queue.length) {
                    await Promise.all(queue);
                    queue = [];
                }

                return data;
            }
            // let finalResult = await runMaxpreps(this.browser, console, console, { "sport": ["boys,baseball", "boys,badminton", "boys,basketball"], "state": ["AL", "AZ", "AK"], "start": moment("2021-12-11"), "end": moment("2021-12-13"), }, '');
            let finalResult = await runMaxpreps(this.browser, console, console, { "sport": ["boys,baseball", "boys,badminton", "boys,basketball"], "state": ["AL", "AZ", "AK"], "start": moment("2021-11-01"), "end": moment("2022-01-31"), }, '');
            // finalResult.split(',')
            // console.log(chalk.green(finalResult));
            finalResult.forEach((val) => { console.log(val); });
            await this.browser.close();
        } catch (err) {
            console.log(err);
        }
    }
    async initPage2() {
        this.page = await this.browser.newPage();
        await this.page.goto('https://www.maxpreps.com/list/schedules_scores.aspx?date=11/10/2021&gendersport=boys,badminton&state=AZ');
    }
    async start1() {
        await this.initBrowser();
        await this.initPage1();
        // await this.initPage2();
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
                maxRetry = 5;
            while (retry < maxRetry) {
                try {
                    await this.page.setDefaultTimeout(this.defaultTimeOut);
                    // await this.clickButtonWhenEnabled("div[guidedhelpid='at-appbar-publish']");
                    console.log(chalk.blue(`start new page (content ke-${counter}, percobaan ke-${retry+1})`));
                    await this.createNewSite(this.content[item], isNewPage);
                    // linkdata.push(link);
                    let saveTimeOut = 5000;
                    for (let k = 1; k <= 5; k++) {
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

                        if (k == 5) {
                            throw new Error(`Gagal menyimpan 5x, progress akan dihapus`);
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
                    let statusDelete = false,
                        statusReload = false;
                    try {
                        await this.page.setDefaultTimeout(this.defaultTimeOut);
                        console.log(chalk.red(`Percobaan ke-${retry + 1}, error dengan pesan: `, (error.message || error)));
                        await this.page.waitForTimeout(2000)
                            // pilih halaman terakhir
                            // await this.page.waitForSelector('div.U26fgb.JRtysb.WzwrXb.BvWn8e:nth-last-child(1)', { visible: true })
                            // await this.page.hover('div.U26fgb.JRtysb.WzwrXb.BvWn8e:nth-last-child(1)')
                            // await this.page.waitForTimeout(200);
                        await this.deleteCurrentPage(this.content[item]['header']);
                        statusDelete = true;
                        console.log(chalk.red(`delete current page (content ke-${counter}, percobaan ke-${retry+1}), deleted_header = ${this.content[item]['header']}`));
                        // simpan & reload
                        let isReload = false;
                        let saveTimeOut = 5000;
                        for (let m = 1; m <= 5; m++) {
                            this.timer = this.consoleTimer('menyimpan progress... (percobaan ke ' + m + ')', saveTimeOut);
                            try {
                                await this.page.setDefaultTimeout(saveTimeOut);
                                await this.page.waitForFunction(
                                    selector => document.querySelector(selector).innerHTML == "Semua perubahan disimpan di Drive", {},
                                    '#mBEqFd'
                                );
                                isReload = true;
                                this.clearTimer(this.timer);
                                break;
                            } catch (e) {
                                this.clearTimer(this.timer);
                                console.log(chalk.red('Gagal menyimpan, error dengan pesan : ', (e.message || e)));
                            }
                            if (m == 5) {
                                console.log(chalk.red(`Gagal menyimpan 5x, halaman tidak direload`));
                            }
                        }
                        await this.page.setDefaultTimeout(this.defaultTimeOut);
                        if (isReload) {
                            console.log(chalk.green('berhasil menyimpan progress, halaman reload'));
                            await this.page.reload();
                        }
                        statusReload = true;
                        await this.page.waitForTimeout(200);
                        //click tab
                        await this.page.waitForSelector('div.ThdJC:nth-child(2) > span:nth-child(2) > div:nth-child(1)', { visible: true })
                        await this.page.click('div.ThdJC:nth-child(2) > span:nth-child(2) > div:nth-child(1)')
                        await this.page.waitForTimeout(200);
                        // click last page
                        await this.page.waitForSelector('.Duxokd:nth-last-child(1)', { visible: true })
                        await this.page.click('.Duxokd:nth-last-child(1)');
                        // await this.page.evaluate(() => {
                        //     await location.reload(true);
                        // })
                        await this.page.waitForTimeout(2000);
                    } catch (e) {
                        this.clearTimer(this.timer);
                        if (!statusDelete) {
                            console.log(chalk.red(`Proses hapus gagal, tab di-close, proses hapus diulang, error : ${e}`));
                            while (true) {
                                try {
                                    await this.page.waitForTimeout(2000);
                                    this.timer = this.consoleTimer('close dan buka tab baru');
                                    // await this.page.close();
                                    // this.page = await this.browser.newPage();
                                    await this.page.goto('https://sites.google.com');
                                    this.clearTimer(this.timer);
                                    await this.openCurrentTheme(this.content[item]['header']);
                                    console.log(chalk.red(`delete current page (content ke-${counter}, percobaan ke-${retry+1}), deleted_header = ${this.content[item]['header']}`));
                                    await this.page.setDefaultTimeout(this.defaultTimeOut);
                                    break;
                                } catch (err) {
                                    this.clearTimer(this.timer);
                                    await this.page.waitForTimeout(2000);
                                    if (err.message.includes("Cannot read properties of null (reading 'click')")) {
                                        console.log(chalk.red(`Halaman sudah dihapus, proses hapus dibatalkan`));
                                        break;
                                    } else if (err.message.includes("Protocol error: Connection closed. Most likely the page has been closed.")) {
                                        console.log(chalk.red(`tab utama sudah diclose, create tab baru`));
                                        this.page = await this.browser.newPage();
                                        continue;
                                    }
                                    console.log(chalk.red(err));
                                }
                            }
                        } else {
                            if (!statusReload) {
                                console.log(chalk.red(`Proses reload gagal, tab di-close, error : ${e}`));
                            }
                            while (true) {
                                try {
                                    await this.page.waitForTimeout(2000);
                                    this.timer = this.consoleTimer('close dan buka tab baru');
                                    await this.page.close();
                                    this.page = await this.browser.newPage();
                                    this.clearTimer(this.timer);
                                    await this.page.goto('https://sites.google.com');
                                    await this.openCurrentTheme();
                                    await this.page.setDefaultTimeout(this.defaultTimeOut);
                                    break;
                                } catch (err) {
                                    this.clearTimer(this.timer);
                                    await this.page.waitForTimeout(2000);
                                    console.log(chalk.red(err));
                                }
                            }
                        }

                    } finally {
                        retry++;
                        this.clearTimer(this.timer);
                    }
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

// module.exports = SiteCreator;


(async() => {
    // const fileContent = fs.readFileSync(path.join('./format1.csv'), { encoding: 'utf-8' });
    // const content = fileContent.split('\n');
    // const csvFilePath = './format1.csv'
    const csvFilePath = './database ebook puplar 2.csv'
    csv()
        .fromFile(csvFilePath)
        .then((content) => {
            const profileOneTool = new SiteCreator(content, 'Default');
            // const profileOneTool = new SiteCreator(content, path.join('User Data', 'Default'));
            // const profileOneTool = new SiteCreator(content, 'Profile 1');
            // const profileOneTool = new SiteCreator(content, 'User Data 2');
            // const profileOneTool = new SiteCreator(content, 'Profile 8');
            // defaultTool.start();
            // const linkData = profileOneTool.start();
            profileOneTool.start();
            // console.log(linkData);
        });


})()