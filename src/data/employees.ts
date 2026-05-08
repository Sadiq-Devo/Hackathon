export type Employee = {
  id: string
  name: string
  title: string
  email: string
  level: 1 | 2 | 3
  initials: string
  color: string
  bio: string[]
  recentActivity: string
  isYou?: boolean
  image?: string
}

export const COMPANY_DOMAIN = 'nexus-solutions.com'

export const employees: Employee[] = [
  {
    id: 'richard',
    name: 'Richard Calloway',
    title: 'CEO',
    email: 'r.calloway@nexus-solutions.com',
    level: 1,
    initials: 'RC',
    color: '#1a73e8',
    bio: [
      '11 years as CEO, loves buzzwords',
      'Prints out his emails',
      'Constantly traveling, emails from airports',
      'Favorite word: "synergy"',
    ],
    recentActivity: 'In Singapore, back Friday',
    image: '/employees/Richard.png',
  },
  {
    id: 'marcus',
    name: 'Marcus Osei',
    title: 'CTO',
    email: 'm.osei@nexus-solutions.com',
    level: 2,
    initials: 'MO',
    color: '#0f9d58',
    bio: [
      'Built 3 startups, one succeeded',
      'Hates long meetings',
      'Sends short, technical emails',
      'Motto: "Could\'ve been an email"',
    ],
    recentActivity: 'Rolling out new VPN system',
    image: '/employees/Marcus%20Osei.png',
  },
  {
    id: 'diana',
    name: 'Diana Chen',
    title: 'CFO',
    email: 'd.chen@nexus-solutions.com',
    level: 2,
    initials: 'DC',
    color: '#e37400',
    bio: [
      'Says no to every budget request',
      'Said no to the coffee machine for 4 years',
      'Always 90 seconds late to meetings',
      'Only fears: a bad quarter',
    ],
    recentActivity: 'Q4 budget review in progress',
    image: '/employees/Diana%20Chen.png',
  },
  {
    id: 'sandra',
    name: 'Sandra Kowalski',
    title: 'HR Manager',
    email: 's.kowalski@nexus-solutions.com',
    level: 2,
    initials: 'SK',
    color: '#9334e9',
    bio: [
      'Holds the whole office together',
      'Door always open, coffee always on',
      'Has seen things. Says nothing.',
    ],
    recentActivity: 'Onboarding 3 new hires this month',
    image: '/employees/Sandra%20Kowalsk.png',
  },
  {
    id: 'priya',
    name: 'Priya Nair',
    title: 'Head of IT Security',
    email: 'p.nair@nexus-solutions.com',
    level: 3,
    initials: 'PN',
    color: '#d93025',
    bio: [
      'Reason your passwords need 14 characters',
      'Warns you daily. You don\'t listen.',
      'Coffee mug: "I told you so"',
      'Plays CTF competitions',
    ],
    recentActivity: 'Running phishing awareness training',
    image: '/employees/Priya%20Nair.png',
  },
  {
    id: 'helena',
    name: 'Helena Voss',
    title: 'Legal',
    email: 'h.voss@nexus-solutions.com',
    level: 3,
    initials: 'HV',
    color: '#00796b',
    bio: [
      'Reads every line of every contract',
      'Never says "yes", always "it depends"',
      'Email signature longer than the contracts',
      'Rick is a little scared of her',
    ],
    recentActivity: 'Reviewing vendor contracts',
    image: '/employees/Helena%20Voss.png',
  },
  {
    id: 'you',
    name: 'You',
    title: 'HR Specialist',
    email: 'you@nexus-solutions.com',
    level: 3,
    initials: 'ME',
    color: '#1a73e8',
    isYou: true,
    bio: [
      'Works closely with Sandra',
      'Responsible for IT security training (ironic)',
      'Replies to emails same day',
      'Favorite meeting: the one that gets cancelled',
    ],
    recentActivity: 'Completing phishing awareness training',
    image: '/employees/ME.png',
  },
]

export function findEmployeeByEmail (from: string): Employee | undefined {
  const lower = from.toLowerCase().trim()
  return employees.find((emp) => emp.email.toLowerCase() === lower)
}
