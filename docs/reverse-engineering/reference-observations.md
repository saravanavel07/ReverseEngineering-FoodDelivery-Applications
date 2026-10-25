# Phase A: Authorized Reconnaissance & Reference Observations

## 1. Executive Summary
This document records observable behavioral patterns derived from public interaction and architectural observation of contemporary Indian food delivery systems (e.g., Swiggy, Zomato reference archetypes).

## 2. Observable Interaction Journeys
| Interaction ID | User Action | Pre-condition | Observed Result | Engineering Reconstruction |
| :--- | :--- | :--- | :--- | :--- |
| **OBS-001** | Location Change | User on homepage | Top header changes location pin; restaurant catalog updates to delivery zone; estimated time recalculated. | Tenant boundary filter: `Restaurant.objects.filter(area=location.area, is_open=True)` |
| **OBS-002** | Add Dish to Cart | Cart empty | Item counter increments to 1; bottom cart drawer becomes accessible with live subtotal; restaurant locked. | Server validation of item existence, pricing, and restaurant consistency check. |
| **OBS-003** | Cross-Restaurant Add | Cart has items from Restaurant A | Prompt: "Your cart contains items from Restaurant A. Would you like to discard and start fresh with Restaurant B?" | Single-origin cart constraint enforced on client and backend. |
| **OBS-004** | Coupon Application | Subtotal < Minimum | Error banner: "Add ₹X more items to apply coupon". | Authoritative validation of minimum order value threshold. |
| **OBS-005** | Checkout Confirmation | Payment method selected | Loading transition; transaction registered; live tracking timeline initiated with stage 1 (Order Placed). | Atomic DB transaction wrapping order creation, receipt snapshot, and cart flush. |

## 3. Visual & Aesthetic Architecture
- **Palette**: Energetic food orange (`#FC8019`), warm cream (`#FFF1E5`), deep amber accents (`#E86F00`), clean white cards.
- **Micro-interactions**: Particle drift, pill hover lifts, badge bounce, step timeline progression.
