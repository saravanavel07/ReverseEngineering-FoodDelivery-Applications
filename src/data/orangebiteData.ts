export interface MenuItemOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItemOptionGroup {
  id: string;
  title: string;
  required: boolean;
  minSelect?: number;
  maxSelect?: number;
  options: MenuItemOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  isBestseller?: boolean;
  rating: number;
  ratingCount: number;
  image: string;
  category: string;
  inStock: boolean;
  customizable?: boolean;
  optionGroups?: MenuItemOptionGroup[];
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  rating: number;
  ratingCount: number;
  deliveryTimeMins: number;
  distanceKm: number;
  costForTwo: number;
  cuisines: string[];
  area: string;
  city: string;
  image: string;
  isVegOnly?: boolean;
  isOpen: boolean;
  discountBadge?: string;
  menu: MenuItem[];
}

export interface CartItemOptionSelected {
  groupId: string;
  groupTitle: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  id: string; // unique cart line id
  menuItemId: string;
  name: string;
  price: number; // base price
  quantity: number;
  isVeg: boolean;
  selectedOptions: CartItemOptionSelected[];
  totalItemPrice: number; // (base + options) * quantity
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
}

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  title: string;
  addressLine: string;
  landmark?: string;
  contactNumber: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  restaurantId: string;
  restaurantName: string;
  restaurantArea: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  packagingFee: number;
  platformFee: number;
  taxes: number;
  discount: number;
  totalAmount: number;
  couponCode?: string;
  address: Address;
  paymentMethod: 'UPI' | 'Card' | 'COD' | 'Netbanking';
  paymentStatus: 'COMPLETED' | 'PENDING' | 'REFUNDED';
  orderStatus: 'PLACED' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  estimatedDeliveryTime: string;
  deliveryPartner?: {
    name: string;
    phone: string;
    rating: number;
    vehicleNumber: string;
  };
}

export const POPULAR_LOCATIONS = [
  { id: 'blr-kor', name: 'Koramangala, 5th Block', city: 'Bengaluru' },
  { id: 'blr-ind', name: 'Indiranagar, 100ft Road', city: 'Bengaluru' },
  { id: 'blr-hsr', name: 'HSR Layout, Sector 2', city: 'Bengaluru' },
  { id: 'mum-ban', name: 'Bandra West, Hill Road', city: 'Mumbai' },
  { id: 'del-cp', name: 'Connaught Place, Radial Road', city: 'New Delhi' },
  { id: 'hyd-jub', name: 'Jubilee Hills, Road No. 36', city: 'Hyderabad' },
];

export const CUISINE_CATEGORIES = [
  { id: 'biryani', name: 'Biryani', icon: '🍲', count: 18 },
  { id: 'north-indian', name: 'North Indian', icon: '🥘', count: 24 },
  { id: 'south-indian', name: 'South Indian', icon: '🥞', count: 15 },
  { id: 'pizza', name: 'Pizzas & Italian', icon: '🍕', count: 12 },
  { id: 'burgers', name: 'Burgers & Fries', icon: '🍔', count: 14 },
  { id: 'chinese', name: 'Chinese & Wok', icon: '🥢', count: 19 },
  { id: 'desserts', name: 'Desserts & Sweets', icon: '🍰', count: 11 },
  { id: 'healthy', name: 'Salads & Bowls', icon: '🥗', count: 9 },
  { id: 'rolls', name: 'Kathi Rolls & Wraps', icon: '🌯', count: 16 },
];

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'ORANGE50',
    description: '50% OFF up to ₹100 on orders above ₹199',
    discountType: 'percentage',
    discountValue: 50,
    minOrderValue: 199,
    maxDiscount: 100,
  },
  {
    code: 'BITE150',
    description: 'Flat ₹150 OFF on premium orders above ₹499',
    discountType: 'flat',
    discountValue: 150,
    minOrderValue: 499,
  },
  {
    code: 'FEAST20',
    description: '20% OFF up to ₹120 on party orders above ₹399',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 399,
    maxDiscount: 120,
  },
  {
    code: 'FREESHIP',
    description: 'Free Delivery on orders above ₹149',
    discountType: 'flat',
    discountValue: 35,
    minOrderValue: 149,
  },
];

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    type: 'Home',
    title: 'Apt 402, Green Glen Heights',
    addressLine: '80 Feet Main Road, 4th Block, Koramangala, Bengaluru - 560034',
    landmark: 'Opposite Sony World Signal',
    contactNumber: '+91 98765 43210',
    isDefault: true,
  },
  {
    id: 'addr-2',
    type: 'Work',
    title: 'OrangeBite Tech Park, Tower B',
    addressLine: '6th Floor, Embassy GolfLinks Business Park, Domlur, Bengaluru - 560071',
    landmark: 'Near Dell Gate 2',
    contactNumber: '+91 98765 43210',
  },
];

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Meghana Foods Delight',
    slug: 'meghana-foods-delight',
    rating: 4.5,
    ratingCount: 14200,
    deliveryTimeMins: 28,
    distanceKm: 2.4,
    costForTwo: 500,
    cuisines: ['Biryani', 'Andhra', 'North Indian'],
    area: 'Koramangala 5th Block',
    city: 'Bengaluru',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    isOpen: true,
    discountBadge: '50% OFF up to ₹100',
    menu: [
      {
        id: 'm1-1',
        name: 'Special Chicken Biryani',
        description: 'Authentic aromatic basmati rice layered with tender marinated chicken fry and signature spicy Andhra gravy.',
        price: 340,
        isVeg: false,
        isBestseller: true,
        rating: 4.7,
        ratingCount: 3890,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
        category: 'Biryani Specials',
        inStock: true,
        customizable: true,
        optionGroups: [
          {
            id: 'portion',
            title: 'Portion Size',
            required: true,
            options: [
              { id: 'reg', name: 'Regular (Serves 1-2)', price: 0 },
              { id: 'jumbo', name: 'Jumbo Pack (Serves 3)', price: 180 },
            ],
          },
          {
            id: 'spice',
            title: 'Spice Level',
            required: true,
            options: [
              { id: 'med', name: 'Medium Andhra Spice', price: 0 },
              { id: 'hot', name: 'Authentic Fiery Spice', price: 0 },
            ],
          },
          {
            id: 'addons',
            title: 'Extra Accompaniments',
            required: false,
            options: [
              { id: 'raita', name: 'Extra Onion Cucumber Raita', price: 30 },
              { id: 'salan', name: 'Extra Mirchi Ka Salan', price: 40 },
              { id: 'egg', name: 'Boiled Egg (2 pcs)', price: 45 },
            ],
          },
        ],
      },
      {
        id: 'm1-2',
        name: 'Paneer Butter Masala Biryani',
        description: 'Rich vegetarian treat with char-grilled cottage cheese cubes simmered in spiced makhani rice.',
        price: 290,
        isVeg: true,
        isBestseller: true,
        rating: 4.4,
        ratingCount: 1250,
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80',
        category: 'Biryani Specials',
        inStock: true,
        customizable: true,
        optionGroups: [
          {
            id: 'addons',
            title: 'Add-ons',
            required: false,
            options: [
              { id: 'cheese', name: 'Extra Grated Paneer', price: 50 },
              { id: 'papad', name: 'Roasted Masala Papad', price: 25 },
            ],
          },
        ],
      },
      {
        id: 'm1-3',
        name: 'Andhra Chilli Chicken',
        description: 'Crispy chicken morsels tossed in crushed green chillies, curry leaves, and secret house spices.',
        price: 280,
        isVeg: false,
        isBestseller: true,
        rating: 4.6,
        ratingCount: 2100,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
        category: 'Starters',
        inStock: true,
      },
      {
        id: 'm1-4',
        name: 'Crispy Baby Corn Pepper Fry',
        description: 'Tender baby corn golden fried with black pepper, bell peppers, and scallions.',
        price: 220,
        isVeg: true,
        rating: 4.2,
        ratingCount: 680,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        category: 'Starters',
        inStock: true,
      },
      {
        id: 'm1-5',
        name: 'Gulab Jamun (2 Pcs)',
        description: 'Warm melt-in-the-mouth khoya dumplings soaked in saffron and cardamom scented rose syrup.',
        price: 85,
        isVeg: true,
        rating: 4.8,
        ratingCount: 920,
        image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14d48?w=600&auto=format&fit=crop&q=80',
        category: 'Desserts',
        inStock: true,
      },
    ],
  },
  {
    id: 'rest-2',
    name: 'Artisan Woodfire Pizzeria',
    slug: 'artisan-woodfire-pizzeria',
    rating: 4.6,
    ratingCount: 8900,
    deliveryTimeMins: 32,
    distanceKm: 3.1,
    costForTwo: 750,
    cuisines: ['Pizzas & Italian', 'Fast Food'],
    area: 'Indiranagar 12th Main',
    city: 'Bengaluru',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    isOpen: true,
    discountBadge: 'FLAT ₹150 OFF',
    menu: [
      {
        id: 'm2-1',
        name: 'Truffle Mushroom Burrata Pizza',
        description: 'San Marzano tomato base, slow-roasted wild mushrooms, fresh burrata crown, white truffle drizzle on 48h fermented sourdough.',
        price: 520,
        isVeg: true,
        isBestseller: true,
        rating: 4.8,
        ratingCount: 1680,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
        category: 'Woodfired Pizzas',
        inStock: true,
        customizable: true,
        optionGroups: [
          {
            id: 'crust',
            title: 'Crust Preference',
            required: true,
            options: [
              { id: 'neapolitan', name: 'Classic Neapolitan Airy Crust', price: 0 },
              { id: 'cheese-crust', name: 'Mozzarella Stuffed Crust', price: 95 },
            ],
          },
          {
            id: 'dips',
            title: 'House Dips',
            required: false,
            options: [
              { id: 'garlic-butter', name: 'Garlic Confit Herb Butter', price: 40 },
              { id: 'peri-mayo', name: 'Smoked Peri Peri Aioli', price: 40 },
            ],
          },
        ],
      },
      {
        id: 'm2-2',
        name: 'Smoked Pepperoni Feast',
        description: 'Imported pepperoni slices, mozzarella fior di latte, hot honey drizzle, fresh basil on crisp blistered crust.',
        price: 580,
        isVeg: false,
        isBestseller: true,
        rating: 4.7,
        ratingCount: 2240,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80',
        category: 'Woodfired Pizzas',
        inStock: true,
        customizable: true,
      },
      {
        id: 'm2-3',
        name: 'Garlic Pull-Apart Herb Bread',
        description: 'Brioche pull-apart loaf baked with roasted garlic herb butter and melted mozzarella core.',
        price: 210,
        isVeg: true,
        isBestseller: true,
        rating: 4.5,
        ratingCount: 1450,
        image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=600&auto=format&fit=crop&q=80',
        category: 'Sides & Breads',
        inStock: true,
      },
      {
        id: 'm2-4',
        name: 'Classic Italian Tiramisu',
        description: 'Espresso-soaked savoiardi biscuits layered with silky mascarpone zabaglione and Dutch cocoa powder.',
        price: 240,
        isVeg: true,
        rating: 4.9,
        ratingCount: 1100,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80',
        category: 'Desserts',
        inStock: true,
      },
    ],
  },
  {
    id: 'rest-3',
    name: 'Sree Krishna Veg Haven',
    slug: 'sree-krishna-veg-haven',
    rating: 4.7,
    ratingCount: 19800,
    deliveryTimeMins: 20,
    distanceKm: 1.5,
    costForTwo: 300,
    cuisines: ['South Indian', 'Breakfast', 'Healthy'],
    area: 'HSR Sector 1',
    city: 'Bengaluru',
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&auto=format&fit=crop&q=80',
    isVegOnly: true,
    isOpen: true,
    discountBadge: '20% OFF',
    menu: [
      {
        id: 'm3-1',
        name: 'Ghee Podi Butter Masala Dosa',
        description: 'Golden crispy red-rice batter dosa smeared with aromatic Gunpowder spice and pure A2 Desi Ghee with potato roast.',
        price: 135,
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 5200,
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
        category: 'Signature Dosas',
        inStock: true,
        customizable: true,
        optionGroups: [
          {
            id: 'chutney',
            title: 'Chutney Preference',
            required: false,
            options: [
              { id: 'extra-coconut', name: 'Extra Coconut Chutney', price: 15 },
              { id: 'tomato-chilli', name: 'Spicy Tomato Garlic Chutney', price: 15 },
            ],
          },
        ],
      },
      {
        id: 'm3-2',
        name: 'Steamed Button Thatte Idli (2 Pcs)',
        description: 'Pillow-soft fermented rice-lentil steamed cakes drenched in hot drumstick sambar and coconut dip.',
        price: 75,
        isVeg: true,
        isBestseller: true,
        rating: 4.8,
        ratingCount: 3400,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
        category: 'Tiffin Specials',
        inStock: true,
      },
      {
        id: 'm3-3',
        name: 'Crispy Medu Vada (2 Pcs)',
        description: 'Deep fried crispy urad dal doughnuts tempered with cracked pepper, ginger, and curry leaves.',
        price: 70,
        isVeg: true,
        rating: 4.6,
        ratingCount: 2200,
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80',
        category: 'Tiffin Specials',
        inStock: true,
      },
      {
        id: 'm3-4',
        name: 'Traditional Filter Kaapi',
        description: 'Freshly decocted chicory blend roasted coffee frothed with boiling whole milk in brass davarah.',
        price: 50,
        isVeg: true,
        rating: 4.9,
        ratingCount: 4100,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
        category: 'Beverages',
        inStock: true,
      },
    ],
  },
  {
    id: 'rest-4',
    name: 'The Burger Republic',
    slug: 'the-burger-republic',
    rating: 4.3,
    ratingCount: 6400,
    deliveryTimeMins: 26,
    distanceKm: 2.8,
    costForTwo: 450,
    cuisines: ['Burgers & Fries', 'Fast Food'],
    area: 'Koramangala 4th Block',
    city: 'Bengaluru',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    isOpen: true,
    discountBadge: 'FREE DELIVERY',
    menu: [
      {
        id: 'm4-1',
        name: 'Smoky BBQ Smash Bacon Burger',
        description: 'Double grilled seasoned smashed patties, oak-smoked bacon, double cheddar cheese, caramelized onions on toasted brioche.',
        price: 360,
        isVeg: false,
        isBestseller: true,
        rating: 4.6,
        ratingCount: 1780,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        category: 'Craft Burgers',
        inStock: true,
        customizable: true,
        optionGroups: [
          {
            id: 'fries-side',
            title: 'Add Fries & Drink Combo',
            required: false,
            options: [
              { id: 'peri-peri', name: 'Peri Peri Shake Fries + Coke Zero', price: 110 },
              { id: 'onion-rings', name: 'Crispy Beer Battered Onion Rings', price: 90 },
            ],
          },
        ],
      },
      {
        id: 'm4-2',
        name: 'Crispy Paneer Makhani Burger',
        description: 'Spiced panko coated paneer patty, tandoori slaw, mint mayo, pickled gherkins on sesame seed bun.',
        price: 260,
        isVeg: true,
        isBestseller: true,
        rating: 4.4,
        ratingCount: 1320,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
        category: 'Craft Burgers',
        inStock: true,
      },
      {
        id: 'm4-3',
        name: 'Loaded Truffle Parmesan Fries',
        description: 'Skin-on golden french fries tossed with sea salt, white truffle oil, rosemary, and aged parmesan.',
        price: 190,
        isVeg: true,
        rating: 4.5,
        ratingCount: 950,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
        category: 'Sides & Fries',
        inStock: true,
      },
    ],
  },
  {
    id: 'rest-5',
    name: 'Wok Master Chinese Express',
    slug: 'wok-master-chinese-express',
    rating: 4.4,
    ratingCount: 7100,
    deliveryTimeMins: 30,
    distanceKm: 3.4,
    costForTwo: 550,
    cuisines: ['Chinese & Wok', 'Asian'],
    area: 'Indiranagar',
    city: 'Bengaluru',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80',
    isOpen: true,
    discountBadge: '50% OFF up to ₹100',
    menu: [
      {
        id: 'm5-1',
        name: 'Chilli Garlic Hakka Noodles',
        description: 'Wok tossed fresh wheat noodles with charred garlic, bird eye chillies, crisp cabbage, and spring onions.',
        price: 240,
        isVeg: true,
        isBestseller: true,
        rating: 4.5,
        ratingCount: 1890,
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
        category: 'Noodles & Rice',
        inStock: true,
        customizable: true,
        optionGroups: [
          {
            id: 'protein',
            title: 'Choose Protein',
            required: true,
            options: [
              { id: 'veg', name: 'Fresh Veggies & Tofu', price: 0 },
              { id: 'chicken', name: 'Shredded Chicken Breast', price: 60 },
              { id: 'prawns', name: 'Butter Garlic Prawns', price: 110 },
            ],
          },
        ],
      },
      {
        id: 'm5-2',
        name: 'Crispy Schezwan Dragon Chicken',
        description: 'Crisp fried chicken fingers tossed in spicy homemade Sichuan pepper sauce with roasted cashews.',
        price: 295,
        isVeg: false,
        isBestseller: true,
        rating: 4.7,
        ratingCount: 2100,
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop&q=80',
        category: 'Appetizers',
        inStock: true,
      },
    ],
  },
  {
    id: 'rest-6',
    name: 'Punjab Grill House',
    slug: 'punjab-grill-house',
    rating: 4.5,
    ratingCount: 11200,
    deliveryTimeMins: 35,
    distanceKm: 4.0,
    costForTwo: 650,
    cuisines: ['North Indian', 'Tandoor & Mughlai'],
    area: 'BTM Layout',
    city: 'Bengaluru',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
    isOpen: true,
    discountBadge: 'FLAT ₹150 OFF',
    menu: [
      {
        id: 'm6-1',
        name: 'Murgh Makhani (Butter Chicken)',
        description: 'Tender tandoor smoked chicken steeped in a velvety tomato makhani gravy enriched with fresh butter and cream.',
        price: 360,
        isVeg: false,
        isBestseller: true,
        rating: 4.8,
        ratingCount: 3950,
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80',
        category: 'Main Course',
        inStock: true,
      },
      {
        id: 'm6-2',
        name: 'Dal Makhani Bukhara Style',
        description: 'Black lentils slow cooked overnight on charcoal embers with butter, cream, and sun-ripened tomatoes.',
        price: 280,
        isVeg: true,
        isBestseller: true,
        rating: 4.7,
        ratingCount: 2400,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
        category: 'Main Course',
        inStock: true,
      },
      {
        id: 'm6-3',
        name: 'Garlic Butter Naan (2 Pcs)',
        description: 'Refined flour leavened bread baked in clay tandoor and brushed generously with garlic butter.',
        price: 110,
        isVeg: true,
        rating: 4.6,
        ratingCount: 3100,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
        category: 'Tandoor Breads',
        inStock: true,
      },
    ],
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-8921',
    orderNumber: 'OB-2026-8921',
    restaurantId: 'rest-1',
    restaurantName: 'Meghana Foods Delight',
    restaurantArea: 'Koramangala 5th Block',
    items: [
      {
        id: 'c-1',
        menuItemId: 'm1-1',
        name: 'Special Chicken Biryani',
        price: 340,
        quantity: 1,
        isVeg: false,
        selectedOptions: [
          { groupId: 'portion', groupTitle: 'Portion Size', optionId: 'reg', optionName: 'Regular (Serves 1-2)', price: 0 },
          { groupId: 'spice', groupTitle: 'Spice Level', optionId: 'med', optionName: 'Medium Andhra Spice', price: 0 },
        ],
        totalItemPrice: 340,
      },
      {
        id: 'c-2',
        menuItemId: 'm1-3',
        name: 'Andhra Chilli Chicken',
        price: 280,
        quantity: 1,
        isVeg: false,
        selectedOptions: [],
        totalItemPrice: 280,
      },
    ],
    subtotal: 620,
    deliveryFee: 35,
    packagingFee: 25,
    platformFee: 6,
    taxes: 31,
    discount: 100,
    totalAmount: 617,
    couponCode: 'ORANGE50',
    address: INITIAL_ADDRESSES[0],
    paymentMethod: 'UPI',
    paymentStatus: 'COMPLETED',
    orderStatus: 'DELIVERED',
    createdAt: '2026-10-23T19:30:00Z',
    estimatedDeliveryTime: '30 mins',
    deliveryPartner: {
      name: 'Ramesh Kumar',
      phone: '+91 98450 11223',
      rating: 4.9,
      vehicleNumber: 'KA-01-ET-4890',
    },
  },
];
