from django.core.mail import send_mail
import random
from django.conf import settings
from .models import User


def send_otp_via_mail(email,otp):
    subject = f'Welcome to connectfy. verification mail'
    otp=random.randint(1000,9999)
    message= f'Your otp is {otp}'
    email_from = settings.EMAIL_HOST_USER

    try:
        send_mail(subject,message,email_from,[email])
        user_obj=User.objects.get(email=email)
        user_obj.otp=otp
        user_obj.save()
        print(otp)
    except Exception as e:
        print(f'Error sending email: {e}')

def resend_otp_via_mail(email):
    subject = f'Welcome again !! user verification mail'
    otp=random.randint(1000,9999)
    message= f'Your otp is {otp}'
    email_from=settings.EMAIL_HOST

    try:
        send_mail(subject,message,email_from,[email])
        user_obj=User.objects.get(email=email)
        user_obj.otp=otp
        user_obj.save()
        print(otp)
    except Exception as e:
        print(f'Error sending email: {e}')
def forgot_password_mail(email, user_id):
    subject = 'Welcome back... your reset password link'
    link = f'http://localhost:5173/user/reset_password/{user_id}'
    email_from = settings.EMAIL_HOST
    try:
        send_mail(subject, link, email_from, [email])
    except Exception as e:
        print("Error:", e)