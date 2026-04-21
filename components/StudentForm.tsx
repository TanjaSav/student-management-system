"use client";

import { useEffect, useState } from "react";
import DropdownMenu from "@/components/DropdownMenu";
import { Student, StudentStatus } from "@/types/student";

type FormData = {
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  course: string;
  status: StudentStatus;
  dateOfRegistration: string;
};

type StudentFormProps = {
  editingStudent: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: Omit<Student, "_id">) => Promise<void>;
  onUpdateStudent: (id: string, student: Omit<Student, "_id">) => Promise<void>;
  onCancelEdit: () => void;
};

// Predefined course options
const courses = [
  "Frontend Development",
  "Backend Development",
  "Mobile Development",
  "UI/UX Design",
  "Data Science",
];

// Available student statuses
const statuses: StudentStatus[] = ["active", "paused", "completed", "dropped"];

// Convert courses into dropdown options
const courseOptions = courses.map((course) => ({
  label: course,
  value: course,
}));

// Convert statuses into dropdown options
const statusOptions = statuses.map((status) => ({
  label: status.charAt(0).toUpperCase() + status.slice(1),
  value: status,
}));

// Initial empty form state
const emptyForm: FormData = {
  firstName: "",
  lastName: "",
  age: "16",
  email: "",
  course: courses[0],
  status: "active",
  dateOfRegistration: "",
};

export default function StudentForm({
  editingStudent,
  isOpen,
  onClose,
  onAddStudent,
  onUpdateStudent,
  onCancelEdit,
}: StudentFormProps) {
  // Local form state
  const [formData, setFormData] = useState<FormData>(emptyForm);

  // Loading state for submit button
  const [submitting, setSubmitting] = useState(false);

  // Error message shown under the form
  const [errorMessage, setErrorMessage] = useState("");

  // Fixed date range: from 01 Jan 2015 until today
  const minDate = "2015-01-01";
  const maxDate = new Date().toISOString().split("T")[0];

  // Fill form when editing a student, or reset form when adding a new one
  useEffect(() => {
    if (editingStudent) {
      setFormData({
        firstName: editingStudent.firstName,
        lastName: editingStudent.lastName,
        age: String(editingStudent.age),
        email: editingStudent.email,
        course: editingStudent.course,
        status: editingStudent.status,
        dateOfRegistration: editingStudent.dateOfRegistration,
      });
    } else {
      setFormData(emptyForm);
    }
  }, [editingStudent, isOpen]);

  // Handle text, number, email, and date input changes
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // Close modal and reset form state
  function handleClose() {
    setFormData(emptyForm);
    setErrorMessage("");
    onCancelEdit();
    onClose();
  }

  // Close modal when user clicks on backdrop
  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }

  // Validate first and last name
  function isValidName(value: string) {
    return /^[A-Za-zÁáÐðÉéÍíÓóÚúÝýÞþÆæÖö\s-]+$/.test(value);
  }

  // Submit form data for creating or updating a student
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const ageNumber = Number(formData.age);

    // Validate first name
    if (!isValidName(firstName)) {
      setErrorMessage(
        "First name must contain only English or Icelandic letters."
      );
      setSubmitting(false);
      return;
    }

    // Validate last name
    if (!isValidName(lastName)) {
      setErrorMessage(
        "Last name must contain only English or Icelandic letters."
      );
      setSubmitting(false);
      return;
    }

    // Validate minimum age
    if (ageNumber < 16) {
      setErrorMessage("Student age must be 16 or older.");
      setSubmitting(false);
      return;
    }

    // Validate date range
    if (
      formData.dateOfRegistration < minDate ||
      formData.dateOfRegistration > maxDate
    ) {
      setErrorMessage("Date must be between 01 Jan 2015 and today.");
      setSubmitting(false);
      return;
    }

    // Build payload for API request
    const payload = {
      firstName,
      lastName,
      age: ageNumber,
      email: formData.email.trim(),
      course: formData.course,
      status: formData.status,
      dateOfRegistration: formData.dateOfRegistration,
      createdAt: editingStudent?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // Update existing student
      if (editingStudent?._id) {
        await onUpdateStudent(editingStudent._id, payload);
      } else {
        // Add new student
        await onAddStudent(payload);
      }

      // Reset form after successful submit
      setFormData(emptyForm);
      onClose();
      onCancelEdit();
    } catch (error) {
      console.error("Form submit error:", error);
      setErrorMessage("Failed to save student.");
    } finally {
      setSubmitting(false);
    }
  }

  // Do not render modal if it is closed
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {editingStudent ? "Edit Student" : "Add New Student"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Fill in the student information and save it
            </p>
          </div>

          {/* Close modal button */}
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border cursor-pointer border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* First name input */}
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            pattern="[A-Za-zÁáÐðÉéÍíÓóÚúÝýÞþÆæÖö\s-]+"
            title="Use only English or Icelandic letters"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-500"
          />

          {/* Last name input */}
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            pattern="[A-Za-zÁáÐðÉéÍíÓóÚúÝýÞþÆæÖö\s-]+"
            title="Use only English or Icelandic letters"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-500"
          />

          {/* Age input with minimum value 16 */}
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            min={16}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-500"
          />

          {/* Email input with English-only email pattern */}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
            title="Use only English letters. Example: name@email.com"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-500"
          />

          {/* Custom dropdown for course selection */}
          <DropdownMenu
            value={formData.course}
            options={courseOptions}
            onChange={(course) =>
              setFormData((prev) => ({ ...prev, course }))
            }
          />

          {/* Custom dropdown for status selection */}
          <DropdownMenu
            value={formData.status}
            options={statusOptions}
            onChange={(status) =>
              setFormData((prev) => ({
                ...prev,
                status: status as StudentStatus,
              }))
            }
          />

          {/* Date input with fixed allowed range */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Registration Date
            </label>

            <input
              type="date"
              name="dateOfRegistration"
              value={formData.dateOfRegistration}
              onChange={handleChange}
              min={minDate}
              max={maxDate}
              required
              className="
                w-full rounded-2xl border border-slate-200 bg-slate-50
                px-4 py-2 text-sm text-slate-800 outline-none transition
                focus:border-emerald-500 focus:bg-white
              "
            />
          </div>

          {/* Validation or submit error message */}
          {errorMessage && (
            <p className="text-sm font-medium text-rose-600">{errorMessage}</p>
          )}

          {/* Form action button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-slate-900 cursor-pointer px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : editingStudent
                ? "Update Student"
                : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}