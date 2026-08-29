# 🥭 Achar Wala — Product Requirements Document (PRD)
**Version:** 2.0 | **Date:** August 21, 2026 | **Owner:** Md. Imran

---

## 1. PROJECT OVERVIEW

### 1.1 Business Info

| Field | Details |
|---|---|
| Owner | Md. Imran |
| Brand | Achar Wala (আচার ওয়ালা) |
| Tagline (BN) | মায়ের হাতের স্বাদ, প্রতি বয়ামে ভালোবাসা |
| Tagline (EN) | Mother's handmade taste, love in every jar |
| Location | Khulna, Bangladesh |
| Mobile | 01410-003630 |
| WhatsApp | 01780-337772 → https://wa.me/8801780337772 |
| Facebook | https://www.facebook.com/acharwalakhulna |
| Website | acharwala.shop |
| Payment | Cash on Delivery (COD) only — NO online payment |
| About (BN) | ঘরে মায়ের হাতে তৈরি সুস্বাদু ও স্বাস্থ্যসম্মত আচার। আমাদের সকল আচার সম্পূর্ণ প্রিজারভেটিভমুক্ত। |
| About (EN) | Homemade, healthy and tasty pickles made by mother's hands. All pickles are 100% preservative-free. |

### 1.2 Delivery Charges

| Area | Charge | zone value (in code) |
|---|---|---|
| Inside Khulna (খুলনার ভিতরে) | ৳80 | inside_khulna |
| Outside Khulna — All Bangladesh (খুলনার বাইরে — সারা বাংলাদেশ) | ৳150 | outside_khulna |

---

## 2. TECH STACK & CREDENTIALS

### 2.1 Services

| Service | Purpose | Plan | Cost |
|---|---|---|---|
| GitHub Pages | Frontend hosting (index.html, admin.html) | Free | ৳0 |
| Supabase | Database, Auth, Storage | Free (500MB DB + 1GB Storage) | ৳0 |
| Firebase FCM | Push Notifications to Admin | Free Spark Plan | ৳0 |
| PWABuilder | Convert Admin Panel to APK | Free | ৳0 |
| Domain | acharwala.shop | Annual renewal | ~৳1000/year |

### 2.2 Supabase Credentials

| Key | Value |
|---|---|
| Project URL | https://jlvhukkyvrgestjuazra.supabase.co |
| Anon Key | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impsdmh1a2t5dnJnZXN0anVhenJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyODkzNzUsImV4cCI6MjEwMjg2NTM3NX0.7P20aJ8EDRgSd4Zm9yhYj2lB6-491yDUk6KJORKavoM |
| Project ID | jlvhukkyvrgestjuazra |

### 2.3 Firebase Credentials

| Key | Value |
|---|---|
| Project Name | achar-wala |
| API Key | AIzaSyCYv4oW83jo9ZVcJbyXjasnqdA9h3pttyw |
| Auth Domain | achar-wala.firebaseapp.com |
| Project ID | achar-wala |
| Storage Bucket | achar-wala.firebasestorage.app |
| Messaging Sender ID | 83891655859 |
| App ID | 1:83891655859:web:024651eb1f328afe714cc6 |
| VAPID Key | BGVjvfAFpO176jBM3GWNUISbfRrXzT_M9lAEvTJyH9RHpJPx3f7Zxb9MUz-B_impVuI730ah5P52Pyu6rQHuhis |

---

## 3. FILE STRUCTURE (GitHub Repository)

**Repository name:** acharwala-shop (hosted via GitHub Pages)

```
acharwala-shop/
├── index.html                  → Main user website (product browsing + ordering)
├── admin.html                  → Admin panel (orders + product management) — keep URL secret
├── firebase-messaging-sw.js    → Firebase Service Worker for push notifications (must be at root)
├── manifest.json               → PWA manifest (app name, icons, start_url for APK)
├── sw.js                       → Main Service Worker (PWA offline support)
└── icons/
    ├── icon-192x192.png
    └── icon-512x512.png
```

---

## 4. SUPABASE DATABASE SCHEMA

### 4.1 `products` Table

| Column | Type | Required | Default | Description |
|---|---|---|---|---|
| id | UUID | Auto | gen_random_uuid() | Primary Key |
| name_bn | TEXT | ✅ Yes | — | Product name in Bangla |
| name_en | TEXT | No | — | Product name in English |
| category_bn | TEXT | ✅ Yes | — | Category in Bangla (e.g. আমের আচার) |
| category_en | TEXT | No | — | Category in English (e.g. Mango Pickle) |
| original_price | NUMERIC | ✅ Yes | — | Original price (৳) |
| discount_price | NUMERIC | No | NULL | Discounted price — if NULL, no discount shown |
| image_url | TEXT | No | — | Supabase Storage public URL |
| description_bn | TEXT | No | — | Product description in Bangla |
| description_en | TEXT | No | — | Product description in English |
| is_available | BOOLEAN | Auto | true | If false → hidden from website (not deleted) |
| sort_order | INTEGER | Auto | 0 | Controls display order on website |
| created_at | TIMESTAMPTZ | Auto | now() | Auto timestamp |

**Discount Display Logic:**
- If `discount_price` is NOT NULL and < `original_price` → show `original_price` with ~~strikethrough~~ + `discount_price` in golden (#C17F24) color + discount badge showing percentage off
- If `discount_price` is NULL → show only `original_price` normally, NO discount badge
- Discount percentage calculation: `Math.round(((original_price - discount_price) / original_price) * 100)` → e.g. "২০% ছাড়"

### 4.2 `orders` Table

| Column | Type | Required | Default | Description |
|---|---|---|---|---|
| id | UUID | Auto | gen_random_uuid() | Primary Key |
| order_number | SERIAL | Auto | — | Sequential order number (#1, #2, #3...) |
| customer_name | TEXT | ✅ Yes | — | Customer full name |
| customer_phone | TEXT | ✅ Yes | — | Customer mobile number |
| customer_email | TEXT | No | — | Email (optional) |
| customer_address | TEXT | ✅ Yes | — | Full delivery address |
| delivery_zone | TEXT | ✅ Yes | — | inside_khulna / outside_khulna |
| delivery_charge | NUMERIC | ✅ Yes | — | 80 or 150 |
| items | JSONB | ✅ Yes | — | Array of ordered products |
| subtotal | NUMERIC | ✅ Yes | — | Total product price (without delivery) |
| total | NUMERIC | ✅ Yes | — | Grand total (subtotal + delivery_charge) |
| status | TEXT | Auto | 'pending' | pending → confirmed → delivered |
| note | TEXT | No | — | Special note from customer |
| created_at | TIMESTAMPTZ | Auto | now() | Order timestamp |

**JSONB `items` field format:**
```json
[
  {
    "product_id": "uuid-here",
    "name_bn": "কাঁচা আমের আচার",
    "name_en": "Raw Mango Pickle",
    "quantity": 2,
    "unit_price": 280,
    "discount_price": 250,
    "total": 500
  }
]
```

### 4.3 `settings` Table

| key | value | description |
|---|---|---|
| delivery_inside_khulna | 80 | Delivery charge inside Khulna |
| delivery_outside_khulna | 150 | Delivery charge outside Khulna (all Bangladesh) |

### 4.4 Row Level Security (RLS) Rules

| Table | Action | Who | Rule |
|---|---|---|---|
| products | SELECT | Anyone (public) | `USING (true)` |
| products | INSERT / UPDATE / DELETE | Authenticated (admin) only | `auth.role() = 'authenticated'` |
| orders | INSERT | Anyone (public — customers place orders) | `WITH CHECK (true)` |
| orders | SELECT / UPDATE / DELETE | Authenticated (admin) only | `auth.role() = 'authenticated'` |
| settings | SELECT | Anyone (public) | `USING (true)` |
| settings | UPDATE | Authenticated (admin) only | `auth.role() = 'authenticated'` |
| storage (product-images) | SELECT | Anyone | Public read |
| storage (product-images) | INSERT / DELETE | Authenticated (admin) only | Admin only |

---

## 5. USER WEBSITE — index.html

### 5.1 Design System (from Reference Design)

#### 5.1.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| --primary | #1A4A2E | Navbar, buttons, headers, footer, CTA sections |
| --primary-light | #2D6B45 | Button hover states, lighter green accents |
| --primary-dark | #0F3520 | Footer background, deep sections |
| --secondary | #C17F24 | Prices, discount badges, golden highlights, decorative lines |
| --secondary-light | #D4A04A | Hover state for golden elements |
| --bg-cream | #F5F0E8 | Page background color |
| --bg-white | #FFFFFF | Card backgrounds, modals |
| --bg-section | #FBF7F0 | Alternate section backgrounds |
| --text-dark | #1A1A1A | Primary body text |
| --text-gray | #6B7280 | Secondary text, descriptions |
| --text-light | #FFFFFF | Text on dark backgrounds |
| --border | #E5E1D8 | Card borders, dividers |
| --shadow | rgba(0,0,0,0.08) | Card shadows |
| --status-red | #DC2626 | Pending status, warnings |
| --status-yellow | #F59E0B | Confirmed status |
| --status-green | #16A34A | Delivered status, success |

#### 5.1.2 Typography

| Element | Font | Size | Weight |
|---|---|---|---|
| Bangla Text | 'Hind Siliguri', sans-serif (Google Fonts) | — | — |
| English Text | 'Inter', sans-serif (Google Fonts) | — | — |
| Hero Heading | Hind Siliguri | 48px mobile / 64px desktop | 700 (Bold) |
| Section Heading | Hind Siliguri | 32px mobile / 40px desktop | 700 |
| Sub Heading | Hind Siliguri | 20px mobile / 24px desktop | 600 |
| Body Text | Hind Siliguri | 16px | 400 |
| Small Text | Hind Siliguri | 14px | 400 |
| Price Text | Hind Siliguri | 18px | 700 |
| Button Text | Hind Siliguri | 16px | 600 |

#### 5.1.3 Spacing & Layout

| Property | Value |
|---|---|
| Container Max Width | 1280px |
| Section Padding | 80px top/bottom (desktop), 48px (mobile) |
| Card Border Radius | 12px |
| Button Border Radius | 8px (regular), 50px (pill/CTA) |
| Card Shadow | 0 2px 12px rgba(0,0,0,0.08) |
| Card Shadow Hover | 0 4px 20px rgba(0,0,0,0.12) |
| Grid Gap | 24px |
| Mobile Padding | 16px sides |

#### 5.1.4 Component Styles

**Primary Button (Dark Green):**
- Background: #1A4A2E, Text: white, Padding: 12px 28px
- Hover: #2D6B45, transform: translateY(-2px)
- Border-radius: 50px (pill shape for CTA), 8px (regular)

**Secondary Button (Outlined):**
- Background: transparent, Border: 2px solid #1A4A2E, Text: #1A4A2E
- Hover: Background #1A4A2E, Text: white

**Golden Accent Button:**
- Background: #C17F24, Text: white
- Used for: discount badges, special CTAs

**Product Card:**
- White background, 12px border-radius, subtle shadow
- Image container: 1:1 aspect ratio, object-fit: cover, 8px top border-radius
- "Best Seller" badge: small golden tag at top-left of image (if applicable)
- Price: ৳ symbol + amount in bold, golden color for discount price
- Strikethrough for original price when discount exists
- "View Details" button + cart icon button at bottom
- Hover: card lifts slightly (translateY -4px), shadow increases

**Category Circle:**
- 120px diameter circle with subtle border
- Product image inside circle, object-fit: cover
- Category name below in Bangla
- Item count below name (e.g. "৫ প্রকার")
- Horizontal scroll on mobile with scroll-snap

#### 5.1.5 Animations (AOS Library)

| Section | Animation | Duration | Delay |
|---|---|---|---|
| Hero text | fade-right | 800ms | 0 |
| Hero image | fade-left | 800ms | 200ms |
| Feature icons | fade-up | 600ms | staggered 100ms each |
| Product cards | fade-up | 600ms | staggered 100ms each |
| Category circles | zoom-in | 500ms | staggered 50ms each |
| Story section image | fade-right | 800ms | 0 |
| Story section text | fade-left | 800ms | 200ms |
| Review cards | fade-up | 600ms | staggered 100ms each |
| CTA banner | fade-up | 800ms | 0 |

### 5.2 Page Sections (Top to Bottom — Detailed)

---

#### SECTION 1: Navbar (Sticky Top)

**Desktop Layout:**
```
[🥭 আচার ওয়ালা]   হোম   আমাদের আচার   আমাদের গল্প   যোগাযোগ   [BN|EN]   [WhatsApp এ অর্ডার করুন]   [🛒 0]
   মায়ের হাতের স্বাদ
```

**Mobile Layout:**
```
[🥭 আচার ওয়ালা]                    [🛒 0]  [☰]
```

| Element | Details |
|---|---|
| Logo | "আচার ওয়ালা" with pickle jar icon (SVG) + subtitle "মায়ের হাতের স্বাদ" |
| Nav Links | হোম, আমাদের আচার, আমাদের গল্প, যোগাযোগ — smooth scroll to sections |
| Language Toggle | BN / EN pill toggle — BN highlighted by default |
| WhatsApp Button | Green pill button → opens https://wa.me/8801780337772 |
| Cart Icon | Cart SVG icon with item count badge (red circle with number) |
| Mobile | Hamburger menu → slide-in drawer from right with all nav items |
| Sticky | `position: sticky; top: 0; z-index: 1000;` with white background + bottom shadow on scroll |

---

#### SECTION 2: Hero Section

**Layout:** Split — text left (60%), product image right (40%)

**Background:** Soft gradient cream with decorative green leaf elements at edges (CSS/SVG decoration)

| Element | Content (BN) | Content (EN) |
|---|---|---|
| Main Heading | মায়ের হাতের স্বাদ, প্রতি বয়ামে ভালোবাসা | Mother's handmade taste, love in every jar |
| Subtitle | ঘরে তৈরি সুস্বাদু ও স্বাস্থ্যসম্মত আচার। আমাদের সকল আচার সম্পূর্ণ প্রিজারভেটিভমুক্ত। | Homemade, healthy and tasty pickles. All our pickles are 100% preservative-free. |
| CTA Button 1 | WhatsApp এ অর্ডার → opens WhatsApp link | Order on WhatsApp |
| CTA Button 2 | আমাদের আচার দেখুন → scrolls to products section | View Our Pickles |
| Feature Tags | ঘরে তৈরি · প্রিজারভেটিভমুক্ত · পরিবারের রেসিপি · ভালোবাসায় তৈরি | Homemade · Preservative-free · Family Recipe · Made with Love |
| Right Image | Large pickle jar hero image with mango/leaf decorations |

---

#### SECTION 3: Features Bar (Full-width Dark Green Banner)

**Background:** #1A4A2E (primary dark green)
**Layout:** 4 columns (horizontal scroll on mobile)

| # | Icon | Title (BN) | Subtitle (BN) | Title (EN) | Subtitle (EN) |
|---|---|---|---|---|---|
| 1 | ✅ Checkmark SVG | ১০০% প্রিজারভেটিভমুক্ত | কোনো রাসায়নিক পদার্থ ব্যবহার করা হয়নি, সম্পূর্ণ প্রাকৃতিক | 100% Preservative-free | No chemicals used, completely natural |
| 2 | 👩‍🍳 Hands SVG | মায়ের হাতের রেসিপি | ঐতিহ্যবাহী পারিবারিক রেসিপি অনুসরণ করে প্রতিটি আচার তৈরি | Mother's Recipe | Traditional family recipe followed for every pickle |
| 3 | 📦 Package SVG | নির্ভরযোগ্য উপকরণ | ভালো ও তাজা উপকরণ দিয়ে তৈরি আচার, মানের সাথে কোনো আপোষ নেই | Quality Ingredients | Fresh ingredients, no compromise on quality |
| 4 | 🚚 Truck SVG | সারা দেশে ডেলিভারি | দ্রুত ও নিরাপদ ডেলিভারি সারা বাংলাদেশে | Nationwide Delivery | Fast and safe delivery across Bangladesh |

---

#### SECTION 4: Popular Products Section

**Heading:** "আমাদের জনপ্রিয় আচার" / "Our Popular Pickles"
**Sub-element:** Golden decorative underline below heading
**Right Link:** "সব দেখুন →" / "View All →" — scrolls to full product grid

**Layout:** Horizontal scrollable row on mobile, 4-5 column grid on desktop
**Data Source:** Supabase `products` table WHERE `is_available = true` ORDER BY `sort_order ASC, created_at DESC`

**Product Card Structure:**
```
┌──────────────────────┐
│ [Best Seller] badge   │  ← Only if admin marks as featured (optional)
│                      │
│   [Product Image]    │  ← 1:1 ratio, from image_url
│                      │
├──────────────────────┤
│ কাঁচা আমের আচার      │  ← name_bn / name_en
│                      │
│ ৳380  ৳280           │  ← original_price (strikethrough) + discount_price (golden)
│   OR                 │
│ ৳380                 │  ← only original_price if no discount
│                      │
│ [View Details] [🛒]  │  ← View opens modal, cart adds to order
└──────────────────────┘
```

**Discount Badge Logic on Card:**
- If `discount_price` exists → show red/golden badge "২০% ছাড়" at top-right of image
- Calculation: `Math.round(((original_price - discount_price) / original_price) * 100)` + "% ছাড়"

---

#### SECTION 5: Category Section

**Heading:** "আমাদের আচার সমূহ" / "Our Pickle Collection"

**Layout:** Horizontal scrollable row with scroll-snap
**Categories are derived from unique `category_bn` values in products table**

**Category Circle Component:**
```
    ╭──────╮
    │ IMG  │  ← Circle with category representative image
    ╰──────╯
  আমের আচার    ← category_bn / category_en
   ৫ প্রকার     ← count of products in this category
```

**Click Action:** Scrolls down to full product grid filtered by this category

**Category List:**
| # | Emoji | Category (BN) | Category (EN) | Count |
|---|---|---|---|---|
| 1 | 🥭 | আমের আচার | Mango Pickle | 5 |
| 2 | 🌿 | চালতার আচার | Chalta Pickle | 3 |
| 3 | 🍒 | বড়ই আচার | Jujube Pickle | 3 |
| 4 | 🍫 | তেঁতুলের আচার | Tamarind Pickle | 2 |
| 5 | 🫒 | জলপাই আচার | Olive Pickle | 3 |
| 6 | ⭐ | প্রিমিয়াম কালেকশন | Premium Collection | 2 |

---

#### SECTION 6: Premium Banner

**Layout:** Full-width dark green (#1A4A2E) banner with product image on right

```
┌─────────────────────────────────────────────────────┐
│  Premium আমসত্ত্ব ও গাবের আচার                      │
│  প্রিমিয়াম কোয়ালিটি, অনন্য স্বাদ                    │
│                                          [jar img]  │
│  [এখনই অর্ডার করুন →]    🏷 প্রিমিয়াম কোয়ালিটি      │
│                           🏅 সীমিত সংখ্যায়           │
└─────────────────────────────────────────────────────┘
```

| Element | Content (BN) | Content (EN) |
|---|---|---|
| Heading | Premium আমসত্ত্ব ও গাবের আচার | Premium Amsotto & Gaber Pickle |
| Subtitle | প্রিমিয়াম কোয়ালিটি, অনন্য স্বাদ | Premium quality, unique taste |
| CTA Button | এখনই অর্ডার করুন → | Order Now → |
| Badge 1 | প্রিমিয়াম কোয়ালিটি | Premium Quality |
| Badge 2 | সীমিত সংখ্যায় | Limited Edition |

---

#### SECTION 7: Our Story Section

**Layout:** Split — image left (50%) with golden overlay badge, text right (50%)

| Element | Content (BN) | Content (EN) |
|---|---|---|
| Image Badge | মায়ের ভালোবাসা ❤️ | Mother's Love ❤️ |
| Heading | আমাদের গল্প | Our Story |
| Decorative | Golden ornamental divider line below heading |
| Story Text | আচার ওয়ালার যাত্রা শুরু হয়েছিল আমাদের মায়ের হাতে রান্না করা আচার থেকে। প্রজন্মের পর প্রজন্ম ধরে আমাদের পরিবারে আচার তৈরির ঐতিহ্য চলে আসছে। খুলনার এই ছোট্ট পরিবার থেকে শুরু করে আজ আমরা সারা বাংলাদেশে আমাদের ঘরোয়া আচার পৌঁছে দিচ্ছি। প্রতিটি আচার তৈরি হয় মায়ের হাতের রেসিপি, প্রাকৃতিক উপকরণ ও ভালোবাসায়। প্রিজারভেটিভমুক্ত, স্বাস্থ্যসম্মত — এবং অবশ্যই অতুলনীয় স্বাদের। | Achar Wala's journey started from our mother's homemade pickles. For generations, pickle making has been a tradition in our family. Starting from this small family in Khulna, today we deliver our homemade pickles across Bangladesh. Every pickle is made with mother's recipe, natural ingredients and love. Preservative-free, healthy — and of course, incomparably delicious. |
| CTA Button | আরও জানুন → | Learn More → |

---

#### SECTION 8: Location Section

**Heading:** "আমাদের অবস্থান" / "Our Location"

| Element | Details |
|---|---|
| Location Text | খুলনা, বাংলাদেশ / Khulna, Bangladesh |
| Map | Google Maps embed iframe showing Khulna area |
| Map URL | `https://maps.google.com/maps?q=Khulna,Bangladesh&output=embed` |

---

#### SECTION 9: Customer Reviews (Testimonials)

**Heading:** "আমাদের গ্রাহকদের কথা" / "What Our Customers Say"

**Layout:** Horizontal slider/carousel with dots, auto-play every 5 seconds

**Review Card Structure:**
```
┌────────────────────────────┐
│  "  আচার ওয়ালার আচার       │  ← Opening quote mark (large golden ")
│     খেয়ে অনেক ভালো          │
│     লাগলো..."               │
│                            │
│  [Avatar] রাফিয়া সুন্দরবন   │  ← Name
│           ★★★★★            │  ← 5 stars in golden
└────────────────────────────┘
```

**Static Reviews (4 cards):**

| # | Name (BN) | Review (BN) |
|---|---|---|
| 1 | রাফিয়া সুন্দরবন | আচার ওয়ালার আচার খেয়ে সত্যিই অনেক ভালো লেগেছে। মায়ের হাতের স্বাদ যেন মনে হয়, খেলে মনে পড়বে। আরেকটু অর্ডার করেছি! |
| 2 | মাহমুদুর রহমান | অনেকদিন খুঁজেছিলাম ভালো মানের ঘরোয়া আচার। প্রিজারভেটিভমুক্ত এবং স্বাদে অসাধারণ। সবাইকে রিকমেন্ড করব! |
| 3 | সাবিনা আক্তার | পার্সেলটা পেয়ে খুব খুশি হলাম এবং প্যাকেজিং চমৎকার। প্রিজারভেটিভমুক্ত তাই খুব নিশ্চিন্তে পরিবারকে খাওয়াচ্ছি। |
| 4 | তানভীর ইমরান | আমের আচার খেয়ে মনে হলো বাড়ির আচার খাচ্ছি। দারুণ স্বাদ! প্যাকেজিং আর ডেলিভারিও ভালো। পরে আবার অর্ডার করবো! |

---

#### SECTION 10: CTA Banner (Full-width Green)

**Background:** #1A4A2E with subtle pattern overlay

```
┌─────────────────────────────────────────────────────────────┐
│  [আচার ওয়ালা logo]                                         │
│                                                             │
│  অর্ডার করতে অথবা যেকোনো প্রশ্নের জন্য যোগাযোগ করুন            │
│                                                             │
│  📱 WhatsApp: 01780-337772     📞 Phone: 01410-003630       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

Both numbers are clickable — WhatsApp opens wa.me link, Phone opens `tel:` link.

---

#### SECTION 11: Footer

**Background:** #0F3520 (darkest green)

**Layout:** 4 columns on desktop, stacked on mobile

| Column 1 | Column 2 | Column 3 | Column 4 |
|---|---|---|---|
| **আচার ওয়ালা** (Logo) | **দ্রুত লিংক** | **আমাদের আচার** | **যোগাযোগ** |
| খুলনা, বাংলাদেশ | হোম | আমের আচার ও চাটনি | 📞 01410-003630 |
| মায়ের হাতের স্বাদ | আমাদের আচার | চালতার আচার ও চাটনি | 📱 01780-337772 |
| | আমাদের গল্প | বড়ই আচার | 📍 WhatsApp এ মেসেজ করুন |
| [f] [yt] [ig] [wa] | যোগাযোগ | তেঁতুলের আচার | |
| | | জলপাই আচার | |
| | | প্রিমিয়াম কালেকশন | |

**Bottom Bar:**
```
© ২০২৬ আচার ওয়ালা। সর্বস্বত্ব সংরক্ষিত। | Developed by [Developer Name]
```

**Social Links:**
- Facebook → https://www.facebook.com/acharwalakhulna
- WhatsApp → https://wa.me/8801780337772

---

### 5.3 Shopping Cart System

#### 5.3.1 Cart Behavior

| Feature | Details |
|---|---|
| Cart Type | Slide-in drawer from right side (not a new page) |
| Add to Cart | Clicking 🛒 icon on product card → adds 1 unit, shows toast "পণ্য যোগ হয়েছে!" |
| Cart Badge | Red circle on cart icon in navbar showing item count |
| Storage | JavaScript `localStorage` — persists across page refresh |
| Open Cart | Click cart icon in navbar → drawer slides in |
| Close Cart | Click X button or click outside drawer |

#### 5.3.2 Cart Drawer Content

```
┌──────────────────────────┐
│ আপনার অর্ডার        [X]  │
├──────────────────────────┤
│                          │
│ কাঁচা আমের আচার          │
│ ৳250   [-] 2 [+]  [🗑]  │
│                          │
│ চালতার আচার              │
│ ৳380   [-] 1 [+]  [🗑]  │
│                          │
├──────────────────────────┤
│ সাবটোটাল:    ৳880       │
├──────────────────────────┤
│                          │
│ [অর্ডার সম্পন্ন করুন]     │  ← Opens checkout modal
│                          │
└──────────────────────────┘
```

**Cart Item Controls:**
- [-] / [+] buttons change quantity (min: 1)
- 🗑 button removes item from cart
- Price shows per-unit price × quantity
- If product has discount_price, use discount_price as unit_price

#### 5.3.3 Checkout Flow (Modal)

**Step 1 — Customer Information Form:**

| Field | Label (BN) | Label (EN) | Required | Validation |
|---|---|---|---|---|
| customer_name | আপনার নাম | Your Name | ✅ Yes | Min 3 characters |
| customer_phone | মোবাইল নম্বর | Mobile Number | ✅ Yes | 11 digits, starts with 01 |
| customer_email | ইমেইল (ঐচ্ছিক) | Email (Optional) | ❌ No | Valid email format if provided |
| customer_address | সম্পূর্ণ ঠিকানা | Full Address | ✅ Yes | Min 10 characters |
| delivery_zone | ডেলিভারি এলাকা | Delivery Area | ✅ Yes | Radio: খুলনার ভিতরে (৳80) / খুলনার বাইরে (৳150) |
| note | বিশেষ নোট (ঐচ্ছিক) | Special Note (Optional) | ❌ No | Max 500 characters |

**Step 2 — Order Summary (shown below form):**
```
┌──────────────────────────────────┐
│ অর্ডার সারাংশ                    │
│                                  │
│ কাঁচা আমের আচার    ×2    ৳500   │
│ চালতার আচার        ×1    ৳380   │
│                                  │
│ সাবটোটাল:               ৳880   │
│ ডেলিভারি (খুলনার ভিতরে):  ৳80    │
│ ─────────────────────────       │
│ সর্বমোট:                ৳960   │
│                                  │
│ 💰 পেমেন্ট: ক্যাশ অন ডেলিভারি    │
│                                  │
│ [অর্ডার নিশ্চিত করুন]            │
└──────────────────────────────────┘
```

**Step 3 — On Submit:**
1. Validate all required fields
2. Show loading spinner on button
3. Save order to Supabase `orders` table
4. On success → show success screen
5. On error → show error toast, keep form data

**Step 4 — Success Screen (replaces modal content):**
```
┌──────────────────────────────────┐
│                                  │
│         ✅ অর্ডার সফল!            │
│                                  │
│    আপনার অর্ডার নম্বর: #42       │
│                                  │
│  আমরা শীঘ্রই আপনার সাথে         │
│  যোগাযোগ করব।                   │
│                                  │
│  [WhatsApp এ মেসেজ করুন]         │ ← Pre-filled message with order details
│  [হোমে ফিরে যান]                 │
│                                  │
└──────────────────────────────────┘
```

**WhatsApp Pre-filled Message Format:**
```
🛒 নতুন অর্ডার — আচার ওয়ালা

অর্ডার নম্বর: #42
নাম: [customer_name]
মোবাইল: [customer_phone]
ঠিকানা: [customer_address]

পণ্য:
• কাঁচা আমের আচার ×2 = ৳500
• চালতার আচার ×1 = ৳380

সাবটোটাল: ৳880
ডেলিভারি: ৳80
সর্বমোট: ৳960

পেমেন্ট: ক্যাশ অন ডেলিভারি
```

---

### 5.4 Product Detail Modal

When user clicks "View Details" on a product card:

```
┌──────────────────────────────────────────┐
│                                    [X]   │
│  ┌──────────┐                            │
│  │          │  কাঁচা আমের সরিষার তেলের আচার │
│  │  IMAGE   │                            │
│  │          │  ক্যাটাগরি: আমের আচার       │
│  └──────────┘                            │
│                                          │
│  ৳350  ৳280  (২০% ছাড়)                  │
│                                          │
│  বিবরণ:                                  │
│  কাঁচা আমের সাথে সরিষার তেল ও মশলা       │
│  দিয়ে তৈরি ঐতিহ্যবাহী আচার...            │
│                                          │
│  সংখ্যা: [-] 1 [+]                       │
│                                          │
│  [কার্টে যোগ করুন 🛒]                     │
│  [WhatsApp এ অর্ডার করুন]                │
└──────────────────────────────────────────┘
```

---

### 5.5 Language Toggle (BN / EN)

| Feature | Details |
|---|---|
| Default | Bangla (BN) |
| Toggle | Pill button in navbar: [BN | EN] — active side highlighted |
| Method | JavaScript `data-bn` / `data-en` attributes on every translatable element |
| Product Data | Switches between `name_bn` / `name_en`, `description_bn` / `description_en`, `category_bn` / `category_en` |
| Persistence | Saved in `localStorage` — remembers on next visit |
| Missing EN | If `name_en` is null/empty for a product, show `name_bn` as fallback |

---

### 5.6 Responsive Breakpoints

| Breakpoint | Screen Width | Layout Changes |
|---|---|---|
| Mobile | < 640px | Single column, hamburger menu, horizontal scroll for products/categories |
| Tablet | 640px – 1024px | 2-column product grid, visible nav |
| Desktop | > 1024px | 4-5 column product grid, full nav, split hero layout |

---

## 6. PRODUCT LIST (Initial — 18 Products)

| # | Category (BN) | Category (EN) | Product Name (BN) | Product Name (EN) |
|---|---|---|---|---|
| 1 | আমের আচার | Mango Pickle | কাঁচা আমের সরিষার তেলের আচার | Raw Mango Pickle in Mustard Oil |
| 2 | আমের আচার | Mango Pickle | আমের টক-ঝাল-মিষ্টি আচার | Sweet & Sour Mango Pickle |
| 3 | আমের আচার | Mango Pickle | আমসত্ত্ব | Mango Leather (Amsotto) |
| 4 | আমের আচার | Mango Pickle | আমের চাটনি | Mango Chutney |
| 5 | আমের আচার | Mango Pickle | মিষ্টি আমের আচার | Sweet Mango Pickle |
| 6 | চালতার আচার | Chalta Pickle | চালতার টক-ঝাল-মিষ্টি আচার | Chalta Sweet & Sour Pickle |
| 7 | চালতার আচার | Chalta Pickle | চালতার মিক্স আচার | Chalta Mix Pickle |
| 8 | চালতার আচার | Chalta Pickle | চালতার চাটনি | Chalta Chutney |
| 9 | বড়ই আচার | Jujube Pickle | বড়ই টক-ঝাল-মিষ্টি আচার | Jujube Sweet & Sour Pickle |
| 10 | বড়ই আচার | Jujube Pickle | বড়ই মিষ্টি আচার | Sweet Jujube Pickle |
| 11 | বড়ই আচার | Jujube Pickle | বড়ই চাটনি (টক-ঝাল-মিষ্টি) | Jujube Chutney (Sweet & Sour) |
| 12 | তেঁতুলের আচার | Tamarind Pickle | তেঁতুলের টক-ঝাল-মিষ্টি আচার | Tamarind Sweet & Sour Pickle |
| 13 | তেঁতুলের আচার | Tamarind Pickle | তেঁতুলের চাটনি | Tamarind Chutney |
| 14 | জলপাই আচার | Olive Pickle | জলপাই আচার | Olive Pickle |
| 15 | জলপাই আচার | Olive Pickle | জলপাই তেলের আচার | Olive Oil Pickle |
| 16 | জলপাই আচার | Olive Pickle | জলপাই টক-ঝাল-মিষ্টি চাটনি | Olive Sweet & Sour Chutney |
| 17 | প্রিমিয়াম কালেকশন | Premium Collection | প্রিমিয়াম আমসত্ত্বের আচার | Premium Amsotto Pickle |
| 18 | প্রিমিয়াম কালেকশন | Premium Collection | গাবের আচার | Gab Pickle |

**Note:** Prices will be set by admin when adding products. No prices are hardcoded.

---

## 7. ADMIN PANEL — admin.html

### 7.1 Authentication

| Feature | Details |
|---|---|
| Method | Supabase Auth → Email + Password login |
| Login Screen | Centered login card with আচার ওয়ালা logo, email field, password field, login button |
| Admin User | Created manually in Supabase Dashboard → Authentication → Users → Add User |
| Session | Supabase handles session persistence — auto-login on revisit |
| Logout | Logout button in admin navbar → clears session, shows login screen |

### 7.2 Admin Layout

**Navbar:**
```
[🥭 আচার ওয়ালা Admin]    ড্যাশবোর্ড   অর্ডার   পণ্য   সেটিংস   [🔔]   [Logout]
```

**Mobile:** Bottom tab bar with icons for Dashboard, Orders, Products, Settings

### 7.3 Dashboard Tab

#### 7.3.1 Stats Cards (Top Row — 2 rows of 3 on mobile)

| # | Card Title (BN) | Icon | Color | Data Source |
|---|---|---|---|---|
| 1 | মোট অর্ডার | 📦 | Blue | `COUNT(*)` from orders |
| 2 | পেন্ডিং অর্ডার | ⏳ | Red (#DC2626) | `COUNT(*)` WHERE status = 'pending' |
| 3 | কনফার্মড অর্ডার | ✅ | Yellow (#F59E0B) | `COUNT(*)` WHERE status = 'confirmed' |
| 4 | ডেলিভারড অর্ডার | 🚚 | Green (#16A34A) | `COUNT(*)` WHERE status = 'delivered' |
| 5 | আজকের অর্ডার | 📅 | Purple | `COUNT(*)` WHERE `created_at::date = today` |
| 6 | মোট আয় (ডেলিভারড) | 💰 | Golden | `SUM(total)` WHERE status = 'delivered' |

#### 7.3.2 Storage Usage Widget

```
┌─────────────────────────────────────────┐
│  📊 Supabase স্টোরেজ ব্যবহার            │
│                                         │
│  ████████████████░░░░░░░░░  320MB/500MB │
│                                         │
│  ⚠️ সতর্কতা: স্টোরেজ ৬৪% পূর্ণ।        │ ← Warning appears at >60%
│  পুরনো অর্ডার ডিলিট করুন।               │ ← Red banner at >80%
│                                         │
└─────────────────────────────────────────┘
```

**Storage Warning Logic:**
- 0-60%: Green bar, no warning
- 60-80%: Yellow bar + yellow warning text
- 80%+: Red bar + red banner "⚠️ স্টোরেজ প্রায় পূর্ণ! এখনই পুরনো অর্ডার ডিলিট করুন!" with link to bulk delete

**Note:** Supabase free tier doesn't expose storage usage via API easily. Use approximate calculation: `COUNT(*) * average_row_size` for orders table, or show a manual estimate. Alternatively query `pg_total_relation_size('orders')` if available.

#### 7.3.3 Recent Orders Widget

Shows last 5 orders in a mini-table below stats:

```
| # | গ্রাহক | মোট | স্ট্যাটাস | সময় |
| #42 | মাহমুদ | ৳960 | 🔴 পেন্ডিং | ২ মিনিট আগে |
| #41 | সাবিনা | ৳580 | 🟡 কনফার্মড | ১ ঘন্টা আগে |
```

### 7.4 Orders Tab

#### 7.4.1 Filter Tabs

```
[সব (45)]  [পেন্ডিং (12)]  [কনফার্মড (8)]  [ডেলিভারড (25)]
```

Active tab highlighted with primary color underline. Numbers update in real-time.

#### 7.4.2 Order List

**Sort:** Newest first (ORDER BY created_at DESC)

**Each Order Row:**
```
┌──────────────────────────────────────────────────────┐
│  #42  মাহমুদুর রহমান          ৳960    🔴 পেন্ডিং     │
│  📱 01712345678    📅 21 Aug 2026, 3:45 PM           │
│  📍 খুলনার ভিতরে                                     │
│                                                      │
│  [বিস্তারিত দেখুন ▼]   [স্ট্যাটাস: পেন্ডিং ▼]   [🗑] │
└──────────────────────────────────────────────────────┘
```

#### 7.4.3 Order Detail (Expanded View)

Clicking "বিস্তারিত দেখুন" expands the order:

```
┌──────────────────────────────────────────────┐
│  গ্রাহকের তথ্য                               │
│  নাম: মাহমুদুর রহমান                         │
│  মোবাইল: 01712345678  [📞 কল]  [💬 WhatsApp]│
│  ইমেইল: mahmud@email.com                    │
│  ঠিকানা: বাড়ি ১২, রোড ৫, খুলনা               │
│  ডেলিভারি: খুলনার ভিতরে (৳80)               │
│  নোট: অতিরিক্ত ঝাল দিবেন না                  │
│                                              │
│  অর্ডারের পণ্য                                │
│  ┌────────────────────────────────────┐      │
│  │ কাঁচা আমের আচার    ×2    ৳500    │      │
│  │ চালতার আচার        ×1    ৳380    │      │
│  └────────────────────────────────────┘      │
│                                              │
│  সাবটোটাল:         ৳880                     │
│  ডেলিভারি চার্জ:    ৳80                      │
│  সর্বমোট:           ৳960                     │
│                                              │
│  [WhatsApp এ কনফার্মেশন পাঠান]               │
└──────────────────────────────────────────────┘
```

**WhatsApp Confirmation Message (auto-generated):**
```
✅ অর্ডার কনফার্মড — আচার ওয়ালা

প্রিয় [customer_name],
আপনার অর্ডার #[order_number] কনফার্ম হয়েছে!

পণ্য:
• কাঁচা আমের আচার ×2 = ৳500
• চালতার আচার ×1 = ৳380

সর্বমোট: ৳960 (ডেলিভারি সহ)
পেমেন্ট: ক্যাশ অন ডেলিভারি

ধন্যবাদ! 🥭
আচার ওয়ালা
```

#### 7.4.4 Status Change

| Current Status | Can Change To | Color |
|---|---|---|
| pending (পেন্ডিং) | confirmed, delivered | 🔴 Red |
| confirmed (কনফার্মড) | delivered | 🟡 Yellow |
| delivered (ডেলিভারড) | — (final state) | 🟢 Green |

Status change via dropdown select next to each order. On change → Supabase UPDATE immediately.

#### 7.4.5 Delete Order (Single)

1. Click 🗑 icon on order row
2. Confirmation popup: "এই অর্ডারটি ডিলিট করতে চান? ডিলিটের আগে CSV ডাউনলোড হবে।"
3. On confirm → auto-download CSV of that single order → delete from Supabase
4. Success toast: "অর্ডার #42 ডিলিট হয়েছে"

#### 7.4.6 Bulk Delete (Date Range)

```
┌──────────────────────────────────────────────────────────┐
│  📦 পুরনো অর্ডার ডিলিট করুন                              │
│                                                          │
│  [তারিখ নির্বাচন করুন: _________ ] পর্যন্ত               │
│  অর্ডার সংখ্যা: ২৫টি                                     │
│                                                          │
│  ⚠️ এই ২৫টি অর্ডার স্থায়ীভাবে ডিলিট হবে।               │
│  ডিলিটের আগে CSV ফাইল অটো ডাউনলোড হবে।                 │
│                                                          │
│  [বাতিল]  [CSV ডাউনলোড ও ডিলিট করুন]                    │
└──────────────────────────────────────────────────────────┘
```

**Process:**
1. Admin picks a date → "এই তারিখের আগের সব অর্ডার ডিলিট করুন"
2. System shows count of orders that will be deleted
3. On confirm → generate CSV → auto-download → delete from Supabase
4. Success: "২৫টি অর্ডার ডিলিট হয়েছে। CSV ফাইল ডাউনলোড হয়েছে।"

### 7.5 Products Tab

#### 7.5.1 Product List View

**Filter:** Category dropdown filter
**Layout:** Card grid (2 columns on mobile, 3-4 on desktop)

**Each Product Card (Admin View):**
```
┌────────────────────────┐
│  [Product Image]       │
│                        │
│  কাঁচা আমের আচার       │
│  ক্যাটাগরি: আমের আচার  │
│                        │
│  ৳350  ৳280           │
│                        │
│  ● Available  /  ○ Hidden │
│                        │
│  [✏️ Edit]  [🗑 Delete] │
└────────────────────────┘
```

#### 7.5.2 Add / Edit Product Form

```
┌──────────────────────────────────────────────────┐
│  নতুন পণ্য যোগ করুন / পণ্য সম্পাদনা              │
│                                                  │
│  পণ্যের নাম (বাংলা)*:    [___________________]  │
│  পণ্যের নাম (English):   [___________________]  │
│                                                  │
│  ক্যাটাগরি (বাংলা)*:     [▼ Select / Type new]  │
│  Category (English):     [___________________]  │
│                                                  │
│  মূল দাম (৳)*:           [___________________]  │
│  ডিসকাউন্ট দাম (৳):      [___________________]  │
│  (খালি রাখলে কোনো ডিসকাউন্ট দেখাবে না)           │
│                                                  │
│  ছবি আপলোড:            [📷 Choose File]         │
│  [Current image preview if editing]              │
│                                                  │
│  বিবরণ (বাংলা):         [___________________]  │
│  Description (English):  [___________________]  │
│                                                  │
│  ☐ Available (ওয়েবসাইটে দেখাও)                  │
│                                                  │
│  [বাতিল]  [সেভ করুন]                             │
└──────────────────────────────────────────────────┘
```

**Image Upload Flow:**
1. Admin selects image file (JPG/PNG, max 2MB)
2. Upload to Supabase Storage → `product-images` bucket
3. Get public URL → save to `products.image_url`
4. When editing → old image deleted from storage, new one uploaded

**Category Dropdown:**
- Shows existing categories from database
- Option to type a new category name
- Keeps categories consistent across products

#### 7.5.3 Delete Product

1. Click 🗑 Delete on product card
2. Confirmation: "এই পণ্যটি স্থায়ীভাবে ডিলিট করতে চান?"
3. On confirm → delete product image from Supabase Storage → delete product row
4. Success toast

#### 7.5.4 Toggle Availability

- Toggle switch on each product card
- `is_available: true` → shown on website
- `is_available: false` → hidden from website, NOT deleted (admin can re-enable later)

### 7.6 Settings Tab

```
┌──────────────────────────────────────────────┐
│  ⚙️ সেটিংস                                  │
│                                              │
│  ডেলিভারি চার্জ                               │
│  খুলনার ভিতরে (৳):  [80___]                 │
│  খুলনার বাইরে (৳):  [150__]                 │
│  [আপডেট করুন]                                │
│                                              │
│  অ্যাডমিন তথ্য                                │
│  ইমেইল: admin@acharwala.shop                 │
│  [পাসওয়ার্ড পরিবর্তন করুন]                    │
│                                              │
│  নোটিফিকেশন                                  │
│  FCM Status: ✅ সক্রিয়                        │
│  [নোটিফিকেশন টেস্ট করুন]                     │
│                                              │
└──────────────────────────────────────────────┘
```

### 7.7 CSV Export Format

When exporting orders (single or bulk delete), CSV columns:

```
order_number, customer_name, customer_phone, customer_email,
customer_address, delivery_zone, delivery_charge,
items (JSON string), subtotal, total, status, note, created_at
```

File name format: `acharwala_orders_2026-08-21.csv`

---

## 8. FIREBASE PUSH NOTIFICATION SYSTEM

### 8.1 Architecture

| Component | Details |
|---|---|
| Trigger | When a new order is inserted into Supabase `orders` table |
| Listener | Supabase Realtime subscription in admin.html (listens for INSERT on orders) |
| Method | When new order detected → browser Notification API (if admin.html is open) OR Firebase FCM for background notifications |
| Admin Token | FCM device token saved to `localStorage` on admin.html first load |

### 8.2 Notification Flow

```
Customer places order
    ↓
Order saved to Supabase
    ↓
Supabase Realtime fires INSERT event
    ↓
admin.html receives event (if open)
    ↓
Show browser notification:
  Title: "🛒 নতুন অর্ডার!"
  Body: "#42 — মাহমুদুর রহমান — ৳960"
    ↓
If admin.html is NOT open (background):
  firebase-messaging-sw.js handles it
  Shows system notification on phone/desktop
```

### 8.3 Service Worker — firebase-messaging-sw.js

```javascript
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCYv4oW83jo9ZVcJbyXjasnqdA9h3pttyw",
  authDomain: "achar-wala.firebaseapp.com",
  projectId: "achar-wala",
  storageBucket: "achar-wala.firebasestorage.app",
  messagingSenderId: "83891655859",
  appId: "1:83891655859:web:024651eb1f328afe714cc6"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: { url: '/admin.html' }
  });
});
```

### 8.4 Important Note on FCM

Since there is NO backend server, push notifications work through:
1. **Foreground (admin.html open):** Supabase Realtime → `onInsert` → browser `Notification` API directly
2. **Background (admin.html closed but PWA/APK installed):** Supabase Realtime through the service worker, which will show notifications while the app is in background

**Limitation:** True server-side FCM push (when phone is completely offline or app killed) requires a backend/Cloud Function. For this free stack, notifications work when the admin app/PWA is running (foreground or background), which is sufficient for a small business.

---

## 9. DATA MANAGEMENT & STORAGE PROTECTION

| Property | Value |
|---|---|
| Warning Threshold | 300MB (60%) → yellow warning in admin |
| Critical Threshold | 400MB (80%) → red banner in admin |
| Bulk Delete UI | Date picker in Orders tab + dedicated section in Dashboard |
| CSV Export | Auto-downloads BEFORE any deletion — openable in Excel/Google Sheets |
| Product Images | Supabase Storage → product-images bucket, public access |
| Free Tier Limits | 500MB Database + 1GB Storage — manage carefully |

### 9.1 Storage Estimation

| Data Type | Estimated Size |
|---|---|
| 1 order row | ~1-2 KB |
| 1,000 orders | ~1-2 MB |
| 1 product image | ~100-500 KB (recommend < 200KB) |
| 18 product images | ~3-9 MB |
| Remaining DB capacity | ~490 MB → can hold ~250,000+ orders before needing cleanup |

**Recommendation:** Storage will NOT be an issue for a long time. The warning system is a safety net. Admin should clean up every few months.

---

## 10. PWA & APK CONVERSION

### 10.1 manifest.json

```json
{
  "name": "আচার ওয়ালা Admin",
  "short_name": "AW Admin",
  "description": "আচার ওয়ালা অর্ডার ম্যানেজমেন্ট",
  "start_url": "/admin.html",
  "display": "standalone",
  "background_color": "#1A4A2E",
  "theme_color": "#1A4A2E",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 10.2 APK Generation Steps

| Step | Task |
|---|---|
| 1 | Deploy admin.html with manifest.json and sw.js to GitHub Pages |
| 2 | Go to https://www.pwabuilder.com |
| 3 | Enter admin URL: https://acharwala.shop/admin.html |
| 4 | PWABuilder analyzes and generates Android APK |
| 5 | Download signed APK |
| 6 | Enable "Unknown Sources" on admin's phone |
| 7 | Install APK → open → login → grant notification permission |

---

## 11. GITHUB PAGES DEPLOYMENT

| Step | Task |
|---|---|
| 1 | Create GitHub repo: `acharwala-shop` (public) |
| 2 | Upload: index.html, admin.html, firebase-messaging-sw.js, manifest.json, sw.js, /icons/ |
| 3 | Settings → Pages → Source: main branch → / (root) → Save |
| 4 | Settings → Pages → Custom domain: acharwala.shop |
| 5 | DNS: Add CNAME record pointing to `[username].github.io` |
| 6 | Enable "Enforce HTTPS" |
| 7 | Admin URL: https://acharwala.shop/admin.html — **KEEP SECRET** |

---

## 12. SECURITY GUIDELINES

| Level | Topic | Action |
|---|---|---|
| 🔴 Critical | Admin URL | Never share admin.html URL publicly |
| 🔴 Critical | Supabase RLS | Row Level Security ON — configured via SQL |
| 🔴 Critical | Admin Password | Strong password for Supabase Auth admin account |
| 🟡 Important | Anon Key | Safe to expose in frontend — protected by RLS |
| 🟡 Important | Firebase Keys | Safe to expose in frontend — Firebase security rules protect backend |
| 🟢 Good | HTTPS | GitHub Pages automatic SSL |
| 🟢 Good | VAPID Key | Public key — safe to include in code |

---

## 13. SUPABASE SQL SETUP (Run in Supabase SQL Editor)

### Step 1 — Create Tables

```sql
-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_bn TEXT NOT NULL,
  name_en TEXT,
  category_bn TEXT NOT NULL,
  category_en TEXT,
  original_price NUMERIC NOT NULL,
  discount_price NUMERIC,
  image_url TEXT,
  description_bn TEXT,
  description_en TEXT,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number SERIAL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT NOT NULL,
  delivery_zone TEXT NOT NULL,
  delivery_charge NUMERIC NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Settings table
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

INSERT INTO settings VALUES
  ('delivery_inside_khulna', '80'),
  ('delivery_outside_khulna', '150');
```

### Step 2 — Enable RLS

```sql
-- Products RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view available products" ON products
  FOR SELECT USING (true);
CREATE POLICY "Only admin can insert products" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only admin can update products" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only admin can delete products" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Orders RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can place orders" ON orders
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admin can view orders" ON orders
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Only admin can update orders" ON orders
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only admin can delete orders" ON orders
  FOR DELETE USING (auth.role() = 'authenticated');

-- Settings RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read settings" ON settings
  FOR SELECT USING (true);
CREATE POLICY "Only admin can update settings" ON settings
  FOR UPDATE USING (auth.role() = 'authenticated');
```

### Step 3 — Enable Realtime for Orders

```sql
-- Enable Realtime on orders table (for push notifications)
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
```

### Step 4 — Storage Bucket (Run in Supabase Dashboard, NOT SQL)

1. Go to Supabase Dashboard → Storage
2. Create new bucket: `product-images`
3. Set bucket to **Public**
4. Add policies:

```sql
-- Storage policies (run in SQL Editor)
CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Only admin can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Only admin can delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```

---

## 14. MANUAL SETUP TASKS CHECKLIST

### 14.1 Supabase Manual Tasks

| # | Task | Where | Status |
|---|---|---|---|
| 1 | ✅ Supabase project created | Dashboard | Done |
| 2 | ⏳ Run SQL Step 1 (Create Tables) | SQL Editor | Pending |
| 3 | ⏳ Run SQL Step 2 (Enable RLS) | SQL Editor | Pending |
| 4 | ⏳ Run SQL Step 3 (Enable Realtime) | SQL Editor | Pending |
| 5 | ⏳ Create `product-images` storage bucket (Public) | Dashboard → Storage | Pending |
| 6 | ⏳ Run SQL Step 4 (Storage Policies) | SQL Editor | Pending |
| 7 | ⏳ Create admin user (email + password) | Dashboard → Authentication → Users → Add User | Pending |

### 14.2 Firebase Manual Tasks

| # | Task | Where | Status |
|---|---|---|---|
| 1 | ✅ Firebase project created | Firebase Console | Done |
| 2 | ✅ FCM enabled | Firebase Console | Done |
| 3 | ✅ VAPID key generated | Firebase Console → Cloud Messaging → Web Configuration | Done |
| 4 | ⏳ No additional Firebase setup needed | — | — |

### 14.3 Development Tasks

| # | Task | Status |
|---|---|---|
| 1 | Supabase SQL setup (Steps 1-4 above) | ⏳ Pending |
| 2 | Supabase admin user created | ⏳ Pending |
| 3 | Supabase storage bucket created | ⏳ Pending |
| 4 | index.html — User website coded | ⏳ Pending |
| 5 | admin.html — Admin panel coded | ⏳ Pending |
| 6 | firebase-messaging-sw.js created | ⏳ Pending |
| 7 | manifest.json + sw.js created | ⏳ Pending |
| 8 | GitHub repository created | ⏳ Pending |
| 9 | GitHub Pages enabled | ⏳ Pending |
| 10 | Custom domain (acharwala.shop) connected | ⏳ Pending |
| 11 | Initial products uploaded via admin panel | ⏳ Pending |
| 12 | PWABuilder → APK generated | ⏳ Pending |
| 13 | APK installed + notifications tested | ⏳ Pending |

---

## 15. EXTERNAL LIBRARIES (CDN — No Build Step)

All loaded via CDN in index.html and admin.html:

| Library | Version | Purpose | CDN |
|---|---|---|---|
| Supabase JS | 2.x | Database, Auth, Storage, Realtime | https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2 |
| Firebase App | 10.x | Firebase core | https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js |
| Firebase Messaging | 10.x | FCM push notifications | https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js |
| AOS | 2.3.4 | Scroll animations (index.html only) | https://cdn.jsdelivr.net/npm/aos@2.3.4 |
| Google Fonts | — | Hind Siliguri + Inter | https://fonts.googleapis.com |

**No npm, no build tools, no bundler.** Everything is vanilla HTML + CSS + JavaScript loaded from CDNs.

---

*Achar Wala PRD v2.0 | August 21, 2026 | Md. Imran | Khulna, Bangladesh*
*Prepared for Antigravity (Google Agentic Coding Tool) implementation*