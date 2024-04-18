const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Prototype Pollution Test', function() {
    let driver;

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
        console.log('Chrome should be running')
    });

    after(async function() {
        await driver.quit();
    });

    it('should not be vulnerable to prototype pollution', async function(done) {
        try {
            console.log('attempting test');
            await driver.get('http://localhost:3000/cspp?__proto__[value]=foo'); // Replace with the URL of your locally hosted React app
            let config = {vuln: false};
            Object.defineProperty(config, 'vuln', {configurable: false, writable: false});
            if(config.vuln){
                console.log('Config is vulnerable');
            }
            console.log('Finished Await');
            // Find the vulnerable input field and inject the prototype pollution payload
            const inputField = await driver.findElement(By.css('input[name="username"]'));

            await inputField.sendKeys("<script>alert('Prototype Pollution!')</script>");

            // Wait for the alert caused by the prototype pollution
            await driver.wait(until.alertIsPresent());

            // Accept the alert
            const alert = await driver.switchTo().alert();
            await alert.accept();

            // Check for unexpected behavior caused by the pollution
            const stateData = await driver.findElement(By.tagName('pre')).getText();

            // Assert that the state data does not contain the injected script
            assert.strictEqual(stateData.includes("<script>alert('Prototype Pollution!')</script>"), false, 'Prototype pollution detected');

        } catch (error) {
            // If an error occurs, mark the test as failed
            assert.fail(error);
        }
        done();
    });
});
