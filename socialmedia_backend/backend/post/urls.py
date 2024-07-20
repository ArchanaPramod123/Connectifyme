from django.urls import path
# from .views import CreatePostView,ListPostsView,UserProfileView,UpdateUserView
from .views import *


urlpatterns = [
    path('create-post/', CreatePostView.as_view(), name='create-post'),
    path('list-posts/', ListPostsView.as_view(), name='list-posts'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('update_profile/', UpdateUserView.as_view(), name='user-update'),
     path('like-post/<int:pk>/', PostLikeView.as_view(), name='like-post'),
    path('comment-post/<int:pk>/', CommentCreateView.as_view(), name='comment-post'),
   
   
]
