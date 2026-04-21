"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Student, StudentContextValue, StudentPayload } from "@/types/types";

// Create context with undefined as default value. This helps us detect usage outside the provider
const StudentsContext = createContext<StudentContextValue | undefined>(undefined);

export function StudentsProvider({ children }: { children: React.ReactNode }) {
  // Global student list state 
  const [students, setStudents] = useState<Student[]>([]);

  // Loading flag for fetch operations to show spinners or disable UI during async actions
  const [loading, setLoading] = useState(false);

  // Currently selected student for editing or null if creating new student
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Load students from API and normalize data
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/students");
      const data = await response.json();

      if (!response.ok) {
        console.error("API error:", data);
        setStudents([]);
        return;
      }

      // Normalize MongoDB `_id` to string
      setStudents(
        Array.isArray(data)
          ? data.map((student) => ({
              ...student,
              _id: String(student._id),
            }))
          : []
      );
    } catch (error) {
      console.error("Fetch students error:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch students once when provider mounts
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Create a new student and prepend it to the list
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

    setStudents((prev) => [
      {
        ...newStudent,
        _id: String(newStudent._id),
      },
      ...prev,
    ]);
  }, []);

  // Update an existing student in the local state
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

    const normalizedStudent = {
      ...updatedStudent,
      _id: String(updatedStudent._id),
    };

    setStudents((prev) =>
      prev.map((currentStudent) =>
        currentStudent._id === normalizedStudent._id
          ? normalizedStudent
          : currentStudent
      )
    );

    // Clear editing state after successful update
    setEditingStudent(null);
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

    setStudents((prev) => prev.filter((student) => student._id !== id));
  }, []);

  // Memoize context value to avoid unnecessary rerenders
  const value = useMemo(
    () => ({
      students,
      loading,
      editingStudent,
      fetchStudents,
      addStudent,
      updateStudent,
      deleteStudent,
      setEditingStudent,
    }),
    [
      students,
      loading,
      editingStudent,
      fetchStudents,
      addStudent,
      updateStudent,
      deleteStudent,
    ]
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