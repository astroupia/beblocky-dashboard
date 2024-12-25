import Image from "next/image";
interface AuthTestimonialProps {
  content: string;
  author: string;
  role: string;
  image: string;
}

export function AuthTestimonial({
  content,
  author,
  role,
  image,
}: AuthTestimonialProps) {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-primary/10">
      <p className="text-muted-foreground mb-4">&quot;{content}&quot;</p>
      <div className="flex items-center space-x-3">
        <Image
          src={image}
          alt={author}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
}
