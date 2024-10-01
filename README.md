# Hospital Management System

## Project Overview

The Hospital Management System is a comprehensive full-stack web application designed to streamline the administration of hospital operations. This system enables the registration of users as either doctors or patients, with distinct functionalities tailored to each role. Doctors can view and manage patient records within their department, while patients can access and update their personal information and medical records. The application leverages Django REST Framework for backend development and React for the frontend, ensuring a user-friendly experience, efficient data management, and a secure login system.

## Distinctiveness and Complexity

This project distinguishes itself from standard projects in both scope and functionality, encompassing a range of advanced features across multiple technology stacks. Below are the key points that demonstrate the distinctiveness and complexity of this application:

### 1. **Full-Stack Integration**
   - **Backend (Django)**: The backend is built using Django, with Django REST Framework (DRF) to serve data via REST APIs. The data is structured in a relational database (SQLite or other supported database), and all interactions are handled through REST endpoints, showcasing a robust understanding of API development.
   - **Frontend (React)**: On the frontend, React is used for rendering the user interface dynamically, with React Router employed to manage the user experience and navigate between pages. The separation of concerns between backend and frontend demonstrates the ability to work with both technologies and connect them seamlessly using HTTP methods.

### 2. **Role-Based Access Control (RBAC)**
   - This application incorporates a distinct **multi-user role system**, where users are grouped into two categories: Doctors and Patients. Each role is granted specific permissions:
     - **Doctors** can view all patients within their department, manage patient records, and update their profile.
     - **Patients** have access to their personal records and can update their profile information.
   - Implementing this user-based access control adds a layer of complexity, as it requires dynamic routing and condition-based rendering of frontend components based on the user’s role. Additionally, the backend ensures that only authorized users can access certain data, enhancing the security of the application.

### 3. **Dynamic Routing and Protected Routes**
   - Using **React Router**, the application dynamically renders different views depending on the logged-in user’s role (Doctor or Patient). This routing allows for a smooth user experience, enabling seamless navigation between different sections like profiles, department lists, patient records, and more.
   - Protected routes ensure that users cannot access certain pages without authentication, adding complexity in terms of session management and security. React's state management and use of hooks (like `useNavigate`) further enhance the application's interactivity.

### 4. **Custom Authentication with Token-Based Security**
   - The application features a **custom token-based authentication system**, allowing users to log in securely and receive tokens for authorized access to the REST API. This involves setting up Django’s Token Authentication system, managing user tokens, and ensuring security throughout the app by allowing only authenticated requests. This authentication system is more secure than basic authentication and demonstrates proficiency in implementing secure user sessions in modern web applications.

### 5. **Data Management and Record Linking**
   - The **Patient Records** system automatically links new patients to their records based on their registration. Whenever a user registers in the Patients group, a corresponding `PatientRecords` object is created. Doctors can view patient records within their assigned department only, adding a level of business logic that requires filtering data based on user roles and ensuring the integrity of the data in the database.
   - This linking of models between users, patient records, and departments highlights a deeper understanding of data relationships and model management in Django.

### 6. **Efficient Use of React for State and Component Management**
   - The **component-based architecture** of the React frontend allows for reusability and clean, maintainable code. Components like `EditProfile`, `Departments`, and `PatientRecords` are modular, which helps in managing state across different sections of the app efficiently. By using state hooks and passing data between parent and child components, the application ensures data consistency and responsiveness.

### 7. **Asynchronous API Calls and State Management**
   - The application efficiently handles **asynchronous API requests** using React’s `fetch` functionality. This is crucial for retrieving and submitting data (such as updating profiles or fetching patient records) without refreshing the page. The application manages data states between different views, ensuring a smooth and interactive user experience.

## File Structure and Contents

- **backend/hospital_management/**:
    - `manage.py`: Django’s command-line utility for administrative tasks such as running the server or database migrations.
    - `settings.py`: Configuration settings for the Django application, including database setup, middleware, and static file management.
    - `urls.py`: Defines the URL routing for the application, connecting API endpoints to the appropriate views.
    - `api/`: Contains all the core Django app files, including:
      - **Models**: For database structure (e.g., `User`, `PatientRecords`, `Department`).
      - **Views**: For handling HTTP requests and returning JSON responses.
      - **Serializers**: For converting Django models into JSON for the frontend to consume via REST APIs.

- **frontend/hospital/**:
    - `src/`: Contains all React components, services, and styles.
      - `App.js`: The main React component that manages routing and overall state.
      - `components/`: Contains reusable React components for the application’s various pages, including:
        - `Home.jsx`: Displays the homepage with links for login, registration, and admin access.
        - `EditProfile.jsx`: A form that allows users to edit their profile (username, first name, last name, and profile photo).
        - `Departments.jsx`: Lists all the hospital departments in a card-style format.
        - `PatientRecords.jsx`: Displays patient records, dynamically adjusted based on the user’s role.
      - `services/`: API service files that handle HTTP requests to the Django backend.
      - `index.js`: The entry point of the React application, where the app is rendered into the DOM.
    - `public/`: Contains static assets like images and HTML files that are needed for the frontend.
    - `static/`: Contains media files, including any images referenced in the React app.

- **requirements.txt**: A list of all the Python packages required to run the backend Django application, such as:
    ```
    Django==4.2
    djangorestframework==3.14.0
    django-cors-headers==3.13.0
    ```

## How to Run the Application

### Prerequisites

Before you begin, make sure you have the following installed:
- Python 3.8 or higher
- Node.js 14.x or higher
- pip for Python package management
- npm or yarn for Node.js package management

### Backend Setup

1. Navigate to the backend directory and install the required packages:
   ```bash
   cd backend/hospital_management
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver

