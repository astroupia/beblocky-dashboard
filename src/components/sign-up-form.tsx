"use client";
import {
  ExternalLink,
  School,
  School2,
  User,
  User2,
  Users,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Icons } from "./icons";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-auth";
import { sendVerificationEmail } from "@/actions/auth";
import { toast } from "./ui/use-toast";

export const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      toast({
        title: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Send verification email
      const result = await sendVerificationEmail(email);
      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Verification email sent!",
        description: "Please check your email to verify your account",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <div className="space-y-4">
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue placeholder="Choose your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="parent">
                <div className=" flex items-center gap-2">
                  <Users size={18} />
                  Parent
                </div>
              </SelectItem>
              <SelectItem value="school">
                <div className=" flex items-center gap-2">
                  <School2 size={18} />
                  School
                </div>
              </SelectItem>
              <SelectItem value="student">
                <div className=" flex items-center gap-2">
                  <User size={18} />
                  Student
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          placeholder="Email"
          type="email"
          className="h-10"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          placeholder="Password"
          type="password"
          className="h-10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          placeholder="Repeat Password"
          type="password"
          className="h-10"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          required
        />
      </div>
      <Button className="w-full text-lg mt-4" size="lg" disabled={loading}>
        {loading ? <Icons.Progress className="animate-spin" /> : "Sign Up"}
      </Button>
    </form>
  );
};
