document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const inputContainer = document.getElementById('input-container');
    let userAnswers = {};
    let currentStep = 0;

    const conversation = [
        {
            message: "Hello! I'm Disha, your guide to the PM Internship Scheme. I can help you find the best internships for you. Let's start with a few quick questions.",
            buttons: [
                { text: "Start", value: "start" }
            ],
            nextStep: 1
        },
        {
            message: "First, what's your highest level of education? 🎓",
            buttons: [
                { text: "High School", value: "High School" },
                { text: "Undergraduate", value: "Undergraduate" },
                { text: "Postgraduate", value: "Postgraduate" }
            ],
            key: "education"
        },
        {
            message: "Great. What is your main field of study? 📚",
            buttons: [
                { text: "Engineering", value: "Engineering" },
                { text: "Arts/Humanities", value: "Arts/Humanities" },
                { text: "Commerce", value: "Commerce" },
                { text: "Science", value: "Science" },
            ],
            key: "field_of_study"
        },
        {
            message: "What are your key skills? You can select more than one.",
            buttons: [
                { text: "Coding", value: "Coding" },
                { text: "Communication", value: "Communication" },
                { text: "Data Entry", value: "Data Entry" },
                { text: "Social Media", value: "Social Media" },
                { text: "Project Management", value: "Project Management" }
            ],
            key: "skills",
            multiple: true
        },
        {
            message: "Which sector interests you the most? 💼",
            buttons: [
                { text: "IT", value: "IT" },
                { text: "Non-profit", value: "Non-profit" },
                { text: "Healthcare", value: "Healthcare" },
                { text: "Finance", value: "Finance" }
            ],
            key: "sector_interest"
        },
        {
            message: "And finally, where would you like to do an internship? 📍",
            buttons: [
                { text: "My Home State", value: "Home State" },
                { text: "Anywhere in India", value: "Anywhere in India" },
                { text: "Prefer a city", value: "Prefer a city" }
            ],
            key: "location"
        },
        {
            message: "Thank you! Let me find the perfect internships for you...",
            isFinal: true
        }
    ];

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showRecommendations(recommendations) {
        if (recommendations.length === 0) {
            addMessage("I'm sorry, I couldn't find any perfect matches. Please try again with different preferences!", 'bot');
            return;
        }

        addMessage("Here are a few internships that might be a great fit for you! 😊", 'bot');
        recommendations.forEach(rec => {
            const card = document.createElement('div');
            card.classList.add('recommendation-card');
            card.innerHTML = `
                <h3>${rec.title}</h3>
                <p><strong>Company:</strong> ${rec.company}</p>
                <p><strong>Location:</strong> ${rec.location}</p>
                <p>${rec.description}</p>
            `;
            chatMessages.appendChild(card);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
        inputContainer.innerHTML = '<p class="end-message">This is the end of our chat. Please refresh the page to start over.</p>';
    }

    function handleUserInput(value) {
        const step = conversation[currentStep];
        addMessage(value, 'user');
        
        if (step.key) {
            userAnswers[step.key] = value;
        }
        
        currentStep++;

        if (conversation[currentStep].isFinal) {
            addMessage(conversation[currentStep].message, 'bot');
            sendAnswersToBackend();
        } else {
            showNextQuestion();
        }
    }

    function showNextQuestion() {
        const step = conversation[currentStep];
        if (!step) return;

        addMessage(step.message, 'bot');
        inputContainer.innerHTML = '';
        const buttonGroup = document.createElement('div');
        buttonGroup.classList.add('button-group');

        step.buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.classList.add('chat-button');
            btn.textContent = button.text;
            btn.onclick = () => handleUserInput(button.value);
            buttonGroup.appendChild(btn);
        });
        inputContainer.appendChild(buttonGroup);
    }

    function sendAnswersToBackend() {
        fetch('/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userAnswers)
        })
        .then(response => response.json())
        .then(data => {
            showRecommendations(data);
        })
        .catch(error => {
            console.error('Error:', error);
            addMessage("Oops! Something went wrong. Please try again later.", 'bot');
        });
    }

    // Start the conversation
    showNextQuestion();
});