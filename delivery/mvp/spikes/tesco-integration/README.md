# Tesco Integration Spike

Technical spike to prove we can programmatically add items to a Tesco basket using browser automation.

## Prerequisites

- Node.js (v16+)
- Valid Tesco account credentials

## Setup

1. Install dependencies:
```bash
npm install
npx playwright install chromium
```

2. Create `.env` file with your Tesco credentials:
```bash
cp .env.example .env
# Edit .env and add your credentials
```

## Running the Spike

```bash
npm run spike
```

The script will:
1. Launch a browser in headed mode (you'll see it)
2. Login to Tesco (or use saved session if available)
3. Search for "semi-skimmed milk"
4. Add the first result to basket
5. Verify the item is in basket
6. Log all network traffic to `network-log.json`

## First Run

On the first run, you may need to manually solve CAPTCHA or 2FA challenges. The script will pause for 60 seconds if it detects this. After successful login, the session state is saved to `auth.json` for subsequent runs.

## Configuration

Edit `spike.js` to change:
- `CONFIG.searchTerm` - product to search for
- `CONFIG.headless` - set to `true` to run without visible browser
- `CONFIG.slowMo` - milliseconds to slow down actions

## Output Files

- `auth.json` - Saved authentication state (reused between runs)
- `network-log.json` - All HTTP requests/responses during the spike
- `screenshots/` - Debug screenshots at key points

## Troubleshooting

**Login fails**: Check credentials in `.env`, or manually complete 2FA/CAPTCHA when prompted.

**No products found**: Tesco UI may have changed. Check screenshots in `screenshots/` folder.

**Basket verification fails**: Item may have been added but basket page changed. Check `screenshots/basket-page-*.png`.

## Next Steps

After running successfully 3 times, review:
1. `network-log.json` for potential direct API calls
2. Screenshots to understand Tesco's UI structure
3. Console output for timing and reliability data
