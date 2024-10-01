from django.shortcuts import render
from .serializers import RegisterSerializer, AllUserSerializer, UserSerializer, DepartmentsSerializer, PatientRecordsSerializer, AllInfoSerializer

# for making register view
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

# for token and authentication
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication

# for actions in single route
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework.decorators import action

# for permissions after token
from rest_framework.permissions import IsAuthenticated

# for departments
from .models import Departments, PatientRecords


class RegisterView(APIView):
    permission_classes = [AllowAny]  # Allows access without authentication

    def post(self, request):
        getting_data = request.data
        serializer = RegisterSerializer(data=getting_data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'user created'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class UserViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username, password are required'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user is None:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        
        
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': f'Token {token.key}'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        token_key = request.data.get('token')

        if token_key:
            try:
                Token.objects.get(key=token_key).delete()
                return Response({'status': 'Logged out successfully', 'message': 'tokken is deleted'}, status=status.HTTP_200_OK)
            except Token.DoesNotExist:
                return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)

    



# doctors
# Custom permission to check if the user belongs to the "Doctors" group
class IsDoctorGroupUser:
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Doctors').exists()
    
class DoctorsListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsDoctorGroupUser]

    def get(self, request):
        doctors = User.objects.filter(groups__name='Doctors')
        if doctors.exists():
            serialized_data = AllUserSerializer(doctors, many=True)
            doctor_data = [
                {
                    'id': doctor['id'],
                    'name': f"{doctor['first_name']} {doctor['last_name']}",
                    'username': doctor['username'],
                    'department': doctor['department'],
                    'profile_photo': doctor['profile_photo']
                }
                for doctor in serialized_data.data
            ]
            return Response(doctor_data, status=status.HTTP_200_OK)
        return Response({
            'message': 'no doctors are registered'
        }, status=status.HTTP_204_NO_CONTENT)
    
class DoctorDetailView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = request.user
        if user.id != pk:
            return Response({
                'error': 'You can only view your own profile.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serialized_data = UserSerializer(user)
        return Response(serialized_data.data, status=status.HTTP_200_OK)
    
    def patch(self, request, pk):
        user = request.user
        if user.id != pk:
            return Response({
                'error': 'You can only update your own profile.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        getting_data = request.data
        serialized_data = UserSerializer(user, data=getting_data, partial=True)
        if serialized_data.is_valid():
            serialized_data.save()
            # If profile_photo is provided, update the ProfilePhoto model
            profile_photo_url = getting_data.get('profile_photo', None)
            profile_photo_instance = user.profile_photo

            if profile_photo_url is not None:
                profile_photo_instance.photo_url = profile_photo_url
            else:
                # Set profile photo to an empty string (or set it to None based on your model)
                profile_photo_instance.photo_url = ''  # You can use None if your database allows null values
            profile_photo_instance.save()
            return Response(serialized_data.data, status=status.HTTP_200_OK)
        return Response(serialized_data.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        user = request.user
        if user.id != pk:
            return Response({
                'error': 'You can only update your own profile.'
            }, status=status.HTTP_403_FORBIDDEN)
        user.delete()
        return Response({
            'status': 'Account deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)
    



# patient 
# Custom permission to check if the user belongs to the "Doctors" group
class IsPatientGroupUser:
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Patients').exists()
    
class PatientsListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsDoctorGroupUser]

    def get(self, request):
        patients = User.objects.filter(groups__name='Patients')
        if patients:
            serialized_data = AllUserSerializer(patients, many=True)
            patients_data = [
                {
                    'id': patient['id'],
                    'name': f"{patient['first_name']} {patient['last_name']}",
                    'username': patient['username'],
                    'department': patient['department'],
                    'profile_photo': patient['profile_photo']
                }
                for patient in serialized_data.data
            ]
            return Response(patients_data, status=status.HTTP_200_OK)
        return Response({
            "message": "no patient registered"
        }, status=status.HTTP_204_NO_CONTENT)

class PatientDetailView(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = request.user
        try:
            patient = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.id == patient.id or user.groups.filter(name='Doctors'):
            serialized_data = UserSerializer(patient)
            return Response(serialized_data.data, status=status.HTTP_200_OK)
        
        return Response({
            'message': 'you are not authorized to get this data'
        }, status=status.HTTP_403_FORBIDDEN)
    
    def patch(self, request, pk):
        user = request.user
        getting_data = request.data
        try:
            patient = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.id == patient.id or user.groups.filter(name='Doctors').exists():
            serialized_data = UserSerializer(patient, data=getting_data, partial=True)
            if serialized_data.is_valid():
                serialized_data.save()
                 # If profile_photo is provided, update the ProfilePhoto model
                profile_photo_url = getting_data.get('profile_photo', None)
                profile_photo_instance = patient.profile_photo

                if profile_photo_url is not None:
                    profile_photo_instance.photo_url = profile_photo_url
                else:
                    # Set profile photo to an empty string (or set it to None based on your model)
                    profile_photo_instance.photo_url = ''  # You can use None if your database allows null values
                profile_photo_instance.save()
                return Response(serialized_data.data, status=status.HTTP_200_OK)
            return Response(serialized_data.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({
            'message': 'you are not authorized to get this data'
        }, status=status.HTTP_403_FORBIDDEN)
    
    def delete(self, request, pk):
        user = request.user

        try:
            patient_data = User.objects.get(id=pk)
            if user.id == pk or user.groups.filter(name='Doctors'):
                patient_data.delete()
                return Response({
                    'message': 'patient data deleted'
                }, status=status.HTTP_200_OK)
            return Response({
                'message': 'you are not authorized do this operation'
            }, status=status.HTTP_403_FORBIDDEN)
        except BaseException: 
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)






#department
class DepartmentListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
         try:
            departments = Departments.objects.all()
            serialized_data = DepartmentsSerializer(departments, many=True)
            return Response(serialized_data.data, status=status.HTTP_200_OK)
         except Departments.DoesNotExist:
             return Response({
                 'error': 'No departments exist'
             }, status=status.HTTP_404_NOT_FOUND)
         
    def post(self, request):
        user = request.user

        if user.groups.filter(name='Patients').exists():
            return Response({
                'error': 'patients can not do this opertaion'
            }, status=status.HTTP_403_FORBIDDEN)
        
        getting_data = request.data
        serialized_data = DepartmentsSerializer(data=getting_data)

        if serialized_data.is_valid():
            serialized_data.save()
            return Response({
                'status': 'Department created successfully',
                'data': serialized_data.data
            }, status=status.HTTP_201_CREATED)
        return Response(serialized_data.errors, status=status.HTTP_400_BAD_REQUEST)


class DoctorsFromDepartmentListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsDoctorGroupUser]

    def get(self, request, pk):
        user = request.user
        user_department = user.profile.department
        try:
            department = Departments.objects.get(id=pk)
        except Departments.DoesNotExist:
            return Response({
                'error': 'Department does not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if user_department != department:
            return Response({
                'error': 'You can only access the list of doctors in your own department'
            }, status=status.HTTP_403_FORBIDDEN)
        
        doctors = User.objects.filter(profile__department=department, groups__name='Doctors') 
        if doctors.exists():
            serialized_data = AllUserSerializer(doctors, many=True)
            doctor_data = [
                {
                    'id': doctor['id'],
                    'name': f"{doctor['first_name']} {doctor['last_name']}"
                }
                for doctor in serialized_data.data
            ]
            return Response(doctor_data, status=status.HTTP_200_OK)
        return Response({'message': 'No doctors found in this department'}, status=status.HTTP_204_NO_CONTENT)



class PatientsFromDepartmentListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsDoctorGroupUser]

    def get(self, request, pk):
        user = request.user
        user_department = user.profile.department
        try:
            department = Departments.objects.get(id=pk)
        except Departments.DoesNotExist:
            return Response({
                'error': 'Department does not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if user_department != department:
            return Response({
                'error': 'You can only access the list of doctors in your own department'
            }, status=status.HTTP_403_FORBIDDEN)
        
        patients = User.objects.filter(profile__department=department, groups__name='Patients') 
        if patients.exists():
            serialized_data = AllUserSerializer(patients, many=True)
            patient_data = [
                {
                    'id': patient['id'],
                    'name': f"{patient['first_name']} {patient['last_name']}"
                }
                for patient in serialized_data.data
            ]
            return Response(patient_data, status=status.HTTP_200_OK)
        return Response({'message': 'No doctors found in this department'}, status=status.HTTP_204_NO_CONTENT)





# patient records
class PatientsRecordsView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsDoctorGroupUser]

    def get(self, request):
        user = request.user
        user_department = user.profile.department

        try:
            patient_records = PatientRecords.objects.filter(department=user_department)
            serialized_data = PatientRecordsSerializer(patient_records, many=True)
            return Response(serialized_data.data, status=status.HTTP_200_OK)
        except PatientRecords.DoesNotExist:
            return Response({
                'error': 'patients does not exist in this department'
            }, status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request):
        doctor = request.user
        doctor_department = doctor.profile.department
        getting_data = request.data

        try:
            required_patient =  User.objects.get(id=getting_data['patient'], groups__name='Patients')
        except User.DoesNotExist:
            return Response({
                'error': 'user does not exist with this credentials'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if required_patient.profile.department != doctor_department:
                return Response({
                    'error': 'patient is not in your department'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
        # but present in same department then
        if PatientRecords.objects.filter(patient=required_patient).exists():
            return Response({
                'error': 'patient record already exist'
            }, status=status.HTTP_400_BAD_REQUEST)
        # id do not have report, restricting some fields and making new report with already registered user
        restricted_fields = ['report_id', 'department']
        for field in restricted_fields:
            if field in getting_data:
                return Response({
                    'error': f'You are not allowed to update the {field} field.'
                }, status=status.HTTP_400_BAD_REQUEST)
        # Set the department to the patient's department and create the record
        patient_record_data = {
            **getting_data,  # include all allowed fields from the request
            'patient': required_patient.id,
            'department': required_patient.profile.department.id
        }
        # Update the allowed fields
        serializer = PatientRecordsSerializer(data=patient_record_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'Patient record created successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



        

class SinglePatientRecordView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user =  request.user

        try:
            patient = User.objects.get(id=pk, groups__name='Patients')
        except User.DoesNotExist:
            return Response({
                'error': 'patient does not exist'
            }, status=status.HTTP_404_NOT_FOUND)

        if user.id == pk or (
            user.groups.filter(name='Doctors') and
            user.profile.department == patient.profile.department
        ):
            try:
                patient_record = PatientRecords.objects.get(patient=pk)
                serialized_data = PatientRecordsSerializer(patient_record)
                return Response(serialized_data.data, status=status.HTTP_200_OK)
            except PatientRecords.DoesNotExist:
                return Response({
                    'error': 'No records found for this patient'
                }, status=status.HTTP_404_NOT_FOUND)
        return Response({
            'error': 'you can not access this data'
        },status=status.HTTP_401_UNAUTHORIZED)
    
    def patch(self, request, pk):
        user =  request.user
        getting_data = request.data

        try:
            patient = User.objects.get(id=pk, groups__name='Patients')
        except User.DoesNotExist:
            return Response({
                'error': 'patient does not exist'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if user.id == pk or (
            user.groups.filter(name='Doctors') and
            user.profile.department == patient.profile.department
        ):
            # checking the restricted fields
            restricted_fields = ['report_id', 'department', 'patient']
            for field in restricted_fields:
                if field in getting_data:
                    return Response({
                        'error': f'You are not allowed to update the {field} field.'
                    }, status=status.HTTP_400_BAD_REQUEST)
            # saving the data
            patient_record = PatientRecords.objects.get(patient=pk) 
            serialized_data = PatientRecordsSerializer(patient_record, data=getting_data, partial=True)
            if serialized_data.is_valid():
                serialized_data.save()
                return Response(serialized_data.data, status=status.HTTP_200_OK)
            return Response(serialized_data.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({
            'error': 'you can not access this data'
        },status=status.HTTP_401_UNAUTHORIZED)

    
    def delete(self, request, pk):
        user = request.user

        try:
            patient = User.objects.get(id=pk, groups__name='Patients')
        except User.DoesNotExist:
            return Response({
                'error': 'patient does not exist'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if user.id == pk or (
            user.groups.filter(name='Doctors') and
            user.profile.department == patient.profile.department
        ):
            try:
                patient_record = PatientRecords.objects.get(patient=pk)
                patient_record.delete()
                return Response({
                    "message": 'patient_record deleted'
                }, status=status.HTTP_200_OK)
            except PatientRecords.DoesNotExist:
                return Response({
                    'error': 'No records found for this patient'
                }, status=status.HTTP_404_NOT_FOUND)
        return Response({
            'error': 'you can not access this data'
        },status=status.HTTP_401_UNAUTHORIZED)
    


# for profile details
class AllProfileDetails(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            current_user = User.objects.get(id=user.id)
        except User.DoesNotExist:
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serialized_data = AllInfoSerializer(current_user)
        return Response(serialized_data.data, status=status.HTTP_200_OK)