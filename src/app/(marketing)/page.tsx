import { getAuth, signOut } from "firebase/auth";
import { Button } from '@/components/ui/button';
import app from "@/lib/firebase/firebase-client";
import Link from "next/link";

const auth = getAuth(app)

export default function Home() {
  return (
    <div>
      <Link href="/sign-in">
        <Button>
          Sign In
        </Button>
      </Link>
    </div>
  )
}