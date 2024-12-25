export type CreateUserParams = {
  clerkId: string;
  email: string;
  role?: string;
  firstName: string;
  lastName: string;
  createdAt: string;
};

export type UpdateUserParams = {
  firstName: string;
  lastName: string;
};
