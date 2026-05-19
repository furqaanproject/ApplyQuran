import { useState, useEffect, useCallback } from "react";

// ── CONFIG ──────────────────────────────────────────────────
const FORM_URL = "ApplyQuran/reflection/";
// Day 1 = May 18 2026 midnight PDT (UTC-7 → 07:00 UTC)
const DAY_ONE_UTC = Date.UTC(2026, 4, 18, 7, 0, 0);

// ── RESPONSIVE HOOK ─────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 900);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

// ── LESSONS — The Clear Qur'an, Dr. Mustafa Khattab ─────────
const LESSONS = [
  {
    day: 1,
    theme: "Gratitude",
    color: "#C9A84C",
    arabic: "وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ",
    ref: "Surah Ibrahim 14:7",
    translation: "And \u02f9remember\u02fa when your Lord proclaimed, \u2018If you are grateful, I will certainly give you more. But if you are ungrateful, surely My punishment is severe.\u2019",
    reflect: "What gift from Allah have you taken for granted? Open The Clear Qur\u2019an today and find one ayah that reframes something ordinary as a blessing.",
    related: [
      { ref: "Ibrahim 14:34", note: "a full inventory of Allah\u2019s blessings on humanity" },
      { ref: "Ar-Rahman 55:13", note: "the recurring reminder \u2014 \u2018Which of your Lord\u2019s favours will you deny?\u2019" },
    ],
  },
  {
    day: 2,
    theme: "Repentance",
    color: "#7EB8B0",
    arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ",
    ref: "Surah Az-Zumar 39:53",
    translation: "Say, \u02f9O Prophet, that Allah says,\u02fa \u2018O My servants who have exceeded the limits against their souls! Do not lose hope in Allah\u2019s mercy, for Allah certainly forgives all sins. He is indeed the All-Forgiving, Most Merciful.\u2019",
    reflect: "The door is open regardless of how far you feel. What have you been hesitant to bring to Allah? Sit with it today.",
    related: [
      { ref: "Aal-Imran 3:135", note: "those who remember Allah and seek forgiveness for their sins" },
      { ref: "An-Nisa 4:110", note: "whoever does evil then seeks Allah\u2019s forgiveness will find Allah forgiving" },
    ],
  },
  {
    day: 3,
    theme: "Sacrifice",
    color: "#C9A84C",
    arabic: "لَن يَنَالَ اللَّهَ لُحُومُهَا وَلَا دِمَاؤُهَا وَلَٰكِن يَنَالُهُ التَّقْوَىٰ مِنكُمْ كَذَٰلِكَ سَخَّرَهَا لَكُمْ لِتُكَبِّرُوا اللَّهَ عَلَىٰ مَا هَدَاكُمْ وَبَشِّرِ الْمُحْسِنِينَ",
    ref: "Surah Al-Hajj 22:37",
    translation: "Neither their meat nor blood reaches Allah. Rather, it is your piety that reaches Him. This is how He has subjected them to you so that you may proclaim the greatness of Allah for what He has guided you to, and give good news to the good-doers.",
    reflect: "Ibrahim \ufdfa was willing to give what he loved most. What is one comfort, habit, or attachment you could let go of for the sake of Allah this week?",
    related: [
      { ref: "Al-Hajj 22:34", note: "sacrifice as an act of remembrance, not ritual" },
      { ref: "Aal-Imran 3:92", note: "\u2018You will never achieve righteousness until you donate what you love\u2019" },
    ],
  },
  {
    day: 4,
    theme: "Remembrance",
    color: "#7EB8B0",
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    ref: "Surah Al-Baqarah 2:152",
    translation: "Remember Me; I will remember you. And thank Me, and never be ungrateful.",
    reflect: "The simplest exchange in existence. Set aside 10 minutes today for pure dhikr \u2014 no agenda, no phone, just remembrance.",
    related: [
      { ref: "Ar-Ra\u2019d 13:28", note: "\u2018Surely in the remembrance of Allah do hearts find comfort\u2019" },
      { ref: "Al-Ahzab 33:41\u201342", note: "the command to remember Allah abundantly, morning and evening" },
    ],
  },
  {
    day: 5,
    theme: "Trust in Allah",
    color: "#C9A84C",
    arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ قَدْ جَعَلَ اللَّهُ لِكُلِّ شَيْءٍ قَدْرًا",
    ref: "Surah At-Talaq 65:2\u20133",
    translation: "And whoever is mindful of Allah, He will make a way out for them, and provide for them from sources they could never imagine. And whoever puts their trust in Allah, then He \u02f9alone\u02fa is sufficient for them. Certainly Allah achieves His Will. Allah has already set a destiny for everything.",
    reflect: "What situation are you gripping tightly that belongs in Allah\u2019s hands? Name it. Then let it go today.",
    related: [
      { ref: "Aal-Imran 3:159", note: "the Prophet \ufdfa was commanded to consult, then trust Allah once decided" },
      { ref: "At-Tawbah 9:51", note: "\u2018Nothing will ever befall us except what Allah has destined for us\u2019" },
    ],
  },
  {
    day: 6,
    theme: "Patience",
    color: "#7EB8B0",
    arabic: "قُلْ يَا عِبَادِ الَّذِينَ آمَنُوا اتَّقُوا رَبَّكُمْ لِلَّذِينَ أَحْسَنُوا فِي هَٰذِهِ الدُّنْيَا حَسَنَةٌ وَأَرْضُ اللَّهِ وَاسِعَةٌ إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ",
    ref: "Surah Az-Zumar 39:10",
    translation: "Say \u02f9O Prophet, that Allah says\u02fa, \u2018O My servants who believe! Be mindful of your Lord. Those who do good in this world will have a good reward. And Allah\u2019s earth is spacious. Only those who endure patiently will be given their reward without limit.\u2019",
    reflect: "Without limit \u2014 not measured, not calculated. What test are you currently in that you have been resisting rather than enduring?",
    related: [
      { ref: "Al-Baqarah 2:153\u2013157", note: "the full portrait of the patient \u2014 who they are and what they receive" },
      { ref: "Az-Zumar 39:10", note: "earth is spacious \u2014 emigrating for faith is also an act of patience" },
    ],
  },
  {
    day: 7,
    theme: "Unity",
    color: "#C9A84C",
    arabic: "وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا وَاذْكُرُوا نِعْمَتَ اللَّهِ عَلَيْكُمْ إِذْ كُنتُمْ أَعْدَاءً فَأَلَّفَ بَيْنَ قُلُوبِكُمْ فَأَصْبَحْتُم بِنِعْمَتِهِ إِخْوَانًا وَكُنتُمْ عَلَىٰ شَفَا حُفْرَةٍ مِّنَ النَّارِ فَأَنقَذَكُم مِّنْهَا",
    ref: "Surah Aal-Imran 3:103",
    translation: "And hold firmly together to the rope of Allah and do not be divided. Remember Allah\u2019s favour upon you when you were enemies, then He united your hearts, so you \u2014 by His grace \u2014 became brothers. And you were at the brink of a fiery pit and He saved you from it.",
    reflect: "Who in your community have you lost connection with? Reach out to one person today. Reconnect the rope.",
    related: [
      { ref: "Al-Hujurat 49:10", note: "\u2018The believers are but one brotherhood\u2019" },
      { ref: "Al-Hujurat 49:13", note: "diversity as a divine sign, not a cause for division" },
    ],
  },
  {
    day: 8,
    theme: "Sincerity",
    color: "#7EB8B0",
    arabic: "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ حُنَفَاءَ وَيُقِيمُوا الصَّلَاةَ وَيُؤْتُوا الزَّكَاةَ وَذَٰلِكَ دِينُ الْقَيِّمَةِ",
    ref: "Surah Al-Bayyinah 98:5",
    translation: "Yet they were only commanded to worship Allah \u02f9alone\u02fa with sincere devotion to Him in all uprightness, establish prayer, and pay alms-tax. That is the upright Way.",
    reflect: "Review your week. Which of your good deeds were done purely for Allah? Which had mixed intentions? Honesty here is its own form of worship.",
    related: [
      { ref: "Al-Ikhlas 112:1\u20134", note: "the entire surah is a definition of sincere monotheism" },
      { ref: "Az-Zumar 39:11", note: "the Prophet \ufdfa commanded to worship Allah with sincere devotion" },
    ],
  },
  {
    day: 9,
    theme: "Du\u2019a \u2014 Day of Arafah",
    color: "#C9A84C",
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ فَلْيَسْتَجِيبُوا لِي وَلْيُؤْمِنُوا بِي لَعَلَّهُمْ يَرْشُدُونَ",
    ref: "Surah Al-Baqarah 2:186",
    translation: "When My servants ask you \u02f9O Prophet\u02fa about Me: I am truly near. I respond to one\u2019s prayer when they call upon Me. So let them respond \u02f9with obedience\u02fa to Me and believe in Me, so perhaps they will be guided \u02f9to the Right Way\u02fa.",
    reflect: "The best day of the year for du\u2019a. Write down three things you have never asked Allah for \u2014 perhaps because you felt unworthy. Ask today. He is near.",
    related: [
      { ref: "Ghafir 40:60", note: "\u2018Call upon Me, I will respond to you\u2019 \u2014 the explicit promise" },
      { ref: "Al-A\u2019raf 7:55", note: "the etiquette of du\u2019a: humility and quietly" },
    ],
  },
  {
    day: 10,
    theme: "Submission \u2014 Eid al-Adha",
    color: "#7EB8B0",
    arabic: "فَلَمَّا أَسْلَمَا وَتَلَّهُ لِلْجَبِينِ وَنَادَيْنَاهُ أَن يَا إِبْرَاهِيمُ قَدْ صَدَّقْتَ الرُّؤْيَا إِنَّا كَذَٰلِكَ نَجْزِي الْمُحْسِنِينَ",
    ref: "Surah As-Saffat 37:103\u2013105",
    translation: "Then when they submitted \u02f9to Allah\u2019s Will\u02fa, and Abraham laid him on the side of his forehead \u02f9for sacrifice\u02fa, We called out to him, \u2018O Abraham! You have already fulfilled the vision.\u2019 Indeed, this is how We reward the good-doers.",
    reflect: "Ibrahim and Ismail both said yes. Complete, immediate submission. What is Allah calling you toward that requires your full yes \u2014 without conditions?",
    related: [
      { ref: "As-Saffat 37:100\u2013102", note: "the lead-up \u2014 Ibrahim\u2019s prayer for a righteous child and the dream" },
      { ref: "Al-Baqarah 2:131", note: "\u2018When his Lord said to him \u2018Submit\u2019, he said \u2018I submit to the Lord of all worlds\u2019\u2019" },
    ],
  },
];

// ── HELPERS ─────────────────────────────────────────────────
function getCurrentDay() {
  const diff = Math.floor((Date.now() - DAY_ONE_UTC) / 86400000);
  return Math.min(Math.max(diff + 1, 1), 10);
}

function load(key, fb) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; }
  catch { return fb; }
}
function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }

function loadH2C() {
  return new Promise((res, rej) => {
    if (window.html2canvas) return res(window.html2canvas);
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.onload = () => res(window.html2canvas);
    s.onerror = rej;
    document.head.appendChild(s);
  });
}

// ── CANVAS CARD ──────────────────────────────────────────────
function wrapCtx(ctx, text, max) {
  const words = text.split(" "), lines = [];
  let line = "";
  for (const w of words) {
    const t = line + w + " ";
    if (ctx.measureText(t).width > max && line) { lines.push(line.trim()); line = w + " "; }
    else line = t;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

function buildCard(lesson, reflection, name) {
  const S = 1080;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d");
  const col = lesson.color;

  ctx.fillStyle = "#0E1117"; ctx.fillRect(0, 0, S, S);
  const g = ctx.createRadialGradient(S/2, 80, 0, S/2, 80, 600);
  g.addColorStop(0, "rgba(201,168,76,0.09)"); g.addColorStop(1, "transparent");
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);

  const C = 80; ctx.strokeStyle = "rgba(201,168,76,0.55)"; ctx.lineWidth = 2.5;
  [[[0,C],[0,0],[C,0]],[[S-C,0],[S,0],[S,C]],[[0,S-C],[0,S],[C,S]],[[S-C,S],[S,S],[S,S-C]]].forEach(p => {
    ctx.beginPath(); ctx.moveTo(...p[0]); ctx.lineTo(...p[1]); ctx.lineTo(...p[2]); ctx.stroke();
  });

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(201,168,76,0.65)"; ctx.font = "26px Georgia";
  ctx.fillText("AL-FURQAAN FOUNDATION CANADA", S/2, 118);
  ctx.fillStyle = col; ctx.font = "bold 30px Georgia";
  ctx.fillText("DAY " + lesson.day + "  \u00b7  " + lesson.theme.toUpperCase(), S/2, 176);
  ctx.strokeStyle = "rgba(201,168,76,0.2)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(160,200); ctx.lineTo(S-160,200); ctx.stroke();

  ctx.fillStyle = "#F0EDE6"; ctx.font = "32px Georgia";
  const aL = wrapCtx(ctx, lesson.arabic, S - 180); let y = 256;
  aL.forEach(l => { ctx.fillText(l, S/2, y); y += 48; });

  ctx.fillStyle = "rgba(201,168,76,0.65)"; ctx.font = "21px Georgia";
  ctx.fillText(lesson.ref, S/2, y + 8); y += 36;
  ctx.fillStyle = "rgba(201,168,76,0.38)"; ctx.font = "italic 17px Georgia";
  ctx.fillText("The Clear Qur\u2019an \u2014 Dr. Mustafa Khattab", S/2, y); y += 34;

  ctx.strokeStyle = "rgba(201,168,76,0.14)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(200, y + 8); ctx.lineTo(S-200, y + 8); ctx.stroke(); y += 32;
  ctx.fillStyle = "rgba(201,168,76,0.48)"; ctx.font = "600 17px Georgia";
  ctx.fillText("M Y   R E F L E C T I O N", S/2, y + 12); y += 42;

  ctx.fillStyle = "#F0EDE6"; ctx.font = "italic 30px Georgia";
  const rL = wrapCtx(ctx, "\u201c" + reflection + "\u201d", S - 160);
  rL.forEach(l => { ctx.fillText(l, S/2, y); y += 46; });

  if (name && name.trim()) {
    ctx.fillStyle = "rgba(201,168,76,0.65)"; ctx.font = "24px Georgia";
    ctx.fillText("\u2014 " + name.trim(), S/2, y + 10); y += 44;
  }

  const bY = Math.min(y + 24, S - 110);
  ctx.strokeStyle = "rgba(201,168,76,0.18)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(160, bY); ctx.lineTo(S-160, bY); ctx.stroke();
  ctx.fillStyle = "rgba(201,168,76,0.5)"; ctx.font = "24px Georgia";
  ctx.fillText("furqaanproject.ca", S/2, bY + 46);
  ctx.fillStyle = "rgba(201,168,76,0.28)"; ctx.font = "20px Georgia";
  ctx.fillText("#10BestDays  \u00b7  #DhulHijjah  \u00b7  #TheClearQuran", S/2, bY + 80);

  return c;
}

// ── CRACK ANIMATION ──────────────────────────────────────────
function CrackOverlay({ active, color, onDone }) {
  useEffect(() => {
    if (active) { const t = setTimeout(onDone, 900); return () => clearTimeout(t); }
  }, [active, onDone]);
  if (!active) return null;
  const cracks = [
    "M540,540 L300,200","M540,540 L820,180","M540,540 L900,540",
    "M540,540 L760,880","M540,540 L200,750","M540,540 L180,400",
    "M540,540 L650,120","M540,540 L900,700",
  ];
  return (
    <div style={{ position:"absolute",inset:0,zIndex:20,pointerEvents:"none",overflow:"hidden",borderRadius:4 }}>
      <div style={{
        position:"absolute",inset:0,
        background:"radial-gradient(circle at 50% 50%," + color + "44 0%,transparent 70%)",
        animation:"dhFlash 0.9s ease-out forwards",
      }}/>
      <svg viewBox="0 0 1080 1080" style={{ position:"absolute",inset:0,width:"100%",height:"100%",animation:"dhFade 0.9s ease-out forwards" }}>
        {cracks.map((d, i) => (
          <path key={i} d={d} stroke={color} strokeWidth="2.5" fill="none" opacity="0.9"
            style={{ strokeDasharray:800, strokeDashoffset:800, animation:"dhCrack 0.45s ease-out " + (i * 0.04) + "s forwards" }}/>
        ))}
        <circle cx="540" cy="540" r="10" fill={color} opacity="0.5"
          style={{ animation:"dhBurst 0.9s ease-out forwards" }}/>
      </svg>
      <style>{`
        @keyframes dhFlash{0%{opacity:0}20%{opacity:1}100%{opacity:0}}
        @keyframes dhFade{0%,65%{opacity:1}100%{opacity:0}}
        @keyframes dhCrack{to{stroke-dashoffset:0}}
        @keyframes dhBurst{0%{r:10;opacity:.6}100%{r:320;opacity:0}}
        @keyframes dhReveal{from{opacity:0;transform:scale(.97);filter:blur(4px)}to{opacity:1;transform:scale(1);filter:blur(0)}}
        @keyframes dhPulse{0%,100%{box-shadow:0 0 18px rgba(201,168,76,.1)}50%{box-shadow:0 0 48px rgba(201,168,76,.35)}}
      `}</style>
    </div>
  );
}

// ── LESSON CARD ──────────────────────────────────────────────
function LessonCard({ lesson, status, onReveal, onDownload, dlActive }) {
  const col = lesson.color;
  const isCurrentLocked = status === "current-locked";
  const isRevealed = status === "past" || status === "current-revealed";

  const base = {
    background: "#111318",
    border: "1px solid " + (isCurrentLocked ? col : isRevealed ? "rgba(201,168,76,0.22)" : "rgba(201,168,76,0.1)"),
    borderRadius: 4,
    padding: "26px 22px",
    position: "relative",
    overflow: "hidden",
    animation: status === "current-revealed" ? "dhReveal 0.6s ease-out forwards" : undefined,
    animationFillMode: "forwards",
  };

  if (isCurrentLocked) base.animation = "dhPulse 2.5s ease-in-out infinite";

  return (
    <div style={base}>
      {/* Corner */}
      <div style={{ position:"absolute",top:0,right:0,width:36,height:36,
        borderBottom:"1px solid "+col,borderLeft:"1px solid "+col,opacity:.22,pointerEvents:"none" }}/>

      {/* Geometric bg (locked only) */}
      {isCurrentLocked && (
        <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:.05,pointerEvents:"none" }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={"geo"+lesson.day} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <polygon points="40,2 78,22 78,58 40,78 2,58 2,22" fill="none" stroke={col} strokeWidth="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={"url(#geo"+lesson.day+")"}/>
        </svg>
      )}

      {isCurrentLocked ? (
        // ── SEALED STATE ──────────────────────
        <div style={{ textAlign:"center", padding:"20px 0" }}>
          <p style={{ fontSize:10,letterSpacing:4,color:col,textTransform:"uppercase",marginBottom:8 }}>Today — Day {lesson.day}</p>
          <p style={{ fontSize:20,color:"#F0EDE6",fontWeight:400,letterSpacing:1,marginBottom:20 }}>{lesson.theme}</p>

          {/* Seal SVG */}
          <div style={{ margin:"0 auto 20px",width:68,height:68 }}>
            <svg viewBox="0 0 72 72" fill="none" style={{ width:"100%",height:"100%" }}>
              <circle cx="36" cy="36" r="33" stroke={col} strokeWidth="1.5" opacity=".5"/>
              <circle cx="36" cy="36" r="25" stroke={col} strokeWidth="1" opacity=".3"/>
              {[0,45,90,135,180,225,270,315].map((a,i) => {
                const x1=36+33*Math.cos(a*Math.PI/180), y1=36+33*Math.sin(a*Math.PI/180);
                const x2=36+27*Math.cos(a*Math.PI/180), y2=36+27*Math.sin(a*Math.PI/180);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth="1.5" opacity=".55"/>;
              })}
              <text x="36" y="41" textAnchor="middle" fill={col} fontSize="20" fontFamily="Georgia,serif" opacity=".9">&#9733;</text>
            </svg>
          </div>

          <p style={{ fontSize:12,color:"#9E9A92",lineHeight:1.7,maxWidth:280,margin:"0 auto 24px" }}>
            Today's lesson from The Clear Qur'an is sealed.<br/>Open it when you're ready to reflect.
          </p>

          <button onClick={onReveal} style={{
            background:col,color:"#0E1117",border:"none",borderRadius:3,
            padding:"13px 36px",fontSize:11,letterSpacing:"2.5px",
            textTransform:"uppercase",fontFamily:"Georgia,serif",fontWeight:700,cursor:"pointer",
          }}>
            Reveal Today's Ayah
          </button>
        </div>
      ) : (
        // ── REVEALED STATE ───────────────────
        <div>
          {/* Tag row */}
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
            <span style={{ fontSize:10,letterSpacing:"3px",color:col,textTransform:"uppercase" }}>Day {lesson.day}</span>
            <span style={{ color:col,opacity:.3,fontSize:"6px" }}>&#9679;</span>
            <span style={{ fontSize:10,letterSpacing:"2px",color:"#9E9A92",textTransform:"uppercase" }}>{lesson.theme}</span>
          </div>

          {/* Arabic */}
          <p style={{ fontSize:"clamp(16px,2.5vw,20px)",lineHeight:1.9,color:"#F0EDE6",direction:"rtl",textAlign:"right",margin:"0 0 10px",opacity:.95 }}>
            {lesson.arabic}
          </p>

          {/* Reference */}
          <p style={{ fontSize:11,color:col,opacity:.75,margin:"0 0 14px",letterSpacing:".5px" }}>{lesson.ref}</p>

          {/* Translation */}
          <div style={{ borderLeft:"2px solid "+col,paddingLeft:14,marginBottom:6 }}>
            <p style={{ fontSize:13,lineHeight:1.8,color:"#C8C4BB",fontStyle:"italic",margin:0 }}>{lesson.translation}</p>
          </div>
          <p style={{ fontSize:10,color:col,opacity:.45,textAlign:"right",margin:"5px 0 16px",letterSpacing:".5px",fontStyle:"italic" }}>
            The Clear Qur'an — Dr. Mustafa Khattab
          </p>

          {/* Reflect */}
          <p style={{ fontSize:12,lineHeight:1.75,color:"#9E9A92",margin:"0 0 12px" }}>
            <span style={{ color:col,fontSize:10,letterSpacing:"1px",textTransform:"uppercase" }}>Reflect &#8594;&#160;</span>
            {lesson.reflect}
          </p>

          {/* Related ayaat */}
          <div style={{
            background:"rgba(255,255,255,0.02)",border:"1px solid rgba(201,168,76,0.1)",
            borderRadius:3,padding:"10px 12px",marginBottom:18,
          }}>
            <p style={{ fontSize:10,letterSpacing:"2px",color:col,textTransform:"uppercase",opacity:.55,marginBottom:8 }}>
              Explore further in The Clear Qur'an
            </p>
            {lesson.related.map((r, i) => (
              <p key={i} style={{ fontSize:11,color:"#6A6860",lineHeight:1.6,margin:i > 0 ? "5px 0 0" : 0 }}>
                <span style={{ color:"#9E9A92" }}>{r.ref}</span>
                <span style={{ color:"rgba(201,168,76,0.4)" }}> — </span>
                {r.note}
              </p>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
            <a href={FORM_URL + "?day=" + lesson.day} target="_blank" rel="noopener noreferrer" style={{
              flex:1,minWidth:130,display:"flex",alignItems:"center",justifyContent:"center",gap:6,
              background:col,color:"#0E1117",border:"none",borderRadius:3,
              padding:"11px 14px",fontSize:10,letterSpacing:"2px",textTransform:"uppercase",
              fontFamily:"Georgia,serif",fontWeight:700,cursor:"pointer",textDecoration:"none",
              touchAction:"manipulation",
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/>
              </svg>
              Submit Reflection
            </a>

            <button onClick={() => onDownload(lesson)} disabled={dlActive} style={{
              flex:1,minWidth:130,display:"flex",alignItems:"center",justifyContent:"center",gap:6,
              background:"transparent",color:col,border:"1px solid "+col+"44",borderRadius:3,
              padding:"11px 14px",fontSize:10,letterSpacing:"2px",textTransform:"uppercase",
              fontFamily:"Georgia,serif",cursor:dlActive?"default":"pointer",
              opacity:dlActive?.5:1,touchAction:"manipulation",
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {dlActive ? "Generating…" : "Save PNG"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────
export default function TenDays() {
  const width = useWindowWidth();
  const cols = width >= 640 ? 2 : 1;
  const currentDay = getCurrentDay();

  const [revealed, setRevealed] = useState(() => load("dh_rev", {}));
  const [cracking, setCracking] = useState(null);
  const [dlDay, setDlDay] = useState(null);

  const handleReveal = useCallback((day) => setCracking(day), []);

  const onCrackDone = useCallback(() => {
    const d = cracking;
    setCracking(null);
    const next = { ...revealed, [d]: true };
    setRevealed(next);
    save("dh_rev", next);
  }, [cracking, revealed]);

  const handleDownload = useCallback(async (lesson) => {
    setDlDay(lesson.day);
    try {
      await loadH2C();
      const canvas = buildCard(lesson, lesson.reflect, "");
      const a = document.createElement("a");
      a.download = "10bestdays-day" + lesson.day + ".png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (e) { console.error(e); }
    setDlDay(null);
  }, []);

  const getStatus = (day) => {
    if (day < currentDay) return "past";
    if (day > currentDay) return "future";
    return revealed[day] ? "current-revealed" : "current-locked";
  };

  const visibleLessons = LESSONS.filter(l => getStatus(l.day) !== "future");
  const futureLessons = LESSONS.filter(l => getStatus(l.day) === "future");

  return (
    <div style={{ background:"#0E1117",minHeight:"100vh",fontFamily:"Georgia,serif",color:"#F0EDE6" }}>
      {/* Ambient glow */}
      <div style={{
        position:"fixed",top:-200,left:"50%",transform:"translateX(-50%)",
        width:600,height:500,
        background:"radial-gradient(ellipse,rgba(201,168,76,0.07) 0%,transparent 70%)",
        pointerEvents:"none",zIndex:0,
      }}/>

      <div style={{ position:"relative",zIndex:1,maxWidth:900,margin:"0 auto",padding:"56px 20px 80px" }}>

        {/* Header */}
        <div style={{ textAlign:"center",marginBottom:52 }}>
          <span style={{ fontSize:10,letterSpacing:"4px",color:"#C9A84C",textTransform:"uppercase",display:"block",marginBottom:18 }}>
            Al-Furqaan Foundation Canada &#183; The Clear Qur&#8217;an
          </span>
          <h1 style={{ fontSize:"clamp(32px,5.5vw,56px)",fontWeight:400,lineHeight:1.15,margin:"0 0 4px",color:"#F0EDE6" }}>
            10 Best Days.
          </h1>
          <h1 style={{ fontSize:"clamp(32px,5.5vw,56px)",fontWeight:400,lineHeight:1.15,margin:"0 0 24px",color:"#C9A84C" }}>
            10 Lessons from the Qur&#8217;an.
          </h1>
          <p style={{ fontSize:14,lineHeight:1.75,color:"#9E9A92",maxWidth:500,margin:"0 auto 10px" }}>
            The greatest days of the year. One lesson each day &#8212; a call to open The Clear Qur&#8217;an and reflect.
          </p>
          <div style={{
            display:"inline-flex",alignItems:"center",gap:8,
            background:"rgba(201,168,76,0.07)",border:"1px solid rgba(201,168,76,0.22)",
            borderRadius:3,padding:"8px 20px",marginTop:16,
          }}>
            <span style={{ fontSize:10,letterSpacing:"2px",color:"#C9A84C",textTransform:"uppercase" }}>Today</span>
            <span style={{ color:"rgba(201,168,76,0.35)",fontSize:"7px" }}>&#9679;</span>
            <span style={{ fontSize:14,color:"#F0EDE6" }}>Day {currentDay} of 10</span>
          </div>
        </div>

        {/* 2-column grid */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(" + cols + ", 1fr)",
          gap:16,
          alignItems:"start",
          marginBottom:16,
        }}>
          {visibleLessons.map(lesson => {
            const status = getStatus(lesson.day);
            const isCracking = cracking === lesson.day;
            return (
              <div key={lesson.day} style={{ position:"relative" }}>
                <CrackOverlay active={isCracking} color={lesson.color} onDone={onCrackDone}/>
                <LessonCard
                  lesson={lesson}
                  status={isCracking ? "current-locked" : status}
                  onReveal={() => handleReveal(lesson.day)}
                  onDownload={handleDownload}
                  dlActive={dlDay === lesson.day}
                />
              </div>
            );
          })}
        </div>

        {/* Upcoming days (hidden) */}
        {futureLessons.length > 0 && (
          <div style={{
            background:"#111318",border:"1px solid rgba(201,168,76,0.08)",
            borderRadius:4,padding:"20px 24px",textAlign:"center",
          }}>
            <p style={{ fontSize:10,letterSpacing:"3px",color:"#3A3830",textTransform:"uppercase",marginBottom:12 }}>
              Upcoming
            </p>
            <div style={{ display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap" }}>
              {futureLessons.map(l => (
                <div key={l.day} style={{
                  border:"1px solid rgba(201,168,76,0.08)",borderRadius:3,padding:"7px 14px",
                }}>
                  <span style={{ fontSize:10,color:"#2E2C28",letterSpacing:"1px" }}>Day {l.day}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign:"center",marginTop:48,paddingTop:28,borderTop:"1px solid rgba(201,168,76,0.08)" }}>
          <p style={{ fontSize:11,color:"#3A3830",letterSpacing:"1px",marginBottom:4 }}>
            furqaanproject.ca &#183; Al-Furqaan Foundation Canada
          </p>
          <p style={{ fontSize:10,color:"#2A2820" }}>The Clear Qur&#8217;an &#8212; Dr. Mustafa Khattab</p>
        </div>
      </div>
    </div>
  );
}
