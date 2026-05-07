import { useState } from "react";

const emails = [
  {
    id: 1,
    sender: "Swedbank Security",
    subject: "Your account will be locked today",
    body: "Dear customer,  your bank account has been suspendet. Verify now: Swebank-login-security-check.com",
    isPhishing: true,
  },
  {
    id: 2,
    sender: "Västrafik",
    subject: "payment failed",
    body: "Thank you for your purchase. Your receipt is attached in the Vässtrfik app.",
    isPhishing: false,
  },
  {
    id: 3,
    sender: "Netflix support",
    subject: "Payment failed",
    body: "Your payment failed. Update yout billing witg in 1 hour or your account will be deleted: netflix-peyment-secure-login.com",
    isPhishing: true,
  },
];
function GameScreen() {
  const [selectedEmail, setselectedEmail] = useState(emails[0]);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [message, setMessage] = useState("");
  function handleAnswer(answer: boolean) {
    if (health <= 0) return;
    if (answer === selectedEmail.isPhishing) {
      setScore(score + 10);
      setMessage("Correct!");
    } else {
      const newHealth = health - 1;
      setHealth(newHealth);
      if (newHealth === 0) {
        setMessage("You have been hacked!score: " + score);
      } else {
        setMessage("Wrong! Try again.");
      }
    }
  }
  if (health === 0) {
    return (
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1
          style={{
            color: "red",
            fontSize: "90px",
          }}
        >
          YOU HAVE BEEN HACKED!
        </h1>

        <h2>Score: {score}</h2>

        <button
          onClick={() => {
            setHealth(3);
            setScore(0);
            setMessage("");
            setselectedEmail(emails[0]);
          }}
        >
          Restart
        </button>
      </main>
    );
  }
  return (
    <main>
      <h1>Inbox defender</h1>
      <p>Score: {score}</p>
      <p>Health: {health}</p>
      <div>
        <section>
          <h2>Inbox</h2>
          {emails.map((email) => (
            <button
              key={email.id}
              onClick={() => {
                setselectedEmail(email);
                setMessage("");
              }}
            >
              <strong>{email.sender}</strong> - {email.subject}
            </button>
          ))}
        </section>
        <section>
          <h2>{selectedEmail.subject}</h2>
          <p>
            <strong>From: {selectedEmail.sender}</strong>
          </p>
          <p>{selectedEmail.body}</p>
          <button onClick={() => handleAnswer(true)}>Phishing</button>
          <button onClick={() => handleAnswer(false)}>Legitimate</button>
          <p
            className={
              message.startsWith("You have been hacked") ? "game-over" : ""
            }
          >
            {message}
          </p>
        </section>
      </div>
    </main>
  );
}

export default GameScreen;
