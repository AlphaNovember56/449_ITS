/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';
import type { Module } from '../../types';
import ProgressBarComponent from '../ProgressBarComponent';
import { module1Data } from './module1-questions';
import './Module1.css';

interface Module1Props {
  onUpdateModule?: (updatedModule: Module) => void;
}

export const Module1: React.FC<Module1Props> = ({ onUpdateModule }) => {
  const navigate = useNavigate();
  const [module, setModule] = useState<Module>(JSON.parse(JSON.stringify(module1Data)));

  // Load from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('module1-state');
    if (saved) {
      setModule(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('module1-state', JSON.stringify(module));
    if (onUpdateModule) {
      onUpdateModule(module);
    }
  }, [module, onUpdateModule]);

  const handleSectionComplete = useCallback((sectionId: number) => {
    setModule((prevModule) => {
      const updatedModule = { ...prevModule };
      updatedModule.sections = updatedModule.sections.map((section) => {
        if (section.id === sectionId) {
          return { ...section, progress: 100 };
        }
        return section;
      });

      // Calculate overall progress
      const totalProgress =
        updatedModule.sections.reduce((sum, s) => sum + s.progress, 0) /
        updatedModule.sections.length;
      updatedModule.overallProgress = Math.round(totalProgress);
      updatedModule.isStarted = true;

      return updatedModule;
    });
  }, []);

  // Check if pretest section needs to be marked complete
  useEffect(() => {
    if (localStorage.getItem('pretest1-section-complete') === 'true') {
      handleSectionComplete(1);
      localStorage.removeItem('pretest1-section-complete');
    }
  }, [handleSectionComplete]);
    

  return (
    <div className="module-overview-container">
      <Button
              onClick={() => navigate('/')}
              className="back-button"
              size="sm"
            >
              ← Back to Dashboard
            </Button>
      <Card className="module-overview-header">
        
        <Card.Body>
          <div className="module-header-top">
            <div className="module-title-section">
              <h1>
                {module.icon} {module.title}
              </h1>
              <p className="module-description">{module.description}</p>
            </div>
            
          </div>
          <div className="module-stats">
            <ProgressBarComponent
              progress={module.overallProgress}
              label={`Overall Module Progress`}
              variant="success"
              size="lg"
            />
            <p className="module-status">
              {module.isStarted
                ? `Sections Completed: ${module.sections.filter(s => s.progress === 100).length} / ${module.sections.length}`
                : 'Start with the Pretest to begin'}
            </p>
          </div>
        </Card.Body>
      </Card>

      <h3 className="sections-title">Module Sections</h3>

      <Row className="sections-grid">
        {module.sections.map((section) => (
          <Col md={6} lg={4} key={section.id} className="section-card-col">
            <Card
              className="section-overview-card unlocked"
              onClick={() => {
                if (section.id === 1) {
                  navigate('/module/1/pretest1');
                } else {
                  navigate(`/module/1/section/${section.id}`);
                }
              }}
            >
              <Card.Body>
                <div className="section-header-overview">
                  <h5 className="section-name">{section.title}</h5>
                </div>
                <p className="section-desc-small">{section.description}</p>

                <ProgressBarComponent
                  progress={section.progress}
                  variant="info"
                  size="sm"
                />

                <Button
                  variant="primary"
                  size="sm"
                  className="w-100 mt-2"
                  onClick={() => {
                    if (section.id === 1) {
                      navigate('/module/1/pretest1');
                    } else {
                      navigate(`/module/1/section/${section.id}`);
                    }
                  }}
                >
                  {section.progress === 0 ? 'Start' : 'Continue'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Module1;
