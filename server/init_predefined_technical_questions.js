import { PredefinedTechnicalQuestions } from '/imports/api/collections/forms.js'; // Personal Inventory collections

import  shortid  from 'shortid';

Meteor.startup(() => {
  if (PredefinedTechnicalQuestions.find().count() === 0) {
    technical_software_questions = [
      { question: "Which language is not a true object-oriented programming language?",
        options: [
        	{index: 0, option: "VB.NET"},
        	{index: 1, option: "VB 6"},
        	{index: 2, option: "C++"},
        	{index: 3, option: "C#"},
        	{index: 4, option: "Java"}
        ],
        answer: 1,
        level: "easy",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "A GUI",
        options: [
          {index: 0, option: "uses buttons, menus, and icons."},
          {index: 1, option: "should be easy for a user to manipulate."},
          {index: 2, option: "stands for Graphic Use Interaction."},
          {index: 3, option: "Both a and b."},
          {index: 4, option: "All of the above."}
        ],
        answer: 3,
        level: "easy",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "What does IDE stand for?",
        options: [
          {index: 0, option: "Integrated Development Environment"},
          {index: 1, option: "Integrated Design Environment"},
          {index: 2, option: "Interior Development Environment"},
          {index: 3, option: "Interior Design Environment"},
          {index: 4, option: "None of the above."}
        ],
        answer: 0,
        level: "easy",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "Visual Studio .NET provides which feature:",
        options: [
          {index: 0, option: "debugging."},
          {index: 1, option: "application deployment."},
          {index: 2, option: "syntax checking."},
          {index: 3, option: "Both a and b."},
          {index: 4, option: "All of the above."}
        ],
        answer: 4,
        level: "easy",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "Which does the solution explorer not display?",
        options: [
          {index: 0, option: "Form Properties"},
          {index: 1, option: "Reference Folder"},
          {index: 2, option: "Form File"},
          {index: 3, option: "Assemble File"},
          {index: 4, option: "All are part of the solution explorer."}
        ],
        answer: 0,
        level: "easy",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "Which task is accomplished in the Code editor?",
        options: [
          {index: 0, option: "Adding forms to the project"},
          {index: 1, option: "Adding controls to the form"},
          {index: 2, option: "Adding event procedures to the form"},
          {index: 3, option: "Both a and b."},
          {index: 4, option: "All of the above."}
        ],
        answer: 2,
        level: "easy",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "Which is not a feature of a GUI that makes learning a program easy for users?",
        options: [
          {index: 0, option: "Online help"},
          {index: 1, option: "WYSIWYG formatting"},
          {index: 2, option: "Dialog boxes"},
          {index: 3, option: "Detailed key strokes and commands"},
          {index: 4, option: "Icons"}
        ],
        answer: 3,
        level: "moderate",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "An object is composed of:",
        options: [
          {index: 0, option: "properties."},
          {index: 1, option: "methods."},
          {index: 2, option: "events."},
          {index: 3, option: "Both a and b."},
          {index: 4, option: "All of above."}
        ],
        answer: 4,
        level: "moderate",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "Which statement about objects is true?",
        options: [
          {index: 0, option: "One object is used to create one class. "},
          {index: 1, option: "One class is used to create one object."},
          {index: 2, option: "One object can create many classes."},
          {index: 3, option: "One class can create many objects."},
          {index: 4, option: "There is no relationship between objects and classes."}
        ],
        answer: 3,
        level: "moderate",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "Which is not true about forms and controls in Visual Basic?",
        options: [
          {index: 0, option: "They are pre-built."},
          {index: 1, option: "They are graphical objects."},
          {index: 2, option: "New versions of the classes must be created with each project."},
          {index: 3, option: "Buttons can be created with the drag and drop method."},
          {index: 4, option: "All of the above are true."}
        ],
        answer: 2,
        level: "moderate",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "Which is not a property of the Common control class?",
        options: [
          {index: 0, option: "Show"},
          {index: 1, option: "BackColor"},
          {index: 2, option: "Font"},
          {index: 3, option: "ForeColor"},
          {index: 4, option: "Name"}
        ],
        answer: 0,
        level: "moderate",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "Which property determines whether a control is displayed to the user?",
        options: [
          {index: 0, option: "Hide"},
          {index: 1, option: "Show"},
          {index: 2, option: "Visible"},
          {index: 3, option: "Enabled"},
          {index: 4, option: "Cursor"}
        ],
        answer: 2,
        level: "moderate",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "The CancelButton property belongs to which object?",
        options: [
          {index: 0, option: "Button"},
          {index: 1, option: "Form"},
          {index: 2, option: "Label"},
          {index: 3, option: "TextBox"},
          {index: 4, option: "Timer"}
        ],
        answer: 1,
        level: "moderate",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "In event-driven programming an event is generated by:",
        options: [
          {index: 0, option: "the system."},
          {index: 1, option: "a user’s action."},
          {index: 2, option: "the program itself."},
          {index: 3, option: "Both a and b."},
          {index: 4, option: "All of the above."}
        ],
        answer: 4,
        level: "moderate",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "Which is not a common control event?",
        options: [
          {index: 0, option: "Click"},
          {index: 1, option: "SingleClick"},
          {index: 2, option: "DoubleClick"},
          {index: 3, option: "MouseMove"},
          {index: 4, option: "MouseDown"}
        ],
        answer: 1,
        level: "moderate",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "The Activated event is found only in which object?",
        options: [
          {index: 0, option: "Form"},
          {index: 1, option: "Button "},
          {index: 2, option: "TextBox"},
          {index: 3, option: "Label"},
          {index: 4, option: "Timer"}
        ],
        answer: 0,
        level: "hard",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "The analysis phase of software development involves:",
        options: [
          {index: 0, option: "collecting the requirements about what the program will accomplish."},
          {index: 1, option: "creating a detailed plan on how the program will accomplish the requirements."},
          {index: 2, option: "writing the software with a program such as VB.NET."},
          {index: 3, option: "Both a and b."},
          {index: 4, option: "All of the above."}
        ],
        answer: 0,
        level: "hard",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "Which phase of project development typically costs the most?",
        options: [
          {index: 0, option: "Analysis"},
          {index: 1, option: "Design"},
          {index: 2, option: "Implementation"},
          {index: 3, option: "Maintenance"},
          {index: 4, option: "Documentation"}
        ],
        answer: 3,
        level: "hard",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "The Rnd statement will generate a(n):",
        options: [
          {index: 0, option: "decimal value between 0.01 and 1.00."},
          {index: 1, option: "integer value between 0.01 and 1.00."},
          {index: 2, option: "decimal value between 0.0 and 1.0."},
          {index: 3, option: "integer value between 0.0 and 1.0."},
          {index: 4, option: "decimal value between 0.0 and up to 1.0, but not including 1.0."}
        ],
        answer: 4,
        level: "hard",
        related_to: ["it","software"],
        id: shortid.generate()
      },
      { question: "A click event procedure stud for the label control can be created by:",
        options: [
          {index: 0, option: "selecting the object and event from the code editor window’s drop-down boxes."},
          {index: 1, option: "typing the code in the code editor window."},
          {index: 2, option: "by double clicking the control."},
          {index: 3, option: "Both a and b."},
          {index: 4, option: "All of the above."}
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
