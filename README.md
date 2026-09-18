# John's Plumbing Services — WEDE5020 Portfolio of Evidence

A six-page, hand-coded, mobile-first website for a fictional plumbing business in
Pretoria. Built with HTML5 and CSS3 only — no frameworks, no JavaScript.

**Student:** Asemahle · Diploma in Software Development · The IIE Rosebank College
**Module:** WEDE5020 — Web Development · Part 2

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
├── js/                   Reserved for Part 3 — empty, the site needs no JavaScript
├── private/              Documentation, never linked from a page
│   ├── Website Proposal 1.docx
│   ├── Website Proposal 2.docx
│   ├── Site Map (Detailed).docx
│   ├── Wireframes.docx
│   ├── Site_Map.docx
│   └── wireframes/       Ten wireframe source files (SVG + PNG)
└── Screenshots/          Browser evidence
```

## Technical summary

- **Semantic HTML5** — `header`, `nav`, `main`, `section`, `article`, `aside`,
  `figure`/`figcaption`, `address`, `time`, `details`/`summary`, `fieldset`/`legend`,
  `table` with `caption`/`thead`/`scope`.
- **One external stylesheet** at `css/style.css`, written mobile first.
- **Four breakpoints** — 36em (576px), 48em (768px), 64em (1024px), 80em (1280px).
  One column on phones, two at 48em, three or four at 64em.
- **Relative units** — `rem` for type, `em` for component padding, `%` and `ch` for
  widths. No fixed pixel layout values.
- **Responsive images** — `srcset` and `sizes` on every content image.
- **No JavaScript** — the mobile menu, the accordions and form validation are all
  native HTML and CSS.
- **Accessibility** — skip link, visible keyboard focus, labelled controls,
  `prefers-reduced-motion` and `prefers-contrast` support.

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
assignment. Photographs are placeholders to be replaced with the student's own
images.
