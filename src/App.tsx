import { useState, useEffect } from "react";
import {
  Trophy,
  Gift,
  Coins,
  HelpCircle,
  Clover,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  Sparkles,
  Check,
  BookOpen,
  ChevronDown,
  Network,
  TrendingDown,
  Factory,
  LineChart,
  Zap,
  Brain,
  Building2,
  Percent,
  Users,
  Timer,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Question, PrizeType, CardState } from "./types";
import questionsDataRaw from "./data/questions.json";
import MonopolyGame from "./components/MonopolyGame";
import RequirementPage from "./components/RequirementPage";

const questionsData = questionsDataRaw as Question[];

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Real-world political economy situations data removed (unused in App)

// Theory content: sự tách rời giữa Kinh tế thực và Kinh tế ảo
const separationReasons = [
  {
    icon: Zap,
    title: "Tốc độ chu chuyển khác biệt",
    desc: "Tư bản sản xuất trải qua chu kỳ dài (mua nguyên liệu – sản xuất – tiêu thụ – thu hồi vốn), trong khi tư bản tài chính chu chuyển trong tích tắc nhờ giao dịch điện tử, tạo tốc độ tích lũy vượt trội.",
    color: "from-amber-500/10 to-yellow-500/10 border-amber-200",
  },
  {
    icon: Brain,
    title: "Tâm lý & kỳ vọng chi phối",
    desc: "Giá tư bản giả không chỉ phản ánh lợi nhuận hiện tại mà còn phản ánh kỳ vọng, tin đồn, tâm lý đám đông — nên có thể biến động độc lập, thậm chí ngược chiều với sản xuất thực (bong bóng tài sản).",
    color: "from-rose-500/10 to-pink-500/10 border-rose-200",
  },
  {
    icon: Building2,
    title: "'Tài chính hóa' nền kinh tế",
    desc: "Ngay cả các tập đoàn sản xuất cũng chuyển lợi nhuận sang đầu tư tài chính (mua lại cổ phiếu quỹ, trái phiếu, phái sinh phòng hộ) vì lợi hơn mở rộng sản xuất, khiến ranh giới sản xuất – tài chính mờ nhạt.",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-200",
  },
];

const dominanceReasons = [
  {
    icon: Percent,
    title: "Đòn bẩy & vòng quay vốn nhanh",
    desc: "Đầu cơ tài chính với đòn bẩy cao và tốc độ quay vòng vốn cực nhanh có thể tạo tỷ suất lợi nhuận vượt xa mức bình quân của khu vực sản xuất trong thời gian ngắn.",
  },
  {
    icon: Timer,
    title: "Chi phí & rủi ro thấp hơn",
    desc: "Đầu tư sản xuất đòi hỏi vốn lớn, thời gian thu hồi dài, rủi ro thị trường tiêu thụ cao; trong khi đầu cơ tài chính có thể thoát vị thế gần như ngay lập tức, chi phí chuyển đổi thấp.",
  },
  {
    icon: Users,
    title: "Sự thao túng của các tập đoàn tài chính lớn",
    desc: "Những định chế tài chính khổng lồ như BlackRock, Vanguard, State Street hay Fidelity đồng thời sở hữu lượng lớn cổ phần tại nhiều tập đoàn lớn, qua đó theo đuổi mục tiêu tối đa hóa lợi nhuận cho cả danh mục đầu tư trên toàn thị trường, thay vì chỉ chăm lo hiệu quả của riêng một doanh nghiệp sản xuất.",
  },
];

export default function App() {
  const [cards, setCards] = useState<CardState[]>([]);
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
  const [showError, setShowError] = useState(false);
  const [isPrizeRevealed, setIsPrizeRevealed] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "GAME" | "SITUATIONS" | "THEORY" | "REQUIREMENT"
  >("GAME");

  // Initialize/Reset Game
  const initGame = () => {
    // 1. Shuffle questions
    const shuffledQuestions = shuffleArray(questionsData);

    // 2. Prepare and shuffle prizes
    // 4 parts of 10k, 2 parts of 5k, 18 parts of Candy (Total 24)
    const rawPrizes: PrizeType[] = [
      ...Array(4).fill("10K" as PrizeType),
      ...Array(2).fill("5K" as PrizeType),
      ...Array(18).fill("CANDY" as PrizeType),
    ];
    const shuffledPrizes = shuffleArray(rawPrizes);

    // 3. Map questions to prizes and create card list
    const initialCards: CardState[] = shuffledQuestions
      .slice(0, 24)
      .map((q, index) => ({
        id: index + 1,
        question: q,
        prize: shuffledPrizes[index],
        isOpened: false,
        isCompleted: false,
      }));

    setCards(initialCards);
    setActiveCardId(null);
    setSelectedOption(null);
    setIsChecked(false);
    setIsCorrect(false);
    setIsShaking(false);
    setGameCompleted(false);
    setWrongAnswers([]);
    setShowError(false);
    setIsPrizeRevealed(false);

    // Initial subtle confetti just to make start feel alive
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
    });
  };

  // Run on mount
  useEffect(() => {
    initGame();
  }, []);

  // Check if all cards are completed to finish the game
  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.isCompleted)) {
      setGameCompleted(true);
      // Trigger multiple confetti explosions for victory!
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [cards]);

  const activeCard = cards.find((c) => c.id === activeCardId) || null;

  const handleCardClick = (cardId: number) => {
    // If another card is currently being answered, do not allow opening another
    if (activeCardId !== null) return;

    const targetCard = cards.find((c) => c.id === cardId);
    if (!targetCard || targetCard.isCompleted) return;

    // Flip the card open
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isOpened: true } : c)),
    );

    // Open question modal (after a slight delay for 3D flip animation effect)
    setTimeout(() => {
      setActiveCardId(cardId);
      setSelectedOption(null);
      setSelectedOption(null);
      setIsCorrect(false);
      setWrongAnswers([]);
      setShowError(false);
      setIsPrizeRevealed(false);
    }, 400);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isCorrect) return; // Prevent changing answer if already correct
    if (wrongAnswers.includes(optionIndex)) return; // Prevent selecting already marked wrong options
    setSelectedOption(optionIndex);
    setIsShaking(false);
    setShowError(false);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || !activeCard) return;

    const isAnswerCorrect = selectedOption === activeCard.question.answer;

    if (isAnswerCorrect) {
      setIsCorrect(true);
      setShowError(false);
      setIsPrizeRevealed(false);
    } else {
      // Incorrect answer
      setWrongAnswers((prev) => [...prev, selectedOption]);
      setShowError(true);
      setIsShaking(true);
      setSelectedOption(null); // Clear selection so they must select another one
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleRevealPrize = () => {
    if (isPrizeRevealed || !activeCard) return;
    setIsPrizeRevealed(true);

    // Confetti burst on reveal
    if (activeCard.prize === "10K" || activeCard.prize === "5K") {
      const end = Date.now() + 1200;
      const colors = ["#eab308", "#22c55e", "#3b82f6", "#a855f7"];
      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 65,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 65,
          origin: { x: 1 },
          colors: colors,
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } else {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.75 },
      });
    }
  };

  const handleNextCard = () => {
    if (!activeCard) return;

    // Set active card as completed
    setCards((prev) =>
      prev.map((c) =>
        c.id === activeCard.id ? { ...c, isCompleted: true } : c,
      ),
    );

    // Reset modal states
    setActiveCardId(null);
    setSelectedOption(null);
    setIsChecked(false);
    setIsCorrect(false);
  };

  // Get statistics
  const completedCount = cards.filter((c) => c.isCompleted).length;
  const candyCount = cards.filter(
    (c) => c.isCompleted && c.prize === "CANDY",
  ).length;
  const cash5kCount = cards.filter(
    (c) => c.isCompleted && c.prize === "5K",
  ).length;
  const cash10kCount = cards.filter(
    (c) => c.isCompleted && c.prize === "10K",
  ).length;
  const totalCash = cash5kCount * 5000 + cash10kCount * 10000;

  return (
    <div className="min-h-screen bg-transparent text-slate-800 flex flex-col font-sans antialiased pb-12">
      {/* Header bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-slate-200/80 px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/10">
              <Trophy className="h-7 w-7 text-white animate-bounce" />
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-700 via-purple-600 to-indigo-800 bg-clip-text text-transparent tracking-wide font-outfit uppercase">
              MLN122
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setActiveTab("GAME")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition duration-200 cursor-pointer ${
                activeTab === "GAME"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/40"
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span>Trò chơi</span>
            </button>
            <button
              onClick={() => setActiveTab("SITUATIONS")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition duration-200 cursor-pointer ${
                activeTab === "SITUATIONS"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/40"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Tình huống</span>
            </button>
            <button
              onClick={() => setActiveTab("REQUIREMENT")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition duration-200 cursor-pointer ${
                activeTab === "REQUIREMENT"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/40"
              }`}
            >
              <Network className="h-4 w-4" />
              <span>Yêu cầu</span>
            </button>
            <button
              onClick={() => setActiveTab("THEORY")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition duration-200 cursor-pointer ${
                activeTab === "THEORY"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/40"
              }`}
            >
              <LineChart className="h-4 w-4" />
              <span>Lý thuyết</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 mt-8 flex-grow">
        {activeTab === "GAME" ? (
          <>
            {/* Dashboard Column Grid (GAME) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              {/* Left Dashboard Column (Progress, Stats, Control) */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-6">
                {/* Progress Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md flex-grow flex flex-col justify-between animate-scale-in">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" /> Tiến
                        trình lật bài
                      </h2>
                      <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                        {completedCount} / 24 Hoàn thành
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-3.5 p-0.5 border border-slate-200 shadow-inner mb-6">
                      <div
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 shadow-glow"
                        style={{ width: `${(completedCount / 24) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats and Controls Panel */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
                    {/* Stat Pills */}
                    <div className="flex bg-slate-50 rounded-xl border border-slate-200 px-4 py-2 gap-4 shadow-inner">
                      <div className="flex items-center gap-2 text-sm text-slate-650">
                        <Gift className="h-4.5 w-4.5 text-pink-500" />
                        <span>Kẹo:</span>
                        <span className="font-extrabold text-pink-600">
                          {candyCount} 🍬
                        </span>
                      </div>
                      <div className="h-6 w-px bg-slate-200 self-center" />
                      <div className="flex items-center gap-2 text-sm text-slate-650">
                        <Coins className="h-4.5 w-4.5 text-amber-500" />
                        <span>Tiền mặt:</span>
                        <span className="font-extrabold text-amber-600">
                          {totalCash.toLocaleString("vi-VN")}đ 💵
                        </span>
                      </div>
                    </div>

                    {/* Reset Button */}
                    <button
                      onClick={initGame}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition duration-200 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/20 cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Chơi lại</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Dashboard Column (Game Instructions) */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-md flex flex-col justify-center animate-scale-in">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <BookOpen className="h-5 w-5 text-indigo-500" /> Phổ biến cách
                  chơi
                </h2>

                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-605">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">1.</span>
                    <span>
                      Nhấp chọn các lá bài bí ẩn (từ 1 đến 24) để hiển thị câu
                      hỏi trắc nghiệm.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">2.</span>
                    <span>
                      **Trả lời sai**: Hệ thống bôi đỏ và vô hiệu hóa đáp án đó.
                      Chọn phương án khác đến khi đúng.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">3.</span>
                    <span>
                      **Trả lời đúng**: Click mở **Hộp quà bí ẩn 🎁** để khui
                      quà (Kẹo 🍬 hoặc Tiền mặt 💵).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">4.</span>
                    <span>
                      Lá bài hoàn thành sẽ mờ đi và đánh dấu ✓. Hoàn thành tất
                      cả 24 lá để chiến thắng!
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card Grid Section */}
            <section>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 justify-center">
                {cards.map((card) => {
                  const isCardOpened = card.isOpened;
                  const isCardCompleted = card.isCompleted;

                  return (
                    <div
                      key={card.id}
                      onClick={() => handleCardClick(card.id)}
                      className={`relative h-44 rounded-2xl perspective-1000 group transition-all duration-300 ${
                        isCardCompleted
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer hover:scale-105 active:scale-95"
                      }`}
                    >
                      <div
                        className={`relative w-full h-full rounded-2xl transition-transform duration-500 transform-style-3d ${
                          isCardOpened ? "rotate-y-180" : ""
                        }`}
                      >
                        {/* CARD BACK (Face down - Mystery Card) */}
                        <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-white via-indigo-50/20 to-indigo-100/30 border-2 border-indigo-250 hover:border-indigo-500 shadow-md group-hover:shadow-lg backface-hidden flex flex-col items-center justify-center p-4 transition-all duration-300">
                          {/* Grid background effect */}
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:10px_10px] rounded-2xl" />

                          <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center mb-2 shadow-inner group-hover:rotate-12 transition-transform duration-300">
                            <HelpCircle className="h-6 w-6 text-indigo-500 group-hover:text-indigo-600" />
                          </div>

                          <span className="text-xs text-indigo-500 tracking-widest font-black uppercase">
                            Card
                          </span>
                          <span className="text-xl font-extrabold text-slate-700 mt-0.5 font-outfit">
                            {card.id}
                          </span>
                        </div>

                        {/* CARD FRONT (Flipped Up) */}
                        <div
                          className={`absolute inset-0 w-full h-full rounded-2xl backface-hidden rotate-y-180 flex flex-col items-center justify-center p-4 border-2 ${
                            isCardCompleted
                              ? "bg-slate-50 text-slate-400 border-slate-200"
                              : "bg-gradient-to-br from-indigo-50 via-blue-50/30 to-white border-indigo-200 shadow-sm"
                          }`}
                        >
                          {isCardCompleted ? (
                            /* Completed State representation */
                            <div className="flex flex-col items-center text-center animate-fade-in">
                              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-2 shadow-inner">
                                <Check className="h-5 w-5 text-emerald-650" />
                              </div>

                              <span className="text-xs text-slate-400 uppercase font-bold tracking-wide">
                                Đã xong
                              </span>
                              <span className="text-sm font-extrabold text-slate-600 mt-1 flex items-center gap-1.5 font-outfit">
                                {card.prize === "CANDY" ? (
                                  <>
                                    <Gift className="h-4 w-4 text-pink-500" />{" "}
                                    Kẹo 🍬
                                  </>
                                ) : (
                                  <>
                                    <Coins className="h-4 w-4 text-amber-500" />{" "}
                                    {card.prize === "5K" ? "5.000đ" : "10.000đ"}{" "}
                                    💵
                                  </>
                                )}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center text-center">
                              <div className="w-12 h-12 rounded-full bg-white border border-indigo-200 flex items-center justify-center mb-2">
                                <HelpCircle className="h-6 w-6 text-indigo-500" />
                              </div>
                              <span className="text-xs text-indigo-500 font-bold uppercase">
                                READY
                              </span>
                              <span className="text-lg font-black text-slate-700 mt-1">
                                Bài {card.id}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        ) : activeTab === "SITUATIONS" ? (
          <MonopolyGame />
        ) : activeTab === "THEORY" ? (
          /* THEORY TAB CONTENT — Sự tách rời Kinh tế thực & Kinh tế ảo */
          <div className="space-y-8 animate-fade-in pb-4">
            {/* Intro Panel */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6 animate-scale-in">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-800 flex items-center justify-center sm:justify-start gap-2.5 font-outfit">
                  <LineChart className="h-6 w-6 text-indigo-500" /> Sự tách rời:
                  Kinh tế thực &amp; Kinh tế ảo
                </h2>
                <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
                  Vì sao lợi nhuận từ đầu cơ tài chính ngày nay lại lấn át lợi
                  nhuận từ sản xuất kinh doanh? Phân tích dựa trên lý luận về tư
                  bản giả (fictitious capital) và tư bản tài chính của V.I.
                  Lênin.
                </p>
              </div>
            </section>

            {/* Two circuits comparison */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Kinh te thuc */}
                <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/60 to-blue-50/40 p-5">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="p-2 bg-indigo-600 rounded-xl shadow-md">
                      <Factory className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-bold text-indigo-800 font-outfit">
                      Kinh tế thực
                    </h4>
                  </div>
                  <p className="text-sm text-indigo-900/80 leading-relaxed mb-3">
                    Tư bản vận động qua sản xuất, tạo ra giá trị và giá trị
                    thặng dư thực sự.
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-indigo-700">
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-indigo-200">
                      Mua TLSX
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 rotate-[-90deg]" />
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-indigo-200">
                      Sản xuất
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 rotate-[-90deg]" />
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-indigo-200">
                      Tiêu thụ
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 rotate-[-90deg]" />
                    <span className="bg-indigo-600 text-white px-2.5 py-1 rounded-lg">
                      Giá trị thặng dư
                    </span>
                  </div>
                </div>

                {/* Kinh te ao */}
                <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/60 to-rose-50/40 p-5">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="p-2 bg-amber-500 rounded-xl shadow-md">
                      <LineChart className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-bold text-amber-800 font-outfit">
                      Kinh tế ảo
                    </h4>
                  </div>
                  <p className="text-sm text-amber-900/80 leading-relaxed mb-3">
                    Tư bản giả (cổ phiếu, trái phiếu, phái sinh) mua bán trên
                    thị trường tài chính, sinh lời qua chênh lệch giá.
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-amber-700">
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                      Tư bản giả
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 rotate-[-90deg]" />
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                      Mua bán trên TT tài chính
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 rotate-[-90deg]" />
                    <span className="bg-amber-500 text-white px-2.5 py-1 rounded-lg">
                      Lời do chênh lệch giá (T–T')
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* 4 reasons for separation */}
            <section>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-1.5 px-1">
                <Sparkles className="h-4 w-4 text-indigo-500" /> Vì sao có sự
                tách rời?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {separationReasons.map((r, idx) => {
                  const Icon = r.icon;
                  return (
                    <div
                      key={idx}
                      className={`bg-gradient-to-br ${r.color} rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow duration-300`}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                          <Icon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm font-outfit">
                          {r.title}
                        </h4>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {r.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Why speculative profit dominates */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <TrendingDown className="h-4 w-4 text-rose-500" /> Vì sao lợi
                nhuận đầu cơ lấn át lợi nhuận sản xuất?
              </h3>
              <div className="space-y-3.5">
                {dominanceReasons.map((r, idx) => {
                  const Icon = r.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 hover:border-indigo-200 transition-colors duration-200"
                    >
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm flex-shrink-0">
                        <Icon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-sm mb-1 font-outfit">
                          {r.title}
                        </h5>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {r.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        ) : activeTab === "REQUIREMENT" ? (
          <RequirementPage />
        ) : null}
      </main>

      {/* QUIZ POPUP MODAL */}
      {activeCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          {/* Modal Card wrapper */}
          <div
            className={`w-full max-w-lg bg-white rounded-3xl border shadow-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 ${
              isShaking ? "animate-shake" : ""
            } ${
              activeCard.question.isLucky && isCorrect
                ? "border-emerald-350 shadow-[0_10px_40px_rgba(16,185,129,0.15)] animate-lucky-glow"
                : "border-indigo-200 shadow-[0_10px_40px_rgba(99,102,241,0.12)]"
            }`}
          >
            {/* Lucky Question floating background elements */}
            {activeCard.question.isLucky && isCorrect && (
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            )}

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                {activeCard.question.isLucky && isCorrect ? (
                  <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-600 text-xs font-black tracking-widest uppercase shadow-sm">
                    <Clover className="h-4 w-4 text-emerald-500 animate-spin-slow" />
                    <span>🍀 Lucky Question</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-600 text-xs font-black tracking-widest uppercase shadow-sm">
                    <HelpCircle className="h-4 w-4 text-indigo-500" />
                    <span>Câu hỏi {activeCard.id}</span>
                  </div>
                )}
              </div>
              <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-md">
                Lá bài #{activeCard.id}
              </span>
            </div>

            {/* Question Text */}
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-relaxed font-outfit">
                {activeCard.question.question}
              </h3>
            </div>

            {/* Answer Options Grid */}
            <div className="space-y-3.5 mb-6">
              {activeCard.question.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isWrong = wrongAnswers.includes(idx);
                const isCorrectAnswer = idx === activeCard.question.answer;

                let btnStyle =
                  "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700 hover:border-indigo-200";

                // If the whole card is completed correctly
                if (isCorrect) {
                  if (isCorrectAnswer) {
                    btnStyle =
                      "bg-emerald-50 border-emerald-500 text-emerald-700 font-bold shadow-md shadow-emerald-500/10";
                  } else {
                    btnStyle =
                      "bg-slate-50/40 border-slate-200/60 text-slate-400 pointer-events-none opacity-40";
                  }
                } else {
                  // Card is in progress
                  if (isWrong) {
                    btnStyle =
                      "bg-rose-50 border-rose-200 text-rose-500 pointer-events-none opacity-60";
                  } else if (isSelected) {
                    btnStyle = activeCard.question.isLucky
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold"
                      : "bg-indigo-50 border-indigo-500 text-indigo-750 font-semibold";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isCorrect || isWrong}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition duration-200 flex items-center justify-between group cursor-pointer ${btnStyle}`}
                  >
                    <span className="text-sm sm:text-base pr-4 leading-normal">
                      {option}
                    </span>
                    {isCorrect && isCorrectAnswer && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-650 flex-shrink-0 animate-scale-in" />
                    )}
                    {isWrong && (
                      <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0 animate-scale-in" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Error or Success notification */}
            {(showError || isCorrect) && (
              <div
                className={`p-4 rounded-2xl mb-6 flex flex-col gap-1.5 animate-fade-in border ${
                  isCorrect
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                  {isCorrect ? (
                    <>
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                      <span>
                        {activeCard.question.isLucky
                          ? "🎉 Chúc mừng!"
                          : "✅ Chính xác!"}
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-rose-500 animate-pulse" />
                      <span>❌ Sai rồi! Hãy thử lại.</span>
                    </>
                  )}
                </div>

                {isCorrect && (
                  <>
                    {activeCard.question.explanation && (
                      <p className="text-xs text-slate-600 leading-relaxed mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <strong className="text-indigo-600">Giải thích:</strong>{" "}
                        {activeCard.question.explanation}
                      </p>
                    )}

                    {!isPrizeRevealed ? (
                      /* UNOPENED MYSTERY GIFT BOX */
                      <div
                        onClick={handleRevealPrize}
                        className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-indigo-50/10 to-slate-100 border-2 border-dashed border-amber-500/40 hover:border-amber-500/80 flex flex-col items-center justify-center gap-3 cursor-pointer shadow-sm hover:shadow-amber-500/5 hover:scale-[1.02] transition-all duration-300 group"
                      >
                        <div className="relative">
                          {/* Pulsing ring effect */}
                          <div className="absolute -inset-1 rounded-full bg-amber-500/10 blur animate-pulse" />
                          <div className="relative p-3.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-500/20 group-hover:rotate-12 transition-transform duration-300">
                            <Gift className="h-8 w-8 animate-bounce" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest animate-pulse">
                            🎁 Hộp quà bí ẩn
                          </p>
                          <p className="text-sm font-semibold text-slate-500 mt-1">
                            Nhấp vào đây để khui quà của bạn!
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Prize Reveal Panel */
                      <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/10 border border-indigo-200/80 flex items-center justify-between gap-4 shadow-inner animate-scale-in">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-3 rounded-xl ${
                              activeCard.prize === "CANDY"
                                ? "bg-pink-50 text-pink-650 border border-pink-200/60"
                                : "bg-amber-50 text-amber-650 border border-amber-200/60"
                            }`}
                          >
                            {activeCard.prize === "CANDY" ? (
                              <Gift className="h-6 w-6" />
                            ) : (
                              <Coins className="h-6 w-6" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                              Phần quà nhận được
                            </p>
                            <p
                              className={`text-lg font-black font-outfit ${
                                activeCard.prize === "CANDY"
                                  ? "text-pink-600"
                                  : "text-amber-600"
                              }`}
                            >
                              {activeCard.prize === "CANDY"
                                ? "Kẹo thơm 🍬"
                                : `${activeCard.prize === "5K" ? "💵 5.000 VNĐ" : "💵 10.000 VNĐ"}`}
                            </p>
                          </div>
                        </div>

                        {activeCard.prize !== "CANDY" ? (
                          <span className="text-xs font-black text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full animate-pulse tracking-wide uppercase">
                            Tiền Mặt
                          </span>
                        ) : (
                          <span className="text-xs font-black text-pink-600 bg-pink-50 border border-pink-200 px-3 py-1 rounded-full animate-pulse tracking-wide uppercase">
                            Kẹo Ngọt
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Modal Controls */}
            <div className="flex gap-4 animate-scale-in">
              {!isCorrect ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleCheckAnswer}
                  className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                    selectedOption === null
                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                      : activeCard.question.isLucky
                        ? "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-emerald-600/20"
                        : "bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-indigo-600/20"
                  }`}
                >
                  Kiểm tra
                </button>
              ) : (
                <button
                  onClick={handleNextCard}
                  disabled={!isPrizeRevealed}
                  className={`w-full py-4 font-black text-base rounded-2xl transition duration-200 flex items-center justify-center gap-2 shadow-lg ${
                    !isPrizeRevealed
                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-indigo-600/20 cursor-pointer"
                  }`}
                >
                  {!isPrizeRevealed
                    ? "Hãy mở hộp quà trước..."
                    : "Đóng & Nhận quà"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* GAME SUMMARY SCREEN */}
      {gameCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl animate-fade-in">
            {/* Glowing sunburst behind trophy */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex p-4 bg-gradient-to-tr from-yellow-500 to-amber-500 rounded-2xl shadow-xl shadow-yellow-500/25 mb-6 animate-bounce">
              <Trophy className="h-12 w-12 text-slate-950" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent mb-2 tracking-wide font-outfit uppercase">
              Thử Thách Hoàn Thành!
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mb-8 max-w-md mx-auto">
              Chúc mừng bạn đã trả lời xuất sắc toàn bộ 24 câu hỏi bí ẩn và nhận
              được toàn bộ phần quà!
            </p>

            {/* Summary details */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col items-center">
                <Gift className="h-8 w-8 text-pink-600 mb-2" />
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Phần Quà Kẹo
                </span>
                <span className="text-2xl font-black text-pink-600 mt-1 font-outfit">
                  {candyCount} Kẹo 🍬
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col items-center">
                <Coins className="h-8 w-8 text-amber-600 mb-2" />
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Tổng Tiền Mặt
                </span>
                <span className="text-2xl font-black text-amber-600 mt-1 font-outfit">
                  {totalCash.toLocaleString("vi-VN")} VNĐ 💵
                </span>
              </div>
            </div>

            {/* Details breakdown */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-8 text-left space-y-2 text-sm text-slate-650 shadow-inner">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-semibold">
                  Thống kê chi tiết phần quà:
                </span>
                <span className="font-mono text-indigo-600 font-bold">
                  24 / 24 Lá bài
                </span>
              </div>
              <div className="flex justify-between">
                <span>🍬 Phần quà Kẹo:</span>
                <span className="font-bold text-slate-800">
                  {candyCount} / 18
                </span>
              </div>
              <div className="flex justify-between">
                <span>💵 Gói 5.000 VNĐ:</span>
                <span className="font-bold text-slate-800">
                  {cash5kCount} / 2
                </span>
              </div>
              <div className="flex justify-between">
                <span>💵 Gói 10.000 VNĐ:</span>
                <span className="font-bold text-slate-800">
                  {cash10kCount} / 4
                </span>
              </div>
              <div className="h-px bg-slate-200 my-2" />
              <div className="flex justify-between text-base font-black text-amber-600 font-outfit">
                <span>TỔNG CỘNG TIỀN MẶT:</span>
                <span>{totalCash.toLocaleString("vi-VN")} VNĐ</span>
              </div>
            </div>

            <button
              onClick={initGame}
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-650 text-white font-black text-lg rounded-2xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20 mx-auto"
            >
              <RotateCcw className="h-5 w-5 text-white" />
              Chơi lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
