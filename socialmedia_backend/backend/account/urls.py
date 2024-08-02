from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    

    path('register/', UserRegisterView.as_view(), name='register_user'),
    path('login/', LoginView.as_view(), name='login_user'),
    # path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('verify-otp/', OtpVerificationView.as_view(), name='verify_otp'),
    path('resend-otp/', ResendOtpView.as_view(), name='resend_otp'),
    path('create-profile/', UserProfileView.as_view(), name='create_profile'),

    path('adminlogin/',AdminLoginView.as_view(),name="adminlogin"),
    path('user-list/', UserListView.as_view(), name='user_list'),



]
