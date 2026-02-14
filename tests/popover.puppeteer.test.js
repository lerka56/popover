const puppeteer = require('puppeteer');

describe('Popover Widget (Puppeteer)', () => {
    let browser;
    let page;
    
    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        page = await browser.newPage();
        
        // Загружаем локальный сервер (запустите предварительно: npm start)
        await page.goto('http://localhost:8080', { 
            waitUntil: 'networkidle0',
            timeout: 10000 
        }).catch(() => {
            console.log('Make sure to run "npm start" first!');
        });
    });
    
    afterAll(async () => {
        await browser.close();
    });
    
    test('page should have one button', async () => {
        const buttonCount = await page.$$eval('.popover-btn', buttons => buttons.length);
        expect(buttonCount).toBe(1);
    });
    
    test('should show popover on button click', async () => {
        // Кликаем на кнопку
        await page.click('.popover-btn');
        
        // Ждем появления popover
        await page.waitForSelector('.popover', { timeout: 1000 });
        
        // Проверяем содержимое
        const headerText = await page.$eval('.popover-header', el => el.textContent);
        const bodyText = await page.$eval('.popover-body', el => el.textContent);
        
        expect(headerText).toBe('Popover title');
        expect(bodyText).toBe("And here's some amazing content. It's very engaging. Right?");
    });
    
    test('should hide popover when clicking same button again', async () => {
        // Первый клик - показываем
        await page.click('.popover-btn');
        await page.waitForSelector('.popover');
        
        // Второй клик - скрываем
        await page.click('.popover-btn');
        
        // Проверяем, что popover закрылся
        await page.waitForTimeout(100);
        const popoverExists = await page.$('.popover') !== null;
        expect(popoverExists).toBe(false);
    });
    
    test('should close popover on ESC key', async () => {
        // Открываем popover
        await page.click('.popover-btn');
        await page.waitForSelector('.popover');
        
        // Нажимаем ESC
        await page.keyboard.press('Escape');
        
        // Проверяем, что popover закрылся
        await page.waitForTimeout(100);
        const popoverExists = await page.$('.popover') !== null;
        expect(popoverExists).toBe(false);
    });
    
    test('should close popover when clicking outside', async () => {
        // Открываем popover
        await page.click('.popover-btn');
        await page.waitForSelector('.popover');
        
        // Кликаем в пустое место body
        await page.click('body', { offset: { x: 10, y: 10 } });
        
        // Проверяем, что popover закрылся
        await page.waitForTimeout(100);
        const popoverExists = await page.$('.popover') !== null;
        expect(popoverExists).toBe(false);
    });
    
    test('should position popover above button', async () => {
        // Открываем popover
        await page.click('.popover-btn');
        await page.waitForSelector('.popover');
        
        // Получаем координаты
        const buttonBox = await page.$eval('.popover-btn', btn => {
            const rect = btn.getBoundingClientRect();
            return {
                top: rect.top,
                bottom: rect.bottom
            };
        });
        
        const popoverBox = await page.$eval('.popover', pop => {
            const rect = pop.getBoundingClientRect();
            return {
                top: rect.top,
                bottom: rect.bottom
            };
        });
        
        // Проверяем, что popover выше кнопки
        expect(popoverBox.bottom).toBeLessThan(buttonBox.top);
    });
    
    test('should center popover horizontally relative to button', async () => {
        // Открываем popover
        await page.click('.popover-btn');
        await page.waitForSelector('.popover');
        
        // Получаем центры
        const buttonCenter = await page.$eval('.popover-btn', btn => {
            const rect = btn.getBoundingClientRect();
            return rect.left + rect.width / 2;
        });
        
        const popoverCenter = await page.$eval('.popover', pop => {
            const rect = pop.getBoundingClientRect();
            return rect.left + rect.width / 2;
        });
        
        // Проверяем, что центры совпадают (с погрешностью в 1 пиксель)
        expect(Math.abs(buttonCenter - popoverCenter)).toBeLessThan(1);
    });
});