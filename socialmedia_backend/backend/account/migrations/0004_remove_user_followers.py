# Generated by Django 4.2.4 on 2024-07-15 15:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0003_user_followers'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='followers',
        ),
    ]
