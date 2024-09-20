#  RESTful API for a Event Ticket Management System

This project is a comprehensive application designed to manage event tickets.

### Setup Instructions

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd <project-directory>`
3. Install dependencies: `npm install`
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Define the following environment variables in the `.env` file:
     ```
     DB_USER=<your-db-user>
     DB_PASSWORD=<your-db-password>
     DB_NAME=<your-db-name>

     MONGODB_URL=<your-mongodb-url>
     TOKEN_SECRET=<your-token-secret-key>

     TWILIO_ACCOUNT_SID=<your-twilio-sid>
     TWILIO_AUTH_TOKEN=<your-twilio-auth-token>
     TWILIO_PHONE_NUMBER=<your-twilio-number>

     STRIPE_SECRET_KEY=<your-stripe-secret-key>
     STRIPE_WEBHOOK_SECRET=<your-webhook-secret>
     ```
5. Start the server: `node server.js`

### API Endpoint Documentation

#### Authentication

- **POST /api/user/register**
  - Description: Register a new user.
  - Request Body:
    ```
    {
        "first_name": "string",
        "last_name": "string",
        "org_name": "string",
        "nic": "string",
        "phone": "string",
        "password": "string",
        "role": "string" (Valid values: "Admin", "Organizer", "User")
    }
    ```
  - Response: User object or error message.

- **POST /api/user/login**
  - Description: Login with existing credentials.
  - Request Body:
    ```
    {
        "phone": "string",
        "password": "string"
    }
    ```
  - Response: JWT token or error message.


- **Error Handling**:
  - If the token is missing or invalid, the server will respond with a `401 Unauthorized` or `403 Forbidden` status code accordingly.

Please ensure that the token is included in the headers for all requests to protected routes to ensure successful authentication and access.
