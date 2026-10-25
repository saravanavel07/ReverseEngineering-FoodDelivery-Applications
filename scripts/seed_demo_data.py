#!/usr/bin/env python
"""
Deterministic seed data loader for OrangeBite Food Delivery Platform.
Populates restaurants, cuisines, menu items, option groups, coupons, and addresses.
"""
import os
import sys
import django
from decimal import Decimal

# Setup django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from django.contrib.auth.models import User
from apps.accounts.models import CustomerProfile, Address
from apps.restaurants.models import Restaurant, Cuisine
from apps.menu.models import MenuCategory, MenuItem, MenuItemOptionGroup, MenuItemOption
from apps.promotions.models import Coupon

def seed_database():
    print("🌱 Starting OrangeBite deterministic database seeding...")

    # 1. Superuser & Demo User
    user, created = User.objects.get_or_create(
        username='saravana',
        defaults={'email': 'saravana@orangebite.dev', 'first_name': 'Saravana', 'is_staff': True, 'is_superuser': True}
    )
    if created:
        user.set_password('OrangeBite@2026')
        user.save()
        CustomerProfile.objects.create(user=user, phone='9876543210')
        print("  ✓ Created superuser 'saravana' (Pass: OrangeBite@2026)")

    # 2. Addresses
    Address.objects.get_or_create(
        user=user,
        type='Home',
        title='Apt 402, Green Glen Heights',
        defaults={
            'address_line': '80 Feet Main Road, 4th Block, Koramangala, Bengaluru - 560034',
            'landmark': 'Opposite Sony World Signal',
            'contact_number': '+91 98765 43210',
            'is_default': True,
        }
    )
    print("  ✓ Seeded default delivery address")

    # 3. Cuisines
    cuisines_data = [
        ('Biryani', 'biryani', '🍲'),
        ('North Indian', 'north-indian', '🥘'),
        ('South Indian', 'south-indian', '🥞'),
        ('Pizzas & Italian', 'pizzas', '🍕'),
        ('Burgers & Fries', 'burgers', '🍔'),
        ('Chinese & Wok', 'chinese', '🥢'),
    ]
    cuisine_objs = {}
    for name, slug, icon in cuisines_data:
        c, _ = Cuisine.objects.get_or_create(name=name, slug=slug, defaults={'icon': icon})
        cuisine_objs[name] = c
    print(f"  ✓ Seeded {len(cuisine_objs)} cuisines")

    # 4. Restaurants & Menus
    r1, _ = Restaurant.objects.get_or_create(
        name='Meghana Foods Delight',
        slug='meghana-foods-delight',
        defaults={
            'rating': Decimal('4.50'),
            'rating_count': 14200,
            'delivery_time_mins': 28,
            'distance_km': Decimal('2.4'),
            'cost_for_two': 500,
            'area': 'Koramangala 5th Block',
            'city': 'Bengaluru',
            'image_url': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
            'discount_badge': '50% OFF up to ₹100',
        }
    )
    r1.cuisines.add(cuisine_objs['Biryani'], cuisine_objs['North Indian'])

    cat1, _ = MenuCategory.objects.get_or_create(restaurant=r1, name='Biryani Specials', order=1)
    m1, _ = MenuItem.objects.get_or_create(
        restaurant=r1,
        category=cat1,
        name='Special Chicken Biryani',
        defaults={
            'description': 'Authentic aromatic basmati rice layered with tender marinated chicken fry and signature spicy Andhra gravy.',
            'price': Decimal('340.00'),
            'is_veg': False,
            'is_bestseller': True,
            'rating': Decimal('4.70'),
            'rating_count': 3890,
            'in_stock': True,
            'customizable': True,
        }
    )

    grp1, _ = MenuItemOptionGroup.objects.get_or_create(
        menu_item=m1, title='Portion Size', defaults={'required': True, 'max_select': 1}
    )
    MenuItemOption.objects.get_or_create(group=grp1, name='Regular (Serves 1-2)', defaults={'price': Decimal('0.00')})
    MenuItemOption.objects.get_or_create(group=grp1, name='Jumbo Pack (Serves 3)', defaults={'price': Decimal('180.00')})

    # 5. Coupons
    coupons = [
        ('ORANGE50', '50% OFF up to ₹100 on orders above ₹199', 'percentage', Decimal('50.00'), Decimal('199.00'), Decimal('100.00')),
        ('BITE150', 'Flat ₹150 OFF on premium orders above ₹499', 'flat', Decimal('150.00'), Decimal('499.00'), None),
        ('FREESHIP', 'Free Delivery on orders above ₹149', 'flat', Decimal('35.00'), Decimal('149.00'), None),
    ]
    for code, desc, dtype, val, min_val, max_d in coupons:
        Coupon.objects.get_or_create(
            code=code,
            defaults={
                'description': desc,
                'discount_type': dtype,
                'discount_value': val,
                'min_order_value': min_val,
                'max_discount': max_d,
                'is_active': True,
            }
        )
    print("  ✓ Seeded active promotional coupons (ORANGE50, BITE150, FREESHIP)")

    print("✨ Seeding completed successfully!")

if __name__ == '__main__':
    seed_database()
