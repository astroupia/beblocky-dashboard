"use client";
import { getDateString } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "./context/auth-context";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

interface Props {
  title?: string;
  description?: string;
  showBackBtn?: boolean;
  showAddClassCodeBtn?: boolean;
  onAddClassCodeClick?: () => void;
}

export function PageHeader({
  title,
  description,
  showBackBtn,
  showAddClassCodeBtn,
  onAddClassCodeClick,
}: Props) {
  const { user } = useAuthContext();
  const router = useRouter();
  return (
    <div className="flex justify-between items-center border-b pb-6 border-ecstasy-300 sticky top-0 z-30 bg-white">
      <div>
        <h2 className="text-ecstasy text-xl lg:text-4xl font-bold">
          {title ?? `Welcome Back, ${user?.displayName}`}
        </h2>
        <Label>{description ?? getDateString()}</Label>
      </div>
      {/* Conditionally render the Add Class Code button */}
      {showAddClassCodeBtn && (
        <Button
          onClick={onAddClassCodeClick}
          variant="outline"
          className="ml-4"
        >
          Add Class Code
        </Button>
      )}
      {showBackBtn && (
        <nav
          onClick={() => router.back()}
          className=" flex items-center gap-2 mt-2 cursor-pointer w-min"
        >
          <ChevronLeft />
          <span className="font-medium">Back</span>
        </nav>
      )}
    </div>
  );
}
