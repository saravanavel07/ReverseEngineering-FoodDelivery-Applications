from apps.restaurants.models import Restaurant
from apps.menu.models import MenuItem

class RecommendationService:
    @staticmethod
    def get_recommendations(user=None, veg_only=False, max_budget=None, preferred_cuisine=None):
        """
        Transparent rule-based recommendation engine powered entirely by Django ORM.
        Ranking logic:
        1. Filters active open restaurants.
        2. Applies vegetarian and budget constraints.
        3. Sorts by combination of historical rating and delivery SLA speed.
        """
        queryset = Restaurant.objects.filter(is_open=True)

        if veg_only:
            queryset = queryset.filter(is_veg_only=True)

        if max_budget:
            queryset = queryset.filter(cost_for_two__lte=max_budget)

        if preferred_cuisine:
            queryset = queryset.filter(cuisines__name__icontains=preferred_cuisine)

        # Ranked by rating and delivery speed
        ranked_restaurants = queryset.order_by('-rating', 'delivery_time_mins')[:10]

        # Top popular dishes
        dishes = MenuItem.objects.filter(restaurant__in=ranked_restaurants, in_stock=True)
        if veg_only:
            dishes = dishes.filter(is_veg=True)
        popular_dishes = dishes.filter(is_bestseller=True).order_by('-rating')[:12]

        return {
            'ranking_logic': 'Rule-based: Rating score weighted against delivery time SLA with strict dietary filter',
            'recommended_restaurants': ranked_restaurants,
            'popular_dishes': popular_dishes,
        }
