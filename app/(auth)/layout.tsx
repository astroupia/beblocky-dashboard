import { ClerkProvider } from "@clerk/nextjs";
import BrandDesign from "../../components/layout/BrandDesign";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body>
          <div className="flex min-h-screen">
            <div className="flex-grow">{children}</div>
          </div>
        </body>
      </ClerkProvider>
    </html>
  );
}
