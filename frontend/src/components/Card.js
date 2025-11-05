export default function Card({ children, className }) {
  return (
    <div
      className={`backdrop-blur-md bg-white/10 rounded-2xl shadow-lg p-5 border border-white/20 transition hover:bg-white/20 hover:scale-[1.02] ${className}`}
    >
      {children}
    </div>
  );
}
