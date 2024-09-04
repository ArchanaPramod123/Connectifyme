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
            "profile_picture",  
            "is_private",
            "reported_post_count",
   
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
    def get_reported_post_count(self, obj):
        return obj.reported_post_count()
    
  
class UserPicSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = [
            "id",
            "profile_picture",  
            
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "is_active": {"default": False},
        }
    def get_profile_picture(self, obj):
        if obj.profile_picture and hasattr(obj.profile_picture, 'url'):
            return obj.profile_picture.url  # Return the relative URL directly
        return None

class OtpVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
