const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('chai').assert;

describe('Example Selenium Test', function() {
    let driver;

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async function() {
        await driver.quit();
    });

    it('should navigate to localhost and find "Welcome to the Home Page"', async function() {
        try {
            // Navigate to localhost
            await driver.get('http://localhost:3000'); // Replace with the URL of your localhost page

            // Wait for the page to load and find the element containing "Welcome to the Home Page"
            await driver.wait(until.elementLocated(By.xpath('//*[contains(text(), "Welcome to the Home Page")]')), 5000);

            // Get the text of the element
            const text = await driver.findElement(By.xpath('//*[contains(text(), "Welcome to the Home Page")]')).getText();

            // Verify that the text contains "Welcome to the Home Page"
            assert.include(text, 'Welcome to the Home Page', 'Text should contain "Welcome to the Home Page"');
        } catch (error) {
            // If an error occurs, fail the test
            assert.fail(error);
        }
    });
});
