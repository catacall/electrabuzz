export default async function PanchayatPage() {
  const stats = {
    levels: 3,
    focus: "Rural development",
    system: "Decentralized governance",
  };

  return (
    <div className="p-6 space-y-6 h-svh">
      <h1 className="text-4xl font-bold">🌾 Panchayat</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl">
          <p>Levels: {stats.levels} tier system</p>
          <p>Focus: {stats.focus}</p>
          <p>Type: {stats.system}</p>
        </div>

        <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl">
          <p>Works at village level.</p>
          <p>Direct local governance.</p>
        </div>
      </div>
    </div>
  );
}
