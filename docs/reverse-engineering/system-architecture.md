# System Architecture & Technical Specifications

## 1. Architectural Topology
OrangeBite follows a clean decoupled Python-first architecture:

```
[ Client Browser / HTMX / React SPA ]
                │
                ▼ (HTTP / JSON / CSRF Protected)
     ┌──────────────────────┐
     │   Vite / Gunicorn    │
     └──────────┬───────────┘
                │
                ▼
     ┌────────────────────────────────────────────────────────┐
     │               Django Application Core                  │
     │ ┌────────────────────────────────────────────────────┐ │
     │ │ REST Framework API (apps/api)                      │ │
     │ └────────────────────────┬───────────────────────────┘ │
     │                          ▼                             │
     │ ┌────────────────────────────────────────────────────┐ │
     │ │ Authoritative Domain Services Layer                │ │
     │ │ • CartPricingService     • OrderService            │ │
     │ │ • CouponService          • RecommendationService   │ │
     │ └────────────────────────┬───────────────────────────┘ │
     │                          ▼                             │
     │ ┌────────────────────────────────────────────────────┐ │
     │ │ Django ORM Models & Migrations                     │ │
     │ │ (Decimal precision, ForeignKey, Atomic Txns)       │ │
     │ └────────────────────────┬───────────────────────────┘ │
     └──────────────────────────┼─────────────────────────────┘
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
       ┌──────────────────┐           ┌──────────────────┐
       │ SQLite / Postgre │           │ Celery / Redis   │
       │ SQL (Storage)    │           │ (Async Workers)  │
       └──────────────────┘           └──────────────────┘
```

## 2. Core Architectural Invariants
1. **Zero Client Trust on Pricing**: Totals are strictly computed on the server based on current database prices. Client payloads only specify dish IDs, quantities, and chosen option IDs.
2. **Atomic Order Commits**: The checkout workflow is wrapped in `transaction.atomic()` to guarantee that order records, immutable receipt snapshots, coupon redemptions, and cart clearing either all commit or all roll back.
3. **Decimal Precision**: No floating-point math is allowed in the pricing engine. All money calculations use `Decimal` with `.quantize(Decimal('1.00'))`.
