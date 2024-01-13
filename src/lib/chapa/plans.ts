import { Role } from "@/types";

export const getPlans = (role: Role): Plan[] => {
  role = role.toLowerCase() as Role;
  const priceMultiplier = role === "Parent" || role === "Student" ? 1 : 10;
  const studentCountMultiplier =
    role === "Parent" || role === "Student" ? 1 : 10;
  return [
    {
      name: "Free",
      price: {
        monthly: 0,
        yearly: 0,
      },
      quota: {
        studentCount: 1,
      },
      description: "You can try it for free and upgrade later.",
    },
    {
      name: "Standard",
      price: {
        monthly: 1000 * priceMultiplier,
        yearly: 10000 * priceMultiplier,
      },
      quota: {
        studentCount: 3 * studentCountMultiplier,
      },
      description: "Unlocks access to some of our best courses.",
    },
    {
      name: "Gold",
      price: {
        monthly: 2500 * priceMultiplier,
        yearly: 25000 * priceMultiplier,
      },
      quota: {
        studentCount: 5 * studentCountMultiplier,
      },
      description: "Provides access to premium courses.",
    },
    {
      name: "Premium",
      price: {
        monthly: 5000 * priceMultiplier,
        yearly: 50000 * priceMultiplier,
      },
      quota: {
        studentCount: 10 * studentCountMultiplier,
      },
      description: "For the best learning experience.",
    },
  ];
};

export type Plan = {
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  quota: {
    studentCount: number;
  };
  description: string;
};

/// [*]10 25 50 for schools
/// [*] Student Progress,
/// [*] List plan benefits, school and parents plan should be separated,
/// [*] ide rounded boxes,
/// [*] course card fix ui
/// [*] Student sign up with class code
/// [ ] Existing Student Add Username
/// [ ] Default type of course app
/// [ ] Do something with free plan