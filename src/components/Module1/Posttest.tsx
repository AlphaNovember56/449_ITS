import React, { useState } from 'react';
import { Button, Card, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { Question } from '../../types';

import '../styles/Posttest.css';

interface PosttestWindow extends Window {
  clearPosttestStorage?: () => void;
}

interface Posttest1Props {
  module1: number;
  questions: Question[];
  onComplete: (score: number, correctAnswers: number) => void;
}

export function Posttest1({ module1, questions, onComplete }: Posttest1Props) {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  // debugging function to clear localStorage for testing
  const clearPosttestLocalStorage = () => {
    localStorage.removeItem('Posttest-completed');
    localStorage.removeItem('Posttest-correct-answers');
    localStorage.removeItem('Posttest-score');
    console.log('Posttest localStorage cleared');
  };
  React.useEffect(() => {
    const PosttestWindow = window as PosttestWindow;
    PosttestWindow.clearPosttestStorage = clearPosttestLocalStorage;
    return () => {
      delete PosttestWindow.clearPosttestStorage;
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
      // Posttest is complete - calculate final score based on current state
      const finalCorrectCount = correctAnswerCount;
      const finalScore =  score;
      
      // Set all relevant localStorage items
      localStorage.setItem('Posttest-completed', 'true');
      localStorage.setItem('Posttest-correct-answers', finalCorrectCount.toString());
      localStorage.setItem('Posttest-score', finalScore.toString());
      
      // Call the completion handler with final values
      onComplete(finalScore, finalCorrectCount);

      
      // Log for debugging
      console.log(`Posttest complete - Stored ${finalCorrectCount} correct answers to localStorage`);
      console.log(`localStorage values:`, {
        'Posttest-completed': localStorage.getItem('Posttest-completed'),
        'Posttest-correct-answers': localStorage.getItem('Posttest-correct-answers'),
        'Posttest-score': localStorage.getItem('Posttest-score')
      });
      
      // Navigate after a short delay to ensure data is persisted
      setTimeout(() => {
        void navigate(`/module/${module1}`);
      }, 100);
    }
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="Posttest-page">
      {/* Header Section */}
      <header className="Posttest-header">
        <div className="header-content">
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => void navigate('/module/1')} className="back-button">
                ← Back to Module Overview
              </button>

              
              {/* Debug button to clear localStorage for testing purposes*/}
              {/* <button 
                onClick={clearPosttestLocalStorage} 
                className="back-button"
                style={{ backgroundColor: '#dc3545', fontSize: '0.875rem' }}
                title="Clear localStorage for testing"
              >
                🧹 Clear Storage
              </button> */}


            </div>
          <div className="header-top">
            
            <h1 className="header-title">Module Posttest</h1>
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
      <div className="Posttest-container">
        <Card className="Posttest-card">
          <Card.Body>
            <div className="Posttest-question">
              <h3>{currentQuestion.question}</h3>

              <Form className="Posttest-form">
                <Form.Group className="mb-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedOption === index;
                    const isCorrectAnswer = index === currentQuestion.correctAnswer;

                    return (
                      <Form.Check
                        key={index}
                        type="radio"
                        name="Posttest-options"
                        id={`option-${index}`}
                        label={option}
                        value={index}
                        checked={isSelected}
                        onChange={() => handleOptionSelect(index)}
                        disabled={answered}
                        className={`Posttest-option ${isSelected ? 'selected' : ''} ${
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

            <div className="Posttest-controls mt-4">
              {answered && (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!answered}
                >
                  {isLastQuestion ? 'Complete Posttest' : 'Next Question'}
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