export default function Success() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-green-50 p-8">
      <h1 className="text-4xl font-bold text-green-700 mb-4">Dziękujemy za zakup!</h1>
      <p className="text-lg text-green-800 mb-6">
        Twoja płatność została zakończona pomyślnie. Możesz teraz zadawać więcej pytań.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Wróć do serwisu
      </a>
    </main>
  );
}
