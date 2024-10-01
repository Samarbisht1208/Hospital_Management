from django.urls import path, include
from home.views import RegisterView, UserViewSet, DoctorsListView, DoctorDetailView, PatientsListView, PatientDetailView, DepartmentListView, DoctorsFromDepartmentListView, PatientsFromDepartmentListView, PatientsRecordsView, SinglePatientRecordView, AllProfileDetails

# for viewset action
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('', include(router.urls)),
    path('doctors/', DoctorsListView.as_view()),
    path('doctors/<int:pk>/', DoctorDetailView.as_view()),
    path('patients/', PatientsListView.as_view()),
    path('patients/<int:pk>/', PatientDetailView.as_view()),
    path('departments/', DepartmentListView.as_view()),
    path('department/<int:pk>/doctors/', DoctorsFromDepartmentListView.as_view()),
    path('department/<int:pk>/patients/', PatientsFromDepartmentListView.as_view()),
    path('patient_records/', PatientsRecordsView.as_view()),
    path('patient_records/<int:pk>/', SinglePatientRecordView.as_view()),
    path('all_details/', AllProfileDetails.as_view()),
]
