export default async function VidhanSabhaPage() {
  const stats = {
    avgSeats: 90, // varies by state
    termYears: 5,
    scope: "State-level governance",
  };

  return (
    <div className="p-6 space-y-6 h-svh">
      <h1 className="text-4xl font-bold">🏢 Vidhan Sabha</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl">
          <p>Average Seats: {stats.avgSeats}</p>
          <p>Term: {stats.termYears} years</p>
          <p>Scope: {stats.scope}</p>
        </div>

        <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl">
          <p>Handles state laws and policies.</p>
          <p>Controls state government.</p>
        </div>
      </div>
    </div>
  );
}
