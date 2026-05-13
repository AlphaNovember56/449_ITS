import { useState, useEffect } from 'react';
import './Dashboard.css';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { Module } from './types';
import { module1Data } from './components/Module1/module1-questions';
import ProgressBarComponent from './components/ProgressBarComponent';

function Dashboard() {
  const [modules, setModules] = useState<Module[]>([module1Data]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load modules from local storage if available
    const savedModules = localStorage.getItem('modules');
    if (savedModules) {
      try {
        setModules(JSON.parse(savedModules) as Module[]);
      } catch (error) {
        console.error('Error loading modules from storage:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save modules to local storage
    localStorage.setItem('modules', JSON.stringify(modules));
  }, [modules]);

  const handleModuleClick = (moduleId: number) => {
    void navigate(`/module/${moduleId}`);
  };

  const completedModules = modules.filter((mod) => mod.overallProgress === 100).length;
  const startedModules = modules.filter((mod) => mod.isStarted).length;

  return (
    <Container fluid className="dashboard-container">
      <div className="dashboard-header">
        <h1>📚 Dashboard</h1>
        <p>Welcome! Select a module to begin learning.</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{modules.length}</div>
          <div className="stat-label">Total Modules</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{startedModules}</div>
          <div className="stat-label">Started</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{completedModules}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="modules-section">
        <h2>Available Modules</h2>
        <Row className="modules-grid">
          {modules.map((module) => (
            <Col md={6} lg={4} key={module.id} className="module-col">
              <Card
                className={`module-card ${
                  module.isStarted ? 'started' : 'not-started'
                }`}
                onClick={() => handleModuleClick(module.id)}
              >
                <Card.Body>
                  <div className="module-icon-large">{module.icon}</div>
                  <Card.Title className="module-title">
                    {module.title}
                  </Card.Title>
                  <Card.Text className="module-description">
                    {module.description}
                  </Card.Text>

                  <ProgressBarComponent
                    progress={module.overallProgress}
                    variant={
                      module.overallProgress === 100
                        ? 'success'
                        : module.overallProgress > 50
                        ? 'info'
                        : 'warning'
                    }
                    size="md"
                  />

                  <div className="module-status">
                    {module.isStarted ? (
                      <>
                        <span className="status-badge started">
                          ✓ Started
                        </span>
                        {module.overallProgress === 100 && (
                          <span className="status-badge completed">
                            ✓ Completed
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="status-badge not-started">
                        Not Started
                      </span>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    className="w-100 mt-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModuleClick(module.id);
                    }}
                  >
                    {module.isStarted ? 'Continue' : 'Start Module'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Alert variant="info" className="dashboard-info mt-5">
        <Alert.Heading>How the Intelligent Tutoring System Works</Alert.Heading>
        <ul>
          <li>
            <strong>Start with the Pretest:</strong> Each module begins with a
            diagnostic pretest to assess your current knowledge level.
          </li>
          <li>
            <strong>Adaptive Learning Path:</strong> Based on your pretest
            results, sections will be unlocked for you to learn from.
          </li>
          <li>
            <strong>Track Progress:</strong> Progress bars show your advancement
            in each section and the overall module.
          </li>
          <li>
            <strong>Complete at Your Pace:</strong> Work through sections at your
            own speed and mark them complete when finished.
          </li>
          <li>
            <strong>Posttest:</strong> After completing all sections, take the
            posttest to measure what you've learned.
          </li>
        </ul>
      </Alert>
    </Container>
  );
}

export default Dashboard;
