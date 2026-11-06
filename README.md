# John's Plumbing Services WEDE5020 Portfolio of Evidence

A six-page, hand-coded, mobile-first website for a fictional plumbing business in
Pretoria. Built with HTML5 and CSS3, enhanced in Part 3 with JavaScript (jQuery and Leaflet).

**Student:** Asemahle · Diploma in Software Development ·
**Module:** WEDE5020: Web Development · Part 2

---

## Live pages

| Page | File | What it does |
|---|---|---|
| Home | `index.html` | Hero, emergency notice, three service highlights, booking process, testimonials |
| About | `about.html` | Story, mission and values, four team profiles, service area, credentials accordion |
| Services | `services.html` | Jump navigation, six service articles with anchors, full price table |
| Gallery | `gallery.html` | Six captioned job photographs |
| Contact | `contact.html` | Office and emergency details, enquiry form, FAQ accordion |
| Booking | `booking.html` | Four-step booking form with a sticky sidebar |

## Folder structure

```
WEDE5020-ASEMAHLE/
├── index.html            Home
├── about.html            About
├── services.html         Services and prices
├── gallery.html          Work gallery
├── contact.html          Contact and enquiry form
├── booking.html          Booking form
├── README.md             This file
├── TASK-GUIDE.md         The five work packages, hour by hour
├── css/
│   └── style.css         The single external stylesheet, linked by all six pages
├── images/               Photographs and logo, exported at several widths for srcset
├── js/                   Part 3 scripts: main, services, gallery, forms, map, data
│   └── vendor/           jQuery 3.7.1 and Leaflet 1.9.4, served locally
├── robots.txt            Crawler rules
├── sitemap.xml           All six pages for search engines
├── private/              Documentation, never linked from a page
│   ├── Website Proposal 1.docx
│   ├── Website Proposal 2.docx
│   ├── Site Map (Detailed).docx
│   ├── Wireframes.docx
│   ├── Site_Map.docx
│   └── wireframes/       Ten wireframe source files
└── Screenshots/          Browser evidence
```

## Technical summary

- **Semantic HTML5**: `header`, `nav`, `main`, `section`, `article`, `aside`,
  `figure`/`figcaption`, `address`, `time`, `details`/`summary`, `fieldset`/`legend`,
  `table` with `caption`/`thead`/`scope`.
- **One external stylesheet** at `css/style.css`, written mobile first.
- **Four breakpoints**: 36em (576px), 48em (768px), 64em (1024px), 80em (1280px).
  One column on phones, two at 48em, three or four at 64em.
- **Relative units**: `rem` for type, `em` for component padding, `%` and `ch` for
  widths. No fixed pixel layout values.
- **Responsive images**: `srcset` and `sizes` on every content image.
- **Accessibility**: skip link, visible keyboard focus, labelled controls,
  `prefers-reduced-motion` and `prefers-contrast` support.

## Part 3: JavaScript, SEO, forms

- **Interactive elements** (`js/main.js`): animated accordion (FAQ, credentials), tabs
  (services), modals (call-out terms, email preview), scroll-in animations, back-to-top,
  open-now badge, share links.
- **Map** (`js/map.js`): Leaflet and OpenStreetMap on `contact.html`, with a service-area toggle.
- **Gallery** (`js/gallery.js`): category filter, search and a keyboard-friendly lightbox.
- **Dynamic content** (`js/services.js`, `js/data.js`): the services list is built from data with
  search, category filter and price sort; extra reviews load on the home page.
- **Forms** (`js/forms.js`): HTML5 attributes plus JavaScript validation, inline error messages,
  honeypot, and AJAX submission to the form's `action`.
  - `booking.html` is the service enquiry form. After validation it answers with an
    estimated cost and slot availability (availability is simulated).
  - `contact.html` compiles the message into an email and opens it in the visitor's mail app
    (recipient is the `data-recipient` attribute on the form).
  - The `action` URL is a public test endpoint (jsonplaceholder). Replace it with your own
    back end when you have one.
- **SEO**: title and description per page, canonical and Open Graph tags, one `h1` per page,
  JSON-LD `Plumber` data on the home page, `robots.txt`, `sitemap.xml`, internal links.
  Keyword research and the off-page plan are in `private/SEO-notes.md`.
- **Speed**: scripts use `defer`, hero image is preloaded, fonts use `display=swap`, images have
  width and height and lazy loading, libraries are served locally.
- **Security**: Content-Security-Policy meta tag, no inline scripts, user text inserted with
  `.text()` never `.html()`, `rel="noopener noreferrer"` on external links, honeypot and
  double-submit protection. GitHub Pages cannot set HTTP headers, so on a real host also add
  `X-Content-Type-Options`, `X-Frame-Options` and HTTPS-only (HSTS).

## Running it locally

No build step. Clone the repository and open `index.html` in a browser, or serve
the folder:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## File naming rules

All file names are lower case with hyphens. Linux servers — including GitHub Pages —
treat `Gallery.html` and `gallery.html` as different files, so a capital letter that
works on Windows becomes a 404 once the site is deployed.

CSS classes follow `.block`, `.block__element`, `.block--modifier` and `.is-state`.

## Attribution

Business, staff, prices and testimonials are fictional and created for this
assignment. 
