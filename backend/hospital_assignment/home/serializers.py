from django.contrib.auth.models import User, Group
from .models import Departments, PatientRecords, Profile, ProfilePhoto
from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):
    group = serializers.ChoiceField(choices=[('Doctors', 'Doctors'), ('Patients', 'Patients')])
    department = serializers.CharField(required=False) 

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'group', 'department']
        extra_kwargs = {'password': {'write_only': True}}

    
    def validate(self, data):
        username = data.get('username')
        email = data.get('email')
        department_name = data.get('department')

        if username and User.objects.filter(username=username).exists():
            raise serializers.ValidationError('Username is already taken')

        if email:
            if User.objects.filter(email=email).exists():
                raise serializers.ValidationError('This email already has an account')
        else:
            raise serializers.ValidationError("email field is required.")

        if department_name:
            try:
                department = Departments.objects.get(name=department_name)
                data['department'] = department
            except Departments.DoesNotExist:
                raise serializers.ValidationError(f"Department with name '{department_name}' does not exist")
        else:
            raise serializers.ValidationError("Department field is required.")

        return data
    def create(self, validated_data):
        group_name = validated_data.pop('group')
        department = validated_data.pop('department')

        # for group
        user = User.objects.create_user(**validated_data)
        group = Group.objects.get(name=group_name)
        user.groups.add(group)
        # for department
        if department:
            user.profile.department = department
            user.profile.save()

        # if user is patient create a record
        if group_name == 'Patients':
            PatientRecords.objects.create(
                patient = user,
                department = department
            )
        return user




class AllUserSerializer(serializers.ModelSerializer):
    department = serializers.CharField(source='profile.department.name', read_only=True)  # Fetch department from Profile
    profile_photo = serializers.CharField(source='profile_photo.photo_url', read_only=True)
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'department', 'profile_photo']

class UserSerializer(serializers.ModelSerializer):
    department = serializers.CharField(source='profile.department.name', read_only=True)
    profile_photo = serializers.CharField(source='profile_photo.photo_url', read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile_photo', 'first_name', 'last_name', 'department']
    




class DepartmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departments
        fields = ['id', 'name', 'diagnostics', 'location', 'specialization']
    
    def validate(self, data):
        name = data.get('name')
        diagnostics = data.get('diagnostics')
        specialization = data.get('specialization')

        if name and Departments.objects.filter(name=name).exists():
            raise serializers.ValidationError('name is already taken')
        if diagnostics and Departments.objects.filter(diagnostics=diagnostics).exists():
            raise serializers.ValidationError('diagnostics is already taken')
        if specialization and Departments.objects.filter(specialization=specialization).exists():
            raise serializers.ValidationError('same specialization like other')
        
        return data



class PatientRecordsSerializer(serializers.ModelSerializer):
      # Accessing fields from the related 'patient' (User) model
    patient_first_name = serializers.CharField(source='patient.first_name', read_only=True)
    patient_last_name = serializers.CharField(source='patient.last_name', read_only=True)
    username =  serializers.CharField(source='patient.username', read_only=True)

    class Meta:
        model = PatientRecords
        fields = ['record_id', 'patient_first_name', 'patient_last_name',  'patient', 'username', 'created_date', 'diagnostics', 'observations', 'treatments', 'department', 'misc']




# for all information
class AllInfoSerializer(serializers.ModelSerializer):
    department = serializers.CharField(source='profile.department.name', read_only=True)
    profile_photo = serializers.CharField(source='profile_photo.photo_url', read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile_photo', 'first_name', 'last_name', 'department', 'groups']

