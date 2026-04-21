// Type definition for one student
export type StudentStatus = "active" | "paused" | "completed" | "dropped";

export type Student = {
  _id?: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  course: string;
  status: StudentStatus;
  dateOfRegistration: string;
  createdAt?: string;
  updatedAt?: string;
};