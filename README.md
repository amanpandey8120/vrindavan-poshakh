<p align="center">
  <img src="public/logo.png" alt="Vrindavan Poshakh Logo" width="220" style="border-radius: 12px; max-width: 100%; height: auto;" />
</p>

<h1 align="center">🦚 Vrindavan Poshakh</h1>

<p align="center">
  <strong>Premium Krishna Poshakh & Devotional Shringar E-Commerce Platform</strong>
</p>

<p align="center">
  <em>“Shringar Mein Bhakti, Har Din Vrindavan Ki”</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Supabase-Backend%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/Responsive-Mobile%20%2B%20Desktop-orange?style=for-the-badge" alt="Responsive"/>
</p>

---

## 📖 About The Project

**Vrindavan Poshakh** is an authentic, premium e-commerce platform dedicated to handcrafted Krishna Poshakh, deity apparel, and divine devotional Shringar accessories. 

Designed with a serene, devotional aesthetic inspired by Vrindavan's heritage, the platform offers devotees an intuitive, fast, and delightful shopping experience.

### Product Collections
* 👑 **Krishna Poshakh** — Handcrafted silks, zardozi, and seasonal outfits
* 👑 **Mukut & Crowns** — Royal deity crowns with peacock feather accents
* 💎 **Krishna Jewellery** — Kundan, pearl, and gemstone shringar
* 📿 **Mala & Haar** — Sacred tulsi, moti, and fragrant flower malas
* 🧥 **Winter Wear** — Velvet robes, woolen sets, and deity blankets
* 👘 **Dhoti & Vastra** — Traditional cotton, silk, and pitambar vastras
* 🪈 **Bansuri / Flutes** — Decorated brass, silver, and wooden flutes
* 🌸 **Shringar Accessories** — Chandan tikka, pagdi pins, payal, and bajuband
* ✨ **Complete Shringar Sets** — Matching all-in-one divine attire combos
* 🎉 **Festival Specials** — Exclusive Janmashtami, Radhashtami, Holi & Diwali collections

---

## ✨ Key Features

### 🛍️ Customer Shopping Experience
- **Interactive Product Catalog**: Grid and list views with multi-criteria filtering (size, deity, color, occasion, price).
- **Size Selector**: Size-specific filtering tailored for deity sizes (0 to 8+).
- **Product Gallery**: High-resolution zoomable galleries with multi-angle views.
- **Wishlist & Cart**: Instant persistent cart and favorites management.
- **Complete Shringar Builder**: Bundle attire with matching mukut, jewellery, and mala in one click.
- **Order Tracking**: Visual status timeline from placement to delivery.
- **Customer Profiles**: Address book, order history, and preferences.

### 🖥️ Admin Management Dashboard
- **Analytics Overview**: Real-time sales metrics, revenue charts, and top-selling collections.
- **Product & Inventory Control**: Rich product creator with variant management, SKU generator, and stock alerts.
- **Order Fulfillment**: Complete order processing, status updating, and invoice generation.
- **Category & Banner Manager**: Dynamic homepage hero banners and seasonal collection curation.
- **Customer & Review Moderation**: User management and verified purchase review control.

---

## 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite 8](https://vite.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL + RLS + Auth) |
| **Linter** | [Oxlint](https://oxc.rs/) |

---

## 🏛️ Architecture Overview

```text
                     ┌────────────────────────┐
                     │    Devotees & Users    │
                     │  (Mobile & Desktop UI) │
                     └───────────┬────────────┘
                                 │
                                 ▼
                     ┌────────────────────────┐
                     │   React 19 + Vite 8    │
                     │   Tailwind CSS v4      │
                     └───────────┬────────────┘
                                 │
                                 ▼
                     ┌────────────────────────┐
                     │   Supabase Client SDK  │
                     │   (Auth, DB, Storage)  │
                     └───────────┬────────────┘
                                 │
               ┌─────────────────┼─────────────────┐
               ▼                 ▼                 ▼
        ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
        │  PostgreSQL │   │  Auth & RLS │   │ Cloud Bucket│
        │   Database  │   │  Security   │   │ Image Media │
        └─────────────┘   └─────────────┘   └─────────────┘
```

---

## 📁 Project Structure

```text
vrindavan-poshakh/
├── public/
│   ├── logo.png               # Official brand logo
│   └── favicon.svg            # Browser favicon
├── src/
│   ├── assets/                # Static brand assets & images
│   ├── components/            # Reusable UI components
│   │   ├── Header.jsx         # Header with left logo & centered brand
│   │   ├── Footer.jsx         # Footer with quick links & info
│   │   ├── AdminSidebar.jsx   # Admin navigation
│   │   ├── ProductCard.jsx    # Product display card
│   │   └── ...
│   ├── context/               # Global state (Auth, Cart, Wishlist)
│   ├── data/                  # Initial catalog & category data
│   ├── lib/                   # Supabase client & utilities
│   ├── pages/                 # Route pages (Home, Shop, Product, Admin, etc.)
│   ├── App.jsx                # Root application component
│   ├── main.jsx               # App entrypoint
│   └── index.css              # Global styles & Tailwind v4 theme
├── supabase/                  # Supabase schema & migrations
├── .env.example               # Template environment variables
├── package.json               # Dependencies and scripts
└── vite.config.js             # Vite configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

### 2. Clone the Repository
```bash
git clone https://github.com/amanpandey8120/vrindavan-poshakh.git
cd vrindavan-poshakh
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy the example environment file and fill in your Supabase credentials:
```bash
cp .env.example .env
```
Edit `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```text
http://localhost:5173
```

---

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite local development server with HMR |
| `npm run build` | Bundles the application for production in `/dist` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs Oxlint for fast code quality checks |

---

## 🗺️ Application Routes

### Customer Routes
* `/` — Home (Hero banner, featured collections, new arrivals, testimonials)
* `/shop` — Complete product catalog with filters
* `/categories` — Deity and occasion category navigation
* `/product/:id` — Detailed product view with zoom & shringar combos
* `/cart` — Cart management and order summary
* `/wishlist` — Saved devotee favorites
* `/checkout` — Multi-step secure address and order confirmation
* `/account` — Profile, order tracking, and address book

### Admin Routes
* `/admin/dashboard` — Sales metrics & revenue reports
* `/admin/products` — Product catalog management & inventory
* `/admin/orders` — Order fulfillment & tracking status
* `/admin/categories` — Category & collection management
* `/admin/customers` — Devotee customer profiles & history

---

## 📱 Responsive Design Matrix

| Screen Size | Target Viewport | Key Optimizations |
|---|---|---|
| **Mobile** | `360px` – `430px` | Touch-friendly controls, 2-column catalog, compact left logo header |
| **Tablet** | `768px` – `1024px` | 3-column product grid, collapsable filter drawers |
| **Desktop** | `1280px` – `1920px` | 4-column catalog, centered serif brand title, full sidebar filters |

---

## 🤝 Contributing

Contributions and feature suggestions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/DivineFeature`)
3. Commit your changes (`git commit -m 'feat: add DivineFeature'`)
4. Push to the branch (`git push origin feature/DivineFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open-source and available for devotional and educational purposes.

---

<p align="center">
  <img src="public/logo.png" alt="Vrindavan Poshakh" width="90" />
</p>

<p align="center">
  <strong>श्रृंगार में भक्ति, हर दिन वृन्दावन की</strong><br/>
  <em>Made with ❤️ for Krishna devotees worldwide</em><br/>
  🦚 <strong>जय श्री कृष्णा</strong> 🦚
</p>
