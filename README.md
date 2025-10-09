# TaskFlow – Multilingual To-Do Application

TaskFlow is a simple but high-quality **To-Do App** built with **React + Supabase**, supporting **English & Hindi**.  
It allows users to securely manage tasks with a clean, responsive, and mobile-friendly UI.

---
# live - preview -> https://newmanagetask.netlify.app/
---
# walkthrough ->  https://youtu.be/nn9U57EkEB4
## 🚀 Features

### ✅ Core
- **Authentication (Supabase)**  
  - Email/password signup, login, logout  
  - Row Level Security (RLS) policies to protect user data  

- **Tasks Management**
  - Add, edit, delete tasks  
  - Mark as completed / toggle back to "todo"  
  - Fields: `title`, `notes`, `status`, `created_at`, `updated_at`, `user_id`  
  - User sees only their own tasks  

- **Multilingual Support**
  - English + Hindi  
  - Language switcher in **login/signup** and inside app  
  - Language preference persisted via i18next  

- **UI/UX**
  - Modern responsive design using **TailwindCSS**  
  - Sidebar navigation   
  - TaskFlow logo  
  - Loading, empty, and error states handled  

### ⭐ Bonus
- Dashboard with **task stats** (Total, Todo, In Progress, Done, Completion %).  
- Calendar integration → hover on a date to see tasks.  
- Profile/Settings page with feature highlights.  
- Mobile-friendly polish.  

---

## 🏗️ Tech Stack

- **Frontend:** React + Vite + TailwindCSS  
- **Backend:** Supabase (Postgres, Auth, RLS policies)  
- **i18n:** i18next + LanguageDetector (English/Hindi)  

---

## 📂 Project Structure

```
TaskFlow/
│
├── backend/
│   ├── schema.sql          # Supabase schema & policies
│
├── frontend/
│   ├── src/
│   │   ├── pages/          # Dashboard, Tasks, Calendar, Profile, Settings
│   │   ├── components/     # TaskItem, TaskForm, Sidebar, Navbar
│   │   ├── store/          # Zustand state management (useTasks)
│   │   ├── lib/            # supabaseClient.js, i18n.js, translateText.js
│   │   └── styles/         # TailwindCSS
│   │
│   ├── public/             # Assets (logo placeholder, icons)
│   ├── .env                # Supabase URL + anon key
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Setup & Run

### 1. Clone Repo
```bash
git clone https://github.com/yourusername/taskflow.git
cd taskflow
```

### 2. Setup Supabase
1. Go to [Supabase](https://supabase.com) → create project.  
2. Copy your **Project URL** and **Anon Public Key**.  
3. In `backend/schema.sql`, run in Supabase SQL Editor:
   ```sql
   -- Creates tasks table + policies
   create extension if not exists "uuid-ossp";
   create extension if not exists pgcrypto;

   create table if not exists public.tasks (
     id uuid primary key default gen_random_uuid(),
     user_id uuid not null references auth.users(id) on delete cascade,
     title text not null,
     notes text,
     status text not null default 'todo' check (status in ('todo','in_progress','done')),
     created_at timestamptz not null default now(),
     updated_at timestamptz not null default now()
   );

   alter table public.tasks enable row level security;

   -- Policies
   create policy "select_own_tasks" on public.tasks
   for select using (auth.uid() = user_id);

   create policy "insert_own_tasks" on public.tasks
   for insert with check (auth.uid() = user_id);

   create policy "update_own_tasks" on public.tasks
   for update using (auth.uid() = user_id);

   create policy "delete_own_tasks" on public.tasks
   for delete using (auth.uid() = user_id);
   ```

### 3. Configure Frontend
```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run App
```bash
npm run dev
```

---

## 🧠 Approach

1. **Planning** – Broke down into phases: Auth → CRUD → i18n → UI polish → Extra features.  
2. **Backend (Supabase)** – Created schema + secure policies first to isolate data per user.  
3. **Frontend (React + Vite)** –  
   - Built auth flow with Supabase client.  
   - Created reusable components (TaskItem, TaskForm).  
   - Zustand store (`useTasks`) for global task state.  
4. **i18n Integration** – Used i18next with JSON translations (English/Hindi). Ensured no hard-coded strings.  
5. **UI/UX Polish** –  
   - Sidebar.  
   - Mobile responsiveness: bottom nav, safe padding.  
   - Dashboard stats & calendar integration.  
6. **Testing** – Verified in both desktop and mobile views.  
7. **Documentation** – README + schema.sql included.  

---

## 🌐 Deployment
- **Frontend:** netlify
- **Backend:** Supabase project (self-hosted via Supabase dashboard).  

---

## ✅ Evaluation Checklist

- [x] Secure Auth (Supabase)  
- [x] CRUD tasks with ownership (RLS)  
- [x] Multi-language (English/Hindi, persisted)  
- [x] Clean, responsive UI/UX  
- [x] Dashboard with stats  
- [x] Calendar with hover-tasks in selected language  
- [x] Professional documentation  

---

## 👨‍💻 Author
**Shivam Shrivastava**  
Full Stack Developer | Masai School Graduate  
Built with ❤️ using React, Supabase, TailwindCSS  
