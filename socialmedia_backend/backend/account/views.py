from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, OtpVerificationSerializer,UserPicSerializer
from .models import User
from .emails import send_otp_via_mail, resend_otp_via_mail,forgot_password_mail
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from post.models import PostReport,Posts
from post.serializer import ReportSerializer


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


class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        print("display the email and password",email,password)

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
        print("the authentication login user",user)

        if user is None:
            return Response(
                {"message": "Invalid email or password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        refresh = RefreshToken.for_user(user)
        refresh["user_id"] = user.id
        refresh["name"] = user.full_name
        # refresh["profile_picture"] = user.profile_picture.url
        refresh["email"] = user.email
        refresh["isAuthenticated"] = user.is_authenticated
        refresh["isAdmin"] = user.is_superuser
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        profile_complete = bool(user.username and user.profile_picture and user.bio)
        print("profilllleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", profile_complete)
        print("user idddddddddddddddddddddddddddddddddddddddddd",user.id)
        # print("user profile pictureeeeeeeeeeeeeeeeeeeeeeeeee",user.profile_picture.url)

        content = {
            "user_id": user.id, 
            "email": user.email,
            "name": user.full_name,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "isAdmin": user.is_superuser,
            "profile_complete": profile_complete,
        }
        return Response(content, status=status.HTTP_200_OK)
    


class ForgotPassView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get('email')
        try:
            if not User.objects.filter(email=email).exists():
                return Response({"message": "Invalid email address"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
            
            if not User.objects.filter(email=email, is_active=True).exists():
                return Response({"message": "You are blocked by admin"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
            
            user = User.objects.get(email=email)
            print("the user id is",user.pk)
            forgot_password_mail(email, user.pk)

            response_data = {
                'message': 'Password reset link sent. Please check your email.',
                'email': email  
            }
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"message": "Error"}, status=status.HTTP_400_BAD_REQUEST)



class ResetPassword(APIView):
    permission_classes = []
    
    def post(self, request,id):
        password = request.data.get('password')
        id = request.data.get('id')
        
        try:
            user = User.objects.get(pk=id)
            if user:
                user.set_password(password)
                user.save()
                # usertype = user.user_type
                return Response({"message": "Password reset success"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)





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
        refresh["user_id"] = user.id
        refresh["name"] = user.full_name
        refresh["email"] = user.email
        refresh["isAuthenticated"] = user.is_authenticated
        refresh["isAdmin"] = user.is_superuser
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        content = {
            "user_id":user.id,
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
        users = User.objects.filter(is_superuser=False)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserBlockUnblockView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user.is_active = request.data.get('is_active', user.is_active)
            user.save()
            return Response({"status": "success", "message": "User status updated successfully."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"status": "error", "message": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class AdminReportListView(APIView):
    def get(self, request):
        reports = PostReport.objects.all().select_related('post', 'reporter')
        serializer = ReportSerializer(reports, many=True)
        print("the report serilizer rezponse",serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, report_id):
        try:
            report = PostReport.objects.get(id=report_id)
            action = request.data.get('action')

            if action == 'block':
                report.post.is_blocked = True
                report.post.save()
                return Response({"message": "Post has been blocked"}, status=status.HTTP_200_OK)

            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
        except PostReport.DoesNotExist:
            return Response({"error": "Report not found"}, status=status.HTTP_404_NOT_FOUND)
        

class UserPictureView(generics.RetrieveAPIView):
    serializer_class = UserPicSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        print("the printedhdc------------------",self.request.user)
        print("the printedhdc------------------",self.request.user.profile_picture)
        return self.request.user