import { useState, useEffect } from 'react';
import { 
  Play, 
  Volume2, 
  VolumeX, 
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES } from './roles'; // مسیر اصلاح شده
import { Player, GameSettings, GameState, CategoryId } from './types';
import { sounds } from './utils/sounds';

// Helper to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const FUNNY_NAMES = [
  'پدرخوانده آرش', 'دکتر مریم', 'کارآگاه نیما', 'شهروند ساده سارا', 
  'قاضی مهران', 'ساقی بهروز', 'ناتو شایان', 'جان‌سخت مهسا', 
  'شاه‌دزد حمید', 'بقال فریبرز', 'روح سرگردان عاطفه', 'نینجا کامران',
  'زامبی علی', 'جادوگر زهرا', 'خلبان ترسو نازنین', 'فضول محله بابک'
];

export default function App() {
  const [gameState, setGameState] = useState<GameState>('WELCOME');
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'بازیکن ۱', score: 0, guesses: [] },
    { id: '2', name: 'بازیکن ۲', score: 0, guesses: [] },
    { id: '3', name: 'بازیکن ۳', score: 0, guesses: [] },
  ]);
  const [settings, setSettings] = useState<GameSettings>({
    timeLimit: 60,
    rounds: 2,
    selectedCategories: ['mafia', 'funny', 'jobs'],
  });
  
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // بقیه کدهای منطق بازی اینجا قرار می‌گیرند...
  
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center" dir="rtl">
      <h1 className="text-3xl font-bold mb-4">هدبند مرموز</h1>
      <button 
        onClick={() => setGameState('SETTINGS')}
        className="px-6 py-3 bg-red-600 rounded-xl font-bold"
      >
        شروع بازی
      </button>
    </div>
  );
}            >
              <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                  <SettingsIcon size={24} />
                </div>
                <div>
                  <h2 className="font-display text-2xl text-slate-100">تنظیمات رقابت و بازیکنان</h2>
                  <p className="text-xs text-slate-400">بازیکنان و دسته‌بندی کلمات خود را شخصی‌سازی کنید</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Right Column: Players list */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg text-amber-400 flex items-center gap-1.5">
                      <Users size={18} />
                      لیست بازیکنان ({players.length} نفر)
                    </h3>
                    <button
                      onClick={handleAddRandomName}
                      className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1 cursor-pointer font-bold border border-amber-500/20 bg-amber-500/5 px-2.5 py-1 rounded-lg transition-all"
                    >
                      <Sparkles size={12} />
                      نام تصادفی مافیایی
                    </button>
                  </div>

                  {/* Add Player Box */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddPlayer();
                        }}
                        maxLength={20}
                        placeholder="نام بازیکن جدید..."
                        className="w-full py-3 pr-10 pl-4 rounded-xl border border-slate-800 bg-slate-900/60 focus:bg-slate-900 focus:border-red-500 focus:outline-none transition-all text-sm placeholder:text-slate-500"
                      />
                      <User className="absolute right-3.5 top-3.5 text-slate-500" size={16} />
                    </div>
                    <button
                      onClick={handleAddPlayer}
                      className="px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-md shadow-red-950/20"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  {/* Players Scrollable list */}
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {players.map((player, index) => (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-900 bg-slate-900/40 hover:bg-slate-900/70 transition-all group"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-xs text-slate-400 font-bold">
                            {index + 1}
                          </span>
                          <span className="text-sm font-semibold text-slate-200">{player.name}</span>
                        </div>
                        {players.length > 2 && (
                          <button
                            onClick={() => handleRemovePlayer(player.id)}
                            className="p-1.5 text-slate-500 hover:text-red-500 transition-all cursor-pointer rounded-lg hover:bg-slate-950"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Left Column: Game Options & Categories */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Round & Time configuration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-slate-900 bg-slate-900/30 space-y-3">
                      <label className="text-xs text-slate-400 block font-semibold">زمان هر نوبت (ثانیه)</label>
                      <div className="flex items-center justify-between gap-1.5">
                        {[30, 60, 90].map((t) => (
                         
      <button
                            key={t}
                            onClick={() => {
                              setSettings({ ...settings, timeLimit: t });
                              playSfx('tick');
                            }}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                              settings.timeLimit === t
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 glow-gold'
                                : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-slate-200'
                            }`}
                          >
                            {t} ثانیه
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-900 bg-slate-900/30 space-y-3">
                      <label className="text-xs text-slate-400 block font-semibold">تعداد راندهای بازی</label>
                      <div className="flex items-center justify-between gap-1.5">
                        {[1, 2, 3, 5].map((r) => (
                          <button
                            key={r}
                            onClick={() => {
                              setSettings({ ...settings, rounds: r });
                              playSfx('tick');
                            }}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                              settings.rounds === r
                                ? 'bg-red-500/20 text-red-400 border-red-500/40 glow-red'
                                : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-slate-200'
                            }`}
                          >
                            {r} راند
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Categories Selector */}
                  <div className="space-y-3">
                    <h4 className="font-display text-base text-amber-400 flex items-center gap-1.5">
                      <Award size={18} />
                      دسته‌بندی کارت‌ها و کلمات (حداقل یک مورد)
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {CATEGORIES.map((cat) => {
                        const isSelected = settings.selectedCategories.includes(cat.id);
                        return (
                          <div
                            key={cat.id}
                            onClick={() => handleToggleCategory(cat.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                              isSelected
                                ? 'border-amber-500/40 bg-amber-500/5 glow-gold'
                                : 'border-slate-900 bg-slate-900/30 hover:bg-slate-900/50'
                            }`}
                          >
                            <span className="text-2xl mt-0.5">{cat.icon}</span>
                            <div className="space-y-0.5 flex-1 text-right">
                              <h5 className="text-xs font-bold text-slate-200 flex items-center justify-between">
                                <span>{cat.name}</span>
                                <span className="text-[10px] text-amber-500/80 bg-amber-500/10 px-1.5 py-0.5 rounded-md font-mono font-bold">
                                  {cat.words.length} کارت
                                </span>
                              </h5>
                              <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                                {cat.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>

              {/* Start Trigger */}
              <div className="flex justify-end pt-4 border-t border-slate-900">
                <button
                  id="btn-confirm-settings"
                  onClick={handleStartSetup}
                  disabled={players.length < 2}
                  className="w-full sm:w-auto py-4 px-10 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-slate-950 font-display text-lg rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-black"
                >
                  <Play fill="currentColor" size={18} className="text-slate-950" />
                  آماده‌سازی نبرد نقش‌ها
                </button>
              </div>
            </motion.div>
          )}

          {/* 3. PREPARATION SCREEN (Telling player to get ready) */}
          {gameState === 'PREPARATION' && (
            <motion.div
              key="preparation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-8 py-10 max-w-xl mx-auto px-4"
            >
              <div className="space-y-2">
                <div className="inline-block px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-black tracking-widest uppercase">
                  راند {currentRound} از {settings.rounds}
                </div>
                <h2 className="font-display text-4xl text-slate-100 mt-2">
                  نوبت <span className="text-amber-400">{players[currentPlayerIndex]?.name}</span>
                </h2>
                <div className="text-sm text-slate-400 flex items-center justify-center gap-1.5">
                  <span>امتیاز فعلی شما:</span>
                  <span className="font-bold text-slate-100 bg-slate-800 px-2 py-0.5 rounded-md font-mono">
                    {players[currentPlayerIndex]?.score} امتیاز
                  </span>
                </div>
              </div>

              {/* Forehead device holding illustration box */}
              <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 space-y-6 glow-gold relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-amber-500/5 rounded-full blur-2xl" />
                
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-amber-500/10 to-red-500/10 border border-amber-500/20 flex items-center justify-center mx-auto shadow-inner text-4xl animate-pulse">
                  📱
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-slate-200 text-base">راهنمای این مرحله:</h3>
                  <ul className="text-right text-xs text-slate-400 space-y-2.5 max-w-xs mx-auto list-disc list-inside">
                    <li>گوشی را طوری بگیرید که دیگران ببینند اما خودتان نبینید.</li>
                    <li>می‌توانید آن را روی پیشانی خود قرار دهید.</li>
                    <li>دوستانتان باید بدون گفتن نام کلمه، شما را راهنمایی کنند.</li>
                    <li>هرچقدر سریع‌تر حدس بزنید، کلمات بیشتری دریافت می‌کنید!</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  id="btn-ready"
                  onClick={handleStartTurnPrep}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-slate-950 font-display text-xl rounded-2xl shadow-xl shadow-red-950/20 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer font-black"
                >
                  <Play fill="currentColor" size={18} />
                  من آماده‌ام! (شروع شمارش معکوس)
                </button>

                <div className="text-xs text-slate-500">
                  پس از فشردن این دکمه، ۳ ثانیه فرصت دارید تا گوشی را روی پیشانی بگذارید.
                </div>
              </div>
            </motion.div>
          )}

          {/* 4. COUNTDOWN SCREEN */}
          {gameState === 'COUNTDOWN' && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="text-center space-y-6 py-20 flex flex-col items-center justify-center"
            >
              <div className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                آماده‌باش برای چالش
              </div>
              
              <div className="relative flex items-center justify-center">
                <div className="absolute w-44 h-44 rounded-full border-4 border-amber-500/10 animate-ping opacity-25" />
                <div className="absolute w-36 h-36 rounded-full border-2 border-red-500/20 animate-pulse" />
                <motion.div 
                  key={countdown}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-28 h-28 rounded-full bg-slate-900 border border-amber-500 flex items-center justify-center shadow-2xl glow-gold z-10"
                >
                  <span className="font-display text-6xl text-amber-400 text-glow-gold">
                    {countdown}
                  </span>
                </motion.div>
              </div>

              <p className="text-sm text-slate-400 animate-pulse mt-4">
                گوشی را روی پیشانی قرار دهید...
              </p>
            </motion.div>
          )}

          {/* 5. ACTIVE PLAYING GAME SCREEN */}
          {gameState === 'PLAYING' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-6 transition-colors duration-300 ${
                flashEffect === 'CORRECT' ? 'bg-green-950/90' : 
                flashEffect === 'SKIP' ? 'bg-red-950/90' : ''
              }`}
            >
              {/* Top Bar inside Fullscreen Active Game */}
              <div className="flex items-center justify-between w-full max-w-3xl mx-auto border-b border-slate-900 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-slate-900 text-xs text-slate-400 font-bold">
                    راند {currentRound}
                  </span>
                  <span className="text-sm font-bold text-amber-400">
                    نوبت: {players[currentPlayerIndex]?.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Flip Text Mode Button */}
                  <button
                    onClick={() => {
                      setIsFlipped(!isFlipped);
                      playSfx('tick');
                    }}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-all flex items-center gap-1.5 text-xs cursor-pointer"
                    title="چرخش ۱۸۰ درجه متن برای خوانایی آسان‌تر"
                  >
                    <FlipHorizontal size={14} />
                    <span className="hidden sm:inline">چرخش ۱۸۰ درجه</span>
                  </button>

                  <button
                    onClick={() => {
                      setSoundEnabled(!soundEnabled);
                      sounds.playTick();
                    }}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 transition-all cursor-pointer"
                  >
                    {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>
                </div>
              </div>

              {/* Central Card with Massive Word Display */}
              <div className="flex-1 flex flex-col items-center justify-center py-6 w-full max-w-3xl mx-auto">
                
                {/* Timer Countdown circle */}
                <div className="mb-6 flex flex-col items-center">
                  <div className={`relative w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all ${
                    timer <= 10 ? 'border-red-500 glow-red scale-110' : 'border-slate-800'
                  } bg-slate-900`}>
                    <Clock size={16} className={`absolute top-2.5 ${timer <= 10 ? 'text-red-500 animate-bounce' : 'text-slate-500'}`} />
                    <span className={`font-display text-2xl mt-3 ${timer <= 10 ? 'text-red-500 text-glow-red animate-pulse' : 'text-slate-200'}`}>
                      {timer}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">زمان باقی‌مانده</span>
                </div>

                {/* The Big Card */}
                <motion.div
                  key={currentWord}
                  initial={{ scale: 0.9, opacity: 0, rotateX: 45 }}
                  animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className={`w-full max-w-2xl min-h-[220px] rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-center p-8 text-center glow-gold relative overflow-hidden transition-all duration-300 ${
                    isFlipped ? 'rotate-180' : ''
                  }`}
                >
                  {/* Decorative background stripes */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.04)_0,transparent_70%)] pointer-events-none" />
                  
                  <div className="space-y-4">
                    <span className="text-[11px] font-black uppercase text-amber-500/70 tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      بقیه بازیکنان باید شما را راهنمایی کنند!
                    </span>
                    <h3 id="current-word" className="font-display text-5xl sm:text-6xl md:text-7xl text-amber-400 text-glow-gold tracking-wide leading-tight px-2">
                      {currentWord}
                    </h3>
                  </div>
                </motion.div>

                {/* Score counter during play */}
                <div className="mt-6 flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">تعداد حدس‌های درست این نوبت:</span>
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-mono font-black text-sm">
                    {turnScore} +
                  </span>
                </div>
              </div>

              {/* Bottom Large Tap Areas (Tap Buttons) */}
              <div className="w-full max-w-3xl mx-auto grid grid-cols-2 gap-4 pb-4">
                
                {/* Skip (Left Side) */}
                <button
                  id="btn-skip"
                  onClick={() => handleAction(false)}
                  className="py-5 sm:py-6 rounded-2xl bg-gradient-to-b from-red-950 to-red-900/60 hover:from-red-900 hover:to-red-800/80 border border-red-500/30 text-white font-display text-lg sm:text-xl shadow-lg shadow-red-950/20 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <div className="p-2 rounded-full bg-red-600/20 text-red-400">
                    <X size={24} />
                  </div>
                  <span>رد کردن / پاس</span>
                  <span className="text-[10px] text-red-400/80 font-sans font-medium">(بدون امتیاز)</span>
                </button>

                {/* Correct (Right Side) */}
                <button
                  id="btn-correct"
                  onClick={() => handleAction(true)}
                  className="py-5 sm:py-6 rounded-2xl bg-gradient-to-b from-green-950 to-green-900/60 hover:from-green-900 hover:to-green-800/80 border border-green-500/30 text-white font-display text-lg sm:text-xl shadow-lg shadow-green-950/20 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <div className="p-2 rounded-full bg-green-600/20 text-green-400 animate-pulse">
                    <Check size={24} />
                  </div>
                  <span>حدس درست!</span>
                  <span className="text-[10px] text-green-400/80 font-sans font-medium">(۱+ امتیاز)</span>
                </button>

              </div>

              {/* Tiny Emergency End button */}
              <div className="w-full text-center">
                <button
                  onClick={handleTimeUp}
                  className="text-[10px] text-slate-500 hover:text-red-400 underline transition-all cursor-pointer"
                >
                  پایان زودهنگام این نوبت
                </button>
              </div>
            </motion.div>
          )}

          {/* 6. TURN END SCREEN (Score review for this turn) */}
          {gameState === 'TURN_END' && (
            <motion.div
              key="turn-end"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6 py-6 max-w-xl mx-auto px-4"
            >
              <div className="text-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-4xl shadow-lg glow-gold animate-bounce">
                  🏆
                </div>
                <h2 className="font-display text-3xl text-slate-100">پایان وقت نوبت!</h2>
                <p className="text-slate-400 text-sm">
                  نوبت حدس کلمات <span className="text-amber-400 font-bold">{players[currentPlayerIndex]?.name}</span> به پایان رسید.
                </p>
              </div>

              {/* Scoring summary board */}
              <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/30 space-y-6 glow-gold">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400 font-semibold">نتیجه این راند:</span>
                  <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-slate-950 font-display text-base font-black shadow-md shadow-red-950/20">
                    {turnScore} حدس درست (+{turnScore} امتیاز)
                  </span>
                </div>

                <div className="border-t border-slate-900 pt-4 space-y-3">
                  <h4 className="text-xs text-slate-400 font-bold text-right">خلاصه کلمات این نوبت:</h4>
                  
                  {turnGuesses.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-500">
                      هیچ کلمه‌ای حدس زده نشد!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {turnGuesses.map((g, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-900 text-xs">
                          <span className="font-semibold text-slate-200">{g.word}</span>
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-bold ${
                            g.correct 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {g.correct ? (
                              <>
                                <Check size={12} />
                                درست
                              </>
                            ) : (
                              <>
                                <X size={12} />
                                رد شده
                              </>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="btn-next-player"
                  onClick={handleNextTurn}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-slate-950 font-display text-xl rounded-2xl shadow-xl shadow-red-950/20 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer font-black"
                >
                  <span>ثبت و نوبت بازیکن بعدی</span>
                  <ChevronLeft size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {/* 7. LEADERBOARD SCREEN (Final Results & Podiums) */}
          {gameState === 'LEADERBOARD' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-8 py-4 px-2"
            >
              <div className="text-center space-y-3">
                <div className="inline-block p-1 bg-amber-500/10 text-amber-400 rounded-full animate-bounce">
                  👑
                </div>
                <h2 className="font-display text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-500 to-red-600 text-glow-gold">
                  جدول مدال‌آوران و امتیازات پایانی
                </h2>
                <p className="text-slate-400 text-sm">رقابت با موفقیت به پایان رسید! برندگان مشخص شدند.</p>
              </div>

              {/* Elegant Podium */}
              {players.length >= 2 && (
                <div className="flex justify-center items-end gap-3 sm:gap-6 pt-10 pb-6 max-w-md mx-auto">
                  
                  {/* Second Place (Left in RTL, visually right) */}
                  {(() => {
                    const sorted = [...players].sort((a, b) => b.score - a.score);
                    const second = sorted[1];
                    if (!second) return null;
                    return (
                      <div className="flex flex-col items-center flex-1">
                        <div className="relative mb-2">
                          <div className="w-12 h-12 rounded-full border border-slate-400 bg-slate-900 flex items-center justify-center text-xl font-bold shadow-md">
                            🥈
                          </div>
                        </div>
                        <div className="w-full text-center px-1 py-2 bg-gradient-to-t from-slate-900 to-slate-900/60 rounded-t-xl border-t border-x border-slate-700 min-h-[80px] flex flex-col justify-end space-y-1">
                          <div className="text-xs font-black truncate text-slate-300">{second.name}</div>
                          <div className="text-sm font-display text-slate-200">{second.score} امتیاز</div>
                          <div className="text-[9px] text-slate-400">مقام دوم</div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* First Place (Center - Higher) */}
                  {(() => {
                    const sorted = [...players].sort((a, b) => b.score - a.score);
                    const first = sorted[0];
                    if (!first) return null;
                    return (
                      <div className="flex flex-col items-center flex-1 z-10">
                        <div className="relative mb-2">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl animate-pulse">👑</div>
                          <div className="w-16 h-16 rounded-full border border-amber-400 bg-slate-900 flex items-center justify-center text-3xl font-bold shadow-xl shadow-amber-950/40 glow-gold">
                            🥇
                          </div>
                        </div>
                        <div className="w-full text-center px-1 py-3 bg-gradient-to-t from-amber-500/15 via-slate-900 to-slate-900 rounded-t-2xl border-t-2 border-x border-amber-500/30 min-h-[110px] flex flex-col justify-end space-y-1.5 glow-gold">
                          <div className="text-sm font-black truncate text-amber-400 text-glow-gold">{first.name}</div>
                          <div className="text-base font-display text-amber-300">{first.score} امتیاز</div>
                          <div className="text-[10px] text-amber-500 font-bold">پدرخوانده حدس</div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Third Place */}
                  {(() => {
                    const sorted = [...players].sort((a, b) => b.score - a.score);
                    const third = sorted[2];
                    if (!third) return null;
                    return (
                      <div className="flex flex-col items-center flex-1">
                        <div className="relative mb-2">
                          <div className="w-10 h-10 rounded-full border border-orange-600/40 bg-slate-900 flex items-center justify-center text-lg font-bold shadow-md">
                            🥉
                          </div>
                        </div>
                        <div className="w-full text-center px-1 py-2 bg-gradient-to-t from-slate-900 to-slate-900/60 rounded-t-xl border-t border-x border-slate-800 min-h-[65px] flex flex-col justify-end space-y-1">
                          <div className="text-xs font-black truncate text-slate-400">{third.name}</div>
                          <div className="text-xs font-display text-slate-300">{third.score} امتیاز</div>
                          <div className="text-[9px] text-slate-500">مقام سوم</div>
                        </div>
                      </div>
                    );
                  })()}

                </div>
              )}

              {/* Detailed Rankings List */}
              <div className="p-4 sm:p-6 rounded-3xl border border-slate-900 bg-slate-900/20 backdrop-blur-sm space-y-3 max-w-2xl mx-auto">
                <h3 className="font-display text-lg text-slate-300 flex items-center gap-2 border-b border-slate-900 pb-3">
                  <Flame size={18} className="text-red-500" />
                  رده‌بندی کامل مافیایی
                </h3>

                <div className="space-y-2">
                  {[...players]
                    .sort((a, b) => b.score - a.score)
                    .map((player, index) => {
                      const titleData = getMafiaTitle(player.score);
                      return (
                        <div
                          key={player.id}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-slate-900 bg-slate-900/40 hover:bg-slate-900/70 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center text-xs font-bold text-slate-400">
                              {index + 1}#
                            </span>
                            <div>
                              <div className="text-sm font-black text-slate-100 flex items-center gap-1.5">
                                {player.name}
                                {index === 0 && <span className="text-xs">🏆</span>}
                              </div>
                              {/* Mafia Badged Titles */}
                              <div className={`text-[10px] px-2 py-0.5 rounded border ${titleData.color} bg-slate-950 mt-1 inline-flex items-center gap-1`}>
                                <span>{titleData.badge}</span>
                                <span className="font-medium">{titleData.title}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-display text-lg text-amber-400">{player.score}</span>
                            <span className="text-[10px] text-slate-500 mr-1">امتیاز</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Leaderboard Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto pt-4">
                <button
                  onClick={() => {
                    // Reset scores and prepare again
                    setPlayers(players.map(p => ({ ...p, score: 0, guesses: [] })));
                    setCurrentRound(1);
                    setCurrentPlayerIndex(0);
                    setGameState('PREPARATION');
                    playSfx('tick');
                  }}
                  className="w-full sm:flex-1 py-4 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-slate-950 font-display text-lg rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer font-black"
                >
                  <RotateCcw size={18} />
                  انتقام مافیایی (شروع مجدد)
                </button>
                
                <button
                  onClick={() => {
                    setGameState('SETTINGS');
                    playSfx('tick');
                  }}
                  className="w-full sm:w-auto py-4 px-6 border border-slate-800 bg-slate-900/40 hover:bg-slate-900 text-slate-300 rounded-2xl transition-all cursor-pointer text-sm font-semibold"
                >
                  تنظیمات و تغییر بازیکنان
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-5 text-center text-[11px] text-slate-500 border-t border-slate-900/60 bg-slate-950/20 backdrop-blur-md">
        طراحی شده برای دورهمی‌های خانوادگی و مافیایی • بدون نیاز به اینترنت
      </footer>

      {/* HOW TO PLAY MODAL / BOTTOM SHEET */}
      <AnimatePresence>
        {showHowToPlay && (
          <motion.div
            key="how-to-play-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowHowToPlay(false)}
          >
            <motion.div
              key="how-to-play-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-8 space-y-6 text-right glow-gold"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📖</span>
                  <h3 className="font-display text-xl text-amber-400">راهنمای کامل بازی «هدبند مرموز»</h3>
                </div>
                <button
                  onClick={() => {
                    setShowHowToPlay(false);
                    playSfx('skip');
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-red-500 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed overflow-y-auto max-h-[60vh] pr-1">
                <div className="space-y-1.5">
                  <h4 className="font-bold text-amber-500 flex items-center gap-1">
                    <span>۱.</span> ثبت‌نام بازیکنان و تنظیم راندها
                  </h4>
                  <p className="pr-4 text-slate-400 text-xs">
                    ابتدا نام بازیکنان شرکت‌کننده را ثبت کنید. می‌توانید تعداد راندها و مدت زمان هر نوبت را از بین زمان‌های ۳۰، ۶۰ یا ۹۰ ثانیه‌ای انتخاب کنید. سپس دسته‌بندی موضوعی کلمات خود را فعال کنید.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-amber-500 flex items-center gap-1">
                    <span>۲.</span> نوبتِ بازی و حالت هدبند
                  </h4>
                  <p className="pr-4 text-slate-400 text-xs">
                    وقتی نوبتِ بازیکنی شد، گوشی را به او بدهید. او باید بدون نگاه کردن به صفحه، گوشی را روی پیشانی خود یا طوری در دست بگیرد که بقیه کلمه روی صفحه را ببینند ولی خودش نبیند.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-amber-500 flex items-center gap-1">
                    <span>۳.</span> مسابقه حدس کلمات و راهنمایی
                  </h4>
                  <p className="pr-4 text-slate-400 text-xs">
                    پس از اتمام شمارش معکوس ۳ ثانیه‌ای، کلماتی گوناگون نمایش داده می‌شوند. بقیه بازیکنان باید با بازیگری، توصیف یا پانتومیم، بازیکن را راهنمایی کنند تا نقش خود را حدس بزند. 
                  </p>
                  <p className="pr-4 text-slate-400 text-xs font-semibold text-amber-400/90">
                    اگر بازیکن درست حدس زد، دکمه سبز «حدس درست» را فشار دهید تا امتیاز ثبت شود. در غیر این صورت، دکمه قرمز «رد کردن / پاس» را بفشارید تا کلمه بعدی بیاید. هدف، حدس زدن بیشترین تعداد کلمه در زمان داده‌شده است!
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-amber-500 flex items-center gap-1">
                    <span>۴.</span> امتیاز نهایی و مدال مافیایی
                  </h4>
                  <p className="pr-4 text-slate-400 text-xs">
                    پس از اتمام تمام نوبت‌ها و راندها، جدول برندگان با رده‌بندی زیبا نمایش داده می‌شود. بر اساس امتیازها، مدال‌هایی نظیر «پدرخوانده حدس کلمات» یا «شهروند ساده» دریافت خواهید کرد!
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setShowHowToPlay(false);
                    playSfx('tick');
                  }}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 rounded-xl transition-all cursor-pointer text-xs font-semibold"
                >
                  فهمیدم، بزن بریم بازی!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
