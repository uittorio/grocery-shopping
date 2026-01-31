/**
 * Tesco Integration Spike
 *
 * This script proves we can programmatically add items to a Tesco basket.
 *
 * Steps:
 * 1. Login to Tesco (or load saved session)
 * 2. Search for a product
 * 3. Add product to basket
 * 4. Verify item is in basket
 *
 * Network traffic is logged passively for API analysis.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration
const CONFIG = {
  headless: false,  // Run in headed mode first to see what's happening
  slowMo: 100,      // Slow down actions to make them more human-like
  timeout: 30000,   // 30 second timeout for most operations
  authFile: path.join(__dirname, 'auth.json'),
  networkLogFile: path.join(__dirname, 'network-log.json'),
  screenshotDir: path.join(__dirname, 'screenshots'),
  searchTerm: 'semi-skimmed milk',  // Default test product
};

// Credentials from environment
const TESCO_EMAIL = process.env.TESCO_EMAIL;
const TESCO_PASSWORD = process.env.TESCO_PASSWORD;

// Network traffic log
const networkLog = {
  requests: [],
  responses: []
};

/**
 * Check if we have saved authentication state
 */
function hasSavedAuth() {
  return fs.existsSync(CONFIG.authFile);
}

/**
 * Take a screenshot for debugging
 */
async function screenshot(page, name) {
  const filename = path.join(CONFIG.screenshotDir, `${name}-${Date.now()}.png`);
  await page.screenshot({ path: filename, fullPage: true });
  console.log(`  Screenshot saved: ${filename}`);
}

/**
 * Setup network logging
 */
function setupNetworkLogging(page) {
  page.on('request', request => {
    networkLog.requests.push({
      timestamp: new Date().toISOString(),
      url: request.url(),
      method: request.method(),
      headers: request.headers(),
      postData: request.postData(),
    });
  });

  page.on('response', async response => {
    const request = response.request();
    try {
      networkLog.responses.push({
        timestamp: new Date().toISOString(),
        url: response.url(),
        status: response.status(),
        headers: response.headers(),
        contentType: response.headers()['content-type'],
        // Only log response body for JSON responses to avoid huge logs
        body: response.headers()['content-type']?.includes('application/json')
          ? await response.text().catch(() => null)
          : null,
      });
    } catch (error) {
      // Response body may already be consumed, that's fine
    }
  });
}

/**
 * Save network log to file
 */
function saveNetworkLog() {
  const logData = {
    timestamp: new Date().toISOString(),
    summary: {
      totalRequests: networkLog.requests.length,
      totalResponses: networkLog.responses.length,
    },
    requests: networkLog.requests,
    responses: networkLog.responses,
  };

  fs.writeFileSync(CONFIG.networkLogFile, JSON.stringify(logData, null, 2));
  console.log(`\nNetwork log saved: ${CONFIG.networkLogFile}`);
  console.log(`  Total requests: ${networkLog.requests.length}`);
  console.log(`  Total responses: ${networkLog.responses.length}`);
}

/**
 * Handle cookie consent banner
 */
async function handleCookieConsent(page) {
  console.log('  Checking for cookie consent banner...');

  try {
    // Wait a bit for the banner to appear
    await page.waitForTimeout(2000);

    // Try to find and click "Accept all cookies" button
    // Common selectors for Tesco cookie banner
    const acceptButton = page.locator('button:has-text("Accept all cookies")').or(
      page.locator('button:has-text("Accept All Cookies")')
    ).or(
      page.locator('#accept-all-cookies')
    ).first();

    if (await acceptButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('  Cookie banner found, accepting...');
      await acceptButton.click();
      await page.waitForTimeout(1000);
    } else {
      console.log('  No cookie banner found (may have been dismissed previously)');
    }
  } catch (error) {
    console.log('  Cookie banner handling skipped:', error.message);
  }
}

/**
 * Login to Tesco
 */
async function login(page) {
  console.log('\n[LOGIN]');
  console.log('  Navigating to Tesco groceries...');

  await page.goto('https://www.tesco.com/groceries/', { waitUntil: 'domcontentloaded' });
  await handleCookieConsent(page);

  console.log('  Looking for sign in button...');

  // Click "Sign in" link in header
  const signInLink = page.locator('a:has-text("Sign in")').or(
    page.locator('button:has-text("Sign in")')
  ).first();

  await signInLink.click();
  await page.waitForTimeout(2000);

  console.log('  Filling in credentials...');

  // Fill in email
  const emailField = page.locator('input[type="email"]').or(
    page.locator('input[name="email"]')
  ).first();
  await emailField.fill(TESCO_EMAIL);

  // Fill in password
  const passwordField = page.locator('input[type="password"]').or(
    page.locator('input[name="password"]')
  ).first();
  await passwordField.fill(TESCO_PASSWORD);

  await screenshot(page, 'before-login');

  console.log('  Submitting login form...');

  // Click login button
  const loginButton = page.locator('button[type="submit"]').or(
    page.locator('button:has-text("Sign in")')
  ).first();
  await loginButton.click();

  // Wait for navigation after login
  console.log('  Waiting for login to complete...');
  await page.waitForTimeout(5000);

  // Check if we're logged in by looking for account elements
  const accountLink = page.locator('text=/account|my account/i').first();
  const isLoggedIn = await accountLink.isVisible({ timeout: 10000 }).catch(() => false);

  if (!isLoggedIn) {
    console.log('  WARNING: Login may have failed or requires 2FA/CAPTCHA');
    console.log('  Please check the browser window and complete any verification steps');
    await screenshot(page, 'login-verification-needed');

    // Wait for user to manually complete verification
    console.log('  Waiting 60 seconds for manual verification...');
    await page.waitForTimeout(60000);
  }

  await screenshot(page, 'after-login');
  console.log('  Login complete!');
}

/**
 * Search for a product
 */
async function searchProduct(page, searchTerm) {
  console.log(`\n[SEARCH] "${searchTerm}"`);

  // Find search box
  const searchBox = page.locator('input[type="search"]').or(
    page.locator('input[placeholder*="Search"]')
  ).first();

  console.log('  Entering search term...');
  await searchBox.fill(searchTerm);
  await searchBox.press('Enter');

  // Wait for search results to load
  console.log('  Waiting for search results...');
  await page.waitForTimeout(3000);

  await screenshot(page, 'search-results');

  // Try to extract product information
  console.log('  Analyzing search results...');

  // Look for product tiles/cards
  const productCards = page.locator('[data-auto="product-tile"]').or(
    page.locator('.product-tile')
  ).or(
    page.locator('article').filter({ hasText: /£/ })
  );

  const count = await productCards.count();
  console.log(`  Found ${count} products`);

  if (count === 0) {
    throw new Error('No products found in search results');
  }

  // Return info about first product
  return {
    count,
    firstProduct: productCards.first(),
  };
}

/**
 * Add product to basket
 */
async function addToBasket(page, product) {
  console.log('\n[ADD TO BASKET]');

  // Look for "Add" button within the product card
  const addButton = product.locator('button:has-text("Add")').or(
    product.locator('[data-auto="add-button"]')
  ).or(
    product.locator('button[aria-label*="Add"]')
  ).first();

  console.log('  Clicking Add button...');
  await addButton.click();

  // Wait for basket to update
  await page.waitForTimeout(2000);

  await screenshot(page, 'after-add-to-basket');
  console.log('  Product added!');
}

/**
 * Verify item is in basket
 */
async function verifyBasket(page) {
  console.log('\n[VERIFY BASKET]');

  // Look for basket icon with count
  const basketCount = page.locator('[data-auto="trolley-count"]').or(
    page.locator('.trolley-count')
  ).or(
    page.locator('[class*="basket"]').filter({ hasText: /\d+/ })
  ).first();

  const count = await basketCount.textContent().catch(() => '0');
  console.log(`  Basket count: ${count}`);

  // Navigate to basket page to verify
  console.log('  Navigating to basket page...');
  const basketLink = page.locator('a:has-text("Basket")').or(
    page.locator('a[href*="trolley"]')
  ).or(
    page.locator('[data-auto="trolley-link"]')
  ).first();

  await basketLink.click();
  await page.waitForTimeout(3000);

  await screenshot(page, 'basket-page');

  // Check for items in basket
  const basketItems = page.locator('[data-auto="basket-item"]').or(
    page.locator('.product-item')
  ).or(
    page.locator('article').filter({ hasText: /£/ })
  );

  const itemCount = await basketItems.count();
  console.log(`  Items in basket: ${itemCount}`);

  if (itemCount === 0) {
    throw new Error('Basket is empty - add to basket may have failed');
  }

  console.log('  Basket verification successful!');
  return itemCount;
}

/**
 * Main spike execution
 */
async function runSpike() {
  console.log('='.repeat(60));
  console.log('TESCO INTEGRATION SPIKE');
  console.log('='.repeat(60));

  // Validate environment
  if (!TESCO_EMAIL || !TESCO_PASSWORD) {
    console.error('\nERROR: Missing credentials!');
    console.error('Please create a .env file with TESCO_EMAIL and TESCO_PASSWORD');
    console.error('See .env.example for the template');
    process.exit(1);
  }

  let browser;
  let context;

  try {
    // Launch browser
    console.log('\n[SETUP]');
    console.log(`  Launching browser (headless: ${CONFIG.headless})...`);
    browser = await chromium.launch({
      headless: CONFIG.headless,
      slowMo: CONFIG.slowMo,
    });

    // Create context (with saved auth if available)
    if (hasSavedAuth()) {
      console.log('  Loading saved authentication state...');
      context = await browser.newContext({
        storageState: CONFIG.authFile,
      });
    } else {
      console.log('  No saved authentication found, will login fresh...');
      context = await browser.newContext();
    }

    const page = await context.newPage();
    setupNetworkLogging(page);

    // Login (or skip if we have valid session)
    if (!hasSavedAuth()) {
      await login(page);

      // Save authentication state for next run
      console.log('  Saving authentication state...');
      await context.storageState({ path: CONFIG.authFile });
      console.log(`  Auth saved to: ${CONFIG.authFile}`);
    } else {
      console.log('\n[LOGIN]');
      console.log('  Using saved authentication, navigating to Tesco...');
      await page.goto('https://www.tesco.com/groceries/', { waitUntil: 'domcontentloaded' });
      await handleCookieConsent(page);
    }

    // Search for product
    const searchResult = await searchProduct(page, CONFIG.searchTerm);

    // Add first product to basket
    await addToBasket(page, searchResult.firstProduct);

    // Verify basket
    const itemCount = await verifyBasket(page);

    // Success!
    console.log('\n' + '='.repeat(60));
    console.log('SPIKE SUCCESS!');
    console.log('='.repeat(60));
    console.log(`  Product searched: "${CONFIG.searchTerm}"`);
    console.log(`  Products found: ${searchResult.count}`);
    console.log(`  Items in basket: ${itemCount}`);
    console.log('='.repeat(60));

    // Keep browser open for inspection
    console.log('\nBrowser will remain open for 30 seconds for inspection...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('SPIKE FAILED');
    console.error('='.repeat(60));
    console.error(error);
    console.error('='.repeat(60));

    if (context) {
      const page = context.pages()[0];
      if (page) {
        await screenshot(page, 'error-state');
      }
    }

    // Keep browser open on error for debugging
    console.log('\nBrowser will remain open for 60 seconds for debugging...');
    await new Promise(resolve => setTimeout(resolve, 60000));

    process.exit(1);
  } finally {
    // Save network log
    saveNetworkLog();

    // Cleanup
    if (browser) {
      await browser.close();
    }
  }
}

// Run the spike
runSpike().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
