"use client";

import { useEffect, useState } from "react";
import { Student } from "@/types/student";

// Form data type used in local component state
type FormData = {
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  course: string;
};

// Props for the StudentForm component
type StudentFormProps = {
  editingStudent: Student | null;
  onAddStudent: (student: Omit<Student, "_id">) => Promise<void>;
  onUpdateStudent: (id: string, student: Omit<Student, "_id">) => Promise<void>;
  onCancelEdit: () => void;
};

// Empty form state used for reset
const emptyForm: FormData = {
  firstName: "",
  lastName: "",
  age: "",
  email: "",
  course: "",
};

export default function StudentForm({
  editingStudent,
  onAddStudent,
  onUpdateStudent,
  onCancelEdit,
}: StudentFormProps) {
  // Local state for form inputs
  const [formData, setFormData] = useState<FormData>(emptyForm);

  // Local state for submit button loading
  const [submitting, setSubmitting] = useState(false);

  // Fill the form when editing a student, otherwise reset it
  useEffect(() => {
    if (editingStudent) {
      setFormData({
        firstName: editingStudent.firstName,
        lastName: editingStudent.lastName,
        age: String(editingStudent.age),
        email: editingStudent.email,
        course: editingStudent.course,
      });
    } else {
      setFormData(emptyForm);
    }
  }, [editingStudent]);

  // Handle form input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Handle form submit for both create and update
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    // Prepare the payload sent to the API
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      age: Number(formData.age),
      email: formData.email,
      course: formData.course,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // If editingStudent exists, update the current student
      if (editingStudent) {
        // Guard against missing _id
        if (!editingStudent._id) return;

        await onUpdateStudent(editingStudent._id, payload);
      } else {
        // Otherwise create a new student
        await onAddStudent(payload);
      }

      // Reset the form after successful submit
      setFormData(emptyForm);
    } catch (error) {
      console.error("Form submit error:", error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">
          Student Form
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          {editingStudent ? "Edit Student" : "Add New Student"}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Fill in the student information and save it to the system.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="firstName"
          placeholder="First name"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-500"
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last name"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-500"
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-500"
        />

        <input
          type="text"
          name="course"
          placeholder="Course"
          value={formData.course}
          onChange={handleChange}
          required
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-500"
        />

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Saving..."
              : editingStudent
              ? "Update Student"
              : "Add Student"}
          </button>

          {editingStudent && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}