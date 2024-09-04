from django.urls import path
# from .views import CreatePostView,ListPostsView,UserProfileView,UpdateUserView
from .views import *


urlpatterns = [
    path('create-post/', CreatePostView.as_view(), name='create-post'),
    path('list-posts/', ListPostsView.as_view(), name='list-posts'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
   
    path('follow-unfollow/<int:user_id>/', FollowUnfollowView.as_view(), name='follow-unfollow'),
    path('update_profile/', UpdateUserView.as_view(), name='user-update'),
    path('edit-profile/<int:user_id>/', EditProfileView.as_view(), name='edit-profile'),
    path('profile/<int:user_id>/', UserProfileView.as_view(), name='user-profile-detail'),
    path('like-post/<int:pk>/', PostLikeView.as_view(), name='like-post'),

    path('suggesions/', SuggestionView.as_view(), name='suggestion'),


    path('comments/<int:post_id>/', CommentListView.as_view(), name='comment-list'),
    path('comment-post/<int:post_id>/', CommentCreateView.as_view(), name='comment-create'),
    path('comment-update/<int:comment_id>/', CommentUpdateView.as_view(), name='comment-update'),
    path('comment-delete/<int:comment_id>/', CommentDeleteView.as_view(), name='comment-delete'),
    # path('comment-reply/<int:comment_id>/', reply_to_comment,name='comment-reply'),  # Add this if it's supposed to handle replies
    path('comment-like/<int:comment_id>/', like_comment, name='comment-like'),  # Ensure this path matches


    path('post-detail/<int:post_id>/', PostDetailView.as_view(), name='post-detail'),
    path('update-post/<int:post_id>/', PostUpdateView.as_view(), name='update-post'),
    path('delete-post/<int:post_id>/', PostDeleteView.as_view(), name='delete-post'),
   
    path('search-users/', SearchUserView.as_view(), name='search-users'),
    path('explore/', ExploreView.as_view(), name='explore'),

    path('report-post/<int:post_id>/', ReportPostView.as_view(), name='report-post'),

    path('notifications/',NotificationsView.as_view(),name='notifications'),
    path('notifications-seen/<int:pk>/',NotificationsSeenView.as_view(),name='notifications-seen'),
    
]
