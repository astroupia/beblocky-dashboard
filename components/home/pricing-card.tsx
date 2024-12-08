interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export function PricingCard({
  title,
  price,
  description,
  features,
  isPopular,
}: PricingCardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-6 ${
        isPopular ? "ring-2 ring-primary" : ""
      }`}
    >
      {isPopular && (
        <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold text-primary bg-primary/10 mb-4">
          Most Popular
        </span>
      )}
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-4xl font-bold mt-2 mb-4">{price}</p>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-600">
            <svg
              className="h-5 w-5 text-primary mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <button
        className={`w-full py-2 px-4 rounded-md font-medium ${
          isPopular
            ? "bg-primary text-white hover:bg-primary/90"
            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
        }`}
      >
        Get Started
      </button>
    </div>
  );
}
