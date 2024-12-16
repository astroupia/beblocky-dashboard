export type CreateCourseParam = {
  _id: string;
  courseTitle: string;
  courseDescription: string;
  courseLanguage: string;
  slides: Array<string> | null;
  lessons: Array<string> | null;
  subType: "F" | "G" | "P" | "S";
  status: "Active" | "Draft";
};

export type UpdateCourseParam = {
  courseTitle: string;
  courseDescription: string;
  courseLanguage: string;
  subType: "F" | "G" | "P" | "S";
  status: "Active" | "Draft";
};
