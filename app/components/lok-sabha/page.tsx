export default async function LokSabhaPage() {
  const stats = {
    seats: 543,
    termYears: 5,
    nextElection: "2029",
  };

  return (
    <div className="p-6 space-y-6 h-svh">
      <h1 className="text-4xl font-bold">🏛️ Lok Sabha</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl">
          <p>Total Seats: {stats.seats}</p>
          <p>Term: {stats.termYears} years</p>
          <p>Next Election: {stats.nextElection}</p>
        </div>

        <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl">
          <p>Represents the people of India directly.</p>
          <p>Major legislative authority.</p>
        </div>
      </div>
    </div>
  );
}
