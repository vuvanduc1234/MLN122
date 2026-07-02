import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  TrendingDown,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Network,
  RotateCcw,
  Zap,
  Globe,
  ShoppingCart,
  Smartphone,
  Car,
} from "lucide-react";
import {
  ReactFlow,
  Background,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import confetti from "canvas-confetti";

export default function MonopolyGame() {
  const [stage, setStage] = useState(1);
  const [score, setScore] = useState(0);

  // Stage 1 State
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [stage1Result, setStage1Result] = useState(false);

  // Stage 2 State
  const [stage2Choice, setStage2Choice] = useState<"compete" | "buyout" | null>(null);

  // Stage 3 State
  const [stage3Choice, setStage3Choice] = useState<string | null>(null);

  // Stage 4 State
  const [fundShares, setFundShares] = useState<string[]>([]);
  const [showNetwork, setShowNetwork] = useState(false);

  // Stage 5 State
  const [stage5Answer, setStage5Answer] = useState<string | null>(null);

  const nextStage = () => {
    setStage((prev) => prev + 1);
  };

  const handleRestart = () => {
    setStage(1);
    setScore(0);
    setSelectedIndustry(null);
    setStage1Result(false);
    setStage2Choice(null);
    setStage3Choice(null);
    setFundShares([]);
    setShowNetwork(false);
    setStage5Answer(null);
  };

  // --- STAGE 1: Cạnh tranh tự do ---
  const renderStage1 = () => {
    const industries = [
      { id: "soda", name: "Công ty nước ngọt", icon: ShoppingCart, color: "text-rose-500" },
      { id: "phone", name: "Công ty điện thoại", icon: Smartphone, color: "text-blue-500" },
      { id: "car", name: "Công ty ô tô", icon: Car, color: "text-slate-700" },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6 animate-fade-in"
      >
        <div className="text-center">
          <h2 className="text-2xl font-black text-indigo-700 uppercase tracking-wide">
            Giai đoạn 1: Cạnh tranh tự do
          </h2>
          <p className="text-slate-600 mt-2 font-medium">
            Bạn có <span className="font-bold text-indigo-600">100 triệu USD</span> để mở doanh nghiệp. Hãy chọn một ngành để bắt đầu:
          </p>
        </div>

        {!stage1Result ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {industries.map((ind) => {
              const Icon = ind.icon;
              return (
                <button
                  key={ind.id}
                  onClick={() => {
                    setSelectedIndustry(ind.id);
                    setStage1Result(true);
                  }}
                  className="p-6 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center gap-4 group cursor-pointer"
                >
                  <div className={`p-4 rounded-full bg-slate-100 group-hover:bg-white shadow-sm transition-colors ${ind.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <span className="font-bold text-slate-700">{ind.name}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 border-2 border-rose-200 shadow-lg shadow-rose-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-8 h-8 text-rose-500" />
              <h3 className="text-xl font-bold text-slate-800">Thị trường khốc liệt!</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <p className="text-sm text-slate-500 font-bold uppercase mb-1">Thị phần</p>
                <p className="text-2xl font-black text-slate-700">5%</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <p className="text-sm text-slate-500 font-bold uppercase mb-1">Doanh thu</p>
                <p className="text-2xl font-black text-slate-700">Thấp</p>
              </div>
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 text-center">
                <p className="text-sm text-rose-500 font-bold uppercase mb-1">Cạnh tranh</p>
                <p className="text-2xl font-black text-rose-600">Cao</p>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl mb-6 shadow-inner">
              <p className="text-indigo-800 font-medium italic">
                "Cạnh tranh buộc các doanh nghiệp phải liên tục cải tiến và giảm chi phí. Nhưng vì có quá nhiều đối thủ, lợi nhuận của bạn rất thấp."
              </p>
            </div>

            <button
              onClick={() => {
                setScore(score + 10);
                nextStage();
              }}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              Tiếp tục <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </motion.div>
    );
  };

  // --- STAGE 2: Tích tụ và tập trung tư bản ---
  const renderStage2 = () => {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-indigo-700 uppercase tracking-wide">
            Giai đoạn 2: Tích tụ và tập trung tư bản
          </h2>
          <p className="text-slate-600 mt-2 font-medium">
            Để tồn tại, bạn cần mở rộng quy mô. Bạn sẽ làm gì tiếp theo?
          </p>
        </div>

        {!stage2Choice ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              onClick={() => setStage2Choice("compete")}
              className="p-6 rounded-2xl border-2 border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50 transition-all flex flex-col items-center gap-4 cursor-pointer hover:shadow-md"
            >
              <TrendingDown className="w-12 h-12 text-amber-500" />
              <div className="text-center">
                <span className="font-bold text-slate-800 text-lg block">Tiếp tục cạnh tranh</span>
                <span className="text-sm text-slate-500">Giữ nguyên quy mô, cố gắng giảm giá bán</span>
              </div>
            </button>
            <button
              onClick={() => {
                setStage2Choice("buyout");
                setScore(score + 20);
                confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
              }}
              className="p-6 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50 transition-all flex flex-col items-center gap-4 cursor-pointer hover:shadow-md"
            >
              <Building2 className="w-12 h-12 text-emerald-500" />
              <div className="text-center">
                <span className="font-bold text-slate-800 text-lg block">Mua lại đối thủ</span>
                <span className="text-sm text-slate-500">Sáp nhập các công ty yếu hơn để tạo thành tập đoàn lớn</span>
              </div>
            </button>
          </div>
        ) : stage2Choice === "buyout" ? (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 flex flex-col items-center">
            {/* Merging Animation */}
            <div className="relative h-48 w-full max-w-md mx-auto mb-8 flex items-center justify-center">
              <motion.div
                initial={{ x: -120, opacity: 1 }}
                animate={{ x: 0, opacity: 0, scale: 0.5 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="absolute p-3 bg-blue-100 rounded-xl font-bold text-blue-700 border border-blue-300 shadow-sm"
              >
                Công ty A
              </motion.div>
              <motion.div
                initial={{ x: 120, opacity: 1 }}
                animate={{ x: 0, opacity: 0, scale: 0.5 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="absolute p-3 bg-rose-100 rounded-xl font-bold text-rose-700 border border-rose-300 shadow-sm"
              >
                Công ty B
              </motion.div>
              <motion.div
                initial={{ y: 100, opacity: 1 }}
                animate={{ y: 0, opacity: 0, scale: 0.5 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="absolute p-3 bg-amber-100 rounded-xl font-bold text-amber-700 border border-amber-300 shadow-sm"
              >
                Công ty C
              </motion.div>
              
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                transition={{ duration: 1, delay: 2, type: "spring" }}
                className="absolute p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-black text-white shadow-xl shadow-indigo-500/30 flex items-center gap-2 z-10"
              >
                <Globe className="w-6 h-6" /> MEGA CORPORATION
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              className="w-full"
            >
              <div className="p-5 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl mb-6 shadow-inner">
                <p className="text-emerald-800 font-medium italic">
                  "Quá trình tích tụ và tập trung tư bản làm xuất hiện những doanh nghiệp quy mô lớn. Bằng cách sáp nhập, bạn đã loại bỏ bớt đối thủ và gia tăng sức mạnh thị trường."
                </p>
              </div>
              <div className="text-center mb-6">
                <span className="inline-block bg-yellow-100 border border-yellow-200 text-yellow-700 px-4 py-1.5 rounded-full font-bold text-sm shadow-sm">
                  +20 Điểm
                </span>
              </div>
              <button
                onClick={nextStage}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-indigo-600/20"
              >
                Tiếp tục <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-rose-200 text-center animate-shake">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Thất bại!</h3>
            <p className="text-slate-600 mb-6 font-medium">
              Bạn không thể cạnh tranh lại với các tập đoàn lớn đã tích tụ tư bản khổng lồ. Lợi nhuận của bạn cạn kiệt.
            </p>
            <button
              onClick={() => setStage2Choice(null)}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer border border-slate-200 shadow-sm"
            >
              Thử lại lựa chọn
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  // --- STAGE 3: Độc quyền ---
  const renderStage3 = () => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-indigo-700 uppercase tracking-wide">
            Giai đoạn 3: Độc quyền
          </h2>
          <div className="mt-4 p-4 bg-indigo-50 rounded-xl inline-block border border-indigo-200 shadow-inner">
            <p className="text-indigo-800 font-bold uppercase tracking-wider text-sm mb-1">Thị phần hiện tại</p>
            <p className="text-4xl font-black text-indigo-600">80%</p>
          </div>
          <p className="text-slate-600 mt-4 font-medium">
            Với vị thế độc quyền thị trường, bạn sẽ ra quyết định gì về định giá sản phẩm?
          </p>
        </div>

        {!stage3Choice ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setStage3Choice("increase")}
              className="p-5 bg-white border-2 border-slate-200 rounded-xl hover:border-rose-400 hover:bg-rose-50 hover:shadow-md transition-all text-center group cursor-pointer"
            >
              <TrendingUp className="w-8 h-8 text-rose-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-bold block text-slate-700">Tăng giá mạnh</span>
            </button>
            <button
              onClick={() => setStage3Choice("keep")}
              className="p-5 bg-white border-2 border-slate-200 rounded-xl hover:border-amber-400 hover:bg-amber-50 hover:shadow-md transition-all text-center group cursor-pointer"
            >
              <Briefcase className="w-8 h-8 text-amber-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-bold block text-slate-700">Giữ nguyên giá</span>
            </button>
            <button
              onClick={() => setStage3Choice("invest")}
              className="p-5 bg-white border-2 border-slate-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-md transition-all text-center group cursor-pointer"
            >
              <Zap className="w-8 h-8 text-emerald-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-bold block text-slate-700">Đầu tư công nghệ</span>
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
          >
            <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Kết quả thị trường</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Lợi nhuận độc quyền</p>
                <p className="text-xl font-black text-emerald-600">
                  {stage3Choice === "increase" ? "Rất Cao" : stage3Choice === "keep" ? "Cao" : "Bền vững"}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Thị phần</p>
                <p className="text-xl font-black text-indigo-600">
                  {stage3Choice === "increase" ? "Giảm nhẹ (75%)" : stage3Choice === "keep" ? "Ổn định (80%)" : "Tăng (85%)"}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Quyền lực thị trường</p>
                <p className="text-xl font-black text-purple-600">Chi phối tuyệt đối</p>
              </div>
            </div>
            
            <div className="p-5 bg-purple-50 border-l-4 border-purple-500 rounded-r-xl mb-6 shadow-inner">
              <p className="text-purple-800 font-medium text-center italic">
                "Độc quyền có khả năng chi phối thị trường, thiết lập giá cả (giá cả độc quyền) để thu lợi nhuận độc quyền cao, nhưng không hề thủ tiêu cạnh tranh hoàn toàn."
              </p>
            </div>

            <button
              onClick={() => {
                setScore(score + 20);
                nextStage();
              }}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              Giai đoạn tiếp theo <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </motion.div>
    );
  };

  // --- STAGE 4: Biểu hiện mới của độc quyền (React Flow) ---
  const initialNodes: Node[] = [
    {
      id: "fund",
      position: { x: 180, y: 30 },
      data: { 
        label: (
          <div className="font-bold flex flex-col items-center gap-2">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <img src="https://www.google.com/s2/favicons?domain=blackrock.com&sz=128" alt="BlackRock" className="w-8 h-8 object-contain" onError={(e) => (e.currentTarget.src = "https://ui-avatars.com/api/?name=Fund&background=4f46e5&color=fff")} />
            </div>
            <span>Quỹ đầu tư (Bạn)</span>
          </div>
        )
      },
      style: { background: "linear-gradient(to right, #4f46e5, #9333ea)", color: "white", border: "none", borderRadius: "16px", padding: "16px", width: 220, boxShadow: "0 15px 30px rgba(79, 70, 229, 0.4)" },
    },
    { id: "coca", position: { x: -20, y: 220 }, data: { label: <div className="flex flex-col items-center"><img src="https://www.google.com/s2/favicons?domain=coca-cola.com&sz=128" alt="Coca-Cola" className="w-10 h-10 mb-2 rounded-full shadow-sm bg-white" onError={(e) => (e.currentTarget.src = "https://ui-avatars.com/api/?name=C&background=ef4444&color=fff")} /><span>Coca-Cola</span></div> }, style: { borderRadius: "12px", fontWeight: "bold", border: "2px solid #ef4444", background: "white", padding: "10px" } },
    { id: "pepsi", position: { x: 180, y: 280 }, data: { label: <div className="flex flex-col items-center"><img src="https://www.google.com/s2/favicons?domain=pepsico.com&sz=128" alt="PepsiCo" className="w-10 h-10 mb-2 rounded-full shadow-sm bg-white" onError={(e) => (e.currentTarget.src = "https://ui-avatars.com/api/?name=P&background=3b82f6&color=fff")} /><span>PepsiCo</span></div> }, style: { borderRadius: "12px", fontWeight: "bold", border: "2px solid #3b82f6", background: "white", padding: "10px" } },
    { id: "apple", position: { x: 380, y: 220 }, data: { label: <div className="flex flex-col items-center"><img src="https://www.google.com/s2/favicons?domain=apple.com&sz=128" alt="Apple" className="w-10 h-10 mb-2 rounded-xl shadow-sm bg-white" onError={(e) => (e.currentTarget.src = "https://ui-avatars.com/api/?name=A&background=64748b&color=fff")} /><span>Apple</span></div> }, style: { borderRadius: "12px", fontWeight: "bold", border: "2px solid #64748b", background: "white", padding: "10px" } },
    { id: "ms", position: { x: 60, y: 360 }, data: { label: <div className="flex flex-col items-center"><img src="https://www.google.com/s2/favicons?domain=microsoft.com&sz=128" alt="Microsoft" className="w-10 h-10 mb-2 rounded-xl shadow-sm bg-white" onError={(e) => (e.currentTarget.src = "https://ui-avatars.com/api/?name=M&background=0ea5e9&color=fff")} /><span>Microsoft</span></div> }, style: { borderRadius: "12px", fontWeight: "bold", border: "2px solid #0ea5e9", background: "white", padding: "10px" } },
    { id: "amazon", position: { x: 300, y: 360 }, data: { label: <div className="flex flex-col items-center"><img src="https://www.google.com/s2/favicons?domain=amazon.com&sz=128" alt="Amazon" className="w-10 h-10 mb-2 rounded-xl shadow-sm bg-white" onError={(e) => (e.currentTarget.src = "https://ui-avatars.com/api/?name=A&background=f59e0b&color=fff")} /><span>Amazon</span></div> }, style: { borderRadius: "12px", fontWeight: "bold", border: "2px solid #f59e0b", background: "white", padding: "10px" } },
  ];

  const renderStage4 = () => {
    const companies = [
      { name: "Coca-Cola", logo: "https://www.google.com/s2/favicons?domain=coca-cola.com&sz=128", fallback: "https://ui-avatars.com/api/?name=C&background=ef4444&color=fff" },
      { name: "PepsiCo", logo: "https://www.google.com/s2/favicons?domain=pepsico.com&sz=128", fallback: "https://ui-avatars.com/api/?name=P&background=3b82f6&color=fff" },
      { name: "Apple", logo: "https://www.google.com/s2/favicons?domain=apple.com&sz=128", fallback: "https://ui-avatars.com/api/?name=A&background=64748b&color=fff" },
      { name: "Microsoft", logo: "https://www.google.com/s2/favicons?domain=microsoft.com&sz=128", fallback: "https://ui-avatars.com/api/?name=M&background=0ea5e9&color=fff" },
      { name: "Amazon", logo: "https://www.google.com/s2/favicons?domain=amazon.com&sz=128", fallback: "https://ui-avatars.com/api/?name=A&background=f59e0b&color=fff" }
    ];

    // Update edges based on selection
    const edges: Edge[] = fundShares.map((company) => {
      let targetId = "coca";
      if (company === "PepsiCo") targetId = "pepsi";
      if (company === "Apple") targetId = "apple";
      if (company === "Microsoft") targetId = "ms";
      if (company === "Amazon") targetId = "amazon";

      return { 
        id: `e-fund-${targetId}`, 
        source: "fund", 
        target: targetId, 
        animated: true, 
        style: { stroke: "#6366f1", strokeWidth: 3 } 
      };
    });

    const toggleShare = (company: string) => {
      setFundShares((prev) =>
        prev.includes(company) ? prev.filter((c) => c !== company) : [...prev, company]
      );
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <div className="inline-block bg-yellow-100 border border-yellow-200 text-yellow-800 px-4 py-1.5 rounded-full text-xs font-black uppercase mb-3 animate-pulse shadow-sm">
            🔥 Giai đoạn cốt lõi
          </div>
          <h2 className="text-2xl font-black text-indigo-700 uppercase tracking-wide">
            Biểu hiện mới của độc quyền
          </h2>
          <p className="text-slate-600 mt-2 font-medium">
            Tư bản sản xuất kết hợp tư bản ngân hàng tạo thành <span className="font-bold text-purple-600">Tư bản tài chính</span>.<br/>
            Dưới tư cách Quỹ đầu tư, hãy mua cổ phần của ít nhất 3 công ty.
          </p>
        </div>

        {!showNetwork ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
            <h3 className="font-bold text-slate-700 mb-6 text-center text-lg">Danh sách các Tập đoàn Xuyên quốc gia</h3>
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              {companies.map((company) => (
                <button
                  key={company.name}
                  onClick={() => toggleShare(company.name)}
                  className={`px-5 py-3 rounded-2xl font-bold transition-all border-2 cursor-pointer ${
                    fundShares.includes(company.name)
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20 scale-105"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={company.logo} alt={company.name} onError={(e) => (e.currentTarget.src = company.fallback)} className={`w-8 h-8 rounded-md bg-white p-1 shadow-sm ${fundShares.includes(company.name) ? 'opacity-90' : 'opacity-100'}`} />
                    <span>{company.name}</span>
                    {fundShares.includes(company.name) && <CheckCircle2 className="w-5 h-5 ml-1 text-emerald-300" />}
                  </div>
                </button>
              ))}
            </div>

            <button
              disabled={fundShares.length < 3}
              onClick={() => {
                setShowNetwork(true);
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              }}
              className={`w-full py-4 font-black rounded-xl flex items-center justify-center gap-2 transition-all ${
                fundShares.length < 3
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/30 cursor-pointer"
              }`}
            >
              <Network className="w-5 h-5" /> 
              {fundShares.length < 3 ? `Đã mua ${fundShares.length}/3 công ty` : "Zoom Out (Xem biểu đồ mạng lưới sở hữu)"}
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl"
          >
            <div className="h-64 sm:h-[400px] w-full bg-slate-50 border-b border-slate-200 relative">
              <ReactFlow
                nodes={initialNodes}
                edges={edges}
                fitView
                attributionPosition="bottom-right"
                preventScrolling={false}
              >
                <Background color="#cbd5e1" gap={20} />
              </ReactFlow>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-sm text-xs font-bold text-slate-600 z-10">
                Sơ đồ sở hữu chéo tư bản tài chính
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <div className="p-5 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl mb-6 shadow-inner">
                <p className="text-indigo-800 font-medium text-center italic">
                  "Trong chủ nghĩa tư bản hiện đại, các tập đoàn tài chính có thể nắm cổ phần khống chế ở nhiều doanh nghiệp khác nhau, kể cả những doanh nghiệp đang trực tiếp cạnh tranh với nhau (như Coca-Cola và PepsiCo)."
                </p>
              </div>
              <div className="text-center bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 p-5 rounded-xl text-white font-black tracking-wide mb-8 shadow-md">
                Tư bản tài chính và sự tập trung quyền lực kinh tế là biểu hiện mới của độc quyền.
              </div>
              
              <button
                onClick={() => {
                  setScore(score + 30);
                  nextStage();
                }}
                className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg"
              >
                Tới câu hỏi quyết định <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  // --- STAGE 5: Câu hỏi phản biện ---
  const renderStage5 = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-indigo-700 uppercase tracking-wide">
            Giai đoạn 5: Phản biện lý luận
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200">
          <div className="flex items-start gap-4 mb-8 bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
            <div className="p-3 bg-yellow-400 rounded-full shrink-0 shadow-sm">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 leading-relaxed font-outfit">
              "Nếu một quỹ đầu tư sở hữu cổ phần ở cả Coca-Cola và PepsiCo thì hai công ty có còn cạnh tranh với nhau không?"
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setStage5Answer("A")}
              disabled={stage5Answer !== null}
              className={`p-6 rounded-2xl font-black text-lg border-2 transition-all cursor-pointer ${
                stage5Answer === "A" 
                  ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md shadow-emerald-500/10"
                  : stage5Answer !== null
                    ? "bg-slate-50 border-slate-200 text-slate-400 opacity-50 cursor-not-allowed"
                    : "bg-white border-slate-200 hover:border-indigo-400 text-slate-700 hover:shadow-lg"
              }`}
            >
              A. Có, vẫn cạnh tranh
            </button>
            <button
              onClick={() => setStage5Answer("B")}
              disabled={stage5Answer !== null}
              className={`p-6 rounded-2xl font-black text-lg border-2 transition-all cursor-pointer ${
                stage5Answer === "B" 
                  ? "bg-rose-50 border-rose-500 text-rose-700 shadow-md shadow-rose-500/10"
                  : stage5Answer !== null
                    ? "bg-slate-50 border-slate-200 text-slate-400 opacity-50 cursor-not-allowed"
                    : "bg-white border-slate-200 hover:border-indigo-400 text-slate-700 hover:shadow-lg"
              }`}
            >
              B. Không, độc quyền thủ tiêu cạnh tranh
            </button>
          </div>

          <AnimatePresence>
            {stage5Answer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden"
              >
                {stage5Answer === "A" ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl mb-6 shadow-inner">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      <span className="font-black text-emerald-800 text-lg">Chính xác!</span>
                    </div>
                    <p className="text-emerald-900/80 font-medium leading-relaxed italic">
                      "Theo kinh tế chính trị Mác – Lênin, cạnh tranh không mất đi khi xuất hiện độc quyền. Độc quyền sinh ra từ cạnh tranh, nhưng độc quyền và cạnh tranh cùng tồn tại trong nền kinh tế thị trường, làm cho cạnh tranh trở nên gay gắt và có tính phá hoại lớn hơn."
                    </p>
                  </div>
                ) : (
                  <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl mb-6 shadow-inner">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-6 h-6 text-rose-600" />
                      <span className="font-black text-rose-800 text-lg">Bạn chọn sai rồi! (Đáp án đúng là A)</span>
                    </div>
                    <p className="text-rose-900/80 font-medium leading-relaxed italic">
                      "Theo Mác - Lênin, độc quyền không hề thủ tiêu cạnh tranh. Chúng cùng tồn tại song song, tạo ra các hình thức cạnh tranh mới (cạnh tranh giữa tổ chức độc quyền với doanh nghiệp ngoài độc quyền, và cạnh tranh ngay trong nội bộ tổ chức độc quyền)."
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (stage5Answer === "A") setScore(score + 20);
                    nextStage();
                    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
                  }}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-lg rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/30 cursor-pointer"
                >
                  Hoàn thành Game <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  // --- MÀN HÌNH TỔNG KẾT ---
  const renderSummary = () => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8 max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center p-4 bg-gradient-to-tr from-yellow-400 to-amber-500 rounded-full mb-6 shadow-xl shadow-yellow-500/20 animate-bounce">
            <DollarSign className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent uppercase tracking-wide mb-3 font-outfit">
            Hành Trình Tư Bản
          </h2>
          <div className="inline-block px-6 py-2 bg-slate-100 rounded-full border border-slate-200 font-bold text-slate-600">
            Tổng điểm kiến thức: <span className="text-indigo-600 text-xl font-black">{score} / 100</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-8">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-500" /> Tổng hợp Kiến thức Chương 4
            </h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4 w-28 text-center border-b border-slate-200">Giai đoạn</th>
                <th className="px-6 py-4 border-b border-slate-200">Lý luận Kinh tế Chính trị</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 font-medium">
              <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-5 text-center text-indigo-600 font-black group-hover:scale-110 transition-transform">1</td>
                <td className="px-6 py-5">
                  <span className="font-bold text-slate-800 block mb-1">Cạnh tranh tự do</span>
                  <span className="text-sm text-slate-500">Quy luật giá trị chi phối, tối đa hóa lợi nhuận khó khăn do nhiều đối thủ.</span>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-5 text-center text-indigo-600 font-black group-hover:scale-110 transition-transform">2</td>
                <td className="px-6 py-5">
                  <span className="font-bold text-slate-800 block mb-1">Tích tụ & Tập trung tư bản</span>
                  <span className="text-sm text-slate-500">Sự sáp nhập làm xuất hiện các tổ chức độc quyền khổng lồ.</span>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-5 text-center text-indigo-600 font-black group-hover:scale-110 transition-transform">3</td>
                <td className="px-6 py-5">
                  <span className="font-bold text-slate-800 block mb-1">Độc quyền</span>
                  <span className="text-sm text-slate-500">Chi phối giá cả độc quyền để thu lợi nhuận độc quyền cao.</span>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-5 text-center text-indigo-600 font-black group-hover:scale-110 transition-transform">4</td>
                <td className="px-6 py-5">
                  <span className="font-bold text-slate-800 block mb-1">Tư bản tài chính</span>
                  <span className="text-sm text-slate-500">Biểu hiện mới - Sở hữu chéo, thống trị nền kinh tế toàn cầu.</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-5 text-center text-indigo-600 font-black group-hover:scale-110 transition-transform">5</td>
                <td className="px-6 py-5">
                  <span className="font-bold text-slate-800 block mb-1">Mối quan hệ biện chứng</span>
                  <span className="text-sm text-slate-500">Độc quyền không thủ tiêu cạnh tranh, chúng cùng tồn tại song song.</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl text-center text-white shadow-2xl shadow-indigo-500/30 mb-8 border border-indigo-400">
          <Globe className="w-10 h-10 text-white/50 mx-auto mb-4" />
          <p className="text-xl font-bold leading-relaxed tracking-wide font-outfit">
            "Bạn vừa trải nghiệm quá trình hình thành và phát triển của độc quyền trong chủ nghĩa tư bản hiện đại."
          </p>
        </div>

        <button
          onClick={handleRestart}
          className="mx-auto flex items-center justify-center gap-2 px-10 py-5 bg-slate-900 hover:bg-slate-800 text-white font-black text-lg rounded-2xl transition-colors shadow-lg cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" /> Trải nghiệm lại
        </button>
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      {/* Progress Bar */}
      <div className="mb-12 max-w-2xl mx-auto">
        <div className="flex justify-between text-xs font-black text-slate-400 mb-3 px-1 uppercase tracking-widest">
          <span>Khởi nghiệp</span>
          <span>Tư bản tài chính</span>
        </div>
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${((stage - 1) / 5) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Stage Content */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {stage === 1 && <div key="stage1">{renderStage1()}</div>}
          {stage === 2 && <div key="stage2">{renderStage2()}</div>}
          {stage === 3 && <div key="stage3">{renderStage3()}</div>}
          {stage === 4 && <div key="stage4">{renderStage4()}</div>}
          {stage === 5 && <div key="stage5">{renderStage5()}</div>}
          {stage === 6 && <div key="stage6">{renderSummary()}</div>}
        </AnimatePresence>
      </div>
    </div>
  );
}
