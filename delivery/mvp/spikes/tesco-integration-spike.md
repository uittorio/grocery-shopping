# Spike: Tesco Basket Integration

**Status**: Planned
**Go/no-go gate**: This spike determines whether the MVP is feasible as defined. If we cannot programmatically add items to a Tesco basket, the MVP premise must be revisited.

---

## Goal

Prove that we can programmatically add at least one item to a Tesco online grocery basket from code running on a local machine.

### Success Criteria

| Criterion | Required? | Description |
|-----------|-----------|-------------|
| Search for a product by name | Yes | Given a text string (e.g., "chicken breast"), find matching Tesco products |
| Add a product to basket | Yes | Programmatically add a found product to an authenticated user's Tesco basket |
| Verify basket state | Yes | Confirm the item actually appeared in the basket |
| Repeatable | Yes | The process works on at least 3 consecutive attempts, not just once by luck |
| Reasonable speed | No (nice-to-have) | Adding a single item takes under 30 seconds |

**Minimum viable proof**: A script that, when run, logs into Tesco, searches for "semi-skimmed milk", adds the first result to the basket, and confirms it is there. Run it 3 times successfully.

---

## Approaches to Investigate

### Approach 1: Browser Automation with Playwright (Recommended starting point)

**How it works**: Use Playwright to launch a real browser (Chromium), navigate to tesco.com/groceries, log in with real credentials, search for products, and click "Add to basket" -- just as a human would.

**Pros**:
- Works exactly as a real user does -- no API to reverse-engineer
- Playwright has excellent TypeScript support (aligns with proposed tech stack)
- Handles JavaScript-rendered pages natively
- Prior art exists: `CamzBarber/tesco-selenium` proved this approach worked with Selenium
- Playwright is more modern than Selenium with better anti-detection defaults
- Authentication is straightforward: just fill in the login form
- Can run headed (visible browser) for debugging or headless for automation

**Cons**:
- Fragile: Tesco UI changes (class names, layout) will break selectors
- Slower than direct API calls (full browser rendering)
- Tesco may have bot detection that blocks headless browsers
- Requires a real browser process (resource overhead)
- Login may require 2FA/CAPTCHA handling

**Risk level**: Medium. Bot detection is the main risk, but for a personal POC with low request volume, this is likely manageable.

**Architect's rationale**: This is the most proven path. The existing `tesco-selenium` project demonstrates it has worked before. Playwright is a generation ahead of Selenium with better stealth capabilities. Start here.

**Programmer's rationale**: Playwright is the right tool (not Selenium) -- it is faster, has built-in auto-waiting, better TypeScript support, and is actively maintained. The `tesco-selenium` prior art validates the concept even if the specific selectors are outdated.

### Approach 2: Internal API Reverse-Engineering

**How it works**: Use browser DevTools to inspect the network requests Tesco's web app makes when a user searches for products and adds them to their basket. Capture those XHR/fetch calls (URLs, headers, payloads), then replay them directly from Node.js using `fetch` or `axios`.

**Pros**:
- Much faster execution (no browser overhead)
- More reliable if the API is stable (API contracts change less often than CSS selectors)
- Lighter resource footprint
- Could work as a fallback if browser automation is blocked

**Cons**:
- Tesco's internal APIs are undocumented and could change without notice
- Authentication tokens/cookies may be hard to obtain and maintain programmatically
- Tesco may use anti-bot protections on their API layer (Akamai, Cloudflare, etc.)
- CORS and session management add complexity
- More upfront investigation time to map the API surface

**Risk level**: Medium-High. The unknowns are larger, but the payoff (speed, reliability) is higher if it works.

**Architect's rationale**: This is the more architecturally elegant solution. If the spike reveals clean internal APIs during the browser automation investigation, we should capture that knowledge. But do not start here -- start with Approach 1 and observe the network traffic while doing so.

**Programmer's rationale**: Agreed -- investigate this as a secondary output of Approach 1. While running Playwright, keep the network tab open (or use Playwright's request interception) to catalogue the API calls. If they look clean, we can consider switching to direct API calls in the actual MVP build. Do not spend spike time building a standalone API client.

### Approach 3: Browser Extension

**How it works**: Build a Chrome/Firefox extension that runs in the context of the user's own authenticated Tesco browser session. The extension injects a script that can call Tesco's internal APIs using the user's existing cookies/session.

**Pros**:
- Sidesteps the authentication problem entirely (user is already logged in)
- Runs in the user's real browser context -- no bot detection concerns
- Access to the same APIs the Tesco web app uses
- No headless browser overhead

**Cons**:
- Requires the user to install a browser extension (friction)
- Extension and main app need a communication mechanism (e.g., WebSocket, native messaging)
- More complex architecture (two-part system: web app + extension)
- Extension store policies may block it (though side-loading is fine for personal use)
- Harder to test and debug

**Risk level**: Low-Medium (technically sound but architecturally complex for a POC).

**Architect's rationale**: This is the most robust solution from a bot-detection perspective, but adds architectural complexity that is inappropriate for a first spike. Keep it as a fallback if Approach 1 fails due to bot detection.

**Programmer's rationale**: Agreed as a fallback, but not for the spike. The communication bridge between the web app and the extension is non-trivial and the spike should focus on proving basket manipulation works at all, not on solving the communication problem.

### Approach 4: Hybrid -- Playwright with Request Interception

**How it works**: Use Playwright to handle authentication and navigation, but intercept and catalogue all network requests. If we discover clean API patterns, gradually replace browser interactions with direct API calls, using Playwright only for auth token acquisition.

**Pros**:
- Best of both worlds: start with the certainty of browser automation, evolve toward API efficiency
- Natural investigation path (Approach 1 naturally feeds into Approach 2)
- Playwright's `route()` API makes request interception trivial

**Cons**:
- Slightly more complex spike code
- Risk of scope creep (trying to do too much in the spike)

**Risk level**: Low-Medium.

**Architect's rationale**: This is the ideal long-term architecture, but for the spike, simply having Playwright log all requests is sufficient. Do not try to build the hybrid in the spike.

**Programmer's rationale**: Use Playwright's `page.on('request')` and `page.on('response')` to log all network traffic during the spike runs. This gives us the API intelligence for free. No extra build effort required.

### Recommended Investigation Order

| Priority | Approach | Spike effort | Goal |
|----------|----------|-------------|------|
| 1 | Browser automation (Playwright) | Primary build | Prove we can add an item to the basket |
| 2 | API observation (passive) | Zero extra effort | Capture network traffic while running Approach 1 |
| 3 | Browser extension | Only if Approach 1 fails | Fallback if bot detection blocks Playwright |
| 4 | Direct API client | Post-spike | Only if API observation reveals clean endpoints |

---

## Concrete Spike Steps

### Step 1: Manual exploration

- Open tesco.com/groceries in Chrome with DevTools Network tab open
- Log in manually. Observe:
  - What URL handles login? (`/login`, OAuth redirect, etc.)
  - Is there 2FA? CAPTCHA? What triggers it?
  - What cookies/tokens are set after login?
- Search for a product (e.g., "semi-skimmed milk"). Observe:
  - What XHR/fetch calls are made?
  - What does the search API request/response look like?
  - What URL pattern do product pages follow?
- Add an item to the basket. Observe:
  - What API call is made when "Add" is clicked?
  - What payload is sent? (product ID, quantity, session token?)
  - What does the response look like?
- **Document all findings** in a structured format

### Step 2: Project setup

- Initialise a Node.js project in the spike directory
- Install Playwright: `npm init -y && npm install playwright`
- Install TypeScript: `npm install -D typescript @types/node tsx`
- Create a basic spike script: `spike.ts`

### Step 3: Login automation

- Write a Playwright script that:
  - Launches Chromium in headed mode (visible, for debugging)
  - Navigates to the Tesco login page
  - Fills in email and password (from environment variables, not hardcoded)
  - Submits the login form
  - Waits for successful login (check for a known post-login element)
  - Handles any cookie consent banners
- If 2FA/CAPTCHA appears:
  - Try headed mode with a manual pause for user to solve it
  - Document the frequency and conditions that trigger it
- **Log all network requests** using `page.on('request')` and `page.on('response')`

### Step 4: Product search automation

- Extend the script to:
  - Navigate to the grocery search page
  - Enter a search term (e.g., "semi-skimmed milk")
  - Wait for search results to load
  - Extract product information from the results (name, price, product ID)
  - Select the first result
- Test with multiple search terms to understand result quality

### Step 5: Add to basket

- Extend the script to:
  - Click the "Add" button on a product
  - Wait for the basket count to update
  - Navigate to the basket page
  - Verify the item appears in the basket
  - Extract basket state (items, quantities, total)
- Run the full flow 3 times to confirm repeatability

### Step 6: Network traffic analysis

- Review the logged network requests from all runs
- Identify the key API endpoints:
  - Search API: URL, method, headers, params, response format
  - Add-to-basket API: URL, method, headers, payload, response
  - Basket state API: URL, method, response
- Document whether these APIs look stable enough to call directly

### Step 7: Edge cases and robustness

- Test with different product types:
  - Branded product: "Heinz baked beans"
  - Generic ingredient: "onions"
  - Quantity-specific: "500g chicken breast"
- Test failure scenarios:
  - What happens when the product is not found?
  - What happens when the product is out of stock?
  - What happens if the session expires mid-flow?
- Test bot detection:
  - Run the script 5 times in succession
  - Try headless mode -- does it still work?
  - Does Tesco block or challenge us?

### Step 8: Document findings and go/no-go recommendation

- Update this spike document with results
- Fill in the "Spike Results" section below
- Make a clear go/no-go recommendation

---

## What We Expect to Learn

| Question | Why it matters |
|----------|---------------|
| Can Playwright navigate Tesco without being blocked? | Determines if browser automation is viable at all |
| How does Tesco authentication work? | Needed to design the auth flow in the MVP |
| Does Tesco use 2FA/CAPTCHA, and when? | Determines if fully automated login is possible |
| What do Tesco's internal APIs look like? | May enable a more robust direct-API approach |
| How does Tesco's search work? | Needed for ingredient-to-product mapping |
| What is the add-to-basket API/interaction? | Core mechanism the MVP depends on |
| How fragile are the selectors? | Determines maintenance burden of browser automation |
| Does headless mode trigger different behaviour? | Determines if we can run without a visible browser |

### Potential Blockers (Spike-Killers)

| Blocker | Likelihood | If it happens |
|---------|------------|---------------|
| Tesco blocks all automation (aggressive bot detection) | Low-Medium | Try browser extension approach (Approach 3) |
| Login requires unsolvable CAPTCHA every time | Low | Try persistent session / cookie reuse between runs |
| Tesco changes UI weekly, making selectors unreliable | Low | Pivot to direct API approach if APIs look stable |
| No way to identify products in basket after adding | Very Low | Use Playwright screenshots as verification |

---

## Risks and Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Bot detection blocks Playwright | High impact, Medium likelihood | Use headed mode, realistic timing, persist browser context between runs. Fallback to browser extension approach. |
| Tesco UI restructure breaks selectors | Medium impact, Medium likelihood | Use resilient selectors (data-testid, aria labels, text content) rather than CSS class names. Log API calls as backup path. |
| 2FA/CAPTCHA on every login | High impact, Low likelihood | Persist auth cookies/session between runs. If CAPTCHA is rare, manual solve + cookie reuse is acceptable for POC. |
| Session expiry during basket fill | Low impact, Medium likelihood | Detect session expiry, re-authenticate, retry. For POC, acceptable to require fresh login. |
| Tesco Terms of Service violation | Acknowledged risk | User has accepted this risk for a personal POC. This is not a commercial product. |

---

## Spike Results

*To be filled in after the spike is executed.*

### Login
- [ ] Manual login via Playwright works
- [ ] Cookie/session persistence works between runs
- [ ] 2FA/CAPTCHA frequency: ___
- [ ] Headless mode: works / blocked

### Product Search
- [ ] Search by product name works
- [ ] Search results are parseable (product name, ID, price)
- [ ] Search quality for generic ingredients: good / acceptable / poor

### Add to Basket
- [ ] Adding a single item works
- [ ] Basket state is verifiable
- [ ] Multiple items in sequence works
- [ ] Repeatability: ___ / 3 attempts succeeded

### API Observations
- [ ] Search API endpoint: ___
- [ ] Add-to-basket API endpoint: ___
- [ ] Auth mechanism: ___
- [ ] Direct API approach viable: yes / maybe / no

### Bot Detection
- [ ] Headed mode: blocked / not blocked
- [ ] Headless mode: blocked / not blocked
- [ ] Rate limiting observed: yes / no
- [ ] CAPTCHA frequency: ___

### Go / No-Go
- [ ] **GO**: Proceed with MVP using [approach]
- [ ] **NO-GO**: Tesco automation is not feasible because ___
- [ ] **CONDITIONAL GO**: Feasible with caveats: ___

---

## Attribution

| Decision | Decided by | Rationale |
|----------|------------|-----------|
| Playwright over Selenium | Programmer | Modern API, better TypeScript support, built-in auto-waiting, actively maintained |
| Start with browser automation, not API reverse-engineering | Architect | Most proven path; prior art (tesco-selenium) validates concept; lower unknowns |
| Passive API observation during browser automation | Architect + Programmer | Zero-cost intelligence gathering; logs API calls during Playwright runs for free |
| Browser extension as fallback only | Architect + Programmer | Architecturally sound but too complex for initial spike; only pursue if bot detection blocks Approach 1 |
| Environment variables for credentials | Programmer | Never hardcode credentials, even in a POC spike |
| Headed mode first, headless later | Programmer | Easier to debug; avoids bot detection; test headless as a Day 3 edge case |
| Success = 3 consecutive successful runs | Architect | One success could be luck; three proves repeatability |
| Log all network traffic | Architect + Programmer | Essential reconnaissance for potential API-direct approach in MVP |

---

## Technical Notes

### Prior Art
- **tesco-selenium** (GitHub: CamzBarber/tesco-selenium): Python + Selenium project that adds items to a Tesco basket. Validates the browser automation concept. Uses Tesco product IDs, not search. Likely outdated selectors but proves the approach worked historically.
- **Tesco Labs API** (deprecated): Tesco previously offered an official API that supported basket manipulation. This API is no longer available, which is why browser automation is necessary.

### Research Findings
- tesco.com returns HTTP 403 to non-browser HTTP clients (e.g., `curl`, `fetch` without browser headers), confirming some level of bot protection is active
- Third-party scraping services (Apify, Actowiz) exist for Tesco product data, suggesting scraping is feasible but requires real browser contexts
- Tesco likely uses Akamai or similar CDN-level bot protection (common for UK retailers)
- Playwright's `browserContext.storageState()` can persist cookies/session between runs, which may help avoid repeated CAPTCHA/2FA challenges

### Spike Code Location
All spike code should be placed in `delivery/mvp/spikes/tesco-integration/` as a self-contained Node.js project. This is throwaway code -- it does not need to meet production quality standards, but should be readable enough to inform the real implementation.
