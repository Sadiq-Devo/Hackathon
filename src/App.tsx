import { useEffect, useMemo, useRef, useState } from 'react'
import { emailTemplates, type Email, type EmailType } from './data/emailTemplates'
import { employees, type Employee } from './data/employees'
import { generateAiEmail, pickFallbackEmail } from './services/aiEmailGenerator'
import './App.css'
import backgroundMusic from './assets/audio/BackgroundMusic.mp3'
import correctSound from './assets/audio/Correct.mp3'
import gameOverMusic from './assets/audio/go-music.mp3'
import glitchSound from './assets/audio/Glitch.mp3'
import hoverSound from './assets/audio/Hover.mp3'
import incorrectSound from './assets/audio/Incorrect.mp3'
import mouseClickSound from './assets/audio/Mouseclick.mp3'
import popSound from './assets/audio/Pop.mp3'
import streakEffectSound from './assets/audio/Streakeffect.mp3'
import streakOhYeahSound from './assets/audio/Streakohyeah.mp3'
import fishGif from './assets/effects/Fish.gif'
import heartEmpty from './assets/effects/heart_empty.png'
import heartFull from './assets/effects/heart_full.png'
import losingScreen from './assets/effects/lost.png'
import popup1 from './assets/effects/Popup1.jpg'
import popup2 from './assets/effects/Popup2.gif'
import popup3 from './assets/effects/Popup3.gif'
import popup4 from './assets/effects/Popup4.png'
import popup5 from './assets/effects/Popup5.jpeg'
import popup6 from './assets/effects/Popup6.png'
import popup7 from './assets/effects/Popup7.webp'
import popup8 from './assets/effects/Popup8.jpeg'
import popup9 from './assets/effects/Popup9.webp'
import popup10 from './assets/effects/Popup10.jpg'
import streak1 from './assets/effects/Streak1.png'
import streak2 from './assets/effects/Streak2.png'
import streak3 from './assets/effects/Streak3.png'
import streak4 from './assets/effects/Streak4.png'
import streak5 from './assets/effects/Streak5.png'

type Screen = 'intro' | 'start' | 'game' | 'hacked' | 'end'
type Folder = 'inbox' | 'trash' | 'org'

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

const streakImages = [streak1, streak2, streak3, streak4, streak5]

const popupDelays = [3000, 5000, 7000]
const maxHearts = 3
const SCORE_BAR_TARGET = 1000
const INITIAL_INBOX_SIZE = 3
const NEW_EMAIL_MIN_DELAY = 4000
const NEW_EMAIL_MAX_DELAY = 8000
const gameplayMusicVolume = 0.2
const gameOverMusicVolume = 0.34
let popupId = 0

const replyTemplates = [
  'Thanks, I will take care of it.',
  'Got it, I will handle this now.',
  'Confirmed. I will follow up shortly.',
  'Thanks for the update. I am on it.',
  'Understood, I will check this today.',
  'Sounds good. I will get back to you soon.',
  'Confirmed, thanks for letting me know.',
  'I have seen this and will handle it.',
  'Thanks, I will review and respond.',
  'Yes, I can help with that.',
  'Appreciate the heads up. I will look into it.',
  'No problem, I will sort this out.',
  'Thanks. I will confirm once it is done.',
  'Received, I will take the next step.',
  'All good, I will follow the usual process.',
  'Thanks, I will check the details.',
  'Sure, I will take a look.',
  'Confirmed. I will update you after checking.',
  'Thanks, I will make sure this gets done.',
  'I can do that. Thanks for sending it over.',
  'Got it. I will verify and reply back.',
  'Thanks, I will handle it carefully.',
  'Understood. I will proceed with this.',
  'Yes, that works for me.',
  'Thanks for the reminder. I will do it.',
  'I will check and let you know.',
  'Confirmed. I will keep you posted.',
  'Thanks, I will take a look when I can.',
  'Received. I will deal with this shortly.',
  'Sounds good, thanks for the message.',
]

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

function App () {
  const gameMusicRef = useRef<HTMLAudioElement | null>(null)
  const [screen, setScreen] = useState<Screen>('intro')
  const [slideIndex, setSlideIndex] = useState(0)
  const [emails, setEmails] = useState<Email[]>(() => createInbox())
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [timer, setTimer] = useState(150)
  const [feedback, setFeedback] = useState('Feedback visas här.')
  const [activePopups, setActivePopups] = useState<ActivePopup[]>([])
  const [comboBurst, setComboBurst] = useState(0)
  const [comboImage, setComboImage] = useState(streak1)
  const [isLosingTransition, setIsLosingTransition] = useState(false)
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
  const scoreProgress = Math.min(100, Math.round((score / SCORE_BAR_TARGET) * 100))

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

    const music = new Audio(backgroundMusic)
    music.loop = true
    music.volume = 0
    gameMusicRef.current = music
    void music.play().catch(() => {
      // Gameplay continues if the browser waits for a user gesture.
    })
    fadeAudio(music, gameplayMusicVolume, 900)

    const interval = window.setInterval(() => {
      setTimer((current) => {
        if (current <= 1) {
          window.clearInterval(interval)
          setScreen('end')
          return 0
        }

        const next = current - 1
        if (next <= 30) playTick()
        return next
      })
    }, 1000)

    return () => {
      window.clearInterval(interval)
      fadeAudio(music, 0, 450, () => {
        music.pause()
        music.currentTime = 0
      })
      if (gameMusicRef.current === music) gameMusicRef.current = null
    }
  }, [screen])

  useEffect(() => {
    const music = gameMusicRef.current
    if (!music) return

    fadeAudio(music, isLosingTransition ? 0.05 : gameplayMusicVolume, 500)
  }, [isLosingTransition])

  useEffect(() => {
    if (screen !== 'game') return

    const controller = new AbortController()
    let cancelled = false
    let timeoutId: number | null = null

    const scheduleNext = () => {
      if (cancelled) return
      const delay = randomBetween(NEW_EMAIL_MIN_DELAY, NEW_EMAIL_MAX_DELAY)
      timeoutId = window.setTimeout(async () => {
        if (cancelled) return

        const aiEmail = await generateAiEmail(controller.signal)

        if (cancelled) return

        if (aiEmail) {
          setEmails((current) => [aiEmail, ...current])
        } else {
          setEmails((current) => {
            const usedIds = new Set(current.map((e) => e.id))
            const fallback = pickFallbackEmail(usedIds)
            return fallback ? [fallback, ...current] : current
          })
        }

        scheduleNext()
      }, delay)
    }

    scheduleNext()

    return () => {
      cancelled = true
      controller.abort()
      if (timeoutId !== null) window.clearTimeout(timeoutId)
    }
  }, [screen])

  useEffect(() => {
    if (screen !== 'game' || mistakes < 1 || activePopups.length >= popupImages.length) return

    const delay = randomItem(popupDelays)
    const timeout = window.setTimeout(() => {
      setActivePopups((current) => {
        if (current.length >= popupImages.length) return current

        playSound(popSound, 0.42)
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

  useEffect(() => {
    if (screen !== 'hacked') return

    const music = new Audio(gameOverMusic)
    music.loop = true
    music.volume = 0
    void music.play().catch(() => {
      // The hacked screen still works if the browser blocks autoplay.
    })
    fadeAudio(music, gameOverMusicVolume, 1000)

    return () => {
      fadeAudio(music, 0, 500, () => {
        music.pause()
        music.currentTime = 0
      })
    }
  }, [screen])

  const startGame = () => {
    setEmails(createInbox())
    setScreen('game')
    setSelectedId(null)
    setActivePopups([])
    setComboBurst(0)
    setComboImage(randomItem(streakImages))
    setIsLosingTransition(false)
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
    setTimer(150)
    setActivePopups([])
    setComboBurst(0)
    setComboImage(randomItem(streakImages))
    setIsLosingTransition(false)
    setIsReplying(false)
    setReplyDraft('')
    setActiveFolder('inbox')
    setSelectedEmployee(null)
    setPlayerName('')
    setScoreSaved(false)
    setFeedback('Feedback visas här.')
    setScreen('start')
  }

  const closePopup = (id: number) => {
    setActivePopups((current) => current.filter((popup) => popup.id !== id))
  }

  const openEmail = (email: Email) => {
    playSound(mouseClickSound, 0.34)
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
    setReplyDraft(createReplyDraft(selectedEmail))
  }

  const cancelReply = () => {
    setIsReplying(false)
    setReplyDraft('')
  }

  const handleDecision = (choice: EmailType) => {
    if (!selectedEmail || selectedEmail.done) return

    const isCorrect = choice === selectedEmail.type
    const difficultyBonus = selectedEmail.difficulty === 'hard' ? 40 : selectedEmail.difficulty === 'medium' ? 25 : 10

    playSound(isCorrect ? correctSound : incorrectSound, isCorrect ? 0.62 : 0.56)

    setEmails((current) => current.map((email) => (
      email.id === selectedEmail.id ? { ...email, done: true, read: true } : email
    )))
    setIsReplying(false)
    setReplyDraft('')

    if (isCorrect) {
      const nextStreak = streak + 1
      setScore((current) => current + 75 + difficultyBonus + nextStreak * 5)
      setStreak(nextStreak)
      if (nextStreak >= 3) {
        setComboBurst(nextStreak)
        setComboImage(randomItem(streakImages))
        playStreakSounds()
      }
      setCorrectCount((current) => current + 1)
      setFeedback(`Rätt! ${selectedEmail.hint}`)
      return
    }

    const nextMistakes = mistakes + 1
    setScore((current) => Math.max(0, current - 35))
    setStreak(0)
    setComboBurst(0)
    setMistakes(nextMistakes)
    setWrongCount((current) => current + 1)
    const flavor = selectedEmail.wrongFeedback ? ` ${selectedEmail.wrongFeedback}` : ''
    setFeedback(`Fel. Det här mejlet var ${labelForType(selectedEmail.type)}.${flavor} ${selectedEmail.hint}`)

    if (nextMistakes >= 3) {
      playSound(glitchSound, 0.72)
      setIsLosingTransition(true)
      window.setTimeout(() => {
        setIsLosingTransition(false)
        setScreen('hacked')
      }, 2400)
    } else if (nextMistakes === 1) {
      playSound(popSound, 0.42)
      setActivePopups([createPopup()])
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
                <div className="gmail-logo-mark" aria-label="Phish Fighter Mail fish logo">
                  <svg className="logo-fish-icon" viewBox="0 0 64 48" aria-hidden="true" focusable="false">
                    <path className="logo-tail" d="M8 15l15 9L8 33l5-9z" />
                    <path className="logo-body" d="M21 12h21l12 12-12 12H21l-9-12z" />
                    <path className="logo-gill" d="M35 15l-4 18" />
                    <rect className="logo-eye" x="40" y="18" width="5" height="5" />
                    <path className="logo-fin" d="M26 13l8-7 5 7z" />
                    <path className="logo-bottom-fin" d="M27 35l7 6 5-6z" />
                  </svg>
                </div>
                <h2>Phish Fighter Mail</h2>
              </div>

              <div className="gmail-search">
                <span>⌕</span>
                <input type="text" value="in:inbox cybersecurity training" aria-label="Search mail" readOnly />
              </div>

              <div className="stats">
                <span className="score-stat" aria-label={`Score ${score}`}>
                  <span className="score-stat-top">
                    <span>Score</span>
                    <strong>{score}</strong>
                  </span>
                  <span className="score-spacebar" aria-hidden="true">
                    <span className="score-spacebar-fill" style={{ width: `${scoreProgress}%` }} />
                    <span className="score-spacebar-shine" />
                  </span>
                </span>
                <span className="streak-stat">Streak <strong>{streak}</strong></span>
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
                <span className={`timer-stat ${timer <= 30 ? 'timer-warning' : ''}`}>
                  <span className="timer-display-bg">88:88</span>
                  <strong id="timer">{formatClock(timer)}</strong>
                </span>
              </div>
            </header>

            <main className="gmail-shell">
              <aside className="gmail-sidebar">
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
                    <span>Cleared</span>
                    <span>{completedCount}</span>
                  </div>
                  <div className="progress-info">
                    <span>In inbox</span>
                    <span>{emails.length - completedCount}</span>
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
                <section className="email-app trash-view">
                  <aside className="inbox-list">
                    <div className="inbox-title-row">
                      <h3>Trash</h3>
                      <span>{emails.filter((e) => e.trashed).length} items</span>
                    </div>
                    <div>
                      {emails.filter((email) => email.trashed).length === 0 ? (
                        <div className="trash-empty">Trash is empty</div>
                      ) : emails.filter((email) => email.trashed).map((email) => (
                        <button
                          className="email-item done"
                          key={email.id}
                          type="button"
                          disabled
                        >
                          <span className="unread-dot" aria-hidden="true" />
                          <div className="email-item-content">
                            <h4>{email.from}</h4>
                            <p>{email.subject}</p>
                            <div className="email-meta">
                              <span>Deleted</span>
                              <span className={`small-badge ${email.difficulty}`}>{capitalize(email.difficulty)}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </aside>
                  <section className="email-preview">
                    <div className="email-body">
                      <p style={{ color: '#5f6368', fontFamily: 'Courier New, monospace', textAlign: 'center', marginTop: '40px' }}>
                        Deleted emails. They cannot be restored.
                      </p>
                    </div>
                  </section>
                </section>
              ) : (
                <section className="email-app">
                  <aside className="inbox-list">
                    <div className="inbox-title-row">
                      <h3>Inbox</h3>
                      <span>Primary</span>
                    </div>
                    <div>
                      {emails.filter((email) => !email.trashed).map((email) => {
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
                        <div className="email-header-actions">
                          {selectedEmail && (
                            <span className={`difficulty-badge ${selectedEmail.difficulty}`}>
                              {capitalize(selectedEmail.difficulty)}
                            </span>
                          )}
                          {selectedEmail && !selectedEmail.done && (
                            <button
                              className="delete-icon-btn"
                              onClick={() => {
                                const idToTrash = selectedEmail.id
                                handleDecision('phishing')
                                setEmails((current) => current.map((email) => (
                                  email.id === idToTrash ? { ...email, trashed: true } : email
                                )))
                                setSelectedId(null)
                              }}
                              aria-label="Delete email"
                              title="Delete"
                            >
                              🗑
                            </button>
                          )}
                        </div>
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
              <img className="combo-boom" src={comboImage} alt="" aria-hidden="true" />
              <div className="combo-text">
                <strong>{comboBurst}x streak</strong>
              </div>
              <span className="spark spark-1" />
              <span className="spark spark-2" />
              <span className="spark spark-3" />
              <span className="spark spark-4" />
            </div>
          )}

          {isLosingTransition && (
            <div className="losing-transition" aria-live="assertive">
              <div className="losing-transition-panel">
                <span>Signal Lost</span>
                <strong>System Failure</strong>
                <small>Critical breach detected</small>
              </div>
            </div>
          )}
        </section>
      )}

      {screen === 'hacked' && (
        <section
          id="hacked-screen"
          className="screen hacked-screen active"
          style={{ backgroundImage: `url("${losingScreen}")` }}
        >
          <div className="hacked-content">
            <button
              id="continue-btn"
              onClick={() => {
                setMistakes(0)
                setActivePopups([])
                setComboBurst(0)
                setComboImage(randomItem(streakImages))
                setIsLosingTransition(false)
                setFeedback('Systemet är rensat. Fortsätt försiktigt.')
                setScreen('game')
              }}
              onMouseEnter={() => playSound(hoverSound, 0.36)}
            >
              <span>Clean System</span>
            </button>
          </div>
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
            <p className="org-modal-email">{selectedEmployee.email}</p>
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
      <span className="org-email">{employee.email}</span>
      <span className="org-status" title={employee.recentActivity}>
        <span className="org-status-dot" /> {employee.recentActivity}
      </span>
    </button>
  )
}

function labelForType (type: EmailType) {
  return type === 'phishing' ? 'phishing' : 'legitimt'
}

function capitalize (value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function playSound (source: string, volume = 0.5) {
  const audio = new Audio(source)
  audio.currentTime = 0
  audio.volume = volume
  void audio.play().catch(() => {
    // Browsers may block audio in rare cases; gameplay should continue either way.
  })
}

function playStreakSounds () {
  const first = new Audio(streakEffectSound)
  const second = new Audio(streakOhYeahSound)
  first.volume = 0.66
  second.volume = 0.74

  first.addEventListener('ended', () => {
    void second.play().catch(() => {
      // Streak visuals still carry the feedback if playback is blocked.
    })
  }, { once: true })

  void first.play().catch(() => {
    void second.play().catch(() => {
      // Streak visuals still carry the feedback if playback is blocked.
    })
  })
}

function fadeAudio (audio: HTMLAudioElement, targetVolume: number, duration: number, onComplete?: () => void) {
  const startVolume = audio.volume
  const startTime = performance.now()

  const step = (currentTime: number) => {
    const progress = Math.min((currentTime - startTime) / duration, 1)
    audio.volume = startVolume + (targetVolume - startVolume) * progress

    if (progress < 1) {
      window.requestAnimationFrame(step)
      return
    }

    audio.volume = targetVolume
    onComplete?.()
  }

  window.requestAnimationFrame(step)
}

let tickCtx: AudioContext | null = null
function playTick () {
  try {
    if (!tickCtx) tickCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const ctx = tickCtx
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = 1100
    osc.type = 'square'
    gain.gain.setValueAtTime(0.04, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.04)
  } catch {
    // Web Audio not available; ignore
  }
}

function formatClock (seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function createPopup (): ActivePopup {
  const id = popupId++
  const popup = randomItem(popupImages)

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

function createReplyDraft (email: Email) {
  const intro = randomItem(replyTemplates)
  return `${intro}\n\nBest,\nNexus Security Team\n\nRe: ${email.subject}`
}

function createInbox () {
  return [...emailTemplates]
    .sort(() => Math.random() - 0.5)
    .slice(0, INITIAL_INBOX_SIZE)
    .map((email) => ({ ...email, done: false, read: false }))
}

export default App
