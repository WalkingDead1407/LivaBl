**A Data-Driven Quality of Life Index for Smarter Home Decisions**

UrbanLens is an open-source platform that aggregates public urban datasets to generate a **0–100 Quality of Life score** for every ward. It helps renters, homebuyers, researchers, and planners make informed decisions through comparable locality insights and an interactive map.


##  																										Problem

Housing decisions are often made with incomplete or biased information.

* Property listings emphasize positives
* Short visits don’t reveal long-term livability
* Public data on air quality, infrastructure, and civic issues is fragmented

As a result, people rely on price, intuition, and word-of-mouth rather than measurable quality-of-life indicators.

---

##                                                      Solution

UrbanLens unifies multiple public datasets into a **standardized locality score (0–100)**.

The platform transforms complex urban data into simple, actionable insights through:

* Comparable locality scores
* Interactive ward-level maps
* Metric breakdowns
* Side-by-side locality comparisons

---

##                                                      User Flow

1. Open the interactive city map
2. Select a ward/locality
3. View its Quality Score and metric breakdown
4. Compare with other wards
5. Use insights to make a housing decision

---

##  																							Quality Score Metrics (MVP)

UrbanLens computes scores using six key pillars:

* **Healthcare Access** — Hospitals within a 3 km radius
* **Education Access** — Schools within a 3 km radius
* **Connectivity** — Metro accessibility index
* **Environment** — Average AQI levels
* **Civic Responsiveness** — Active complaint data
* **Community Sentiment** — User-submitted ratings

---

##  																										Tech Stack

**Data & Mapping**

* OpenStreetMap (ward boundaries and base maps)
* Open environmental datasets (AQI)

**Backend**

* Python (data ingestion, processing, scoring engine)

**Frontend**

* React / JavaScript dashboard

**Architecture**

* Fully open-source and modular

---

##  																				 How the Scoring Works (High Level)

1. Collect raw datasets from public sources
2. Normalize metrics to a common scale
3. Apply weighted aggregation
4. Generate a final Quality Score per ward
5. Serve results via API to the frontend map

---


##  																								Getting Started

### Prerequisites

* Python 3.10+
* Node.js 18+
* npm or pnpm
* **uv** (Python package manager)
				
Install uv if you don’t have it:

```bash
pip install uv
```

---

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/urbanlens.git

cd urbanlens
```

#### Backend (uv workflow)

```bash
cd backend

# Create virtual environment
uv venv

# Activate environment
source .venv/bin/activate   # Linux / macOS
# .venv\Scripts\activate    # Windows

# Install dependencies
uv pip install -r requirements.txt

# Run server
python app.py
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Future Enhancements

* Crime and safety indices
* Rental price trends
* Walkability and green cover metrics
* Time-series score evolution
* Additional city support

---

## Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---


**UrbanLens — Turning urban data into clear decisions.**
