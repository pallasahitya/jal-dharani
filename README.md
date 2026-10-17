# Jal-Dharani 
### Community-Driven Heat & Water Resilience Platform for India

**Jal-Dharani** is a full-stack, geospatial environmental resilience platform designed to help communities across India explore water resources, understand urban heat, report environmental concerns, and organize grassroots conservation activities.

By combining interactive mapping, geospatial data, AI-assisted environmental explanations, and community engagement, Jal-Dharani aims to turn environmental awareness into meaningful local action.

**Repository:** [github.com/pallasahitya/jal-dharani](https://github.com/pallasahitya/jal-dharani)

---

##  The Problem

Communities face interconnected environmental challenges:

- Water scarcity and groundwater depletion
- Pollution and degradation of local water bodies
- Increasing urban temperatures and heat vulnerability
- Limited access to understandable environmental information
- Fragmented opportunities for citizens to coordinate conservation activities and document impact

Jal-Dharani brings these concerns into one platform where people can explore environmental information, submit observations, discover community initiatives, and participate in local resilience efforts.

##  Our Mission

Make environmental information accessible and empower communities to take informed, coordinated action toward water conservation and heat resilience.

**Our impact cycle:**

Awareness → Discovery → Connection → Organization → Action → Documentation → Sharing

---

##  Key Features

###  Interactive Environmental Map
- Explore water bodies, aquifers, heat zones, and environmental reports.
- Display geospatial information through an interactive Leaflet map.
- Support spatial data and GeoJSON-based map layers.

###  Water Resource Exploration
- Explore information about water bodies and groundwater resources.
- Review aquifer information and groundwater stress classifications.
- Support spatial queries for nearby water resources.

###  Urban Heat Awareness
- Explore urban heat vulnerability information.
- Understand connections between heat, water demand, and evaporation.
- Discover community-level cooling and resilience interventions.

###  Citizen Environmental Reporting
- Submit observations about environmental concerns.
- Associate reports with geographic locations.
- Store report records through the backend API.
- Support environmental explanations and safety guidance through AI integration.

###  Community Engagement
- Discover community groups and conservation initiatives.
- Create or join community collectives.
- Share community updates and announcements.

###  Conservation Activities
- Organize activities such as cleanups, desilting, and rainwater-harvesting audits.
- Participate in activities and coordinate volunteers.
- Support documentation of conservation outcomes.

###  AI-Assisted Environmental Insights
- Integrate Google Gemini for environmental report explanations.
- Explain possible environmental processes behind observations.
- Generate practical safety guidance and heat-water analysis.
- Support deterministic fallback responses when AI functionality is unavailable.

###  Authentication and Access Control
- JWT-based authentication in the backend.
- Password hashing and protected API endpoints.
- Authenticated operations for reports, communities, and activities.

---

##  Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Mapping | Leaflet, OpenStreetMap |
| Backend | Python, FastAPI |
| Database | PostgreSQL, PostGIS |
| Spatial Processing | GeoAlchemy2, Shapely |
| Authentication | JWT, password hashing |
| AI Integration | Google Gemini API |
| Serverless Framework | AWS SAM |
| Cloud Components | AWS Lambda, API Gateway, Amazon S3 |
| Local Cloud Emulation | LocalStack |
| Testing | Pytest |

---

##  System Architecture

The following diagram illustrates the main application components and their intended interactions.

```mermaid
flowchart TB
    User["Citizens and Community Volunteers"]

    subgraph Frontend["Frontend Layer"]
        UI["React + TypeScript"]
        Map["Leaflet Interactive Map"]
        State["Application State and API Client"]
        UI --> Map
        UI --> State
    end

    subgraph Backend["Backend Layer"]
        API["FastAPI Application"]
        Auth["JWT Authentication"]
        Services["Business Logic and Services"]
        API --> Auth
        API --> Services
    end

    DB[("PostgreSQL + PostGIS")]
    AI["Google Gemini API"]
    Storage["Amazon S3 / LocalStack"]

    User --> UI
    State <-->|"HTTP / JSON"| API
    Services <-->|"Database queries"| DB
    Services <-->|"AI requests"| AI
    Services -->|"Media storage integration"| Storage

    classDef frontend fill:#dbeafe,stroke:#2563eb,color:#1e3a8a
    classDef backend fill:#dcfce7,stroke:#16a34a,color:#14532d
    classDef storage fill:#fef3c7,stroke:#d97706,color:#78350f

    class UI,Map,State frontend
    class API,Auth,Services,AI backend
    class DB,Storage storage
```

*Note: The S3 component represents the configured storage integration target. Actual photo-upload functionality and cloud connectivity should be verified independently.*

---

##  Environmental Reporting Workflow

```mermaid
flowchart TD
    A["Open Jal-Dharani"]
    B["Explore the environmental map"]
    C["Identify an environmental concern"]
    D["Submit a report"]
    E{"Authenticated?"}
    F["Sign in"]
    G["Backend validates request"]
    H[("PostgreSQL + PostGIS")]
    I["Retrieve and display report data"]
    J["Request AI-assisted explanation"]
    K["Display explanation and safety guidance"]

    A --> B --> C --> D --> E
    E -- "No" --> F --> D
    E -- "Yes" --> G --> H --> I
    I --> J --> K
```

This workflow illustrates the intended reporting journey. Individual operations depend on the application's authentication, API, database, and AI configuration.

---

##  Project Structure

```text
jal-dharani/
├── backend/
│   ├── app/
│   │   ├── dependencies/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── seed/
│   │   └── services/
│   ├── tests/
│   ├── database.py
│   ├── lambda_handler.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── infrastructure/
│   ├── localstack-init/
│   │   └── 01-init-s3.sh
│   ├── docker-compose.yml
│   └── template.yaml
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── services/
│   └── types/
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

---

##  Getting Started

### Prerequisites

Install the following tools before running the application:

- Git
- Node.js and npm
- Python
- PostgreSQL with PostGIS
- Docker Desktop, if using a containerized database or LocalStack
- AWS SAM CLI, if working with the serverless infrastructure

### 1. Clone the Repository

```bash
git clone https://github.com/pallasahitya/jal-dharani.git
cd jal-dharani
```

### 2. Configure the Backend

Open a terminal in the project root and run:

```powershell
cd backend

python -m venv venv
.\venv\Scripts\Activate.ps1

pip install -r requirements.txt
Copy-Item .env.example .env
```

Configure the environment variables in `backend/.env` according to your local setup.

The exact variable names and required settings should match `backend/.env.example` and the backend configuration.

**Security:** Never commit your populated `.env` file or paste private credentials into source code.

### 3. Configure PostgreSQL and PostGIS

Create a PostgreSQL database and enable the PostGIS extension.

Set the `DATABASE_URL` variable in `backend/.env` to match your database configuration.

Example format:

```env
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST:5432/DATABASE_NAME
```

Replace the example values with your actual local database details.

If you already have a PostgreSQL container, verify that it is running before starting the backend.

### 4. Start the Backend

From the `backend` directory, run:

```powershell
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The API should be available at:

- API base: `http://127.0.0.1:8000`
- Swagger documentation: `http://127.0.0.1:8000/docs`
- ReDoc documentation: `http://127.0.0.1:8000/redoc`

These URLs apply to local development.

### 5. Configure and Start the Frontend

Open a second terminal in the project root:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite, normally:

`http://localhost:3000`

Ensure the frontend API configuration points to the running FastAPI backend.

### 6. Optional: Run LocalStack

LocalStack can emulate selected AWS services during local development.

From the project root:

```powershell
cd infrastructure
docker compose up -d
```

The configuration defines a local S3 bucket named `jal-dharani-media`.

LocalStack is an emulator. Creating a bucket in LocalStack does not create a bucket in your actual AWS account.

---

##  Backend API Overview

The backend includes routers for authentication, reports, communities, activities, water bodies, aquifers, heat zones, and AI functionality.

The following table summarizes the main API areas. Actual endpoint availability and authentication requirements should be checked in the running FastAPI application's Swagger documentation.

| API Area | Purpose |
|---|---|
| `/api/auth` | User authentication and profile operations |
| `/api/reports` | Environmental report operations |
| `/api/communities` | Community discovery and participation |
| `/api/activities` | Conservation activities and participation |
| `/api/water-bodies` | Water body information and spatial queries |
| `/api/aquifers` | Groundwater and aquifer information |
| `/api/heat-zones` | Urban heat vulnerability information |
| `/api/ai` | AI-assisted environmental explanations and analysis |

For the full list of routes, open `http://127.0.0.1:8000/docs` while the backend is running.

---

##  AI Integration

Jal-Dharani integrates with the Google Gemini API to support environmental explanations and heat-water analysis.

Potential use cases include:

- Explaining possible causes of visible water pollution.
- Providing general environmental context for citizen observations.
- Offering practical precautions for community volunteers.
- Explaining relationships between extreme heat, evaporation, water demand, and groundwater stress.

AI-generated explanations are informational. They are not substitutes for laboratory testing, official environmental assessments, or emergency guidance.

Configure the Gemini API key using the environment variable expected by the backend. Never place a real API key in the README or a committed example file.

---

##  AWS SAM and Serverless Architecture

The repository contains an AWS SAM template at:

`infrastructure/template.yaml`

The template defines infrastructure for an HTTP API, a Lambda function, and an S3 bucket. The backend includes a Lambda handler using the Mangum adapter.

### Planned AWS Request Flow

```mermaid
flowchart TD
    Browser["User Browser"]
    Frontend["React Frontend"]
    Gateway["Amazon API Gateway"]
    Lambda["AWS Lambda"]
    Adapter["Mangum ASGI Adapter"]
    API["FastAPI Application"]
    DB[("PostgreSQL + PostGIS")]
    S3[("Amazon S3")]
    Gemini["Google Gemini API"]

    Browser --> Frontend
    Frontend -->|"API request"| Gateway
    Gateway --> Lambda
    Lambda --> Adapter
    Adapter --> API
    API --> DB
    API --> S3
    API --> Gemini

    SAM["AWS SAM Template"]
    SAM -. "Defines infrastructure" .-> Gateway
    SAM -. "Defines function" .-> Lambda
    SAM -. "Defines bucket" .-> S3
```

**Deployment status:** This is the intended serverless architecture represented by the repository's configuration, not confirmation that all resources are deployed and connected.

Before deploying to AWS, verify:

- The Lambda runtime and dependencies are compatible.
- The database is reachable from the deployed function.
- Database credentials and AI keys are configured securely.
- The Lambda execution role has only the permissions it needs.
- S3 bucket access and CORS are configured appropriately.
- The API works after deployment.

The local database URL using `localhost` cannot be reused unchanged by a Lambda function running in AWS.

### Validate the SAM Template

From the project root:

```powershell
sam validate --template-file infrastructure/template.yaml
```

### Build the Application

```powershell
sam build --template-file infrastructure/template.yaml
```

### Deploy

Deploy only after resolving the build, database connectivity, configuration, and permissions requirements.

SAM deployment can create billable AWS resources. Review the resources and expected costs before confirming a deployment.

---

## 🧪 Testing

### Backend Tests

From the project root:

```powershell
cd backend
pytest tests/ -v
```

### Frontend Production Build

From the project root:

```powershell
npm run build
```

These commands run the existing test suite and production build. Their success should be verified in the local development environment.

---

##  Security Practices

- Never commit API keys, passwords, access tokens, or private keys.
- Keep actual credentials in local environment files or a suitable secrets manager.
- Use placeholder values in `.env.example`.
- Keep environment files excluded through `.gitignore`.
- Rotate credentials if they are exposed.
- Use secure authentication settings in production.
- Apply least-privilege permissions to AWS resources.
- Avoid publishing real user information or sensitive database records.

---

##  Community Impact Cycle

Jal-Dharani is built around the idea that accessible environmental information can help communities coordinate practical action.

```mermaid
flowchart LR
    A["Awareness"]
    B["Discover"]
    C["Connect"]
    D["Organize"]
    E["Act"]
    F["Document Impact"]
    G["Share Results"]

    A --> B --> C --> D --> E --> F --> G
    G -->|"Encourage participation"| A
```

The cycle connects environmental awareness with community participation, conservation activities, and impact documentation.

---

##  Environmental Context

The platform's subject areas align with environmental information commonly published by Indian institutions, including:

- **CPCB:** Central Pollution Control Board
- **CGWB:** Central Ground Water Board
- **IMD:** India Meteorological Department
- **India-WRIS:** Water Resources Information System

These organizations are relevant reference sources for water quality, groundwater, heat, and water-resource information. Their mention does not imply that every displayed value in the application is directly sourced from their live systems.

---

##  Future Improvements

Potential future directions include:

- Production AWS deployment and cloud database integration.
- Verified photo-evidence uploads to S3.
- Improved data provenance and links to official environmental datasets.
- More comprehensive automated testing.
- Accessibility and mobile usability improvements.
- Community impact dashboards and richer environmental visualizations.

These are possible improvements, not claims that all of them are currently implemented.

---

##  Repository

**GitHub:** [pallasahitya/jal-dharani](https://github.com/pallasahitya/jal-dharani)

Jal-Dharani aims to help people understand their local environment, connect with their communities, and participate in practical efforts toward water conservation and heat resilience.

---

## 📄 License

A license has not yet been specified. Add an appropriate license file before explicitly granting others permission to reuse, modify, or redistribute the project.
