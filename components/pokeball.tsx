export function Pokeball({
  className = "",
  spin = false,
}: {
  className?: string;
  spin?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={`pokeball inline-block ${spin ? "pokeball-spin" : ""} ${className}`}
    />
  );
}
