import angelImg from '../assets/heroImage/angel.png'
import citizenImg from '../assets/heroImage/citizen.png'
import detectiveImg from '../assets/heroImage/detective.png'
import doctorImg from '../assets/heroImage/doctor.png'
import doctorLectoImg from '../assets/heroImage/doctorLecto.png'
import generalImg from '../assets/heroImage/general.png'
import godFatherImg from '../assets/heroImage/godFather.png'
import hardHealthImg from '../assets/heroImage/hardHealth.png'
import jokerImg from '../assets/heroImage/joker.png'
import mafiaImg from '../assets/heroImage/mafia.png'
import morenoImg from '../assets/heroImage/moreno.png'
import negotiatorImg from '../assets/heroImage/negotiator.png'
import priestImg from '../assets/heroImage/priest.png'
import silencerImg from '../assets/heroImage/silencer.png'
import sniperImg from '../assets/heroImage/sniper.png'
import terroristImg from '../assets/heroImage/terorrist.png'
import wizardImg from '../assets/heroImage/wizard.png'

export type RoleFaction = 'city' | 'mafia' | 'independent'

export type RoleId =
  | 'angel'
  | 'citizen'
  | 'detective'
  | 'doctor'
  | 'doctorLecto'
  | 'general'
  | 'godFather'
  | 'hardHealth'
  | 'joker'
  | 'mafia'
  | 'moreno'
  | 'negotiator'
  | 'priest'
  | 'silencer'
  | 'sniper'
  | 'terrorist'
  | 'wizard'

export interface Role {
  id: RoleId
  name: string
  description: string
  image: string
  faction: RoleFaction
}

export const roles: Role[] = [
  {
    id: 'angel',
    name: 'فرشته',
    description: 'یک بار در شب می‌تواند جان یک نفر را از حمله حفظ کند.',
    image: angelImg,
    faction: 'city',
  },
  {
    id: 'citizen',
    name: 'شهروند ساده',
    description: 'نقش عادی شهر؛ وظیفه‌اش پیدا کردن مافیاست.',
    image: citizenImg,
    faction: 'city',
  },
  {
    id: 'detective',
    name: 'کارآگاه',
    description: 'هر شب هویت یک نفر را بررسی می‌کند.',
    image: detectiveImg,
    faction: 'city',
  },
  {
    id: 'doctor',
    name: 'پزشک',
    description: 'هر شب می‌تواند یک نفر را درمان و زنده نگه دارد.',
    image: doctorImg,
    faction: 'city',
  },
  {
    id: 'doctorLecto',
    name: 'دکتر لکتر',
    description: 'پزشک مستقل با توانایی درمان محدود و مرموز.',
    image: doctorLectoImg,
    faction: 'mafia',
  },
  {
    id: 'general',
    name: 'ژنرال',
    description: 'رهبر نظامی شهر با حق فرمان ویژه در مواقع بحران.',
    image: generalImg,
    faction: 'city',
  },
  {
    id: 'godFather',
    name: 'پدرخوانده',
    description: 'رهبر اصلی مافیا؛ تصمیم نهایی حمله را می‌گیرد.',
    image: godFatherImg,
    faction: 'mafia',
  },
  {
    id: 'hardHealth',
    name: 'ضدگلوله',
    description: 'در برابر اولین شلیک شب مصون است.',
    image: hardHealthImg,
    faction: 'city',
  },
  {
    id: 'joker',
    name: 'جوکر',
    description: 'نقش مستقل؛ با حذف شدن در روز برنده می‌شود.',
    image: jokerImg,
    faction: 'independent',
  },
  {
    id: 'mafia',
    name: 'مافیا',
    description: 'عضو تیم مافیا؛ در شب با هم‌تیمی‌ها هماهنگ می‌شود.',
    image: mafiaImg,
    faction: 'mafia',
  },
  {
    id: 'moreno',
    name: 'مورنو',
    description: 'نفوذی زیرک که رد خود را پنهان می‌کند.',
    image: morenoImg,
    faction: 'mafia',
  },
  {
    id: 'negotiator',
    name: 'مذاکره‌کننده',
    description: 'با گفتگو تلاش می‌کند اعدام روز را تغییر دهد.',
    image: negotiatorImg,
    faction: 'city',
  },
  {
    id: 'priest',
    name: 'کشیش',
    description: 'با دعای شبانه می‌تواند یک نفر را از مرگ معنوی نجات دهد.',
    image: priestImg,
    faction: 'city',
  },
  {
    id: 'silencer',
    name: 'سایلنسر',
    description: 'قدرت ساکت کردن یک نفر در روز بعد را دارد.',
    image: silencerImg,
    faction: 'mafia',
  },
  {
    id: 'sniper',
    name: 'تک‌تیرانداز',
    description: 'یک شلیک دقیق در طول بازی برای حذف هدف دارد.',
    image: sniperImg,
    faction: 'city',
  },
  {
    id: 'terrorist',
    name: 'تروریست',
    description: 'در لحظه حذف می‌تواند یک نفر را با خود نابود کند.',
    image: terroristImg,
    faction: 'mafia',
  },
  {
    id: 'wizard',
    name: 'جادوگر',
    description: 'توانایی‌های ویژه برای دستکاری جریان بازی دارد.',
    image: wizardImg,
    faction: 'city',
  },
]

export default roles
