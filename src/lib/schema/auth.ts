import { z } from "zod";

export const signInSchema = z.object({
  email: z.string({ required_error: "Please provide valid email address!" }),
  password: z
    .string({ required_error: "Please provide password!" })
    .refine((pass) => pass.length >= 8, "Password is less than 8 characters"),
});

export const signUpSchema = z
  .object({
    role: z.string({ required_error: "Please select one of the roles!" }),
    name: z
      .string({ required_error: "Please provide valid name!" })
      .refine((name) => name.includes(" "), "Please provide full name."),
    email: z
      .string(),
    password: z
      .string({ required_error: "Please provide password!" })
      .refine((pass) => pass.length >= 8, "Password is less than 8 characters"),
    repeatPassword: z.string({
      required_error: "Please provide repeated password!",
    }),
    schoolName: z.string().optional(),
    classCode: z.string().optional(),
    terms: z
      .boolean({
        required_error: "Please accept terms and conditions before signing up.",
      })
      .refine(
        (accept) => accept,
        "Please accept terms and conditions before signing up."
      ),
  }).refine(args=> args.role !== "student" ? z.string().email().safeParse(args.email).success : true, "Please Provide valid email address") 
  .refine(
    (args) => args.password === args.repeatPassword,
    "Password doesn't match!"
  ).transform(args=> {
   if( args.role === "student"){
    return {
      ...args,
      email: `${args.email}@beblocky.com`
    }
   }
   return args
  }); 

export const addChildSchema = z
  .object({
    name: z
      .string({ required_error: "Please provide valid name!" })
      .refine((name) => name.includes(" "), "Please provide full name."),
    classroom: z.string().optional(),
    username: z.string(),
    password: z
      .string({ required_error: "Please provide password!" })
      .refine((pass) => pass.length >= 8, "Password is less than 8 characters"),
    repeatPassword: z.string({
      required_error: "Please provide repeated password!",
    }),
  })
  .refine(
    (args) => args.password === args.repeatPassword,
    "Password doesn't match!"
  );

export const editChildSchema = z.object({
  name: z.string({ required_error: "Please provide valid name" }),
  username: z.string(),
  classroom: z.string(),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
export type AddChildSchema = z.infer<typeof addChildSchema>;
export type EditChildSchema = z.infer<typeof editChildSchema>;
