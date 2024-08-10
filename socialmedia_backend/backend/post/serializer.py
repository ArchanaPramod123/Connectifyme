from rest_framework import serializers
from account.models import User
from .models import Posts, Comment, Follow
from account.serializers import UserSerializer


class PostSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), required=False
    ) 
    is_liked = serializers.SerializerMethodField()
    img = serializers.ImageField(required=False)

    class Meta:
        model = Posts
        fields = [
            "id",
            "body",
            "user",
            "img",
            "total_likes",
            "created_time",
            "is_liked",
           
        ]

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response["user"] = UserSerializer(
            instance.user
        ).data  
        return response

    def get_is_liked(self, obj):
        request = self.context.get("request", None)
        if request:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def get_img(self, obj):
        request = self.context.get("request")
        if obj.img and request:
            return request.build_absolute_uri(obj.img.url)
        return None


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "profile_picture", "is_private", "username", "bio"]
        extra_kwargs = {"password": {"write_only": True}}

    def update(self, instance, validated_data):
        print("profile pic", instance.profile_picture)
        print("bio", instance.bio)
        print("username", instance.username)
        print("is_private", instance.is_private)
        instance.profile_picture = validated_data.get(
            "profile_picture", instance.profile_picture
        )

        instance.bio = validated_data.get("bio", instance.bio)
        instance.username = validated_data.get("username", instance.username)
        instance.is_private = validated_data.get("is_private", instance.is_private)
        instance.save()
        return instance


class CommentSerializer(serializers.ModelSerializer):
    user_full_name = serializers.ReadOnlyField(source="user.full_name")
    profile_picture = serializers.ImageField(
        source="user.profile_picture", read_only=True
    )
    created_time = serializers.ReadOnlyField()

    class Meta:
        model = Comment
        fields = [
            "id",
            "post",
            "user",
            "body",
            "profile_picture",
            "created_at",
            "user_full_name",
            "created_time",
        ]
        extra_kwargs = {"user": {"read_only": True}, "post": {"read_only": True}}


# serializers.py
class UserSerializerProfile(serializers.ModelSerializer):
    follower_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    total_posts = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    def get_follower_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()

    def get_total_posts(self, obj):
        return Posts.objects.filter(user=obj, is_deleted=False).count()

    def get_is_following(self, obj):
        request = self.context.get("request", None)
        if request:
            return Follow.objects.filter(follower=request.user, following=obj).exists()
        return False

    class Meta:
        model = User
        fields = [
            "full_name",
            "email",
            "username",
            "bio",
            "profile_picture",
            "phone",
            "follower_count",
            "following_count",
            "total_posts",
            "is_following",
        ]
