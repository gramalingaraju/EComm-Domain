import React, { useState } from "react";
import { ECOMM_QUIZ_QUESTIONS } from "../data/quizData";
import { GraduationCap, XCircle, Trophy, RotateCcw, Award, Printer, User } from "lucide-react";

export default function KnowledgeQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userName, setUserName] = useState("Jane Doe");

  const currentQ = ECOMM_QUIZ_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (optIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIndex
    }));
  };

  const calculateScore = () => {
    let score = 0;
    ECOMM_QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const handleNext = () => {
    if (currentQuestionIndex < ECOMM_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const score = calculateScore();
  const percentage = Math.round((score / ECOMM_QUIZ_QUESTIONS.length) * 100);
  const isPassed = percentage >= 80;

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", margin: "1rem 0" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <GraduationCap size={20} color="var(--accent-primary)" />
          eCommerce Domain Readiness Assessment Quiz
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
          Test your functional & technical understanding before starting active project development and testing.
        </p>
      </div>

      {!isSubmitted ? (
        <div>
          {/* User Name Input Bar */}
          <div style={{ background: "var(--bg-secondary)", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <User size={16} color="var(--accent-primary)" />
            <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 600 }}>Your Name for Readiness Certificate:</span>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              style={{
                padding: "0.4rem 0.75rem",
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-primary)",
                fontSize: "0.85rem",
                fontWeight: 700,
                flex: 1,
                maxWidth: "300px"
              }}
            />
          </div>

          {/* Question Stepper */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)" }}>
              Question {currentQuestionIndex + 1} of {ECOMM_QUIZ_QUESTIONS.length}
            </span>

            <div style={{ display: "flex", gap: "0.45rem" }}>
              <button className="btn btn-secondary" onClick={handlePrev} disabled={currentQuestionIndex === 0} style={{ padding: "0.4rem 0.75rem", fontSize: "0.78rem" }}>
                Previous
              </button>
              <button className="btn btn-secondary" onClick={handleNext} disabled={currentQuestionIndex === ECOMM_QUIZ_QUESTIONS.length - 1} style={{ padding: "0.4rem 0.75rem", fontSize: "0.78rem" }}>
                Next
              </button>
            </div>
          </div>

          {/* Question Box */}
          <div style={{ background: "var(--bg-secondary)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, lineHeight: 1.5, marginBottom: "1rem" }}>
              {currentQ.question}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    style={{
                      textAlign: "left",
                      padding: "0.85rem 1rem",
                      borderRadius: "var(--radius-sm)",
                      border: `1px solid ${isSelected ? "var(--accent-primary)" : "var(--border-color)"}`,
                      background: isSelected ? "var(--accent-light)" : "var(--bg-primary)",
                      color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                      fontSize: "0.88rem",
                      fontWeight: isSelected ? 700 : 400,
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Quiz Action */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              className="btn btn-primary"
              onClick={() => setIsSubmitted(true)}
              disabled={Object.keys(selectedAnswers).length < ECOMM_QUIZ_QUESTIONS.length}
              style={{ padding: "0.65rem 1.5rem" }}
            >
              Submit & View Readiness Certificate
            </button>
          </div>
        </div>
      ) : (
        /* Quiz Score & Certificate View */
        <div className="animate-fade-in" style={{ padding: "1rem" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ display: "inline-flex", padding: "1rem", borderRadius: "50%", background: isPassed ? "var(--emerald-light)" : "var(--rose-light)", marginBottom: "1rem" }}>
              {isPassed ? <Trophy size={48} color="var(--emerald-accent)" /> : <XCircle size={48} color="var(--rose-accent)" />}
            </div>

            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.35rem" }}>
              {isPassed ? "Congratulations! Domain Readiness Passed 🎉" : "Keep Learning! Review Domain Modules"}
            </h3>
            <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
              Your Score: <span style={{ fontWeight: 800, color: isPassed ? "var(--emerald-accent)" : "var(--rose-accent)" }}>{score} / {ECOMM_QUIZ_QUESTIONS.length} ({percentage}%)</span>
            </p>
          </div>

          {/* Printable Certificate Badge Card */}
          {isPassed && (
            <div style={{ maxWidth: "600px", margin: "0 auto 1.5rem auto", background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(16, 185, 129, 0.15))", padding: "2rem", borderRadius: "var(--radius-lg)", border: "2px dashed var(--emerald-accent)", textAlign: "center" }}>
              <Award size={48} color="var(--emerald-accent)" style={{ marginBottom: "0.5rem" }} />
              <h4 style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "0.05em", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                CERTIFICATE OF ECOMMERCE DOMAIN READINESS
              </h4>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                This certifies that <strong style={{ color: "var(--accent-primary)", fontSize: "1.1rem" }}>{userName}</strong> has successfully completed the eCommerce Domain Readiness Assessment covering Cart, Checkout, Payments, OMS, WMS, and Concurrency architecture.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                <button className="btn btn-primary" onClick={handlePrintCertificate} style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}>
                  <Printer size={15} /> Print / Save Certificate PDF
                </button>
              </div>
            </div>
          )}

          {/* Question Explanations Breakdown */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--text-primary)" }}>
              Detailed Question Explanations & Review:
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {ECOMM_QUIZ_QUESTIONS.map((q, idx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctAnswer;
                return (
                  <div
                    key={q.id}
                    style={{
                      background: "var(--bg-secondary)",
                      padding: "1rem",
                      borderRadius: "var(--radius-md)",
                      border: `1px solid ${isCorrect ? "rgba(16, 185, 129, 0.3)" : "rgba(244, 63, 94, 0.3)"}`
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                      <span className={`badge ${isCorrect ? "badge-emerald" : "badge-rose"}`}>
                        {isCorrect ? "Correct" : "Incorrect"}
                      </span>
                      <h5 style={{ fontSize: "0.88rem", fontWeight: 700 }}>Q{idx + 1}: {q.question}</h5>
                    </div>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                      <strong>Your Answer:</strong> {q.options[userAns]}
                    </p>
                    {!isCorrect && (
                      <p style={{ fontSize: "0.82rem", color: "var(--emerald-accent)", marginTop: "0.15rem" }}>
                        <strong>Correct Answer:</strong> {q.options[q.correctAnswer]}
                      </p>
                    )}
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.35rem", background: "var(--bg-primary)", padding: "0.5rem", borderRadius: "var(--radius-sm)" }}>
                      💡 <strong>Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <button className="btn btn-secondary" onClick={handleRestart} style={{ padding: "0.6rem 1.25rem" }}>
              <RotateCcw size={16} /> Retake Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
