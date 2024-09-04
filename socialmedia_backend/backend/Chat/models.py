from django.db import models
from account.models import User
# Create your models here.

class Room(models.Model):
    members = models.ManyToManyField(User,related_name='chat_room')

    # def __str__(self):
    #     return ','.join([str(member) for member in self.members.all()])

class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    sender = models.ForeignKey(User,on_delete=models.CASCADE)
    text = models.TextField()

    image = models.ImageField(upload_to='messages/images/', blank=True, null=True)
    video = models.FileField(upload_to='messages/videos/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    seen = models.BooleanField(default=False)

    class Meta:
        ordering = ('created_at',)
    
    def __str__(self):
        return f'{self.sender}'
