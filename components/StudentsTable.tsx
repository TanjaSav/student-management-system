"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useStudents } from "@/context/StudentsContext";
import { Student, StudentsTableProps, StudentStatus } from "@/types/types";

// Return Tailwind classes for each student status
function getStatusClasses(status: StudentStatus) {
  switch (status) {
    case "active":
      return "text-emerald-600";
    case "paused":
      return "text-amber-600";
    case "completed":
      return "text-sky-600";
    case "dropped":
      return "text-rose-600";
    default:
      return "text-slate-700";
  }
}

// Format registration date for display
function formatRegistrationDate(date: string) {
  return date
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
    : "-";
}

// Mobile card layout
function StudentCard({
  student,
  onEdit,
  onDelete,
}: {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => Promise<void>;
}) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-[#f8f8f8] p-5 shadow-[0_4px_18px_rgba(15,23,42,0.06)]">
      {/* Top info grid */}
      <div className="grid grid-cols-3 gap-x-4 gap-y-8">
        <div>
          <p className="text-sm text-slate-500">Student</p>
          <p className="mt-2 wrap-break-word text-sm font-semibold leading-snug text-slate-900">
            {student.firstName} {student.lastName}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Age</p>
          <p className="mt-2 text-sm text-slate-900">{student.age}</p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Email</p>
          <p className="mt-2 break-all text-sm text-slate-900">
            {student.email}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Course</p>
          <p className="mt-2 wrap-break-word text-sm leading-snug text-slate-900">
            {student.course}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Registration Date</p>
          <p className="mt-2 text-sm text-slate-900">
            {formatRegistrationDate(student.dateOfRegistration)}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Status</p>
          <p
            className={`mt-2 font-medium text-sm capitalize ${getStatusClasses(
              student.status
            )}`}
          >
            {student.status}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 h-px bg-slate-200" />

      {/* Mobile icon actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => onEdit(student)}
          title="Edit"
          className="cursor-pointer rounded-xl border border-slate-300 bg-white p-3 text-emerald-700 transition hover:bg-slate-50"
        >
          <Pencil className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            if (!student._id) return;
            onDelete(student._id);
          }}
          title="Delete"
          className="cursor-pointer rounded-xl border border-slate-300 bg-white p-3 text-slate-900 transition hover:bg-slate-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

export default function StudentsTable({ onAdd }: StudentsTableProps) {
  // Get student data and actions from context
  const { students, loading, deleteStudent, setEditingStudent } = useStudents();

  // Open edit modal with selected student data
  function handleEdit(student: Student) {
    setEditingStudent({
      ...student,
      _id: student._id ? String(student._id) : undefined,
    });
    onAdd();
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4f6f95] sm:text-[15px]">
            Students List
          </p>

          {loading && (
            <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500">
              Loading...
            </span>
          )}
        </div>

        {/* Button style */}
        <button
          type="button"
          onClick={() => {
            setEditingStudent(null);
            onAdd();
          }}
          className="shrink-0 cursor-pointer text-base font-semibold text-slate-900 transition hover:text-slate-600"
        >
          + Add Student
        </button>
      </div>

      {/* Empty state */}
      {!loading && students.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-12 text-center text-slate-500">
          No students found. Add your first student to get started
        </div>
      )}

      {!!students.length && (
        <>
          {/* Mobile layout */}
          <div className="space-y-5 md:hidden">
            {students.map((student) => (
              <StudentCard
                key={student._id ?? `${student.email}-${student.firstName}`}
                student={student}
                onEdit={handleEdit}
                onDelete={deleteStudent}
              />
            ))}
          </div>

          {/* Desktop layout */}
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm font-semibold text-slate-500">
                  <th className="px-4 py-2">Student</th>
                  <th className="px-4 py-2">Age</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Course</th>
                  <th className="px-4 py-2">Date of Registration</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr
                    key={student._id ?? `${student.email}-${student.firstName}`}
                    className="rounded-2xl bg-slate-50 text-slate-700 shadow-sm"
                  >
                    <td className="rounded-l-2xl px-4 py-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {student.firstName} {student.lastName}
                      </p>
                    </td>
                    <td className="px-4 py-2 text-sm">{student.age}</td>
                    <td className="px-4 py-2 text-sm">{student.email}</td>
                    <td className="px-4 py-2 text-sm">{student.course}</td>
                    <td className="px-4 py-2 text-sm">
                      {formatRegistrationDate(student.dateOfRegistration)}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`text-sm font-medium capitalize ${getStatusClasses(
                          student.status
                        )}`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="rounded-r-2xl px-4 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="cursor-pointer p-2 text-emerald-600 transition hover:scale-105 hover:opacity-90"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (!student._id) return;
                            deleteStudent(student._id);
                          }}
                          className="cursor-pointer p-2 text-slate-700 transition hover:scale-105 hover:opacity-90"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}