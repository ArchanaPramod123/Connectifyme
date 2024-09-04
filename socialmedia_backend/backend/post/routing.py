from django.urls import path
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    path('ws/notification/',consumers.NotificationConsumer.as_asgi()),
    # re_path(r'ws/notification/$', consumers.NotificationConsumer.as_asgi()),
]