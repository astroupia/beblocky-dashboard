import {
  getAllCourse,
  getAllActiveCourse,
  createCourse,
  editCourse,
  deleteCourse,
} from "@/lib/actions/course.actions";
import { connectToDatabase } from "@/lib/database";
import Course from "@/lib/models/course.model";
import { CreateCourseParam } from "@/types/course";

jest.mock("@/lib/database");
jest.mock("@/lib/models/course.model");

describe("Course Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all courses", async () => {
    const courses = [{ courseId: "1", name: "Course 1" }];
    (Course.find as jest.Mock).mockResolvedValue(courses);
    await expect(getAllCourse()).resolves.toEqual(courses);
  });

  it("should retrieve all active courses", async () => {
    const activeCourses = [{ courseId: "1", name: "Active Course" }];
    (Course.find as jest.Mock).mockResolvedValue(activeCourses);
    await expect(getAllActiveCourse()).resolves.toEqual(activeCourses);
  });

  it("should create a course", async () => {
    const createCourseParam = {
      courseTitle: "New Course",
      courseDescription: "Description of the new course",
      courseLanguage: "English",
      subType: "Online",
      status: "Active",
    };
    const newCourse = new Course(createCourseParam);
    (newCourse.save as jest.Mock).mockResolvedValue(newCourse);
    await expect(createCourse(createCourseParam)).resolves.toEqual(newCourse);
  });

  it("should edit a course", async () => {
    const courseId = "1";
    const editCourseParam = {
      courseTitle: "Updated Course",
      courseDescription: "Updated description",
      courseLanguage: "English",
      subType: "Online",
      status: "Active",
    };
    const editedCourse = { courseId, ...editCourseParam };
    (Course.findOneAndUpdate as jest.Mock).mockResolvedValue(editedCourse);
    await expect(editCourse(courseId, editCourseParam)).resolves.toEqual(
      editedCourse
    );
  });

  it("should delete a course", async () => {
    const courseId = "1";
    const deletedCourse = { courseId };
    (Course.findOneAndDelete as jest.Mock).mockResolvedValue(deletedCourse);
    await expect(deleteCourse(courseId)).resolves.toEqual(deletedCourse);
  });
});
