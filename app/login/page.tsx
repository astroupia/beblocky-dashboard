"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/clerk-react";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await signIn.create({
        identifier: formData.get("email") as string,
        password: formData.get("password") as string,
      });

      if (response.status === "complete") {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access your account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4"
        >
          {error && (
            <div className="mb-4 p-4 text-sm text-destructive-foreground bg-destructive/10 rounded border border-destructive">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label
              className="block text-foreground text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
              id="email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-foreground text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
            <p className="text-sm text-muted-foreground">
              Demo credentials: admin@example.com / password
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-primary w-full"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
