import MotionLink from "@/app/components/MotionLink";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-[80vh] px-2">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center p-6 sm:p-12 t-card border t-border rounded-2xl sm:rounded-3xl t-shadow transition-colors">
        <h1 className="text-2xl sm:text-5xl font-extrabold t-text mb-6 sm:mb-8 text-center tracking-tight">
          Welcome to <span className="t-accent">Electrabuzz</span>
        </h1>
        <p className="t-text2 text-center mb-8 sm:mb-10 max-w-md text-sm sm:text-base">
          Explore and learn about the Indian election systems interactively.
        </p>
        <nav className="flex flex-col sm:flex-row w-full gap-3 sm:gap-4 justify-center">
          <MotionLink href="/lok-sabha" className="flex-1 text-center t-bg3 hover:t-card t-accent border t-border hover:border-orange-400 py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-medium transition-all t-shadow">
            Lok Sabha
          </MotionLink>
          <MotionLink href="/vidhan-sabha" className="flex-1 text-center t-bg3 hover:t-card t-accent border t-border hover:border-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-medium transition-all t-shadow">
            Vidhan Sabha
          </MotionLink>
          <MotionLink href="/panchayat" className="flex-1 text-center t-bg3 hover:t-card t-accent border t-border hover:border-green-400 py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-medium transition-all t-shadow">
            Panchayat
          </MotionLink>
        </nav>
      </main>
    </div>
  );
}
