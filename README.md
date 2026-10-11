# Jal-Dharani: Community-Driven Heat & Water Resilience Platform (India)

**Jal-Dharani** is a full-stack, geospatial climate and water resilience platform empowering citizens and grassroots collectives across India to understand their local water bodies, aquifers, and extreme urban heat, organize real-world conservation activities, document tangible before/after impact, and bring more people into the movement.

---

## 🌊 The Mission & Cycle

India's water crisis and summer heatwaves cannot be solved by waiting for government action alone. Jal-Dharani provides communities with open environmental intelligence and civic organizing tools supporting the complete empowerment cycle:

```
AWARENESS → DISCOVER → CONNECT → ORGANIZE → ACT → DOCUMENT → SHARE → ATTRACT MORE PEOPLE
```

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Mapping:** Leaflet & OpenStreetMap (Voyager Tiles) with custom GeoJSON layers
- **State & Routing:** Context API with progressive FastAPI synchronization and offline-first fallback
- **Icons & Motion:** Lucide React & Motion

### Backend
- **Framework:** Python 3.10+ & FastAPI
- **Database:** PostgreSQL + PostGIS (SRID 4326 Geographic Coordinates)
- **Authentication & Security:** JWT (HS256) bearer tokens, PBKDF2/bcrypt password hashing, role-based authorization guards
- **ORM & Spatial Tools:** SQLAlchemy 2.0, GeoAlchemy2, Shapely, Psycopg 3
- **AI Integration:** Google Gemini API (`gemini-2.5-flash`) for scientific hydrological explanations and coupled heat-water nexus modeling
- **Serverless & Lambda Adapter:** Mangum ASGI adapter for AWS Lambda & SAM CLI

### Infrastructure
- **Existing Local PostgreSQL/PostGIS:** Docker container `jal-dharani-db` (Database: `jal_dharani`, User: `jal_user`, Port: `5432`)
- **LocalStack:** Dockerized AWS S3 emulation for citizen evidence photo uploads
- **AWS SAM:** Serverless Application Model template (`infrastructure/template.yaml`)

---

## 💻 Windows PowerShell Local Development Quickstart

Run these exact commands in Windows PowerShell:

```powershell
# 1. Start or verify your existing PostgreSQL + PostGIS Docker container
docker ps --filter "name=jal-dharani-db"
docker start jal-dharani-db

# 2. Setup and run FastAPI Backend
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# OpenAPI Docs will be available at: http://127.0.0.1:8000/docs

# 3. Start Frontend (in a new PowerShell window at the root folder)
npm install
npm run dev
# React Web App will run at: http://localhost:3000

# 4. (Optional) Run LocalStack S3 for photo storage emulation
cd infrastructure
docker compose up -d
```

---

## 🚀 Getting Started

### 1. Database Setup
Your local PostgreSQL + PostGIS container is assumed to be running:
```bash
# Verify container status
docker ps --filter "name=jal-dharani-db"
```
The database connection string is configured via the `DATABASE_URL` environment variable:
```
DATABASE_URL=postgresql+psycopg://jal_user:jal_password@localhost:5432/jal_dharani
```

### 2. Backend Setup (FastAPI)
Navigate to the `backend/` directory:
```bash
cd backend

# Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
python main.py
```
The API server will run at `http://127.0.0.1:8000`.
- **Interactive OpenAPI Documentation:** `http://127.0.0.1:8000/docs`
- **Redoc Documentation:** `http://127.0.0.1:8000/redoc`
- **Health Check:** `http://127.0.0.1:8000/api/health`

On startup, FastAPI automatically verifies the PostGIS extension, executes database migrations, and seeds the database with verified Indian environmental baseline records if empty.

### 3. Frontend Setup (React + Vite)
In the project root:
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The web application will open at `http://localhost:3000`.

---

## 🔐 Real Authentication & Role-Based Access Control

Jal-Dharani implements real, production-ready JWT authentication in FastAPI with PostgreSQL persistence:

| Endpoint | Method | Auth Required | Description |
|---|---|---|---|
| `/api/auth/signup` | POST | Public | Register new citizen account (password hashed with PBKDF2/bcrypt) |
| `/api/auth/login` | POST | Public | Verify credentials and receive signed HS256 JWT access token |
| `/api/auth/me` | GET | **Bearer Token** | Retrieve authenticated user profile and impact statistics |
| `/api/auth/health` | GET | Public | Verify authentication configuration status without exposing secrets |
| `/api/reports` | POST | **Bearer Token** | Log citizen report (acting identity derived from verified token) |
| `/api/reports/{id}` | PATCH | **Bearer Token** | Update report status (restricted to author or community leads) |
| `/api/communities` | POST | **Bearer Token** | Create new community collective (creator registered as admin) |
| `/api/communities/{id}/join`| POST / DELETE | **Bearer Token** | Join or leave community using authenticated identity |
| `/api/activities` | POST | **Bearer Token** | Schedule volunteer event (creator registered as organizer) |
| `/api/activities/{id}/join` | POST / DELETE | **Bearer Token** | RSVP for activity using authenticated identity |

### Seed Demo Accounts
For local testing, the following verified demo accounts are pre-seeded in the database:
- **Lead Account:** `maya.sharma@jal-dharani.org` / Password: `JalDharani2026!` (Role: `community_lead`, Pune)
- **Volunteer Account:** `arjun.n@ecowater.in` / Password: `JalDharani2026!` (Role: `volunteer`, Bengaluru)
- **Hydrologist Account:** `priya.verma@delhiwaters.org` / Password: `JalDharani2026!` (Role: `hydrologist`, New Delhi)

---

## 🗺️ PostGIS Spatial Features & Endpoints

All spatial geometries are stored with **SRID 4326** (WGS 84).

| Endpoint | Method | Description |
|---|---|---|
| `/api/water-bodies` | GET | List water bodies with optional `?city=` and `?type=` filters |
| `/api/water-bodies/nearby` | GET | **PostGIS spatial query (`ST_DWithin` on geography)** within `radius` meters of `lat`/`lng` |
| `/api/water-bodies/geojson` | GET | RFC 7946 GeoJSON FeatureCollection for Leaflet consumption |
| `/api/water-bodies/{id}` | GET | Single water body details with citizen observations |
| `/api/water-bodies/{id}/observations` | POST | Log new field observation for a water body |
| `/api/aquifers` | GET | Regional aquifer data with CGWB stress levels and water table trends |
| `/api/aquifers/geojson` | GET | GeoJSON FeatureCollection of regional aquifer recharge basins |
| `/api/heat-zones` | GET | Urban heat island monitoring with IMD thermal alerts and wet-bulb temperatures |
| `/api/heat-zones/geojson` | GET | GeoJSON FeatureCollection of urban heat vulnerability zones |
| `/api/reports` | GET / POST | Citizen environmental incident reporting (sewage, foaming, debris, etc.) |
| `/api/reports/geojson` | GET | GeoJSON FeatureCollection of citizen field reports |
| `/api/communities` | GET / POST | Local grassroots citizen collectives |
| `/api/communities/{id}/join` | POST / DELETE | Join or leave a community |
| `/api/communities/{id}/posts` | POST | Publish community update or announcement |
| `/api/activities` | GET / POST | Volunteer activities (cleanups, desilting, RWH audits, shaded kiosks) |
| `/api/activities/{id}/join` | POST / DELETE | RSVP/volunteer for an activity |
| `/api/activities/{id}/impact` | POST | Record post-activity documentation (before/after photos, kg waste collected, trees planted) |

---

## 🤖 Gemini AI Integration

Jal-Dharani connects real environmental observations to hydrology science using Google Gemini API (`GEMINI_API_KEY`):

1. **Environmental Report Explanations (`/api/ai/explain-report`):**
   - Ingests citizen observations (e.g. foaming, sewage inflow, chemical discoloration).
   - Generates scientifically grounded explanations of biological/chemical processes without fabricating sensor numbers or lab measurements.
   - Provides 3 practical safety precautions for community volunteers.
   - Includes automatic deterministic scientific fallback when offline.

2. **Coupled Heat-Water Nexus Analysis (`/api/ai/heat-water-summary`):**
   - Analyzes how peak ambient temperatures (+40°C) accelerate municipal water consumption and evaporation from open water bodies, depressing regional aquifers.
   - Recommends actionable grassroots cooling interventions (shaded clay pot *matka* kiosks, white cool-roof coatings).

---

## ☁️ Serverless & LocalStack Emulation

### LocalStack (AWS S3 Photo Storage)
```bash
cd infrastructure
docker-compose up -d localstack
```
Initializes a local S3 bucket `jal-dharani-media` at `http://localhost:4566`.

### AWS SAM Serverless Testing
To test the serverless Lambda function locally using AWS SAM CLI:
```bash
cd infrastructure
sam build -t template.yaml
sam local start-api --port 8000
```
FastAPI runs via the `Mangum` ASGI adapter in `backend/lambda_handler.py`.

---

## 🧪 Testing

Execute backend test suite:
```bash
cd backend
pytest tests/ -v
```
Tests cover:
- Root API metadata
- Health check
- AI explanation endpoint with deterministic fallback
- Coupled heat-water nexus endpoint

---

## 🏛️ Grounded Data Sources

Baseline datasets in Jal-Dharani are calibrated against authoritative Indian environmental standards:
- **CPCB (Central Pollution Control Board):** National Water Quality Monitoring Programme standards.
- **CGWB (Central Ground Water Board):** Dynamic Ground Water Resources of India reports & categorization (Safe, Semi-Critical, Critical, Over-Exploited).
- **IMD (India Meteorological Department):** Heatwave criteria & wet-bulb thermal stress metrics.
- **India-WRIS:** National Water Resources Information System catchment classifications.
