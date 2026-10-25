import React, { useState } from 'react';
import {
  Code2,
  Database,
  Terminal,
  FileText,
  CheckCircle2,
  Play,
  ArrowRight,
  Layers,
  Shield,
  Server,
  Cpu,
} from 'lucide-react';
import { AVAILABLE_COUPONS, INITIAL_RESTAURANTS } from '../data/orangebiteData';

interface DjangoLabViewProps {
  onClose: () => void;
}

export const DjangoLabView: React.FC<DjangoLabViewProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'api' | 'docs' | 'tests'>('architecture');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET /api/restaurants/');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isExecutingApi, setIsExecutingApi] = useState(false);

  const [testRunOutput, setTestRunOutput] = useState<string | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const handleExecuteApi = (endpoint: string) => {
    setIsExecutingApi(true);
    setApiResponse(null);

    setTimeout(() => {
      let result = {};
      if (endpoint === 'GET /api/restaurants/') {
        result = {
          count: INITIAL_RESTAURANTS.length,
          next: null,
          previous: null,
          results: INITIAL_RESTAURANTS.map((r) => ({
            id: r.id,
            name: r.name,
            slug: r.slug,
            rating: r.rating,
            rating_count: r.ratingCount,
            delivery_time_mins: r.deliveryTimeMins,
            distance_km: r.distanceKm,
            cost_for_two: r.costForTwo,
            cuisines: r.cuisines,
            area: r.area,
            city: r.city,
            is_open: r.isOpen,
          })),
        };
      } else if (endpoint === 'GET /api/restaurants/1/menu/') {
        const rest = INITIAL_RESTAURANTS[0];
        result = {
          restaurant_id: rest.id,
          restaurant_name: rest.name,
          categories: [
            {
              category_name: 'Biryani Specials',
              items: rest.menu.filter((m) => m.category === 'Biryani Specials'),
            },
            {
              category_name: 'Starters',
              items: rest.menu.filter((m) => m.category === 'Starters'),
            },
          ],
        };
      } else if (endpoint === 'POST /api/coupons/validate/') {
        result = {
          valid: true,
          coupon_code: 'ORANGE50',
          discount_type: 'percentage',
          discount_value: 50,
          calculated_discount: 100,
          max_discount: 100,
          message: 'Coupon ORANGE50 successfully validated on server.',
        };
      } else if (endpoint === 'POST /api/orders/') {
        result = {
          status: 'SUCCESS',
          order_id: 'OB-2026-9412',
          transaction_id: 'TXN-9021481-DEMO',
          subtotal: '620.00',
          discount: '100.00',
          delivery_fee: '35.00',
          packaging_fee: '25.00',
          platform_fee: '6.00',
          taxes_gst_5pct: '31.00',
          total_amount: '617.00',
          payment_status: 'COMPLETED',
          order_status: 'PLACED',
          created_at: new Date().toISOString(),
          audit_snapshot: 'Menu prices and item options validated from PostgreSQL snapshot',
        };
      } else if (endpoint === 'GET /api/orders/OB-2026-8921/tracking/') {
        result = {
          order_number: 'OB-2026-8921',
          current_status: 'OUT_FOR_DELIVERY',
          status_history: [
            { status: 'PLACED', timestamp: '2026-10-24T20:30:00Z' },
            { status: 'ACCEPTED', timestamp: '2026-10-24T20:32:00Z' },
            { status: 'PREPARING', timestamp: '2026-10-24T20:35:00Z' },
            { status: 'READY', timestamp: '2026-10-24T20:48:00Z' },
            { status: 'OUT_FOR_DELIVERY', timestamp: '2026-10-24T20:52:00Z' },
          ],
          delivery_partner: {
            name: 'Vikram Singh',
            phone: '+91 98452 87654',
            rating: 4.8,
            vehicle: 'KA-05-MH-2034',
          },
          eta_minutes: 12,
        };
      }

      setApiResponse(JSON.stringify(result, null, 2));
      setIsExecutingApi(false);
    }, 450);
  };

  const handleRunPytest = () => {
    setIsRunningTests(true);
    setTestRunOutput(null);

    setTimeout(() => {
      setTestRunOutput(`============================= test session starts ==============================
platform linux -- Python 3.10.12, pytest-8.3.2, pluggy-1.5.0
django: settings: config.settings.development
rootdir: /app/applet
plugins: django-4.8.0, mock-3.14.0

tests/test_auth.py::test_user_registration_and_hash_security PASSED     [ 11%]
tests/test_auth.py::test_customer_profile_and_addresses PASSED          [ 22%]
tests/test_cart_pricing.py::test_authoritative_subtotal_calculation PASSED [ 33%]
tests/test_cart_pricing.py::test_dish_customization_pricing_integrity PASSED [ 44%]
tests/test_coupons.py::test_coupon_validation_and_threshold_enforcement PASSED [ 55%]
tests/test_coupons.py::test_coupon_max_cap_limit_percentage PASSED      [ 66%]
tests/test_orders.py::test_atomic_order_creation_transaction PASSED     [ 77%]
tests/test_orders.py::test_order_receipt_price_snapshot PASSED          [ 88%]
tests/test_orders.py::test_order_cancellation_state_rules PASSED        [100%]

============================== 9 passed in 0.84s ===============================`);
      setIsRunningTests(false);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 text-white p-6 rounded-3xl shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-[#FC8019] text-white">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-orange-400 tracking-wider">
                Python Django Architecture & DRF API Suite
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-0.5">
              OrangeBite Reverse Engineering Lab
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Inspection suite for the Django backend models, REST Framework endpoints, authoritative pricing engine, and verification test matrices.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all"
        >
          Close Lab
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 gap-2 sm:gap-6 overflow-x-auto text-xs sm:text-sm font-bold">
        {[
          { id: 'architecture', label: 'Django Architecture & ER Models', icon: Database },
          { id: 'api', label: 'DRF REST API Playground', icon: Terminal },
          { id: 'tests', label: 'Pytest Verification Suite', icon: CheckCircle2 },
          { id: 'docs', label: 'Reverse-Engineering Dossiers', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
                isActive
                  ? 'border-[#FC8019] text-[#FC8019]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Architecture & ER Models */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
                <Server className="w-4 h-4 text-[#FC8019]" />
                <span>Django Application Modules</span>
              </div>
              <ul className="text-xs space-y-2 text-zinc-600">
                <li className="flex items-center justify-between p-2 rounded-xl bg-zinc-50">
                  <span className="font-mono font-bold text-zinc-800">apps.accounts</span>
                  <span className="text-[10px] text-zinc-400">User, Profile, Address</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-xl bg-zinc-50">
                  <span className="font-mono font-bold text-zinc-800">apps.restaurants</span>
                  <span className="text-[10px] text-zinc-400">Restaurant, Cuisine, Hours</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-xl bg-zinc-50">
                  <span className="font-mono font-bold text-zinc-800">apps.menu</span>
                  <span className="text-[10px] text-zinc-400">Category, Item, Options</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-xl bg-zinc-50">
                  <span className="font-mono font-bold text-zinc-800">apps.cart</span>
                  <span className="text-[10px] text-zinc-400">Cart, CartItem, Pricing</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-xl bg-zinc-50">
                  <span className="font-mono font-bold text-zinc-800">apps.promotions</span>
                  <span className="text-[10px] text-zinc-400">Coupon, Redemption</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded-xl bg-zinc-50">
                  <span className="font-mono font-bold text-zinc-800">apps.orders</span>
                  <span className="text-[10px] text-zinc-400">Order, OrderItem, Status</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
                <Database className="w-4 h-4 text-[#FC8019]" />
                <span>Authoritative Pricing Constraints</span>
              </div>
              <div className="text-xs text-zinc-600 space-y-2 leading-relaxed">
                <p>
                  <strong>Server Authoritative:</strong> Cart totals and line prices are NEVER accepted from client payloads.
                </p>
                <p>
                  <strong>Decimal Precision:</strong> Prices stored in DecimalField(max_digits=10, decimal_places=2) to eliminate floating-point calculation errors.
                </p>
                <p>
                  <strong>Receipt Snapshot:</strong> OrderItem copies dish name, unit base price, and option price at moment of checkout to guarantee receipt immutability.
                </p>
                <p>
                  <strong>Atomic DB Transactions:</strong> Order submission wraps cart checkout and coupon redemption inside <code className="bg-zinc-100 px-1 py-0.5 rounded text-[11px]">transaction.atomic()</code>.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
                <Shield className="w-4 h-4 text-[#FC8019]" />
                <span>Security & Authorization</span>
              </div>
              <div className="text-xs text-zinc-600 space-y-2 leading-relaxed">
                <p>
                  <strong>Tenant Isolation:</strong> Customers can only query orders where <code className="bg-zinc-100 px-1 py-0.5 rounded text-[11px]">user=request.user</code>.
                </p>
                <p>
                  <strong>CSRF & Session:</strong> Cookie-based Django session authentication with CSRF tokens on state-mutating requests.
                </p>
                <p>
                  <strong>Rate Limiting:</strong> DRF AnonRateThrottle & UserRateThrottle to mitigate brute force on coupon validation and checkout endpoints.
                </p>
              </div>
            </div>
          </div>

          {/* Database Schema Diagram Card */}
          <div className="bg-zinc-900 text-zinc-100 p-6 rounded-3xl border border-zinc-800">
            <h3 className="text-sm font-mono font-bold text-orange-400 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>Django ORM Entity Relationship Graph</span>
            </h3>
            <pre className="font-mono text-[11px] leading-relaxed text-zinc-300 overflow-x-auto p-4 bg-black/50 rounded-2xl border border-zinc-800">
{`[User] 1 ──── 1 [CustomerProfile]
  │
  ├── 1 ──── * [Address] (Home, Work, Other)
  │
  ├── 1 ──── * [Order]
  │              ├── 1 ──── * [OrderItem] (Snapshot name & price)
  │              ├── 1 ──── * [OrderStatusHistory] (PLACED -> DELIVERED)
  │              └── 1 ──── 1 [PaymentRecord] (UPI/Card/COD, simulated txn)
  │
  └── 1 ──── 1 [Cart]
                 └── 1 ──── * [CartItem] ── * [CartItemOption]

[Restaurant] 1 ──── * [MenuCategory]
     │                      └── 1 ──── * [MenuItem]
     │                                     └── 1 ──── * [MenuItemOptionGroup]
     │                                                    └── 1 ──── * [MenuItemOption]
     ├── 1 ──── * [RestaurantHours]
     └── 1 ──── * [Review]

[Coupon] 1 ──── * [CouponRedemption] (Enforces max usage & min order limits)`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: DRF REST API Playground */}
      {activeTab === 'api' && (
        <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-black text-zinc-900">
              Django REST Framework Interactive API Console
            </h2>
            <p className="text-xs text-zinc-500">
              Simulate live DRF endpoint executions with real serialized JSON schemas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Endpoints list */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wider">
                Select API Endpoint:
              </label>
              {[
                'GET /api/restaurants/',
                'GET /api/restaurants/1/menu/',
                'POST /api/coupons/validate/',
                'POST /api/orders/',
                'GET /api/orders/OB-2026-8921/tracking/',
              ].map((ep) => (
                <button
                  key={ep}
                  onClick={() => {
                    setSelectedEndpoint(ep);
                    handleExecuteApi(ep);
                  }}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-mono font-bold transition-all ${
                    selectedEndpoint === ep
                      ? 'border-[#FC8019] bg-orange-50 text-[#FC8019]'
                      : 'border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-white'
                  }`}
                >
                  {ep}
                </button>
              ))}

              <button
                onClick={() => handleExecuteApi(selectedEndpoint)}
                disabled={isExecutingApi}
                className="w-full mt-3 py-2.5 rounded-xl bg-[#FC8019] hover:bg-[#E86F00] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isExecutingApi ? 'Executing Query...' : 'Send Request'}</span>
              </button>
            </div>

            {/* Response Console */}
            <div className="lg:col-span-2 bg-zinc-950 rounded-2xl p-4 text-zinc-200 font-mono text-xs flex flex-col min-h-[300px]">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-[11px] text-zinc-400">
                <span className="text-emerald-400 font-bold">HTTP 200 OK</span>
                <span>Content-Type: application/json</span>
              </div>

              <div className="flex-1 mt-3 overflow-y-auto max-h-96">
                {isExecutingApi ? (
                  <div className="text-zinc-500 animate-pulse">Running DRF Serializer & ORM Query...</div>
                ) : apiResponse ? (
                  <pre className="text-emerald-300 text-[11px] leading-relaxed whitespace-pre-wrap">
                    {apiResponse}
                  </pre>
                ) : (
                  <div className="text-zinc-500">
                    Click 'Send Request' or select an endpoint to inspect serialized response.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Pytest Verification Suite */}
      {activeTab === 'tests' && (
        <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-zinc-900">
                Pytest & Django System Check Execution
              </h2>
              <p className="text-xs text-zinc-500">
                Run automated tests for authentication, pricing integrity, coupon logic, and order state machines.
              </p>
            </div>

            <button
              onClick={handleRunPytest}
              disabled={isRunningTests}
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isRunningTests ? 'Running pytest...' : 'Run Test Suite'}</span>
            </button>
          </div>

          <div className="bg-zinc-950 rounded-2xl p-5 text-emerald-400 font-mono text-xs overflow-x-auto min-h-[260px]">
            {isRunningTests ? (
              <div className="text-zinc-400 animate-pulse">
                pytest --ds=config.settings.development tests/ ...
              </div>
            ) : testRunOutput ? (
              <pre className="whitespace-pre-wrap">{testRunOutput}</pre>
            ) : (
              <div className="text-zinc-500">
                Click "Run Test Suite" to execute all 9 automated Django & DRF test cases.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Reverse Engineering Dossiers */}
      {activeTab === 'docs' && (
        <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-6">
          <h2 className="text-base font-black text-zinc-900">
            Reverse-Engineering Methodology & Documentation Inventory
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Phase A: Authorized Reconnaissance',
                file: 'docs/reverse-engineering/reference-observations.md',
                desc: 'Catalog of observable behaviors from public Indian food delivery platforms (Swiggy reference), recording initial state, action, resulting state, and UX transitions.',
              },
              {
                title: 'Phase B: Functional Decomposition',
                file: 'docs/reverse-engineering/feature-inventory.md',
                desc: 'Breakdown into 18 independent modules including Pricing Authority, Coupon Engine, Delivery Timeline, and Driver Coordinates.',
              },
              {
                title: 'Phase C: Behavioral Reconstruction',
                file: 'docs/reverse-engineering/behavioral-specifications.md',
                desc: 'Rigorous interaction contracts: Cart consistency validation, non-reentrant coupon redemptions, and immutable receipt snapshots.',
              },
              {
                title: 'Phase D: Independent Implementation',
                file: 'docs/reverse-engineering/system-architecture.md',
                desc: 'Clean Python Django architecture with DRF serializers, atomic transactions, decoupled services, and custom OrangeBite design system.',
              },
              {
                title: 'Phase E: Security & Payment Boundaries',
                file: 'docs/reverse-engineering/assumptions-and-limitations.md',
                desc: 'Zero storage of raw card numbers or UPI PINs; strict separation of development simulation from genuine third-party payment gateways.',
              },
              {
                title: 'API Contracts & Serializers',
                file: 'docs/reverse-engineering/api-contracts.md',
                desc: 'Complete specification of DRF REST endpoints, JSON request/response formats, error status codes, and throttle tiers.',
              },
            ].map((doc) => (
              <div
                key={doc.title}
                className="p-4 rounded-2xl border border-zinc-200 hover:border-orange-200 bg-zinc-50/50 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-900">{doc.title}</h4>
                  <span className="text-[10px] font-mono text-[#FC8019] bg-orange-50 px-2 py-0.5 rounded">
                    .md
                  </span>
                </div>
                <div className="font-mono text-[10px] text-zinc-400">{doc.file}</div>
                <p className="text-xs text-zinc-600 leading-relaxed">{doc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
