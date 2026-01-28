import angelImg from "../assets/heroImage/angel.png";
import citizenImg from "../assets/heroImage/citizen.png";
import detectiveImg from "../assets/heroImage/detective.png";
import doctorImg from "../assets/heroImage/doctor.png";
import doctorLectoImg from "../assets/heroImage/doctorLecto.png";
import generalImg from "../assets/heroImage/general.png";
import godfatherImg from "../assets/heroImage/father.png";
import hardHealthImg from "../assets/heroImage/hardHealth.png";
import jokerImg from "../assets/heroImage/joker.png";
import mafiaImg from "../assets/heroImage/mafia.png";
import morenoImg from "../assets/heroImage/moreno.png";
import negotiatorImg from "../assets/heroImage/negotiator.png";
import priestImg from "../assets/heroImage/priest.png";
import silencerImg from "../assets/heroImage/silencer.png";
import sniperImg from "../assets/heroImage/sniper.png";
import terroristImg from "../assets/heroImage/terorrist.png";
import wizardImg from "../assets/heroImage/wizard.png";
import type { ActionType } from "./actionType";

import type { RoleFaction } from "./roleFaction";
import type { RoleId } from "./roleId";

export interface Role {
  id: RoleId;
  name: string;
  description: string;
  image: string;
  faction: RoleFaction;
  actions: ActionType[];
  player?: string;
}

export const roles: Role[] = [
  //citizen
  {
    id: "citizen",
    name: "شهروند ساده",
    description: [
      "نقش عادی شهر.",
      "قدرت شبانه ندارد؛ وظیفه‌اش تحلیل، صحبت و رأی‌دادن برای پیدا کردن مافیاست.",
    ].join("\n"),
    image: citizenImg,
    faction: "city",
    actions: ["none"],
  },

  {
    id: "detective",
    name: "کلانتر (استعلام‌گیر)",
    description: [
      "هر شب می‌تواند استعلام یک نفر را از راوی بگیرد.",
      "خروجی استعلام فقط دو حالت دارد: «شهر» یا «مافیا».",
      "گادفادر و جوکر همیشه در استعلام «شهر» دیده می‌شوند (منفی می‌آیند).",
    ].join("\n"),
    image: detectiveImg,
    faction: "city",
    actions: ["investigate"],
  },

  {
    id: "doctor",
    name: "پزشک",
    description: [
      "هر شب می‌تواند یک نفر را نجات دهد تا در برابر «تیر/شلیک‌های معمولی» همان شب حذف نشود.",
      "نمی‌تواند خودش را نجات دهد.",
      "نمی‌تواند دو شب پشت سر هم یک نفر را نجات دهد.",
      "سلاخی قابل نجات نیست.",
    ].join("\n"),
    image: doctorImg,
    faction: "city",
    actions: ["health"],
  },

  {
    id: "sniper",
    name: "تک‌تیرانداز",
    description: [
      "در کل بازی 2 تیر دارد و در هر شب فقط می‌تواند 1 تیر شلیک کند.",
      "اگر به مافیا شلیک کند، تیر به هدف برخورد می‌کند و هدف حذف می‌شود (مگر نجات شود).",
      "اگر به شهر شلیک کند، تیر برمی‌گردد و خود تک‌تیرانداز حذف می‌شود.",
      "مرگ‌های ناشی از تیر (چه خودش، چه هدف) با پزشک یا دکتر لکتو قابل نجات است.",
      "اگر با تیر از بازی برود و با فرشته برگردد، فقط 1 تیر باقی‌مانده خواهد داشت.",
    ].join("\n"),
    image: sniperImg,
    faction: "city",
    actions: ["shot"],
  },

  {
    id: "hardHealth",
    name: "زره‌پوش (ضدگلوله)",
    description: [
      "در برابر اولین «تیر/شلیک معمولی» در طول بازی نمی‌میرد و فقط زره‌اش مصرف می‌شود.",
      "بار دوم که تیر بخورد حذف می‌شود.",
      "اگر سلاخی شود همان بار اول حذف می‌شود (زره بی‌اثر).",
    ].join("\n"),
    image: hardHealthImg,
    faction: "city",
    actions: ["armor"],
  },

  {
    id: "wizard",
    name: "جادوگر",
    description: [
      "اولین نفر اکشن‌دار در شب است.",
      "هر شب یک نفر را طلسم می‌کند.",
      "فرد طلسم‌شده همان شب نمی‌تواند از قدرت شبانه‌اش استفاده کند (استعلام/نجات/شلیک/سایلنت/خریداری و ...).",
    ].join("\n"),
    image: wizardImg,
    faction: "city",
    actions: ["block"],
  },

  {
    id: "angel",
    name: "فرشته",
    description: [
      "فرشته یک بار در کل بازی می‌تواند در شب، یک نفر را که «فقط با رأی‌گیری روز» از بازی حذف شده است به بازی برگرداند.",
      "بازیکن سلاخی‌شده قابل بازگشت نیست.",
      "بازیکنِ برگشته با همان نقش قبلی برمی‌گردد و از روز بعد بازی می‌کند.",
    ].join("\n"),
    image: angelImg,
    faction: "city",
    actions: ["revengeOnVoteOut"],
  },

  {
    id: "general",
    name: "ژنرال",
    description: [
      "هر شب یک نفر را انتخاب می‌کند تا راوی او را بیدار کند و به ژنرال معرفی شود.",
      "ژنرال نقش طرف را نمی‌فهمد؛ فقط ریسک می‌کند.",
      "اگر ژنرال یک مافیا را بیدار کند، خودش همان شب حذف می‌شود.",
    ].join("\n"),
    image: generalImg,
    faction: "city",
    actions: ["riskWake"],
  },

  {
    id: "moreno",
    name: "مورنو (پخش اسلحه)",
    description: [
      "یک بار در کل بازی می‌تواند در شب اسلحه پخش کند:",
      "یک اسلحه واقعی و یک اسلحه مشقی (بین دو نفر مختلف).",
      "دارنده اسلحه می‌تواند تا آخر بازی هر وقت خواست (طبق قانون راوی/اپ) از اسلحه‌اش استفاده کند.",
    ].join("\n"),
    image: morenoImg,
    faction: "city",
    actions: ["giveItem"],
  },

  {
    id: "priest",
    name: "کشیش",
    description: [
      "هر شب یک نفر را انتخاب می‌کند.",
      "اگر آن نفر برای روز بعد سایلنت شده باشد، کشیش سایلنت را رفع می‌کند.",
      "اگر سایلنت نشده باشد، کشیش روی او «برکت» می‌گذارد تا شب بعد قدرتش دو برابر شود.",
    ].join("\n"),
    image: priestImg,
    faction: "city",
    actions: ["buffOrCleanse"],
  },

  //mafia

  {
    id: "mafia",
    name: "مافیای ساده",
    description: [
      "عضو تیم مافیا.",
      "قدرت شبانه مستقل ندارد.",
      "شب معارفه برای شناخت تیم بیدار می‌شود.",
      "از شب‌های بعد همراه گادفادر برای هماهنگی بیدار می‌شود.",
    ].join("\n"),
    image: mafiaImg,
    faction: "mafia",
    actions: ["none"],
  },

  {
    id: "godFather",
    name: "گادفادر (پدرخوانده)",
    description: [
      "رهبر اصلی مافیاست.",
      "هر شب یک اکشن اصلی دارد: یا «تیر» یا «سلاخی».",
      "تنها کسی است که استعلامش همیشه منفی (شهر) می‌آید.",
      "اگر گادفادر از بازی خارج شود، تیم مافیا دیگر هیچ شلیک/سلاخی‌ای در شب ندارد.",
      "سلاخی: هدف + حدس نقش؛ اگر حدس درست باشد هدف سلاخی می‌شود و قابل نجات/بازگشت نیست.",
      "طبق سناریو: بعد از شب معارفه، گادفادر همراه «مافیای ساده» برای هماهنگی بیدار می‌شود.",
    ].join("\n"),
    image: godfatherImg,
    faction: "mafia",
    actions: ["shot", "alwaysNegative", "slaughter"],
  },

  {
    id: "doctorLecto",
    name: "دکتر لکتو",
    description: [
      "پزشک تیم مافیا.",
      "هر شب می‌تواند یک نفر از اعضای مافیا را نجات دهد تا در برابر تیر/شلیک‌های معمولی همان شب حذف نشود.",
      "می‌تواند پشت سر هم یک نفر را نجات دهد.",
      "سلاخی قابل نجات نیست.",
      "طبق سناریو: فقط شب معارفه و شبی که «خریداری موفق» باشد با تیم مافیا بیدار می‌شود؛ در غیر این صورت جداگانه اکشن می‌دهد.",
    ].join("\n"),
    image: doctorLectoImg,
    faction: "mafia",
    actions: ["health"],
  },

  {
    id: "negotiator",
    name: "مذاکره‌کننده",
    description: [
      "عضو تیم مافیا.",
      "یک بار در کل بازی می‌تواند شب تلاش کند «یک شهروند ساده» را خریداری کند.",
      "اگر هدف واقعاً شهروند ساده باشد، خریداری موفق است و او از آن به بعد عضو تیم مافیا می‌شود.",
      "اگر هدف شهروند ساده نباشد، تلاش ناموفق می‌شود و شانس مذاکره‌کننده می‌سوزد.",
      "طبق سناریو: فقط شب معارفه و شبی که «خریداری موفق» باشد با تیم مافیا بیدار می‌شود؛ در غیر این صورت جداگانه اکشن می‌دهد.",
    ].join("\n"),
    image: negotiatorImg,
    faction: "mafia",
    actions: ["recruit"],
  },

  {
    id: "silencer",
    name: "سایلنسر",
    description: [
      "هر شب یک نفر را انتخاب می‌کند تا در روز بعد سایلنت باشد (حق صحبت ندارد).",
      "سایلنت فقط برای همان روز بعد است و سپس خودبه‌خود تمام می‌شود.",
      "طبق سناریو: فقط شب معارفه و شبی که «خریداری موفق» باشد با تیم مافیا بیدار می‌شود؛ در غیر این صورت جداگانه اکشن می‌دهد.",
    ].join("\n"),
    image: silencerImg,
    faction: "mafia",
    actions: ["silence"],
  },

  {
    id: "terrorist",
    name: "تروریست",
    description: [
      "عضو تیم مافیا.",
      "قدرت شبانه ندارد (فقط شب معارفه برای شناخت تیم بیدار می‌شود).",
      "اگر در روز با رأی‌گیری از بازی خارج شود، می‌تواند یک نفر دیگر را هم با خودش حذف کند.",
    ].join("\n"),
    image: terroristImg,
    faction: "mafia",
    actions: ["revengeOnVoteOut"],
  },

  //independent
  {
    id: "joker",
    name: "جوکر",
    description: [
      "نقش مستقل.",
      "شب معارفه یک نفر را به عنوان «ضامن» انتخاب می‌کند.",
      "به محض اینکه ضامن از بازی خارج شود (به هر دلیل)، جوکر در شب‌ها در برابر «تیر» و «سلاخی» نمی‌میرد (فقط شبانه).",
      "جوکر فقط در شب‌های زوج (2،4،6،...) بیدار می‌شود و می‌تواند تیر بزند یا سلاخی کند (مثل گادفادر).",
      "استعلام کلانتر: جوکر همیشه «شهر» دیده می‌شود.",
      "شرط برد: اگر 3 نفر آخر به حالت‌های تعریف‌شده برسد (جوکر+2شهر یا جوکر+1شهر+1مافیا) جوکر می‌برد؛ اگر جوکر+2مافیا بمانند مافیا می‌برد.",
    ].join("\n"),
    image: jokerImg,
    faction: "independent",
    actions: ["shot","nightImmunityTriggered"],
  },
];

export default roles;
