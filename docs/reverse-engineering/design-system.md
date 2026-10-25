# OrangeBite Design System & Token Specifications

## 1. Color Palette Tokens
| Token | Hex Value | Semantic Role |
| :--- | :--- | :--- |
| `primary` | `#FC8019` | Brand accent, primary action buttons, key highlights |
| `primary-dark` | `#E86F00` | Hover states, active pressed states, gradient transitions |
| `primary-light` | `#FFF1E5` | Card backgrounds, badge fills, subtle borders |
| `bg-alt` | `#FFF9F4` | Alternate section background, modal tint |
| `text-main` | `#202124` | Primary titles, dish names, prices |
| `text-muted` | `#686B78` | Descriptions, secondary meta, SLA durations |
| `border` | `#E8E8E8` | Card dividers, input borders |
| `success` | `#16803C` | Veg indicators, ratings pills, order delivered |
| `error` | `#C62828` | Non-veg indicators, errors, order cancellation |

## 2. Typography
- **Headings & Badges**: Outfit / Plus Jakarta Sans font with 700/800 font weights.
- **Body & Captions**: Plus Jakarta Sans with 400/500/600 font weights.

## 3. Motion & Particles
- Canvas-powered orange particle background with gentle vertical drift (-0.15 to -0.45 px/frame).
- Automatic suspension when `document.hidden` is true or when user prefers reduced motion (`prefers-reduced-motion: reduce`).
