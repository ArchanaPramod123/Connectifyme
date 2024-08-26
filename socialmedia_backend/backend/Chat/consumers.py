import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils.timesince import timesince
from account.models import User
from .serializer import UserSerializer
from .models import *


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("connect withe the websoket")
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'

        await self.channel_layer.group_add(self.room_group_name,self.channel_name)

        await self.accept()

        self.send(text_data=json.dumps({'status':'connected'}))

    async def disconnect(self, close_code):
        print("dissconnect withe the websoket")
        await self.channel_layer.group_discard(self.room_group_name,self.channel_name)

    # async def receive(self, text_data):
    #     print("receive withe the websoket")
    #     if 'user' not in self.scope:
    #         print("User is not in scope")
    #         return
    #     text_data_json = json.loads(text_data)
    #     message = text_data_json['message']
    #     user = self.scope['user']
    #     user_serializer = UserSerializer(user)
    #     email = user_serializer.data['email']

    #     new_message = await self.create_message(self.room_id,message,email)

    #     await self.channel_layer.group_send(
    #         self.room_group_name,
    #         {
    #             'type':'chat_message',
    #             'message':message,
    #             'room_id':self.room_id,
    #             'sender_email':email,
    #             'created':timesince(new_message.created_at),
    #         }
    #     )

    async def receive(self, text_data):
        print("receive with the websocket")
        if 'user' not in self.scope:
            print("User is not in scope")
            return

        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')

        if message_type == 'video_call':
            await self.handle_video_call(text_data_json)
        else:
            message = text_data_json['message']
            user = self.scope['user']
            user_serializer = UserSerializer(user)
            email = user_serializer.data['email']

            new_message = await self.create_message(self.room_id, message, email)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'room_id': self.room_id,
                    'sender_email': email,
                    'created': timesince(new_message.created_at),
                }
            )


    async def chat_message(self,event):
        print("chat_message withe the websoket")
        message = event['message']
        room_id = event['room_id']
        email = event['sender_email']
        created = event['created']

        await self.send(text_data=json.dumps({
            'type':'chat_message',
            'message':message,
            'room_id':room_id,
            'sender_email':email,
            'created':created,
        }))
    
    @sync_to_async
    def create_message(self,room_id,message,email):
        print("create chat messag ein the websocket")
        user = User.objects.get(email=email)
        room = Room.objects.get(id=room_id)
        message = Message.objects.create(text=message,room=room,sender=user)
        message.save()
        return message
    

async def handle_video_call(self, data):
    room_id = f'room-{self.room_id}'  # Ensure room ID is consistent
    print("Handling video call")
    await self.channel_layer.group_send(
        self.room_group_name,
        {
            'type': 'video_call',
            'caller': data['caller'],
            'callee': data['callee'],
            'room_id': room_id  # Include the room ID for redirection
        }
    )


    # async def video_call(self, event):
    #     print("Video call initiated")
    #     caller = event['caller']
    #     callee = event['callee']
    #     await self.send(text_data=json.dumps({
    #         'type': 'video_call',
    #         'caller': caller,
    #         'callee': callee,
    #     }))

async def video_call(self, event):
    print("Video call initiated")
    caller = event['caller']
    callee = event['callee']
    room_id = event['room_id']  # Use the consistent room ID
    await self.send(text_data=json.dumps({
        'type': 'video_call',
        'caller': caller,
        'callee': callee,
        'room_id': room_id  # Send room ID for client redirection
    }))
