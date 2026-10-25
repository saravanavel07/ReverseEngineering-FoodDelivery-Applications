from rest_framework import views, status
from rest_framework.response import Response
from decimal import Decimal
from .services import CouponService

class ValidateCouponView(views.APIView):
    def post(self, request):
        code = request.data.get('coupon_code', '')
        subtotal_str = request.data.get('subtotal', '0')

        try:
            subtotal = Decimal(str(subtotal_str))
        except Exception:
            return Response({'error': 'Invalid subtotal provided'}, status=status.HTTP_400_BAD_REQUEST)

        result = CouponService.validate_and_calculate_discount(code, subtotal, request.user if request.user.is_authenticated else None)
        if not result['valid']:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        return Response(result, status=status.HTTP_200_OK)
