# Jal-Dharani 🌊
### Community-Driven Heat & Water Resilience Platform for India

Jal-Dharani is a full-stack environmental resilience platform designed to help communities across India understand local water resources, identify environmental concerns, monitor urban heat, and coordinate grassroots conservation activities.

The platform brings environmental information and community action together, helping citizens move from awareness to measurable environmental impact.

## 🌍 Problem Statement

Communities face growing challenges from water scarcity, groundwater depletion, polluted water bodies, and extreme urban heat. Environmental information can be difficult to access, while opportunities for local communities to organize and document their efforts remain fragmented.

Jal-Dharani aims to bridge this gap through an interactive, geospatial platform for environmental awareness, citizen reporting, and community-driven action.

## ✨ Key Features

- **Interactive Environmental Map:** Explore water bodies, aquifers, heat zones, and environmental reports.
- **Water Resource Monitoring:** Access information about water bodies, groundwater conditions, and aquifer regions.
- **Urban Heat Awareness:** Explore heat-vulnerability information and community cooling interventions.
- **Citizen Reporting:** Submit environmental observations and reports.
- **Community Engagement:** Discover communities, coordinate conservation activities, and participate in local initiatives.
- **Impact Documentation:** Support the documentation of environmental activities and their outcomes.
- **AI-Powered Environmental Insights:** Integrate Google Gemini for environmental explanations and heat-water analysis.
- **Authentication:** Backend authentication and protected API endpoints.
- **Geospatial Data:** Use PostgreSQL with PostGIS for spatial data storage and queries.

## 🛠️ Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Mapping | Leaflet, OpenStreetMap |
| Backend | Python, FastAPI |
| Database | PostgreSQL, PostGIS |
| Geospatial Processing | GeoAlchemy2, Shapely |
| Authentication | JWT, password hashing |
| AI Integration | Google Gemini API |
| Cloud Infrastructure | AWS SAM, AWS Lambda, API Gateway, Amazon S3 |
| Local Cloud Emulation | LocalStack |
| Testing | Pytest |

## 🏗️ Project Structure

```text
jal-dharani/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── seed/
│   │   └── services/
│   ├── tests/
│   ├── lambda_handler.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── infrastructure/
│   ├── localstack-init/
│   ├── docker-compose.yml
│   └── template.yaml
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── services/
│   └── types/
├── .env.example
├── package.json
├── README.md
└── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites

Install the following tools:

- Node.js and npm
- Python
- PostgreSQL with PostGIS
- Docker Desktop
- Git

AWS SAM CLI is required for working with the serverless infrastructure template.

### 1. Clone the Repository

```bash
git clone https://github.com/pallasahitya/jal-dharani.git
cd jal-dharani
```

### 2. Configure the Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Configure the required environment variables in `backend/.env`, including the database connection, authentication settings, and Gemini API key.

Use your own credentials and keep `.env` files out of version control.

### 3. Configure the Database

Create or configure a PostgreSQL database with the PostGIS extension enabled.

Set `DATABASE_URL` in `backend/.env` to match your database configuration.

Example format:

```env
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST:5432/DATABASE_NAME
```

Replace the example values with your local database details.

### 4. Start the Backend

From the `backend` directory, run:

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Backend API documentation:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

### 5. Start the Frontend

Open another terminal in the project root:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally:

`http://localhost:3000`

Configure the frontend API base URL to point to the running backend, according to the project's API configuration.

## ☁️ AWS and Serverless Infrastructure

The repository includes an AWS SAM template at `infrastructure/template.yaml`.

The template defines serverless resources for:

- AWS Lambda
- Amazon API Gateway
- Amazon S3 media storage

The infrastructure directory also contains a LocalStack configuration for local S3 emulation.

Validate the template with:

```powershell
sam validate --template-file infrastructure/template.yaml
```

Build the serverless application with:

```powershell
sam build --template-file infrastructure/template.yaml
```

**Deployment status:** The repository contains SAM infrastructure configuration. A successful build and deployment to AWS must be verified separately. Configure cloud database connectivity, environment variables, permissions, and other required resources before deploying.

## 🧪 Testing

Run backend tests from the `backend` directory:

```bash
pytest tests/ -v
```

Build the frontend to check the production bundle:

```bash
npm run build
```

## 🔐 Security

- Never commit API keys, passwords, access tokens, or private credentials.
- Keep real environment variables in local `.env` files.
- Use `.env.example` files only for variable names and placeholder values.
- Configure secure authentication secrets before deployment.
- Apply appropriate access controls and permissions to cloud resources.
- Rotate any credential that may have been exposed.

## 🎯 Project Goal

Jal-Dharani aims to make environmental information more accessible and help communities take informed, coordinated action toward water conservation and heat resilience.

**Awareness → Discovery → Community → Action → Impact**

## 👩‍💻 Repository

GitHub: https://github.com/pallasahitya/jal-dharani

## 📄 License

A license has not yet been specified. Add a license before explicitly permitting reuse or redistribution of the project.
