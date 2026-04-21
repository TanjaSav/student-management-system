import { Student } from "@/types/student";

export type StudentState = {
  students: Student[];
  loading: boolean;
  editingStudent: Student | null;
};

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

// Reducer handles all CRUD-related state changes
export function studentReducer(
  state: StudentState,
  action: StudentAction
): StudentState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_STUDENTS":
      return { ...state, students: action.payload };

    case "ADD_STUDENT":
      return { ...state, students: [action.payload, ...state.students] };

    case "UPDATE_STUDENT":
      return {
        ...state,
        // Replace old student with updated one
        students: state.students.map((student) =>
          student._id === action.payload._id ? action.payload : student
        ),
        editingStudent: null,
      };

    case "DELETE_STUDENT":
      return {
        ...state,
        // Remove student from state by id
        students: state.students.filter(
          (student) => student._id !== action.payload
        ),
      };

    case "SET_EDITING_STUDENT":
      return { ...state, editingStudent: action.payload };

    default:
      return state;
  }
}