export default function Cancel() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-red-50 p-8">
      <h1 className="text-4xl font-bold text-red-700 mb-4">Płatność anulowana</h1>
      <p className="text-lg text-red-800 mb-6">
        Płatność nie została zrealizowana. Możesz spróbować ponownie lub wrócić do serwisu.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Wróć do serwisu
      </a>
    </main>
  );
}
