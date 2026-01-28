async function generateResponse(userMessage) {
  try {
    console.log('Sending message to API:', userMessage);
    
    const response = await fetch("https://drishti-portfolio-ai.drishtichaudhary616.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    
    if (!data.reply) {
      throw new Error('No reply in response data');
    }
    
    return data.reply;
  } catch (error) {
    console.error('Error generating response:', error);
    return "Sorry, I'm having trouble connecting right now. Please try again later.";
  }
}


function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message === '') return;
    
    const chatWindow = document.getElementById('chatWindow');
    const typingIndicator = document.getElementById('typingIndicator');
    
    // Add user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user';
    userMessageDiv.innerHTML = `<div class="message-bubble">${escapeHtml(message)}</div>`;
    chatWindow.appendChild(userMessageDiv);
    
    // Clear input
    input.value = '';
    
    // Show typing indicator
    typingIndicator.classList.add('show');
    
    // Scroll to bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
    
    // Generate and show AI response after delay
    setTimeout(async () => {
        typingIndicator.classList.remove('show');

        const aiMessageDiv = document.createElement('div');
        aiMessageDiv.className = 'message ai';

        const response = await generateResponse(message);

        aiMessageDiv.innerHTML = `<div class="message-bubble">${response}</div>`;
        chatWindow.appendChild(aiMessageDiv);

        chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Focus input on load
window.onload = () => {
    document.getElementById('messageInput').focus();
};
