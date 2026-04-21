"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Student, StudentStatus } from "@/types/student";

type StudentsTableProps = {
  students?: Student[];
  loading: boolean;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => Promise<void>;
  onAdd: () => void;
};

// Return color classes based on student status
function getStatusClasses(status: StudentStatus) {
  switch (status) {
    case "active":
      return "text-emerald-700";
    case "paused":
      return "text-amber-700";
    case "completed":
      return "text-sky-700";
    case "dropped":
      return "text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function StudentsTable({
  students = [],
  loading,
  onEdit,
  onDelete,
  onAdd,
}: StudentsTableProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex w-full items-center px-4 justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
            Students List
          </p>
        

          {/* Add student button under the title */}
          <button
            type="button"
            onClick={onAdd}
            className="text-sm font-semibold text-black-300 cursor-pointer transition hover:text-black-500"
          >
            + Add Student
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500">
            Loading...
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
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
                  <div className="flex items-center gap-3">
                   
                    <div>
                      <p className="font-semibold text-sm text-slate-900">
                        {student.firstName} {student.lastName}
                      </p>
                      
                    </div>
                  </div>
                </td>

                <td className="px-4 text-sm py-2">{student.age}</td>
                <td className="px-4 text-sm py-2">{student.email}</td>
                <td className="px-4 text-sm py-2">{student.course}</td>

                <td className="px-4 text-sm py-2">
                  {student.dateOfRegistration
                    ? new Intl.DateTimeFormat("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(student.dateOfRegistration))
                    : "-"}
                </td>

                <td className="px-4 py-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-2 text-sm font-semibold capitalize ${getStatusClasses(
                      student.status
                    )}`}
                  >
                    {student.status}
                  </span>
                </td>

                <td className="rounded-r-2xl px-4 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(student)}
                      className="flex items-center justify-center p-2 text-green-600 cursor-pointer transition hover:scale-105 hover:opacity-90"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (!student._id) return;
                        onDelete(student._id);
                      }}
                      className="flex items-center justify-center  p-2 text-black-200 cursor-pointer transition hover:scale-105 hover:opacity-90"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && students.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                  No students found. Add your first student to get started
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}