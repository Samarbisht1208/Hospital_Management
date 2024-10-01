import React from 'react';
import { useState, useEffect } from 'react';
import UserDetails from '../UserDetails/UserDetails';
import EditProfile from '../EditProfile/EditProfile';
import Departments from '../Departments/Departments';
import MyRecords from '../MyRecords/MyRecords';
import PatientRecords from '../PatientRecords/PatientRecords';
import AllPatients from '../AllPatients/AllPatients';
import AllDoctors from '../AllDoctors/AllDoctors';

const Content = ({ selectedContent, userData, refreshUserData }) => {
  // for getting all the departments
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    const fetchingDepartments = async () => {
      const token = localStorage.getItem('token')

      if (token) {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/departments/',
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
              }
            })

          if (response.ok) {
            const data = await response.json()
            setDepartments(data)
          } else {
            console.log('Failed to fetch departments details')
          }
        } catch (error) {
          console.log('Error:', error)
        }
      }
    }
    fetchingDepartments()
  }, [])

  // for getting all the patient records
  const [patientRecords, setPatientRecords] = useState([])

  useEffect(() => {
    const fetchingPatientRecords = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/patient_records/',
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
              }
            })
          if (response.ok) {
            const data = await response.json()
            setPatientRecords(data)
          } else {
            console.log('Failed to fetch patient records')
          }
        } catch (error) {
          console.log('error:', error)
        }
      }
    }
    fetchingPatientRecords()
  }, [])

  // Define this function to refresh patient records after delete or edit
  const refreshPatientRecords = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/patient_records/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPatientRecords(data);
        } else {
          console.log('Failed to refresh patient records');
        }
      } catch (error) {
        console.log('Error:', error);
      }
    }
  };

  return (
    <div className="content">
      {selectedContent === 'Home' && userData ? (
        <UserDetails userData={userData} />
      ) : selectedContent === 'EditProfile' ? (
        <EditProfile userData={userData} refreshUserData={refreshUserData} />
      ) : selectedContent === 'Departments' ? (
        <>{
          departments.map((department, index) => (
            <Departments
              key={index}
              departmentName={department.name}
              diagnostics={department.diagnostics}
              specialization={department.specialization}
              location={department.location}
              id={department.id}
            />
          ))}
        </>
      ) : selectedContent === 'MyRecords' ? (
        <MyRecords userData={userData} />
      ) : selectedContent === 'PatientRecords' ? (
        <>{
          patientRecords.map((record, index) => (
            <PatientRecords
              key={index}
              record_id={record.record_id}
              department={record.department}
              created_date={record.created_date}
              diagnostics={record.diagnostics}
              treatments={record.treatments}
              observations={record.observations}
              patient_id={record.patient}
              first_name={record.patient_first_name}
              last_name={record.patient_last_name}
              username={record.username}
              refreshPatientRecords={refreshPatientRecords}
            />
          ))}
        </>
      ) : selectedContent === 'AllPatients' ? (
        <AllPatients />
      ) : selectedContent === 'AllDoctors' ? (
        <AllDoctors />
      ) : (
        <div>
          <h2>{selectedContent}</h2>
          <p>This is the {selectedContent} page content.</p>
        </div>
      )}
    </div>
  );
};

export default Content;
