import { useEffect, useMemo, useState } from 'react'
import { emailTemplates, type Email, type EmailType } from './data/emailTemplates'
import './App.css'
import correctSound from './assets/audio/Correct.mp3'
import incorrectSound from './assets/audio/Incorrect.mp3'
import mouseClickSound from './assets/audio/Mouseclick.mp3'
import popSound from './assets/audio/Pop.mp3'
import boomImage from './assets/effects/Boom.avif'
import fishGif from './assets/effects/Fish.gif'
import heartEmpty from './assets/effects/heart_empty.png'
import heartFull from './assets/effects/heart_full.png'
import popup1 from './assets/effects/Popup1.jpg'
import popup2 from './assets/effects/Popup2.gif'
import popup3 from './assets/effects/Popup3.gif'
import popup4 from './assets/effects/Popup4.png'
import popup5 from './assets/effects/Popup5.jpeg'
import popup6 from './assets/effects/Popup6.png'
import popup7 from './assets/effects/Popup7.webp'
import popup8 from './assets/effects/Popup8.jpg'
import popup9 from './assets/effects/Popup9.webp'
import popup10 from './assets/effects/Popup10.jpg'

type Screen = 'intro' | 'start' | 'game' | 'hacked' | 'end'
type Folder = 'inbox' | 'trash' | 'org'

type Employee = {
  id: string
  name: string
  title: string
  level: 1 | 2 | 3
  initials: string
  color: string
  bio: string[]
  recentActivity: string
  isYou?: boolean
  image?: string
}

type ActivePopup = {
  id: number
  image: string
  alt: string
  top: number
  left: number
  rotation: number
}

const popupImages = [
  { image: popup1, alt: 'Suspicious popup 1' },
  { image: popup2, alt: 'Suspicious popup 2' },
  { image: popup3, alt: 'Suspicious popup 3' },
  { image: popup4, alt: 'Suspicious popup 4' },
  { image: popup5, alt: 'Suspicious popup 5' },
  { image: popup6, alt: 'Suspicious popup 6' },
  { image: popup7, alt: 'Suspicious popup 7' },
  { image: popup8, alt: 'Suspicious popup 8' },
  { image: popup9, alt: 'Suspicious popup 9' },
  { image: popup10, alt: 'Suspicious popup 10' },
]

const popupDelays = [3000, 5000, 7000]
const maxHearts = 3
const EMAILS_PER_ROUND = 10
let popupId = 0

const slides = [
  {
    title: 'Phishing kan drabba vem som helst',
    text: 'Phishing är en av de vanligaste attackmetoderna online. Ett enda felklick kan leda till stulna lösenord, förlorade pengar eller kapade konton.',
  },
  {
    title: 'Titta på detaljerna',
    text: 'Kontrollera alltid avsändare, länkar, bilagor och språk. Stress, hot och ovanliga domäner är ofta varningssignaler.',
  },
  {
    title: 'Hovra över länkar',
    text: 'En länk kan visa en text och leda någon helt annanstans. Hovra över länken för att se den verkliga adressen innan du klickar.',
  },
  {
    title: 'Träna som en Phish Fighter',
    text: 'Svara på legitima mejl, rapportera eller radera phishing. Du har tre hjärtan innan systemet blir hackat.',
  },
]

const employees: Employee[] = [
  {
    id: 'richard',
    name: 'Richard Calloway',
    title: 'CEO',
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

function App () {
  const [screen, setScreen] = useState<Screen>('intro')
  const [slideIndex, setSlideIndex] = useState(0)
  const [emails, setEmails] = useState<Email[]>(() => createInbox())
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [timer, setTimer] = useState(90)
  const [feedback, setFeedback] = useState('Feedback visas här.')
  const [activePopups, setActivePopups] = useState<ActivePopup[]>([])
  const [comboBurst, setComboBurst] = useState(0)
  const [activeFolder, setActiveFolder] = useState<Folder>('inbox')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isReplying, setIsReplying] = useState(false)
  const [replyDraft, setReplyDraft] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [scoreSaved, setScoreSaved] = useState(false)
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>(
    () => JSON.parse(localStorage.getItem('leaderboard') ?? '[]')
  )

  const selectedEmail = emails.find((email) => email.id === selectedId) ?? null
  const completedCount = emails.filter((email) => email.done).length
  const currentSlide = slides[slideIndex]
  const heartsRemaining = Math.max(0, maxHearts - mistakes)

  const rank = useMemo(() => {
    if (score >= 850) return 'Phish Fighter'
    if (score >= 600) return 'Security Analyst'
    if (score >= 350) return 'Inbox Defender'
    return 'Rookie'
  }, [score])

  const accuracy = useMemo(() => {
    const total = correctCount + wrongCount
    return total === 0 ? 0 : Math.round((correctCount / total) * 100)
  }, [correctCount, wrongCount])

  useEffect(() => {
    if (screen !== 'game') return

    const interval = window.setInterval(() => {
      setTimer((current) => {
        if (current <= 1) {
          window.clearInterval(interval)
          setScreen('end')
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [screen])

  useEffect(() => {
    if (screen !== 'game' || mistakes < 1 || activePopups.length >= popupImages.length) return

    const delay = randomItem(popupDelays)
    const timeout = window.setTimeout(() => {
      setActivePopups((current) => {
        if (current.length >= popupImages.length) return current

        playSound(popSound)
        return [...current, createPopup()]
      })
    }, delay)

    return () => window.clearTimeout(timeout)
  }, [activePopups.length, mistakes, screen])

  useEffect(() => {
    if (comboBurst === 0) return

    const timeout = window.setTimeout(() => setComboBurst(0), 1200)
    return () => window.clearTimeout(timeout)
  }, [comboBurst])

  const startGame = () => {
    setEmails(createInbox())
    setScreen('game')
    setSelectedId(null)
    setActivePopups([])
    setComboBurst(0)
    setIsReplying(false)
    setReplyDraft('')
    setFeedback('Klicka på ett mejl och välj rätt åtgärd.')
  }

  const resetGame = () => {
    setEmails(createInbox())
    setSelectedId(null)
    setScore(0)
    setStreak(0)
    setMistakes(0)
    setCorrectCount(0)
    setWrongCount(0)
    setTimer(90)
    setActivePopups([])
    setComboBurst(0)
    setIsReplying(false)
    setReplyDraft('')
    setActiveFolder('inbox')
    setSelectedEmployee(null)
    setPlayerName('')
    setScoreSaved(false)
    setFeedback('Feedback visas här.')
    setScreen('start')
  }

  const generateEmails = () => {
    setEmails(createInbox())
    setSelectedId(null)
    setActivePopups([])
    setComboBurst(0)
    setMistakes(0)
    setIsReplying(false)
    setReplyDraft('')
    setFeedback('Ny inbox genererad. Börja analysera.')
  }

  const closePopup = (id: number) => {
    setActivePopups((current) => current.filter((popup) => popup.id !== id))
  }

  const openEmail = (email: Email) => {
    playSound(mouseClickSound)
    setSelectedId(email.id)
    setIsReplying(false)
    setReplyDraft('')
    if (!email.read) {
      setEmails((current) => current.map((item) => (
        item.id === email.id ? { ...item, read: true } : item
      )))
    }
  }

  const startReply = () => {
    if (!selectedEmail || selectedEmail.done) return
    setIsReplying(true)
    setReplyDraft('')
  }

  const cancelReply = () => {
    setIsReplying(false)
    setReplyDraft('')
  }

  const handleDecision = (choice: EmailType) => {
    if (!selectedEmail || selectedEmail.done) return

    const isCorrect = choice === selectedEmail.type
    const isFinalEmail = emails.filter((email) => !email.done).length === 1
    const difficultyBonus = selectedEmail.difficulty === 'hard' ? 40 : selectedEmail.difficulty === 'medium' ? 25 : 10

    playSound(isCorrect ? correctSound : incorrectSound)

    setEmails((current) => current.map((email) => (
      email.id === selectedEmail.id ? { ...email, done: true, read: true } : email
    )))
    setIsReplying(false)
    setReplyDraft('')

    if (isCorrect) {
      const nextStreak = streak + 1
      setScore((current) => current + 75 + difficultyBonus + nextStreak * 5)
      setStreak(nextStreak)
      if (nextStreak >= 3) setComboBurst(nextStreak)
      setCorrectCount((current) => current + 1)
      setFeedback(`Rätt! ${selectedEmail.hint}`)
      if (isFinalEmail) window.setTimeout(() => setScreen('end'), 900)
      return
    }

    const nextMistakes = mistakes + 1
    setScore((current) => Math.max(0, current - 35))
    setStreak(0)
    setComboBurst(0)
    setMistakes(nextMistakes)
    setWrongCount((current) => current + 1)
    setFeedback(`Fel. Det här mejlet var ${labelForType(selectedEmail.type)}. ${selectedEmail.hint}`)

    if (nextMistakes >= 3) {
      window.setTimeout(() => setScreen('hacked'), 600)
    } else if (nextMistakes === 1) {
      playSound(popSound)
      setActivePopups([createPopup()])
    } else if (isFinalEmail) {
      window.setTimeout(() => setScreen('end'), 900)
    }
  }

  const sendReply = () => {
    if (!selectedEmail || selectedEmail.done) return
    handleDecision('legit')
  }

  const handleSaveScore = () => {
    if (!playerName.trim()) return
    const updated = [...leaderboard, { name: playerName.trim(), score }]
    setLeaderboard(updated)
    localStorage.setItem('leaderboard', JSON.stringify(updated))
    setPlayerName('')
    setScoreSaved(true)
  }

  const nextSlide = () => {
    if (slideIndex === slides.length - 1) {
      setScreen('start')
      return
    }

    setSlideIndex((current) => current + 1)
  }

  const renderBodyWithLink = (email: Email) => {
    if (!email.link) {
      return <p>{email.body}</p>
    }

    const display = email.displayLink ?? email.link
    return (
      <>
        <p>{email.body}</p>
        <p className="email-link-line">
          <a
            className="email-link"
            href="#"
            title={email.link}
            onClick={(event) => event.preventDefault()}
          >
            {display}
          </a>
        </p>
      </>
    )
  }

  return (
    <>
      {screen === 'intro' && (
        <section id="intro-screen" className="screen active">
          <div className="intro-card">
            <p className="slide-counter">Slide <span>{slideIndex + 1}</span> / {slides.length}</p>
            <h1>{currentSlide.title}</h1>
            <p>{currentSlide.text}</p>

            <div className="slide-dots" aria-label="Intro progress">
              {slides.map((slide) => (
                <span
                  className={`dot ${slide.title === currentSlide.title ? 'active-dot' : ''}`}
                  key={slide.title}
                />
              ))}
            </div>

            <div className="slide-buttons">
              <button id="prev-slide-btn" disabled={slideIndex === 0} onClick={() => setSlideIndex((current) => current - 1)}>
                Back
              </button>
              <button id="next-slide-btn" onClick={nextSlide}>
                {slideIndex === slides.length - 1 ? 'Continue' : 'Next'}
              </button>
            </div>
          </div>
        </section>
      )}

      {screen === 'start' && (
        <section id="start-screen" className="screen active">
          <div className="start-card">
            <h1>Phish Fighter</h1>
            <p>
              Du sitter på kontoret och måste hantera inkommande mejl. Ditt jobb är att skilja
              legitima mejl från phishing.
            </p>

            <div className="instructions">
              <p><strong>Så spelar du:</strong></p>
              <p>1. Klicka på ett mejl i inkorgen för att öppna det.</p>
              <p>2. Hovra över länkar för att se den verkliga adressen.</p>
              <p>3. Tror du mejlet är legitimt? Klicka <strong>Reply</strong> och svara.</p>
              <p>4. Tror du mejlet är phishing? Klicka <strong>Report</strong> eller <strong>Delete</strong>.</p>
              <p>5. Du har 3 hjärtan. Varje fel tar ett hjärta, och vid 3 fel blir systemet "hackat".</p>
            </div>

            <button id="start-btn" onClick={startGame}>Start Game</button>
          </div>
        </section>
      )}

      {screen === 'game' && (
        <section id="game-screen" className={`screen active ${mistakes >= 1 ? 'infection-level-1' : ''} ${mistakes >= 2 ? 'infection-level-2' : ''}`}>
          <div className="gmail-layout">
            <header className="gmail-topbar">
              <div className="gmail-brand">
                <button className="icon-btn" aria-label="Menu">☰</button>
                <div className="gmail-logo-mark">M</div>
                <h2>Phish Fighter Mail</h2>
              </div>

              <div className="gmail-search">
                <span>⌕</span>
                <input type="text" value="in:inbox cybersecurity training" aria-label="Search mail" readOnly />
              </div>

              <div className="stats">
                <span>Score <strong>{score}</strong></span>
                <span>Streak <strong>{streak}</strong></span>
                <span className="heart-stat" aria-label={`${heartsRemaining} hearts left`}>
                  Hearts
                  <strong className="heart-row">
                    {Array.from({ length: maxHearts }, (_, index) => (
                      <img
                        alt={index < heartsRemaining ? 'Full heart' : 'Empty heart'}
                        className={index < heartsRemaining ? 'heart full' : 'heart empty'}
                        key={index}
                        src={index < heartsRemaining ? heartFull : heartEmpty}
                      />
                    ))}
                  </strong>
                </span>
                <span>Time <strong id="timer">{timer}</strong>s</span>
              </div>
            </header>

            <main className="gmail-shell">
              <aside className="gmail-sidebar">
                <button id="generate-btn" onClick={generateEmails}>New Inbox</button>

                <nav className="gmail-nav" aria-label="Mail folders">
                  <button
                    className={activeFolder === 'inbox' ? 'active-folder' : ''}
                    onClick={() => setActiveFolder('inbox')}
                    type="button"
                  >
                    Inbox
                  </button>
                  <button
                    className={activeFolder === 'trash' ? 'active-folder' : ''}
                    onClick={() => setActiveFolder('trash')}
                    type="button"
                  >
                    Trash
                  </button>
                  <button
                    className={`org-tab ${activeFolder === 'org' ? 'active-folder' : ''}`}
                    onClick={() => setActiveFolder('org')}
                    type="button"
                  >
                    Organization
                  </button>
                </nav>

                <div className="progress-section">
                  <div className="progress-info">
                    <span>Progress</span>
                    <span>{completedCount} / {emails.length} emails</span>
                  </div>
                  <div className="progress-bar">
                    <div id="progress-fill" style={{ width: `${(completedCount / emails.length) * 100}%` }} />
                  </div>
                </div>
              </aside>

              {activeFolder === 'org' ? (
                <div className="org-chart-view">
                  <div className="org-chart-header">
                    <h2>Nexus Solutions Inc.</h2>
                    <p className="org-tagline">Connecting people, data, and headaches since 2009</p>
                  </div>
                  <div className="org-chart-container">
                    <div className="org-chart">
                      <div className="org-row">
                        {employees.filter((e) => e.level === 1).map((emp) => (
                          <OrgCard key={emp.id} employee={emp} onClick={() => setSelectedEmployee(emp)} />
                        ))}
                      </div>
                      <div className="org-fork" />
                      <div className="org-drops-row">
                        {employees.filter((e) => e.level === 2).map((emp) => (
                          <div key={emp.id} className="org-drop" />
                        ))}
                      </div>
                      <div className="org-row">
                        {employees.filter((e) => e.level === 2).map((emp) => (
                          <OrgCard key={emp.id} employee={emp} onClick={() => setSelectedEmployee(emp)} />
                        ))}
                      </div>
                      <div className="org-drops-row">
                        {employees.filter((e) => e.level === 3).map((emp) => (
                          <div key={emp.id} className="org-drop" />
                        ))}
                      </div>
                      <div className="org-row">
                        {employees.filter((e) => e.level === 3).map((emp) => (
                          <OrgCard key={emp.id} employee={emp} onClick={() => setSelectedEmployee(emp)} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeFolder === 'trash' ? (
                <div className="org-chart-view org-empty-state">
                  <p>Trash is empty</p>
                </div>
              ) : (
                <section className="email-app">
                  <aside className="inbox-list">
                    <div className="inbox-title-row">
                      <h3>Inbox</h3>
                      <span>Primary</span>
                    </div>
                    <div>
                      {emails.map((email) => {
                        const itemClasses = [
                          'email-item',
                          selectedId === email.id ? 'active' : '',
                          email.done ? 'done' : '',
                          !email.read && !email.done ? 'unread' : '',
                        ].filter(Boolean).join(' ')

                        return (
                          <button
                            className={itemClasses}
                            key={email.id}
                            onClick={() => openEmail(email)}
                            type="button"
                          >
                            <span className="unread-dot" aria-hidden="true" />
                            <div className="email-item-content">
                              <h4>{email.from}</h4>
                              <p>{email.subject}</p>
                              <div className="email-meta">
                                <span>{email.done ? 'Reviewed' : email.read ? 'Read' : 'Unread'}</span>
                                <span className={`small-badge ${email.difficulty}`}>{capitalize(email.difficulty)}</span>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </aside>

                  <section className="email-preview">
                    <div className="email-header">
                      <div className="email-header-top">
                        <p><strong>From:</strong> <span>{selectedEmail?.from ?? 'Välj ett mejl'}</span></p>
                        {selectedEmail && (
                          <span className={`difficulty-badge ${selectedEmail.difficulty}`}>
                            {capitalize(selectedEmail.difficulty)}
                          </span>
                        )}
                      </div>
                      <p><strong>Subject:</strong> <span>{selectedEmail?.subject ?? 'Inget mejl valt'}</span></p>
                    </div>

                    <div className="email-body">
                      {selectedEmail
                        ? renderBodyWithLink(selectedEmail)
                        : <p>Klicka på ett mejl i inboxen för att börja analysera.</p>}

                      {selectedEmail?.attachment && (
                        <div className="detail-box">
                          <strong>📎 Attachment:</strong>
                          <span>{selectedEmail.attachment}</span>
                        </div>
                      )}
                    </div>

                    {isReplying && selectedEmail ? (
                      <div className="reply-composer">
                        <div className="reply-row">
                          <strong>To:</strong>
                          <span>{selectedEmail.from}</span>
                        </div>
                        <div className="reply-row">
                          <strong>Subject:</strong>
                          <span>Re: {selectedEmail.subject}</span>
                        </div>
                        <textarea
                          className="reply-textarea"
                          placeholder="Skriv ditt svar..."
                          value={replyDraft}
                          onChange={(event) => setReplyDraft(event.target.value)}
                          autoFocus
                        />
                        <div className="reply-actions">
                          <button
                            className="reply-send-btn"
                            onClick={sendReply}
                            disabled={replyDraft.trim().length === 0}
                          >
                            Send
                          </button>
                          <button className="reply-cancel-btn" onClick={cancelReply}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="action-toolbar">
                        <button
                          className="action-btn reply-btn"
                          disabled={!selectedEmail || selectedEmail.done}
                          onClick={startReply}
                        >
                          ↩ Reply
                        </button>
                        <button
                          className="action-btn report-btn"
                          disabled={!selectedEmail || selectedEmail.done}
                          onClick={() => handleDecision('phishing')}
                        >
                          ⚑ Report phishing
                        </button>
                        <button
                          className="action-btn delete-btn"
                          disabled={!selectedEmail || selectedEmail.done}
                          onClick={() => handleDecision('phishing')}
                          aria-label="Delete email"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    )}

                    <div className={`feedback-box ${feedback.startsWith('Rätt') ? 'feedback-correct' : feedback.startsWith('Fel') ? 'feedback-wrong' : ''}`}>
                      {feedback}
                    </div>
                  </section>
                </section>
              )}
            </main>
          </div>

          {mistakes >= 1 && (
            <div className="annoyance-layer" aria-live="polite">
              {mistakes >= 2 && <div className="glitch-overlay" aria-hidden="true" />}
              <img className="swimming-fish" src={fishGif} alt="Animated phishing fish" />
              {activePopups.map((popup) => (
                <div
                  className="ad-popup"
                  key={popup.id}
                  style={{
                    top: `${popup.top}%`,
                    left: `${popup.left}%`,
                    transform: `rotate(${popup.rotation}deg)`,
                  }}
                >
                  <div className="ad-popup-title">
                    <span>System Alert</span>
                    <button type="button" aria-label="Close popup" onClick={() => closePopup(popup.id)}>x</button>
                  </div>
                  <img src={popup.image} alt={popup.alt} />
                </div>
              ))}
            </div>
          )}

          {comboBurst >= 3 && (
            <div className="combo-burst" aria-live="polite">
              <img className="combo-boom" src={boomImage} alt="" aria-hidden="true" />
              <div className="combo-text">
                <strong>{comboBurst}x streak</strong>
              </div>
              <span className="spark spark-1" />
              <span className="spark spark-2" />
              <span className="spark spark-3" />
              <span className="spark spark-4" />
            </div>
          )}
        </section>
      )}
n
      {screen === 'hacked' && (
        <section id="hacked-screen" className="screen hacked-screen active">
          <div className="hacked-content">
            <h1>YOU GOT HACKED</h1>
            <p>Du gjorde 3 fel. Din dator har blivit komprometterad.</p>
            <button id="continue-btn" onClick={() => {
              setMistakes(0)
              setActivePopups([])
              setComboBurst(0)
              setFeedback('Systemet är rensat. Fortsätt försiktigt.')
              setScreen('game')
            }}>
              Clean System
            </button>
          </div>

          <div className="popup popup-1">Warning: Malware detected!</div>
          <div className="popup popup-2">Your password has leaked!</div>
          <div className="popup popup-3">Suspicious login detected!</div>
          <div className="popup popup-4">System infected!</div>
          <div className="popup popup-5">Ads are taking over!</div>
        </section>
      )}

      {selectedEmployee && (
        <div className="org-modal-overlay" onClick={() => setSelectedEmployee(null)}>
          <div className="org-modal" onClick={(e) => e.stopPropagation()}>
            <button className="org-modal-close" onClick={() => setSelectedEmployee(null)} type="button">×</button>
            <div
              className="org-modal-avatar"
              style={{ background: `${selectedEmployee.color}22`, color: selectedEmployee.color }}
            >
              {selectedEmployee.image
                ? <img src={selectedEmployee.image} alt={selectedEmployee.name} className="org-avatar-img" />
                : selectedEmployee.initials}
            </div>
            <h3 className="org-modal-name">{selectedEmployee.name}</h3>
            <p className="org-modal-role">{selectedEmployee.title}</p>
            <ul className="org-modal-bio">
              {selectedEmployee.bio.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <div className="org-modal-activity">
              <strong>Recent Activity:</strong> {selectedEmployee.recentActivity}
            </div>
          </div>
        </div>
      )}

      {screen === 'end' && (
        <section id="end-screen" className="screen active">
          <div className="end-card">
            <div className="end-header">
              <h1>Game Over</h1>
              <div className="end-rank-badge">
                <span className="end-rank-label">Rank</span>
                <span className="end-rank-value">{rank}</span>
              </div>
            </div>

            <div className="final-grid">
              <div>
                <p>Final Score</p>
                <h2>{score}</h2>
              </div>
              <div>
                <p>Accuracy</p>
                <h2>{accuracy}%</h2>
              </div>
              <div>
                <p>Correct</p>
                <h2>{correctCount}</h2>
              </div>
              <div>
                <p>Wrong</p>
                <h2>{wrongCount}</h2>
              </div>
            </div>

            <p className="final-message">
              {accuracy >= 80 ? 'Sharp work. You kept the inbox clean.' : 'Keep training. The next inbox will be easier to read.'}
            </p>

            {!scoreSaved ? (
              <div className="end-save-section">
                <p className="end-save-label">Save your score to the leaderboard</p>
                <div className="end-save-row">
                  <input
                    className="end-name-input"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveScore()}
                    placeholder="Your name..."
                    maxLength={20}
                  />
                  <button
                    className="end-save-btn"
                    onClick={handleSaveScore}
                    disabled={!playerName.trim()}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="end-saved-confirm">
                ✓ Score saved!
              </div>
            )}

            {leaderboard.length > 0 && (
              <div className="end-leaderboard">
                <h3>Leaderboard</h3>
                <div className="leaderboard-list">
                  {[...leaderboard]
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 10)
                    .map((player, index) => (
                      <div className={`leaderboard-row ${index < 3 ? `top-${index + 1}` : ''}`} key={index}>
                        <span className="lb-rank">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </span>
                        <span className="lb-name">{player.name}</span>
                        <span className="lb-score">{player.score}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <button id="restart-btn" onClick={resetGame}>Play Again</button>
          </div>
        </section>
      )}
    </>
  )
}

function OrgCard ({ employee, onClick }: { employee: Employee; onClick: () => void }) {
  return (
    <button
      className={`org-card ${employee.isYou ? 'is-you' : ''}`}
      onClick={onClick}
      type="button"
      style={{ ['--accent-color' as string]: employee.color }}
    >
      <div
        className="org-avatar"
        style={{ background: `${employee.color}22`, color: employee.color }}
      >
        {employee.image
          ? <img src={employee.image} alt={employee.name} className="org-avatar-img" />
          : employee.initials}
      </div>
      <span className="org-name">{employee.name}</span>
      <span className="org-title">{employee.title}</span>
    </button>
  )
}

function labelForType (type: EmailType) {
  return type === 'phishing' ? 'phishing' : 'legitimt'
}

function capitalize (value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function playSound (source: string) {
  const audio = new Audio(source)
  audio.currentTime = 0
  void audio.play().catch(() => {
    // Browsers may block audio in rare cases; gameplay should continue either way.
  })
}

function createPopup (): ActivePopup {
  const id = popupId++
  const popup = popupImages[id % popupImages.length]

  return {
    id,
    image: popup.image,
    alt: popup.alt,
    top: randomBetween(8, 70),
    left: randomBetween(5, 72),
    rotation: randomBetween(-7, 7),
  }
}

function randomItem<T> (items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

function randomBetween (min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function createInbox () {
  return [...emailTemplates]
    .sort(() => Math.random() - 0.5)
    .slice(0, EMAILS_PER_ROUND)
    .map((email) => ({ ...email, done: false, read: false }))
}

export default App
