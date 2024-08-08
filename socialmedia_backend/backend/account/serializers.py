from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "full_name",
            "phone",
            "email",
            "username",
            "password",
            "is_active",
            "bio",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "is_active": {"default": False},
        }

    def create(self, validated_data):
        user = User(
            email=validated_data["email"],
            full_name=validated_data["full_name"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class OtpVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
