# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Posts,Comment,Follow
from account.models import User
from account.serializers import UserSerializer
from .serializer import PostSerializer,UserSerializerProfile,UserUpdateSerializer,CommentSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404


class CreatePostView(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user
        data = request.data.copy()
        data['user'] = user.id 
        print('Request Data:', data)  # Debugging

        serializer = PostSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class ListPostsView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         posts = Posts.objects.filter(user__is_superuser=False, is_deleted=False).order_by('-created_at')
#         serializer = PostSerializer(posts, many=True,context={'request': request})
#         print("serilizerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:",serializer.data)
#         return Response(serializer.data, status=status.HTTP_200_OK)


class ListPostsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        posts = Posts.objects.filter(user__is_superuser=False, is_deleted=False).order_by('-created_at')
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    


# class UserProfileView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         serializer = UserSerializerProfile(user)
#         user_posts = Posts.objects.filter(user=user, is_deleted=False).order_by('-created_at')
#         posts_serializer = PostSerializer(user_posts, many=True,context={'request': request})
#         print("profile print images",posts_serializer.data)
#         return Response({'profile': serializer.data,'posts': posts_serializer.data})
    


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id=None):
        if user_id is None:
            user = request.user
        else:
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        is_own_profile = (user == request.user)
        serializer = UserSerializerProfile(user)
        user_posts = Posts.objects.filter(user=user, is_deleted=False).order_by('-created_at')
        posts_serializer = PostSerializer(user_posts, many=True, context={'request': request})
        is_following = Follow.objects.filter(follower=request.user, following=user).exists()

        return Response({
            'profile': serializer.data,
            'posts': posts_serializer.data,
            'is_own_profile': is_own_profile,
            'is_following': is_following
        })



class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class EditProfileView(APIView):
#     permission_classes = [IsAuthenticated]

#     def patch(self, request, pk):
#         user = User.objects.get(pk=pk)
#         if user != request.user:
#             return Response({'error': 'You do not have permission to edit this profile.'}, status=status.HTTP_403_FORBIDDEN)
        
#         serializer = UserSerializer(user, data=request.data, partial=True)
#         if serializer.is_valid():
#             if 'profile_picture' in request.FILES:
#                 user.profile_picture = request.FILES['profile_picture']
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class EditProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user != request.user:
            return Response({'error': 'You do not have permission to edit this profile.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            if 'profile_picture' in request.FILES:
                user.profile_picture = request.FILES['profile_picture']
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class PostLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        post = Posts.objects.get(pk=pk)
        user = request.user
        print("userrrrrrrrrr",user)
        print("the count of like",post.total_likes())
        print("liked post",post.likes.filter(id=user.id).exists())
        print()
        # liked = False
        if post.likes.filter(id=user.id).exists():
            post.likes.remove(user)
        else:
            post.likes.add(user)
            print(user)
            # liked = True
            
        return Response({
            'total_likes': post.total_likes(),
            'is_liked': post.likes.filter(id=user.id).exists(),
            
            # 'is_liked': post.likes.filter(id=user.id)
            # 'like':post.likes
        }, status=status.HTTP_200_OK)
        # return Response({'total_likes': post.total_likes(),'is_liked': liked}, status=status.HTTP_200_OK)
 
class CommentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        comments = Comment.objects.filter(post_id=post_id).order_by('-created_at')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CommentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            post = get_object_or_404(Posts, pk=post_id)
        except Posts.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CommentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user, post=post)
            comments = Comment.objects.filter(post=post).order_by('-created_at')
            return Response(CommentSerializer(comments, many=True).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommentUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, comment_id):
        comment = get_object_or_404(Comment, pk=comment_id, user=request.user)
        serializer = CommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, comment_id):
        comment = get_object_or_404(Comment, pk=comment_id, user=request.user)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    


class FollowUnfollowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if target_user == request.user:
            return Response({"error": "You cannot follow/unfollow yourself"}, status=status.HTTP_400_BAD_REQUEST)

        follow_relationship, created = Follow.objects.get_or_create(following=request.user, follower=target_user)

        if not created:
            follow_relationship.delete()
            is_following = False
        else:
            is_following = True
        print("is folowwwwww",is_following)
        follower_count = target_user.followers.count()
        following_count = target_user.following.count()

        return Response({"is_following": is_following, "follower_count": follower_count,
            "following_count": following_count})



