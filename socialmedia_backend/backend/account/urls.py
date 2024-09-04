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
    path('forgot_pass/', ForgotPassView.as_view(), name='forgot_pass'),
    path('reset_password/<int:id>/',ResetPassword.as_view(),name="reset_password"),
    # path('create-profile/', UserProfileView.as_view(), name='create_profile'),
    path('profile_pic/', UserPictureView.as_view(), name='user-profile'),

    path('adminlogin/',AdminLoginView.as_view(),name="adminlogin"),
    path('user-list/', UserListView.as_view(), name='user_list'),
    path('user-block-unblock/<int:user_id>/', UserBlockUnblockView.as_view(), name='user-block-unblock'),

    # path('report-post/<int:post_id>/', ReportPostView.as_view(), name='report-post'),
    path('admin/reports/', AdminReportListView.as_view(), name='report-list'),
    path('admin/reports/<int:report_id>/', AdminReportListView.as_view(), name='admin-report-action'),



]
