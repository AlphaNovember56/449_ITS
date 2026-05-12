// Module 1: Events in JavaScript - Focused Questions Data
import type { Module, Question } from '../../types';

// Module 1 Pretest Questions
const module1PretestQuestions: Question[] = [
  {
    id: 1,
    question: 'What is an event in JavaScript?',
    options: [
      'A function that runs on a schedule',
      'Something that happens in response to user interaction or system action',
      'A variable that stores a value',
      'A method to style HTML elements',
    ],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: 'Which of the following is a valid event type?',
    options: [
      'execute',
      'respond',
      'click',
      'activate',
    ],
    correctAnswer: 2,
  },
  {
    id: 3,
    question: 'What does "user interaction" include?',
    options: [
      'Only clicking',
      'Clicking, hovering, typing, and scrolling',
      'Only typing',
      'Only scrolling',
    ],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: 'How many events can a single HTML element respond to?',
    options: [
      'Only one',
      'Maximum of three',
      'Multiple events',
      'None',
    ],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: 'Which event is triggered when a user hovers over an element?',
    options: [
      'onmove',
      'ontouch',
      'mouseover',
      'onscroll',
    ],
    correctAnswer: 2,
  },
];

// Section 1.1: Events - Conceptual (Easiest Level - Basic Understanding)
const section1_1Questions: Question[] = [
  {
    id: 1,
    question: 'Which of the following best describes an event object?',
    options: [
      'A container for storing user data',
      'An object containing information about what happened',
      'A function that creates new events',
      'A CSS selector',
    ],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: 'What is event propagation?',
    options: [
      'The spreading of events across multiple computers',
      'The path an event takes through the DOM',
      'The backward direction of events',
      'An error that occurs during events',
    ],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: 'In event bubbling, which element receives the event first?',
    options: [
      'The window object',
      'The parent element',
      'The target element that triggered the event',
      'The document',
    ],
    correctAnswer: 2,
  },
  {
    id: 4,
    question: 'What does preventDefault() do?',
    options: [
      'Stops the event from happening',
      'Cancels the default behavior of an event',
      'Prevents future events',
      'Logs the event to console',
    ],
    correctAnswer: 1,
  },
];

export const module1Data: Module = {
  id: 1,
  title: 'Module 1: Events in JavaScript',
  description: 'Learn what events are and how they work in JavaScript',
  icon: '⚡',
  pretestQuestions: module1PretestQuestions,
  sections: [
    {
      id: 1,
      title: 'Module 1 Pretest',
      description: 'Assess your current knowledge of JavaScript events',
      isLocked: false,
      progress: 0,
      pretestRequired: true,
      content: 'pretest',
      questions: module1PretestQuestions,
    },
    {
      id: 2,
      title: 'Section 1.1: Events - Conceptual',
      description: 'Learn the fundamental concepts of events in JavaScript',
      isLocked: true,
      progress: 0,
      pretestRequired: false,
      content: 'section-1-1-conceptual',
      questions: section1_1Questions,
    },
  ],
  overallProgress: 0,
  isStarted: false,
};

export { module1PretestQuestions, section1_1Questions };
