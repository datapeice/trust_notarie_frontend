export default function AnimatedBackground() {
  return (
    <>
      {/* Left Blob - Moves towards center */}
      <div className="fixed top-1/4 left-0 lg:left-10 w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-gradient-to-r from-[#38ef7d]/40 to-green-600/40 rounded-full blur-[80px] lg:blur-[100px] animate-blob-left mix-blend-screen pointer-events-none"></div>
      
      {/* Right Blob - Moves towards center */}
      <div className="fixed bottom-1/4 right-0 lg:right-10 w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-gradient-to-r from-blue-600/40 to-sky-500/40 rounded-full blur-[80px] lg:blur-[100px] animate-blob-right mix-blend-screen pointer-events-none"></div>
    </>
  );
}
