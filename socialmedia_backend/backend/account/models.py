from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.apps import apps


# Create your models here.
class MyAccountManager(BaseUserManager):
    def create_user(self,full_name,email,password=None,phone=None):
        if not email:
            raise ValueError("User must have an email address")
        user=self.model(
            email=self.normalize_email(email),
            full_name=full_name,
            phone=phone,
        )
        user.set_password(password)
        user.save(using=self.db)
        return user
    
    def create_superuser(self,full_name,email,password):
        user=self.create_user(
            email=self.normalize_email(email),
            full_name=full_name,
            password=password
        )
        user.is_active = True
        user.is_superuser = True
        user.is_email_verified = True
        user.is_staff = True
        user.save(using=self.db)
        return user

class User(AbstractBaseUser):
    full_name=models.CharField(max_length=50)
    email = models.EmailField(verbose_name='email address', max_length=255, unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now_add=True)
    is_superuser = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    otp = models.CharField(max_length=6, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    username = models.CharField(max_length=50, unique=True, blank=True, null=True)
    # background_image = models.ImageField(upload_to='background_images/', blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True, null=True)
    is_private = models.BooleanField(default=False)  # Add this line
    # followers = models.ManyToManyField('self', symmetrical=False, related_name='following', blank=True)

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['full_name']

    objects=MyAccountManager()

    def __str__(self):
        return self.full_name
    
    def has_perm(self,perm,obj=None):
        return self.is_superuser
    
    def has_module_perms(self,add_label):
        return True
   
    def reported_post_count(self):
        PostReport = apps.get_model('post', 'PostReport')
        return PostReport.objects.filter(post__user=self).count()