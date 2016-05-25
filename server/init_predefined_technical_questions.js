import { PredefinedTechnicalQuestions } from '/imports/api/collections/forms.js'; // Personal Inventory collections

import  shortid  from 'shortid';

Meteor.startup(() => {
  if (PredefinedTechnicalQuestions.find().count() === 0) {
    technical_software_questions = [
      { question: "Which language is not a true object-oriented programming language?",
        options: [
        	"VB.NET",
        	"VB 6",
        	"C++",
        	"C#",
        	"Java"
        ],
        answer: 1,
        level: "easy",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "A GUI",
        options: [
          "uses buttons, menus, and icons.",
          "should be easy for a user to manipulate.",
          "stands for Graphic Use Interaction.",
          "Both a and b.",
          "All of the above."
        ],
        answer: 3,
        level: "easy",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "What does IDE stand for?",
        options: [
          "Integrated Development Environment",
          "Integrated Design Environment",
          "Interior Development Environment",
          "Interior Design Environment",
          "None of the above."
        ],
        answer: 0,
        level: "easy",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "Visual Studio .NET provides which feature:",
        options: [
          "debugging.",
          "application deployment.",
          "syntax checking.",
          "Both a and b.",
          "All of the above."
        ],
        answer: 4,
        level: "easy",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "Which does the solution explorer not display?",
        options: [
          "Form Properties",
          "Reference Folder",
          "Form File",
          "Assemble File",
          "All are part of the solution explorer."
        ],
        answer: 0,
        level: "easy",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "Which task is accomplished in the Code editor?",
        options: [
          "Adding forms to the project",
          "Adding controls to the form",
          "Adding event procedures to the form",
          "Both a and b.",
          "All of the above."
        ],
        answer: 2,
        level: "easy",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "Which is not a feature of a GUI that makes learning a program easy for users?",
        options: [
          "Online help",
          "WYSIWYG formatting",
          "Dialog boxes",
          "Detailed key strokes and commands",
          "Icons"
        ],
        answer: 3,
        level: "moderate",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "An object is composed of:",
        options: [
          "properties.",
          "methods.",
          "events.",
          "Both a and b.",
          "All of above."
        ],
        answer: 4,
        level: "moderate",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "Which statement about objects is true?",
        options: [
          "One object is used to create one class. ",
          "One class is used to create one object.",
          "One object can create many classes.",
          "One class can create many objects.",
          "There is no relationship between objects and classes."
        ],
        answer: 3,
        level: "moderate",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "Which is not true about forms and controls in Visual Basic?",
        options: [
          "They are pre-built.",
          "They are graphical objects.",
          "New versions of the classes must be created with each project.",
          "Buttons can be created with the drag and drop method.",
          "All of the above are true."
        ],
        answer: 2,
        level: "moderate",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "Which is not a property of the Common control class?",
        options: [
          "Show",
          "BackColor",
          "Font",
          "ForeColor",
          "Name"
        ],
        answer: 0,
        level: "moderate",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "Which property determines whether a control is displayed to the user?",
        options: [
          "Hide",
          "Show",
          "Visible",
          "Enabled",
          "Cursor"
        ],
        answer: 2,
        level: "moderate",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "The CancelButton property belongs to which object?",
        options: [
          "Button",
          "Form",
          "Label",
          "TextBox",
          "Timer"
        ],
        answer: 1,
        level: "moderate",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "In event-driven programming an event is generated by:",
        options: [
          "the system.",
          "a user’s action.",
          "the program itself.",
          "Both a and b.",
          "All of the above."
        ],
        answer: 4,
        level: "moderate",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "Which is not a common control event?",
        options: [
          "Click",
          "SingleClick",
          "DoubleClick",
          "MouseMove",
          "MouseDown"
        ],
        answer: 1,
        level: "moderate",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "The Activated event is found only in which object?",
        options: [
          "Form",
          "Button ",
          "TextBox",
          "Label",
          "Timer"
        ],
        answer: 0,
        level: "hard",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "The analysis phase of software development involves:",
        options: [
          "collecting the requirements about what the program will accomplish.",
          "creating a detailed plan on how the program will accomplish the requirements.",
          "writing the software with a program such as VB.NET.",
          "Both a and b.",
          "All of the above."
        ],
        answer: 0,
        level: "hard",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "Which phase of project development typically costs the most?",
        options: [
          "Analysis",
          "Design",
          "Implementation",
          "Maintenance",
          "Documentation"
        ],
        answer: 3,
        level: "hard",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "The Rnd statement will generate a(n):",
        options: [
          "decimal value between 0.01 and 1.00.",
          "integer value between 0.01 and 1.00.",
          "decimal value between 0.0 and 1.0.",
          "integer value between 0.0 and 1.0.",
          "decimal value between 0.0 and up to 1.0, but not including 1.0."
        ],
        answer: 4,
        level: "hard",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "A click event procedure stud for the label control can be created by:",
        options: [
          "selecting the object and event from the code editor window’s drop-down boxes.",
          "typing the code in the code editor window.",
          "by double clicking the control.",
          "Both a and b.",
          "All of the above."
        ],
        answer: 4,
        level: "hard",
        related_to: ["it","software"],
        id: shortid.generate()
      },
    ];

    technical_software_questions.forEach(function(q) {
      const q_id = PredefinedTechnicalQuestions.insert(q);
    });
    console.log("Predefined technical questions are added");

  }
});
