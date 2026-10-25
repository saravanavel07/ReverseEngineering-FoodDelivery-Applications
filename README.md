# OrangeBite — Reverse-Engineered Food Delivery Platform

[![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.12-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.0+-green.svg)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/Django%20REST%20Framework-3.15+-red.svg)](https://www.django-rest-framework.org/)
[![License](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)

An end-to-end, production-style Indian food delivery platform inspired by observable architectural patterns of modern Indian platforms (such as Swiggy), built with original **OrangeBite** branding, live-motion orange particles, server-authoritative pricing, coupon validation engine, real-time simulated order tracking, customer address book, and administrative sales reporting.

---

## 1. Project Objectives & Methodology

The objective of OrangeBite is to demonstrate clean-room software reverse engineering through authorized reconnaissance, behavioral decomposition, and independent implementation:
1. **Authorized Reconnaissance**: Observes public state transitions, cart constraints, and user journeys without accessing proprietary code or private endpoints.
2. **Behavioral Reconstruction**: Implements authoritative server-side business rules where the client never dictates final monetary totals.
3. **Independent Implementation**: Clean Django models, atomic database transactions, REST Framework serializers, and custom UI design tokens.
4. **Safety & Boundaries**: Development payment simulation that never stores or requests sensitive card numbers, CVVs, or UPI PINs.

---

## 2. Key Features

- **Original OrangeBite Design System**: Primary orange (`#FC8019`), deep orange (`#E86F00`), light cream (`#FFF1E5`), and custom cloche-route logo.
- **Live-Motion Orange Particles**: Lightweight canvas animation featuring floating citrus wedges, warm ambient glowing orbs, and spice stars (fully respects `prefers-reduced-motion`).
- **Location Selector**: Neighborhood switching across Bengaluru (Koramangala, Indiranagar, HSR Layout), Mumbai, New Delhi, and Hyderabad.
- **Restaurant Discovery & Filtering**: Search bar, Pure Veg filter, 4.5+ rating filter, Fast delivery (<28m) filter, and cuisine carousels.
- **Customizable Dish Menus**: Portion sizes (Regular, Jumbo), spice levels, and extra accompaniments with live price calculations.
- **Cart & Server Pricing Authority**: Strict single-restaurant cart validation, item quantity steppers, packaging fee, platform fee, and 5% Indian GST calculation.
- **Promotions & Coupon Engine**: One-click and manual coupon application (`ORANGE50`, `BITE150`, `FREESHIP`, `FEAST20`) enforcing minimum order thresholds and maximum caps.
- **Simulated Payment Sandbox**: Safe checkout supporting UPI, Credit/Debit Cards, Netbanking, and Cash on Delivery.
- **Live Order Tracking**: 6-stage lifecycle (`PLACED` -> `ACCEPTED` -> `PREPARING` -> `READY` -> `OUT_FOR_DELIVERY` -> `DELIVERED`) with animated bike route map and demo simulation controller.
- **Administrative Operations Hub**: Live Gross Merchandise Value (GMV) telemetry, real-time order state updater, and instant dish stock availability toggles.
- **Django Reverse Engineering Lab**: Integrated in-app inspection tool with ER diagram visualizer, live DRF API tester, and pytest execution console.

---

## 3. Technology Stack

- **Backend**: Python 3.10+, Django 5.0, Django REST Framework, Django ORM
- **Database**: SQLite (local development), PostgreSQL (production Docker setup)
- **Frontend / Client**: React, Tailwind CSS, Motion, Canvas Particles, HTMX templates
- **Testing**: pytest, pytest-django, pytest-mock
- **Containerization**: Docker, Docker Compose, Gunicorn

---

## 4. Repository Structure

```
orangebite/
├── manage.py                   # Django CLI entrypoint
├── config/
│   ├── settings/
│   │   ├── base.py             # Shared settings & installed apps
│   │   ├── development.py      # SQLite dev configuration
│   │   └── production.py       # PostgreSQL & security settings
│   ├── urls.py                 # Core routing
│   ├── asgi.py                 # ASGI entrypoint
│   └── wsgi.py                 # WSGI entrypoint
├── apps/
│   ├── accounts/               # Customer profiles & saved addresses
│   ├── restaurants/            # Restaurants, cuisines & operating hours
│   ├── menu/                   # Menu items, categories & customizations
│   ├── discovery/              # Search & rule-based recommendations
│   ├── cart/                   # Cart models & authoritative pricing
│   ├── promotions/             # Coupons & redemption limits
│   ├── orders/                 # Order lifecycle & atomic transactions
│   ├── payments/               # Simulated payment gateway
│   ├── reviews/                # Rating stars & testimonials
│   ├── dashboard/              # Admin analytics & kitchen controls
│   └── core/                   # Health checks & shared views
├── api/
│   └── urls.py                 # DRF unified API routes
├── docs/
│   └── reverse-engineering/    # 11 complete engineering dossiers
├── requirements/
│   ├── base.txt
│   ├── development.txt
│   └── production.txt
├── scripts/
│   └── seed_demo_data.py       # Deterministic database seeder
├── tests/                      # Automated pytest suite
├── Dockerfile                  # Container build file
├── docker-compose.yml          # Multi-container Postgres/Redis/Web stack
├── pytest.ini                  # Pytest configuration
└── README.md
```

---

## 5. Quickstart & Local Development

### 1. Virtual Environment & Dependencies
```bash
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\Activate.ps1
pip install -r requirements/development.txt
```

### 2. Database Migrations & Deterministic Seeding
```bash
python manage.py migrate
python scripts/seed_demo_data.py
```

### 3. Run Automated Tests
```bash
pytest
```

### 4. Start the Application Server
```bash
python manage.py runserver
```

---

## 6. Docker Deployment

To launch the full production-style PostgreSQL, Redis, and Gunicorn stack:
```bash
docker-compose up --build
```
Access the application at `http://localhost:8000` (or `http://localhost:3000` in AI Studio).

---

## 7. Security & Privacy Notice

- **Payment Safety**: All payments in OrangeBite run in simulated test mode. No actual money is charged, and no sensitive credentials (card numbers, CVVs, UPI PINs) are processed.
- **Original IP**: OrangeBite uses original brand names, logos, color codes, and assets. It does not reproduce proprietary logos or private source code.
