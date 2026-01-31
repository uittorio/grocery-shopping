# MVP Idea: Recipe-to-Basket for Tesco

## Summary

A web application where users manage a personal library of recipes (each with a list of ingredients), select recipes for the week, and trigger an automated process that adds all the corresponding grocery items to their Tesco online basket. The MVP focuses on the core loop: **recipes in, Tesco basket out**.

---

## Agent Contributions

### Product Owner -- Scope and Priorities

**Core problem to solve**: Families waste 20-40 minutes each week manually searching for and adding grocery items to their Tesco online basket. They rotate through roughly the same 10-20 recipes but must re-find and re-add items every time. The MVP must eliminate this repetitive manual work.

**MVP feature set (user stories)**:

1. **As a user, I want to create a recipe with a name and a list of ingredients, so that I can build my personal recipe library.**
   - Acceptance criteria: User can add a recipe with a name and at least one ingredient. Ingredients have a name and a quantity. Recipes are persisted across sessions.

2. **As a user, I want to browse and select recipes for my upcoming shop, so that I can build a shopping list from my chosen meals.**
   - Acceptance criteria: User sees all saved recipes. User can select/deselect multiple recipes. A combined ingredient list is generated from the selected recipes.

3. **As a user, I want the system to add all selected ingredients to my Tesco online basket, so that I don't have to search and add items manually.**
   - Acceptance criteria: System maps ingredient names to Tesco products. Items appear in the user's Tesco basket. User receives confirmation of what was added (and what failed, if any).

**What to cut (post-MVP)**:
- Multiple grocery store support (Tesco only for MVP)
- Ingredient quantity aggregation and de-duplication across recipes (nice-to-have, not essential for v1)
- Meal planning / calendar view
- Sharing recipes between users
- Smart substitutions (e.g., out-of-stock alternatives)
- Dietary preferences and filtering
- Price comparison
- Purchase history / "re-order last week"
- Mobile app (web-only for MVP)

**Success criteria**:
- A user can go from "I want to cook these 3 recipes this week" to "my Tesco basket is filled" in under 2 minutes
- At least 80% of ingredients are correctly matched to Tesco products
- Users report the tool saves them meaningful time vs. manual shopping

**Key assumptions**:
- Families do rotate through a stable set of recipes
- Ingredient names map reasonably well to Tesco search results
- Users are willing to do some initial setup (entering recipes) for ongoing time savings
- Tesco's website/API allows programmatic basket manipulation

### Designer -- User Experience

**Proposed user flow (3 screens)**:

1. **Recipe Library screen** -- List of all saved recipes. Each recipe shows its name and ingredient count. A prominent "Add Recipe" button. Tap a recipe to view/edit it.

2. **Recipe Detail / Edit screen** -- Recipe name at the top. List of ingredients (name + quantity). Add/remove ingredients inline. Save button.

3. **Weekly Shop screen** -- Checklist of recipes with checkboxes. A "Fill My Basket" call-to-action button at the bottom. After triggering, a progress/result view showing which items were added and any that need manual attention.

**Key UX decisions**:
- **Minimal friction onboarding**: No account creation required initially. Recipes stored locally (or with minimal auth). The first experience should be: add one recipe, fill basket, see the magic.
- **Mobile-first responsive web**: Busy parents often plan meals on their phones. The layout must work well on small screens.
- **Clear feedback loop**: When "Fill My Basket" runs, users must see real-time feedback -- what's being added, what succeeded, what needs attention. No silent failures.
- **Ingredient input should be forgiving**: Free-text ingredient entry (not a rigid structured form). Users think "2 chicken breasts" not "protein: chicken, cut: breast, qty: 2".

**Accessibility considerations**:
- Large touch targets for mobile use
- Clear contrast ratios
- Screen reader support for recipe lists and status updates
- No reliance on colour alone for success/failure indicators

### Architect -- Technical Feasibility

**High-level architecture recommendation**:

- **Frontend**: Single-page web application (React or similar). Handles recipe management UI and triggers the basket-fill process.
- **Backend**: Lightweight API server handling recipe storage and orchestrating the Tesco integration.
- **Tesco integration**: This is the highest-risk component. Two possible approaches:
  1. **Browser automation** (Puppeteer/Playwright): Automate a headless browser to search Tesco's website and add items to basket. Requires the user to authenticate with Tesco somehow.
  2. **Tesco API** (if available): Use Tesco's official or undocumented APIs directly. More reliable but may not exist or may require partnership.

**Key technical risks and trade-offs**:

| Risk | Severity | Mitigation |
|------|----------|------------|
| Tesco has no public API for basket manipulation | High | Investigate browser automation as fallback; start with a spike on Tesco integration |
| Browser automation is fragile (Tesco UI changes break it) | Medium | Abstract the Tesco integration behind an interface so it can be swapped; invest in monitoring |
| User authentication with Tesco | High | MVP may need the user to provide Tesco session cookies or credentials; this has security and UX implications |
| Ingredient-to-product mapping accuracy | Medium | Start with simple keyword search; accept imperfect matching in MVP; show users what was matched |

**Recommendation for MVP**: Start with a **technical spike on the Tesco integration** before building any UI. If we cannot reliably add items to a Tesco basket programmatically, the entire MVP premise is at risk. This spike should be the first thing built.

**Architecture principles for MVP**:
- Keep it simple: monolith is fine, no microservices
- Abstract the grocery store integration behind a clear interface (so future stores can be added)
- Prefer boring technology: proven libraries, minimal infrastructure
- Design for replaceability, not extensibility

### Programmer -- Buildability Assessment

**What's buildable quickly**:
- Recipe CRUD (create, read, update, delete) -- straightforward, 1-2 days
- Recipe selection and ingredient aggregation -- straightforward, 1 day
- Simple web UI with a component library -- 2-3 days

**What's hard and needs a spike**:
- **Tesco basket integration** is the unknown. This needs investigation first. Options:
  - Check if Tesco has a public/partner API
  - Inspect Tesco's web app for internal APIs (XHR calls during "add to basket")
  - Build a browser extension that runs in the user's authenticated Tesco session (avoids authentication problem entirely)
  - Use Playwright to automate a headless browser

**Proposed tech stack for MVP**:
- TypeScript throughout (frontend + backend)
- React for the frontend (widely known, fast to prototype)
- Node.js/Express or Fastify for the backend API
- SQLite or JSON file storage for recipes (no need for a database server in MVP)
- Playwright for Tesco automation (if we go the browser automation route)
- Vitest for testing

**Build order recommendation**:
1. **Week 1**: Tesco integration spike -- can we programmatically add items to a basket? This is the make-or-break question.
2. **Week 2**: Recipe management backend + basic UI
3. **Week 3**: Connect the dots -- recipe selection triggers basket fill. End-to-end flow working.
4. **Week 4**: Polish, error handling, edge cases, basic testing

**Alternative MVP shape** (if Tesco automation proves too hard): Generate a **shopping list** that the user can quickly copy-paste or use alongside the Tesco website. Less magical but still valuable and shippable.

### User Persona -- Validation and Feedback

**Perspective**: As a busy parent of two who does a weekly Tesco shop...

**What resonates**:
- "Yes! I make the same 15-ish dinners on rotation. Every Sunday I spend 30 minutes adding the same stuff to my Tesco basket. It's tedious."
- "I'd absolutely spend 20 minutes entering my recipes once if it saved me time every week after that."
- The core value proposition is strong and immediately understandable.

**Concerns and honest feedback**:
- "How do I log into Tesco through this? I don't want to give my Tesco password to a third-party app. That feels risky."
- "What if the app picks the wrong product? I want Tesco Finest chicken, not the value range. Can I control that?"
- "Sometimes I already have ingredients at home (leftover onions, half a bag of rice). Can I remove items before filling the basket?"
- "I don't just buy recipe ingredients -- I also need milk, bread, snacks, toilet paper. Does this handle non-recipe items?"

**Scenarios that must work well**:
1. First-time use: "I enter 3 recipes, select them all, hit go, and see my Tesco basket fill up. That's the wow moment."
2. Weekly routine: "It's Sunday. I pick 5 recipes for the week, hit go, then manually add my extras (milk, snacks) on Tesco."
3. Adjustment: "I selected Spaghetti Bolognese but I still have tinned tomatoes from last time. I want to uncheck tomatoes before filling."

**What would make me NOT use this**:
- If I have to enter ingredients in a very specific format
- If the Tesco login process is clunky or feels insecure
- If the wrong products get added and I have to fix everything manually anyway
- If it's slower than just doing it myself

---

## MVP Scope

### In Scope

| Feature | Description |
|---------|-------------|
| Recipe management | Create, view, edit, delete recipes with ingredients (name + quantity) |
| Recipe selection | Select multiple recipes for a shopping session |
| Ingredient review | View combined ingredient list before filling basket; remove individual items |
| Tesco basket fill | Programmatically add selected ingredients to user's Tesco basket |
| Result feedback | Show what was added successfully and what needs manual attention |

### Explicitly Out of Scope

| Feature | Reason for deferral |
|---------|-------------------|
| Multiple grocery stores | Tesco-only keeps scope manageable; abstraction layer allows future expansion |
| Ingredient de-duplication/aggregation | Complex logic (e.g., merging "2 onions" from two recipes); defer to v2 |
| Meal planning / calendar | Not needed for core value proposition |
| Recipe sharing between users | Social features add complexity with no core value |
| Smart substitutions | Requires product catalog intelligence; too complex for MVP |
| Dietary preferences | Filtering/tagging adds scope without core value |
| Price comparison | Out of scope per product non-goals |
| Mobile native app | Responsive web is sufficient for MVP |
| Non-recipe items (staples) | Users can add these directly on Tesco after basket is filled |
| User accounts / cloud sync | Local storage or minimal auth is sufficient for a single-user MVP |

---

## Key Assumptions

1. **Tesco integration is technically feasible** -- We can programmatically add items to a Tesco basket (via API, browser automation, or extension). This is unvalidated and is the highest-risk assumption. *(Architect, Programmer)*
2. **Families rotate through a stable recipe set** -- The product assumes users have ~10-20 recipes they repeat. If users constantly try new recipes, the setup cost may not pay off. *(Product Owner)*
3. **Ingredient-to-product mapping works well enough** -- Simple keyword search on Tesco will match most ingredients to reasonable products. *(Architect, Programmer)*
4. **Users will invest in initial setup** -- Entering recipes upfront is a barrier; we assume users accept it for ongoing savings. *(User Persona)*
5. **Single-user use case is sufficient for MVP** -- We assume one person manages the shopping; no shared household recipe libraries needed yet. *(Product Owner)*

---

## Open Questions

1. **Tesco integration approach**: What is the most viable way to interact with Tesco's basket? API, browser automation, or browser extension? **Action: Technical spike needed before committing to MVP plan.** *(Architect, Programmer)*
2. **Authentication flow**: How does the user authenticate with Tesco through our app? What are the security implications? Will users trust this? *(Architect, User Persona)*
3. **Product matching quality**: How accurate is Tesco search for ingredient names? What happens when multiple products match? Should the user pick from options, or do we auto-select the top result? *(Designer, User Persona)*
4. **Ingredient format**: How structured should ingredient input be? Free text is user-friendly but harder to parse and match. *(Designer, Programmer)*
5. **Fallback if Tesco automation fails**: If programmatic basket fill proves unreliable, is a "smart shopping list" (without auto-fill) still valuable enough as an MVP? *(Product Owner, User Persona)*
6. **Legal/ToS considerations**: Does automating Tesco basket interactions violate their terms of service? *(Architect)*

---

## Recommended Next Steps

1. **Tesco integration spike** (Programmer + Architect, 2-3 days): Investigate and prototype programmatic basket manipulation. This is the go/no-go gate for the MVP as defined.
2. **User validation** (Product Owner + User Persona): Talk to 3-5 actual users. Validate the recipe rotation assumption and willingness to enter recipes.
3. **Design the 3-screen flow** (Designer): Create low-fidelity wireframes for Recipe Library, Recipe Detail, and Weekly Shop screens.
4. **Decision point**: Based on spike results, commit to an approach (full automation, browser extension, or shopping list fallback) and begin build.
