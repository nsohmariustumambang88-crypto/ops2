# Pet shipping: drafts with recommendations

Status: DRAFT with recommended values. Nothing is built or published yet.
Written for: you (the business owner) to confirm. Values marked **Recommended** are my suggestions from the research; change any of them. Items marked **Legal review** must be checked by a lawyer or your insurer before the policy goes live.

---

## 0. Decisions at a glance

| Decision | Recommended | Why (from research) |
|---|---|---|
| Species | **All animals.** Dogs and cats are the most common and have the most established rules. Every other species is reviewed before we quote, because rules differ by species. | Protected species need permits before acceptance (for example CITES-listed species). Crate and enclosure rules differ for birds and reptiles, so those requests are checked one by one. |
| Routes | International air cargo for all routes. Cabin travel on request, small dogs and cats only. | Airlines decide cabin acceptance and size limits, so cabin should be quoted per request, not promised. |
| Cancellation | See section 3. Free more than 14 days before pickup. | Competitors use a $50 fee plus costs already incurred (Jetpets). Refunds in 5 to 7 business days are standard. |
| Rabies window | **At least 30 days** before travel, or the destination's required period if longer. | Sources give 21 to 30 days. 30 is the safer default. **Your draft has [3] days. I recommend changing it to 30.** A 3-day window would not meet the timing the sources describe. |
| Cancellation email | Your single service mailbox. Suggested: admin@opslogistics.com, the address the app already uses. **Please confirm.** | One mailbox covers every service, so no new address is needed. |
| Crate photo upload | Optional at launch. | Helps us check crates early, but adds upload work. |
| Document checklist on shipments | Yes, add it to the admin shipment page. | Each check in the research (microchip, rabies, certificate, endorsement) needs a record before dispatch. |

---

## 1. Pet shipping page (`/pet-shipping`)

**Placement:** new service page. Link it from the SHIP dropdown ("Learn more" column), the footer SERVICES list, the home page service cards, and the blog guide. [Recommended]

**SEO**
- **Title tag:** Pet Shipping and Pet Relocation | OPS Logistics
- **Meta description:** Ship your pet or animal internationally. Crate rules, microchip and rabies timing, health certificates and airline checks, with a clear quote request.
- **H1:** Ship your pet with OPS Logistics
- **Primary keywords:** pet shipping, ship a dog internationally, pet relocation, ship a cat abroad, animal shipping
- **Secondary keywords:** pet air cargo, pet export paperwork, crate requirements for pets
- **Structured data:** FAQPage markup for the FAQ at the bottom, so questions can appear in search results.

**Headline:** Ship your pet with OPS Logistics

**Intro:**
Moving an animal across a border takes planning. We transport all animals, and we handle transport, crate checks and tracking. The paperwork depends on your destination, and we confirm exactly what it needs before we book.

**What we carry**
- All animals, by air cargo. Dogs and cats are the most common and have the most established rules.
- Other species (birds, reptiles, small mammals and more) are reviewed one by one before we confirm, because each has its own crate, enclosure and permit rules.
- Cabin travel on request, for small dogs and cats, if the airline allows it.
- International moves from our origin hubs. Domestic moves: not at launch.

**Crate requirements**
- Your pet must be able to stand, turn around and lie down comfortably.
- The floor must be solid and leakproof, with handles on the long side.
- The door must lock securely on all sides.
- Food and water containers must be reachable from outside the crate.
- Snub-nosed breeds (such as bulldogs and pugs) usually need a larger crate, and some airlines will not carry them as cargo.
- One pet per crate. Two small pets under 14 kg may share a crate, but the airline decides.

Not sure your crate qualifies? Send a photo and its measurements with your request.

**Paperwork checklist**
1. **Microchip.** A 15-digit ISO microchip, fitted before any rabies vaccination.
2. **Rabies vaccination.** At least 30 days before travel, or longer if your destination requires it. Some countries also need a blood test (titer) and a waiting period after it.
3. **Health certificate.** Issued by a licensed veterinarian close to departure. For US exports the vet must be USDA-accredited, and APHIS endorses the certificate.
4. **Import or export permits.** Required by some countries, and protected species need permits. We confirm which apply.
5. **Airline acceptance.** Each airline adds its own rules. We check this before we confirm.

Start early. Some destinations need 6 to 12 months of preparation.

**Not sure what your destination needs?** Tell us where your pet is going and we will send the exact checklist.

**[Get a pet shipping quote]** links to the form on this page (`#quote`).

**Before you book**, read the [Pet shipping policy](/pet-shipping-policy).

**FAQ (for search and for visitors)**
- *How long before travel should I start?* 6 to 12 months for strict destinations, 1 to 3 months for simpler moves.
- *Can my dog fly in the cabin?* Only small dogs and cats, and only if the airline allows it. We quote this per request.
- *Do you ship birds or reptiles?* Yes. Each species is reviewed before we confirm, because crate and permit rules differ.
- *Do you give sedation?* We do not recommend it for air travel. See the policy.
- *What if my destination changes its rules?* We check the rules again before we confirm, and tell you if anything changes.

---

## 2. Pet quote form (`/pet-shipping#quote`)

**Placement:** on the pet shipping page, below the checklist. Submits to `/api/enquiries` with kind `pet`. Lands in Contact Forms in the admin panel. Converts to a Pet shipment with Type = Pet once accepted.

**Submit button:** Send pet request

**Confirmation message:** Thank you. A member of our team will confirm what your pet needs and whether the airline will accept your crate. This is a request, not a booking.

**Section 1: Your details**
| Field | Type | Required |
|---|---|---|
| Full name | text | yes |
| Email | email | yes |
| Phone | tel | yes (needed for pickup) |
| Company | text | no |

**Section 2: Your pet**
| Field | Type | Required | Notes |
|---|---|---|---|
| Pet's name | text | yes | |
| Species | select: dog, cat, bird, reptile, small mammal, other (describe) | yes | Any species is accepted. Anything other than dog or cat is reviewed before we quote. |
| Breed | text | no | Snub-nosed breeds are flagged for crate size |
| Sex | select: unknown, male, female | no | |
| Date of birth | date | no | |
| Weight (kg) | number | yes | |
| Microchip number | text | no | 15 digits if known |
| Crate type | select: hard IATA-style, soft carrier (cabin only), other enclosure (we confirm), we supply | yes | Birds and reptiles usually need a species-specific enclosure |
| Crate size (L x W x H cm) | text | yes | |
| Crate photo | file upload | no | Optional at launch |

**Section 3: The journey**
| Field | Type | Required | Notes |
|---|---|---|---|
| Collect from (address and city) | text | yes | |
| Deliver to (address, city and country) | text | yes | |
| Preferred pickup date | date | yes | |
| Travel in | select: cargo (hold), cabin (small pets, on request) | yes | |
| Purpose | select: relocation, adoption, show or breeding, medical, other | yes | |
| Health certificate | select: not yet, yes | yes | |
| Rabies vaccination date | date | no | |
| Import or export permit number | text | no | |
| Veterinarian name and phone | text | no | |

**Section 4: Care notes**
| Field | Type | Required |
|---|---|---|
| Feeding, medication and temperament | textarea | no |
| Pickup access (gate code, parking, stairs) | textarea | no |

**Section 5: Agreement**
- [ ] I have read the Pet shipping policy.
- [ ] I understand that airlines can refuse a pet at check-in and that destination rules apply.

---

## 3. Pet shipping policy (`/pet-shipping-policy`)

**Placement:** linked from the pet shipping page, the footer HELP list, and the quote form. [Recommended]

**SEO:** indexable, with a clear title: Pet Shipping Policy | OPS Logistics. Meta description: cancellation, refund, health and liability terms for shipping pets with OPS Logistics.

**Legal review: required before publishing.**

**1. What a request is**
A pet shipping request is an enquiry, not a booking. We confirm each shipment in writing after we check destination requirements, airline acceptance and the crate.

**2. Airline and destination rules**
- Airlines and destination countries set their own rules. We cannot override them.
- An airline may refuse a pet, crate or booking at check-in or before departure. If this happens, we will rebook where possible, and refund any amount you paid for services we did not deliver.
- Health certificates and permits must be issued by the veterinarian or authority named in the destination's rules. We check paperwork before dispatch, but we are not responsible for the content of documents a veterinarian issues.

**3. Cancellations and refunds (Recommended)**
| When you cancel | What happens |
|---|---|
| More than 14 days before pickup | Full refund, less a $50 fee |
| 7 to 14 days before pickup | Refund of 50% of the booking, less costs already spent (crate, veterinary, testing) |
| Less than 7 days before pickup, or after the pet is collected | Costs already spent are kept. No further refund. |
| We cancel, or the airline cancels, or the flight is delayed by more than 4 hours | Full refund, or rebooking at no extra charge |

- Cancel in writing to [SINGLE SERVICE MAILBOX, suggested admin@opslogistics.com].
- Refunds are paid within 7 business days to the original payment method. Competitors quote 5 to 7 days, so 7 gives a small margin.

**4. Health and welfare**
- We do not recommend sedation for air travel. Sedatives can affect breathing and body temperature. If you give your pet sedation, tell us in advance so we can record it.
- Pets with breathing problems (snub-nosed breeds) may be refused by airlines for cargo travel. We will tell you before you pay.
- You are responsible for your pet's health, vaccinations and fitness to travel.

**5. Liability (Legal review)**
- Recommended wording to review: our liability for loss, injury or death of a pet is limited to [amount agreed with your insurer] and applies only where we or our agents were negligent.
- We are not liable for delays, refusals or losses caused by airlines, border authorities or veterinarians, except where the law requires us to be.
- Confirm with your insurer that pet transport is covered before publishing this section.

**6. Your information**
We use the details you send only to arrange the shipment. See our [Privacy policy](/privacy-policy).

---

## 4. Blog guide (published from the admin panel, kind `blog`)

**Placement:** blog, with a link from the pet shipping page. [Recommended]

**SEO**
- **Title:** How to prepare your pet for international shipping
- **Meta description:** Microchips, rabies timing, crate rules and health certificates explained, so your pet flies without delays.
- **Target query:** how to ship a pet internationally. Long-tail queries such as "microchip before rabies vaccine" also come from this guide.
- **Internal links:** to the pet shipping page, the quote form and the policy.

**Summary:** A step-by-step guide to microchips, vaccinations, crates and paperwork before your pet flies.

**Body**

Moving a pet abroad is mostly about timing. Most delays come from doing the steps in the wrong order.

**Start with the microchip.** Your pet needs a 15-digit ISO microchip, fitted before the rabies vaccination. If the vaccine comes first, the certificate may be treated as invalid, and the vaccination has to be repeated. That can add months.

**Then the rabies vaccination.** Plan at least 30 days between the vaccine and departure, or longer if your destination requires it. Some countries also require a blood test to check the vaccine has worked, followed by a waiting period.

**Get the crate right first.** Airlines check crates at the counter. Your pet should be able to stand, turn around and lie down. The floor should be solid and leakproof, and the door should lock securely. Measure your pet, then check the airline's size chart before buying.

**Book the health certificate close to departure.** Most countries want a certificate from a vet within a few days of travel. For US exports, the vet must be USDA-accredited and APHIS endorses the certificate. Some countries have their own forms, and some want an exam within 24 hours of departure.

**Check the destination early.** Requirements change. Look up your destination's official agriculture or veterinary authority and check again a few weeks before travel.

**Check the airline.** Some airlines will not carry snub-nosed breeds as cargo, and some restrict breeds or sizes. Ask before you book.

**Plan your timeline.** For strict destinations, start six to twelve months ahead. For simpler moves, one to three months may be enough.

Contact us and we will confirm what your destination needs before you book.

---

## 5. Admin: pet document checklist

**Placement:** a checklist on each Pet shipment's admin page, saved on the shipment. [Recommended]

- [ ] Microchip number recorded (15 digits, ISO)
- [ ] Microchip fitted before rabies vaccination (confirmed from vet record)
- [ ] Rabies vaccination date recorded and at least 30 days before travel
- [ ] Titer test done and waiting period passed (if the destination needs it)
- [ ] Health certificate issued within the required days of departure
- [ ] USDA endorsement (for US exports)
- [ ] Import or export permit (if required)
- [ ] Crate measured and approved
- [ ] Airline acceptance confirmed in writing
- [ ] Pickup and handover confirmed with the owner

---

## 6. SEO plan for the pet service

**Why it helps the site:** pet relocation is a clear, searchable need with specific questions. Pages that answer those questions match more searches, and each answer leads visitors toward the quote form.

**Pages and what each one targets**
| Page | Main search intent | Priority |
|---|---|---|
| `/pet-shipping` | "pet shipping services", "ship a dog internationally" | High |
| `/pet-shipping-policy` | "pet shipping refund policy" (supports trust and the first query) | Medium |
| Blog guide | "how to ship a pet abroad", "microchip before rabies" | High (long tail) |

**Internal linking**
- SHIP dropdown: add "Pet shipping" under "Learn More".
- Footer SERVICES: add "Pet shipping".
- Home page service cards: add a pet shipping card.
- Each page links to the quote form and to the other pages in this set.

**Technical**
- One H1 per page, with the primary keyword.
- Unique title and meta description per page.
- FAQPage structured data on the pet shipping page.
- Add the new pages to a sitemap. The site may not have one yet, so check before building.

**Content to avoid**
- Promises the airline controls, such as guaranteed cabin travel or guaranteed acceptance.
- Specific rabies or export timings for named countries unless they are checked against official sources. Send readers to the official authority instead.

**Measure it**
- Track enquiries from the pet quote form in the admin Contact Forms list.
- Check search performance for the pet pages in Search Console after launch. Expect one to three months before it moves.

---

## 7. What the research supports (sources)

- Crate rules: [pettravel.com](https://www.pettravel.com/Airline_Pet_Container_Requirements.cfm), [IATA container requirements](https://www.iata.org/contentassets/b0016da92c86449f850fe9560827bbea/pet-container-requirements.pdf)
- Refund practice: [Jetpets terms](https://www.jetpets.com.au/media/pdf/CSSU-FORM-008-Terms-and-Conditions-Domestic-v1.00-Feb20.pdf) ($50 fee, 5 to 7 day refunds), [Smart Avia](https://flysmartavia.com/en/info/passenger/services/pets/) (full refund for delays of 30 minutes or more)
- Export paperwork: [USDA APHIS](https://www.aphis.usda.gov/nvap/reference-guide/animal-movement/international), [APHIS pet travel FAQ](https://www.aphis.usda.gov/pet-travel/us-to-another-country-export/frequently-asked-questions-about-traveling-your-pet)
- Microchip and rabies timing: [Starwood Pet](https://www.starwoodpet.com/blog/the-pet-passport-checklist-10-things-to-do-before-moving-abroad-with-your-pet), [Pet Relocation](https://www.petrelocation.com/learn/shipping-pets-overseas). These are relocation-company sources, so verify each destination with its official agriculture authority.

**Note on the sources:** the rabies window differs between sources (21 days in one, 30 in another), and the refund figures come from other companies' terms. Treat them as benchmarks, not rules.

---

## 8. Confirm before I build

Reply "yes" to accept all of the recommendations above, or list the ones to change. Specifically, please confirm:
1. **Rabies window:** 30 days (recommended) instead of the [3] in your draft.
2. Confirm the single service mailbox for cancellations and enquiries (suggested: admin@opslogistics.com). No new mailbox is needed.
3. Send the liability section to a lawyer or your insurer before the policy goes live.
