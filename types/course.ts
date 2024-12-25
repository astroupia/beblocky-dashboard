export type CreateCourseParam = {
  _id?: string;
  courseTitle: string;
  courseDescription: string;
  courseLanguage: string;
  subType: "Free" | "Gold" | "Premium" | "Standard";
  status: "Active" | "Draft";
};

export type UpdateCourseParam = {
  _id?: string;
  courseTitle: string;
  courseDescription: string;
  courseLanguage: string;
  subType: "Free" | "Gold" | "Premium" | "Standard";
  status: "Active" | "Draft";
};
