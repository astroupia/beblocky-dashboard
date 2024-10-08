interface Props {
  name: string;
}
export default function TopBar({ name }: Props) {
  return (
    <>
      <h1 className="text-3xl font-bold leading-tight tracking-tighter text-ecstasy">
        Welcome, {name ? name.charAt(0).toUpperCase() + name.slice(1) : "Guest"}
        .
      </h1>
      <p className="-mt-3 mb-2 text-lg font-semibold text-dark-ebony">
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <hr className="w-full border-apple" />
    </>
  );
}
