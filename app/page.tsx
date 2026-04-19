"use client";

import { useEffect, useReducer } from "react";
import StudentForm from "@/components/StudentForm";
import StudentsTable from "@/components/StudentsTable";
import { initialState, studentReducer } from "@/reducers/studentReducer";
import { Student } from "@/types/student";

// Type for create/update requests without _id
type StudentPayload = Omit<Student, "_id">;

export default function HomePage() {
  // useReducer is required by the assignment
  const [state, dispatch] = useReducer(studentReducer, initialState);

  // Fetch students from the API
  async function fetchStudents() {
    try {
      // Turn loading on
      dispatch({ type: "SET_LOADING", payload: true });

      // Send GET request
      const response = await fetch("/api/students");
      const data = await response.json();

      // If the API returns an error, save an empty array
      if (!response.ok) {
        console.error("API error:", data);
        dispatch({ type: "SET_STUDENTS", payload: [] });
        return;
      }

      // Dispatch action to save students in state
      dispatch({
        type: "SET_STUDENTS",
        payload: Array.isArray(data) ? data : [],
      });
    } catch (error) {
      console.error("Fetch students error:", error);

      // Save an empty array if something fails
      dispatch({ type: "SET_STUDENTS", payload: [] });
    } finally {
      // Turn loading off
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  // Load students on first page render
  useEffect(() => {
    fetchStudents();
  }, []);

  // Add a new student
  async function handleAddStudent(student: StudentPayload) {
    try {
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

      // Dispatch action to add the new student to state
      dispatch({
        type: "ADD_STUDENT",
        payload: {
          ...newStudent,
          _id: String(newStudent._id),
        },
      });
    } catch (error) {
      console.error("Add student error:", error);
    }
  }

  // Update an existing student
  async function handleUpdateStudent(id: string, student: StudentPayload) {
    try {
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

      // Dispatch action to update the student in state
      dispatch({
        type: "UPDATE_STUDENT",
        payload: {
          ...updatedStudent,
          _id: String(updatedStudent._id),
        },
      });
    } catch (error) {
      console.error("Update student error:", error);
    }
  }

  // Delete a student
  async function handleDeleteStudent(id: string) {
    const confirmed = window.confirm("Are you sure you want to delete this student?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete student");
      }

      // Dispatch action to remove the student from state
      dispatch({ type: "DELETE_STUDENT", payload: id });
    } catch (error) {
      console.error("Delete student error:", error);
    }
  }

  // Set the selected student for editing
  function handleEditStudent(student: Student) {
    dispatch({
      type: "SET_EDITING_STUDENT",
      payload: {
        ...student,
        _id: String(student._id),
      },
    });
  }

  // Cancel editing mode
  function handleCancelEdit() {
    dispatch({ type: "SET_EDITING_STUDENT", payload: null });
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-100 via-white to-sky-100 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-4xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
          <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr] lg:items-center">
            <div>

              <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Student Management System
              </h1>

             
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl bg-slate-900 p-5 text-white shadow-sm">
                <p className="text-sm text-slate-300">Total Students</p>

                {/* Using reducer state in the UI */}
                <p className="mt-2 text-4xl font-bold">{state.students.length}</p>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm text-slate-500">Editing Mode</p>

                {/* Using reducer state in the UI */}
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {state.editingStudent
                    ? `${state.editingStudent.firstName} ${state.editingStudent.lastName}`
                    : "No student selected"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <StudentForm
            editingStudent={state.editingStudent}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onCancelEdit={handleCancelEdit}
          />

          <StudentsTable
            students={Array.isArray(state.students) ? state.students : []}
            loading={state.loading}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
          />
        </div>
      </div>
    </main>
  );
}