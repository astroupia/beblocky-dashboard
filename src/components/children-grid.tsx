import { ChevronRight, Clock, PlusIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import type { Student } from "@/lib/shape";
import { Button } from "@/components/ui/button";
import ChildCard from "./child-card";

interface Props {
  students: Student[];
  children?: React.ReactNode; // Make children optional
}

export default function ChildrenGrid({ students, children }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {students &&
        students.map((student, index) => (
          <ChildCard
            student={student}
            key={index}
            addCourseRoute={"/courses"}
          />
        ))}
      {children} {/* Render children if provided */}
    </div>
  );
}
