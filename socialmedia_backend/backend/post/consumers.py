import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    print('routing notification working')
    async def connect(self):
        self.user = self.scope['user']

        if self.user.is_anonymous:
            await self.close()
        else:
            self.room_group_name = f'notify_{self.user.id}'
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
            await self.send(text_data=json.dumps({
                'status':'connected'
            }))
    
    async def receive(self, text_data):
        await self.send(text_data=json.dumps({'status':'Ok,recieved'}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def send_notification(self,event):
        data = json.loads(event.get('value'))
        await self.send(text_data=json.dumps({
            'type':'notification',
            'payload': data
        }))