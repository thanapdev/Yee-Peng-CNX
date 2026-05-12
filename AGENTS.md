# Yipeng Festival Website — AGENTS.md

## Project Overview

เว็บไซต์นำเสนอเทศกาลยี่เป็ง (Yipeng Lantern Festival) เชียงใหม่ สู่คนไทยและนักท่องเที่ยวต่างชาติ เน้น visual storytelling, cultural pride และ accessibility สำหรับทั้งสองกลุ่ม

**Core Vision**: "ให้ผู้เยี่ยมชมรู้สึกเหมือนยืนอยู่กลางท้องฟ้ายามค่ำคืนที่เต็มไปด้วยโคมลอย — ก่อนที่จะรู้ว่าเทศกาลนี้คืออะไร พวกเขาต้องรู้สึกได้ถึงมันก่อน"

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **i18n**: next-intl หรือ next-i18next (TH/EN)
- **CMS**: Sanity.io (แนะนำ) หรือ Contentful
- **Deploy**: Vercel
- **Maps**: Mapbox GL JS หรือ Google Maps API
- **Analytics**: Vercel Analytics หรือ Google Analytics 4

---

## Site Structure

```
/ (Home)
├── /festival (เทศกาล — ประวัติ วันเวลา สถานที่)
├── /lanterns (โคมลอย — วิธีทำ ความหมาย Do & Don't)
├── /traditions (ประเพณี — ความเชื่อ มารยาท เปรียบเทียบลอยกระทง)
├── /plan-visit (วางแผนมา — เดินทาง ที่พัก แผนที่ checklist)
└── /gallery (แกลเลอรี — ภาพถ่าย วิดีโอ UGC)
```

**Global Components** (ทุกหน้า):
- Navbar พร้อม Language Toggle (TH/EN)
- Countdown Timer (ถ้าใกล้เทศกาล)
- Share & Social Icons
- Footer

---

## Design Principles

### 1. Visual Tone
- **Dark Mode First** — หน้าแรกพื้นหลังมืด (#1A0A00) คล้ายท้องฟ้ากลางคืน
- **Warm & Mystical** — โทนสีทอง (#F5A623), ครีม (#F7E4B6), แดงวัด (#C0392B)
- **Editorial Layout** — ไม่ใช่ grid แบบ generic, ใช้ asymmetry และ white space
- **Photo-driven** — ภาพใหญ่ full-width, minimal text overlay

### 2. Typography
- **Display (EN)**: Cormorant Garamond — สำหรับ headline
- **Body (TH)**: Noto Serif Thai — อ่านง่าย เป็นทางการพอดี
- **Body (EN)**: Lora หรือ Crimson Text
- **UI/Nav**: DM Sans (EN) + IBM Plex Sans Thai (TH)

### 3. Colors
```css
--night-sky: #1A0A00;
--lantern-gold: #F5A623;
--warm-paper: #F7E4B6;
--temple-red: #C0392B;
--mountain-night: #2C4A3E;
--moonlight: #FFFDF5;
```

### 4. Animation Guidelines
- **Hero**: parallax scroll, โคมลอยขึ้นฟ้า (subtle motion)
- **Page Transitions**: fade + slide (200-300ms)
- **Hover States**: scale(1.02), glow effect บนโคมลอย
- **Scroll Animations**: fade-in-up เมื่อ element เข้าจอ (ใช้ Framer Motion `useInView`)

---

## Page-by-Page Requirements

### HOME (/)
**Hero Section**:
- Full-screen video หรือ animated gif โคมลอยขึ้นฟ้า (loop)
- Gradient overlay เพื่อให้อ่าน text ชัด
- Headline: "ยี่เป็ง — เทศกาลแห่งแสงสว่าง" (TH) / "Yipeng — Festival of Lights" (EN)
- CTA: "วางแผนการเดินทาง" (smooth scroll ลงหน้า Plan Visit)
- Countdown timer ถ้าใกล้วันเทศกาล (ปกติเทศกาลยี่เป็ง = เดือน 12 เหนือ ≈ พฤศจิกายน)

**Quick Info Cards** (3 cards):
- "เทศกาลคืออะไร" (link to /festival)
- "วิธีปล่อยโคม" (link to /lanterns)
- "วางแผนมา" (link to /plan-visit)

**Gallery Preview**: 
- Grid 3-4 ภาพ highlight พร้อม link "ดูทั้งหมด" → /gallery

---

### FESTIVAL (/festival)
**Sections**:
1. **ประวัติ & ที่มา**
   - เล่าเรื่องต้นกำเนิดเทศกาลยี่เป็ง แตกต่างจากลอยกระทงอย่างไร
   - ภาพประกอบ: วัดโบราณ ชาวล้านนา

2. **วันเวลา & สถานที่**
   - ยี่เป็ง = วันเพ็ญเดือน 12 เหนือ (ตรงกับลอยกระทงทั่วไทย แต่เชียงใหม่เรียกยี่เป็ง)
   - สถานที่สำคัญ: วัดพระธาตุดอยสุเทพ, ดอยสะเก็ด, สนามแม่โจ้
   - Map embed พร้อม marker (ใช้ Mapbox)

3. **Timeline เทศกาล**
   - วันที่ 1-3: กิจกรรมแต่ละวัน
   - Interactive timeline (scroll horizontal หรือ stepper)

---

### LANTERNS (/lanterns)
**Sections**:
1. **วิธีทำโคม DIY**
   - Step-by-step อธิบายพร้อมรูป (หรือ animated diagram)
   - วัสดุ: กระดาษสา ไม้ไผ่ ไข เชือก
   - Warning: "ไม่แนะนำให้ทำเอง ควรซื้อจากช่างท้องถิ่น"

2. **ความหมายของแสง**
   - โคมลอย = ปล่อยทุกข์ ความกังวล ไปกับท้องฟ้า
   - ความเชื่อทางจิตวิญญาณ

3. **Do & Don't** (สำคัญมาก!)
   - ✅ DO: ปล่อยในจุดที่กำหนด, เก็บซากโคม, เคารพชาวบ้าน
   - ❌ DON'T: ปล่อยใกล้สนามบิน, ใช้วัสดุที่ติดไฟง่าย, ทิ้งขยะ
   - Icon-based layout (ไอคอน + ข้อความสั้นๆ)

---

### TRADITIONS (/traditions)
**Sections**:
1. **ยี่เป็ง vs ลอยกระทง**
   - Comparison table: ภาคเหนือ (ยี่เป็ง = โคมลอย) vs ภาคอื่นๆ (ลอยกระทง = กระทงน้ำ)
   - ทั้งสองเทศกาลเกิดพร้อมกันในวันเดียวกัน แต่ชื่อและรูปแบบต่างกัน

2. **ความเชื่อ & จิตวิญญาณ**
   - บูชาพระธาตุดอยสุเทพ
   - ขอพร ปล่อยวางสิ่งไม่ดี
   - เชื่อมโยงกับพุทธศาสนาล้านนา

3. **เสื้อผ้า & มารยาท**
   - แนะนำให้แต่งกายสุภาพ (ไหล่ปิด กางเกงขายาว)
   - ไม่ส่งเสียงดังในวัด
   - ภาพตัวอย่าง: ชุดผ้าไทย ชุดล้านนา

---

### PLAN VISIT (/plan-visit)
**Sections**:
1. **เดินทางอย่างไร**
   - เครื่องบิน → เชียงใหม่
   - จากสนามบินเข้าเมือง: taxi, Grab, songthaew
   - เช่ารถมอเตอร์ไซค์ (แนะนำสำหรับคนคุ้นเคย)

2. **ที่พัก & ร้านอาหาร**
   - แนะนำพื้นที่: เมืองเก่า, นิมมาน, ริมปิง
   - ช่วงยี่เป็ง = high season → จองล่วงหน้า 2-3 เดือน
   - ร้านอาหารแนะนำ: ข้าวซอย แกงฮังเล ขนมจีนน้ำเงี้ยว

3. **Map & Checklist**
   - Interactive Map พร้อม marker:
     - จุดปล่อยโคม (สนามแม่โจ้, ดอยสะเก็ด)
     - วัดสำคัญ (ดอยสุเทพ, พระสิงห์, เจดีย์หลวง)
     - ที่จอดรถ
     - ร้านอาหาร โรงแรม
   - **Checklist** (print ได้):
     - [ ] จองที่พัก
     - [ ] ซื้อตั๋วเครื่องบิน
     - [ ] เช็ควันเทศกาล (ตามจันทรคติ)
     - [ ] เตรียมเสื้อผ้าสุภาพ
     - [ ] กล้อง โทรศัพท์ชาร์จเต็ม
     - [ ] แจ้งโรงแรมว่ามาช่วงยี่เป็ง (เพื่อรับบริการพิเศษ)

---

### GALLERY (/gallery)
**Sections**:
1. **ภาพถ่าย**
   - Masonry grid (ไม่เท่ากัน ดู dynamic)
   - Lightbox เมื่อคลิก
   - Filter: "โคมลอย", "วัด", "ผู้คน", "บรรยากาศ"

2. **วิดีโอ & Reel**
   - Embed YouTube, Instagram Reels
   - ภาพ 360° ถ้ามี

3. **Community UGC**
   - แสดงภาพจาก Instagram hashtag #yipeng #เทศกาลยี่เป็ง
   - หรือให้คนส่งภาพผ่าน form (แล้ว admin อนุมัติ)
   - Social proof: "มากกว่า 10,000 คนร่วมปล่อยโคมปีที่แล้ว"

---

## CMS Requirements

**Content Types** (Sanity schema):

```javascript
// festivalInfo
{
  title: { type: 'localeString', required: true }, // TH + EN
  date: { type: 'datetime' },
  location: { type: 'geopoint' },
  description: { type: 'localeText' }, // rich text TH + EN
  images: { type: 'array', of: [{ type: 'image' }] }
}

// lanternGuide
{
  step: { type: 'number' },
  title: { type: 'localeString' },
  description: { type: 'localeText' },
  image: { type: 'image' }
}

// dosDonts
{
  type: { type: 'string', options: ['do', 'dont'] },
  text: { type: 'localeString' },
  icon: { type: 'string' } // tabler icon name
}

// galleryImage
{
  image: { type: 'image', required: true },
  caption: { type: 'localeString' },
  category: { type: 'string', options: ['lanterns', 'temples', 'people', 'atmosphere'] },
  isUGC: { type: 'boolean' },
  instagramUrl: { type: 'url' }
}

// placeMarker (for map)
{
  name: { type: 'localeString' },
  type: { type: 'string', options: ['launch-site', 'temple', 'parking', 'restaurant', 'hotel'] },
  location: { type: 'geopoint' },
  address: { type: 'localeString' },
  website: { type: 'url' }
}
```

**Admin Features**:
- ✏️ แก้เนื้อหาทุกหน้าได้โดยไม่ต้อง deploy ใหม่
- 📅 ตั้งวันเวลาเทศกาลล่วงหน้า → Countdown จะคำนวณเอง
- 🖼️ Upload ภาพใหม่ → auto-optimize (WebP, responsive)
- 🗺️ เพิ่ม/ลบ marker บนแผนที่
- 🌐 TH/EN content ใน UI เดียวกัน (side-by-side editor)

---

## Must-Have Features (Priority)

### P0 — Must Have
- [ ] Responsive design (mobile-first)
- [ ] TH/EN language toggle (persist in localStorage)
- [ ] Countdown timer
- [ ] Interactive map (Mapbox) พร้อม markers
- [ ] Do & Don't section (icon-based)
- [ ] Gallery พร้อม lightbox
- [ ] CMS integration (Sanity)

### P1 — Should Have
- [ ] Ambient sound toggle (เสียงกลอง + เทศกาล)
- [ ] Scroll animations (Framer Motion)
- [ ] Share buttons (Facebook, Twitter, LINE)
- [ ] Instagram embed (latest #yipeng posts)
- [ ] Analytics (Vercel Analytics)
- [ ] SEO optimization (meta tags, Open Graph)

### P2 — Nice to Have
- [ ] DIY Guide แบบ interactive stepper
- [ ] 360° photo viewer
- [ ] Dark/Light mode toggle (หน้าแรกมืด, หน้าอื่นสว่าง)
- [ ] Newsletter signup
- [ ] Print checklist PDF
- [ ] WebGL effects (falling lanterns on hero)

---

## Development Guidelines

### File Structure (Next.js App Router)
```
src/
├── app/
│   ├── [locale]/         # TH/EN routes
│   │   ├── page.tsx      # Home
│   │   ├── festival/page.tsx
│   │   ├── lanterns/page.tsx
│   │   ├── traditions/page.tsx
│   │   ├── plan-visit/page.tsx
│   │   └── gallery/page.tsx
│   ├── layout.tsx        # Root layout
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── CountdownTimer.tsx
│   ├── LanguageToggle.tsx
│   ├── InteractiveMap.tsx
│   ├── Gallery/
│   │   ├── GalleryGrid.tsx
│   │   └── Lightbox.tsx
│   └── Footer.tsx
├── lib/
│   ├── sanity.ts         # Sanity client
│   └── i18n.ts           # i18n config
├── public/
│   ├── videos/hero.mp4
│   └── images/
└── sanity/               # Sanity Studio
    ├── schema.ts
    └── sanity.config.ts
```

### Code Standards
- **TypeScript** — strictly typed
- **Tailwind** — utility-first, custom colors ใน `tailwind.config.js`
- **Framer Motion** — ใช้ `initial`, `animate`, `whileInView` สำหรับ scroll animations
- **Lazy Loading** — dynamic import สำหรับ components ที่หนัก (Map, Gallery)
- **Image Optimization** — ใช้ `next/image` เสมอ, format WebP
- **Accessibility**: ARIA labels, keyboard navigation, alt text ครบ

### Performance Targets
- Lighthouse Score > 90 (Performance, Accessibility, SEO)
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1

---

## Deployment

**Vercel Setup**:
1. Connect GitHub repo
2. Add Environment Variables:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_MAPBOX_TOKEN`
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` (ถ้าใช้ GA)
3. Deploy → auto-deploy on push to `main`
4. Custom domain: `yipeng.org` หรือ `yipengfestival.com` (ถ้ามี budget)

**Sanity Studio Deploy**:
- Deploy ที่ `yourdomain.com/studio`
- หรือแยก deploy ที่ `studio.yipeng.org`

---

## Content Strategy

### Writing Tone (TH)
- เป็นกันเอง แต่เคารพวัฒนธรรม
- ไม่เป็นทางการเกินไป แต่ไม่ casual จนเกินไป
- ตัวอย่าง: "ยี่เป็งเป็นเทศกาลที่ชาวล้านนารอคอย ท้องฟ้ายามค่ำคืนจะเต็มไปด้วยแสงโคมพันดวง"

### Writing Tone (EN)
- Warm, welcoming, informative
- Avoid over-tourism language ("authentic", "hidden gem" = cliché)
- ตัวอย่าง: "Yipeng is Northern Thailand's most enchanting festival, where thousands of lanterns light up the November sky"

### Photography Guidelines
- **Hero**: wide shot ท้องฟ้าเต็มไปด้วยโคม, high contrast
- **People**: candid shots, focus on emotion (ความตื่นเต้น ความเคารพ)
- **Details**: closeup โคม, ไฟ, มือที่จุดโคม
- **Aerial**: drone shots ถ้ามี (ต้อง permission)
- **DO NOT**: ภาพที่ไม่เคารพวัฒนธรรม, ภาพลามก, ภาพที่ละเมิดความเป็นส่วนตัว

---

## Success Metrics

**KPIs**:
- **Traffic**: 50,000+ unique visitors ในช่วง 1 เดือนก่อนเทศกาล
- **Engagement**: Time on site > 3 min, Bounce rate < 50%
- **Conversion**: 20%+ คลิก "วางแผนมา" จาก Home
- **Social**: 1,000+ shares ใน Facebook, Instagram, LINE
- **CMS Usage**: Admin update content 2+ ครั้งต่อสัปดาห์

**User Feedback**:
- มีปุ่ม feedback ที่ footer: "เว็บนี้ช่วยคุณได้ไหม?" (Yes/No + optional comment)
- Google Form หรือ Tally form embed

---

## Launch Checklist

### Pre-Launch
- [ ] ทดสอบบน mobile (iOS Safari, Android Chrome)
- [ ] ทดสอบ TH/EN toggle ทุกหน้า
- [ ] เช็ค SEO: meta tags, Open Graph images
- [ ] เช็ค performance: Lighthouse audit
- [ ] เช็ค accessibility: keyboard navigation, screen reader
- [ ] Preview mode ใน Sanity ทำงานได้
- [ ] Countdown timer แสดงวันที่ถูกต้อง

### Launch Day
- [ ] Soft launch: แชร์ใน community กลุ่มเล็ก
- [ ] Monitor analytics: ดู real-time traffic
- [ ] Hotfix ready: ถ้ามี bug ต้อง fix ภายใน 2 ชม.
- [ ] Social media announce: Facebook, Instagram, Twitter

### Post-Launch
- [ ] Collect feedback ใน 1 สัปดาห์แรก
- [ ] Iterate based on analytics: หน้าไหน bounce สูง = ปรับ
- [ ] Update content ผ่าน CMS: ภาพใหม่, ข่าวสาร
- [ ] SEO monitoring: Google Search Console, track rankings

---

## Notes for Developers

### Mapbox Integration
```javascript
// Example: InteractiveMap.tsx
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const markers = [
  { name: 'สนามแม่โจ้', type: 'launch-site', coords: [98.9544, 18.8721] },
  { name: 'ดอยสุเทพ', type: 'temple', coords: [98.9217, 18.8046] },
];

// Map init
map.on('load', () => {
  markers.forEach(marker => {
    new mapboxgl.Marker({ color: marker.type === 'launch-site' ? '#F5A623' : '#C0392B' })
      .setLngLat(marker.coords)
      .setPopup(new mapboxgl.Popup().setText(marker.name))
      .addTo(map);
  });
});
```

### i18n Example
```javascript
// messages/th.json
{
  "hero.title": "ยี่เป็ง — เทศกาลแห่งแสงสว่าง",
  "hero.subtitle": "ปล่อยโคมพันดวงสู่ท้องฟ้าเชียงใหม่",
  "cta.plan": "วางแผนการเดินทาง"
}

// messages/en.json
{
  "hero.title": "Yipeng — Festival of Lights",
  "hero.subtitle": "Release thousands of lanterns into Chiang Mai's night sky",
  "cta.plan": "Plan Your Visit"
}

// Usage
import { useTranslations } from 'next-intl';
const t = useTranslations('hero');
<h1>{t('title')}</h1>
```

### Countdown Timer Logic
```typescript
// utils/countdown.ts
export function getTimeUntilYipeng() {
  // ยี่เป็ง = วันเพ็ญเดือน 12 เหนือ (ตามจันทรคติ)
  // ปี 2024: 15 พฤศจิกายน (ตัวอย่าง — ต้อง fetch จาก CMS)
  const festivalDate = new Date('2024-11-15T18:00:00+07:00');
  const now = new Date();
  const diff = festivalDate.getTime() - now.getTime();
  
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
```

---

## Reference Links

- [Yipeng Wikipedia](https://en.wikipedia.org/wiki/Yi_Peng)
- [Tourism Authority of Thailand — Loi Krathong](https://www.tourismthailand.org/Events-and-Festivals/loi-krathong)
- [Mapbox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js/guides/)
- [Sanity.io Docs](https://www.sanity.io/docs)
- [Framer Motion Scroll Animations](https://www.framer.com/motion/scroll-animations/)

---

## Questions for Clarification

1. **มี budget สำหรับ drone footage ไหม?** — ถ้าไม่มี จะใช้ stock footage หรือภาพจาก community
2. **ต้องการ booking integration ไหม?** — เช่น จองที่พักผ่านเว็บเลย หรือแค่ link ออกไป
3. **Timeline launch:** เป้าหมาย launch เมื่อไหร่? (แนะนำ 2-3 เดือนก่อนเทศกาล)
4. **Domain:** มี domain แล้วหรือยัง? ถ้ายัง แนะนำ `.org` หรือ `.com`
5. **Maintenance:** หลัง launch ใครดูแล content? (ต้อง train admin ใช้ CMS)

---

**End of AGENTS.md** — พร้อมใช้กับ Antigravity หรือ dev tools อื่นๆ แล้วครับ 🚀
