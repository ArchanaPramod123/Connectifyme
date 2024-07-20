# # serializers.py
# from rest_framework import serializers
# from account.models import User
# from .models import Posts
# # from account.serializers import UserSerializer


# class PostSerializer(serializers.ModelSerializer):
#     # user = UserSerializer(read_only=True)
#     img = serializers.ImageField(use_url=True)

#     class Meta:
#         model = Posts
#         fields = ['id', 'body', 'user', 'img', 'total_likes', 'created_time']

# class UserSerializerProfile(serializers.ModelSerializer):
#     follower_count = serializers.SerializerMethodField()
#     following_count = serializers.SerializerMethodField()
#     total_posts = serializers.SerializerMethodField()

#     def get_follower_count(self, obj):
#         # Assuming you have a 'followers' ManyToManyField in your User model
#         return obj.followers.count()

#     def get_following_count(self, obj):
#         # Assuming you have a 'following' ManyToManyField in your User model
#         return obj.following.count()

#     def get_total_posts(self, obj):
#         return Posts.objects.filter(user=obj, is_deleted=False).count()

#     class Meta:
#         model = User
#         fields = ['full_name', 'email', 'phone', 'profile_picture', 'follower_count', 'following_count', 'total_posts']

# class UserUpdateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'email', 'username', 'profile_picture']
#         extra_kwargs = {
#             'password': {'write_only': True}
#         }

#     def update(self, instance, validated_data):
#         instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
#         instance.save()
#         return instance



from rest_framework import serializers
from account.models import User
from .models import Posts,Comment,Follow
from account.serializers import UserSerializer

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    img = serializers.ImageField(use_url=True)

    class Meta:
        model = Posts
        fields = ['id', 'body', 'user', 'img', 'total_likes', 'created_time']

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
        fields = ['full_name', 'email', 'phone', 'profile_picture', 'follower_count', 'following_count', 'total_posts']

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'profile_picture']  # Removed 'username'
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def update(self, instance, validated_data):
        instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
        instance.save()
        return instance

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializerProfile(read_only =True)

    class Meta:
        model = Comment
        fields=['id','user','body','created_time']


class FollowSerializer(serializers.ModelSerializer):
    following = serializers.SlugRelatedField(slug_field='email',queryset=User.objects.all())
    follower = serializers.SlugRelatedField(slug_field='email',queryset=User.objects.all())

    class Meta:
        model = Follow
        fields = ['follower','following']