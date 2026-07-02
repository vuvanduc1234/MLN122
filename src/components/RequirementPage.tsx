import { motion } from "framer-motion";
import {
  Network,
  Users,
  AlertTriangle,
  Lightbulb,
  Landmark,
  TrendingUp,
  Target,
  Layers,
  ArrowRight,
  ShieldAlert,
  Scale,
} from "lucide-react";

const RequirementPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 80 },
    },
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16 pt-8"
      >
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-6 shadow-inner border border-indigo-200">
          <Landmark className="w-10 h-10 text-indigo-600" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-indigo-800 via-purple-700 to-indigo-900 bg-clip-text text-transparent mb-4 leading-tight font-outfit uppercase tracking-tight">
          "BIỂU HIỆN MỚI" CỦA TƯ BẢN TÀI CHÍNH NGÀY NAY
        </h1>
        <p className="text-lg md:text-xl text-slate-600 font-bold max-w-3xl mx-auto italic">
          (Phân tích cơ chế "cổ phiếu khống chế" & "mạng lưới sở hữu chéo")
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {/* Section 1 & 2 Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Section 1 */}
          <motion.section variants={itemVariants} className="relative h-full flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-3xl -z-10 border border-blue-100 shadow-sm" />
            <div className="p-8 rounded-3xl flex-grow flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-500 rounded-xl shadow-md shadow-blue-500/20">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-black text-slate-800 uppercase">
                  1. "Biểu hiện mới" của tư bản tài chính
                </h2>
              </div>
              
              <ul className="space-y-4 flex-grow">
                <li className="flex gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <div className="mt-1"><Target className="w-5 h-5 text-blue-500" /></div>
                  <div>
                    <span className="font-bold text-slate-800">Truyền thống (V.I. Lênin, 1916):</span> 
                    <p className="text-slate-650 text-sm mt-1">Sự dung hợp giữa độc quyền ngân hàng & công nghiệp, tạo ra <b>tài phiệt</b> thống trị đời sống kinh tế - chính trị trong phạm vi quốc gia.</p>
                  </div>
                </li>
                <li className="flex gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <div className="mt-1"><Lightbulb className="w-5 h-5 text-indigo-500" /></div>
                  <div>
                    <span className="font-bold text-slate-800">Đương đại:</span> 
                    <p className="text-slate-650 text-sm mt-1">Chuyển mình thành các Tập đoàn quản lý tài sản toàn cầu (BlackRock, Vanguard, State Street - "Big Three").</p>
                  </div>
                </li>
                <li className="flex gap-3 bg-blue-50/50 p-4 rounded-xl shadow-sm border border-blue-100">
                  <div className="mt-1"><ArrowRight className="w-5 h-5 text-blue-600" /></div>
                  <div>
                    <span className="font-bold text-blue-800">Đặc điểm khác biệt:</span> 
                    <p className="text-blue-900/80 text-sm mt-1">Không trực tiếp sản xuất, không phải NH thương mại. Họ kiểm soát vốn của hàng triệu nhà đầu tư qua <b>quỹ chỉ số (Index Fund)</b> & <b>ETF</b>, chi phối xuyên quốc gia.</p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Section 2 */}
          <motion.section variants={itemVariants} className="relative h-full flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-50 to-pink-50/50 rounded-3xl -z-10 border border-purple-100 shadow-sm" />
            <div className="p-8 rounded-3xl flex-grow flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-purple-500 rounded-xl shadow-md shadow-purple-500/20">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-black text-slate-800 uppercase">
                  2. Cơ chế "Cổ phiếu khống chế"
                </h2>
              </div>
              
              <ul className="space-y-4 flex-grow">
                <li className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-purple-500">
                  <div className="font-bold text-slate-800 mb-1">Nguyên lý hoạt động</div>
                  <p className="text-slate-600 text-sm">Không cần mua 100% vốn. Chỉ cần tỷ lệ đủ áp đảo để biểu quyết. Do số đông cổ đông nhỏ lẻ thường phân tán và hiếm khi dự đại hội cổ đông.</p>
                </li>
                <li className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-pink-500">
                  <div className="font-bold text-slate-800 mb-1">Hệ thống hình tháp (Holding System)</div>
                  <p className="text-slate-600 text-sm">Công ty mẹ mua cổ phiếu khống chế công ty con, con khống chế cháu... Bằng vốn ban đầu nhỏ, giới tài phiệt có thể <b>thao túng khối tư bản gấp hàng trăm lần</b>.</p>
                </li>
                <li className="bg-purple-900 text-white p-4 rounded-xl shadow-md relative overflow-hidden">
                  <Users className="w-20 h-20 absolute right-[-10px] bottom-[-10px] opacity-10" />
                  <div className="font-bold text-purple-200 mb-1 relative z-10">Sự huyễn hoặc của "Dân chủ hóa cổ phiếu"</div>
                  <p className="text-purple-100 text-sm relative z-10">Bán cổ phiếu mệnh giá nhỏ chỉ để huy động vốn, không hề san sẻ quyền lực. Quyền lực thực sự vẫn nằm trong tay thiểu số, củng cố thêm nhờ "Chế độ ủy nhiệm" (Proxy Voting).</p>
                </li>
              </ul>
            </div>
          </motion.section>
        </div>

        {/* Section 3 */}
        <motion.section variants={itemVariants} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50/50 rounded-3xl -z-10 border border-emerald-100 shadow-sm" />
          <div className="p-8 md:p-10 rounded-3xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-emerald-500 rounded-xl shadow-md shadow-emerald-500/20">
                <Network className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 uppercase">
                3. "Mạng lưới sở hữu chéo" chi phối toàn cầu
              </h2>
            </div>

            {/* Part 1: Definition & Case Study */}
            <div className="grid md:grid-cols-12 gap-6 mb-6">
              <div className="md:col-span-5 flex flex-col gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 h-full">
                  <h3 className="font-bold text-emerald-700 text-lg mb-2">Sự dịch chuyển theo chiều ngang</h3>
                  <p className="text-slate-650 text-sm mb-4">
                    Biểu hiện đương đại cao nhất của "cổ phiếu khống chế" không chỉ ở tháp mẹ-con nội bộ, mà mở rộng thành mạng lưới sở hữu chéo chiều ngang (Common Ownership).
                  </p>
                  <div className="p-3 bg-emerald-50/50 rounded-lg text-emerald-800 text-sm border border-emerald-100 font-medium">
                    "Cùng một quỹ đầu tư có thể nắm cổ phần lớn tại nhiều công ty vốn là đối thủ cạnh tranh trực tiếp cùng ngành."
                  </div>
                </div>
              </div>

              {/* Case Study Highlight */}
              <div className="md:col-span-7 bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-center">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <AlertTriangle className="w-40 h-40 text-emerald-400" />
                </div>
                <h3 className="font-black text-emerald-400 text-lg mb-4 uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="w-5 h-5"/> Ví dụ thực tế: Thị trường nước giải khát
                </h3>
                <p className="text-slate-300 text-sm mb-4 relative z-10">Vanguard và BlackRock đồng thời là cổ đông lớn của cả Coca-Cola và PepsiCo – hai "kỳ phùng địch thủ".</p>
                
                <div className="grid grid-cols-2 gap-3 relative z-10 mb-4">
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <div className="font-bold text-white mb-1">Vanguard</div>
                    <div className="text-emerald-400 text-sm font-mono">8-10% PepsiCo<br/>7-8.5% Coca-Cola</div>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <div className="font-bold text-white mb-1">BlackRock</div>
                    <div className="text-emerald-400 text-sm font-mono">4-8.5% PepsiCo<br/>4-7% Coca-Cola</div>
                  </div>
                </div>
                <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30 text-sm relative z-10">
                  <span className="font-bold text-emerald-300">Hệ quả:</span> Cuộc chiến thương hiệu bên ngoài chỉ là bề nổi. Phía sau hậu trường, giới tài chính vẫn hưởng lợi trọn vẹn bất kể bên nào thắng!
                </div>
              </div>
            </div>

            {/* Part 2: Detail stats & controversy */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-teal-100">
                <h3 className="font-bold text-teal-700 mb-2 flex items-center gap-2"><Target className="w-4 h-4"/> Quy mô thống trị</h3>
                <p className="text-slate-650 text-sm">
                  Nhóm "Big Three" là cổ đông lớn nhất tại gần <b>90% công ty thuộc S&P 500</b>. 
                  Tổng cổ phần cộng dồn (19-29%) hoàn toàn đủ để định đoạt kết quả bỏ phiếu quan trọng: bầu HĐQT, lương thưởng lãnh đạo và nghị quyết chiến lược.
                </p>
              </div>

              <div className="bg-amber-50 p-5 rounded-2xl shadow-sm border border-amber-200">
                <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Dẫn chứng thời sự</h3>
                <p className="text-amber-900/80 text-sm">
                  Cuối 2024, Texas (Mỹ) khởi kiện Big Three thao túng ngành khai thác than nhờ mạng lưới sở hữu chung. Đầu 2026, Vanguard chấp nhận dàn xếp một phần. Chính phủ Mỹ cũng phải e ngại rủi ro thao túng nền kinh tế khổng lồ này.
                </p>
              </div>

              <div className="bg-rose-50 p-5 rounded-2xl shadow-sm border border-rose-200">
                <h3 className="font-bold text-rose-800 mb-2 flex items-center gap-2"><Scale className="w-4 h-4"/> Góc nhìn phản biện</h3>
                <p className="text-rose-900/80 text-sm">
                  Giới tài chính phương Tây bào chữa họ chỉ là <i>"nhà đầu tư thụ động"</i>. Nhưng quyền biểu quyết và khả năng gây sức ép thực chất là <b>chi phối gián tiếp</b> — phản ánh đúng bản chất "chế độ tham dự".
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Conclusion */}
        <motion.section variants={itemVariants}>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center gap-8">
            <div className="hidden md:flex p-6 bg-white/10 rounded-full backdrop-blur-md shrink-0">
              <AlertTriangle className="w-12 h-12 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-2xl font-black mb-4 text-yellow-300 uppercase tracking-widest flex items-center gap-3">
                <span className="md:hidden"><AlertTriangle className="w-6 h-6" /></span> KẾT LUẬN
              </h2>
              <div className="space-y-3 text-indigo-50 font-medium">
                <p className="text-lg">
                  Bản chất của tư bản tài chính (dung hợp NH-CN, chi phối bằng vốn khống chế) <b className="text-white">VẪN KHÔNG ĐỔI</b> qua hơn 100 năm như Lênin đã dự báo.
                </p>
                <p className="text-lg">
                  <b className="bg-white text-indigo-700 px-2 py-0.5 rounded mr-1">SỰ THAY ĐỔI DUY NHẤT:</b> Nằm ở hình thức biểu hiện. 
                  Dịch chuyển từ <i>tháp sở hữu nội bộ (đầu TK 20)</i> sang <i>mạng lưới sở hữu chéo xuyên quốc gia, đa ngành thông qua các quỹ chỉ số toàn cầu (đầu TK 21)</i>.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default RequirementPage;
