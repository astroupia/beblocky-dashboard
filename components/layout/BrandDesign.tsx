import React from "react";
import Link from "next/link";

const BrandDesign: React.FC = () => {
  return (
    <div className="flex items-center space-x-4">
      <Link href="/">
        <div className="flex items-center space-x-2 text-primary hover:text-primary/90">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold">B</span>
          </div>
          <span className="font-bold text-2xl text-primary">Beblocky</span>
        </div>
      </Link>
    </div>
  );
};

export default BrandDesign;
