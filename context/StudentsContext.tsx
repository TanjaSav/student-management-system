"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { initialStudentState, studentReducer } from "@/reducers/studentReducer";
import { Student, StudentContextValue, StudentPayload } from "@/types/types";

// Create context with undefined as default value. This helps us detect usage outside the provider
const StudentsContext = createContext<StudentContextValue | undefined>(undefined);

export function StudentsProvider({ children }: { children: React.ReactNode }) {
  // Store all student-related data in reducer state
  const [state, dispatch] = useReducer(studentReducer, initialStudentState);

  // Load students from API and normalize data
  const fetchStudents = useCallback(async () => {
    try {
      // Dispatch reducer action before starting async loading
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await fetch("/api/students");
      const data = await response.json();

      if (!response.ok) {
        console.error("API error:", data);
        dispatch({ type: "SET_STUDENTS", payload: [] });
        return;
      }

      // Normalize MongoDB `_id` to string before saving it to reducer state
      dispatch({
        type: "SET_STUDENTS",
        payload: Array.isArray(data)
          ? data.map((student) => ({
              ...student,
              _id: String(student._id),
            }))
          : [],
      });
    } catch (error) {
      console.error("Fetch students error:", error);
      dispatch({ type: "SET_STUDENTS", payload: [] });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // Fetch students once when provider mounts
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Create a new student and prepend it to the list through the reducer
  const addStudent = useCallback(async (student: StudentPayload) => {
    const response = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });

    const newStudent = await response.json();

    if (!response.ok) {
      throw new Error(newStudent.error || "Failed to add student");
    }

    dispatch({
      type: "ADD_STUDENT",
      payload: {
        ...newStudent,
        _id: String(newStudent._id),
      },
    });
  }, []);

  // Update an existing student in reducer state
  const updateStudent = useCallback(async (id: string, student: StudentPayload) => {
    const response = await fetch(`/api/students/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });

    const updatedStudent = await response.json();

    if (!response.ok) {
      throw new Error(updatedStudent.error || "Failed to update student");
    }

    dispatch({
      type: "UPDATE_STUDENT",
      payload: {
        ...updatedStudent,
        _id: String(updatedStudent._id),
      },
    });
  }, []);

  // Delete a student after user confirmation
  const deleteStudent = useCallback(async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this student?");
    if (!confirmed) return;

    const response = await fetch(`/api/students/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to delete student");
    }

    dispatch({ type: "DELETE_STUDENT", payload: id });
  }, []);

  // Update the currently edited student through reducer action dispatch
  const setEditingStudent = useCallback((student: Student | null) => {
    dispatch({ type: "SET_EDITING_STUDENT", payload: student });
  }, []);

  // Memoize context value to avoid unnecessary rerenders
  const value = useMemo(
    () => ({
      students: state.students,
      loading: state.loading,
      editingStudent: state.editingStudent,
      fetchStudents,
      addStudent,
      updateStudent,
      deleteStudent,
      setEditingStudent,
    }),
    [state, fetchStudents, addStudent, updateStudent, deleteStudent, setEditingStudent]
  );

  return <StudentsContext.Provider value={value}>{children}</StudentsContext.Provider>;
}

// Custom hook for safer context usage
export function useStudents() {
  const context = useContext(StudentsContext);

  if (!context) {
    throw new Error("useStudents must be used within StudentsProvider");
  }

  return context;
}