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
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)
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


class PostReport(models.Model):
    REASONS = [
        ('VIOLENCE', 'Violence'),
        ('SEXUAL_CONTENT', 'Sexual Content'),
        ('ALCOHOLIC', 'Alcoholic'),
        ('OTHER', 'Other')
    ]

    post = models.ForeignKey(Posts, related_name='reports', on_delete=models.CASCADE)
    reporter = models.ForeignKey(User, related_name='reports', on_delete=models.CASCADE)
    reason = models.CharField(max_length=20, choices=REASONS)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report on {self.post} by {self.reporter}"


   
class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('like' , 'New Like'),
        ('post' , 'New Post'),
        ('follow' , 'New follow'),
        ('comment' , 'New comment'),
        ('blocked' , 'New blocked'),
        ('unblocked' , 'New unblocked'),
    ]

    from_user = models.ForeignKey(User , related_name='notification_from' , on_delete=models.CASCADE , null=True)
    to_user = models.ForeignKey(User , related_name='notification_to' , on_delete=models.CASCADE , null=True)
    notification_type = models.CharField(choices=NOTIFICATION_TYPES , max_length=20)
    post = models.ForeignKey('posts',on_delete=models.CASCADE,related_name='+',blank=True , null=True)
    comment = models.ForeignKey('Comment', on_delete=models.CASCADE,related_name='+',blank=True,null=True)
    created = models.DateField(auto_now_add=True)
    is_seen = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.from_user} send a {self.notification_type} notification to {self.to_user}'