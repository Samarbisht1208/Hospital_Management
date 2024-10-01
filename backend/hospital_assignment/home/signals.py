# for groups
from django.contrib.auth.models import Group
from django.db.models.signals import post_migrate
from django.dispatch import receiver

# for profile, profile_photo
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile, ProfilePhoto

@receiver(post_migrate)
def create_user_groups(sender, **kwargs):
    Group.objects.get_or_create(name='Doctors')
    Group.objects.get_or_create(name='Patients')


# profile
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


# profile photo
@receiver(post_save, sender=User)
def create_user_profile_photo(sender, instance, created, **kwargs):
    if created:
        ProfilePhoto.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile_photo(sender, instance, **kwargs):
    instance.profile_photo.save()
