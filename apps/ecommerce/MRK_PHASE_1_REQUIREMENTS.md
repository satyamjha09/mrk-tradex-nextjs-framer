# MRK Website Phase 1 Requirements Lock

Use this file to lock the business, product, media, and copy decisions before frontend/backend changes begin.

Phase 1 goal: decide exactly what the MRK website should show, what user actions it should support, and what content/assets are available. No cart, checkout, backend, or frontend implementation should begin until the Phase 1 gates in section 14 are resolved.

## 0. Phase 1 Status

| Area | Status | Owner Input Needed |
| --- | --- | --- |
| Company identity | Partial | GST, YouTube, WhatsApp, Google Maps |
| Website behavior | Open | Confirm catalog/enquiry mode, language, dealer flow, downloads |
| Product data | Open | Final product list, specs, MRP, photos, manuals, videos |
| Content/media | Open | Testimonials, Hindi copy, downloadable files |
| Implementation readiness | Default implementation started | Placeholder MRK defaults are used until owner inputs are provided |

## 0.1 Recommended Direction

These are implementation recommendations, not final decisions.

| Decision | Recommendation | Reason |
| --- | --- | --- |
| Website mode | Catalog + enquiry, no cart | MRK requirements point to enquiry/dealer leads, not online checkout |
| Product CTA | Enquire Now, WhatsApp, Call, Become Dealer | Matches industrial/catalog buying behavior |
| Cart/checkout/payment | Hide from public site in Phase 2 | Safer than deleting working code immediately |
| Admin/auth | Keep if MRK needs product/lead management | Existing admin can be adapted |
| Dealer flow | Dealer application form + WhatsApp CTA | Useful now without needing a full dealer locator database |
| Downloads | Public catalog/manuals, lead-gated price list | Balances trust and lead capture |
| Hindi | English first, Hindi after copy is confirmed | Avoids blocking launch on translations |
| Testimonials | Defer unless real approved quotes are available | Better than using placeholder trust content |

## 0.2 Decision Log

| Decision | Current Value | Status | Notes |
| --- | --- | --- | --- |
| Website mode | Catalog + enquiry, no cart | Working Default | Owner can still change later |
| Public cart/checkout | Hide from public site | Working Default | Backend can remain until later cleanup |
| Product CTA | Enquire, WhatsApp, Call, Become Dealer | Working Default | Final wording can change later |
| Hindi MVP | English first, Hindi later | Working Default | Change if Hindi launch is required |
| Dealer flow | Dealer application form + WhatsApp CTA | Working Default | Searchable dealer list can be later |
| Downloads | Public catalog/manuals, lead-gated price list | Working Default | Needs final confirmation |
| Testimonials | Defer unless real quotes are ready | Working Default | Needs final confirmation |

## 1. Company Details

| Item | Required Value | Status | Notes |
| --- | --- | --- | --- |
| Company legal name | MRK Tradex Pvt Ltd | Confirmed | From content draft |
| Tagline | Water is life - and we fill your life with water. | Confirmed | English copy |
| Address | R/3A, Dooars Trp Compound, GT Road, Sahibabad, Ghaziabad, Uttar Pradesh 201005 | Confirmed | From content draft |
| Phone | +91 93197 19670 | Confirmed | From content draft |
| Email | rajesh.mrktradex@gmail.com | Confirmed | From content draft |
| GST number |  | Needed | Required for footer/contact/business trust |
| YouTube channel URL |  | Needed | Required for footer and Why MRK page |
| WhatsApp number/link |  | Needed | Confirm whether same as phone number |
| Google Maps embed/link |  | Needed | Required for Contact page |

## 2. Global Website Behavior

| Item | Decision Needed | Status | Notes |
| --- | --- | --- | --- |
| Website mode | Catalog + enquiry, no cart | Proposed | Content says every path ends in enquiry/dealer, not cart |
| Language support | English + Hindi toggle | Needed | Confirm if Hindi is required in MVP |
| Dealer finder | Static contact CTA or searchable dealer list | Needed | Backend scope depends on this |
| Downloads access | Public download or gated by lead form | Needed | Affects backend/data model |

## 3. Product Categories

| Category | Required Data | Status |
| --- | --- | --- |
| Single-Phase Starters | Product specs, MRP, photos, manuals | Partial |
| Three-Phase Panels | HP, MRP, photos, demo videos, manuals | Needed |
| WLC Smart Plugs | MRP, product photos, how-to videos | Needed |
| Cables & Accessories | Full item list, specs, MRP, photos | Needed |

## 4. Single-Phase Starter Product Data

The document says full data already exists for these models, but we still need to verify specs, MRP, photos, and manuals before implementation.

| Model | HP | Box Type | Meter Type | Start Cap | Run Cap | Max Load | MCB/Relay/OLP | Warranty | MRP | Photos | Manual | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PRH01B |  |  |  |  |  |  |  |  |  |  |  | Needed |
| PRH32B |  |  |  |  |  |  |  |  |  |  |  | Needed |
| PRH32B STD-MCB |  |  |  |  |  |  |  |  |  |  |  | Needed |
| PRH32B MCB Havells-P2 |  |  |  |  |  |  |  |  |  |  |  | Needed |
| PRH16A |  |  |  |  |  |  |  |  |  |  |  | Needed |
| PRH16A-MCB |  |  |  |  |  |  |  |  |  |  |  | Needed |
| BMH16A |  |  |  |  |  |  |  |  |  |  |  | Needed |
| MHD16A |  |  |  |  |  |  |  |  |  |  |  | Needed |
| PRD16A |  |  |  |  |  |  |  |  |  |  |  | Needed |
| MRG 16A |  |  |  |  |  |  |  |  |  |  |  | Needed |
| MRG 29A |  |  |  |  |  |  |  |  |  |  |  | Needed |
| MRG 30A |  |  |  |  |  |  |  |  |  |  |  | Needed |
| MHD 35A |  |  |  |  |  |  |  |  |  |  |  | Needed |
| MCP03H |  |  |  |  |  |  |  |  |  |  |  | Needed |
| MRG24A-AHD |  |  |  |  |  |  |  |  |  |  |  | Needed |

## 5. Newer Single-Phase Models Mentioned

| Model | HP | Specs | MRP | Photos | Manual | Include on Website? | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PRD01B-NEW |  |  |  |  |  | Yes / No | Needed |
| PRD32B-P2 |  |  |  |  |  | Yes / No | Needed |
| MRD16A |  |  |  |  |  | Yes / No | Needed |
| PRD16A-NEW |  |  |  |  |  | Yes / No | Needed |
| MBH16A |  |  |  |  |  | Yes / No | Needed |
| Other models |  |  |  |  |  |  | Needed |

## 6. Three-Phase Panel Data

| Model | Series | HP | MRP | Photos | Demo Video URL | Manual | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MRX 01 | DOL |  |  |  |  |  | Needed |
| MRX HD F04 | DOL |  |  |  |  |  | Needed |
| MRX HD F09 | Star-Delta |  |  |  |  |  | Needed |
| Other MRX models |  |  |  |  |  |  | Needed |

## 7. WLC Smart Plug Data

| Model | Voltage | Amp | Suitable For | MRP | Photos | How-To Video URL | Connection Steps Confirmed? | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SSO | 220V | 15A | Oil/water-filled submersible pumps to 1.5 HP |  |  |  | No | Needed |
| TSO | 220V | 15A | 1.5 HP tullu pumps |  |  |  | No | Needed |
| Wi-Fi | 220V | 15A | Pump, AC, or geyser to 15 amp |  |  |  | No | Needed |

## 8. Cables & Accessories

| Item Name | Type | Specs | MRP | Photos | Notes | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Submersible cable HT-5 | Cable |  |  |  |  | Needed |
| Sensor wire | Accessory |  |  |  |  | Needed |
| Steel fasteners | Accessory |  |  |  |  | Needed |
| Multiplug | Accessory |  |  |  |  | Needed |
| 16A 3-pin | Accessory |  |  |  |  | Needed |
| Other accessories |  |  |  |  |  | Needed |

## 9. Testimonials

Need 3 real testimonials with permission to publish.

| Person Name | Role | City | Quote | Photo Optional | Status |
| --- | --- | --- | --- | --- | --- |
|  | Dealer |  |  |  | Needed |
|  | Farmer |  |  |  | Needed |
|  | Homeowner |  |  |  | Needed |

## 10. Downloads

| Download Name | Type | File Provided? | Public/Gated | Status |
| --- | --- | --- | --- | --- |
| Product catalog | Catalog | No |  | Needed |
| Price list | Price list | No |  | Needed |
| Single-phase manuals | Manual | No |  | Needed |
| Three-phase manuals | Manual | No |  | Needed |
| WLC manuals | Manual | No |  | Needed |

## 11. Hindi Copy

| Page/Element | Hindi Copy Required? | Status | Notes |
| --- | --- | --- | --- |
| Global navigation | Yes / No | Needed | Confirm scope |
| Home page | Yes / No | Needed | Draft has sample lines only |
| Product category pages | Yes / No | Needed | Full translation/adaptation needed |
| Product detail pages | Yes / No | Needed | Product names may stay English |
| Dealer page | Yes / No | Needed | Important for lead generation |
| Contact page | Yes / No | Needed |  |

## 12. Phase 1 Completion Criteria

Phase 1 is complete when:

- GST number and YouTube link are confirmed.
- All product models to show on the website are finalized.
- Every visible product has at least one photo, MRP, and core specs.
- MRX and WLC video links are provided or explicitly deferred.
- Dealer/application flow is confirmed.
- Testimonials are provided or testimonial section is deferred.
- Downloads are provided or downloads page is changed to "coming soon".
- Hindi MVP scope is confirmed.

## 13. Phase 1 Input Form

Fill this section to close Phase 1.

```text
GST number:
YouTube URL:
WhatsApp number/link:
Google Maps link/embed:

Confirm website mode:
Catalog + enquiry, no cart? Yes / No

Confirm language scope:
English only / English + Hindi at launch / English now and Hindi later

Confirm dealer flow:
Static contact CTA / Dealer application form / Searchable dealer list / Dealer form + WhatsApp CTA

Confirm downloads:
Public / Lead-gated / Mixed / Coming soon

Final product categories:

Final product model list:

For every visible product, confirm:
MRP available? Yes / No
Core specs available? Yes / No
Photos available? Yes / No
Manual available? Yes / No
Video available or deferred? Yes / No / Deferred

Testimonials:
Use testimonials now? Yes / No / Defer

Hindi:
Hindi copy ready? Yes / No / Partial
```

## 14. Phase 1 Gates Before Phase 2

Phase 2 can begin only after these gates are answered.

| Gate | Required Answer | Status |
| --- | --- | --- |
| Business trust details | GST, YouTube, WhatsApp, Google Maps confirmed or intentionally deferred | Blocked |
| Business model | Catalog + enquiry vs e-commerce checkout confirmed | Blocked |
| Public actions | Product CTA set confirmed | Blocked |
| Product scope | Final categories and visible product models confirmed | Blocked |
| Product minimum data | Each visible product has specs, MRP, and at least one photo, or is deferred | Blocked |
| Downloads | Public, lead-gated, mixed, or coming soon confirmed | Blocked |
| Dealer flow | Contact CTA, application form, or dealer locator confirmed | Blocked |
| Hindi launch scope | English-only, bilingual launch, or Hindi later confirmed | Blocked |
| Testimonials | Real testimonials provided or section deferred | Blocked |

## 15. Immediate Next Action

Collect the missing owner inputs from section 13. After those answers are added, update each matching status from `Needed` or `Proposed` to `Confirmed`, `Deferred`, or `Out of Scope`.

## 16. Default Implementation Started

The first implementation pass uses the working defaults above so backend and frontend work can begin before final business content is available.

Implemented defaults:

- Public product flow is catalog/enquiry-first.
- Cart is hidden from public navigation and the cart page points users to catalog, WhatsApp, and call actions.
- Product detail pages submit enquiry leads.
- Contact and dealer application pages submit to MRK backend endpoints.
- Company constants use confirmed MRK name, tagline, address, phone, and email.
- GST, YouTube, Google Maps, final photos, manuals, videos, Hindi copy, and testimonials remain placeholders or deferred.
