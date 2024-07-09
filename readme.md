# Flight Management Application Frontend

This repository contains the frontend code for a Flight Management Application, featuring both admin and user login functionalities using JWT tokens for authentication. The application is built using HTML, CSS, and JavaScript and includes various features for managing flights, bookings, cancellations, and refunds.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Usage](#usage)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Admin Login:** Admin users can log in to manage flights, routes, cancellations, and refunds.
- **User Login:** Users can log in to book flights, view bookings, and request cancellations or refunds.
- **JWT Authentication:** Secure login using JWT tokens.
- **Flight Management:** Admins can add, update, and delete flight details.
- **Booking Management:** Users can book flights and view their bookings.
- **Cancellation Management:** Users can request cancellations; admins can view and manage cancellation requests.
- **Refund Management:** Admins can manage refund requests.
- **Responsive Design:** The application is responsive and works well on various screen sizes.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- A web browser (Chrome, Firefox, Safari, etc.)
- Internet connection
- Backend server running with endpoints for authentication, flight management, booking management, cancellation, and refund management.


## Usage

1. Start your backend server.
2. Open `index.html` in your web browser.
3. Use the login form to log in as an admin or user.
4. Navigate through the application to manage flights, bookings, cancellations, and refunds.


## Authentication

The application uses JWT tokens for authentication. After logging in, the JWT token is stored in `localStorage` and is used for subsequent API requests.

### Login
1. Open `login.html`.
2. Enter your email and password.
3. On successful login, the JWT token is stored in `localStorage`.

### Storing JWT Token
```javascript
localStorage.setItem('token', jwtToken);
```

### Using JWT Token in API Requests
```javascript
const token = localStorage.getItem('token');
fetch('/api/protected-route', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to modify the README to fit the specifics of your project.