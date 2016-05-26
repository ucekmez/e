import { PredefinedLanguageQuestions } from '/imports/api/collections/forms.js'; // Personal Inventory collections

import  shortid  from 'shortid';

Meteor.startup(() => {
  if (PredefinedLanguageQuestions.find().count() === 0) {
    foreign_language_english_questions = [
      { question: "_____  name is Robert.",
        options: [
        	{index: 0, option: "Me"},
        	{index: 1, option: "I"},
        	{index: 2, option: "My"}
        ],
        answer: 2,
        level: "easy",
        language: "english",
        id: shortid.generate()
      },
      { question: "They _____  from Spain.",
        options: [
          {index: 0, option: "is"},
          {index: 1, option: "are"},
          {index: 2, option: "do"}
        ],
        answer: 1,
        level: "easy",
        language: "english",
        id: shortid.generate()
      },
      { question: "_____  are you from?",
        options: [
          {index: 0, option: "What"},
          {index: 1, option: "Who"},
          {index: 2, option: "Where"}
        ],
        answer: 2,
        level: "easy",
        language: "english",
        id: shortid.generate()
      },
      { question: "What do you do? I’m _____  student.",
        options: [
          {index: 0, option: "a"},
          {index: 1, option: "the"},
          {index: 2, option: "one"}
        ],
        answer: 0,
        level: "easy",
        language: "english",
        id: shortid.generate()
      },
      { question: "Peter _____  at seven o’clock.",
        options: [
          {index: 0, option: "goes up"},
          {index: 1, option: "gets up"},
          {index: 2, option: "gets"}
        ],
        answer: 1,
        level: "easy",
        language: "english",
        id: shortid.generate()
      },
      { question: "_____  you like this DVD?",
        options: [
          {index: 0, option: "Are"},
          {index: 1, option: "Have"},
          {index: 2, option: "Do"}
        ],
        answer: 2,
        level: "easy",
        language: "english",
        id: shortid.generate()
      },
      { question: "We _____  live in a flat.",
        options: [
          {index: 0, option: "don't"},
          {index: 1, option: "hasn't"},
          {index: 2, option: "doesn't"}
        ],
        answer: 0,
        level: "easy",
        language: "english",
        id: shortid.generate()
      },
      { question: "Wednesday, Thursday, Friday, _____ ",
        options: [
          {index: 0, option: "Saturday"},
          {index: 1, option: "Tuesday"},
          {index: 2, option: "Monday"}
        ],
        answer: 0,
        level: "easy",
        language: "english",
        id: shortid.generate()
      },
      { question: "_____  he play tennis?",
        options: [
          {index: 0, option: "Where"},
          {index: 1, option: "Does"},
          {index: 2, option: "Do"}
        ],
        answer: 1,
        level: "easy",
        language: "english",
        id: shortid.generate()
      },
      { question: "Have you _____  a car?",
        options: [
          {index: 0, option: "any"},
          {index: 1, option: "have"},
          {index: 2, option: "got"}
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
