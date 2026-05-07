import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Screen = 'intro' | 'start' | 'game' | 'hacked' | 'end'
type EmailType = 'legit' | 'phishing' | 'ai'
type Difficulty = 'easy' | 'medium' | 'hard'

type Email = {
  id: number
  from: string
  subject: string
  body: string
  link?: string
  attachment?: string
  type: EmailType
  difficulty: Difficulty
  hint: string
  done?: boolean
}

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
    title: 'AI gör bluffar mer trovärdiga',
    text: 'AI-genererade bluffmejl kan vara välskrivna och personliga. Därför behöver du leta efter subtila mönster och orimliga uppmaningar.',
  },
  {
    title: 'Träna som en Phish Fighter',
    text: 'I spelet får du analysera en inbox och fatta snabba beslut. Välj rätt klassificering och håll systemet säkert.',
  },
]

const baseEmails: Email[] = [
  {
    id: 1,
    from: 'it-support@boras.se',
    subject: 'Planerat lösenordsbyte på fredag',
    body: 'Hej! På fredag genomför vi planerat underhåll. Du kommer få en påminnelse i företagets vanliga lösenordsportal. Kontakta servicedesk om du har frågor.',
    link: 'https://intranet.boras.se/password',
    type: 'legit',
    difficulty: 'easy',
    hint: 'Avsändaren, länken och tonen matchar en intern rutin.',
  },
  {
    id: 2,
    from: 'security-alert@micros0ft-login.com',
    subject: 'Ditt konto stängs inom 30 minuter',
    body: 'Vi har upptäckt ovanlig aktivitet. Verifiera ditt konto omedelbart för att undvika avstängning.',
    link: 'http://micros0ft-login.com/verify-now',
    type: 'phishing',
    difficulty: 'easy',
    hint: 'Domänen imiterar Microsoft och använder nollan i micros0ft.',
  },
  {
    id: 3,
    from: 'hr@company-careers.ai',
    subject: 'Personligt policy-dokument för din roll',
    body: 'Hej Omar, baserat på din nuvarande roll har vi skapat ett individuellt dokument. Bekräfta mottagandet innan dagens slut för fortsatt compliance.',
    attachment: 'personalized_policy_update.docm',
    type: 'ai',
    difficulty: 'medium',
    hint: 'Mejlet är välskrivet och personligt men konstigt generiskt, med makro-bilaga och press.',
  },
  {
    id: 4,
    from: 'finance@boras.se',
    subject: 'Kvitton för hackathon-budget',
    body: 'Hej! Kan du lägga upp kvittona från förra veckans inköp i Teams-mappen innan kl. 15? Tack.',
    type: 'legit',
    difficulty: 'easy',
    hint: 'Ingen misstänkt länk, rimlig uppgift och naturlig ton.',
  },
  {
    id: 5,
    from: 'dhl-delivery@parcel-track-secure.net',
    subject: 'Misslyckad leverans: betala avgift',
    body: 'Din leverans stoppades. Betala 19 SEK nu för att undvika retur.',
    link: 'https://parcel-track-secure.net/dhl-fee',
    type: 'phishing',
    difficulty: 'easy',
    hint: 'Små avgifter och falska leveransdomäner är klassiska lockbeten.',
  },
  {
    id: 6,
    from: 'anna.lind@boras.se',
    subject: 'Kan du granska presentationen?',
    body: 'Hej, jag uppdaterade tre slides om cybersäkerhetsövningen. Säg gärna till om något saknas inför demo.',
    attachment: 'cybersecurity-training-slides.pdf',
    type: 'legit',
    difficulty: 'medium',
    hint: 'Avsändare, sammanhang och filtyp känns rimliga.',
  },
  {
    id: 7,
    from: 'admin@openai-workspace-support.com',
    subject: 'AI workspace invoice correction required',
    body: 'Our automatic system has detected a mismatch in your billing profile. Please review the generated secure correction form attached.',
    attachment: 'invoice_correction.html',
    type: 'ai',
    difficulty: 'hard',
    hint: 'Professionell text men vag kontext, märklig HTML-bilaga och falsk supportdomän.',
  },
  {
    id: 8,
    from: 'noreply@github.com',
    subject: 'New sign-in to your account',
    body: 'A sign-in was detected from Chrome on macOS. If this was you, no action is needed. If not, review your security log from GitHub.',
    link: 'https://github.com/settings/security-log',
    type: 'legit',
    difficulty: 'medium',
    hint: 'Länken går till korrekt domän och ber dig inte lämna lösenord direkt.',
  },
  {
    id: 9,
    from: 'ceo.office@boras-partner.co',
    subject: 'Snabb betalning behövs konfidentiellt',
    body: 'Jag sitter i möte och behöver att du omedelbart köper presentkort för ett partnerärende. Svara bara på detta mejl.',
    type: 'phishing',
    difficulty: 'medium',
    hint: 'Chef-bedrägeri: brådska, sekretess och presentkort.',
  },
  {
    id: 10,
    from: 'productivity-assistant@workflow-ai-mail.com',
    subject: 'Sammanfattning av dina senaste dokument',
    body: 'Din veckorytm visar 37% högre risk för blockerad leverans. Klicka för att acceptera den rekommenderade synkroniseringen.',
    link: 'https://workflow-ai-mail.com/sync',
    type: 'ai',
    difficulty: 'hard',
    hint: 'AI-tonen låter självsäker men oprecis, med fabricerade mätvärden och vag åtgärd.',
  },
]

function App () {
  const [screen, setScreen] = useState<Screen>('intro')
  const [slideIndex, setSlideIndex] = useState(0)
  const [emails, setEmails] = useState<Email[]>(baseEmails)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [timer, setTimer] = useState(90)
  const [feedback, setFeedback] = useState('Feedback visas här.')

  const selectedEmail = emails.find((email) => email.id === selectedId) ?? null
  const completedCount = emails.filter((email) => email.done).length
  const currentSlide = slides[slideIndex]

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

  const startGame = () => {
    setScreen('game')
    setSelectedId(null)
    setFeedback('Klicka på ett mejl och välj rätt kategori.')
  }

  const resetGame = () => {
    setEmails(baseEmails)
    setSelectedId(null)
    setScore(0)
    setStreak(0)
    setMistakes(0)
    setCorrectCount(0)
    setWrongCount(0)
    setTimer(90)
    setFeedback('Feedback visas här.')
    setScreen('start')
  }

  const generateEmails = () => {
    setEmails((current) => [...current].sort(() => Math.random() - 0.5).map((email) => ({ ...email, done: false })))
    setSelectedId(null)
    setFeedback('Ny AI-inbox genererad. Börja analysera.')
  }

  const handleChoice = (choice: EmailType) => {
    if (!selectedEmail || selectedEmail.done) return

    const isCorrect = choice === selectedEmail.type
    const isFinalEmail = emails.filter((email) => !email.done).length === 1
    const difficultyBonus = selectedEmail.difficulty === 'hard' ? 40 : selectedEmail.difficulty === 'medium' ? 25 : 10

    setEmails((current) => current.map((email) => (
      email.id === selectedEmail.id ? { ...email, done: true } : email
    )))

    if (isCorrect) {
      const nextStreak = streak + 1
      setScore((current) => current + 75 + difficultyBonus + nextStreak * 5)
      setStreak(nextStreak)
      setMistakes(0)
      setCorrectCount((current) => current + 1)
      setFeedback(`Rätt! ${selectedEmail.hint}`)
      if (isFinalEmail) window.setTimeout(() => setScreen('end'), 900)
      return
    }

    const nextMistakes = mistakes + 1
    setScore((current) => Math.max(0, current - 35))
    setStreak(0)
    setMistakes(nextMistakes)
    setWrongCount((current) => current + 1)
    setFeedback(`Fel. Rätt svar var ${labelForChoice(selectedEmail.type)}. ${selectedEmail.hint}`)

    if (nextMistakes >= 3) {
      window.setTimeout(() => setScreen('hacked'), 600)
    } else if (isFinalEmail) {
      window.setTimeout(() => setScreen('end'), 900)
    }
  }

  const nextSlide = () => {
    if (slideIndex === slides.length - 1) {
      setScreen('start')
      return
    }

    setSlideIndex((current) => current + 1)
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
              Du sitter på kontoret och måste hantera inkommande mejl. Ditt jobb är att upptäcka phishing,
              AI-genererade bluffmejl och skilja dem från legitima mejl.
            </p>

            <div className="instructions">
              <p><strong>Så spelar du:</strong></p>
              <p>1. Klicka på ett mejl i inkorgen.</p>
              <p>2. Kontrollera avsändare, länk, bilaga och ton.</p>
              <p>3. Välj: Legit, Phishing eller AI-generated.</p>
              <p>4. Du får poäng för rätt svar.</p>
              <p>5. Om du gör 3 fel i rad blir systemet "hackat".</p>
            </div>

            <button id="start-btn" onClick={startGame}>Start Game</button>
          </div>
        </section>
      )}

      {screen === 'game' && (
        <section id="game-screen" className="screen active">
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
                <span>Mistakes <strong>{mistakes}</strong></span>
                <span>Time <strong id="timer">{timer}</strong>s</span>
              </div>
            </header>

            <main className="gmail-shell">
              <aside className="gmail-sidebar">
                <button id="generate-btn" onClick={generateEmails}>New AI Emails</button>

                <nav className="gmail-nav" aria-label="Mail folders">
                  <span className="active-folder">Inbox</span>
                  <span>Starred</span>
                  <span>Snoozed</span>
                  <span>Sent</span>
                  <span>Spam</span>
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

              <section className="email-app">
                <aside className="inbox-list">
                  <div className="inbox-title-row">
                    <h3>Inbox</h3>
                    <span>Primary</span>
                  </div>
                  <div>
                    {emails.map((email) => (
                      <button
                        className={`email-item ${selectedId === email.id ? 'active' : ''} ${email.done ? 'done' : ''}`}
                        key={email.id}
                        onClick={() => setSelectedId(email.id)}
                        type="button"
                      >
                        <h4>{email.from}</h4>
                        <p>{email.subject}</p>
                        <div className="email-meta">
                          <span>{email.done ? 'Reviewed' : 'Unread'}</span>
                          <span className={`small-badge ${email.difficulty}`}>{capitalize(email.difficulty)}</span>
                        </div>
                      </button>
                    ))}
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
                    <p>
                      {selectedEmail?.body ?? 'Klicka på ett mejl i inboxen för att börja analysera.'}
                    </p>

                    {selectedEmail?.link && (
                      <div className="detail-box">
                        <strong>Link:</strong>
                        <span>{selectedEmail.link}</span>
                      </div>
                    )}

                    {selectedEmail?.attachment && (
                      <div className="detail-box">
                        <strong>Attachment:</strong>
                        <span>{selectedEmail.attachment}</span>
                      </div>
                    )}
                  </div>

                  <div className="decision-buttons">
                    <button className="choice-btn" data-choice="legit" disabled={!selectedEmail || selectedEmail.done} onClick={() => handleChoice('legit')}>
                      Legit
                    </button>
                    <button className="choice-btn" data-choice="phishing" disabled={!selectedEmail || selectedEmail.done} onClick={() => handleChoice('phishing')}>
                      Phishing
                    </button>
                    <button className="choice-btn" data-choice="ai" disabled={!selectedEmail || selectedEmail.done} onClick={() => handleChoice('ai')}>
                      AI-generated
                    </button>
                  </div>

                  <div className={`feedback-box ${feedback.startsWith('Rätt') ? 'feedback-correct' : feedback.startsWith('Fel') ? 'feedback-wrong' : ''}`}>
                    {feedback}
                  </div>
                </section>
              </section>
            </main>
          </div>
        </section>
      )}

      {screen === 'hacked' && (
        <section id="hacked-screen" className="screen hacked-screen active">
          <div className="hacked-content">
            <h1>YOU GOT HACKED</h1>
            <p>Du gjorde 3 fel i rad. Din dator har blivit komprometterad.</p>
            <button id="continue-btn" onClick={() => {
              setMistakes(0)
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

      {screen === 'end' && (
        <section id="end-screen" className="screen active">
          <div className="end-card">
            <h1>Game Over</h1>

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

            <p>Rank:</p>
            <h2 id="rank">{rank}</h2>
            <p className="final-message">{accuracy >= 80 ? 'Sharp work. You kept the inbox clean.' : 'Keep training. The next inbox will be easier to read.'}</p>
            <button id="restart-btn" onClick={resetGame}>Play Again</button>
          </div>
        </section>
      )}
    </>
  )
}

function labelForChoice (choice: EmailType) {
  if (choice === 'ai') return 'AI-generated'
  return capitalize(choice)
}

function capitalize (value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export default App
