
/* OCVTS Computer Science - Mini-Project #06 */

// Store all quiz questions and their correct answers.
const questions = [
    {
        question: "1. Which company created Minecraft?",
        answers: ["Epic Games", "Mojang", "Nintendo", "Valve"],
        correct: 1
    },
    {
        question: "2. What is the main goal in Fortnite Battle Royale?",
        answers: [
            "Score touchdowns",
            "Build a city",
            "Be the last player standing",
            "Solve math problems"
        ],
        correct: 2
    },
    {
        question: "3. Which game features the character Master Chief?",
        answers: ["Halo", "Overwatch", "Valorant", "Apex Legends"],
        correct: 0
    },
    {
        question: "4. What type of game is Rocket League?",
        answers: [
            "Racing only",
            "Football with cars",
            "A farming simulator",
            "A fighting game"
        ],
        correct: 1
    },
    {
        question: "5. Which company makes PlayStation consoles?",
        answers: ["Microsoft", "Sega", "Sony", "Ubisoft"],
        correct: 2
    },
    {
        question: "6. What is the popular battle royale game Apex Legends?",
        answers: [
            "A multiplayer hero shooter",
            "A puzzle game",
            "A racing simulator",
            "A basketball game"
        ],
        correct: 0
    },
    {
        question: "7. Which game series features the character Link?",
        answers: [
            "Super Mario",
            "The Legend of Zelda",
            "Pokémon",
            "Sonic the Hedgehog"
        ],
        correct: 1
    },
    {
        question: "8. What does FPS usually stand for in gaming?",
        answers: [
            "Fast Player System",
            "First Person Shooter",
            "Final Play Session",
            "Free Power Setting"
        ],
        correct: 1
    }
];

// Find the HTML elements we need to update.
const quizForm = document.getElementById("quizForm");
const questionsContainer = document.getElementById("questionsContainer");
const questionCount = document.getElementById("questionCount");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const submitButton = document.getElementById("submitButton");
const restartButton = document.getElementById("restartButton");
const results = document.getElementById("results");
const scoreText = document.getElementById("scoreText");
const percentageText = document.getElementById("percentageText");
const feedbackText = document.getElementById("feedbackText");
const resultSummary = document.getElementById("resultSummary");

// Keep track of the quiz state.
let shuffledQuestions = [];
let quizSubmitted = false;

// Randomize the question order.
function shuffleQuestions() {
    shuffledQuestions = [...questions];

    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffledQuestions[i], shuffledQuestions[j]] =
            [shuffledQuestions[j], shuffledQuestions[i]];
    }
}

// Create and display the questions on the webpage.
function displayQuestions() {
    questionsContainer.innerHTML = "";

    shuffledQuestions.forEach(function (question, index) {
        const card = document.createElement("section");
        card.className = "question-card";
        card.id = "question-" + index;

        const number = document.createElement("p");
        number.className = "question-number";
        number.textContent = "QUESTION " + (index + 1);

        const heading = document.createElement("h3");
        heading.textContent = question.question;

        const answersDiv = document.createElement("div");
        answersDiv.className = "answers";

        question.answers.forEach(function (answer, answerIndex) {
            const label = document.createElement("label");
            label.className = "answer-option";

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "question-" + index;
            radio.value = answerIndex;

            const answerText = document.createElement("span");
            answerText.textContent = answer;

            label.appendChild(radio);
            label.appendChild(answerText);
            answersDiv.appendChild(label);

            // Listen for answer selections.
            radio.addEventListener("change", function () {
                updateProgress();
            });
        });

        const feedback = document.createElement("p");
        feedback.className = "answer-feedback";
        feedback.id = "feedback-" + index;

        card.appendChild(number);
        card.appendChild(heading);
        card.appendChild(answersDiv);
        card.appendChild(feedback);

        questionsContainer.appendChild(card);
    });

    updateProgress();
}

// Update the number of questions answered and progress bar.
function updateProgress() {
    let answered = 0;

    shuffledQuestions.forEach(function (question, index) {
        const selected = document.querySelector(
            'input[name="question-' + index + '"]:checked'
        );

        if (selected) {
            answered++;
        }
    });

    questionCount.textContent =
        answered + " / " + shuffledQuestions.length + " answered";

    const percentage = (answered / shuffledQuestions.length) * 100;
    progressBar.style.width = percentage + "%";

    if (answered === shuffledQuestions.length) {
        progressText.textContent = "All questions answered! Ready to submit.";
    } else if (answered > 0) {
        progressText.textContent = "Keep going! You're making progress.";
    } else {
        progressText.textContent = "Select an answer for each question.";
    }
}

// Check the answers and calculate the final score.
quizForm.addEventListener("submit", function (event) {
    // Stop the form from refreshing the webpage.
    event.preventDefault();

    if (quizSubmitted) {
        return;
    }

    let score = 0;
    let unanswered = 0;

    // Check every question.
    shuffledQuestions.forEach(function (question, index) {
        const selected = document.querySelector(
            'input[name="question-' + index + '"]:checked'
        );

        const card = document.getElementById("question-" + index);
        const feedback = document.getElementById("feedback-" + index);
        const options = card.querySelectorAll(".answer-option");

        // Disable answer changes after submission.
        const radios = card.querySelectorAll('input[type="radio"]');

        radios.forEach(function (radio) {
            radio.disabled = true;
        });

        card.classList.remove("correct", "incorrect");

        // Highlight the correct answer.
        options.forEach(function (option, answerIndex) {
            if (answerIndex === question.correct) {
                option.classList.add("correct-answer");
            }
        });

        if (!selected) {
            unanswered++;

            card.classList.add("incorrect");
            feedback.textContent =
                "Not answered. Correct answer: " +
                question.answers[question.correct];

            feedback.className = "answer-feedback incorrect-text";

        } else if (Number(selected.value) === question.correct) {
            // The selected answer is correct.
            score++;

            card.classList.add("correct");
            feedback.textContent = "Correct! Great job.";
            feedback.className = "answer-feedback correct-text";

        } else {
            // The selected answer is incorrect.
            card.classList.add("incorrect");

            options.forEach(function (option) {
                const radio = option.querySelector("input");

                if (radio.checked) {
                    option.classList.add("wrong-answer");
                }
            });

            feedback.textContent =
                "Incorrect. Correct answer: " +
                question.answers[question.correct];

            feedback.className = "answer-feedback incorrect-text";
        }
    });

    // Calculate the final percentage.
    const total = shuffledQuestions.length;
    const percentage = Math.round((score / total) * 100);

    // Display the final results.
    scoreText.textContent = score + " / " + total;
    percentageText.textContent = percentage + "%";

    // Give feedback based on the score.
    if (score === total) {
        feedbackText.textContent = "Perfect Score! You're a gaming expert!";
    } else if (score >= total * 0.75) {
        feedbackText.textContent = "Great job! You know your games!";
    } else if (score >= total * 0.5) {
        feedbackText.textContent = "Good effort! Keep practicing!";
    } else {
        feedbackText.textContent = "Keep learning and try again!";
    }

    resultSummary.textContent =
        "You answered " + (total - unanswered) + " out of " +
        total + " questions. You got " + score + " correct.";

    results.classList.remove("hidden");
    submitButton.disabled = true;
    quizSubmitted = true;

    results.scrollIntoView({ behavior: "smooth", block: "center" });
    results.focus();
});

// Restart the quiz so the user can play again.
restartButton.addEventListener("click", function () {
    quizSubmitted = false;

    quizForm.reset();

    results.classList.add("hidden");
    submitButton.disabled = false;

    scoreText.textContent = "0 / " + questions.length;
    percentageText.textContent = "0%";
    feedbackText.textContent = "";
    resultSummary.textContent = "";

    // Shuffle the questions again for a new attempt.
    shuffleQuestions();
    displayQuestions();

    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Start the quiz when the page loads.
shuffleQuestions();
displayQuestions();
