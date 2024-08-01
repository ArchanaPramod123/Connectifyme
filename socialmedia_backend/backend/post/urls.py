from django.urls import path
# from .views import CreatePostView,ListPostsView,UserProfileView,UpdateUserView
from .views import *


urlpatterns = [
    path('create-post/', CreatePostView.as_view(), name='create-post'),
    path('list-posts/', ListPostsView.as_view(), name='list-posts'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('update_profile/', UpdateUserView.as_view(), name='user-update'),
    path('like-post/<int:pk>/', PostLikeView.as_view(), name='like-post'),
    path('comments/<int:post_id>/', CommentListView.as_view(), name='comment-list'),
    path('comment-post/<int:post_id>/', CommentCreateView.as_view(), name='comment-create'),
    path('comment-update/<int:comment_id>/', CommentUpdateView.as_view(), name='comment-update'),
    path('comment-delete/<int:comment_id>/', CommentDeleteView.as_view(), name='comment-delete'),
   
   
]
