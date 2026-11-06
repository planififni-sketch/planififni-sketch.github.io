# Camping Morocco public developer site

Static website for the Camping Morocco Android app.

- Home: https://planififni-sketch.github.io/
- Privacy: https://planififni-sketch.github.io/privacy.html
- Terms: https://planififni-sketch.github.io/terms.html
- Delete account: https://planififni-sketch.github.io/account-deletion.html
- Published from `main` at `/(root)` via GitHub Pages settings.

**Release notes**: The privacy/terms text is aligned with the current Camping Morocco production API legal pages (V4), and the account deletion button points to the actual production deletion route. Reconcile both pages with the actual V4.1 app and Google Play Data Safety before public OAuth branding verification.

**OAuth and domain ownership**: a public GitHub Pages site does not by itself establish ownership of `github.io` or guarantee that Google OAuth brand verification accepts a shared subdomain; verify the property in Google Search Console and check authorized-domain restrictions. A custom domain may be necessary.

**AdMob**: no `app-ads.txt` is published yet because no real AdMob publisher line has been supplied. Check the official app-ads.txt host/subdomain crawler behavior and create the file only after registering the app and confirming a verified developer website.

No SDKs, cookies, analytics, ad requests or sign-in features are included on this static website.

Official Google Play listing: https://play.google.com/store/apps/details?id=ma.campingmorocco.app
Support email: bisapp.ink@outlook.com
The official Camping Morocco app logo is served from `/assets/camping-morocco-logo.webp` across the website.

## Five-language localization (2026-11-06)

The shared `site-i18n.js` provides complete translated Home, Privacy, Terms and Account Deletion content in Arabic (`ar`), French (`fr`), German (`de`) and Spanish (`es`) in addition to the English fallback. The site selects the visitor's first supported browser/system-preferred language via `navigator.languages`, and uses English if none matches. Every page has an accessible language selector (including Auto/system). Manual preference is saved in browser `localStorage` when available, and shareable `?lang=ar|fr|de|es|en` links override that setting. Arabic sets HTML `lang=ar` and `dir=rtl` and uses RTL-specific CSS. Navigation persists the selection across internal legal pages. JavaScript-disabled browsers retain the original English HTML, so OAuth crawlers and Search Console verification see meaningful content. No account or application data is transmitted by localization. Keep the Google Search Console HTML verification file in place.
