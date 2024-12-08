interface TestimonialCardProps {
  content: string;
  author: string;
  role: string;
  company: string;
}

export function TestimonialCard({
  content,
  author,
  role,
  company,
}: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <p className="text-gray-600 mb-4">&quot;{content}&quot;</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-gray-500">
          {role} at {company}
        </p>
      </div>
    </div>
  );
}
