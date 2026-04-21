"use client";

import { useEffect, useReducer, useState } from "react";
import StudentForm from "@/components/StudentForm";
import StudentsTable from "@/components/StudentsTable";
import { initialState, studentReducer } from "@/reducers/studentReducer";
import { Student } from "@/types/student";
import Image from "next/image";

type StudentPayload = Omit<Student, "_id">;

export default function HomePage() {
  // Reducer state for students, loading, and editing mode
  const [state, dispatch] = useReducer(studentReducer, initialState);

  // Controls modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load all students from the API
  async function fetchStudents() {
    try {
      // Turn loading on
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await fetch("/api/students");
      const data = await response.json();

      if (!response.ok) {
        console.error("API error:", data);
        dispatch({ type: "SET_STUDENTS", payload: [] });
        return;
      }

      // Save students into reducer state
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
      // Turn loading off
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  // Fetch students once when page loads
  useEffect(() => {
    fetchStudents();
  }, []);

  // Create a new student
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

      // Add new student into reducer state
      dispatch({
        type: "ADD_STUDENT",
        payload: {
          ...newStudent,
          _id: String(newStudent._id),
        },
      });
    } catch (error) {
      console.error("Add student error:", error);
      throw error;
    }
  }

  // Update existing student
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

      // Update student in reducer state
      dispatch({
        type: "UPDATE_STUDENT",
        payload: {
          ...updatedStudent,
          _id: String(updatedStudent._id),
        },
      });
    } catch (error) {
      console.error("Update student error:", error);
      throw error;
    }
  }

  // Delete student by id
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

      // Remove student from reducer state
      dispatch({ type: "DELETE_STUDENT", payload: id });
    } catch (error) {
      console.error("Delete student error:", error);
    }
  }

  // Open modal for adding a new student
  function handleOpenAddModal() {
    dispatch({ type: "SET_EDITING_STUDENT", payload: null });
    setIsModalOpen(true);
  }

  // Open modal for editing selected student
  function handleEditStudent(student: Student) {
    dispatch({
      type: "SET_EDITING_STUDENT",
      payload: {
        ...student,
        _id: String(student._id),
      },
    });
    setIsModalOpen(true);
  }

  // Reset editing mode
  function handleCancelEdit() {
    dispatch({ type: "SET_EDITING_STUDENT", payload: null });
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-100 via-white to-sky-100 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-4xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
          <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr] lg:items-center">
            <div className="flex gap-8 ">
                <Image src={"/student-management-illustration.svg"} alt="Illustration of student management" width={50} height={16} className="w-12.5 h-13 object-cover" /> 
              <h1 className="text-2xl mt-3 font-Semibold tracking-tight text-slate-900 md:text-3xl">
                Student Management System
              </h1>
            
              

            
            </div>
          </div>
        </section>

       <StudentsTable
        students={Array.isArray(state.students) ? state.students : []}
        loading={state.loading}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
        onAdd={handleOpenAddModal}
      />
        <StudentForm
          editingStudent={state.editingStudent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddStudent={handleAddStudent}
          onUpdateStudent={handleUpdateStudent}
          onCancelEdit={handleCancelEdit}
        />
      </div>
    </main>
  );
}