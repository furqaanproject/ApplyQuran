import { useState, useEffect, useCallback, useRef } from "react";

// ── CONFIG ───────────────────────────────────────────────────────────────────
const GOOGLE_FORM = "https://docs.google.com/forms/d/e/1FAIpQLScrCrdnuubUXxHL7W3CcpKk9qs22luTx7AeJR6q2fdNmV1Wzg/formResponse";
const DAY_ONE_UTC = Date.UTC(2026, 4, 18, 7, 0, 0); // May 18 2026 midnight PDT

// ── LESSONS ──────────────────────────────────────────────────────────────────
const LESSONS = [
  {
    day: 1, theme: "Gratitude", color: "#C9A84C",
    arabic: "وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ",
    ref: "Surah Ibrahim 14:7",
    translation: "And \u02f9remember\u02fa when your Lord proclaimed, \u2018If you are grateful, I will certainly give you more. But if you are ungrateful, surely My punishment is severe.\u2019",
    reflect: "What gift from Allah have you taken for granted? Open The Clear Qur\u2019an today and find one ayah that reframes something ordinary as a blessing.",
    related: [
      { ref: "Ibrahim 14:34", note: "a full inventory of Allah\u2019s blessings on humanity" },
      { ref: "Ar-Rahman 55:13", note: "\u2018Which of your Lord\u2019s favours will you deny?\u2019" },
    ],
  },
  {
    day: 2, theme: "Repentance", color: "#7EB8B0",
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
    day: 3, theme: "Sacrifice", color: "#C9A84C",
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
    day: 4, theme: "Remembrance", color: "#7EB8B0",
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
    day: 5, theme: "Trust in Allah", color: "#C9A84C",
    arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ قَدْ جَعَلَ اللَّهُ لِكُلِّ شَيْءٍ قَدْرًا",
    ref: "Surah At-Talaq 65:2\u20133",
    translation: "And whoever is mindful of Allah, He will make a way out for them, and provide for them from sources they could never imagine. And whoever puts their trust in Allah, then He \u02f9alone\u02fa is sufficient for them. Certainly Allah achieves His Will. Allah has already set a destiny for everything.",
    reflect: "What situation are you gripping tightly that belongs in Allah\u2019s hands? Name it. Then let it go today.",
    related: [
      { ref: "Aal-Imran 3:159", note: "consult, decide, then place full trust in Allah" },
      { ref: "At-Tawbah 9:51", note: "\u2018Nothing will befall us except what Allah has destined for us\u2019" },
    ],
  },
  {
    day: 6, theme: "Patience", color: "#7EB8B0",
    arabic: "قُلْ يَا عِبَادِ الَّذِينَ آمَنُوا اتَّقُوا رَبَّكُمْ لِلَّذِينَ أَحْسَنُوا فِي هَٰذِهِ الدُّنْيَا حَسَنَةٌ وَأَرْضُ اللَّهِ وَاسِعَةٌ إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ",
    ref: "Surah Az-Zumar 39:10",
    translation: "Say \u02f9O Prophet, that Allah says\u02fa, \u2018O My servants who believe! Be mindful of your Lord. Those who do good in this world will have a good reward. And Allah\u2019s earth is spacious. Only those who endure patiently will be given their reward without limit.\u2019",
    reflect: "Without limit \u2014 not measured, not calculated. What test are you currently in that you have been resisting rather than enduring?",
    related: [
      { ref: "Al-Baqarah 2:153\u2013157", note: "the full portrait of the patient \u2014 who they are and what they receive" },
      { ref: "Az-Zumar 39:10", note: "earth is spacious \u2014 emigrating for faith is also patience" },
    ],
  },
  {
    day: 7, theme: "Unity", color: "#C9A84C",
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
    day: 8, theme: "Sincerity", color: "#7EB8B0",
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
    day: 9, theme: "Du\u2019a \u2014 Day of Arafah", color: "#C9A84C",
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ فَلْيَسْتَجِيبُوا لِي وَلْيُؤْمِنُوا بِي لَعَلَّهُمْ يَرْشُدُونَ",
    ref: "Surah Al-Baqarah 2:186",
    translation: "When My servants ask you \u02f9O Prophet\u02fa about Me: I am truly near. I respond to one\u2019s prayer when they call upon Me. So let them respond \u02f9with obedience\u02fa to Me and believe in Me, so perhaps they will be guided \u02f9to the Right Way\u02fa.",
    reflect: "The best day of the year for du\u2019a. Write down three things you have never asked Allah for \u2014 perhaps because you felt unworthy. Ask today. He is near.",
    related: [
      { ref: "Ghafir 40:60", note: "\u2018Call upon Me, I will respond\u2019 \u2014 the explicit promise" },
      { ref: "Al-A\u2019raf 7:55", note: "the etiquette of du\u2019a: humility and sincerity" },
    ],
  },
  {
    day: 10, theme: "Submission \u2014 Eid al-Adha", color: "#7EB8B0",
    arabic: "فَلَمَّا أَسْلَمَا وَتَلَّهُ لِلْجَبِينِ وَنَادَيْنَاهُ أَن يَا إِبْرَاهِيمُ قَدْ صَدَّقْتَ الرُّؤْيَا إِنَّا كَذَٰلِكَ نَجْزِي الْمُحْسِنِينَ",
    ref: "Surah As-Saffat 37:103\u2013105",
    translation: "Then when they submitted \u02f9to Allah\u2019s Will\u02fa, and Abraham laid him on the side of his forehead \u02f9for sacrifice\u02fa, We called out to him, \u2018O Abraham! You have already fulfilled the vision.\u2019 Indeed, this is how We reward the good-doers.",
    reflect: "Ibrahim and Ismail both said yes. Complete, immediate submission. What is Allah calling you toward that requires your full yes \u2014 without conditions?",
    related: [
      { ref: "As-Saffat 37:100\u2013102", note: "Ibrahim\u2019s prayer for a righteous child and the dream" },
      { ref: "Al-Baqarah 2:131", note: "\u2018Submit\u2019, he said \u2018I submit to the Lord of all worlds\u2019" },
    ],
  },
];

// ── HELPERS ──────────────────────────────────────────────────────────────────
function getCurrentDay() {
  return Math.min(Math.max(Math.floor((Date.now() - DAY_ONE_UTC) / 86400000) + 1, 1), 10);
}
function load(k, fb) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } }
function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 900);
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  return w;
}

// ── CANVAS CARD ──────────────────────────────────────────────────────────────
function wrap(ctx, text, maxW) {
  const words = text.split(" "), lines = []; let line = "";
  for (const w of words) {
    const t = line + w + " ";
    if (ctx.measureText(t).width > maxW && line) { lines.push(line.trim()); line = w + " "; }
    else line = t;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

function buildCard(lesson, reflection, name) {
  const S = 1080;
  const PAD = 80;
  const col = lesson.color;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d");

  // ── Background
  ctx.fillStyle = "#0C0F14"; ctx.fillRect(0, 0, S, S);

  // ── Radial glow top-centre
  const g1 = ctx.createRadialGradient(S / 2, 0, 0, S / 2, 0, 560);
  g1.addColorStop(0, col === "#C9A84C" ? "rgba(201,168,76,0.13)" : "rgba(126,184,176,0.11)");
  g1.addColorStop(1, "transparent");
  ctx.fillStyle = g1; ctx.fillRect(0, 0, S, S);

  // ── Subtle geometric hex pattern (very faint)
  ctx.save();
  ctx.globalAlpha = 0.028;
  for (let row = 0; row < 14; row++) {
    for (let col2 = 0; col2 < 14; col2++) {
      const cx2 = col2 * 84 + (row % 2 === 0 ? 0 : 42);
      const cy2 = row * 72;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const px = cx2 + 38 * Math.cos(a), py = cy2 + 38 * Math.sin(a);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = col;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }
  }
  ctx.restore();

  // ── Corner brackets
  const CL = 72;
  ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.globalAlpha = 0.65;
  const corners = [
    [[PAD - 4, CL + PAD - 4], [PAD - 4, PAD - 4], [CL + PAD - 4, PAD - 4]],
    [[S - PAD + 4 - CL, PAD - 4], [S - PAD + 4, PAD - 4], [S - PAD + 4, CL + PAD - 4]],
    [[PAD - 4, S - PAD + 4 - CL], [PAD - 4, S - PAD + 4], [CL + PAD - 4, S - PAD + 4]],
    [[S - PAD + 4 - CL, S - PAD + 4], [S - PAD + 4, S - PAD + 4], [S - PAD + 4, S - PAD + 4 - CL]],
  ];
  corners.forEach(pts => {
    ctx.beginPath(); ctx.moveTo(...pts[0]); ctx.lineTo(...pts[1]); ctx.lineTo(...pts[2]); ctx.stroke();
  });
  ctx.globalAlpha = 1;

  // ── Thin border
  ctx.strokeStyle = col; ctx.globalAlpha = 0.18; ctx.lineWidth = 1;
  ctx.strokeRect(PAD - 4, PAD - 4, S - 2 * PAD + 8, S - 2 * PAD + 8);
  ctx.globalAlpha = 1;

  ctx.textAlign = "center";

  // ── Organisation eyebrow
  ctx.fillStyle = col; ctx.globalAlpha = 0.55; ctx.font = "500 22px Georgia";
  ctx.letterSpacing = "4px";
  ctx.fillText("AL-FURQAAN FOUNDATION CANADA", S / 2, PAD + 44);
  ctx.globalAlpha = 1; ctx.letterSpacing = "0px";

  // ── Day pill
  const pillW = 260, pillH = 42, pillX = (S - pillW) / 2, pillY = PAD + 64;
  ctx.fillStyle = col; ctx.globalAlpha = 0.12;
  ctx.beginPath(); ctx.roundRect(pillX, pillY, pillW, pillH, 21); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = col; ctx.font = "bold 18px Georgia";
  ctx.fillText("DAY " + lesson.day + "  \u00b7  " + lesson.theme.toUpperCase(), S / 2, pillY + 28);

  // ── Divider 1
  const div1Y = pillY + pillH + 28;
  ctx.strokeStyle = col; ctx.globalAlpha = 0.18; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD + 40, div1Y); ctx.lineTo(S - PAD - 40, div1Y); ctx.stroke();
  ctx.globalAlpha = 1;

  // ── Arabic text
  ctx.fillStyle = "#F5F0E8"; ctx.font = "36px 'Traditional Arabic', Georgia, serif";
  const aLines = wrap(ctx, lesson.arabic, S - PAD * 2 - 40);
  let y = div1Y + 52;
  aLines.forEach(l => { ctx.fillText(l, S / 2, y); y += 54; });

  // ── Surah reference
  ctx.fillStyle = col; ctx.globalAlpha = 0.8; ctx.font = "italic 21px Georgia";
  ctx.fillText(lesson.ref, S / 2, y + 8); y += 34;
  ctx.globalAlpha = 0.38; ctx.font = "italic 16px Georgia";
  ctx.fillText("The Clear Qur\u2019an \u2014 Dr. Mustafa Khattab", S / 2, y); y += 14;
  ctx.globalAlpha = 1;

  // ── Divider 2 with centre diamond
  const div2Y = y + 26;
  ctx.strokeStyle = col; ctx.globalAlpha = 0.15; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD + 40, div2Y); ctx.lineTo(S / 2 - 16, div2Y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(S / 2 + 16, div2Y); ctx.lineTo(S - PAD - 40, div2Y); ctx.stroke();
  ctx.globalAlpha = 0.5;
  ctx.save(); ctx.translate(S / 2, div2Y); ctx.rotate(Math.PI / 4);
  ctx.strokeRect(-6, -6, 12, 12);
  ctx.restore();
  ctx.globalAlpha = 1;

  // ── Reflection label
  ctx.fillStyle = col; ctx.globalAlpha = 0.45; ctx.font = "600 14px Georgia";
  ctx.letterSpacing = "4px";
  ctx.fillText("REFLECTION", S / 2, div2Y + 36);
  ctx.globalAlpha = 1; ctx.letterSpacing = "0px";

  // ── Reflection text
  ctx.fillStyle = "#EDE8DF"; ctx.font = "italic 32px Georgia";
  const rLines = wrap(ctx, "\u201c" + reflection + "\u201d", S - PAD * 2 - 20);
  let ry = div2Y + 74;
  rLines.forEach(l => { ctx.fillText(l, S / 2, ry); ry += 50; });

  // ── Attribution name (optional)
  if (name && name.trim()) {
    ry += 6;
    ctx.fillStyle = col; ctx.globalAlpha = 0.7; ctx.font = "22px Georgia";
    ctx.fillText("\u2014 " + name.trim(), S / 2, ry); ry += 36;
    ctx.globalAlpha = 1;
  }

  // ── Bottom brand strip
  const btmY = Math.min(ry + 32, S - PAD - 60);
  ctx.strokeStyle = col; ctx.globalAlpha = 0.15; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD + 40, btmY); ctx.lineTo(S - PAD - 40, btmY); ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = col; ctx.globalAlpha = 0.65; ctx.font = "22px Georgia";
  ctx.fillText("furqaanproject.ca", S / 2, btmY + 38);
  ctx.globalAlpha = 0.3; ctx.font = "16px Georgia";
  ctx.fillText("#10BestDays  \u00b7  #DhulHijjah  \u00b7  #TheClearQuran", S / 2, btmY + 62);
  ctx.globalAlpha = 1;

  return c;
}

// ── SHARE ─────────────────────────────────────────────────────────────────────
function buildCaption(lesson, reflection, name) {
  const nameStr = name && name.trim() ? "\u2014 " + name.trim() : "";
  return (
    "\u2728 Day " + lesson.day + " of the 10 Best Days: " + lesson.theme + "\n\n" +
    lesson.translation + "\n" +
    lesson.ref + " \u2014 The Clear Qur\u2019an\n\n" +
    "\u201c" + reflection + "\u201d " + nameStr + "\n\n" +
    "These are the greatest days of the year. Open The Clear Qur\u2019an and share what moves you.\n\n" +
    "#10BestDays #DhulHijjah #TheClearQuran #AlFurqaanFoundation"
  );
}

async function shareCard(lesson, reflection, name, platform) {
  const canvas = buildCard(lesson, reflection, name);
  const caption = buildCaption(lesson, reflection, name);
  try { await navigator.clipboard.writeText(caption); } catch (_) {}

  return new Promise(resolve => {
    canvas.toBlob(async blob => {
      const file = new File([blob], "10bestdays-day" + lesson.day + ".png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text: platform === "whatsapp" ? caption : "", title: "Day " + lesson.day + " \u2014 " + lesson.theme });
          resolve(); return;
        } catch (e) { if (e.name === "AbortError") { resolve(); return; } }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url;
      a.download = "10bestdays-day" + lesson.day + ".png"; a.click();
      URL.revokeObjectURL(url);
      if (platform === "whatsapp") setTimeout(() => window.open("https://wa.me/?text=" + encodeURIComponent(caption), "_blank"), 600);
      resolve();
    }, "image/png");
  });
}

// ── CRACK ANIMATION ──────────────────────────────────────────────────────────
function CrackOverlay({ active, color, onDone }) {
  useEffect(() => { if (active) { const t = setTimeout(onDone, 850); return () => clearTimeout(t); } }, [active, onDone]);
  if (!active) return null;
  const rays = [
    "M540,540 L280,180","M540,540 L840,160","M540,540 L940,520",
    "M540,540 L800,900","M540,540 L260,860","M540,540 L140,380",
    "M540,540 L680,80","M540,540 L960,740",
  ];
  return (
    <div style={{ position:"absolute",inset:0,zIndex:30,pointerEvents:"none",overflow:"hidden",borderRadius:4 }}>
      <div style={{ position:"absolute",inset:0,background:"radial-gradient(circle at 50% 50%,"+color+"55 0%,transparent 65%)",animation:"dhFlash .85s ease-out forwards" }}/>
      <svg viewBox="0 0 1080 1080" style={{ position:"absolute",inset:0,width:"100%",height:"100%",animation:"dhFade .85s ease-out forwards" }}>
        {rays.map((d,i) => (
          <path key={i} d={d} stroke={color} strokeWidth="2.5" fill="none"
            style={{ strokeDasharray:900,strokeDashoffset:900,animation:"dhCrack .4s ease-out "+(i*.035)+"s forwards" }}/>
        ))}
        <circle cx="540" cy="540" r="8" fill={color} opacity=".7"
          style={{ animation:"dhBurst .85s ease-out forwards" }}/>
      </svg>
      <style>{`
        @keyframes dhFlash{0%{opacity:0}15%{opacity:1}100%{opacity:0}}
        @keyframes dhFade{0%,60%{opacity:1}100%{opacity:0}}
        @keyframes dhCrack{to{stroke-dashoffset:0}}
        @keyframes dhBurst{0%{r:8;opacity:.8}100%{r:340;opacity:0}}
        @keyframes dhReveal{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes dhPulse{0%,100%{box-shadow:0 0 20px rgba(201,168,76,.08)}50%{box-shadow:0 0 52px rgba(201,168,76,.32)}}
      `}</style>
    </div>
  );
}

// ── REFLECTION MODAL ──────────────────────────────────────────────────────────
function ReflectionModal({ lesson, onClose }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [step, setStep] = useState("form"); // form | submitting | success | sharing
  const [sharing, setSharing] = useState(false);
  const col = lesson.color;
  const textareaRef = useRef(null);

  // Focus textarea on open
  useEffect(() => { setTimeout(() => textareaRef.current?.focus(), 100); }, []);

  // Prevent body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setStep("submitting");
    const fd = new FormData();
    fd.append("entry.592856770", name.trim());
    fd.append("entry.1343411792", String(lesson.day));
    fd.append("entry.1633940", text.trim());
    try {
      await fetch(GOOGLE_FORM, { method: "POST", mode: "no-cors", body: fd });
      // Save submitted day
      const sub = load("dh_sub", {});
      sub[lesson.day] = true;
      save("dh_sub", sub);
    } catch (_) {}
    setStep("success");
  }

  async function handleShare(platform) {
    setSharing(true);
    await shareCard(lesson, text.trim(), name.trim(), platform);
    setSharing(false);
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:"fixed",inset:0,zIndex:100,
        background:"rgba(8,10,14,0.88)",
        backdropFilter:"blur(6px)",
        display:"flex",alignItems:"center",justifyContent:"center",
        padding:"20px 16px",overflowY:"auto",
      }}
    >
      <div style={{
        background:"#111318",
        border:"1px solid " + col + "44",
        borderRadius:6,
        width:"100%",maxWidth:520,
        position:"relative",
        animation:"dhReveal .35s ease-out forwards",
        boxShadow:"0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px " + col + "22",
      }}>
        {/* Colour accent bar */}
        <div style={{ height:3,background:"linear-gradient(90deg,transparent," + col + "," + col + ",transparent)",borderRadius:"6px 6px 0 0" }}/>

        {/* Close button */}
        <button onClick={onClose} style={{
          position:"absolute",top:16,right:16,
          background:"transparent",border:"none",
          color:"#4A4840",cursor:"pointer",fontSize:20,lineHeight:1,padding:4,
        }}>&#10005;</button>

        <div style={{ padding:"32px 36px 36px" }}>

          {step === "form" || step === "submitting" ? (
            <>
              {/* Header */}
              <p style={{ fontSize:10,letterSpacing:"3px",color:col,textTransform:"uppercase",marginBottom:6 }}>
                Day {lesson.day} &#183; {lesson.theme}
              </p>
              <h2 style={{ fontSize:22,fontWeight:400,color:"#F0EDE6",marginBottom:6,lineHeight:1.3 }}>
                Share your reflection
              </h2>
              <p style={{ fontSize:12,color:"#9E9A92",lineHeight:1.65,marginBottom:28 }}>
                What did the Qur&#8217;an teach you today? Your reflection will be compiled and shared with the community.
              </p>

              {/* Today's ayah (compact) */}
              <div style={{
                background:"rgba(255,255,255,0.025)",
                border:"1px solid " + col + "28",
                borderLeft:"2px solid " + col,
                borderRadius:3,padding:"12px 14px",marginBottom:24,
              }}>
                <p style={{ fontSize:13,color:"#C8C4BB",fontStyle:"italic",lineHeight:1.7,margin:"0 0 4px" }}>
                  {lesson.translation}
                </p>
                <p style={{ fontSize:10,color:col,opacity:.6,margin:0,letterSpacing:".5px" }}>
                  {lesson.ref} &#8212; The Clear Qur&#8217;an
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div style={{ marginBottom:16 }}>
                  <label style={{ display:"block",fontSize:10,letterSpacing:"2px",color:col,textTransform:"uppercase",marginBottom:7 }}>
                    Your Name <span style={{ color:"#4A4840",letterSpacing:0,fontSize:9 }}>(optional)</span>
                  </label>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="e.g. Fatima A."
                    autocomplete="name" autocorrect="off"
                    style={{
                      display:"block",width:"100%",background:"rgba(255,255,255,0.03)",
                      border:"1px solid rgba(201,168,76,0.2)",borderRadius:3,
                      color:"#F0EDE6",padding:"12px 14px",fontSize:16,
                      fontFamily:"Georgia,serif",outline:"none",boxSizing:"border-box",
                    }}
                  />
                </div>

                {/* Reflection */}
                <div style={{ marginBottom:20 }}>
                  <label style={{ display:"block",fontSize:10,letterSpacing:"2px",color:col,textTransform:"uppercase",marginBottom:7 }}>
                    Your Reflection
                  </label>
                  <textarea
                    ref={textareaRef}
                    value={text} onChange={e => setText(e.target.value)}
                    required maxLength={600}
                    placeholder="Share an ayah, a thought, or a lesson from The Clear Qur'an that spoke to you today..."
                    style={{
                      display:"block",width:"100%",background:"rgba(255,255,255,0.03)",
                      border:"1px solid rgba(201,168,76,0.2)",borderRadius:3,
                      color:"#F0EDE6",padding:"12px 14px",fontSize:16,lineHeight:1.6,
                      fontFamily:"Georgia,serif",outline:"none",resize:"vertical",
                      minHeight:120,boxSizing:"border-box",
                    }}
                  />
                  <p style={{ fontSize:10,color:"#4A4840",textAlign:"right",marginTop:4 }}>
                    {text.length} / 600
                  </p>
                </div>

                <button type="submit" disabled={step === "submitting" || !text.trim()} style={{
                  width:"100%",background: text.trim() ? col : "rgba(201,168,76,0.2)",
                  color: text.trim() ? "#0E1117" : "#4A4840",
                  border:"none",borderRadius:3,padding:"14px 24px",
                  fontSize:11,letterSpacing:"2.5px",textTransform:"uppercase",
                  fontFamily:"Georgia,serif",fontWeight:700,
                  cursor: text.trim() ? "pointer" : "default",
                  transition:"background .2s,color .2s",
                }}>
                  {step === "submitting" ? "Sending\u2026" : "Submit Reflection"}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* SUCCESS */}
              <div style={{ textAlign:"center" }}>
                {/* Arabic thank you */}
                <p style={{ fontSize:28,color:"#F0EDE6",marginBottom:4,direction:"rtl" }}>
                  &#x062C;&#x0632;&#x0627;&#x0643; &#x0627;&#x0644;&#x0644;&#x0647; &#x062E;&#x064A;&#x0631;&#x064B;&#x0627;
                </p>
                <p style={{ fontSize:13,color:col,marginBottom:16,letterSpacing:"1px" }}>
                  Jazakallahu Khayran
                </p>
                <p style={{ fontSize:13,color:"#9E9A92",lineHeight:1.75,marginBottom:28 }}>
                  Your reflection has been received.<br/>
                  May Allah accept your ibadah during these blessed days.
                </p>

                {/* Share section */}
                <div style={{
                  background:"rgba(255,255,255,0.025)",
                  border:"1px solid " + col + "22",
                  borderRadius:4,padding:"20px",marginBottom:24,
                }}>
                  <p style={{ fontSize:10,letterSpacing:"3px",color:col,textTransform:"uppercase",marginBottom:8 }}>
                    Share with family &#38; friends
                  </p>
                  <p style={{ fontSize:12,color:"#9E9A92",marginBottom:16,lineHeight:1.6 }}>
                    Your card is ready &#8212; caption copies automatically when you tap.
                    {name.trim() && (
                      <span style={{ color:col,opacity:.7 }}> Your name is included.</span>
                    )}
                  </p>

                  <div style={{ display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap" }}>
                    {/* WhatsApp */}
                    <button onClick={() => handleShare("whatsapp")} disabled={sharing} style={{
                      flex:1,minWidth:140,display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                      background:"#25D366",color:"#fff",border:"none",borderRadius:3,
                      padding:"13px 18px",fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase",
                      fontFamily:"Georgia,serif",fontWeight:700,cursor:"pointer",opacity:sharing?.6:1,
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.85L.057 23.516a.5.5 0 0 0 .612.612l5.666-1.474A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.67-.523-5.183-1.43l-.372-.22-3.862 1.005 1.006-3.744-.242-.386A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                      </svg>
                      WhatsApp
                    </button>

                    {/* Instagram */}
                    <button onClick={() => handleShare("instagram")} disabled={sharing} style={{
                      flex:1,minWidth:140,display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                      background:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
                      color:"#fff",border:"none",borderRadius:3,
                      padding:"13px 18px",fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase",
                      fontFamily:"Georgia,serif",fontWeight:700,cursor:"pointer",opacity:sharing?.6:1,
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <circle cx="12" cy="12" r="4"/>
                        <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
                      </svg>
                      Instagram
                    </button>
                  </div>
                </div>

                {/* Submit another — closes modal, returns to day cards */}
                <button onClick={onClose} style={{
                  background:"transparent",
                  border:"1px solid rgba(201,168,76,0.28)",
                  borderRadius:3,color:col,
                  padding:"12px 28px",fontSize:11,letterSpacing:"2px",
                  textTransform:"uppercase",fontFamily:"Georgia,serif",
                  cursor:"pointer",width:"100%",
                }}>
                  &#8617; Submit Another Reflection
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── LESSON CARD ───────────────────────────────────────────────────────────────
function LessonCard({ lesson, status, onReveal, onReflect, onDownload, dlActive }) {
  const col = lesson.color;
  const revealed = status === "past" || status === "current-revealed";

  return (
    <div style={{
      background:"#111318",
      border:"1px solid " + (status === "current-locked" ? col : revealed ? "rgba(201,168,76,0.2)" : "rgba(201,168,76,0.08)"),
      borderRadius:4,padding:"26px 22px",
      position:"relative",overflow:"hidden",
      animation: status === "current-revealed" ? "dhReveal .55s ease-out" : status === "current-locked" ? "dhPulse 2.5s ease-in-out infinite" : "none",
    }}>
      {/* Corner accent */}
      <div style={{ position:"absolute",top:0,right:0,width:36,height:36,borderBottom:"1px solid "+col,borderLeft:"1px solid "+col,opacity:.22,pointerEvents:"none" }}/>

      {status === "current-locked" ? (
        // ── SEALED ───────────────────────────────
        <>
          <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:.05,pointerEvents:"none" }} xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id={"g"+lesson.day} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <polygon points="40,2 78,22 78,58 40,78 2,58 2,22" fill="none" stroke={col} strokeWidth="0.8"/>
            </pattern></defs>
            <rect width="100%" height="100%" fill={"url(#g"+lesson.day+")"}/>
          </svg>
          <div style={{ textAlign:"center",padding:"18px 0" }}>
            <p style={{ fontSize:10,letterSpacing:"4px",color:col,textTransform:"uppercase",marginBottom:6 }}>Today &#8212; Day {lesson.day}</p>
            <p style={{ fontSize:20,color:"#F0EDE6",fontWeight:400,marginBottom:18 }}>{lesson.theme}</p>
            <div style={{ margin:"0 auto 18px",width:64,height:64 }}>
              <svg viewBox="0 0 72 72" fill="none" style={{ width:"100%",height:"100%" }}>
                <circle cx="36" cy="36" r="33" stroke={col} strokeWidth="1.5" opacity=".5"/>
                <circle cx="36" cy="36" r="25" stroke={col} strokeWidth="1" opacity=".3"/>
                {[0,45,90,135,180,225,270,315].map((a,i)=>{
                  const x1=36+33*Math.cos(a*Math.PI/180),y1=36+33*Math.sin(a*Math.PI/180);
                  const x2=36+27*Math.cos(a*Math.PI/180),y2=36+27*Math.sin(a*Math.PI/180);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth="1.5" opacity=".55"/>;
                })}
                <text x="36" y="41" textAnchor="middle" fill={col} fontSize="20" fontFamily="Georgia,serif" opacity=".9">&#9733;</text>
              </svg>
            </div>
            <p style={{ fontSize:12,color:"#9E9A92",lineHeight:1.7,maxWidth:260,margin:"0 auto 22px" }}>
              Today&#8217;s lesson from The Clear Qur&#8217;an is sealed. Open it when you&#8217;re ready to reflect.
            </p>
            <button onClick={onReveal} style={{
              background:col,color:"#0E1117",border:"none",borderRadius:3,
              padding:"12px 32px",fontSize:11,letterSpacing:"2.5px",
              textTransform:"uppercase",fontFamily:"Georgia,serif",fontWeight:700,cursor:"pointer",
            }}>
              Reveal Today&#8217;s Ayah
            </button>
          </div>
        </>
      ) : (
        // ── REVEALED ─────────────────────────────
        <>
          {/* Tag row */}
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
            <span style={{ fontSize:10,letterSpacing:"3px",color:col,textTransform:"uppercase" }}>Day {lesson.day}</span>
            <span style={{ color:col,opacity:.3,fontSize:"6px" }}>&#9679;</span>
            <span style={{ fontSize:10,letterSpacing:"2px",color:"#9E9A92",textTransform:"uppercase" }}>{lesson.theme}</span>
          </div>

          {/* Arabic */}
          <p style={{ fontSize:"clamp(15px,2.4vw,19px)",lineHeight:1.9,color:"#F0EDE6",direction:"rtl",textAlign:"right",margin:"0 0 10px",opacity:.95 }}>
            {lesson.arabic}
          </p>

          {/* Ref */}
          <p style={{ fontSize:11,color:col,opacity:.75,margin:"0 0 14px" }}>{lesson.ref}</p>

          {/* Translation */}
          <div style={{ borderLeft:"2px solid "+col,paddingLeft:12,marginBottom:5 }}>
            <p style={{ fontSize:13,lineHeight:1.8,color:"#C8C4BB",fontStyle:"italic",margin:0 }}>{lesson.translation}</p>
          </div>
          <p style={{ fontSize:10,color:col,opacity:.4,textAlign:"right",margin:"4px 0 14px",fontStyle:"italic" }}>
            The Clear Qur&#8217;an &#8212; Dr. Mustafa Khattab
          </p>

          {/* Reflect */}
          <p style={{ fontSize:12,lineHeight:1.75,color:"#9E9A92",margin:"0 0 12px" }}>
            <span style={{ color:col,fontSize:10,letterSpacing:"1px",textTransform:"uppercase" }}>Reflect &#8594;&#160;</span>
            {lesson.reflect}
          </p>

          {/* Related ayaat */}
          <div style={{ background:"rgba(255,255,255,0.02)",border:"1px solid rgba(201,168,76,0.1)",borderRadius:3,padding:"10px 12px",marginBottom:18 }}>
            <p style={{ fontSize:10,letterSpacing:"2px",color:col,textTransform:"uppercase",opacity:.5,marginBottom:7 }}>
              Explore further
            </p>
            {lesson.related.map((r,i) => (
              <p key={i} style={{ fontSize:11,color:"#6A6860",lineHeight:1.6,margin: i > 0 ? "5px 0 0" : 0 }}>
                <span style={{ color:"#9E9A92" }}>{r.ref}</span>
                <span style={{ color:"rgba(201,168,76,0.35)" }}> &#8212; </span>
                {r.note}
              </p>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display:"flex",gap:8 }}>
            <button onClick={() => onReflect(lesson)} style={{
              flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,
              background:col,color:"#0E1117",border:"none",borderRadius:3,
              padding:"11px 14px",fontSize:10,letterSpacing:"2px",textTransform:"uppercase",
              fontFamily:"Georgia,serif",fontWeight:700,cursor:"pointer",
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/>
              </svg>
              Submit Reflection
            </button>
            <button onClick={() => onDownload(lesson)} disabled={dlActive} style={{
              flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,
              background:"transparent",color:col,
              border:"1px solid "+col+"40",borderRadius:3,
              padding:"11px 14px",fontSize:10,letterSpacing:"2px",textTransform:"uppercase",
              fontFamily:"Georgia,serif",cursor:dlActive?"default":"pointer",opacity:dlActive?.45:1,
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {dlActive ? "Generating\u2026" : "Save PNG"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function TenDays() {
  const width = useWidth();
  const cols = width >= 640 ? 2 : 1;
  const currentDay = getCurrentDay();

  const [revealed, setRevealed] = useState(() => load("dh_rev", {}));
  const [cracking, setCracking] = useState(null);
  const [dlDay, setDlDay]       = useState(null);
  const [modal, setModal]       = useState(null); // lesson object or null

  const handleReveal   = useCallback(day => setCracking(day), []);
  const handleReflect  = useCallback(lesson => setModal(lesson), []);
  const handleModalClose = useCallback(() => setModal(null), []);

  const onCrackDone = useCallback(() => {
    const d = cracking; setCracking(null);
    const next = { ...revealed, [d]: true };
    setRevealed(next); save("dh_rev", next);
  }, [cracking, revealed]);

  const handleDownload = useCallback(async lesson => {
    setDlDay(lesson.day);
    const canvas = buildCard(lesson, lesson.reflect, "");
    const a = document.createElement("a");
    a.download = "10bestdays-day" + lesson.day + ".png";
    a.href = canvas.toDataURL("image/png");
    a.click();
    setDlDay(null);
  }, []);

  const getStatus = day => {
    if (day < currentDay) return "past";
    if (day > currentDay) return "future";
    return revealed[day] ? "current-revealed" : "current-locked";
  };

  const visible  = LESSONS.filter(l => getStatus(l.day) !== "future");
  const upcoming = LESSONS.filter(l => getStatus(l.day) === "future");

  return (
    <div style={{ background:"#0C0F14",minHeight:"100vh",fontFamily:"Georgia,serif",color:"#F0EDE6" }}>

      {/* Ambient glow */}
      <div style={{ position:"fixed",top:-200,left:"50%",transform:"translateX(-50%)",width:600,height:500,background:"radial-gradient(ellipse,rgba(201,168,76,0.06) 0%,transparent 70%)",pointerEvents:"none",zIndex:0 }}/>

      {/* Modal */}
      {modal && <ReflectionModal lesson={modal} onClose={handleModalClose}/>}

      <div style={{ position:"relative",zIndex:1,maxWidth:900,margin:"0 auto",padding:"56px 20px 80px" }}>

        {/* Header */}
        <div style={{ textAlign:"center",marginBottom:52 }}>
          <span style={{ fontSize:10,letterSpacing:"4px",color:"#C9A84C",textTransform:"uppercase",display:"block",marginBottom:18 }}>
            Al-Furqaan Foundation Canada &#183; The Clear Qur&#8217;an
          </span>
          <h1 style={{ fontSize:"clamp(30px,5.5vw,54px)",fontWeight:400,lineHeight:1.15,margin:"0 0 4px",color:"#F0EDE6" }}>
            10 Best Days.
          </h1>
          <h1 style={{ fontSize:"clamp(30px,5.5vw,54px)",fontWeight:400,lineHeight:1.15,margin:"0 0 24px",color:"#C9A84C" }}>
            10 Lessons from the Qur&#8217;an.
          </h1>
          <p style={{ fontSize:14,lineHeight:1.75,color:"#9E9A92",maxWidth:480,margin:"0 auto 12px" }}>
            The greatest days of the year. One lesson each day &#8212; open The Clear Qur&#8217;an and reflect.
          </p>
          <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(201,168,76,0.06)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:3,padding:"8px 20px" }}>
            <span style={{ fontSize:10,letterSpacing:"2px",color:"#C9A84C",textTransform:"uppercase" }}>Today</span>
            <span style={{ color:"rgba(201,168,76,0.3)",fontSize:"7px" }}>&#9679;</span>
            <span style={{ fontSize:14,color:"#F0EDE6" }}>Day {currentDay} of 10</span>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat("+cols+",1fr)",gap:16,alignItems:"start",marginBottom:16 }}>
          {visible.map(lesson => {
            const status = getStatus(lesson.day);
            const isCracking = cracking === lesson.day;
            return (
              <div key={lesson.day} style={{ position:"relative" }}>
                <CrackOverlay active={isCracking} color={lesson.color} onDone={onCrackDone}/>
                <LessonCard
                  lesson={lesson}
                  status={isCracking ? "current-locked" : status}
                  onReveal={() => handleReveal(lesson.day)}
                  onReflect={handleReflect}
                  onDownload={handleDownload}
                  dlActive={dlDay === lesson.day}
                />
              </div>
            );
          })}
        </div>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div style={{ background:"#111318",border:"1px solid rgba(201,168,76,0.07)",borderRadius:4,padding:"20px 24px",textAlign:"center" }}>
            <p style={{ fontSize:10,letterSpacing:"3px",color:"#2E2C28",textTransform:"uppercase",marginBottom:12 }}>Upcoming</p>
            <div style={{ display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap" }}>
              {upcoming.map(l => (
                <div key={l.day} style={{ border:"1px solid rgba(201,168,76,0.07)",borderRadius:3,padding:"7px 14px" }}>
                  <span style={{ fontSize:10,color:"#282620",letterSpacing:"1px" }}>Day {l.day}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign:"center",marginTop:48,paddingTop:28,borderTop:"1px solid rgba(201,168,76,0.07)" }}>
          <p style={{ fontSize:11,color:"#3A3830",letterSpacing:"1px",marginBottom:4 }}>furqaanproject.ca &#183; Al-Furqaan Foundation Canada</p>
          <p style={{ fontSize:10,color:"#2A2820" }}>The Clear Qur&#8217;an &#8212; Dr. Mustafa Khattab</p>
        </div>
      </div>
    </div>
  );
}
