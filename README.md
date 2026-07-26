# Ark Peanuts — Website

A static storefront for Ark Peanuts, a Kenyan brand selling all-natural roasted nuts, nut butters, and brittles. Built as plain HTML/CSS/JavaScript with no build step and no backend — everything runs in the browser.

## File Structure

```
├── index.html          Main page (all sections + modal markup)
├── style.css            All styling, incl. dark mode
├── index.js              All interactivity (cart, modals, filtering, etc.)
├── robots.txt            Crawl rules for search engines
├── sitemap.xml           Sitemap for search engines
├── favicon.svg
├── logo/
│   └── Arkpeanuts-hero-section-img.png
└── nuts/
    ├── cashewnut Butter .png
    ├── Roasted Peanuts .png
    ├── Sesame brittles.png
    └── Peanut Butter.png
```

## Features

- **Storefront** — hero section, shop-by-category, best sellers, about, why-choose-us, product benefits, bulk orders, customer reviews, FAQ, shipping policy, returns policy, contact form
- **Dark mode** — toggle in the nav, respects system preference on first visit, remembered afterward
- **Product detail modal** — image gallery with thumbnails, size/weight variants with live pricing, quantity stepper, star ratings, and per-product reviews
- **Category filtering** — real filtering driven by actual product data (Nut Butters / Roasted Peanuts / Brittles), composable with text search
- **Cart** — persists across page reloads and browser sessions
- **Checkout** — delivery details form, payment method selection (M-Pesa / Card / Cash on Delivery), live order summary with area-based delivery fee, Kenyan phone number + email validation
- **Order tracking** — order history view with a 3-stage delivery status (Processing → Out for Delivery → Delivered) computed from real elapsed time since the order was placed
- **Accounts** — sign up / log in (front-end only)
- **Accessibility** — every modal traps keyboard focus, restores focus on close, uses proper ARIA roles/labels; toast notifications are screen-reader announced; visible focus outline for keyboard navigation
- **SEO** — meta description, canonical link, Open Graph + Twitter card tags, JSON-LD structured data for the business (Store schema) and each product (price, availability, ratings), `robots.txt` + `sitemap.xml`
- **Performance** — hero image prioritized for fast first paint, all below-the-fold images lazy-loaded, font preconnect hints

## Deployment

This is a static site with no build step. Upload all files to your web host so that `index.html` sits at the root of whatever URL you want to serve (e.g. `yourdomain.com/index.html`). `robots.txt` and `sitemap.xml` **must** be at that same root — they won't work in a subfolder.

Keep all file names exactly as they are, including case and spacing (some image filenames have spaces, e.g. `nuts/cashewnut Butter .png`).

## Before Going Live — Checklist

A few things were left as clearly-marked placeholders during development. **Do these before launching:**

- [ ] **Replace the placeholder domain.** `https://arkpeanuts.co.ke` is used as a stand-in throughout `index.html` (meta tags, canonical link, Open Graph, structured data) and in `robots.txt` / `sitemap.xml`. Search and replace it with your real domain everywhere.
- [ ] **Replace placeholder product ratings and reviews.** The `rating`, `reviewCount`, and `reviews` fields in the `products` array in `index.js` are made-up demo content. These currently also feed into the JSON-LD structured data — shipping fake reviews as structured data violates Google's guidelines and can get a live site penalized. Replace with real numbers before launch.
- [ ] **Add real product photos.** Each product's `images` array currently repeats the same single photo 3 times as a gallery placeholder. Add real multi-angle/lifestyle shots and update the array.
- [ ] **Decide on a backend if you want real accounts, real order storage, or real payments.** See limitations below.

## Known Limitations

This is a front-end-only build. A few things to be aware of:

- **Accounts, cart, and order history all live in the browser's `localStorage`.** They are per-device and per-browser — nothing syncs across devices, and clearing browser data erases everything. Account passwords are stored in plain text, which is fine for a demo but not appropriate for handling real customer accounts.
- **Checkout does not process real payments.** Placing an order generates a mock order number and simulates success — there's no real M-Pesa STK push, card processing, or order transmitted to you. You'll need a backend (and a payment gateway integration) for that to be real.
- **Order "delivery status" is a timer, not real tracking.** It's calculated from elapsed time since the order was placed vs. an estimated delivery window — it does not reflect an actual courier's real-time location or status.
- **No server-side validation.** All form validation (phone, email, required fields) happens in the browser and can be bypassed by anyone directly editing requests — fine for UX, not a substitute for backend validation if you build one.

## Browser Support

Built for modern evergreen browsers (Chrome, Firefox, Safari, Edge — desktop and mobile). Relies on CSS custom properties, `backdrop-filter`, `IntersectionObserver`, and the Web Storage API, all widely supported but not available in very old browsers (e.g. IE11).