## Student Management System (CRUD)

This project is a Student Management System built using CRUD operations:
Create, Read, Update, and Delete.

### Goal

The goal was to demonstrate:
- using a reducer
- dispatching actions
- using state in the UI

### Implementation

- Global state is managed with **React Context + useReducer**
- Actions are dispatched to update the state:
  - add, update, delete, set students, set loading
- State is used directly in the UI:
  - rendering students list
  - showing loading state
  - handling editing

### Components

- **StudentsTable** — displays students (desktop table + mobile cards)
- **StudentForm** — handles create/update (local state with useState)
- **StudentsContext** — manages global state with reducer

### Tech Stack

- React / Next.js
- TypeScript
- Tailwind CSS
- MongoDB Atlas

### Summary

The project demonstrates:
- reducer-based state management
- dispatching actions
- connecting state to the UI