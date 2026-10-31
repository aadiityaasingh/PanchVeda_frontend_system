# 🌿 Panchveda — Ayurvedic & Panchakarma Clinical Web Portal

A modern, responsive, high-performance Single Page Application (SPA) designed for authentic Ayurvedic hospitals, wellness clinics, and Panchakarma treatment centers. Built with **React 19**, **Vite**, **Tailwind CSS**, and **React Router DOM**, Panchveda provides customized, role-tailored clinical workstations for Clinic Administrators, Ayurvedic Doctors, and Panchakarma Therapists.

---

## 🛠 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | React 19 + Vite 8 | Fast, modular Single Page Application with hot-reloading |
| **Styling** | Tailwind CSS v4 | Utility-first, responsive medical design system (Emerald & Slate theme) |
| **Routing** | React Router DOM v7 | Client-side routing with role-based Route Guards |
| **HTTP Client** | Axios | Configured with automatic JWT Bearer injection & 401 interceptors |
| **Icons** | React Icons (FontAwesome) | Comprehensive medical and management iconography |
| **Notifications** | React Toastify | Clean non-blocking user alerts and error notifications |
| **Forms** | Controlled React Forms | Validated form handling with express-validator error parsing |

---

## ✨ Key Features & User Experience

- ⚡ **1-Click Instant Demo Login**:
  - Located directly on the `/login` screen for recruiters and visitors to test all 3 roles (**Admin**, **Doctor**, **Therapist**) without manual typing.
- 🛡️ **Role-Tailored Dynamic Dashboards**:
  - **Admin**: Overall clinic KPIs, registered patients, payments collected, outstanding balance, top prescribed therapies, and staff account management.
  - **Doctor**: Consultation center, new patient registration, therapy plan builder with a **1-Click Quick-Add Bar for the 5 Main Panchakarma Therapies** (*Vamana, Virechana, Basti, Nasya, Raktamokshana*).
  - **Therapist**: Dedicated **Today's Treatment Queue**, assigned treatments counter, completed vs. remaining tracker, and protocol reference guide.
- 🧑‍⚕️ **Unified Patient History & Longitudinal Tracking**:
  - Detailed patient dossiers showing Prakriti (Vata/Pitta/Kapha), chronic conditions, allergies, and contact details.
  - Tabbed clinical history displaying past therapy regimens, daily administration notes, and billing history.
- 🗓️ **Clinical Administration & Vitals Modal** (`SessionModal`):
  - Record session outcome: *Completed*, *Missed*, or *Cancelled*.
  - Track structured clinical markers:
    - **Blood Pressure (BP)**: e.g., `120/80`
    - **Pulse Rate**: e.g., `72 bpm`
    - **Patient Tolerance (Lakshana)**: *Well Tolerated (Samyak)*, *Mild Discomfort (Heena)*, *High Sensitivity (Atiyoga)*
    - **Pathya Compliance**: Checkbox verifying post-procedure dietary and rest guidelines were given.
    - **Therapist Observations**: Freeform clinical notes on oils, decoctions, and patient response.
- 🧾 **Interactive Invoices & Printable Receipts**:
  - Auto-generated bills reflecting therapy days and cost per day.
  - Support for partial and full payment recording with live balance calculations.
  - Print-ready modal for patient billing receipts.
- 🎨 **Accessible, Clinical Aesthetic**:
  - Deep emerald, slate, and soothing gold accents reflecting the authentic tradition of Ayurveda.

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/                        # Axios API service modules
│   │   ├── authApi.js              # Login & setup endpoints
│   │   ├── billApi.js              # Invoice retrieval & payments
│   │   ├── patientApi.js           # Patient CRUD & clinical history
│   │   ├── reportApi.js            # Revenue, top therapies & counts
│   │   ├── sessionApi.js           # Session queue & status updates
│   │   ├── therapyApi.js           # Procedure catalog CRUD
│   │   ├── therapyPlanApi.js       # Therapy plan creation & details
│   │   └── userApi.js              # Staff user management & status
│   ├── components/
│   │   ├── common/                 # Reusable atomic UI components
│   │   │   ├── Badge.jsx           # Status & category badges
│   │   │   ├── Button.jsx          # Primary, outline & danger buttons
│   │   │   ├── Modal.jsx           # Accessible dialog backdrop & container
│   │   │   ├── PageHeader.jsx      # Standardized title & subtitle bar
│   │   │   ├── StatCard.jsx        # Metric summary KPI card
│   │   │   └── Table.jsx           # Standard data table with empty states
│   │   ├── layout/                 # Shell & navigation components
│   │   │   ├── DashboardLayout.jsx # Authenticated frame (Navbar + Sidebar + Content)
│   │   │   ├── Navbar.jsx          # Top bar with user role & logout
│   │   │   └── Sidebar.jsx         # Role-filtered navigation menu
│   │   └── sessions/               # Clinical treatment components
│   │       └── SessionModal.jsx    # Vitals, Samyak tolerance & status modal
│   ├── context/
│   │   └── AuthContext.jsx         # Global auth state, JWT storage & role guards
│   ├── pages/                      # Application route views
│   │   ├── auth/
│   │   │   ├── InitialSetup.jsx    # First-time admin onboarding
│   │   │   └── Login.jsx           # Auth screen with 1-Click Demo Logins
│   │   ├── billing/
│   │   │   └── BillList.jsx        # Clinic-wide invoice & payment manager
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx       # Adaptive role-specific dashboard
│   │   ├── patients/
│   │   │   ├── CreatePatient.jsx   # Patient intake & registration form
│   │   │   ├── EditPatient.jsx     # Edit patient demographics & notes
│   │   │   ├── PatientHistory.jsx  # Complete patient clinical dossier
│   │   │   └── PatientList.jsx     # Directory of clinic patients
│   │   ├── plans/
│   │   │   ├── CreateTherapyPlan.jsx # Regimen builder with 5-Therapy Quick-Add
│   │   │   ├── TherapyPlanDetails.jsx # Plan progress, sessions & invoices
│   │   │   └── TherapyPlanList.jsx # Overview of active/completed plans
│   │   ├── reports/
│   │   │   └── Reports.jsx         # Revenue analytics & therapy charts
│   │   ├── sessions/
│   │   │   └── SessionList.jsx     # Master clinical treatment queue
│   │   ├── therapies/
│   │   │   ├── CreateTherapy.jsx   # Add procedure to catalog
│   │   │   └── TherapyList.jsx     # Procedures, contraindications & pricing
│   │   └── users/
│   │       ├── CreateUser.jsx      # Add staff user (Admin/Doctor/Therapist)
│   │       └── UserList.jsx        # Staff directory & status toggles
│   ├── utils/
│   │   ├── axiosInstance.js        # Axios instance with interceptors
│   │   └── formatters.js           # Currency (₹), date & error formatters
│   ├── App.jsx                     # Route configuration & ProtectedRoute guards
│   ├── index.css                   # Tailwind CSS imports & theme definitions
│   └── main.jsx                    # React 19 application root
├── index.html                      # Page HTML shell with Panchveda title
├── vite.config.js                  # Vite bundler configuration
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** or **yarn**
- Panchveda Backend server running (default: `http://localhost:3000`)

### Installation

1. **Enter the frontend directory**:
   ```bash
   cd "Panchkarma system/frontend"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `frontend/` directory (already configured for local development):
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```
   Generates optimized assets in `dist/`.

6. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 🗺️ Page Matrix & Role-Based Access (RBAC)

| Route | Page Component | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `/login` | `Login.jsx` | Public | Auth screen with 1-Click Instant Demo Login |
| `/setup` | `InitialSetup.jsx` | Public | Setup initial admin if database is empty |
| `/` | `Dashboard.jsx` | `admin`, `doctor`, `therapist` | Role-tailored dashboard & today's queue |
| `/patients` | `PatientList.jsx` | `admin`, `doctor`, `therapist` | Patient directory (Therapists have read-only access) |
| `/patients/add` | `CreatePatient.jsx` | `admin`, `doctor` | Register new patient with medical history |
| `/patients/edit/:id` | `EditPatient.jsx` | `admin`, `doctor` | Update patient demographic & clinical details |
| `/patients/:id` | `PatientHistory.jsx` | `admin`, `doctor`, `therapist` | Full timeline: plans, sessions, and invoices |
| `/therapies` | `TherapyList.jsx` | `admin`, `doctor`, `therapist` | Therapy catalog & clinical protocols |
| `/therapies/add` | `CreateTherapy.jsx` | `admin` | Add new therapy procedure to catalog |
| `/plans` | `TherapyPlanList.jsx` | `admin`, `doctor`, `therapist` | Prescribed multi-therapy treatment courses |
| `/plans/add` | `CreateTherapyPlan.jsx` | `admin`, `doctor` | Plan prescription with 5-Therapy Quick-Add |
| `/plans/:id` | `TherapyPlanDetails.jsx`| `admin`, `doctor`, `therapist` | Regimen progress, session logger, billing |
| `/sessions` | `SessionList.jsx` | `admin`, `doctor`, `therapist` | Daily clinical queue & vitals recording |
| `/billing` | `BillList.jsx` | `admin`, `doctor` | Invoices, payment collection & receipts |
| `/users` | `UserList.jsx` | `admin` | Staff directory & active status toggle |
| `/users/add` | `CreateUser.jsx` | `admin` | Register new doctor, therapist, or admin |
| `/reports` | `Reports.jsx` | `admin`, `doctor` | Revenue charts, top therapies & patient stats |

---

## 👥 Demo Logins

Visitors can click any of the **1-Click Demo Login** buttons on `/login` or enter these credentials manually:

- **Admin Account**: `admin@panchveda.com` / `admin123`
- **Doctor Account**: `dr.ananya@panchveda.com` / `doctor123`
- **Therapist Account**: `vikram@panchveda.com` / `therapist123`

---

> Built with 🌿 for authentic Ayurvedic healthcare and Panchakarma management.
