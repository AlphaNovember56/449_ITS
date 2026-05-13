import React, { useState } from 'react';
import { Button, Card, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { Question } from '../../types';

import '../styles/Pretest.css';

interface PretestWindow extends Window {
  clearPretestStorage?: () => void;
}

interface Pretest1Props {
  module1: number;
  questions: Question[];
  onComplete: (score: number, correctAnswers: number) => void;
}

export function Pretest1({ module1, questions, onComplete }: Pretest1Props) {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  // debugging function to clear localStorage for testing
  const clearPretestLocalStorage = () => {
    localStorage.removeItem('pretest-completed');
    localStorage.removeItem('pretest-correct-answers');
    localStorage.removeItem('pretest-score');
    console.log('Pretest localStorage cleared');
  };
  React.useEffect(() => {
    const pretestWindow = window as PretestWindow;
    pretestWindow.clearPretestStorage = clearPretestLocalStorage;
    return () => {
      delete pretestWindow.clearPretestStorage;
    };
  }, []);


  const handleOptionSelect = (optionIndex: number) => {
    if (answered) return; // Prevent changing answer after submission

    setSelectedOption(optionIndex);
    setAnswered(true);

    // Check if answer is correct
    const correct = optionIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
      setCorrectAnswerCount(correctAnswerCount + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setAnswered(false);
      setIsCorrect(false);
    } else {
      // Pretest is complete - calculate final score based on current state
      const finalCorrectCount = correctAnswerCount;
      const finalScore =  score;
      
      // Set all relevant localStorage items
      localStorage.setItem('pretest-completed', 'true');
      localStorage.setItem('pretest-correct-answers', finalCorrectCount.toString());
      localStorage.setItem('pretest-score', finalScore.toString());
      
      // Call the completion handler with final values
      onComplete(finalScore, finalCorrectCount);

      
      // Log for debugging
      console.log(`Pretest complete - Stored ${finalCorrectCount} correct answers to localStorage`);
      console.log(`localStorage values:`, {
        'pretest-completed': localStorage.getItem('pretest-completed'),
        'pretest-correct-answers': localStorage.getItem('pretest-correct-answers'),
        'pretest-score': localStorage.getItem('pretest-score')
      });
      
      // Navigate after a short delay to ensure data is persisted
      setTimeout(() => {
        void navigate(`/module/${module1}`);
      }, 100);
    }
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="pretest-page">
      {/* Header Section */}
      <header className="pretest-header">
        <div className="header-content">
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => void navigate('/module/1')} className="back-button">
                ← Back to Module Overview
              </button>

              
              {/* Debug button to clear localStorage for testing purposes*/}
              {/* <button 
                onClick={clearPretestLocalStorage} 
                className="back-button"
                style={{ backgroundColor: '#dc3545', fontSize: '0.875rem' }}
                title="Clear localStorage for testing"
              >
                🧹 Clear Storage
              </button> */}


            </div>
          <div className="header-top">
            
            <h1 className="header-title">Module Pretest</h1>
          </div>
          <div className="header-progress">
            <p className="progress-text">Question {currentQuestionIndex + 1} of {questions.length}</p>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
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
                        name="pretest-options"
                        id={`option-${index}`}
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
                  {isLastQuestion ? 'Complete Pretest' : 'Next Question'}
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