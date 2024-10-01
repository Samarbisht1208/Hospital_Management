# models.py
from django.db import models
from django.contrib.auth.models import User, Group

class Departments(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    diagnostics = models.TextField()
    location = models.CharField(max_length=255)
    specialization = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class PatientRecords(models.Model):
    record_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'groups__name': 'Patients'})
    created_date = models.DateTimeField(auto_now_add=True)
    diagnostics = models.TextField()
    observations = models.TextField()
    treatments = models.TextField()
    department = models.ForeignKey(Departments, on_delete=models.CASCADE)
    misc = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Record {self.record_id} for {self.patient.username}"

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.ForeignKey(Departments, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.user.username
    
class ProfilePhoto(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile_photo')
    photo_url = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile Photo"