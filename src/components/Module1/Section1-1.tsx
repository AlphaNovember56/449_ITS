import React, { useState, useEffect } from 'react';
import { Button, Card, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Question } from '../../types';
import '../styles/Pretest.css';

interface Section1Part1Props {
  moduleId: number;
  questions: Question[];
  pretestCorrectAnswers: number | null;
  onSectionComplete: () => void;
}

interface PerformanceFactorParams {
  initialBetaValue: number;
  currentBetaValue: number;
  gammaValue: number;
  rhoValue: number;
  probabilityOfSuccess: number;
}

export function Section1Part1({ moduleId, questions, pretestCorrectAnswers, onSectionComplete }: Section1Part1Props) {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [performanceFactorParams, setPerformanceFactorParams] = useState<PerformanceFactorParams | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Calculate probability of success using linear PFA formula
  const calculateProbabilityOfSuccess = (
    initialBetaValue: number,
    correctAnswerCount: number,
    incorrectAnswerCount: number,
    gammaValue: number,
    rhoValue: number
  ): number => {
    // m = initialBeta + (correctAnswers * gamma) + (incorrectAnswers * rho)
    const m = initialBetaValue + (correctAnswerCount * gammaValue) + (incorrectAnswerCount * rhoValue);
    const probability = 1 / (1 + Math.exp(-m));
    // Cap at 1.0 and ensure non-negative
    return probability > 1 ? 1 : probability < 0 ? 0 : probability;
  };

  // Initialize performance factor based on pretest performance
  useEffect(() => {
    // Primary source: localStorage (always check first for latest data)
    const pretestCorrectAnswersString = localStorage.getItem('pretest-correct-answers');
    let correctAnswersValue = pretestCorrectAnswersString ? parseInt(pretestCorrectAnswersString, 10) : 0;
    
    // Fallback to prop if localStorage is empty
    if (correctAnswersValue === 0 && pretestCorrectAnswers !== null) {
      correctAnswersValue = pretestCorrectAnswers;
    }
    
    // Calculate initial beta: -2.5 base + 0.6 per correct pretest answer
    // At 0 correct: ~9% probability
    // At 5 correct: ~55% probability
    const initialBetaValue = -2.3 + (0.5 * correctAnswersValue);
    const gammaValue = 0.2;
    const rhoValue = 0.1;
    const initialProbability = calculateProbabilityOfSuccess(initialBetaValue, 0, 0, gammaValue, rhoValue);

    setPerformanceFactorParams({
      initialBetaValue: initialBetaValue,
      currentBetaValue: initialBetaValue,
      gammaValue: gammaValue,
      rhoValue: rhoValue,
      probabilityOfSuccess: initialProbability,
    });

    console.log(`Section 1.1 initialized with ${correctAnswersValue} correct pretest answers from localStorage. Initial Beta: ${initialBetaValue}, Initial Probability: ${initialProbability}`);
  }, [pretestCorrectAnswers]);

  const currentQuestion = questions[currentQuestionIndex];

  // Utility function to clear localStorage for testing
  const clearSection1_1LocalStorage = () => {
    localStorage.removeItem('section-1-1-completed');
    localStorage.removeItem('section-1-1-score');
    localStorage.removeItem('section-1-1-attempts');
    console.log('Section 1.1 localStorage cleared');
  };

  // Expose clear function to window for quick console testing
  React.useEffect(() => {
    (window as any).clearSection1_1Storage = clearSection1_1LocalStorage;
    return () => {
      delete (window as any).clearSection1_1Storage;
    };
  }, []);

  const handleOptionSelect = (optionIndex: number) => {
    if (answered) return;

    setSelectedOption(optionIndex);
    setAnswered(true);

    const correctAnswerVerification = optionIndex === currentQuestion.correctAnswer;
    setIsCorrect(correctAnswerVerification);

    if (correctAnswerVerification) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (!performanceFactorParams) return;

    // Update total attempts first
    const newAttempts = totalAttempts + 1;
    
    // Calculate correct and incorrect answer counts
    let updatedCorrectCount = score;
    if (isCorrect) {
      updatedCorrectCount = score + 1;
    }
    const incorrectCount = newAttempts - updatedCorrectCount;

    // Calculate new probability using linear formula
    const newProbability = calculateProbabilityOfSuccess(
      performanceFactorParams.initialBetaValue,
      updatedCorrectCount,
      incorrectCount,
      performanceFactorParams.gammaValue,
      performanceFactorParams.rhoValue
    );

    // For beta tracking, still update it
    let updatedBetaValue = performanceFactorParams.currentBetaValue;
    if (isCorrect) {
      updatedBetaValue = updatedBetaValue + performanceFactorParams.gammaValue;
    } else {
      updatedBetaValue = updatedBetaValue + performanceFactorParams.rhoValue;
    }

    setTotalAttempts(newAttempts);
    
    // Update score if answer was correct
    if (isCorrect) {
      setScore(updatedCorrectCount);
    }

    // Update performance factor params
    const updatedParams = {
      ...performanceFactorParams,
      currentBetaValue: updatedBetaValue,
      probabilityOfSuccess: newProbability,
    };
    setPerformanceFactorParams(updatedParams);

    console.log(`Attempt ${newAttempts}: Correct: ${updatedCorrectCount}, Incorrect: ${incorrectCount}, Probability: ${newProbability.toFixed(3)}, Correct: ${isCorrect}`);

    // Check if probability of success >= 0.9
    if (newProbability >= 0.9) {
      // Mark as completed
      localStorage.setItem('section-1-1-completed', 'true');
      localStorage.setItem('section-1-1-score', updatedCorrectCount.toString());
      localStorage.setItem('section-1-1-attempts', newAttempts.toString());
      setIsCompleted(true);
      onSectionComplete();
      return;
    }

    // Loop to next question (wrap around if at end)
    const nextQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    setCurrentQuestionIndex(nextQuestionIndex);
    setSelectedOption(null);
    setAnswered(false);
    setIsCorrect(false);
  };

  if (!performanceFactorParams) {
    return (
      <div className="pretest-page">
        <p>Loading section...</p>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="pretest-page">
        <header className="pretest-header">
          <div className="header-content">
            <div className="header-top">
              <h1 className="header-title">Section 1.1 Complete</h1>
            </div>
          </div>
        </header>

        <div className="pretest-container">
          <Card className="pretest-card">
            <Card.Body>
              <Alert variant="success" className="mb-4">
                <h4>🎉 Congratulations!</h4>
                <p>You have achieved mastery of this section's concepts.</p>
              </Alert>

              <div className="completion-stats mb-4">
                <p><strong>Correct Answers:</strong> {score}</p>
                <p><strong>Total Attempts:</strong> {totalAttempts}</p>
                <p><strong>Final Probability of Success:</strong> {(performanceFactorParams.probabilityOfSuccess * 100).toFixed(1)}%</p>
                <p><strong>Final Beta Value:</strong> {performanceFactorParams.currentBetaValue.toFixed(3)}</p>
              </div>

              <Button
                variant="primary"
                onClick={() => navigate(`/module/${moduleId}`)}
                className="w-100"
              >
                Return to Module Overview
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="pretest-page">
        <header className="pretest-header">
          <div className="header-content">
            <button onClick={() => void navigate(`/module/${moduleId}`)} className="back-button">
              ← Back to Module Overview
            </button>
            <div className="header-top">
              <h1 className="header-title">Section 1.1: Events - Conceptual</h1>
            </div>
          </div>
        </header>

        <div className="pretest-container">
          <Card className="pretest-card">
            <Card.Body>
              <div className="section-reading-content">
                <h3>Reading Material</h3>
                <div className="reading-placeholder">
                  Reading goes here
                </div>
              </div>

              <div className="section-performance-factor mt-4">
              </div>

              <div className="section-controls mt-4">
                <Button
                  variant="primary"
                  onClick={() => setQuizStarted(true)}
                >
                  Start Quiz
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="pretest-page">
      {/* Header Section */}
      <header className="pretest-header">
        <div className="header-content">
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => void navigate(`/module/${moduleId}`)} className="back-button">
              ← Back to Module Overview
            </button>
            <button 
              onClick={clearSection1_1LocalStorage} 
              className="back-button"
              style={{ backgroundColor: '#dc3545', fontSize: '0.875rem' }}
              title="Clear localStorage for testing"
            >
              🧹 Clear Storage
            </button>
          </div>
          <div className="header-top">
            <h1 className="header-title">Section 1.1 Quiz</h1>
          </div>
          <div className="header-progress">
            <p className="progress-text">Attempt {totalAttempts + 1}</p>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${Math.min(performanceFactorParams.probabilityOfSuccess * 100, 100)}%` }}
              ></div>
            </div>
            <p className="progress-score">
              Mastery Progress: {(performanceFactorParams.probabilityOfSuccess * 100).toFixed(1)}% 
              (Target: 90%)
            </p>
          </div>
        </div>
      </header>

      {/* Quiz Content */}
      <div className="pretest-container">
        <Card className="pretest-card">
          <Card.Body>
            <div className="pretest-question">
              <h3>{currentQuestion.question}</h3>

              <Form className="pretest-form">
                <Form.Group className="mb-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedOption === index;
                    const isCorrectAnswer = index === currentQuestion.correctAnswer;

                    return (
                      <Form.Check
                        key={index}
                        type="radio"
                        name="section-quiz-options"
                        id={`section-option-${index}`}
                        label={option}
                        value={index}
                        checked={isSelected}
                        onChange={() => handleOptionSelect(index)}
                        disabled={answered}
                        className={`pretest-option ${isSelected ? 'selected' : ''} ${
                          answered && isCorrectAnswer ? 'correct-answer' : ''
                        } ${answered && isSelected && !isCorrect ? 'incorrect-answer' : ''}`}
                      />
                    );
                  })}
                </Form.Group>
              </Form>

              {/* Feedback after answer */}
              {answered && (
                <Alert variant={isCorrect ? 'success' : 'danger'} className="mt-3">
                  {isCorrect ? (
                    <div>
                      <strong>✓ Correct!</strong>
                    </div>
                  ) : (
                    <div>
                      <strong>✗ Incorrect</strong>
                      <p className="mt-2 mb-0">
                        Correct answer: <strong>{currentQuestion.options[currentQuestion.correctAnswer]}</strong>
                      </p>
                    </div>
                  )}
                </Alert>
              )}              
            </div>

            <div className="pretest-controls mt-4">
              {answered && (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!answered}
                >
                  Next Question
                </Button>
              )}
              {!answered && (
                <p className="text-muted">Please select an option to continue.</p>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
