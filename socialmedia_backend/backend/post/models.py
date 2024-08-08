from django.db import models
from account.models import User
from django.utils.timesince import timesince

# Create your models here.

class Posts(models.Model):
    body = models.TextField(blank=True, null=True)
    user = models.ForeignKey(User, related_name='posts', on_delete=models.CASCADE)
    img = models.ImageField(upload_to='posts/')
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)
    is_blocked = models.BooleanField(default=False)
    reported_users = models.ManyToManyField(User, related_name='reported_posts', blank=True)

    def __str__(self):
        return self.user.full_name
    
    def total_likes(self):
        return self.likes.count()
    
    def created_time(self):
        return timesince(self.created_at)
    
    def total_reports(self):
        return self.reported_users.count()
    
class Comment(models.Model):
    post = models.ForeignKey(Posts,related_name='comments',on_delete=models.CASCADE)
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    body=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return '%s - %s - %s' % (self.post.id,self.body,self.user.full_name)
    
    def created_time(self):
        return timesince(self.created_at)
    
    def formatted_created_at(self):
        return self.created_at.strftime('%Y-%m-%d %H:%M:%S')
    
class Follow(models.Model):
    follower = models.ForeignKey(User,related_name='followers',on_delete=models.CASCADE)
    following = models.ForeignKey(User,related_name='following',on_delete=models.CASCADE)

    def __str__(self) :
        return f'{self.follower} -> {self.following}'