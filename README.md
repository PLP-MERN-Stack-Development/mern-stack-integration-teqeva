# MERN Stack Blog Application

This is a full-featured blog application built using the MERN (MongoDB, Express.js, React, Node.js) stack. It provides a platform for users to register, create, read, update, and delete blog posts, complete with image uploads and a dynamic real-time commenting system. 

## ✨ Features Overview

* **Full CRUD Lifecycle:** Complete functionality for managing blog posts.
* **Secure Authentication:** User registration and login secured with JWT (JSON Web Tokens) passed via HTTP-only cookies.
* **Authorization:** Ensures only the post author or an administrator can modify or delete a post or comment.
* **Image Uploads:** Integrates Multer middleware for handling and storing featured image files.
* **Dynamic Comments:** Supports multi-level conversations with replies and real-time deletion for authorized users.
* **Responsive Design:** Modern, clean UI built with Tailwind CSS.

## ⚙️ Getting Started

### Prerequisites

You will need the following installed on your system:

* Node.js (LTS recommended)
* npm (Node Package Manager)
* A running instance of MongoDB (local).

### Installation and Setup

1.  **Clone the Repository:**
    ```bash
    git clone [YOUR_REPOSITORY_URL]
    cd mern-blog
    ```

2.  **Install Dependencies:**
    Install dependencies for both the backend (`server/`) and frontend (`client/`).

    ```bash
    # Install backend dependencies (in the root directory)
    npm install
    cd client
    # Install frontend dependencies (in the client/ directory)
    npm install
    cd ..
    ```

3.  **Setup Environment Variables:**
    Create a file named **`.env`** in the root directory (`mern-blog/`) and add your configuration details:


4.  **Create Uploads Folder:**
    Create a directory named `uploads` in the root folder to store uploaded images:
    ```bash
    mkdir uploads
    ```

### Running the Application

1.  **Start the Backend (in the root directory):**
    ```bash
    npm run dev  # Or whatever script you use to start Node/Express
    ```
    The API will run on `http://localhost:5000`.

2.  **Start the Frontend (in the `client/` directory):**
    ```bash
    cd client
    npm run dev  # Or whatever script you use to start React
    ```
    The React application will be accessible at `http://localhost:5173`.

---

## 📋 API Documentation

The backend API uses **`/api/`** as the base URL. All protected routes rely on the `protect` middleware to verify a valid JWT provided in an **HTTP-only cookie**.

### 1. User Authentication (`/api/users`)

| Method | Route | Description | Access | Body/Parameters |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/users/register` | Registers a new user account. | Public | `{username, email, password}` |
| **POST** | `/api/users/login` | Authenticates a user and sets the JWT cookie. | Public | `{email, password}` |
| **POST** | `/api/users/logout` | Clears the authentication cookie to log out the user. | Public | None |
| **GET** | `/api/users/profile` | Retrieves the authenticated user's profile data. | Private | None |

### 2. Blog Posts (`/api/posts`)

| Method | Route | Description | Access | Body/Parameters |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/posts` | Retrieves all blog posts (sorted by creation date). | Public | None |
| **GET** | `/api/posts/:id` | Retrieves a single post by ID or slug. | Public | URL Param: `:id` or `:slug` |
| **POST** | `/api/posts` | Creates a new blog post. Must include file data for images. | Private | `FormData`: `{title, content, categoryId, image}` |
| **PUT** | `/api/posts/:id` | Updates an existing blog post. | Private (Author/Admin) | `FormData`: updated fields (title, content, **new image file**) |
| **DELETE** | `/api/posts/:id` | Deletes a blog post. | Private (Author/Admin) | None |

### 3. Categories (`/api/categories`)

| Method | Route | Description | Access | Body/Parameters |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/categories` | Retrieves all existing categories. | Public | None |
| **POST** | `/api/categories` | Creates a new category. | Private (Admin) | `{name}` |

### 4. Comments (`/api/comments`)

| Method | Route | Description | Access | Body/Parameters |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/comments/:postId` | Retrieves all top-level comments and one level of replies for a specific post. | Public | URL Param: `:postId` |
| **POST** | `/api/comments` | Creates a new comment or a reply. | Private | `{postId, content, parentCommentId (optional)}` |
| **DELETE** | `/api/comments/:id` | Deletes a comment and all its associated replies. | Private (Author/Admin) | URL Param: `:id` |
