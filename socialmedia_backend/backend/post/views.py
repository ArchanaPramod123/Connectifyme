# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Posts
from .serializer import PostSerializer,UserSerializerProfile,UserUpdateSerializer,CommentSerializer
from rest_framework.permissions import IsAuthenticated

# class CreatePostView(APIView):
#     permission_classes = [IsAuthenticated] 

#     def post(self, request, *args, **kwargs):
#         user = request.user
#         data = request.data.copy()
#         data['user'] = user.id 
#         print(data)

#         serializer = PostSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         print(serializer.errors)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreatePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        # Extract data without copying files
        data = request.data.dict()
        data['user'] = user.id

        # Handle file separately
        if 'img' in request.data:
            data['img'] = request.data['img']

        serializer = PostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListPostsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        posts = Posts.objects.filter(user__is_superuser=False, is_deleted=False).order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_serializer = UserSerializerProfile(user)
        
        # Fetch user-specific posts
        user_posts = Posts.objects.filter(user=user, is_deleted=False).order_by('-created_at')
        posts_serializer = PostSerializer(user_posts, many=True)
        
        data = {
            'profile': user_serializer.data,
            'posts': posts_serializer.data
        }
        return Response(data)
class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PostListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = Posts.objects.filter(is_deleted=False).order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

class PostLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        post = Posts.objects.get(pk=pk)
        if post.likes.filter(id=request.user.id).exists():
            post.likes.remove(request.user)
        else:
            post.likes.add(request.user)
        return Response(status=status.HTTP_200_OK)

class CommentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        post = Posts.objects.get(pk=pk)
        data = request.data
        data['user'] = request.user.id
        data['post'] = post.id
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)