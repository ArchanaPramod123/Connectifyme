import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils.timesince import timesince
from account.models import User
from .serializer import UserSerializer
from .models import *
from django.core.files.base import ContentFile
import base64

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
    #     print("receive with the websocket")
    #     if 'user' not in self.scope:
    #         print("User is not in scope")
    #         return

    #     text_data_json = json.loads(text_data)
    #     message_type = text_data_json.get('type')

    #     if message_type == 'video_call':
    #         await self.handle_video_call(text_data_json)
    #     else:
    #         message = text_data_json['message']
    #         user = self.scope['user']
    #         user_serializer = UserSerializer(user)
    #         email = user_serializer.data['email']

    #         new_message = await self.create_message(self.room_id, message, email)

    #         await self.channel_layer.group_send(
    #             self.room_group_name,
    #             {
    #                 'type': 'chat_message',
    #                 'message': message,
    #                 'room_id': self.room_id,
    #                 'sender_email': email,
    #                 'created': timesince(new_message.created_at),
    #             }
    #         )

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
            user = self.scope['user']
            user_serializer = UserSerializer(user)
            email = user_serializer.data['email']
            
            message_text = text_data_json.get('message', None)
            image_data = text_data_json.get('image', None)
            video_data = text_data_json.get('video', None)
            
            image_file = None
            video_file = None

            if image_data:
                print("the data reciver image")
                format, imgstr = image_data.split(';base64,') 
                ext = format.split('/')[-1] 
                image_file = ContentFile(base64.b64decode(imgstr), name=f'{user.username}_{self.room_id}.{ext}')
            
            if video_data:
                print("the data is video recived")
                format, vidstr = video_data.split(';base64,') 
                ext = format.split('/')[-1]
                video_file = ContentFile(base64.b64decode(vidstr), name=f'{user.username}_{self.room_id}.{ext}')
            
            new_message = await self.create_message(self.room_id, message_text, email, image_file, video_file)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message_text,
                    'image': new_message.image.url if new_message.image else None,
                    'video': new_message.video.url if new_message.video else None,
                    'room_id': self.room_id,
                    'sender_email': email,
                    'created': timesince(new_message.created_at),
                }
            )

    @sync_to_async
    def create_message(self, room_id, message_text, email, image_file=None, video_file=None):
        print("create chat message in the websocket")
        user = User.objects.get(email=email)
        room = Room.objects.get(id=room_id)
        message = Message.objects.create(
            text=message_text or '',
            room=room,
            sender=user,
            image=image_file,
            video=video_file
        )
        message.save()
        return message
    
    async def chat_message(self, event):
        print("Broadcasting chat message via WebSocket")
        message = event['message']
        image = event['image']
        video = event['video']
        room_id = event['room_id']
        email = event['sender_email']
        created = event['created']

        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': message,
            'image': image,
            'video': video,
            'room_id': room_id,
            'sender_email': email,
            'created': created,
        }))
    

    



    # async def chat_message(self,event):
    #     print("chat_message withe the websoket")
    #     message = event['message']
    #     room_id = event['room_id']
    #     email = event['sender_email']
    #     created = event['created']

    #     await self.send(text_data=json.dumps({
    #         'type':'chat_message',
    #         'message':message,
    #         'room_id':room_id,
    #         'sender_email':email,
    #         'created':created,
    #     }))
    
    # @sync_to_async
    # def create_message(self,room_id,message,email):
    #     print("create chat messag ein the websocket")
    #     user = User.objects.get(email=email)
    #     room = Room.objects.get(id=room_id)
    #     message = Message.objects.create(text=message,room=room,sender=user)
    #     message.save()
    #     return message


   

    # async def handle_video_call(self, data):
    #     # room_id = f'room-{self.room_id}' 
    #     room_id = data['room_id']  # Use the room ID provided by the caller
    #     print(f"Handling video call: room_id={room_id}, caller={data['caller']}, callee={data['callee']}")
    #     print("Handling video call")
    #     await self.channel_layer.group_send(
    #         self.room_group_name,
    #         {
    #             'type': 'video_call',
    #             'caller': data['caller'],
    #             'callee': data['callee'],
    #             'room_id': room_id 
    #         }
    #     )

    async def handle_video_call(self, data):
        room_id = data['room_id']
        caller = data['caller']
        callee = data['callee']

        callee_user = await sync_to_async(User.objects.get)(email=callee)
        callee_group_name = f'user_{callee_user.id}'
        
        print(f"Handling video call: room_id={room_id}, caller={caller}, callee={callee}")
        
        await self.channel_layer.group_send(
            callee_group_name,  
            {
                'type': 'video_call',
                'caller': caller,
                'callee': callee,
                'room_id': room_id,
            }
        )


    async def video_call(self, event):
        print("Video call initiated")
        caller = event['caller']
        callee = event['callee']
        room_id = event['room_id']  
        await self.send(text_data=json.dumps({
            'type': 'video_call',
            'caller': caller,
            'callee': callee,
            'room_id': room_id  
        }))
