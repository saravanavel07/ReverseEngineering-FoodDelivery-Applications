# Engineering Assumptions, Boundaries & Limitations

## 1. Safety & Payment Boundaries
- **Simulated Payment Sandbox**: OrangeBite uses a sandboxed mock payment processor for development. No actual credit card numbers, CVVs, or UPI PINs are ever requested, processed, or persisted.
- **Delivery Partner Coordinates**: Live map routes and driver markers are simulated for testing order progression. Genuine physical GPS driver telemetry requires an authorized production telematics gateway integration.
- **Indian GST Taxation**: Taxes are modeled as 5% on restaurant food services as standard under Indian GST laws.

## 2. Independent Engineering Hypothesis
- All database relationships, models, service boundaries, and state transitions are newly written independent engineering reconstructions derived through behavioral observation. No proprietary code, confidential APIs, or private intellectual property was accessed.
