import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { motion } from "framer-motion";
import { Sparkles, HelpCircle, BookOpen } from "lucide-react";
import { Tooltip } from "../components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import Image from 'next/image';
import Header from "../components/Header"; // zaimportuj komponent Header
import { useAnonId } from '../hooks/useAnonId';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';



export default function RodzicChatPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [question, setQuestion] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [context, setContext] = useState("");
  const [answer, setAnswer] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const anonId = useAnonId();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const packages = [
    { id: "mini", name: "Pakiet MINI", questions: 5, price: "3,99 zł", url: "https://buy.stripe.com/5kQ8wOcdidiV0FR1aT0ZW00" },
    { id: "standard", name: "Pakiet MIDI", questions: 15, price: "5,99 zł", url: "https://buy.stripe.com/4gM5kC5OUceR3S38Dl0ZW01" },
    { id: "maxi", name: "Pakiet MAXI", questions: 50, price: "9,99 zł", url: "https://buy.stripe.com/4gM14m3GM1AdewH4n50ZW02" },
  ];
const stripeLinks = [
  { id: "mini", name: "Pakiet MINI", price: "3,99 zł", url: "https://buy.stripe.com/5kQ8wOcdidiV0FR1aT0ZW00" },
  { id: "midi", name: "Pakiet MIDI", price: "5,99 zł", url: "https://buy.stripe.com/4gM5kC5OUceR3S38Dl0ZW01" },
  { id: "maxi", name: "Pakiet MAXI", price: "9,99 zł", url: "https://buy.stripe.com/4gM14m3GM1AdewH4n50ZW02" },
];

  const openPaymentModal = (pkg) => {
    setSelectedPackage(pkg);
    setShowPaymentModal(true);
  };

 // if (!anonId) return <div>Loading session...</div>;

 const handleAsk = async () => {
  if (!question.trim()) return;
  if (questionCount >= 10) {
    setLimitReached(true);
    return;
  }
 //  const askQuestion = httpsCallable(functions, 'askQuestion');
//const result = await askQuestion({ anonId });

  // if (!result.data.allowed) {
  //  setLimitReached(true);
  //  return;     
  // }
  setLoading(true);
  setAnswer("");
  setFollowUp("");
  setFollowUpAnswer("");
  setLimitReached(false);

 try {
  setLoading(true);
  setAnswer("");
  setFollowUp("");
  setFollowUpAnswer("");
  setLimitReached(false);

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, age, gender, context }),
  });

  if (!response.ok) throw new Error("Błąd serwera");

  const data = await response.json();
  setAnswer(data.answer || "Brak odpowiedzi od AI.");
  setQuestionCount((prev) => prev + 1);
} catch (error) {
  setAnswer("Wystąpił błąd podczas generowania odpowiedzi.");
  console.error(error);
} finally {
  setLoading(false);
}
 }
const handleFollowUp = async () => {
  if (!followUp.trim()) return;
 /* if (questionCount >= 10) {
    setLimitReached(true);
    return;
  }
  */
  setLoading(true);
  setFollowUpAnswer("");
 // setLimitReached(false);

  try {
    // Budujesz historię rozmowy
    const messages = [
      {
        role: "system",
        content: "Jesteś pomocnym doradcą dla rodziców.",
      },
      {
        role: "user",
        content: `Dane dziecka:
- Wiek: ${age || "nieznany"}
- Płeć: ${gender || "nieznana"}
- Kontekst: ${context || "brak"}

Pytanie: ${question}`, // oryginalne pytanie
      },
      {
        role: "assistant",
        content: answer, // poprzednia odpowiedź AI
      },
      {
        role: "user",
        content: followUp, // aktualne pytanie kontynuacyjne
      },
    ];

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) throw new Error("Błąd serwera");

    const data = await response.json();
    setFollowUpAnswer(data.answer || "Brak odpowiedzi od AI.");
   // setQuestionCount((prev) => prev + 1);
  } catch (error) {
    setFollowUpAnswer("Wystąpił błąd podczas generowania odpowiedzi.");
    console.error(error);
  } finally {
    setLoading(false);
  }
};
const confirmPurchase = () => {
  if (selectedPackage?.url) {
    window.open(selectedPackage.url, "_blank"); // otwiera w nowej karcie
    // lub jeśli chcesz w tej samej karcie:
    // window.location.href = selectedPackage.url;
  } else {
    alert("Brak linku do płatności.");
  }
  setShowPaymentModal(false);
};


useEffect(() => {
  const timeout = setTimeout(() => {
    const modal = document.getElementById("intro-dialog");
    if (modal) modal.showModal?.();
  }, 500);
  return () => clearTimeout(timeout);
}, []);

return (
  <>
          <Header />

      {/* Modal instrukcji startowej */}
<Dialog id="intro-dialog" open={showIntro} onOpenChange={setShowIntro}>
  <DialogContent className="max-w-lg">
    <DialogHeader className="border-none text-left px-6 py-4">
      <DialogTitle className="text-left">Jak korzystać z serwisu?</DialogTitle>
    </DialogHeader>
    <div className="text-sm text-gray-700 space-y-2 px-6">
      <p>Możesz zadać maksymalnie 10 darmowych pytanń. Po każdej odpowiedzi możesz dopytać raz, by kontynuować wątek.</p>
      <p>Jeśli chcesz kontynuować korzystanie z serwisu – dostępne są pakiety płatne.</p>
    </div>
    <div className="flex justify-end pt-4 px-6">
      <Button onClick={() => setShowIntro(false)} className="bg-amber-500 hover:bg-amber-600 text-white">
        Zamknij
      </Button>
    </div>
  </DialogContent>
</Dialog>


      {/* Modal potwierdzenia płatności */}
<Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
  <DialogContent className="max-w-md">
    <DialogHeader className="border-none text-left px-6 py-4">
      <DialogTitle className="text-left">Potwierdzenie zakupu</DialogTitle>
    </DialogHeader>
    <div className="text-gray-700 text-base mb-6 px-6">
      {selectedPackage ? (
        <>
          <p>
            Czy chcesz przejść do płatności za <strong>{selectedPackage.name}</strong>?
          </p>
          <p className="mt-2 text-sm text-gray-500">Zostaniesz przeniesiony na stronę płatności.</p>
        </>
      ) : null}
    </div>
    <DialogFooter className="flex justify-end gap-3 px-6 py-4">
      <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
        Anuluj
      </Button>
      <Button onClick={confirmPurchase}>Potwierdzam</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-100 to-orange-100 p-4 md:p-8 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4"
        >
          Zapytaj o swoje dziecko
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center text-gray-700 max-w-2xl mb-6 text-lg"
        >
          Masz pytanie o rozwój, zachowanie lub zdrowie swojego dziecka? Zadaj je anonimowo. Nasze AI postara się pomóc na podstawie sprawdzonych źródeł.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mb-10 w-full">
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center">
            <HelpCircle className="w-10 h-10 mb-2 text-yellow-500" />
            <h3 className="font-semibold text-lg mb-1">Zadaj pytanie</h3>
            <p className="text-sm text-gray-600">Bez logowania. Po prostu napisz, co Cię nurtuje jako rodzica.</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center">
            <BookOpen className="w-10 h-10 mb-2 text-amber-600" />
            <h3 className="font-semibold text-lg mb-1">AI oparta na wiedzy</h3>
            <p className="text-sm text-gray-600">Sztuczna inteligencja udziela odpowiedzi bazując na szerokim zakresie dostępnej wiedzy.</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center">
            <Sparkles className="w-10 h-10 mb-2 text-orange-500" />
            <h3 className="font-semibold text-lg mb-1">Szybka odpowiedź</h3>
            <p className="text-sm text-gray-600">Otrzymasz podpowiedź w kilka sekund. Ale pamiętaj – to nie zastępuje specjalisty.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 mb-6 w-full max-w-2xl text-sm text-gray-700 text-center">
          Możesz zadać do <strong>10 darmowych pytań</strong> – każde z możliwością jednego dopytania. Po wykorzystaniu darmowego limitu pojawi się informacja o konieczności wykupienia dostępu.
        </div>

{limitReached && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg relative">
      <button
        onClick={() => setLimitReached(false)}
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        aria-label="Zamknij modal"
      >
        ✕
      </button>
      <h2 className="text-lg font-semibold text-red-600 mb-4 text-center">
        Limit pytań został wyczerpany
      </h2>
      <p className="mb-4 text-gray-700 text-center">
        Aby kontynuować korzystanie z serwisu, wybierz jeden z dostępnych pakietów:
      </p>
      <div className="flex flex-col gap-4">
        <a
          href={stripeLinks.mini}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center border border-gray-300 rounded-lg p-4 text-gray-800 hover:bg-amber-50 transition-colors font-semibold"
        >
          Pakiet MINI: 5 pytań – 3,99 zł
        </a>
        <a
          href={stripeLinks.midi}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center border border-gray-300 rounded-lg p-4 text-gray-800 hover:bg-amber-50 transition-colors font-semibold"
        >
          Pakiet MIDI: 15 pytań – 5,99 zł
        </a>
        <a
          href={stripeLinks.maxi}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center border border-gray-300 rounded-lg p-4 text-gray-800 hover:bg-amber-50 transition-colors font-semibold"
        >
          Pakiet MAXI: 50 pytań – 9,99 zł
        </a>
      </div>
    </div>
  </div>
)}


   <Card className="w-full max-w-2xl shadow-xl rounded-2xl">
  <CardContent className="space-y-4 p-6">
  <div className="w-full max-w-2xl mb-6">
    <div className="flex justify-between mb-1 text-gray-700 font-semibold">
      <span>Darmowe pytania:</span>
      <span>{Math.max(10 - questionCount, 0)} / 10</span>
    </div>
    <div className="w-full bg-gray-300 rounded-full h-3">
      <div
        className={`h-3 rounded-full transition-all duration-500 ${
          questionCount >= 10
            ? "bg-red-600"
            : questionCount >= 7
            ? "bg-yellow-500"
            : "bg-amber-500"
        }`}
        style={{ width: `${(questionCount / 10) * 100}%` }}
      />
    </div>
  </div>
    <Tooltip side="top" delayDuration={300}>
      <Input
        placeholder="Wiek dziecka (np. 4 lata)"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="w-full"
      />
      <span>Podaj wiek dziecka, aby AI mogło lepiej dopasować poradę.</span>
    </Tooltip>

    <Tooltip side="top" delayDuration={300}>
      <Input
        placeholder="Płeć dziecka (np. chłopiec / dziewczynka )"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="w-full"
      />
      <span>Płeć nie jest obowiązkowa, ale może pomóc w dokładniejszej odpowiedzi.</span>
    </Tooltip>

    <Tooltip side="top" delayDuration={300}>
      <Textarea
        placeholder="Dodatkowy kontekst, np. 'Dziecko ma trudności z zasypianiem od tygodnia'. Wpisz jak najwięcej informacji, żeby odpowiedź mogła być lepiej sprecyzowana do Twojej sytuacji."
        value={context}
        onChange={(e) => setContext(e.target.value)}
        className="w-full resize-none"
      />
      <span>Podaj dodatkowy kontekst, by AI mogło lepiej pomóc.</span>
    </Tooltip>

        <Textarea
          placeholder="Twoje pytanie, np. 'Jak pomóc dziecku zasnąć szybciej?'. Pytanie zadaj bardzo dokładnie, żeby odpowiedź mogła być lepiej sprecyzowana."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="resize-none min-h-[100px] w-full"
        />
<div className="mt-2 mb-4 text-xs text-gray-600 max-w-md">
  <p>
    Twoje pytania są anonimowe. Nie zbieramy ani nie przechowujemy żadnych danych osobowych.
    Korzystanie z serwisu odbywa się bez rejestracji i logowania.
  </p>
</div>
        <div className="flex justify-end">
          <Button
            onClick={handleAsk}
            disabled={loading || limitReached}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            {loading ? "Trwa generowanie odpowiedzi...ok. 30 sekund" : "Zadaj pytanie"}
          </Button>
        </div>

        {answer && (
          <div className="bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200 space-y-4">
            <p className="text-gray-800 whitespace-pre-line leading-relaxed">{answer}</p>
            <p className="text-xs text-gray-500 italic">
              ⚠️ Odpowiedź została wygenerowana przez AI. Zawsze skonsultuj się ze specjalistą w przypadku wątpliwości.
            </p>
            <Textarea
              placeholder="Masz dodatkowe pytanie do tej odpowiedzi? Zadaj je tutaj."
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              className="resize-none min-h-[80px] w-full"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleFollowUp}
                disabled={loading || limitReached}
                className="bg-amber-400 hover:bg-amber-500 text-white"
              >
                {loading ? "Czekaj...ok.30 sekund" : "Kontynuuj rozmowę"}
              </Button>
            </div>
{followUpAnswer && (
  <>
    <div className="mt-2 text-gray-800 whitespace-pre-line">{followUpAnswer}</div>
    {/* Informacja o zakończeniu wątku */}
    <div className="mt-4 p-4 bg-yellow-100 rounded-md text-yellow-800 text-center text-sm font-semibold">
      Wątek jest zakończony. Zadaj nowe pytanie.
        </div>
<div className="flex justify-center mt-4">
          <Button
            className="bg-amber-500 hover:bg-amber-600 text-white"
            onClick={() => {
              setQuestion("");
              setAge("");
              setGender("");
              setContext("");
              setAnswer("");
              setFollowUp("");
              setFollowUpAnswer("");
              setLimitReached(false);
              // Opcjonalnie jeśli chcesz zresetować licznik pytań, to tu też:
              // setQuestionCount(0);
            }}
          >
            Zadaj nowe pytanie
          </Button>
        </div>
      </>
    )}
  </div>
)}

      </CardContent>
    </Card>




{/* Cennik pakietów jako klikalne kafelki */}
<div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8 mb-10 font-sans text-gray-800">
  <h2 className="text-xl md:text-2xl font-medium mb-5 text-center tracking-wide">
    Pakiety pytań
  </h2>
  <div className="flex flex-row gap-4 flex-wrap justify-center">
    {packages.map((pkg) => (
      <button
        key={pkg.id}
        className="w-full sm:w-[180px] border border-gray-300 rounded-lg p-5 text-center hover:bg-amber-50 transition-colors shadow-sm"
        onClick={() => openPaymentModal(pkg)}
        type="button"
      >
        <h3 className="text-lg md:text-xl font-semibold mb-1">{pkg.name}</h3>
        <p className="text-base md:text-lg text-gray-700 mb-1">{pkg.questions} pytań</p>
        <p className="text-amber-600 font-bold text-lg md:text-xl">{pkg.price}</p>
      </button>
    ))}
  </div>
</div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mt-10 text-sm text-gray-600 text-center max-w-xl"
        >
          Ten serwis powstał, aby wspierać rodziców w trudnościach czy wątpliwościach, które się pojawiają. Nie jest to narzędzie diagnostyczne i nie zastępuje kontaktu z lekarzem, psychologiem czy terapeutą. <p>
  Masz pytania? Napisz do nas{" "}
  <a href="mailto:info@rodzic.ai" className="text-blue-600 underline">
    info@rodzic.ai
  </a>
</p>
        </motion.div>
      </main>
    </>
  );
}
