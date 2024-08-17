from django.urls import path
from .views import *

urlpatterns = [
    path('create-room/<int:pk>/',CreateChatRoom.as_view()),
    path('chat-room/<int:pk>/',RoomMessageView.as_view()),
    path('chatrooms/',ChatRoomListView.as_view()),
    path('seen/<int:pk>/',MessageSeenView.as_view()),
]
