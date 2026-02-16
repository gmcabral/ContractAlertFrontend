# ⚖️ ContractAlert — Frontend

> AI-powered contract risk analysis platform. Upload a PDF, extract the text, trigger an analysis and get a risk score with a detailed legal assessment — all in a clean, modern interface.

---

## ✨ Features

- 📄 **PDF Upload** — drag & drop or file picker, with client-side validation
- 🔍 **Manual Analysis Trigger** — analyze contracts on demand, no wasted AI tokens
- 📊 **Risk Scoring** — visual risk score (0–100) with qualitative assessment (low / medium / high / critical)
- 🗂️ **Contract Management** — list, filter, view detail and delete contracts
- 👤 **Authentication** — JWT-based login and registration with protected routes
- 📦 **Plan Monitor** — usage tracking per tier (free / premium / enterprise)
- 📱 **Fully Responsive** — mobile-first design with animated hamburger menu

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite + SWC |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| State Management | Zustand |
| HTTP | Fetch API with Vite proxy |
| Linting | ESLint + TypeScript strict mode |

---

## 🏗️ Architecture

```
src/
├── components/
│   ├── contracts/
│   │   ├── ContractCard.tsx        # Individual contract card
│   │   ├── ContractDetailHeader.tsx # Title, status badge, analyze button
│   │   ├── ContractInfoGrid.tsx    # Basic info grid (client, type, dates)
│   │   ├── ContractRiskCard.tsx    # Risk score + assessment display
│   │   ├── ContractTextViewer.tsx  # Contract full text viewer
│   │   ├── EmptyState.tsx          # Empty list state
│   │   ├── PlanMonitor.tsx         # Usage bar per plan tier
│   │   ├── RiskBadge.tsx           # Risk badge + risk bar
│   │   └── UploadModal.tsx         # PDF upload modal with drag & drop
│   └── layout/
│       └── Header.tsx              # Responsive header with mobile menu
├── constants/
│   └── contracts.ts                # STATUS_CONFIG, RISK_CONFIG, TIER_LIMITS
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── ContractsPage.tsx
│   └── ContractDetailPage.tsx
├── services/
│   └── api.ts                      # API service layer
├── store/
│   └── authStore.ts                # Zustand auth store
└── types/
    └── index.ts                    # Shared TypeScript interfaces
```

**Key architectural decisions:**
- Pages handle state and business logic only — all UI is delegated to components
- Shared visual configs (`STATUS_CONFIG`, `RISK_CONFIG`) live in constants to avoid duplication
- All API calls go through a single service layer (`api.ts`), never directly from components
- Vite proxy forwards `/api/*` to the backend in development — no CORS issues, no hardcoded URLs

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- The [ContractAlert Backend](https://github.com/your-username/contractalert-backend) running locally or via Docker

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/contractalert-frontend.git
cd contractalert-frontend

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the root of the project:

```env
# No secrets needed on the frontend — all API calls go through the Vite proxy
# Override the backend URL if needed (default: http://localhost:7071)
VITE_API_URL=http://localhost:7071
```

> `.env.local` is gitignored and will never be committed.

### Running the Dev Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`. All `/api/*` requests are proxied to the backend at `http://localhost:7071`.

### Build for Production

```bash
npm run build
```

Output is generated in the `dist/` folder, ready to be served by Nginx or any static host.

---

## 🔗 Related

- [ContractAlert Backend](https://github.com/your-username/contractalert-backend) — Azure Durable Functions (.NET 8) + PostgreSQL + MSSQL

---

## 📄 License

MIT
