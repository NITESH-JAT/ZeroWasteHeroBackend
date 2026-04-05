# 🌍 Zero Waste Hero API

The backend engine for **Zero Waste Hero**, a gamified waste management and civic engagement platform. This API connects Citizens, NGOs, Workers, and System Champions to report waste, organize cleanups, and reward environmental action through a verified green-point ecosystem.

## 🚀 Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** PostgreSQL (hosted on NeonDB)
* **File Storage:** Cloudinary (via Multer)
* **Security:** JWT (JSON Web Tokens), Zod (Input Validation), bcryptjs

## ✨ Core Features
* **Role-Based Access Control (RBAC):** Strict isolation between `CITIZEN`, `NGO`, `WORKER`, `CHAMPION`, and `ADMIN` roles.
* **Gamification Engine:** SQL-transaction-backed ledger for distributing `greenPoints` to workers and citizens upon verified cleanups.
* **Geospatial Reporting:** Citizens can report waste locations with GPS coordinates and Cloudinary-hosted image proof.
* **Task Lifecycle:** Full state machine for waste cleanup (`PENDING` -> `VERIFIED` -> `OPEN` -> `ASSIGNED` -> `COMPLETED` -> `VERIFIED`).
* **Live Analytics:** Global dashboard aggregations for system authorities.

---

## 🛠️ Local Setup Instructions

**1. Clone the repository**
\`\`\`bash
git clone https://github.com/yourusername/zeroWasteHeroBackend.git
cd zeroWasteHeroBackend
\`\`\`

**2. Install dependencies**
\`\`\`bash
npm install
\`\`\`

**3. Environment Variables**
Create a `.env` file in the root directory with the following keys:
\`\`\`env
PORT=5000
NODE_ENV=development

# Database (NeonDB)
DATABASE_URL="postgres://user:password@endpoint.neon.tech/dbname?sslmode=require"

# Security
JWT_SECRET="your_super_secret_jwt_key"
JWT_EXPIRES_IN="7d"

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
\`\`\`

**4. Run the Development Server**
\`\`\`bash
npm run dev
\`\`\`
The server will start at `http://localhost:5000`

---

## 📚 API Endpoints

### Health Check
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Check API status | No |

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register new user (Citizen, NGO, Worker) | No |
| `POST` | `/login` | Authenticate user and return JWT | No |

### Reports (`/api/v1/reports`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Submit waste report (Multipart/form-data) | `CITIZEN` |
| `GET` | `/pending` | Fetch unverified waste reports | `CHAMPION`, `ADMIN` |
| `PATCH` | `/:id/verify` | Approve/Reject a citizen report | `CHAMPION`, `ADMIN` |

### Campaigns (`/api/v1/campaigns`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Create a new cleanup campaign | `NGO`, `ADMIN` |
| `GET` | `/` | View all active campaigns | Any Logged In |

### Tasks (`/api/v1/tasks`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Create a task from a verified report | `NGO`, `ADMIN` |
| `GET` | `/open` | View available unassigned tasks | `WORKER`, `ADMIN` |
| `PATCH` | `/:id/claim` | Worker claims a task | `WORKER` |
| `PATCH` | `/:id/complete`| Upload proof image of cleanup | `WORKER` |
| `PATCH` | `/:id/verify` | Verify proof & distribute GreenPoints | `CHAMPION`, `ADMIN` |

### Gamification & Analytics (`/api/v1/...`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/users/leaderboard` | View top users by GreenPoints | Any Logged In |
| `GET` | `/analytics/dashboard`| View total system impact stats | `ADMIN` |

---
*Built with ❤️ for a cleaner planet.*