# CMS Dynamic Content Integration Scratch Pad

## 1. Analysis of CMS Structure
Based on `docs/cms-page-content-structure.json` and the user's API response sample:
- **API Endpoint**: `NEXT_PUBLIC_DOMAIN_NAME/api/landing-content/full`
- **Response Format**:
  ```json
  {
    "success": true,
    "data": {
      "about": { ... },
      "contact": { ... },
      "home": { ... },
      "shared": {
        "footer": { ... },
        "forms": {
          "emailLaunchForm": { ... }
        }
      }
    }
  }
  ```

## 2. Todo List
- [ ] Create `src/types/cms.ts` to define the structure of the CMS response.
- [ ] Create `src/context/CMSContentContext.tsx` to handle fetching and state management of CMS data.
- [ ] Wrap `src/app/layout.tsx` with `CMSContentProvider`.
- [ ] Refactor `src/app/page.tsx` (Home Page) to consume `CMSContentContext`.
- [ ] Refactor `src/components/Footer.tsx` to consume `CMSContentContext`.
- [ ] Update `src/components/EmailLaunchForm.tsx` to use dynamic API settings from the CMS.
- [ ] Verify other components in `src/app/page.tsx` (like `LifelineCarousel`, `Carousel3D`, `GuidesSection`) and see if they need to be dynamic as well.

## 3. Implementation Details

### CMS Content Context
- Fetch data on mount.
- Provide `loading`, `error`, and `content` (data.home, data.shared.footer, etc.).
- Use `process.env.NEXT_PUBLIC_DOMAIN_NAME` for the API call.

### Home Page Refactoring
- Hero section: headline, description, background video.
- Delayed Emergency Response: stats cards, titles.
- Building Section: carousel cards.
- Lifeline Section: feature cards.
- Coming Soon: image, title, subtitle.
- Testimonials: items (if included in API).
- Live Impact Updates: items.
- Instagram Reels: items.
- Guides & Resources: items.
- Community Section: texts and form settings.

### Footer Refactoring
- Brand info, quick links, contact info, social links, newsletter settings.
