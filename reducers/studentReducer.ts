import { StudentAction, StudentState } from "@/types/types";

// Centralize all student state transitions in one reducer
export function studentReducer(
  state: StudentState,
  action: StudentAction
): StudentState {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "SET_STUDENTS":
      return {
        ...state,
        students: action.payload,
      };

    case "ADD_STUDENT":
      return {
        ...state,
        students: [action.payload, ...state.students],
      };

    case "UPDATE_STUDENT":
      return {
        ...state,
        students: state.students.map((student) =>
          student._id === action.payload._id ? action.payload : student
        ),
        editingStudent: null,
      };

    case "DELETE_STUDENT":
      return {
        ...state,
        students: state.students.filter(
          (student) => student._id !== action.payload
        ),
      };

    case "SET_EDITING_STUDENT":
      return {
        ...state,
        editingStudent: action.payload,
      };

    default:
      return state;
  }
}

// Initial state for the student reducer

export const initialStudentState: StudentState = {
  students: [],
  loading: false,
  editingStudent: null,
};