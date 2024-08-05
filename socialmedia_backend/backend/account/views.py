from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, OtpVerificationSerializer
from .models import User
from .emails import send_otp_via_mail, resend_otp_via_mail
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics

# from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated


class UserRegisterView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save(is_active=False)
                send_otp_via_mail(user.email, user.otp)
                response_data = {
                    "message": "OTP sent successfully.",
                    "email": user.email,
                }
                return Response(response_data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(
                    {"error": "Internal Server Error"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response({"message": "error"}, status=status.HTTP_400_BAD_REQUEST)


class OtpVerificationView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = OtpVerificationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                email = serializer.validated_data.get("email")
                entered_otp = serializer.validated_data.get("otp")
                user = User.objects.get(email=email)
                if user.otp == entered_otp:
                    user.is_active = True
                    user.save()
                    response = {
                        "message": "User registered and verified successfully",
                        "email": email,
                        "username": user.full_name,
                    }
                    return Response(response, status=status.HTTP_200_OK)
                else:
                    return Response(
                        {"error": "Invalid OTP, Please Check your email and Verify"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except User.DoesNotExist:
                return Response(
                    {"error": "User not found or already verified"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            except Exception as e:
                return Response(
                    {"error": "Internal Server Error"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResendOtpView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get("email")
        try:
            if email is not None:
                resend_otp_via_mail(email)
                response_data = {"message": "OTP sent successfully.", "email": email}
                return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": "Internal Server Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# class LoginView(APIView):
#     permission_classes = []

#     def post(self, request):
#         email = request.data.get("email")
#         password = request.data.get("password")

#         if not email or not password:
#             return Response(
#                 {"message": "Both email and password are required."},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         try:
#             user = User.objects.get(email=email)
#         except User.DoesNotExist:
#             return Response(
#                 {"message": "Invalid email address."},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         if not user.is_active:
#             return Response(
#                 {"message": "Your account is inactive."},
#                 status=status.HTTP_403_FORBIDDEN,
#             )

#         user = authenticate(username=email, password=password)

#         if user is None:
#             return Response(
#                 {"message": "Invalid email or password."},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         refresh = RefreshToken.for_user(user)
#         access_token = str(refresh.access_token)
#         refresh_token = str(refresh)

#         profile_complete = bool(user.full_name and user.profile_picture and user.background_image and user.bio)

#         content = {
#             "email": user.email,
#             "name": user.full_name,
#             "access_token": access_token,
#             "refresh_token": refresh_token,
#             "isAdmin": user.is_superuser,
#             "profile_complete": profile_complete,
#         }
#         return Response(content, status=status.HTTP_200_OK)

class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"message": "Both email and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"message": "Invalid email address."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.is_active:
            return Response(
                {"message": "Your account is inactive."},
                status=status.HTTP_403_FORBIDDEN,
            )

        user = authenticate(username=email, password=password)

        if user is None:
            return Response(
                {"message": "Invalid email or password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        refresh = RefreshToken.for_user(user)
        refresh['name'] = user.full_name
        refresh['email'] = user.email
        refresh['isAuthenticated'] = user.is_authenticated
        refresh['isAdmin'] = user.is_superuser
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        profile_complete = bool(user.username and user.profile_picture and user.bio)
        print("profilllleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",profile_complete)

        content = {
            "email": user.email,
            "name": user.full_name,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "isAdmin": user.is_superuser,
            "profile_complete": profile_complete,
        }
        return Response(content, status=status.HTTP_200_OK)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            if 'profile_picture' in request.data:
                user.profile_picture = request.data['profile_picture']
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class AdminLoginView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"message": "Both email and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
            if not user.is_superuser:
                return Response(
                    {"message": "Only Admin can login"},
                    status=status.HTTP_403_FORBIDDEN,
                )
        except User.DoesNotExist:
            return Response(
                {"message": "Invalid email address."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=email, password=password)
        if user is None:
            return Response(
                {"message": "Invalid email or password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        content = {
            "email": user.email,
            "name": user.full_name,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "isAdmin": user.is_superuser,
        }
        return Response(content, status=status.HTTP_200_OK)


class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.filter(is_active=True, is_superuser=False)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# class UserProfileView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         serializer = UserProfileSerializer(user)
#         return Response(serializer.data)
