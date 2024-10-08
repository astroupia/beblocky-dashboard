import ChildrenGrid from "@/components/children-grid";
import { CreateStudentDialog } from "@/components/create-student-dialog";
import { Student } from "@/lib/shape";
import { User } from "firebase/auth";
import React from "react";

interface Props {
  user: User;
  is_parent: boolean;
  students: Student[];
}

const ParentDashboard = ({ user, is_parent, students }: Props) => {
  return (
    <div className="container flex flex-col gap-4 pb-4">
      <h1 className="text-2xl font-semibold tracking-tight text-dark-ebony">
        Children
      </h1>
      <ChildrenGrid students={students} />
      <CreateStudentDialog id={user.uid} is_parent={is_parent} />
    </div>
  );
};

export default ParentDashboard;
