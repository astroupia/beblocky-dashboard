export enum UserRole {
  TEACHER = 'teacher',
  ADMIN = 'admin',
  STUDENT = 'student',
  PARENT = 'parent',
  ORGANIZATION = 'organization',
}

export interface IUser {
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUserDto {
  email: string;
  name: string;
  role: UserRole;
  image?: string;
}

export interface IUpdateUserDto extends Partial<Omit<ICreateUserDto, 'email'>> {
  emailVerified?: boolean;
}

export interface ILoginDto {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}
