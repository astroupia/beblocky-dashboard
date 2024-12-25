import {
  createUser,
  getUserById,
  updateUser,
  getUserRole,
  deleteUser,
  getUserByEmail,
} from "@/lib/actions/user.actions";
// import { connectToDatabase } from "@/lib/database";
import User from "@/lib/models/user.model";

jest.mock("@/lib/database", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("@/lib/models/user.model");

describe("User Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user", async () => {
    const userData = {
      clerkId: "123",
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
    };
    (User.create as jest.Mock).mockResolvedValue(userData);
    await expect(createUser(userData)).resolves.toEqual(userData);
  });

  it("should retrieve a user by ID", async () => {
    const userId = "123";
    const user = { clerkId: userId, name: "John Doe" };
    (User.findOne as jest.Mock).mockResolvedValue(user);
    await expect(getUserById(userId)).resolves.toEqual(user);
  });

  it("should update a user", async () => {
    const clerkId = "123";
    const userUpdate = {
      firstName: "Jane",
      lastName: "Doe",
    };
    const updatedUser = { clerkId, ...userUpdate };
    (User.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedUser);
    await expect(updateUser(clerkId, userUpdate)).resolves.toEqual(updatedUser);
  });

  it("should retrieve a user's role", async () => {
    const userId = "123";
    const user = { clerkId: userId, role: "admin" };
    (User.findOne as jest.Mock).mockResolvedValue(user);
    await expect(getUserRole(userId)).resolves.toEqual("admin");
  });

  it("should delete a user", async () => {
    const clerkId = "123";
    const user = { _id: "abc", clerkId };
    (User.findOne as jest.Mock).mockResolvedValue(user);
    (User.findByIdAndDelete as jest.Mock).mockResolvedValue(user);
    await expect(deleteUser(clerkId)).resolves.toEqual(user);
  });

  it("should retrieve a user by email", async () => {
    const email = "test@example.com";
    const user = { email: email.toLowerCase() };
    (User.findOne as jest.Mock).mockResolvedValue(user);
    await expect(getUserByEmail(email)).resolves.toEqual(user);
  });
});
