import { PredefinedLanguageQuestions } from '/imports/api/collections/forms.js'; // Personal Inventory collections

import  shortid  from 'shortid';

Meteor.startup(() => {
  if (PredefinedLanguageQuestions.find().count() === 0) {
    foreign_language_english_questions = [
      { question: "_____  name is Robert.",
        options: [
        	"Me",
        	"I",
        	"My"
        ],
        answer: 2,
        level: "easy",
        language: "english",
        id: shortid.generate()
      },
      { question: "They _____  from Spain.",
        options: [
          "is",
          "are",
          "do"
        ],
        answer: 1,
        level: "easy",
        language: "english",
        id: shortid.generate()
      },
      { question: "_____  are you from?",
        options: [
          "What",
          "Who",
          "Where"
        ],
        answer: 2,
        level: "easy",
        language: "english",
        id: shortid.generate()
      },
      { question: "What do you do? I’m _____  student.",
        options: [
          "a",
          "the",
          "one"
        ],
        answer: 0,
        level: "easy",
        language: "english",
        id: shortid.generate()
      },
      { question: "Peter _____  at seven o’clock.",
        options: [
          "goes up",
          "gets up",
          "gets"
        ],
        answer: 1,
        level: "easy",
        language: "english",
        id: shortid.generate()
      },
      { question: "_____  you like this DVD?",
        options: [
          "Are",
          "Have",
          "Do"
        ],
        answer: 2,
        level: "easy",
        language: "english",
        id: shortid.generate()
      },
      { question: "We _____  live in a flat.",
        options: [
          "don't",
          "hasn't",
          "doesn't"
        ],
        answer: 0,
        level: "easy",
        language: "english",
        id: shortid.generate()
      },
      { question: "Wednesday, Thursday, Friday, _____ ",
        options: [
          "Saturday",
          "Tuesday",
          "Monday"
        ],
        answer: 0,
        level: "easy",
        language: "english",
        id: shortid.generate()
      },
      { question: "_____  he play tennis?",
        options: [
          "Where",
          "Does",
          "Do"
        ],
        answer: 1,
        level: "easy",
        language: "english",
        id: shortid.generate()
      },
      { question: "Have you _____  a car?",
        options: [
          "any",
          "have",
          "got"
        ],
        answer: 2,
        level: "easy",
        language: "english",
        id: shortid.generate()
      },
    ];

    foreign_language_english_questions.forEach(function(q) {
      const q_id = PredefinedLanguageQuestions.insert(q);
    });
    console.log("Predefined english questions are added");

  }
});
