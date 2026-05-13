/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Module1 from './components/Module1/Module1';
import { Pretest1 } from './components/Module1/Pretest1';
import { Section1Part1 } from './components/Module1/Section1-1';
import { module1PretestQuestions, section1_1Questions } from './components/Module1/module1-questions';
import './App.css';

interface PretestResult {
  score: number;
  correctAnswers: number;
}

function App() {
  const [pretestResults, setPretestResults] = useState<Record<number, PretestResult>>({});

  const handlePretestComplete = (moduleId: number, score: number, correctAnswers: number) => {
    // Store the pretest result for the specific module
    const initialBeta = 0.05 + 0.1 * correctAnswers;
    
    const updatedResults = {
      ...pretestResults,
      [moduleId]: { score, correctAnswers }
    };
    
    setPretestResults(updatedResults);
    
    // Also explicitly set localStorage as backup
    localStorage.setItem('pretest-correct-answers', correctAnswers.toString());
    localStorage.setItem('pretest-completed', 'true');
    localStorage.setItem('pretest-results', JSON.stringify(updatedResults));

    console.log(`Module ${moduleId} Pretest Complete - Score: ${score}, Correct Answers: ${correctAnswers}, Initial Beta: ${initialBeta}`);
  };

  return (
    <Router>
      <Routes>
        <Route path="/449_ITS/" element={<Dashboard />} />
        <Route path="/449_ITS/module/1" element={<Module1 />} />
        <Route
          path="/module/1/pretest1"
          element={
            <Pretest1
              module1={1}
              questions={module1PretestQuestions}
              onComplete={(score, correctAnswers) =>
                handlePretestComplete(1, score, correctAnswers)
              }
            />
          }
        />
        <Route
          path="/module/1/section/2"
          element={
            <Section1Part1
              moduleId={1}
              questions={section1_1Questions}
              pretestCorrectAnswers={pretestResults[1]?.correctAnswers || null}
              onSectionComplete={() => {
                console.log('Section 1.1 completed');
              }}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
