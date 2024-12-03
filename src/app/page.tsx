"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [cookieData, setCookieData] = useState<string | null>(null);

  useEffect(() => {
    // Handle cookies using client-side logic, e.g., using document.cookie
    const cookies = document.cookie;
    setCookieData(cookies);
  }, []);

  return (
    <div>
      {/* Your component JSX here */}
      <p>Cookie Data: {cookieData}</p>
    </div>
  );
};

export default Page;
