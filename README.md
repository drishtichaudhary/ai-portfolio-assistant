# AI Portfolio Assistant

An AI-assisted portfolio interaction system built with a static web client, a serverless API abstraction layer, and LLM-backed response generation. The frontend lets visitors ask questions about Drishti Chaudhary’s background through a conversational UI, while the browser sends each message to a Cloudflare Worker endpoint that processes the request and returns a JSON reply for rendering in the chat window.

🔗 **Live Demo:** https://drishtichaudhary.github.io/ai-portfolio-assistant/  
📂 **Repository:** https://github.com/drishtichaudhary/ai-portfolio-assistant/

---

## Overview

This project demonstrates a lightweight portfolio interface designed for interactive question-and-answer access to professional information. Instead of a static biography page, the site presents a chat-based experience where the frontend handles conversation input and display, while response generation is delegated to an external serverless API.

The repository contains the client-side implementation and the endpoint reference used by the browser. The backend worker source is not included in the repository, so the README focuses on the implementation that is directly supported by the code and the deployed client behavior.

---

## Architecture

```text
User
↓
Browser UI
(index.html + styles.css + script.js)
↓ HTTPS POST { "message": "<user input>" }
Cloudflare Worker endpoint
↓
Groq LLM API
(Llama 3.1 8B Instant)
↓ JSON { "reply": "<assistant response>" }
Browser chat interface
```

### Repository boundary

| Component | In repository? | Notes |
|---|---:|---|
| Chat UI markup | Yes | `index.html` |
| Styling and responsive layout | Yes | `styles.css` |
| Client-side chat logic | Yes | `script.js` |
| Worker implementation | No | Only the endpoint URL is referenced |
| Upstream LLM provider/model | External | Groq API with Llama 3.1 8B Instant |

---

## Core Functionality

- Conversational portfolio chat interface
- Message submission via **Enter** key or send button
- Immediate rendering of user messages in the chat window
- Typing indicator while waiting for the API response
- Asynchronous `fetch()` request to a remote Worker endpoint
- JSON response handling with a required `reply` field
- Generic fallback message when the request fails
- Responsive layout for smaller screens
- HTML escaping for user-entered text before DOM insertion

---

## Technical Implementation

### Frontend

The application is implemented with plain HTML, CSS, and vanilla JavaScript:

- `index.html` defines the chat layout, message input, send button, typing indicator, and a short disclaimer.
- `styles.css` defines the dark theme, bubble-based layout, responsive behavior, scrollbar styling, and loading animation.
- `script.js` defines the chat behavior, API request flow, response rendering, and input sanitization.

The page also imports Google Fonts (`DM Mono` and `Inter`) for typography.

### Client-side interaction

The interface is event-driven:

- `onkeypress="handleKeyPress(event)"` submits the message on Enter.
- `onclick="sendMessage()"` submits the message from the button.
- `window.onload` focuses the input field when the page loads.

Message lifecycle:

1. Read and trim the input value
2. Ignore empty messages
3. Append the user message to the chat window
4. Clear the input field
5. Show the typing indicator
6. Send the message to the Worker
7. Parse the JSON response
8. Render the assistant reply
9. Scroll the chat window to the latest message

### API communication

The frontend sends a `POST` request to:

```text
https://drishti-portfolio-ai.drishtichaudhary616.workers.dev/
```

Request body:

```json
{
  "message": "user question"
}
```

Expected response shape:

```json
{
  "reply": "assistant response"
}
```

Relevant client-side request logic:

```javascript
const response = await fetch("https://drishti-portfolio-ai.drishtichaudhary616.workers.dev/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: userMessage }),
});
```

If the response is not OK, or if `reply` is missing, the frontend returns a generic connection error message.

### Security / input handling

User input is escaped before it is inserted into the DOM:

```javascript
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
```

This is a meaningful client-side safeguard because user-entered text is rendered in the chat UI. The repository does not expose API credentials in the frontend code.

---

## AI / LLM Integration

The application uses a Cloudflare Worker as the serverless API layer, with the external backend configured to use Groq’s LLM API and Llama 3.1 8B Instant.

### Verified architecture
- The browser does not call the LLM provider directly.
- Each user message is posted to a Worker endpoint as JSON.
- The Worker returns a JSON reply that the frontend renders.

### Verifiable integration points
- Client request payload: `{ "message": "<user input>" }`
- Client response expectation: `{ "reply": "<assistant response>" }`
- External model referenced by the project: **Llama 3.1 8B Instant**

### Not included in this repository
- The Worker source code
- The full prompt template or system prompt
- Any additional conversation-state logic beyond the current message flow

This means the AI portion is implemented through a serverless API boundary, while the model logic itself is handled externally.

---

## Research & Engineering Relevance

This project demonstrates how large language models can be integrated into an interactive software system rather than used as a standalone tool. It shows practical experience with API-based model integration, serverless architecture, asynchronous client-server communication, and client-side input handling.

The separation between the frontend, the Cloudflare Worker API layer, and the external model provider also creates a clean boundary for extending the system with retrieval, conversation state, evaluation workflows, or other LLM-system research directions. For a portfolio project, that makes the implementation more useful than a static demo because it illustrates how model-backed behavior can be embedded into a maintainable web application.

---

## Data Flow

1. The user types a question into the input field.
2. `sendMessage()` appends the user message to the chat window.
3. The typing indicator is shown.
4. `generateResponse()` sends the message as JSON to the Worker endpoint.
5. The Worker forwards the request to Groq’s LLM API.
6. Groq returns a structured response generated by Llama 3.1 8B Instant.
7. The Worker returns JSON containing `reply`.
8. The frontend inserts the reply into the conversation.
9. If the request fails, the frontend displays a fallback error message.

The frontend sends only the current message; there is no persistent conversation memory in the client code.

---

## Technology Stack

### Frontend
- HTML
- CSS
- Vanilla JavaScript
- Google Fonts: DM Mono, Inter

### Backend / Serverless
- Cloudflare Worker endpoint referenced by the frontend

### AI
- Groq API
- Llama 3.1 8B Instant

### Deployment
- GitHub Pages for the static frontend
- External Cloudflare Worker for the chat API

---

## Project Structure

```text
ai-portfolio-assistant/
├── index.html
├── styles.css
├── script.js
└── README.md
```

### File roles

- `index.html` — page structure and chat UI markup
- `styles.css` — visual styling and responsive layout
- `script.js` — event handling, API requests, DOM updates, and sanitization
- `README.md` — project documentation

---

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/drishtichaudhary/ai-portfolio-assistant.git
cd ai-portfolio-assistant
```

### 2. Open the frontend

You can open `index.html` directly in a browser, or serve the folder with a static file server.

Example using Python:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### 3. Backend dependency

The chatbot’s responses depend on the external Cloudflare Worker endpoint configured in `script.js`. Because the Worker source is not included in this repository, the complete application is not locally reproducible from this repo alone.

---

## Deployment

- **Frontend:** GitHub Pages  
  https://drishtichaudhary.github.io/ai-portfolio-assistant/

- **Backend/API:** External Cloudflare Worker endpoint referenced in `script.js`

The frontend is deployed as a static site, and the browser communicates with the Worker URL shown above to obtain chat responses.

---

## Screenshots

---

## Engineering Concepts Demonstrated

- Vanilla JavaScript application structure
- DOM manipulation and event handling
- Asynchronous programming with `fetch()`
- JSON request/response handling
- Client/server separation
- Serverless API integration
- Responsive frontend development
- Basic input sanitization
- Graceful error handling
- Static deployment with GitHub Pages

---

## Design Decisions

- **Lightweight frontend:** The project uses plain JavaScript rather than a framework, which keeps the implementation simple and easy to inspect.
- **Serverless API boundary:** The browser communicates with a Worker endpoint instead of embedding backend credentials or provider logic in the client.
- **Immediate UI feedback:** User messages are rendered immediately, while the assistant response is appended after the network call completes.
- **Client-side escaping:** User text is escaped before insertion into the DOM to reduce injection risk in the chat interface.

---

## Limitations

- The Worker implementation is external to this repository.
- The backend prompt design is not visible in the repository.
- Conversation history is not persisted in the frontend implementation.
- The API endpoint is hard-coded in `script.js`.

---

## Future Improvements

- Include the Worker source and deployment configuration in the repository
- Make the API endpoint configurable through environment variables or build-time settings
- Add conversation-state handling if the backend supports multi-turn context
- Add automated tests for message submission and response rendering
- Add server-side validation and observability in the Worker layer

---

## Live Demo

https://drishtichaudhary.github.io/ai-portfolio-assistant/

---

## Contact

**Drishti Chaudhary**  
drishtichaudhary616@gmail.com  
LinkedIn: https://www.linkedin.com/in/drishti-chaudhary-047855206  
Portfolio: https://drishtichaudhary.github.io/Portfolio-site/
GitHub: https://github.com/drishtichaudhary
