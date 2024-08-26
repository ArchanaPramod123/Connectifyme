# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,permissions,generics
from .models import Posts, Comment, Follow, PostReport

from account.models import User
from account.serializers import UserSerializer
from .serializer import *
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .signals import follow_notification


# ------------------------------post creation, post list-------------------------------------------------------------------
class CreatePostView(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user
        data = request.data
        data["user"] = user.id
        print("Request Data:", data)

        serializer = PostSerializer(data=data, context={"request": request})
        if serializer.is_valid():
            serializer.save()



            post = serializer.save(author=user)
            for follower in user.following.all():
                Notification.objects.create(
                    from_user = user,
                    to_user = follower.follower,
                    post = post,
                    notification_type = Notification.NOTIFICATION_TYPES[1][0],
                )


            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListPostsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        following = Follow.objects.filter(follower=request.user).values_list(
            "following", flat=True
        )

        posts = Posts.objects.filter(
            Q(user__is_private=False) | Q(user__in=following),
            user__is_superuser=False,
            is_deleted=False,
        ).order_by("-created_at")

        serializer = PostSerializer(posts, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class SuggestionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        following = Follow.objects.filter(follower=request.user).values_list(
            "following", flat=True
        )
        suggestions = (
            User.objects.filter(is_superuser=False, is_active=True)
            .exclude(Q(id=request.user.id))
            .order_by("?")[:10]
        )

        serializer = UserSerializer(
            suggestions, many=True, context={"request": request}
        )
        print("suggestions data", serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ------------------------------User profile , user profile update----------------------------------------------------------------------------------------------------------------
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id=None):
        if user_id is None:
            user = request.user
        else:
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response(
                    {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
                )

        is_own_profile = user == request.user
        serializer = UserSerializerProfile(user, context={"request": request})
        user_posts = Posts.objects.filter(user=user, is_deleted=False).order_by(
            "-created_at"
        )

        is_following = Follow.objects.filter(
            follower=request.user, following=user
        ).exists()
        mutual_following = (
            is_following
            and Follow.objects.filter(follower=user, following=request.user).exists()
        )

        if user.is_private and not (is_own_profile or mutual_following):
            user_posts = []

        posts_serializer = PostSerializer(
            user_posts, many=True, context={"request": request}
        )

        return Response(
            {
                "profile": serializer.data,
                "posts": posts_serializer.data,
                "is_own_profile": is_own_profile,
                "is_following": is_following,
            }
        )


class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EditProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):
        print("Received Data: ", request.data)
        print("Received Files: ", request.FILES)
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if user != request.user:
            return Response(
                {"error": "You do not have permission to edit this profile."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            if "profile_picture" in request.FILES:
                serializer.validated_data["profile_picture"] = request.FILES[
                    "profile_picture"
                ]
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

            # if "profile_picture" in request.FILES:
            #     user.profile_picture = request.FILES["profile_picture"]
            # serializer.save()
            # return Response(serializer.data, status=status.HTTP_200_OK)
        print("Serializer Errors: ", serializer.errors)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --------------------------------------------------Post Like -----------------------------------------------------------------------------------------------------------
# class PostLikeView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, pk):
#         post = Posts.objects.get(pk=pk)
#         user = request.user
#         print("userrrrrrrrrr", user)
#         print("the count of like", post.total_likes())
#         print("liked post", post.likes.filter(id=user.id).exists())
#         print()
#         # liked = False
#         if post.likes.filter(id=user.id).exists():
#             post.likes.remove(user)

#         else:
#             post.likes.add(user)
#             print(user)
#             # liked = True


#         return Response(
#             {
#                 "total_likes": post.total_likes(),
#                 "is_liked": post.likes.filter(id=user.id).exists(),
#             },
#             status=status.HTTP_200_OK,
#         )




class PostLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Posts.objects.get(pk=pk)
            user = request.user

            if post.likes.filter(id=user.id).exists():
                post.likes.remove(user)
                # Delete the notification associated with unliking the post
                Notification.objects.filter(
                    from_user=user, 
                    to_user=post.user, 
                    post=post, 
                    notification_type=Notification.NOTIFICATION_TYPES[0][0]
                ).delete()
                message = "Post unliked"
            else:
                post.likes.add(user)
                # Create a notification only if the post author is not the user who liked the post
                if post.user != user:
                    Notification.objects.create(
                        from_user=user,
                        to_user=post.user,
                        post=post,
                        notification_type=Notification.NOTIFICATION_TYPES[0][0],
                    )
                message = "Post liked"

            return Response(
                {
                    "total_likes": post.total_likes(),
                    "is_liked": post.likes.filter(id=user.id).exists(),
                    "message": message,
                },
                status=status.HTTP_200_OK,
            )

        except Posts.DoesNotExist:
            return Response("Post not found", status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ---------------------------------------------post comment , update and delete-------------------------------------------------------------------------------------------------------
class CommentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        comments = Comment.objects.filter(post_id=post_id).order_by("-created_at")
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# class CommentCreateView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, post_id):
#         try:
#             post = get_object_or_404(Posts, pk=post_id)
#         except Posts.DoesNotExist:
#             return Response(
#                 {"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND
#             )

#         serializer = CommentSerializer(data=request.data, context={"request": request})
#         if serializer.is_valid():
#             serializer.save(user=request.user, post=post)
#             comments = Comment.objects.filter(post=post).order_by("-created_at")
#             return Response(
#                 CommentSerializer(comments, many=True).data,
#                 status=status.HTTP_201_CREATED,
#             )
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





class CommentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            post = get_object_or_404(Posts, pk=post_id)
        except Posts.DoesNotExist:
            return Response(
                {"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = CommentSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            comment = serializer.save(user=request.user, post=post)

            # Check if a notification already exists for this user and post
            existing_notification = Notification.objects.filter(
                from_user=request.user,
                to_user=post.user,
                post=post,
                notification_type=Notification.NOTIFICATION_TYPES[3][0]  # Assuming index 3 corresponds to comment notification
            ).first()

            if not existing_notification:
                Notification.objects.create(
                    from_user=request.user,
                    to_user=post.user,
                    post=post,
                    notification_type=Notification.NOTIFICATION_TYPES[3][0],
                )

            comments = Comment.objects.filter(post=post).order_by("-created_at")
            return Response(
                CommentSerializer(comments, many=True).data,
                status=status.HTTP_201_CREATED,
            )
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


# class CommentDeleteView(APIView):
#     permission_classes = [IsAuthenticated]

#     def delete(self, request, comment_id):
#         comment = get_object_or_404(Comment, pk=comment_id, user=request.user)
#         comment.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)



class CommentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, comment_id):
        comment = get_object_or_404(Comment, pk=comment_id, user=request.user)

        # Find and delete the associated notification
        notification_type = Notification.NOTIFICATION_TYPES[3][0]  # Notification type for comments
        post = comment.post

        Notification.objects.filter(
            from_user=request.user,
            to_user=post.user,
            post=post,
            notification_type=notification_type
        ).delete()

        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




# ----------------------------------------------user follow------------------------------------------------------------------------------------------------------------------------------------------
# class FollowUnfollowView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, user_id):
#         try:
#             target_user = User.objects.get(id=user_id)
#         except User.DoesNotExist:
#             return Response(
#                 {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
#             )

#         if target_user == request.user:
#             return Response(
#                 {"error": "You cannot follow/unfollow yourself"},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
#         print("the target user of the code ",target_user)
#         print("the request user of the code ",request.user)

#         follow_relationship, created = Follow.objects.get_or_create(
#             following=request.user, follower=target_user
#         )

#         if not created:
#             follow_relationship.delete()
#             is_following = False
#         else:
#             is_following = True

#         mutual_following = (
#             Follow.objects.filter(follower=request.user, following=target_user).exists()
#             and Follow.objects.filter(
#                 follower=target_user, following=request.user
#             ).exists()
#         )

#         follower_count = target_user.followers.count()
#         following_count = target_user.following.count()

#         return Response(
#             {
#                 "is_following": is_following,
#                 "follower_count": follower_count,
#                 "following_count": following_count,
#                 "mutual_following": mutual_following,
#             }
#         )








class FollowUnfollowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if target_user == request.user:
            return Response(
                {"error": "You cannot follow/unfollow yourself"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        follow_relationship, created = Follow.objects.get_or_create(
            following=request.user, follower=target_user
        )

        if not created:
            follow_relationship.delete()
            is_following = False

            # Delete the notification associated with the unfollowed user
            Notification.objects.filter(from_user=request.user, to_user=target_user, notification_type='follow').delete()
        else:
            is_following = True

            # Create a follow notification if not already following
            Notification.objects.create(
                from_user=request.user,
                to_user=target_user,
                notification_type='follow',
            )

        # Check mutual following status
        mutual_following = (
            Follow.objects.filter(follower=request.user, following=target_user).exists()
            and Follow.objects.filter(follower=target_user, following=request.user).exists()
        )

        # Get follower and following counts
        follower_count = target_user.followers.count()
        following_count = target_user.following.count()

        return Response(
            {
                "is_following": is_following,
                "follower_count": follower_count,
                "following_count": following_count,
                "mutual_following": mutual_following,
            }
        )





# class FollowUnfollowView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, user_id):
#         try:
#             target_user = User.objects.get(id=user_id)
#         except User.DoesNotExist:
#             return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

#         if target_user == request.user:
#             return Response({"error": "You cannot follow/unfollow yourself"}, status=status.HTTP_400_BAD_REQUEST)

#         is_following = Follow.objects.filter(follower=request.user, following=target_user)
#         if is_following.exists():
#             is_following.delete()
#             response_msg = "Unfollowed Successfully"
#             Notification.objects.filter(from_user=request.user, to_user=target_user, notification_type=Notification.NOTIFICATION_TYPES[2][0]).delete()
#         else:
#             Follow.objects.create(follower=request.user, following=target_user)
#             Notification.objects.create(
#                 from_user=request.user,
#                 to_user=target_user,
#                 notification_type=Notification.NOTIFICATION_TYPES[2][0],
#             )
#             response_msg = "Followed Successfully"
#             follow_notification.send(sender=self.__class__, follower=request.user, following=target_user)

#         # Check if they now follow each other (mutual follow)
#         mutual_following = (
#             Follow.objects.filter(follower=request.user, following=target_user).exists() and
#             Follow.objects.filter(follower=target_user, following=request.user).exists()
#         )

#         follower_count = target_user.followers.count()
#         following_count = request.user.following.count()

#         return Response({
#             "message": response_msg,
#             "is_following": not is_following.exists(),
#             "follower_count": follower_count,
#             "following_count": following_count,
#             "mutual_following": mutual_following,
#         })





# ---------------------user profile post view,update and delete---------------------------------------------------------------------------------------------------------------------------------------------


class PostDetailView(APIView):
    def get(self, request, post_id):
        try:
            post = Posts.objects.get(id=post_id)
            comments = post.comments.all()
            serialized_post = PostSerializer(post)
            serialized_comments = CommentSerializer(comments, many=True)
            data = serialized_post.data
            data["comments"] = serialized_comments.data
            return Response(data, status=status.HTTP_200_OK)
        except Posts.DoesNotExist:
            return Response(
                {"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND
            )


class PostUpdateView(APIView):
    def patch(self, request, post_id):
        try:
            post = Posts.objects.get(id=post_id)
            post.body = request.data.get("body", post.body)
            post.save()
            serialized_post = PostSerializer(post)
            return Response(serialized_post.data, status=status.HTTP_200_OK)
        except Posts.DoesNotExist:
            return Response(
                {"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND
            )


class PostDeleteView(APIView):
    def delete(self, request, post_id):
        try:
            post = Posts.objects.get(id=post_id)
            post.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Posts.DoesNotExist:
            return Response(
                {"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND
            )


# ----------------------------search ,explore----------------------------------------------------------------------------------------------------------------------------------------------


class SearchUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        query = request.query_params.get("q", "")
        if query:
            users = User.objects.filter(username__icontains=query)
            serializer = UserSerializer(users, many=True, context={"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response([], status=status.HTTP_200_OK)


class ExploreView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            posts = Posts.objects.filter(is_deleted=False).order_by("-created_at")

            serializer = PostSerializer(posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error in ExploreView: {e}")
            return Response(
                {"error": "An error occurred while fetching posts."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )



# class ReportPostView(APIView):
#     def post(self, request, post_id):
#         try:
#             post = Posts.objects.get(id=post_id)
#             serializer = ReportSerializer(data=request.data)
#             if serializer.is_valid():
#                 serializer.save(post=post, reporter=request.user)
#                 return Response({"message": "Report submitted successfully"}, status=status.HTTP_201_CREATED)
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         except Posts.DoesNotExist:
#             return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)



class ReportPostView(APIView):
    def post(self, request, post_id):
        try:
            post = Posts.objects.get(id=post_id)
            serializer = ReportSerializer(data=request.data)
            if serializer.is_valid():
                # Set the reporter field to the current user
                serializer.save(post=post, reporter=request.user)
                return Response({"message": "Report submitted successfully"}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Posts.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        




class NotificationsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        user = self.request.user
        return Notification.objects.filter(to_user=user).exclude(is_seen=True).order_by('-created')

    def get(self,request , *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many = True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class NotificationsSeenView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer

    def post(self, request , pk ,*args, **kwargs):
        try:
            notification = get_object_or_404(Notification,pk=pk)
            notification.is_seen = True
            notification.save()
            return Response(status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response("Not found in database",status=status.HTTP_404_NOT_FOUND)
        
    def get(self, request , pk , *args, **kwargs):
        return Response('GET method not allowed for the endpoint ', status=status.HTTP_405_METHOD_NOT_ALLOWED)
    

