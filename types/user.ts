export type CreateUserParams = {
  clerkId: string;
  email: string;
  role?: string;
  firstName: string;
  lastName: string;
  createdAt: number;
};

export type UpdateUserParams = {
  firstName: string;
  lastName: string;
};
