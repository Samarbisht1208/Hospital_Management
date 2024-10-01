from django.test import TestCase

# Create your tests here.


# def post(self, request):
#     user = request.user
#     user_department = user.profile.department
#     getting_data = request.data

#     try:
#         patient_record = PatientRecords.objects.get(patient_id=getting_data['patient'], department=user_department)
#         restricted_fields = ['report_id', 'department']
#         for field in restricted_fields:
#             if field in getting_data:
#                 return Response({
#                     'error': f'You are not allowed to update the {field} field.'
#                 }, status=status.HTTP_400_BAD_REQUEST)
        
#         # Update the allowed fields
#         serializer = PatientRecordsSerializer(patient_record, data=getting_data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({'status': 'Patient record updated successfully'}, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     except PatientRecords.DoesNotExist:
#         return Response ({
#             'error': 'This patient does not exist in your department or the provided patient ID is incorrect.'
#         }, status=status.HTTP_404_NOT_FOUND)