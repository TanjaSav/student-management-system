import { Student } from "@/types/student";

// Global state type
export type StudentState = {
  students: Student[];
  loading: boolean;
  editingStudent: Student | null;
};

// All available reducer actions
export type StudentAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_STUDENTS"; payload: Student[] }
  | { type: "ADD_STUDENT"; payload: Student }
  | { type: "UPDATE_STUDENT"; payload: Student }
  | { type: "DELETE_STUDENT"; payload: string }
  | { type: "SET_EDITING_STUDENT"; payload: Student | null };

// Initial reducer state
export const initialState: StudentState = {
  students: [],
  loading: false,
  editingStudent: null,
};

// Reducer function for student state management
export function studentReducer(
  state: StudentState,
  action: StudentAction
): StudentState {
  switch (action.type) {
    // Turn loading on or off
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    // Save all students in the state
    case "SET_STUDENTS":
      return { ...state, students: action.payload };

    // Add a new student to the beginning of the array
    case "ADD_STUDENT":
      return { ...state, students: [action.payload, ...state.students] };

    // Update one student by matching _id
    case "UPDATE_STUDENT":
      return {
        ...state,
        students: state.students.map((student) =>
          student._id === action.payload._id ? action.payload : student
        ),
        editingStudent: null,
      };

    // Remove a student by id
    case "DELETE_STUDENT":
      return {
        ...state,
        students: state.students.filter(
          (student) => student._id !== action.payload
        ),
      };

    // Set the current student being edited
    case "SET_EDITING_STUDENT":
      return { ...state, editingStudent: action.payload };

    // Return the current state for unknown actions
    default:
      return state;
  }
}