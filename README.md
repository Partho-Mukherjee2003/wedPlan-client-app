<!-- ============================================ -->
<!--   💍 WedPlan — Wedding Planning Platform 💍   -->
<!-- ============================================ -->

<div align="center">

# 💍 WedPlan — Wedding Planning Platform

### Plan Your Dream Wedding Beautifully & Easily ✨

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better_Auth-Authentication-FF6B6B?style=for-the-badge)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white)

<br/>

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-wedplan--client--app.vercel.app-C75B5B?style=for-the-badge)](https://wedplan-client-app.vercel.app)
[![Client Repo](https://img.shields.io/badge/💻_Client_Repo-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/Partho-Mukherjee2003/wedPlan-client-app)
[![Server Repo](https://img.shields.io/badge/🖥️_Server_Repo-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/Partho-Mukherjee2003/wedplan-server-app)

</div>

---

## 📖 Project Description

**WedPlan** is a full-stack wedding planning platform where **customers** can browse wedding services, book vendors, and manage their bookings. **Vendors** can add services, receive booking requests, and upgrade to a Premium plan. **Admins** manage users, services, and transactions from a dedicated dashboard.

> 🎓 Built as **Programming Hero Assignment 9 (Category 004)** — a complete role-based platform with real payment integration.

---

## 🔗 Important Links

| 🔗 Link | 🌐 URL |
|---|---|
| **Live Site** | https://wedplan-client-app.vercel.app |
| **Client Repository** | https://github.com/Partho-Mukherjee2003/wedPlan-client-app |
| **Server Repository** | https://github.com/Partho-Mukherjee2003/wedplan-server-app |
| **Live Server API** | https://wedplan-server-henna.vercel.app |

---

## ✨ Features

### 🌐 Public Pages
- 🏠 **Home Page** — Banner, Featured Services (live from database), Wedding Categories, How It Works, Why Choose WedPlan, Customer Testimonials
- 🔍 **Browse Services** — search by name, filter by category & location, price sorting (low → high / high → low)
- 💒 **Service Details** — image gallery with thumbnails, vendor information with Premium badge, booking form
- 📱 Fully **responsive** design for mobile, tablet & desktop

### 👤 Customer Features
- 📊 Personal dashboard with booking overview (Total / Pending / Accepted / Rejected)
- 📋 **My Bookings** — view all bookings with service & vendor details
- ❌ Cancel pending bookings
- 🚫 Duplicate booking protection (same service + same date)

### 🏪 Vendor Features
- 📊 Vendor dashboard with service & booking statistics
- ➕ **Add Service** with image upload (ImgBB)
- 🛠️ **My Services** — update & delete own services
- 📥 **Booking Requests** — accept / reject with full customer information
- ⭐ **Premium Plan** (৳4,999 / 30 days) via Stripe — unlimited services + Premium badge
- 🆓 Free plan limited to **3 active services**

### 🛡️ Admin Features
- 📊 Admin overview — total users, vendors, customers, services, bookings, transactions & revenue
- 👥 **Manage Users** — search, filter by role, block / unblock users
- 🗂️ **Manage Services** — search, approve / reject services (including published ones)
- 💳 **Transactions** — view-only payment history

### 🔐 Authentication & Security
- 📧 Email & password sign-in / sign-up (Better Auth)
- 🔵 Google sign-in
- 🎭 Role-based dashboards (Customer / Vendor / Admin) with protected routes
- 🔀 Automatic redirect to the correct dashboard after login
- 🚫 Blocked users cannot access the dashboard or make bookings
- 💳 Premium activates **only through a verified Stripe webhook** — never from the success page

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js (App Router), TypeScript, React |
| **Styling** | Tailwind CSS, DaisyUI, Framer Motion |
| **Authentication** | Better Auth (Email/Password + Google) |
| **Payment** | Stripe Checkout |
| **Image Upload** | ImgBB |
| **Deployment** | Vercel |

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root (see `.env.example`):

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_better_auth_secret
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:5000
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

> ⚠️ Never commit real secrets. Keep them only in environment variables.

---

## 🚀 Installation & Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/Partho-Mukherjee2003/wedPlan-client-app.git

# 2. Go to the project folder
cd wedPlan-client-app

# 3. Install dependencies
npm install

# 4. Run the development server
npm run dev
```

🌐 Open **http://localhost:3000** in your browser.

> 📌 The backend server must also be running — see the [Server Repository](https://github.com/Partho-Mukherjee2003/wedplan-server-app).

---

## 🧪 Test Accounts

Admin, Vendor and Customer test accounts are provided with the assignment submission.

> 🔒 Passwords are intentionally **not** written in this README.

---

## 👨‍💻 Author

<div align="center">

### Partho Mukherjee

*Full Stack Developer (MERN) · BSc in Computer Science & Engineering, ISTT*

[![Gmail](https://img.shields.io/badge/Gmail-parthomukherjee582@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:parthomukherjee582@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-partho--mukherjee2005-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/partho-mukherjee2005)
[![GitHub](https://img.shields.io/badge/GitHub-Partho--Mukherjee2003-181717?style=for-the-badge&logo=github)](https://github.com/Partho-Mukherjee2003)

</div>

---

<div align="center">

💍 **WedPlan** — *Plan Your Dream Wedding Beautifully & Easily* ✨

Made with ❤️ by **Partho Mukherjee**

</div>
