from django.contrib import admin
from .models import PatientRecords, Departments, Profile, ProfilePhoto

# Register your models here.
admin.site.register(PatientRecords)
admin.site.register(Departments)
admin.site.register(Profile)
admin.site.register(ProfilePhoto)
