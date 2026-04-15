BU Transakto – Document Request Management System
WHAT WAS IMPLEMENTED THIS WEEK?

Phase 3: Front-End Implementation
Overview
BU Transakto is a web-based Document Request Management System designed for Bicol University Polangui Campus. The system allows students to request official documents online while enabling staff to manage and process these requests efficiently.
This phase focuses on the front-end development, transforming system designs (Use Case Diagram, ERD, and System Flow) into a functional and user-friendly interface.
During this phase, the team successfully developed and completed the working front-end pages of the system, including:
1. User Access and Authentication
Landing Page with User Role Selection (Student / Staff)
Login Page for both users
Registration Page for students
2. Student Interface
Student Dashboard (main navigation hub)
Document Request Page (form submission)
Request Status Page (track requests)
Notifications Page (system updates)
Profile Page (user information management)
Settings Page (account configuration)
Feedback / Support Page (user concerns and suggestions)
3. Staff Interface
Staff Dashboard (overview of requests)
Manage Requests Page (approve/reject/update status)
Notifications Page (send updates to students)
Profile Page (staff account management)
Settings Page (system/account preferences)
4. UI/UX and Structure
Organized multiple HTML pages
Responsive and clean layout using CSS / Bootstrap
Functional navigation between pages
Structured forms aligned with backend requirements
Initial JavaScript placeholders for future backend integration
The implemented front-end directly reflects the system’s Use Case Diagram by providing interfaces for each major function:
 
Use Case
Implemented Page
Select User Role
Landing Page
User Login
Login Page
User Registration
Registration Page
Submit Document Request
Document Request Page
Track Request Status
Request Status Page
Receive Notifications
Notifications Page
Manage Profile
Profile Page
Manage Settings
Settings Page
Submit Feedback / Report Issue
Feedback Page
Process Requests (Staff)
Manage Requests Page
Monitor Requests (Staff)
Staff Dashboard

 HOW IT ALLIGNS WITH THE USE CASE?
Each page corresponds to a specific user action identified in the Use Case Diagram, ensuring that all required system functionalities are accessible through the interface.
Alignment with the Entity Relationship Diagram (ERD)
The front-end design was structured to align with the system’s ERD, ensuring compatibility for backend integration. The following mappings were established:
•	User Entity
Represented in the Registration, Login, Profile, and Settings pages.
Fields such as name, email, and password are captured through input forms. 
•	Document Request Entity
Represented in the Document Request page.
Input fields align with the required request attributes, such as document type and details. 
•	Request Status Entity
Reflected in the Request Status page.
Displays status values such as pending, approved, rejected, or completed. 
•	Notification Entity
Represented in the Notifications page.
Displays system-generated updates linked to user requests. 
•	Feedback Entity
Represented in the Feedback/Support page.
Captures user messages, issues, and suggestions. 
The consistency between form inputs and ERD attributes ensures that data collected from the front-end can be seamlessly integrated into the backend database in the next phase.
Conclusion
Phase 3 successfully delivered a fully functional front-end prototype of the BU Transakto system. The interface is aligned with both the Use Case Diagram and the ERD, ensuring readiness for backend integration in the next development phase.
The system now provides a clear and user-friendly workflow for both students and staff, improving the efficiency of document request processing.
