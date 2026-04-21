"use client";

import { useEffect, useState } from "react";
import DropdownMenu from "@/components/DropdownMenu";
import { useStudents } from "@/context/StudentsContext";
import {
  FormData,
  StudentFormProps,
  StudentPayload,
  StudentStatus,
} from "@/types/types";

// Available course options for the student form
const courses = [
  "Frontend Development",
  "Backend Development",
  "UI/UX Design",
  "Marketing",
  "Business Analytics",
];

// Available student statuses
const statuses: StudentStatus[] = ["active", "paused", "completed", "dropped"];

// Convert course list into dropdown options
const courseOptions = courses.map((course) => ({
  label: course,
  value: course,
}));

// Convert status list into dropdown options
const statusOptions = statuses.map((status) => ({
  label: status.charAt(0).toUpperCase() + status.slice(1),
  value: status,
}));

// Initial empty form state
const emptyForm: FormData = {
  firstName: "",
  lastName: "",
  age: "",
  email: "",
  course: "",
  status: "active",
  dateOfRegistration: "",
};

export default function StudentForm({ isOpen, onClose }: StudentFormProps) {
  // Access shared student state and actions from context
  const { editingStudent, addStudent, updateStudent, setEditingStudent } = useStudents();

  // Local form state
  const [formData, setFormData] = useState<FormData>(emptyForm);

  // Submission loading flag
  const [submitting, setSubmitting] = useState(false);

  // Error message shown under the form
  const [errorMessage, setErrorMessage] = useState("");

  // Allowed date range for registration date
  const minDate = "2015-01-01";
  const maxDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Pre-fill form fields when editing an existing student
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
      return;
    }

    // Reset form when not editing
    setFormData(emptyForm);
  }, [editingStudent, isOpen]);

  // Handle all text/date input changes
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // Reset form state and close modal
  function handleClose() {
    setFormData(emptyForm);
    setErrorMessage("");
    setEditingStudent(null);
    onClose();
  }

  // Close modal only when clicking on the backdrop
  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }

  // Validate first and last names
  function isValidName(value: string) {
    return /^[A-Za-zÁáÐðÉéÍíÓóÚúÝýÞþÆæÖö\s-]+$/.test(value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const ageNumber = Number(formData.age);

    // Validate first name
    if (!isValidName(firstName)) {
      setErrorMessage("First name must contain only English or Icelandic letters.");
      setSubmitting(false);
      return;
    }

    // Validate last name
    if (!isValidName(lastName)) {
      setErrorMessage("Last name must contain only English or Icelandic letters.");
      setSubmitting(false);
      return;
    }

    // Validate age
    if (ageNumber < 16) {
      setErrorMessage("Student age must be 16 or older.");
      setSubmitting(false);
      return;
    }

    // Validate registration date
    if (
      formData.dateOfRegistration < minDate ||
      formData.dateOfRegistration > maxDate
    ) {
      setErrorMessage("Date must be between 01 Jan 2015 and today.");
      setSubmitting(false);
      return;
    }

    // Build payload for create/update request
    const payload: StudentPayload = {
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
      // Update existing student if edit mode is active
      if (editingStudent?._id) {
        await updateStudent(editingStudent._id, payload);
      } else {
        // Otherwise create a new student
        await addStudent(payload);
      }

      // Reset form and close modal after successful submission
      setFormData(emptyForm);
      setEditingStudent(null);
      onClose();
    } catch (error) {
      console.error("Form submit error:", error);
      setErrorMessage("Failed to save student.");
    } finally {
      setSubmitting(false);
    }
  }

  // Do not render modal when it is closed
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Modal header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingStudent ? "Edit Student" : "Add New Student"}
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="text-3xl font-bold cursor-pointer text-gray-500 transition hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Student form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First and last name fields */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block font-light text-xs text-gray-400">
                First name
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full text-xs rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-1 block font-light text-xs text-gray-400">
                Last name
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full text-xs rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-black"
              />
            </div>
          </div>

          
            <div>
              <label className="mb-1 block font-light text-xs text-gray-400">
              Age
              </label>
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                min={16}
                required
                className="w-full text-xs rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-1 block font-light text-xs text-gray-400">
              Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full text-xs rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-black"
              />
            </div>
          

          {/* Course dropdown */}
          <div>
            <label className="mb-1 block font-light text-xs text-gray-400">
              Course
            </label>
            <DropdownMenu
              value={formData.course}
              options={courseOptions}
              onChange={(course) => setFormData((prev) => ({ ...prev, course }))}
            />
          </div>

          {/* Status dropdown */}
          <div>
            <label className="mb-1 block font-light text-xs text-gray-400">
              Status
            </label>
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
          </div>

          {/* Registration date field */}
          <div>
            <label className="mb-1 block font-light text-xs text-gray-400">
              Date of Registration
            </label>
            <input
              type="date"
              name="dateOfRegistration"
              value={formData.dateOfRegistration}
              onChange={handleChange}
              min={minDate}
              max={maxDate}
              required
              className="w-full text-xs rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-black"
            />
          </div>

          {/* Error message */}
          {errorMessage && (
            <p className="text-xs text-red-600">{errorMessage}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Saving..."
              : editingStudent
              ? "Update Student"
              : "Add Student"}
          </button>
        </form>
      </div>
    </div>
  );
}