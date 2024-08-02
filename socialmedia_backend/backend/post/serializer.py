from rest_framework import serializers
from account.models import User
from .models import Posts,Comment,Follow
from account.serializers import UserSerializer

# class PostSerializer(serializers.ModelSerializer):
#     user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)  # Accept user ID for creation
#     is_liked = serializers.SerializerMethodField()

#     class Meta:
#         model = Posts
#         fields = ['id', 'body', 'user', 'img', 'total_likes', 'created_time','is_liked']

#     def to_representation(self, instance):
#         response = super().to_representation(instance)
#         response['user'] = UserSerializer(instance.user).data  # Include full user data in the response
#         return response
    
#     def get_is_liked(self, obj):
#         request = self.context.get('request', None)
#         if request:
#             return obj.likes.filter(id=request.user.id).exists()
#         return False



class PostSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)  # Accept user ID for creation
    is_liked = serializers.SerializerMethodField()
    # img = serializers.SerializerMethodField()
    img = serializers.ImageField(required=False)

    class Meta:
        model = Posts
        fields = ['id', 'body', 'user', 'img', 'total_likes', 'created_time', 'is_liked']

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['user'] = UserSerializer(instance.user).data  # Include full user data in the response
        return response
    
    def get_is_liked(self, obj):
        request = self.context.get('request', None)
        if request:
            return obj.likes.filter(id=request.user.id).exists()
        return False
    def get_img(self, obj):
        request = self.context.get('request')
        if obj.img and request:
            return request.build_absolute_uri(obj.img.url)
        return None
    
class UserSerializerProfile(serializers.ModelSerializer):
    follower_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    total_posts = serializers.SerializerMethodField()

    def get_follower_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()

    def get_total_posts(self, obj):
        return Posts.objects.filter(user=obj, is_deleted=False).count()

    class Meta:
        model = User
        fields = ['full_name', 'email', 'username', 'bio', 'profile_picture', 'phone', 'follower_count', 'following_count', 'total_posts']

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'profile_picture'] 
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def update(self, instance, validated_data):
        instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
        instance.save()
        return instance



class CommentSerializer(serializers.ModelSerializer):
    user_full_name = serializers.ReadOnlyField(source='user.full_name')
    profile_picture = serializers.ImageField(source='user.profile.profile_picture', read_only=True)
    created_time = serializers.ReadOnlyField()

    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'body','profile_picture', 'created_at', 'user_full_name', 'created_time']
        extra_kwargs = {
            'user': {'read_only': True},
            'post': {'read_only': True}
        }

class FollowSerializer(serializers.ModelSerializer):
    following = serializers.SlugRelatedField(slug_field='email',queryset=User.objects.all())
    follower = serializers.SlugRelatedField(slug_field='email',queryset=User.objects.all())

    class Meta:
        model = Follow
        fields = ['follower','following']