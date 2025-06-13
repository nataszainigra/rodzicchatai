import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { motion } from "framer-motion";
import { Sparkles, HelpCircle, BookOpen } from "lucide-react";
import { Tooltip } from "../components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";

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

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const packages = [
    { id: "mini", name: "Pakiet MINI", questions: 5, price: "9 zł" },
    { id: "standard", name: "Pakiet STANDARD", questions: 15, price: "19 zł" },
    { id: "maxi", name: "Pakiet MAXI", questions: 50, price: "39 zł" },
  ];

  const openPaymentModal = (pkg) => {
    setSelectedPackage(pkg);
    setShowPaymentModal(true);
  };

  const confirmPurchase = () => {
    alert(`Przekierowanie do płatności za ${selectedPackage.name}`);
    setShowPaymentModal(false);
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    if (questionCount >= 3) {
      setLimitReached(true);
      return;
    }
    setLoading(true);
    setAnswer("");
    setFollowUp("");
    setFollowUpAnswer("");
    setLimitReached(false);
    setTimeout(() => {
      setAnswer(
        "To przykładowa odpowiedź wygenerowana przez AI. W rzeczywistości tutaj pojawi się informacja oparta na literaturze i danych dostarczonych przez Ciebie. Zawsze skonsultuj się ze specjalistą."
      );
      setQuestionCount((prev) => prev + 1);
      setLoading(false);
    }, 2000);
  };

  const handleFollowUp = async () => {
    if (!followUp.trim()) return;
    if (questionCount >= 3) {
      setLimitReached(true);
      return;
    }
    setLoading(true);
    setFollowUpAnswer("");
    setLimitReached(false);
    setTimeout(() => {
      setFollowUpAnswer(
        "To kontynuacja odpowiedzi na Twoje pytanie. AI postarała się odpowiedzieć na podstawie poprzedniego kontekstu i nowego pytania."
      );
      setQuestionCount((prev) => prev + 1);
      setLoading(false);
    }, 2000);
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
      {/* Modal instrukcji startowej */}
      <Dialog id="intro-dialog" open={showIntro} onOpenChange={setShowIntro}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Jak korzystać z serwisu?</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-700 space-y-2">
            <p>Możesz zadać maksymalnie 3 darmowe pytania. Po każdej odpowiedzi możesz dopytać raz, by kontynuować wątek.</p>
            <p>Jeśli chcesz kontynuować korzystanie z serwisu – dostępne są pakiety płatne.</p>
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setShowIntro(false)} className="bg-amber-500 hover:bg-amber-600 text-white">
              Zamknij
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal potwierdzenia płatności */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Potwierdzenie zakupu</DialogTitle>
          </DialogHeader>
          <div className="text-gray-700 text-base mb-6">
            {selectedPackage ? (
              <>
                <p>
                  Czy chcesz przejść do płatności za <strong>{selectedPackage.name}</strong>?
                </p>
                <p className="mt-2 text-sm text-gray-500">Zostaniesz przeniesiony na stronę płatności.</p>
              </>
            ) : null}
          </div>
          <DialogFooter className="flex justify-end gap-3">
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

        <div className="bg-white rounded-xl shadow p-4 mb-6 max-w-xl text-sm text-gray-700 text-center">
          Możesz zadać do <strong>3 darmowych pytań</strong> – każde z możliwością jednego dopytania. Po wykorzystaniu darmowego limitu pojawi się informacja o konieczności wykupienia dostępu.
        </div>

        {limitReached && (
          <div className="bg-white shadow-lg border border-red-200 rounded-xl p-6 mb-6 max-w-md text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Limit pytań został wyczerpany</h2>
            <p className="text-gray-700 mb-4">
              Aby kontynuować korzystanie z serwisu, wybierz jeden z dostępnych pakietów:
            </p>
            <ul className="text-sm text-left list-disc list-inside mb-4">
              <li>
                <strong>Pakiet MINI</strong>: 5 pytań – 9 zł
              </li>
              <li>
                <strong>Pakiet STANDARD</strong>: 15 pytań – 19 zł
              </li>
              <li>
                <strong>Pakiet MAXI</strong>: 50 pytań – 39 zł
              </li>
            </ul>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">Wykup dostęp</Button>
          </div>
        )}

<Card className="w-full max-w-2xl shadow-xl rounded-2xl">
  <CardContent className="space-y-4 p-6">
      <Tooltip>
          <Input
            placeholder="Wiek dziecka (np. 4 lata)"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full"
          />
        <span>Podaj wiek dziecka, aby AI mogło lepiej dopasować poradę.</span>
      </Tooltip>

      <Tooltip>
          <Input
            placeholder="Płeć dziecka (np. chłopiec / dziewczynka )"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full"
          />
        <span>Płeć nie jest obowiązkowa, ale może pomóc w dokładniejszej odpowiedzi.</span>
      </Tooltip>

      <Tooltip>
          <Textarea
            placeholder="Dodatkowy kontekst, np. 'Dziecko ma trudności z zasypianiem od tygodnia'. Wpisz jak najwięcej informacji, żeby odpowiedź mogła być lepiej sprecyzowana do Twojej sytuacji."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="resize-none min-h-[120px] w-full"
          />
        <span>Podaj dodatkowy kontekst, by AI mogło lepiej pomóc.</span>
      </Tooltip>

    <Textarea
      placeholder="Twoje pytanie, np. 'Jak pomóc dziecku zasnąć szybciej?'. Pytanie zadaj bardzo dokładnie, żeby odpowiedź mogła być lepiej sprecyzowana."
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      className="resize-none min-h-[100px] w-full"
    />

    <div className="flex justify-end">
      <Button
        onClick={handleAsk}
        disabled={loading || limitReached}
        className="bg-amber-500 hover:bg-amber-600 text-white"
      >
        {loading ? "Trwa generowanie odpowiedzi..." : "Zadaj pytanie"}
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
            {loading ? "Czekaj..." : "Kontynuuj rozmowę"}
          </Button>
        </div>
        {followUpAnswer && (
          <div className="mt-2 text-gray-800 whitespace-pre-line">{followUpAnswer}</div>
        )}
      </div>
    )}
  </CardContent>
</Card>



        {/* Cennik pakietów jako klikalne kafelki */}
<div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8 mb-10 font-sans text-gray-800">
  <h2 className="text-2xl font-semibold mb-6 text-center">Pakiety pytań</h2>
  <div className="flex flex-row gap-4 flex-wrap justify-center">
    {packages.map((pkg) => (
      <button
        key={pkg.id}
        className="w-full sm:w-[180px] border border-gray-300 rounded-lg p-4 text-center hover:bg-amber-50 transition-colors"
        onClick={() => openPaymentModal(pkg)}
        type="button"
      >
        <h3 className="text-xl font-semibold">{pkg.name}</h3>
        <p className="text-lg">{pkg.questions} pytań</p>
        <p className="text-amber-600 font-bold text-xl">{pkg.price}</p>
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
          Ten serwis powstał, aby wspierać rodziców w trudnościach czy wątpliwościach, które się pojawiają. Nie jest to narzędzie diagnostyczne i nie zastępuje kontaktu z lekarzem, psychologiem czy terapeutą.
        </motion.div>
      </main>
    </>
  );
}
