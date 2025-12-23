const AuthTheme = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f14] relative overflow-hidden">

      {/* background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)] opacity-30" />

      {/* glass card */}
      <div className="relative w-full max-w-md bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        {children}
      </div>
    </div>
  );
};

export default AuthTheme;
