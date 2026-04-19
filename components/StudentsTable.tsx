"use client";

import { Student } from "@/types/student";

// Props for the StudentsTable component
type StudentsTableProps = {
  students: Student[];
  loading: boolean;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => Promise<void>;
};

export default function StudentsTable({
  students,
  loading,
  onEdit,
  onDelete,
}: StudentsTableProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-600">
            Students List
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Manage Records
          </h2>
        </div>

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
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr
                key={student._id ?? `${student.email}-${student.firstName}`}
                className="rounded-2xl bg-slate-50 text-slate-700 shadow-sm"
              >
                <td className="rounded-l-2xl px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-sky-500 font-bold text-white">
                      {student.firstName.charAt(0)}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-slate-500">Student record</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">{student.age}</td>
                <td className="px-4 py-4">{student.email}</td>
                <td className="px-4 py-4">{student.course}</td>

                <td className="rounded-r-2xl px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    {/* Edit button sends the full student object */}
                    <button
                      onClick={() => onEdit(student)}
                      className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                    >
                      Edit
                    </button>

                    {/* Delete button only works if _id exists */}
                    <button
                      onClick={() => {
                        if (!student._id) return;
                        onDelete(student._id);
                      }}
                      className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && students.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                  No students found. Add your first student to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}