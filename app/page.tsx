"use client";

import { useState } from "react";
import Image from "next/image";
import StudentForm from "@/components/StudentForm";
import StudentsTable from "@/components/StudentsTable";
import { StudentsProvider } from "@/context/StudentsContext";

function StudentsPageContent() {
  // Controls modal visibility for add/edit form
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-100 via-white to-sky-100 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header section */}
        <section className="mb-6 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur sm:mb-8 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/student-management-illustration.svg"
                alt="Illustration of student management"
                width={50}
                height={50}
                className="h-12 w-12 shrink-0 object-cover"
              />
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
                  Student Management System
                </h1>
              </div>
            </div>
          </div>
        </section>

        {/* Main students list */}
        <StudentsTable onAdd={() => setIsModalOpen(true)} />

        {/* Add/Edit student modal */}
        <StudentForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </main>
  );
}

export default function HomePage() {
  // Wrap the page with StudentsProvider, so all nested components can access shared student state
  return (
    <StudentsProvider>
      <StudentsPageContent />
    </StudentsProvider>
  );
}