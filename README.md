# 🏋️ IronPeak Fitness — Gym Management Portal

**A full-stack gym management system** with member portal, admin dashboard, workout planner, class booking, progress tracking, and billing management.

---

## 📋 Table of Contents

1. [Quick Start](#-quick-start)
2. [System Requirements](#-system-requirements)
3. [First Time Setup (New PC)](#-first-time-setup-new-pc)
4. [Daily Use — How to Open](#-daily-use--how-to-open)
5. [How to Move to Another PC](#-how-to-move-to-another-pc)
6. [Demo Credentials](#-demo-credentials)
7. [Features](#-features)
8. [Pages & URLs](#-pages--urls)
9. [Technology Stack](#-technology-stack)
10. [File Structure](#-file-structure)
11. [Scripts Reference](#-scripts-reference)
12. [Troubleshooting](#-troubleshooting)
13. [Developer Guide](#-developer-guide)

---

## ⚡ Quick Start

> Already have Node.js installed? Just run:

```
Double-click  →  setup.bat     (first time only)
Double-click  →  IronPeak.vbs  (every time after)
```

Or use the **"IronPeak Fitness"** shortcut created on your Desktop.

---

## 💻 System Requirements

| Requirement | Details |
|-------------|---------|
| **Operating System** | Windows 10 or Windows 11 |
| **Node.js** | Version 18.x or higher (LTS recommended) |
| **RAM** | 2 GB minimum, 4 GB recommended |
| **Disk Space** | ~500 MB (includes Node.js modules) |
| **Network** | No internet required after setup |
| **Browser** | Chrome, Edge, Firefox (any modern browser) |

> **Download Node.js:** https://nodejs.org/en/download — choose **"LTS"** version

---

## 🛠️ First Time Setup (New PC)

Follow these steps **once** on every new computer you want to run IronPeak on:

### Step 1 — Install Node.js
1. Go to **https://nodejs.org**
2. Click the **LTS** download button
3. Run the installer — click **Next → Next → Install → Finish**
4. **Restart your computer** (required for Node.js to work)

### Step 2 — Copy the portal folder
Copy the entire `portal` folder to your PC. You can put it anywhere:
- `D:\IronPeak\portal\`
- `C:\Users\YourName\Documents\IronPeak\portal\`
- USB drive or network location also works

### Step 3 — Run setup.bat
1. Open the `portal` folder
2. **Double-click `setup.bat`**
3. It will automatically:
   - ✅ Check Node.js version
   - ✅ Install all dependencies
   - ✅ Set up the database
   - ✅ Build the production app
   - ✅ Create a **"IronPeak Fitness"** shortcut on your Desktop
4. When asked **"Launch now?"** → type `Y` and press Enter

> ⏱️ First-time setup takes **3-5 minutes**. After that, opening takes **2-3 seconds**.

---

## 📂 Daily Use — How to Open

After setup, you have **3 ways** to open IronPeak Fitness:

### Option 1 — Desktop Shortcut (Recommended) ⭐
Double-click the **"IronPeak Fitness"** icon on your Desktop.

### Option 2 — VBS File
Navigate to the portal folder and double-click **`IronPeak.vbs`**

### Option 3 — Manual (for troubleshooting)
Double-click **`start.bat`** in the portal folder — this shows the server logs.

### To Close / Stop the Server
- Double-click **`stop.bat`** in the portal folder
- OR press any key in the `start.bat` window if you used that method

### Auto-Start with Windows (Optional)
During setup, if you chose **"Auto-start on login: Y"**, the server starts automatically every time you log into Windows. You just need to open your browser and go to **http://localhost:3000**.

To enable auto-start manually:
1. Copy `IronPeak.vbs` to: `C:\Users\YourName\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\`

---

## 🚚 How to Move to Another PC

> You can use IronPeak Fitness on as many computers as you want.

### Moving with your data:
1. **Stop the server** (run `stop.bat`)
2. **Copy the entire `portal` folder** to a USB drive or shared drive
3. On the new PC, **install Node.js** (see Step 1 above)
4. **Double-click `setup.bat`** — it will auto-detect what's needed
5. Done! All your data moves with the folder (the database is inside `prisma/dev.db`)

### Starting fresh on a new PC (demo data only):
1. Copy the folder (without `prisma/dev.db`)
2. Install Node.js
3. Run `setup.bat` — it will create a fresh database with demo data

### Important: What is portable vs. not
| ✅ Portable (moves with folder) | ❌ Not portable |
|--------------------------------|----------------|
| All website code | Node.js installation |
| Database & member data | Desktop shortcut (recreated by setup.bat) |
| Configuration (.env) | Windows auto-start entry |
| Workout plans & logs | |

---

## 🔐 Demo Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| 👑 **Admin** | admin@ironpeak.com | admin123 | Full admin panel + member management |
| 👤 **Member** | john.doe@email.com | member123 | Member dashboard, bookings, workouts |
| 👤 **Member** | sarah.jones@email.com | member123 | Member dashboard |
| 👤 **Member** | mike.chen@email.com | member123 | Member dashboard |

> **Login page:** http://localhost:3000/login  
> Use the **"Admin Demo"** or **"Member Demo"** buttons for one-click login fill.

---

## ✨ Features

### 👤 Member Portal
| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Personalized greeting, KPI cards, quick actions |
| 🗓️ **Browse Classes** | 12 fitness classes, filter by day/type, book with one click |
| 📋 **My Bookings** | View upcoming and past class bookings |
| 📆 **Workout Planner** | Build a 7-day workout schedule with 38 exercises |
| 💪 **Workout Log** | Log daily workout sessions with exercises, sets, reps, weight |
| 📈 **Progress Tracker** | Track weight, body fat %, measurements + line charts |
| 💳 **Membership** | View plan, switch plans, see payment history |
| 👤 **Profile** | Update personal info, fitness goal, emergency contact |

### 🏋️ Exercise Library (in Workout Planner)
- **38 exercises** across all major muscle groups
- **5 filter dimensions:**
  - 💪 Muscle Group — Chest, Back, Legs, Shoulders, Arms, Core, Full Body
  - 🔑 Difficulty — Beginner, Intermediate, Advanced
  - 🏷️ Type — Strength, Isolation, Cardio, Endurance, Flexibility
  - ⚙️ Equipment — Barbell, Dumbbell, Bodyweight, Cable, Machine, Other
  - 🔍 Text search — find by name or muscle
- **Custom exercise creator** — create any exercise with name, sets, reps, notes
- **Weekly schedule view** — assign exercises to any day of the week

### 👑 Admin Panel
| Feature | Description |
|---------|-------------|
| 📊 **Overview Dashboard** | 4 KPI cards + Revenue chart + Member growth + Top classes |
| 👥 **Members** | Full member table, search, view profile, delete |
| 🏋️ **Trainers** | Trainer cards, add new trainer, manage specializations |
| 🗓️ **Classes** | Class schedule table, add/edit classes |
| 💎 **Plans** | Membership plan management + MRR overview |
| 📋 **Attendance** | Class attendance tracking |
| 📈 **Reports** | Revenue trends, plan distribution, top classes analytics |

---

## 🔗 Pages & URLs

Once the server is running at **http://localhost:3000**:

| URL | Page |
|-----|------|
| `/` | Auto-redirects (Dashboard or Admin) |
| `/login` | Login page |
| `/dashboard` | Member dashboard |
| `/classes` | Browse & book fitness classes |
| `/bookings` | View your bookings |
| `/workouts/planner` | 📆 Weekly workout planner |
| `/workouts` | Workout log history |
| `/progress` | Body measurements & progress charts |
| `/billing` | Membership & billing |
| `/profile` | Personal profile |
| `/admin` | Admin overview |
| `/admin/members` | Member management |
| `/admin/trainers` | Trainer management |
| `/admin/classes` | Class management |
| `/admin/plans` | Plan management |
| `/admin/attendance` | Attendance tracking |
| `/admin/reports` | Analytics & reports |

---

## 🛠️ Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.2.9 |
| **Language** | TypeScript | 5.x |
| **Auth** | NextAuth v5 beta | 5.0.0-beta.31 |
| **Database** | SQLite (local file) | — |
| **ORM** | Prisma | 5.22.0 |
| **Charts** | Recharts | 3.x |
| **Styling** | Vanilla CSS (light theme) | — |
| **Fonts** | Inter + Plus Jakarta Sans | Google Fonts |
| **Animations** | CSS keyframes | — |

---

## 📁 File Structure

```
portal/
├── 📄 setup.bat          ← Run this FIRST on a new PC
├── 📄 start.bat          ← Starts the server + opens browser
├── 📄 stop.bat           ← Stops the server
├── 📄 IronPeak.vbs       ← Silent launcher (no CMD window)
├── 📄 reset-db.bat       ← Resets database to demo data
├── 📄 .env               ← Environment configuration
├── 📄 next.config.ts     ← Next.js configuration
├── 📄 package.json       ← Dependencies
│
├── 📁 prisma/
│   ├── schema.prisma     ← Database schema
│   ├── seed.ts           ← Demo data seeder
│   └── dev.db            ← SQLite database (your data lives here)
│
├── 📁 src/
│   ├── 📁 app/           ← All pages and API routes
│   │   ├── (member)/     ← Member pages (dashboard, classes, etc.)
│   │   ├── (admin)/      ← Admin pages
│   │   ├── api/          ← REST API endpoints
│   │   ├── login/        ← Login page
│   │   └── globals.css   ← Design system & light theme
│   │
│   ├── 📁 components/    ← Shared UI components (Sidebar, etc.)
│   └── 📁 lib/           ← Utilities (auth, prisma, utils)
│
├── 📁 .next/             ← Production build (auto-generated)
├── 📁 node_modules/      ← Dependencies (auto-generated)
└── 📁 logs/              ← Server and setup logs
```

---

## 📜 Scripts Reference

| Script | How to Run | Description |
|--------|-----------|-------------|
| `setup.bat` | Double-click | **First-time setup** on any PC |
| `IronPeak.vbs` | Double-click | **Daily launcher** (no CMD window) |
| `start.bat` | Double-click | Starts server + browser (shows logs) |
| `stop.bat` | Double-click | Stops the running server |
| `reset-db.bat` | Double-click | ⚠️ Resets data to demo state |

### npm scripts (for developers)
```bash
npm run dev       # Development mode (hot reload)
npm run build     # Build for production
npm run start     # Start production server
npm run db:push   # Push schema to database
npm run db:seed   # Seed demo data
npm run db:reset  # Reset + reseed database
npm run db:studio # Open Prisma database viewer
```

---

## 🔧 Troubleshooting

### ❌ "The portal isn't opening / browser shows nothing"
**Cause:** Server hasn't started yet.  
**Fix:** Wait 10 seconds and refresh the browser, OR run `start.bat` to see error logs.

---

### ❌ "'node' is not recognized"
**Cause:** Node.js isn't installed.  
**Fix:** Download from https://nodejs.org, install, then **restart your computer**.

---

### ❌ "Port 3000 is already in use"
**Cause:** Another app is using port 3000.  
**Fix:** Run `stop.bat` first, then try starting again. Or close the conflicting app.

---

### ❌ "Cannot login / wrong credentials"
**Fix:** Use the exact demo credentials:
- Admin: `admin@ironpeak.com` / `admin123`
- Member: `john.doe@email.com` / `member123`

---

### ❌ "Database error / missing data"
**Fix:** Run `reset-db.bat` to restore demo data. ⚠️ This erases all custom data.

---

### ❌ Setup fails with npm error
**Fix:** Delete `node_modules` folder and run `setup.bat` again. It will reinstall everything.

---

### ❌ Moved the folder and it doesn't work
**Fix:** Run `setup.bat` again from the new location. It will rebuild and create a new shortcut.

---

### 📄 View logs
- Server logs: `portal\logs\server.log`
- Setup logs: `portal\logs\setup.log`

---

## 👨‍💻 Developer Guide

### Running in Development Mode
Development mode includes hot-reloading — changes to code appear instantly.

```bash
npm run dev
```
Then open http://localhost:3000

### Environment Variables (`.env`)
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Path to SQLite database file |
| `NEXTAUTH_URL` | Base URL of the application |
| `AUTH_SECRET` | Secret key for JWT encryption |
| `AUTH_TRUST_HOST` | Required for NextAuth v5 on localhost |
| `STRIPE_SECRET_KEY` | Stripe payment key (optional) |
| `SMTP_*` | Email configuration (optional) |

### Changing the Port
To use a port other than 3000, update `.env`:
```
NEXTAUTH_URL="http://localhost:8080"
```
And update `package.json`:
```json
"start": "next start -p 8080"
```

### Database Management
```bash
# View database in browser UI
npm run db:studio

# Reset all data
npm run db:reset

# Update schema
npx prisma db push
```

### Adding a New Member (via Admin UI)
1. Login as admin: `admin@ironpeak.com` / `admin123`
2. Go to `/admin/members`
3. Use the Register page: `/register`

---

## 📞 Support

This system was built with:
- **Next.js 16** + **TypeScript**
- **Prisma ORM** + **SQLite**  
- **NextAuth v5** for authentication
- **Recharts** for data visualization
- Light aesthetic design with **Inter** + **Plus Jakarta Sans**

**Portal URL:** http://localhost:3000  
**Admin Panel:** http://localhost:3000/admin

---

*IronPeak Fitness — Built for performance. Designed for simplicity.*
