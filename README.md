## Habit Tracking App with Social-Networking Features

### How to Run Locally:
1. You need MongoDB installed locally with a server opened at the default MongoDB address `localhost:27017`.
2. Create a MongoDB Database named `HabitualDB`.f
3. Run `npm i` on both `/client` and `/api` directories.
4. Run `npm start` on both `/client` and `/api` directories.

### Stack, Schemas

**STACK:** This app is made using the MERN stack.

**Additional Technologies:**
1. Mongoose for MongoDB connectivity.
2. Passport (local strategy) for Authentication, authorization, and session management.
3. Express / Node for backend server.

### Schema for Models:

#### User Schema
- userId: String
- username: String
- password: String
- name: String
- motto: String
- following:
  - type: Array
  - default: []
- followers:
  - type: Array
  - default: []

Passwords are hashed using the bcrypt JS library with 10 rounds of salt.

#### Comment Schema
- noteId: String
- comments:
  - type: Array
    - commentId: String
    - userId: String
    - comment: String
    - name: String
    - date: String

#### Habit Schema
- userId: String
- habits:
  - type: Array
    - createDate: String
    - makeHabit: String
    - breakHabit: String
    - dueDate: String

#### Note Schema
- makeHabit: String
- userId: String
- notes:
  - type: Array
    - noteId: String
    - date: String
    - note: String
    - done:
      - type: Boolean
      - default: false

These schemas enable easy CRUD operations and relational data handling for the app's functionalities.

### How to Use:
- Login / SignUp ![Login/SignUp](images/Pasted%20image%2020240717235424.png)

- Create a new Habitual
  ![Create New Habitual 1](images/Pasted%20image%2020240718001709.png)
  ![Create New Habitual 2](images/Pasted%20image%2020240718001734.png)

- Mark your habit done or not with added notes
  ![Mark Habit Done](images/Pasted%20image%2020240718001939.png)

- Search for and Follow people
  ![Search and Follow 1](images/Pasted%20image%2020240717235910.png)
  ![Search and Follow 2](images/Pasted%20image%2020240718000106.png)

- View their "Habitualls"
  ![View Habitualls](images/Pasted%20image%2020240718000654.png)

- Leave comments or give them suggestions for their notes
  ![Leave Comments](images/Pasted%20image%2020240718001411.png)

- View your progress in your profile
  ![View Progress](images/Pasted%20image%2020240718001528.png)
