# QupDating 💘

**Find love near you — beautifully, securely, and locally.**  
QupDating is a modern, dark-themed dating app built for real connections in Bergen and beyond. Designed with expressive UI, verified profiles, and event-driven onboarding, it’s the Viking-smooth way to meet people who matter.

🌐 [Visit the live app → qup.dating](https://qup.dating)

![Made in Norway](https://img.shields.io/badge/Made%20in-Norway-blue)
![Next.js](https://img.shields.io/badge/Framework-Next.js-000?logo=next.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Styling-TailwindCSS-blue?logo=tailwindcss)

---

## ✨ Features

- 🔐 **Secure authentication** with email verification and JWT session refresh
- 🖼️ **Expressive profile editing** with image uploads, progress bars, and dynamic backgrounds
- 💬 **Swipe, match, and chat** with real-time overlays and match logic
- 📍 **Location-aware discovery** with map picker and autocomplete
- 📅 **Event lifecycle**: RSVP, check-in, attendee list, and recap flows
- 🛠️ **Admin dashboard** with role-based access, event management, and modular content panels
- 🎨 **Dark-themed, responsive UI** with Norwegian localization and emotional polish

---

## 🚀 Tech Stack

| Layer         | Tech                          |
|---------------|-------------------------------|
| Frontend      | Next.js (App Router), React   |
| Styling       | Tailwind CSS, Heroicons       |
| Backend       | MongoDB, Mongoose, NextAuth   |
| Auth & Email  | JWT, Resend                   |
| Image Upload  | Cloudinary                    |
| Deployment    | Render                        |

---

## 🛠️ Setup

```bash
# Clone the repo
git clone https://github.com/janegil-staff/QupDating.git
cd QupDating

# Install dependencies
npm install

# Add your environment variables
cp .env.example .env.local
# Fill in MongoDB URI, Resend API key, etc.

# Run locally
npm run dev
