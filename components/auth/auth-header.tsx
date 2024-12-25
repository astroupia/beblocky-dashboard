import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Rocket } from "lucide-react";
import Image from "next/image";
import Logo from "@/public/assets/images/logo.png";

interface AuthHeaderProps {
  mode: "signin" | "signup";
}

export function AuthHeader({ mode }: AuthHeaderProps) {
  return (
    <header className="w-full border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="p-2 bg-primary rounded-md">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <Link href="/">
            <Image src={Logo} alt="Beblocky logo" height={100} width={150} />
          </Link>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href={mode === "signin" ? "/sign-up" : "/sign-in"}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </Link>
          <ThemeToggle
            theme={""}
            toggleTheme={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        </div>
      </div>
    </header>
  );
}
