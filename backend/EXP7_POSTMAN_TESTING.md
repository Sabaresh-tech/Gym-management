# Experiment 7: Validating RESTful APIs using Postman

## Test Summary Matrix

| Test Case | Method | Endpoint | Purpose | Expected Status | Validation |
|---|---|---|---|---|---|
| Health Check | GET | `/api/health` | Verify API is up and running | 200 OK | Response is JSON, `success` is true |
| Register Admin | POST | `/api/users/register` | Register a test admin user | 201 Created | Response is JSON, `success` is true, user created |
| Login Admin | POST | `/api/users/login` | Login admin & get JWT token | 200 OK | Response is JSON, token received |
| Register Staff | POST | `/api/users/register` | Register a test staff user | 201 Created | Response is JSON, `success` is true |
| Login Staff | POST | `/api/users/login` | Login staff & get JWT token | 200 OK | Response is JSON, token received |
| Get Current User | GET | `/api/users/me` | Fetch authenticated user data | 200 OK | Response is JSON, user info matches |
| Get All Members | GET | `/api/members` | Retrieve a list of all members | 200 OK | Response is JSON, array of members |
| Create Member | POST | `/api/members` | Create a new member | 201 Created | `success` is true, returns member object |
| Get Member By ID | GET | `/api/members/:id` | Fetch specific member | 200 OK | Response matches ID |
| Update Member | PUT | `/api/members/:id` | Update a member | 200 OK | Updated data returned |
| Delete Member | DELETE | `/api/members/:id` | Delete a member | 200 OK | `success` is true |
| Create Membership | POST | `/api/memberships` | Create a membership plan | 201 Created | `success` is true, returns plan |
| Get Memberships | GET | `/api/memberships` | Retrieve all memberships | 200 OK | Array of plans returned |
| Update Membership| PUT | `/api/memberships/:id` | Update a membership plan | 200 OK | Updated data returned |
| Delete Membership| DELETE | `/api/memberships/:id` | Delete a membership plan | 200 OK | `success` is true |
| Create Trainer | POST | `/api/trainers` | Create a trainer | 201 Created | `success` is true, returns trainer |
| Get Trainers | GET | `/api/trainers` | Retrieve all trainers | 200 OK | Array of trainers returned |
| Update Trainer | PUT | `/api/trainers/:id` | Update a trainer | 200 OK | Updated data returned |
| Delete Trainer | DELETE | `/api/trainers/:id` | Delete a trainer | 200 OK | `success` is true |
| Create Attendance| POST | `/api/attendance` | Record member attendance | 201 Created | `success` is true, returns attendance |
| Get Attendance | GET | `/api/attendance` | Retrieve attendance records | 200 OK | Array of attendance returned |
| Update Attendance| PUT | `/api/attendance/:id` | Update attendance | 200 OK | Updated data returned |
| Delete Attendance| DELETE | `/api/attendance/:id` | Delete attendance | 200 OK | `success` is true |
| Missing Fields | POST | `/api/members` | Test missing required fields | 400 Bad Request | Validation errors |
| Invalid Email | POST | `/api/members` | Test invalid email format | 400 Bad Request | Validation errors |
| Invalid ObjectId | GET | `/api/members/not-id`| Test invalid MongoDB ID | 400 Bad Request | Validation errors |
| Non-existent ID | GET | `/api/members/:id` | Test non-existent ID | 404 Not Found | Not found error |
| Missing JWT | GET | `/api/members` | Test access without token | 401 Unauthorized | Unauthorized error |
| Invalid JWT | GET | `/api/members` | Test access with bad token | 401 Unauthorized | Unauthorized error |
| Staff Forbidden | POST | `/api/members` | Staff accessing admin-only route| 403 Forbidden | Access denied error |

## Setup Instructions

1. Start the MongoDB instance.
2. Navigate to the `backend/` directory and run `npm run dev`.
3. Import the `backend/postman_collection_exp7.json` into Postman.
4. Import the `backend/postman_environment_exp7.json` into Postman.
5. Select the imported environment in Postman.
6. Run the entire collection sequentially, or individual requests as needed.

## Positive Testing
Tested successful completion of CRUD operations for Members, Memberships, Trainers, Attendance, and Users, including data creation and ID extraction to environment variables. HTTP responses correctly returned `200` or `201` status codes.

## Negative Testing
Tested API endpoints with missing parameters, invalid data types, non-existent ObjectIDs, and invalid ObjectIDs. Expected failures were verified by returning `400` or `404` error codes and robust JSON responses.

## Authentication & Authorization Testing
Tested API endpoints with proper valid JSON Web Tokens (JWT), missing JWTs, and invalid JWTs. Also tested role-based authorization by attempting to access admin-only protected routes using a staff token. The API correctly returned `401 Unauthorized` and `403 Forbidden`.

## Conclusion
The RESTful APIs are robust and properly handle all valid and invalid inputs in a structured and expected manner.
