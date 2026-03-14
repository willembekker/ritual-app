use client
import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────
const C = {
  sand: "#E8E0D5", sandLight: "#F2EDE7", sandDark: "#C9BFB3",
  slate: "#3D4A4F", slateLight: "#5A6B72", slateDark: "#2A3438",
  warm: "#8B7355", warmLight: "#A08C6E",
  accent: "#C17B4E", accentLight: "#D4956A",
  green: "#5C7A5E", greenLight: "#7A9E7C",
  white: "#FAF8F5", offwhite: "#F5F0EB",
  kids: "#E8854A", kidsLight: "#F0A070",
  kidsBlue: "#5B8DB8", kidsPurple: "#9B7EC8",
};

// ─── HELPERS ──────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getMotivation(done, total) {
  if (total === 0) return "Add your first ritual below";
  if (done === 0) return "Ready when you are — let's build something good";
  if (done === total) return "Every ritual complete. You showed up today. ✦";
  if (done / total >= 0.6) return "You're on a roll — keep the momentum going";
  if (done === 1) return "One down. The hardest one is always the first";
  return `${total - done} ritual${total - done > 1 ? "s" : ""} left — you've got this`;
}

// ─── DATA ─────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "family", name: "Family & Chores", icon: "🏠", color: C.warm,
    description: "Build routines at home",
    habits: [
      { name: "Make your bed", icon: "🛏", location: "Bedroom" },
      { name: "Clear the dinner table", icon: "🍽", location: "Dining table" },
      { name: "Empty the dishwasher", icon: "✨", location: "Kitchen" },
      { name: "Take out the trash", icon: "🗑", location: "Kitchen door" },
      { name: "Feed the pet", icon: "🐾", location: "Kitchen" },
      { name: "Tidy your room", icon: "📦", location: "Bedroom" },
      { name: "Pack your school bag", icon: "🎒", location: "Bedroom" },
    ]
  },
  {
    id: "health", name: "Health & Body", icon: "💊", color: C.green,
    description: "Care for yourself daily",
    habits: [
      { name: "Morning medication", icon: "💊", location: "Bathroom shelf" },
      { name: "Evening medication", icon: "🌙", location: "Bedside table" },
      { name: "Drink a glass of water", icon: "💧", location: "Kitchen" },
      { name: "Take vitamins", icon: "🌿", location: "Kitchen" },
      { name: "Morning stretch", icon: "🧘", location: "Bedroom floor" },
      { name: "Weigh in", icon: "⚖️", location: "Bathroom" },
      { name: "Skincare routine", icon: "✨", location: "Bathroom mirror" },
    ]
  },
  {
    id: "screenfree", name: "Screen-Free Time", icon: "📵", color: C.slateLight,
    description: "Presence over phones",
    habits: [
      { name: "Phone down at dinner", icon: "🍴", location: "Dining table" },
      { name: "Phone down at bedtime", icon: "🌙", location: "Bedside table" },
      { name: "Homework focus mode", icon: "📚", location: "Desk" },
      { name: "Family screen-free hour", icon: "👨‍👩‍👧", location: "Living room" },
      { name: "Morning phone-free time", icon: "☀️", location: "Kitchen" },
    ]
  },
  {
    id: "morning", name: "Morning Routine", icon: "☀️", color: C.accent,
    description: "Own your morning",
    habits: [
      { name: "Wake up on time", icon: "⏰", location: "Bedside table" },
      { name: "Make coffee / breakfast", icon: "☕", location: "Kitchen" },
      { name: "Brush teeth", icon: "🦷", location: "Bathroom" },
      { name: "Exercise or movement", icon: "🏃", location: "Home entrance" },
      { name: "Journal or gratitude", icon: "📓", location: "Desk" },
      { name: "Review daily priorities", icon: "📋", location: "Desk" },
      { name: "No phone 30 minutes", icon: "📵", location: "Bedroom" },
    ]
  },
  {
    id: "learning", name: "Learning & Growth", icon: "📖", color: C.warm,
    description: "Keep growing every day",
    habits: [
      { name: "Read for 20 minutes", icon: "📖", location: "Armchair / Desk" },
      { name: "Practice an instrument", icon: "🎸", location: "Living room" },
      { name: "Language learning", icon: "🌍", location: "Desk" },
      { name: "Study block", icon: "📚", location: "Desk" },
      { name: "Educational podcast", icon: "🎧", location: "Anywhere" },
      { name: "Flashcard review", icon: "🃏", location: "Desk" },
    ]
  },
  {
    id: "mindfulness", name: "Mindfulness", icon: "🧘", color: C.slateLight,
    description: "Quiet the noise",
    habits: [
      { name: "Meditate", icon: "🧘", location: "Bedroom" },
      { name: "Gratitude journaling", icon: "📓", location: "Desk" },
      { name: "Evening wind-down", icon: "🌙", location: "Bedside table" },
      { name: "Breathing exercise", icon: "🌬", location: "Anywhere" },
      { name: "Digital detox hour", icon: "📵", location: "Living room" },
      { name: "Pray or reflect", icon: "🙏", location: "Anywhere" },
    ]
  },
  {
    id: "fitness", name: "Fitness", icon: "🏋️", color: C.green,
    description: "Move your body",
    habits: [
      { name: "Morning workout", icon: "💪", location: "Gym bag / Door" },
      { name: "Evening walk", icon: "🚶", location: "Front door" },
      { name: "Stretching routine", icon: "🤸", location: "Living room" },
      { name: "Log water intake", icon: "💧", location: "Kitchen" },
      { name: "Meal prep", icon: "🥗", location: "Kitchen" },
      { name: "Post-workout recovery", icon: "🛁", location: "Bathroom" },
    ]
  },
  {
    id: "kids", name: "Kids Special", icon: "⭐", color: C.kids,
    description: "Made for little champions", isKids: true,
    habits: [
      { name: "Homework done", icon: "📚", location: "Desk" },
      { name: "Reading time", icon: "📖", location: "Bedroom" },
      { name: "Practice instrument", icon: "🎵", location: "Living room" },
      { name: "Help with dinner", icon: "🍳", location: "Kitchen" },
      { name: "Be kind moment", icon: "💛", location: "Anywhere", parentVerified: true },
      { name: "Screen-free afternoon", icon: "🌳", location: "Living room" },
      { name: "Outdoor play", icon: "⚽", location: "Back door" },
    ]
  },
];

const INITIAL_HABITS = [
  { id: 1, name: "Morning Medication", icon: "💊", category: "Health & Body", categoryId: "health", streak: 12, taps: 0, target: 1, color: C.green, location: "Bathroom shelf", isKid: false },
  { id: 2, name: "Make your bed", icon: "🛏", category: "Family & Chores", categoryId: "family", streak: 7, taps: 0, target: 1, color: C.warm, location: "Bedroom", isKid: false },
  { id: 3, name: "Drink a glass of water", icon: "💧", category: "Health & Body", categoryId: "health", streak: 4, taps: 0, target: 8, color: C.green, location: "Kitchen", isKid: false },
  { id: 4, name: "Evening walk", icon: "🚶", category: "Fitness", categoryId: "fitness", streak: 3, taps: 0, target: 1, color: C.accent, location: "Front door", isKid: false },
  { id: 5, name: "Read for 20 minutes", icon: "📖", category: "Learning & Growth", categoryId: "learning", streak: 9, taps: 0, target: 1, color: C.warm, location: "Armchair / Desk", isKid: false },
];

const WEEK_HISTORY = [65, 80, 100, 50, null, null, null]; // Mon–Sun, null = future

const INITIAL_FAMILY = [
  { id: 1, name: "You", avatar: "W", points: 1240, streak: 12, color: C.accent, completedToday: 2, totalToday: 5, isKid: false },
  { id: 2, name: "Sarah", avatar: "S", points: 980, streak: 8, color: C.green, completedToday: 3, totalToday: 4, isKid: false },
  { id: 3, name: "Emma", avatar: "E", points: 640, streak: 5, color: C.kids, completedToday: 1, totalToday: 4, isKid: true },
  { id: 4, name: "Liam", avatar: "L", points: 420, streak: 3, color: C.kidsBlue, completedToday: 0, totalToday: 3, isKid: true },
];
const MEMBER_COLORS = [C.accent, C.green, C.warm, C.kids, C.kidsBlue, C.slateLight, C.kidsPurple, C.warmLight];

const INITIAL_REWARDS = [
  { id: 1, name: "30 min extra screen time", points: 500, icon: "📱", who: "Emma", color: C.kids },
  { id: 2, name: "Choose dinner", points: 750, icon: "🍕", who: "Liam", color: C.accent },
  { id: 3, name: "Family movie night", points: 2000, icon: "🎬", who: "All", color: C.green },
];

// ─── COMPLETION FLASH ─────────────────────────────────────────────
function CompletionFlash({ habit, onDone, onUndo }) {
  const [countdown, setCountdown] = useState(10);
  const [undone, setUndone] = useState(false);
  const isKid = habit?.isKid;
  const isMulti = habit?.target > 1;

  useEffect(() => {
    if (undone) return;
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(interval); onDone(); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [undone]);

  const handleUndo = () => {
    setUndone(true);
    onUndo();
    onDone();
  };

  const newTaps = (habit?.taps || 0);
  const target = habit?.target || 1;
  const justCompleted = newTaps >= target;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: isKid
        ? `linear-gradient(135deg, ${C.kids}, ${C.kidsLight})`
        : `linear-gradient(135deg, ${C.slateDark}, ${C.slate})`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16,
      animation: "flashIn 0.3s ease",
    }}>
      <div style={{ fontSize: 72, animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
        {isKid ? "🌟" : justCompleted ? "✦" : "◈"}
      </div>
      <div style={{
        fontSize: isKid ? 32 : 28, fontWeight: 700, color: C.white,
        fontFamily: "'Cormorant Garamond', serif",
        textAlign: "center", padding: "0 40px", lineHeight: 1.2,
      }}>
        {isKid ? "Amazing work!" : justCompleted ? "Ritual complete" : "Tap logged"}
      </div>
      <div style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", textAlign: "center", padding: "0 40px" }}>
        {habit?.name}
      </div>
      {isMulti && (
        <div style={{
          padding: "8px 20px", borderRadius: 20,
          background: "rgba(255,255,255,0.15)",
          fontSize: 14, color: C.white, fontWeight: 600,
        }}>
          {newTaps} / {target} today
        </div>
      )}
      {justCompleted && habit?.streak > 0 && (
        <div style={{
          padding: "10px 24px", borderRadius: 30,
          background: "rgba(255,255,255,0.15)",
          fontSize: 14, color: C.white, fontWeight: 600,
        }}>
          🔥 {habit.streak + 1} day streak
        </div>
      )}
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>+10 points</div>

      {/* Undo window */}
      <button onClick={handleUndo} style={{
        position: "absolute", bottom: 48,
        background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: 20, padding: "10px 24px", cursor: "pointer",
        color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontSize: 15 }}>↩</span>
        Undo tap · {countdown}s
      </button>
    </div>
  );
}

// ─── HABIT CARD ───────────────────────────────────────────────────
function HabitCard({ habit, onComplete, onUndo, isKidView }) {
  const [expanded, setExpanded] = useState(false);
  const [showDigital, setShowDigital] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimer = useRef(null);
  const holdInterval = useRef(null);

  const handleHoldStart = () => {
    holdInterval.current = setInterval(() => {
      setHoldProgress(p => {
        if (p >= 100) {
          clearInterval(holdInterval.current);
          onComplete(habit.id);
          setExpanded(false);
          setShowDigital(false);
          setHoldProgress(0);
          return 100;
        }
        return p + 4;
      });
    }, 40);
  };

  const handleHoldEnd = () => {
    clearInterval(holdInterval.current);
    setHoldProgress(0);
  };

  useEffect(() => () => { clearInterval(holdTimer.current); clearInterval(holdInterval.current); }, []);

  const taps = habit.taps || 0;
  const target = habit.target || 1;
  const completed = taps >= target;
  const isMulti = target > 1;
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [longPressProgress, setLongPressProgress] = useState(0);
  const longInterval = useRef(null);

  const startLongPress = () => {
    if (!completed) return;
    longInterval.current = setInterval(() => {
      setLongPressProgress(p => {
        if (p >= 100) {
          clearInterval(longInterval.current);
          onUndo(habit.id);
          setLongPressProgress(0);
          return 100;
        }
        return p + 5;
      });
    }, 40);
  };

  const endLongPress = () => {
    clearInterval(longInterval.current);
    setLongPressProgress(0);
  };

  if (completed && !isMulti) return (
    <div
      onMouseDown={startLongPress} onMouseUp={endLongPress}
      onTouchStart={startLongPress} onTouchEnd={endLongPress}
      style={{
        background: C.white, borderRadius: 20, padding: 18,
        boxShadow: `0 4px 20px ${habit.color}18`,
        border: `1px solid ${habit.color}30`,
        position: "relative", overflow: "hidden", cursor: "pointer", userSelect: "none",
      }}>
      {longPressProgress > 0 && (
        <div style={{
          position: "absolute", inset: 0, background: `${habit.color}12`,
          width: `${longPressProgress}%`, transition: "width 0.04s linear", zIndex: 0,
        }} />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 1 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 13, flexShrink: 0,
          background: `linear-gradient(135deg, ${habit.color}, ${habit.color}CC)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, color: C.white, boxShadow: `0 4px 10px ${habit.color}35`,
        }}>✓</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.slate }}>{habit.name}</div>
          <div style={{ fontSize: 11, color: C.slateLight, marginTop: 1 }}>
            Done · 🔥 {habit.streak + 1} day streak · +10 pts
          </div>
        </div>
        {longPressProgress > 0 && (
          <div style={{ fontSize: 10, color: C.slateLight }}>Undoing…</div>
        )}
        {longPressProgress === 0 && (
          <div style={{ fontSize: 10, color: `${C.slateLight}60`, textAlign: "right", lineHeight: 1.4 }}>
            Hold to<br />undo
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{
      background: isKidView ? `linear-gradient(135deg, ${habit.color}10, ${C.white})` : C.white,
      borderRadius: 20,
      border: isKidView ? `1.5px solid ${habit.color}30` : "1px solid rgba(0,0,0,0.05)",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      overflow: "hidden",
    }}>
      {/* Main row */}
      <div style={{ padding: 18 }} onClick={() => !expanded && setExpanded(true)}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 13, flexShrink: 0,
            background: `${habit.color}15`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>{habit.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.slate }}>{habit.name}</div>
            <div style={{ fontSize: 11, color: C.slateLight, marginTop: 1 }}>
              {habit.location ? `Tile at: ${habit.location}` : habit.category} · 🔥 {habit.streak}
            </div>
            {isMulti && taps > 0 && (
              <div style={{ marginTop: 4 }}>
                <div style={{ height: 3, background: C.sandLight, borderRadius: 2, marginBottom: 2 }}>
                  <div style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${habit.color}, ${habit.color}CC)`, width: `${(taps/target)*100}%`, transition: "width 0.4s ease" }} />
                </div>
                <div style={{ fontSize: 10, color: habit.color, fontWeight: 600 }}>{taps} of {target} today</div>
              </div>
            )}
          </div>
          <div style={{
            fontSize: 11, color: C.accent, fontWeight: 600,
            padding: "4px 10px", borderRadius: 20, background: `${C.accent}12`,
          }}>{isMulti ? `${taps}/${target}` : "Tap tile"}</div>
        </div>
      </div>

      {/* Expanded tap area */}
      {expanded && (
        <div style={{ padding: "0 18px 20px", borderTop: `1px solid ${C.sandLight}`, paddingTop: 16 }}>
          <div style={{ fontSize: 12, color: C.slateLight, marginBottom: 14, lineHeight: 1.5 }}>
            Go to your tile{habit.location ? ` at your ${habit.location}` : ""} and tap your phone to it to complete this ritual.
          </div>

          {/* Simulated tile — prominent */}
          <div style={{
            background: `linear-gradient(135deg, ${C.slateDark}, ${C.slate})`,
            borderRadius: 20, padding: "20px 20px 16px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
          }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 2, textTransform: "uppercase" }}>Your Ritual tile</div>
            <div style={{ fontSize: 36 }}>{habit.icon}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", textAlign: "center", lineHeight: 1.4 }}>
              Hold your phone to the tile<br />at your <span style={{ color: C.accentLight, fontWeight: 600 }}>{habit.location || "tile location"}</span>
            </div>
          </div>

          {/* Digital fallback — intentionally small and buried */}
          {!showDigital ? (
            <button onClick={() => setShowDigital(true)} style={{
              marginTop: 14, background: "none", border: "none",
              fontSize: 10, color: `${C.slateLight}70`, cursor: "pointer",
              display: "block", width: "100%", textAlign: "center",
              letterSpacing: 0.5, textDecoration: "underline dotted",
              padding: "4px 0",
            }}>
              Don't have your tile with you?
            </button>
          ) : (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, color: `${C.slateLight}80`, textAlign: "center", marginBottom: 8, lineHeight: 1.5 }}>
                The physical tile is the whole point of Ritual.<br />
                <span style={{ color: C.accent }}>We recommend going to your tile.</span>
              </div>
              <div
                onMouseDown={handleHoldStart} onMouseUp={handleHoldEnd}
                onTouchStart={handleHoldStart} onTouchEnd={handleHoldEnd}
                style={{
                  padding: "11px", borderRadius: 12, border: `1.5px solid ${C.sandDark}`,
                  background: C.offwhite, cursor: "pointer", textAlign: "center", userSelect: "none",
                  position: "relative", overflow: "hidden",
                }}
              >
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: `${holdProgress}%`,
                  background: `${C.accent}20`, transition: "width 0.04s linear",
                }} />
                <div style={{ fontSize: 11, color: C.slateLight, position: "relative" }}>
                  {holdProgress > 0 ? `Hold… ${Math.round(holdProgress)}%` : "Hold to manually complete"}
                </div>
              </div>
            </div>
          )}

          <button onClick={() => { setExpanded(false); setShowDigital(false); setHoldProgress(0); }} style={{
            marginTop: 10, background: "none", border: "none",
            fontSize: 12, color: C.slateLight, cursor: "pointer",
            display: "block", width: "100%", textAlign: "center",
          }}>Cancel</button>
        </div>
      )}
    </div>
  );
}

// ─── TODAY SCREEN ─────────────────────────────────────────────────
function TodayScreen({ habits, weekData, onComplete, onUndo, flashHabit, onFlashDone, onFlashUndo, isKidView }) {
  const done = habits.filter(h => (h.taps||0) >= (h.target||1)).length;
  const total = habits.length;
  const todayPct = total > 0 ? Math.round((done / total) * 100) : 0;
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const displayWeek = weekData.map((v, i) => i === todayIndex ? todayPct : v);
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <>
      {flashHabit && <CompletionFlash habit={flashHabit} onDone={onFlashDone} onUndo={() => onFlashUndo(flashHabit?.id)} />}
      <div style={{ padding: "0 20px 110px" }}>

        {/* Hero */}
        <div style={{
          background: isKidView
            ? `linear-gradient(135deg, ${C.kids} 0%, ${C.kidsLight} 100%)`
            : `linear-gradient(135deg, ${C.slateDark} 0%, ${C.slate} 100%)`,
          borderRadius: 24, padding: 24, marginBottom: 16, position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.06)", zIndex: 0 }} />
          <div style={{ position: "absolute", bottom: -20, left: 50, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.04)", zIndex: 0 }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, position: "relative", zIndex: 1 }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 4 }}>
                Today's Progress
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 52, fontWeight: 700, color: C.white, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>{done}</span>
                <span style={{ fontSize: 20, color: "rgba(255,255,255,0.4)" }}>/ {total}</span>
              </div>
            </div>
            {maxStreak > 0 && (
              <div style={{
                padding: "8px 14px", borderRadius: 20,
                background: "rgba(255,255,255,0.12)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 20 }}>🔥</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.white }}>{maxStreak}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 1 }}>BEST STREAK</div>
              </div>
            )}
          </div>

          <div style={{ height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 3, marginBottom: 10 }}>
            <div style={{
              height: "100%", borderRadius: 3,
              background: isKidView ? C.white : `linear-gradient(90deg, ${C.accent}, ${C.accentLight})`,
              width: `${(done / Math.max(total, 1)) * 100}%`,
              transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)",
            }} />
          </div>

          <div style={{
            fontSize: 13, color: "rgba(255,255,255,0.7)",
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
          }}>
            {getMotivation(done, total)}
          </div>
        </div>

        {/* Week chart — interactive */}
        <div style={{ background: C.white, borderRadius: 20, padding: 18, marginBottom: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.slate, letterSpacing: 0.5 }}>This Week</div>
            <div style={{ fontSize: 11, color: C.slateLight }}>{todayPct}% today</div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
            {displayWeek.map((v, i) => {
              const isToday = i === todayIndex;
              const isFuture = v === null;
              const pct = v ?? 0;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                  <div style={{ width: "100%", position: "relative", height: 50, display: "flex", alignItems: "flex-end" }}>
                    <div style={{
                      width: "100%", borderRadius: 4, minHeight: 4,
                      height: `${Math.max(pct * 0.5, 4)}px`,
                      background: isFuture ? C.sandLight
                        : isToday
                        ? `linear-gradient(180deg, ${C.accent}, ${C.accentLight})`
                        : `${C.slate}55`,
                      transition: "height 0.6s cubic-bezier(0.34,1.56,0.64,1)",
                      boxShadow: isToday ? `0 4px 12px ${C.accent}40` : "none",
                    }} />
                    {isToday && pct > 0 && (
                      <div style={{
                        position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)",
                        fontSize: 9, color: C.accent, fontWeight: 700, whiteSpace: "nowrap",
                      }}>{pct}%</div>
                    )}
                  </div>
                  <div style={{
                    fontSize: 9, fontWeight: isToday ? 700 : 400,
                    color: isToday ? C.accent : isFuture ? C.sandDark : C.slateLight,
                  }}>{dayLabels[i]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Habit list or empty state */}
        {total === 0 ? (
          <div style={{
            background: C.white, borderRadius: 24, padding: 36,
            textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>◈</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.slate, fontFamily: "'Cormorant Garamond', serif", marginBottom: 8 }}>
              Your rituals live here
            </div>
            <div style={{ fontSize: 13, color: C.slateLight, lineHeight: 1.6, marginBottom: 24 }}>
              Every great habit starts with one decision.<br />Choose your first ritual below.
            </div>
            <div style={{
              padding: "12px 24px", borderRadius: 30,
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
              color: C.white, fontSize: 14, fontWeight: 700,
              display: "inline-block", cursor: "pointer",
              boxShadow: `0 6px 20px ${C.accent}40`,
            }}>Add your first ritual →</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.slate, marginBottom: 10, letterSpacing: 0.5 }}>
              Today's Rituals
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {habits.map(h => (
                <HabitCard key={h.id} habit={h} onComplete={onComplete} onUndo={onUndo} isKidView={isKidView} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── FAMILY SCREEN ────────────────────────────────────────────────────────────
function FamilyScreen({ members, setMembers }) {
  const [view, setView] = useState("list"); // list | edit | add
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", isKid: false, colorIdx: 0 });
  const [nudged, setNudged] = useState({});

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: `1.5px solid ${C.sandDark}`, background: C.white,
    fontSize: 14, color: C.slate, outline: "none",
    fontFamily: "'DM Sans', sans-serif",
  };

  const handleNudge = (id) => {
    setNudged(n => ({ ...n, [id]: true }));
    setTimeout(() => setNudged(n => ({ ...n, [id]: false })), 3000);
  };

  const startAdd = () => {
    setEditing(null);
    setForm({ name: "", isKid: false, colorIdx: members.length % MEMBER_COLORS.length });
    setView("add");
  };

  const startEdit = (m) => {
    setEditing(m);
    setForm({ name: m.name, isKid: m.isKid, colorIdx: MEMBER_COLORS.indexOf(m.color) >= 0 ? MEMBER_COLORS.indexOf(m.color) : 0 });
    setView("add");
  };

  const saveMember = () => {
    if (!form.name.trim()) return;
    const avatar = form.name.trim()[0].toUpperCase();
    const color = MEMBER_COLORS[form.colorIdx] || C.accent;
    if (editing) {
      setMembers(ms => ms.map(m => m.id === editing.id ? { ...m, name: form.name.trim(), avatar, isKid: form.isKid, color } : m));
    } else {
      setMembers(ms => [...ms, { id: Date.now(), name: form.name.trim(), avatar, points: 0, streak: 0, color, completedToday: 0, totalToday: 0, isKid: form.isKid }]);
    }
    setView("list");
  };

  const deleteMember = (id) => setMembers(ms => ms.filter(m => m.id !== id));

  if (view === "add") return (
    <div style={{ padding: "0 20px 110px" }}>
      <button onClick={() => setView("list")} style={{ background: "none", border: "none", cursor: "pointer", color: C.slateLight, fontSize: 13, marginBottom: 20 }}>← Back</button>
      <div style={{ fontSize: 16, fontWeight: 600, color: C.slate, marginBottom: 24 }}>{editing ? "Edit Member" : "Add Family Member"}</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.slateLight, marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>Name</div>
          <input style={inputStyle} placeholder="e.g. Emma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.slateLight, marginBottom: 10, letterSpacing: 0.5, textTransform: "uppercase" }}>Colour</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {MEMBER_COLORS.map((col, i) => (
              <div key={i} onClick={() => setForm(f => ({ ...f, colorIdx: i }))} style={{
                width: 34, height: 34, borderRadius: "50%", background: col, cursor: "pointer",
                border: form.colorIdx === i ? `3px solid ${C.slate}` : "3px solid transparent",
                boxShadow: form.colorIdx === i ? `0 0 0 2px ${C.white}, 0 0 0 4px ${col}` : "none",
                transition: "all 0.2s ease",
              }} />
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.slateLight, marginBottom: 10, letterSpacing: 0.5, textTransform: "uppercase" }}>Account type</div>
          <div style={{ display: "flex", gap: 10 }}>
            {[{ label: "Adult", val: false }, { label: "Kid ⭐", val: true }].map(opt => (
              <div key={String(opt.val)} onClick={() => setForm(f => ({ ...f, isKid: opt.val }))} style={{
                flex: 1, padding: "12px", borderRadius: 14, textAlign: "center",
                cursor: "pointer", fontSize: 14, fontWeight: 600,
                background: form.isKid === opt.val ? `${MEMBER_COLORS[form.colorIdx]}20` : C.offwhite,
                border: form.isKid === opt.val ? `2px solid ${MEMBER_COLORS[form.colorIdx]}` : `2px solid transparent`,
                color: form.isKid === opt.val ? C.slate : C.slateLight,
                transition: "all 0.2s ease",
              }}>{opt.label}</div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div style={{ background: C.offwhite, borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 46, height: 46, borderRadius: "50%",
            background: `linear-gradient(135deg, ${MEMBER_COLORS[form.colorIdx]}, ${MEMBER_COLORS[form.colorIdx]}CC)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700, color: C.white, flexShrink: 0,
          }}>{form.name ? form.name[0].toUpperCase() : "?"}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.slate }}>{form.name || "Name preview"}</div>
            <div style={{ fontSize: 12, color: C.slateLight }}>{form.isKid ? "Kid account ⭐" : "Adult account"}</div>
          </div>
        </div>

        <button onClick={saveMember} style={{
          padding: "14px", borderRadius: 16, border: "none",
          background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
          color: C.white, fontSize: 15, fontWeight: 700, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", boxShadow: `0 6px 20px ${C.accent}40`,
        }}>{editing ? "Save Changes" : "Add Member"}</button>

        {editing && editing.id !== 1 && (
          <button onClick={() => { deleteMember(editing.id); setView("list"); }} style={{
            padding: "12px", borderRadius: 16, border: `1.5px solid #C0504D30`,
            background: "#C0504D10", color: "#C0504D", fontSize: 14,
            fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>Remove {editing.name}</button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ padding: "0 20px 110px" }}>
      <div style={{
        background: `linear-gradient(135deg, ${C.warm}, ${C.accent})`,
        borderRadius: 24, padding: 24, marginBottom: 16,
      }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 6 }}>Family Ritual</div>
        <div style={{ fontSize: 44, fontWeight: 700, color: C.white, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>
          {members.reduce((a, m) => a + m.points, 0).toLocaleString()}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>combined points this month</div>
      </div>

      {members.map((m) => {
        const incomplete = m.totalToday - m.completedToday;
        const isNudged = nudged[m.id];
        return (
          <div key={m.id} style={{
            background: m.isKid ? `linear-gradient(135deg, ${m.color}10, ${C.white})` : C.white,
            borderRadius: 20, padding: 18, marginBottom: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            border: m.isKid ? `1px solid ${m.color}25` : "1px solid rgba(0,0,0,0.05)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 46, height: 46, borderRadius: "50%",
                background: `linear-gradient(135deg, ${m.color}, ${m.color}CC)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17, fontWeight: 700, color: C.white,
                boxShadow: `0 4px 12px ${m.color}40`, flexShrink: 0,
              }}>{m.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: C.slate }}>{m.name}</span>
                    {m.isKid && <span style={{ fontSize: 10, color: C.kids, background: `${C.kids}18`, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>Kid ⭐</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: m.color }}>{m.points} pts</span>
                    <button onClick={() => startEdit(m)} style={{ background: "none", border: "none", cursor: "pointer", color: C.sandDark, fontSize: 16, padding: "2px 4px", lineHeight: 1 }}>✎</button>
                  </div>
                </div>
                <div style={{ marginTop: 7, height: 4, background: C.sandLight, borderRadius: 2 }}>
                  <div style={{
                    height: "100%", borderRadius: 2,
                    background: `linear-gradient(90deg, ${m.color}, ${m.color}99)`,
                    width: `${members[0].points > 0 ? (m.points / members[0].points) * 100 : 0}%`,
                    transition: "width 0.8s ease",
                  }} />
                </div>
                <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 11, color: C.slateLight }}>
                    🔥 {m.streak} streak · {m.completedToday}/{m.totalToday} today
                  </div>
                  {m.id !== 1 && incomplete > 0 && (
                    <button onClick={() => handleNudge(m.id)} style={{
                      background: isNudged ? `${C.green}18` : `${C.accent}12`,
                      border: "none", borderRadius: 12, padding: "4px 10px",
                      fontSize: 11, fontWeight: 600,
                      color: isNudged ? C.green : C.accent,
                      cursor: "pointer", transition: "all 0.3s ease",
                    }}>{isNudged ? "✓ Nudged!" : `Nudge ${m.name.split(" ")[0]} 👋`}</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div onClick={startAdd} style={{
        padding: 16, borderRadius: 20, border: `1.5px dashed ${C.sandDark}`,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        cursor: "pointer", color: C.slateLight, fontSize: 14, marginBottom: 16,
      }}>
        <span style={{ fontSize: 20 }}>+</span> Add family member
      </div>

      <div style={{ background: C.white, borderRadius: 20, padding: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.slate, marginBottom: 14, letterSpacing: 0.5 }}>Rewards Available</div>
        {INITIAL_REWARDS.map((r, i) => (
          <div key={r.id} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
            borderBottom: i < INITIAL_REWARDS.length - 1 ? `1px solid ${C.sandLight}` : "none",
          }}>
            <div style={{ fontSize: 26 }}>{r.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: C.slate, fontWeight: 500 }}>{r.name}</div>
              <div style={{ fontSize: 11, color: C.slateLight, marginTop: 1 }}>{r.who} · {r.points} pts</div>
            </div>
            <div style={{ padding: "6px 12px", borderRadius: 20, background: C.offwhite, fontSize: 12, color: C.warm, fontWeight: 600 }}>Redeem</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADD SCREEN ───────────────────────────────────────────────────
function AddScreen({ onAddHabit }) {
  const [view, setView] = useState("menu");
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [targetCount, setTargetCount] = useState(1);
  const [rewardsList, setRewardsList] = useState(INITIAL_REWARDS);
  const [editingReward, setEditingReward] = useState(null);
  const [newReward, setNewReward] = useState({ name: "", points: "", icon: "🎁", who: "All" });

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: `1.5px solid ${C.sandDark}`, background: C.white,
    fontSize: 14, color: C.slate, outline: "none",
    fontFamily: "'DM Sans', sans-serif",
  };

  const saveReward = () => {
    if (!newReward.name || !newReward.points) return;
    if (editingReward) {
      setRewardsList(r => r.map(x => x.id === editingReward.id ? { ...x, ...newReward, points: Number(newReward.points) } : x));
    } else {
      setRewardsList(r => [...r, { id: Date.now(), ...newReward, points: Number(newReward.points), color: C.accent }]);
    }
    setNewReward({ name: "", points: "", icon: "🎁", who: "All" });
    setEditingReward(null);
    setView("rewards");
  };

  if (view === "menu") return (
    <div style={{ padding: "0 20px 110px" }}>
      <div style={{ fontSize: 13, color: C.slateLight, marginBottom: 24 }}>What would you like to set up?</div>
      {[
        { id: "habits", icon: "◈", label: "Add a Ritual Habit", desc: "Choose from templates — ready to tap", color: C.slate },
        { id: "rewards", icon: "🎁", label: "Manage Rewards", desc: "Set up points rewards for your family", color: C.accent },
      ].map(item => (
        <div key={item.id} onClick={() => setView(item.id)} style={{
          background: C.white, borderRadius: 20, padding: 20, marginBottom: 12,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)", cursor: "pointer",
          border: "1px solid rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{
            width: 50, height: 50, borderRadius: 15, background: `${item.color}15`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
          }}>{item.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.slate }}>{item.label}</div>
            <div style={{ fontSize: 12, color: C.slateLight, marginTop: 2 }}>{item.desc}</div>
          </div>
          <div style={{ color: C.sandDark, fontSize: 20 }}>›</div>
        </div>
      ))}
    </div>
  );

  if (view === "habits") return (
    <div style={{ padding: "0 20px 110px" }}>
      <button onClick={() => setView("menu")} style={{ background: "none", border: "none", cursor: "pointer", color: C.slateLight, fontSize: 13, marginBottom: 16 }}>← Back</button>
      <div style={{ fontSize: 13, color: C.slateLight, marginBottom: 20, lineHeight: 1.6 }}>
        Every habit is pre-loaded and ready to link to your tile. Just choose and tap.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {CATEGORIES.map((cat) => (
          <div key={cat.id} onClick={() => { setSelectedCat(cat); setView("category"); }} style={{
            background: cat.isKids
              ? `linear-gradient(135deg, ${C.kids}15, ${C.kidsLight}10)`
              : C.white,
            borderRadius: 20, padding: 18, cursor: "pointer",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            border: cat.isKids ? `1.5px solid ${C.kids}30` : "1px solid rgba(0,0,0,0.05)",
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 13,
              background: `${cat.color}18`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, marginBottom: 10,
            }}>{cat.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.slate, lineHeight: 1.3 }}>{cat.name}</div>
            <div style={{ fontSize: 11, color: C.slateLight, marginTop: 3 }}>{cat.habits.length} habits</div>
            {cat.isKids && (
              <div style={{ marginTop: 8, fontSize: 10, color: C.kids, fontWeight: 700 }}>⭐ Kids Special</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (view === "category" && selectedCat) return (
    <div style={{ padding: "0 20px 110px" }}>
      <button onClick={() => setView("habits")} style={{ background: "none", border: "none", cursor: "pointer", color: C.slateLight, fontSize: 13, marginBottom: 16 }}>← Back</button>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ fontSize: 30 }}>{selectedCat.icon}</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.slate, fontFamily: "'Cormorant Garamond', serif" }}>{selectedCat.name}</div>
          <div style={{ fontSize: 12, color: C.slateLight }}>{selectedCat.description}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {selectedCat.habits.map((h, i) => (
          <div key={i} onClick={() => { setSelectedHabit({ ...h, categoryId: selectedCat.id, category: selectedCat.name, color: selectedCat.color, isKid: selectedCat.isKids }); setView("setTarget"); }} style={{
            background: C.white, borderRadius: 16, padding: 16, cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.05)",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: `${selectedCat.color}15`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
            }}>{h.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.slate }}>{h.name}</div>
              <div style={{ fontSize: 11, color: C.slateLight, marginTop: 1 }}>Tile at: {h.location}</div>
            </div>
            {h.parentVerified && (
              <span style={{ fontSize: 10, color: C.kids, background: `${C.kids}18`, padding: "3px 8px", borderRadius: 10, fontWeight: 600, flexShrink: 0 }}>Parent verify</span>
            )}
            <div style={{ color: C.sandDark, fontSize: 18 }}>+</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (view === "setTarget" && selectedHabit) return (
    <div style={{ padding: "0 20px 110px" }}>
      <button onClick={() => setView("category")} style={{ background: "none", border: "none", cursor: "pointer", color: C.slateLight, fontSize: 13, marginBottom: 20 }}>← Back</button>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: `${selectedHabit.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{selectedHabit.icon}</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.slate, fontFamily: "'Cormorant Garamond', serif" }}>{selectedHabit.name}</div>
          <div style={{ fontSize: 12, color: C.slateLight }}>Tile at: {selectedHabit.location}</div>
        </div>
      </div>

      <div style={{ background: C.white, borderRadius: 20, padding: 20, marginBottom: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.slate, marginBottom: 4 }}>How many times per day?</div>
        <div style={{ fontSize: 12, color: C.slateLight, marginBottom: 20, lineHeight: 1.5 }}>
          Set a daily target. Each tap earns points — you complete the habit when you hit your target.
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
          <button onClick={() => setTargetCount(t => Math.max(1, t - 1))} style={{
            width: 44, height: 44, borderRadius: "50%", border: "none",
            background: C.offwhite, fontSize: 22, cursor: "pointer", color: C.slate,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>−</button>
          <div style={{ textAlign: "center", minWidth: 60 }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: C.slate, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>{targetCount}</div>
            <div style={{ fontSize: 11, color: C.slateLight, marginTop: 4 }}>{targetCount === 1 ? "time per day" : "times per day"}</div>
          </div>
          <button onClick={() => setTargetCount(t => Math.min(20, t + 1))} style={{
            width: 44, height: 44, borderRadius: "50%", border: "none",
            background: C.offwhite, fontSize: 22, cursor: "pointer", color: C.slate,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>+</button>
        </div>
        {targetCount > 1 && (
          <div style={{ marginTop: 16, padding: "10px 16px", borderRadius: 12, background: `${selectedHabit.color}10`, fontSize: 12, color: C.slate, textAlign: "center", lineHeight: 1.5 }}>
            You'll earn <strong>+{targetCount * 10} points</strong> on days you hit all {targetCount} taps.
            Your streak only grows when you hit your full target.
          </div>
        )}
      </div>

      <button onClick={() => { onAddHabit({ ...selectedHabit, target: targetCount }); setTargetCount(1); setView("menu"); }} style={{
        width: "100%", padding: "14px", borderRadius: 16, border: "none",
        background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
        color: C.white, fontSize: 15, fontWeight: 700, cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif", boxShadow: `0 6px 20px ${C.accent}40`,
      }}>Add to My Rituals</button>
    </div>
  );

  if (view === "rewards") return (
    <div style={{ padding: "0 20px 110px" }}>
      <button onClick={() => setView("menu")} style={{ background: "none", border: "none", cursor: "pointer", color: C.slateLight, fontSize: 13, marginBottom: 16 }}>← Back</button>
      <div style={{ fontSize: 13, color: C.slateLight, marginBottom: 16 }}>Rewards your family can redeem with their points.</div>
      {rewardsList.map((r) => (
        <div key={r.id} style={{
          background: C.white, borderRadius: 18, padding: 16, marginBottom: 10,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ fontSize: 28 }}>{r.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.slate }}>{r.name}</div>
            <div style={{ fontSize: 12, color: C.slateLight, marginTop: 2 }}>{r.who} · {r.points} points</div>
          </div>
          <button onClick={() => { setEditingReward(r); setNewReward({ name: r.name, points: String(r.points), icon: r.icon, who: r.who }); setView("addReward"); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.slateLight, fontSize: 13, padding: "4px 8px" }}>Edit</button>
          <button onClick={() => setRewardsList(r2 => r2.filter(x => x.id !== r.id))} style={{ background: "none", border: "none", cursor: "pointer", color: "#C0504D", fontSize: 13, padding: "4px 8px" }}>✕</button>
        </div>
      ))}
      <div onClick={() => { setEditingReward(null); setNewReward({ name: "", points: "", icon: "🎁", who: "All" }); setView("addReward"); }} style={{
        padding: 16, borderRadius: 18, border: `1.5px dashed ${C.sandDark}`,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        cursor: "pointer", color: C.slateLight, fontSize: 14, marginTop: 4,
      }}>
        <span style={{ fontSize: 18 }}>+</span> Add New Reward
      </div>
    </div>
  );

  if (view === "addReward") return (
    <div style={{ padding: "0 20px 110px" }}>
      <button onClick={() => setView("rewards")} style={{ background: "none", border: "none", cursor: "pointer", color: C.slateLight, fontSize: 13, marginBottom: 16 }}>← Back</button>
      <div style={{ fontSize: 16, fontWeight: 600, color: C.slate, marginBottom: 20 }}>{editingReward ? "Edit Reward" : "New Reward"}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { label: "Reward name", key: "name", placeholder: "e.g. 30 min extra screen time", type: "text" },
          { label: "Points required", key: "points", placeholder: "e.g. 500", type: "number" },
          { label: "Icon (emoji)", key: "icon", placeholder: "🎁", type: "text" },
          { label: "Who is this for?", key: "who", placeholder: "e.g. Emma, All, Kids", type: "text" },
        ].map(field => (
          <div key={field.key}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.slateLight, marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>{field.label}</div>
            <input type={field.type} placeholder={field.placeholder} value={newReward[field.key]}
              onChange={e => setNewReward(r => ({ ...r, [field.key]: e.target.value }))}
              style={inputStyle} />
          </div>
        ))}
        <button onClick={saveReward} style={{
          marginTop: 8, padding: "14px", borderRadius: 16, border: "none",
          background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
          color: C.white, fontSize: 15, fontWeight: 700, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", boxShadow: `0 6px 20px ${C.accent}40`,
        }}>{editingReward ? "Save Changes" : "Add Reward"}</button>
      </div>
    </div>
  );

  return null;
}

// ─── INSIGHTS ─────────────────────────────────────────────────────
function InsightsScreen({ habits }) {
  const best = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  const topHabit = habits.reduce((a, b) => a.streak > b.streak ? a : b, habits[0] || {});
  return (
    <div style={{ padding: "0 20px 110px" }}>
      {[
        { label: "Best streak", value: `${best} days`, icon: "🔥", color: C.accent },
        { label: "Most consistent", value: topHabit?.name || "—", icon: topHabit?.icon || "◈", color: C.green },
        { label: "Active habits", value: `${habits.length} rituals`, icon: "◈", color: C.slate },
        { label: "Family ranking", value: "#1 this week", icon: "🏆", color: C.warm },
        { label: "Total taps", value: "142 this month", icon: "✦", color: C.slateLight },
      ].map((s, i) => (
        <div key={i} style={{
          background: C.white, borderRadius: 20, padding: 18, marginBottom: 10,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: `${s.color}15`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
          }}>{s.icon}</div>
          <div>
            <div style={{ fontSize: 12, color: C.slateLight }}>{s.label}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.slate, marginTop: 2 }}>{s.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────
export default function RitualApp() {
  const [tab, setTab] = useState("today");
  const [habits, setHabits] = useState(INITIAL_HABITS);
  const [weekData, setWeekData] = useState(WEEK_HISTORY);
  const [family, setFamily] = useState(INITIAL_FAMILY);
  const [flashHabit, setFlashHabit] = useState(null);
  const [mounted, setMounted] = useState(false);

  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const handleComplete = (id) => {
    let updatedHabit;
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const newTaps = (h.taps || 0) + 1;
      updatedHabit = { ...h, taps: newTaps };
      return updatedHabit;
    }));
    setTimeout(() => {
      setFlashHabit(updatedHabit);
      const updated = [...weekData];
      const currentHabits = habits.map(h => h.id === id ? { ...h, taps: (h.taps||0)+1 } : h);
      const done = currentHabits.filter(h => (h.taps||0) >= (h.target||1)).length;
      updated[todayIndex] = Math.round((done / currentHabits.length) * 100);
      setWeekData(updated);
    }, 0);
  };

  const handleUndo = (id) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const newTaps = Math.max((h.taps || 0) - 1, 0);
      return { ...h, taps: newTaps };
    }));
    const updated = [...weekData];
    const currentHabits = habits.map(h => h.id === id ? { ...h, taps: Math.max((h.taps||0)-1,0) } : h);
    const done = currentHabits.filter(h => (h.taps||0) >= (h.target||1)).length;
    updated[todayIndex] = Math.round((done / currentHabits.length) * 100);
    setWeekData(updated);
  };

  const handleAddHabit = (h) => {
    setHabits(prev => [...prev, {
      id: Date.now(), name: h.name, icon: h.icon,
      category: h.category, categoryId: h.categoryId,
      streak: 0, taps: 0, target: h.target || 1, color: h.color,
      location: h.location, isKid: h.isKid || false,
    }]);
    setTab("today");
  };

  const TABS = [
    { id: "today", icon: "◈", label: "Today" },
    { id: "family", icon: "◉", label: "Family" },
    { id: "add", icon: "⊕", label: "Add" },
    { id: "insights", icon: "◎", label: "Insights" },
  ];

  const headings = {
    today: `${getGreeting()}, Willem`,
    family: "Your Family",
    add: "Set Up",
    insights: "Insights",
  };

  const subs = {
    today: `Friday, 13 March · ${habits.filter(h => (h.taps||0) >= (h.target||1)).length} of ${habits.length} complete`,
    family: "See how everyone's doing",
    add: "Habits, tiles & rewards",
    insights: "Your habit data",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:${C.sandLight};font-family:'DM Sans',sans-serif;}
        @keyframes ripple{0%{transform:scale(0.8);opacity:1;}100%{transform:scale(2.2);opacity:0;}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.25;}}
        @keyframes flashIn{from{opacity:0;}to{opacity:1;}}
        @keyframes popIn{from{transform:scale(0.5);opacity:0;}to{transform:scale(1);opacity:1;}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes slideUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        ::-webkit-scrollbar{display:none;}
        input:focus{border-color:${C.accent} !important;outline:none;}
      `}</style>

      <div style={{
        maxWidth: 390, margin: "0 auto", minHeight: "100vh",
        background: C.sandLight, position: "relative",
        opacity: mounted ? 1 : 0, transition: "opacity 0.45s ease",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{
              fontSize: 25, fontWeight: 700, color: C.slate,
              fontFamily: "'Cormorant Garamond', serif", letterSpacing: -0.3, lineHeight: 1.1,
            }}>{headings[tab]}</div>
            <div style={{ fontSize: 12, color: C.slateLight, marginTop: 3 }}>{subs[tab]}</div>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 700, color: C.white,
            boxShadow: `0 4px 12px ${C.accent}40`, flexShrink: 0,
          }}>W</div>
        </div>

        {/* Screen */}
        <div key={tab} style={{ animation: "slideUp 0.3s ease" }}>
          {tab === "today" && (
            <TodayScreen
              habits={habits} weekData={weekData}
              onComplete={handleComplete}
              onUndo={handleUndo}
              flashHabit={flashHabit}
              onFlashDone={() => setFlashHabit(null)}
              onFlashUndo={(id) => { handleUndo(id); setFlashHabit(null); }}
              isKidView={false}
            />
          )}
          {tab === "family" && <FamilyScreen members={family} setMembers={setFamily} />}
          {tab === "add" && <AddScreen onAddHabit={handleAddHabit} />}
          {tab === "insights" && <InsightsScreen habits={habits} />}
        </div>

        {/* Tab bar */}
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: 390, background: "rgba(250,248,245,0.96)",
          backdropFilter: "blur(24px)", borderTop: `1px solid ${C.sandDark}50`,
          padding: "10px 0 26px", display: "flex", justifyContent: "space-around",
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              padding: "4px 18px",
            }}>
              <div style={{
                fontSize: 20, color: tab === t.id ? C.accent : C.sandDark,
                transition: "all 0.2s ease",
                transform: tab === t.id ? "scale(1.2)" : "scale(1)",
              }}>{t.icon}</div>
              <div style={{
                fontSize: 9, letterSpacing: 1.2,
                color: tab === t.id ? C.accent : C.sandDark,
                fontWeight: tab === t.id ? 700 : 400,
                textTransform: "uppercase",
              }}>{t.label}</div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
