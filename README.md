# AI Portfolio Assistant

A browser-based portfolio chatbot that sends user questions to a Cloudflare Worker, which forwards them to an external LLM API and returns a text reply.

🔗 **Live Demo:** [AI Portfolio Assistant](https://drishtichaudhary.github.io/ai-portfolio-assistant/)  
📂 **Repository:** https://github.com/drishtichaudhary/ai-portfolio-assistant

---

## Quick Overview

This project provides a simple chat interface for asking questions about Drishti Chaudhary's background, projects, education, and skills. The frontend is a static HTML/CSS/JavaScript app. User messages are posted to a Cloudflare Worker endpoint, which appears to act as a serverless API layer between the browser and the LLM provider.

The repository currently includes only the frontend application code, so the exact Worker implementation, prompt construction, and model configuration are not visible here.

---

## Architecture

```text
User
  ↓
Static frontend (HTML + CSS + JavaScript)
  ↓ POST { message: "..." }
Cloudflare Worker endpoint
  ↓
External LLM API
  ↓
JSON response { reply: "..." }
  ↓
Rendered in the chat UI
```

### Request flow
- The UI is rendered from `index.html` and styled with `styles.css`.
- `script.js` captures user input, appends the user's message to the chat window, and sends the message with `fetch()` to a Cloudflare Worker URL.
- The frontend expects a JSON response containing a `reply` field.
- The assistant response is inserted into the chat window.

---

## Core Functionality

- Displays a single-page chat interface.
- Lets the user submit messages by pressing **Enter** or clicking the send button.
- Shows a typing indicator while waiting for a response.
- Sends each message to a remote Worker endpoint.
- Renders the returned reply in the conversation view.
- Falls back to a generic error message if the request fails.
- Focuses the input field on page load.

---

## LLM Integration

The frontend does not contain the LLM prompt or provider configuration. Based on the browser request, the application posts JSON to:

- `https://drishti-portfolio-ai.drishtichaudhary616.workers.dev/`

Observed request format:

```json
{ "message": "user question" }
```

Observed response expectation:

```json
{ "reply": "assistant text" }
```

What can be verified from this repository:
- The frontend uses a remote API endpoint, not a direct browser call to the LLM provider.
- The frontend expects plain text in `reply`.
- There is no conversation history maintained in the frontend code; each request sends only the current user message.
- There is no visible evidence here of embeddings, RAG, tool use, function calling, or fine-tuning.

What cannot be verified from this repository alone:
- The actual LLM provider used by the Worker.
- The exact model name.
- The system prompt or developer instructions.
- Whether the Worker injects portfolio/resume text into the prompt.

---

## Backend / Serverless Implementation

The repository references a Cloudflare Worker at `drishti-portfolio-ai.drishtichaudhary616.workers.dev`, but the Worker source code is not present in this repository.

From the frontend, the following behavior is visible:
- The Worker receives `POST` requests with `Content-Type: application/json`.
- The frontend checks `response.ok` before parsing JSON.
- If the response is not OK, the UI shows a generic connection error message.

Not visible in this repository:
- Request validation on the Worker.
- CORS headers or preflight handling.
- Authentication.
- Rate limiting.
- Secret handling or environment variable names.
- How the Worker calls the upstream AI service.

---

## Frontend

### Technologies
- HTML
- CSS
- Vanilla JavaScript
- Google Fonts: **DM Mono** and **Inter**

### Interaction model
- Single-page chat UI.
- User input is handled through an input field and send button.
- Enter submits the message unless Shift is held.
- Messages are added to the DOM immediately before the network request completes.
- A typing indicator is shown during the simulated wait period.

### UI behavior
- Responsive layout adapts to small screens with a full-height mobile view.
- Messages are styled as left/right chat bubbles.
- User messages are HTML-escaped before insertion into the DOM.

---

## Technology Stack

### Frontend
- HTML
- CSS
- JavaScript
- Google Fonts

### Backend / Serverless
- Cloudflare Workers endpoint referenced from the frontend

### AI / LLM
- External LLM API accessed through the Worker

### Deployment
- GitHub Pages for the static frontend (`https://drishtichaudhary.github.io/ai-portfolio-assistant/`)

---

## Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/drishtichaudhary/ai-portfolio-assistant.git
   cd ai-portfolio-assistant
   ```

2. Open `index.html` in a browser, or serve the files with any static file server.

3. If you want the chatbot to work end-to-end, the referenced Cloudflare Worker endpoint must be available. This repository does not include the Worker source, so you cannot run the backend from this repository alone.

4. The frontend is currently hard-coded to call:
   `https://drishti-portfolio-ai.drishtichaudhary616.workers.dev/`

---

## Deployment

- **Frontend:** GitHub Pages
- **Backend/API:** External Cloudflare Worker endpoint referenced in `script.js`

The repository homepage links to:
- Live demo: https://drishtichaudhary.github.io/ai-portfolio-assistant/
- Repository: https://github.com/drishtichaudhary/ai-portfolio-assistant

---

## Project Structure

- `index.html` — chat UI markup and page structure
- `styles.css` — styling and responsive layout
- `script.js` — message handling, DOM updates, and API requests
- `README.md` — project documentation

---

## Technical Design Notes

- The frontend is intentionally lightweight and uses vanilla JavaScript rather than a framework.
- The browser never calls the LLM provider directly; it talks to a Worker endpoint instead.
- User messages are escaped before being inserted into the DOM, which reduces the risk of HTML injection from user input.
- The repository contains only the client-side portion, so the model prompt and server-side logic remain external to the codebase.

---

## Limitations

- The backend Worker implementation is not included in this repository.
- The actual LLM provider and model cannot be verified from the repository contents alone.
- No conversation history is persisted between messages in the frontend.
- No authentication, rate limiting, or explicit CORS handling is visible in the repository.
- The frontend is hard-coded to a single Worker URL.

---

## Technologies / Skills Demonstrated

- HTML, CSS, and JavaScript
- DOM manipulation
- Asynchronous `fetch()` requests
- Client/server separation
- Serverless API integration
- Basic input sanitization
- Responsive UI implementation

---

## Contact

**Drishti Chaudhary**  
📧 drishtichaudhary616@gmail.com  
🔗 https://www.linkedin.com/in/drishti-chaudhary-047855206  
🌐 https://drishtichaudhary.github.io/Portfolio-site/
