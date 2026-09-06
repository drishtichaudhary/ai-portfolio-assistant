# AI Portfolio Assistant

An LLM-powered conversational portfolio application that allows visitors to ask natural-language questions about Drishti Chaudhary's education, research, internships, projects, leadership, and technical skills.

The system combines a lightweight static frontend with a separately deployed Cloudflare Worker backend and Groq-based LLM inference. The backend performs request validation, prompt-based context grounding, model invocation, fallback handling, and response normalization before returning the generated answer to the browser.

**Live Demo:** https://drishtichaudhary.github.io/ai-portfolio-assistant/

**Repository:** https://github.com/drishtichaudhary/ai-portfolio-assistant/

---

## Overview

Traditional portfolios require visitors to navigate multiple sections to locate relevant information. This project explores a conversational alternative: users can ask questions in natural language and receive concise responses grounded in structured portfolio information.

For example, visitors can ask:

- "What is Drishti's research experience?"
- "What machine learning projects has she worked on?"
- "Tell me about her DRDO internship."
- "What are her technical skills?"
- "What projects has she built using Flutter?"
- "What are her research interests?"

The application is intentionally lightweight. The frontend is implemented using HTML, CSS, and vanilla JavaScript, while the LLM integration is handled server-side through a Cloudflare Worker.

---

## System Architecture

```text
                         User
                           │
                           ▼
              ┌─────────────────────────┐
              │     Static Frontend     │
              │   HTML / CSS / JS       │
              └────────────┬────────────┘
                           │
                    HTTPS POST
              { "message": "..." }
                           │
                           ▼
              ┌─────────────────────────┐
              │    Cloudflare Worker    │
              │                         │
              │ • Request validation    │
              │ • CORS handling         │
              │ • Prompt construction   │
              │ • API-key management    │
              │ • Model fallback        │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │       Groq API          │
              │ OpenAI-compatible API   │
              └────────────┬────────────┘
                           │
                           ▼
                    LLM Inference
                           │
                           ▼
                 { "reply": "..." }
                           │
                           ▼
              ┌─────────────────────────┐
              │     Frontend UI         │
              │ Render assistant reply  │
              └─────────────────────────┘
````

### Component Responsibilities

**Frontend**

Responsible for:

* capturing user input,
* rendering conversation messages,
* displaying the typing indicator,
* sending asynchronous API requests,
* and rendering the returned response.

**Cloudflare Worker**

Acts as the serverless application layer between the browser and the LLM provider. It is responsible for:

* validating incoming requests,
* handling CORS preflight requests,
* reading the API key from an environment secret,
* constructing the system prompt,
* calling the Groq API,
* handling model/API failures,
* and returning a normalized JSON response.

**Groq API**

Provides the LLM inference layer through an OpenAI-compatible chat-completions interface.

---

## Key Features

* Natural-language portfolio Q&A
* LLM-powered response generation
* Prompt-based context grounding
* Serverless backend using Cloudflare Workers
* Server-side API-key handling
* Groq API integration
* Sequential model fallback
* CORS support
* JSON request/response handling
* Input validation
* Graceful API failure handling
* Asynchronous frontend communication
* HTML escaping before DOM insertion
* Responsive chat interface

---

## Frontend Implementation

The client is intentionally implemented without a JavaScript framework.

### Technologies

* HTML5
* CSS3
* Vanilla JavaScript
* Google Fonts

### `index.html`

Defines the structure of the application, including:

* chat interface,
* message container,
* user input field,
* send button,
* typing indicator,
* and introductory assistant message.

### `styles.css`

Provides:

* dark-themed visual design,
* chat bubble styling,
* responsive layout,
* mobile adaptation,
* loading/typing animation,
* and interface spacing and typography.

### `script.js`

Handles:

* user message submission,
* Enter-to-send interaction,
* asynchronous API requests using `fetch()`,
* typing indicator behavior,
* assistant response rendering,
* error fallback behavior,
* and HTML escaping for user-generated text.

---

## Backend Architecture

The Cloudflare Worker is maintained and deployed separately from this frontend repository.

The browser communicates with the Worker through:

```text
POST https://drishti-portfolio-ai.drishtichaudhary616.workers.dev/
```

### Request

```json
{
  "message": "Tell me about Drishti's research experience."
}
```

### Response

```json
{
  "reply": "Drishti has research experience in machine-learning-based SQL injection detection..."
}
```

The Worker validates that the request contains a non-empty string before invoking the LLM.

Malformed or invalid requests are handled without attempting an upstream model call.

---

## LLM Integration

The backend uses **Groq** as the LLM inference provider.

The Worker communicates with Groq through its OpenAI-compatible chat-completions API.

The model configuration currently uses a sequential fallback strategy:

1. `openai/gpt-oss-20b`
2. `openai/gpt-oss-120b`
3. `llama-3.1-8b-instant`

Models are attempted sequentially rather than simultaneously. If a supported model/API failure occurs, the Worker proceeds to the next configured model.

This provides a basic resilience mechanism against model-specific availability and rate-limit failures.

### Generation Configuration

The current Worker uses:

```text
temperature = 0.5
max_tokens = 350
```

The relatively low temperature encourages more consistent and controlled responses for factual portfolio questions.

---

## Prompt-Based Knowledge Grounding

The assistant is grounded using a structured system prompt containing portfolio information.

The prompt includes information about:

* education,
* research experience,
* internships,
* leadership roles,
* student organizations,
* projects,
* technical skills,
* awards,
* and professional interests.

The user's message is sent separately as the user-level input.

Conceptually:

```text
System Message
    ↓
Structured portfolio context
    ↓
User Message
    ↓
LLM
    ↓
Grounded response
```

This implementation uses **prompt-based grounding**, not Retrieval-Augmented Generation (RAG).

The current system does not use:

* embeddings,
* vector databases,
* document retrieval,
* fine-tuning,
* function calling,
* or autonomous agent workflows.

This distinction is intentional: the project demonstrates a lightweight LLM application architecture rather than a retrieval system.

---

## Request Lifecycle

A typical interaction follows this sequence:

1. The visitor enters a question.
2. The frontend immediately displays the user's message.
3. A typing indicator is displayed.
4. JavaScript sends the question to the Cloudflare Worker using HTTPS.
5. The Worker validates the request.
6. The Worker constructs the LLM request using the structured portfolio context.
7. The Worker sends the request to Groq.
8. Groq performs model inference.
9. The Worker extracts the generated response.
10. The Worker returns a normalized JSON object containing `reply`.
11. The frontend renders the assistant response.
12. The typing indicator is removed.

---

## Reliability & Error Handling

Because the application depends on an external inference API, failure handling is part of the backend design.

The Worker implements:

* CORS preflight handling
* HTTP method validation
* malformed JSON handling
* empty-message validation
* API-key existence checks
* upstream API status checking
* sequential model fallback
* rate-limit handling
* controlled user-facing error responses

For example, if a configured model returns a supported error such as a rate-limit response, the Worker attempts the next model in the fallback sequence.

The frontend also provides a generic fallback message when the backend cannot return a successful response.

---

## Security Considerations

The system follows a basic client/server security boundary.

### API Key Protection

The Groq API key is stored as a **Cloudflare Worker environment secret**.

The key is not included in:

* `index.html`,
* `styles.css`,
* or `script.js`.

The browser therefore communicates with the Worker rather than directly exposing provider credentials to the client.

### Input Handling

User-generated text is escaped before being inserted into the DOM.

This reduces the risk of user input being interpreted as executable HTML when rendered in the chat interface.

### Scope of Security

These measures provide basic protection for a small portfolio application. The project is not intended to claim production-grade security.

Features such as authentication, advanced abuse prevention, persistent audit logging, and sophisticated rate limiting are outside the current scope.

---

## Research & Engineering Relevance

This project is primarily an **applied LLM engineering project**, rather than an academic research study.

Its research relevance comes from the engineering questions involved in integrating language models into real software systems:

* How should structured personal and professional knowledge be provided to an LLM?
* How can generated responses be constrained to known information?
* How should client and inference layers be separated?
* How can API credentials be kept outside the browser?
* How can a serverless application handle external model failures?
* How can different models be incorporated into a fallback architecture?
* How should response quality and factual consistency be evaluated?

These questions connect the project to broader areas including:

* Large Language Model applications
* Natural Language Processing
* Prompt Engineering
* Human-Computer Interaction
* Serverless Computing
* AI Systems Engineering
* Reliable API Design

---

## Engineering Challenges & Learnings

### 1. Client–Server Separation

A static frontend cannot safely contain provider credentials. The project therefore separates the browser interface from the LLM inference layer using a serverless Worker.

### 2. Prompt-Based Grounding

Portfolio information is provided as structured context to reduce unsupported responses and keep the assistant focused on known information.

### 3. External API Reliability

LLM APIs can experience rate limits or model-specific failures. The Worker therefore uses sequential model fallback rather than depending on a single model configuration.

### 4. Asynchronous Communication

The frontend uses asynchronous `fetch()` requests and manages intermediate UI states while waiting for the backend.

### 5. Input Safety

User input is escaped before DOM insertion to reduce HTML injection risks.

### 6. Serverless Deployment

The project demonstrates how a static frontend can communicate with a separately deployed serverless inference layer without requiring a traditional application server.

---

## Deployment

### Frontend

The frontend is deployed using **GitHub Pages**:

[https://drishtichaudhary.github.io/ai-portfolio-assistant/](https://drishtichaudhary.github.io/ai-portfolio-assistant/)

### Backend

The backend is deployed as a **Cloudflare Worker**.

The frontend communicates with:

```text
https://drishti-portfolio-ai.drishtichaudhary616.workers.dev/
```

### Inference

LLM inference is provided through the **Groq API**.

The three components therefore have separate responsibilities:

```text
GitHub Pages
    ↓
Cloudflare Workers
    ↓
Groq API
```

---

## Reproducibility

The frontend source code is contained in this repository.

The Cloudflare Worker backend is maintained separately because it contains server-side configuration and environment secrets.

To reproduce the frontend:

```bash
git clone https://github.com/drishtichaudhary/ai-portfolio-assistant.git
cd ai-portfolio-assistant
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

The frontend can run independently, but end-to-end AI responses require the deployed Worker endpoint.

The Groq API key should **never** be placed in frontend source code.

---

## Project Structure

```text
ai-portfolio-assistant/
├── index.html
├── styles.css
├── script.js
└── README.md
```

### File Roles

| File         | Purpose                                              |
| ------------ | ---------------------------------------------------- |
| `index.html` | Chat interface structure                             |
| `styles.css` | Visual design and responsive layout                  |
| `script.js`  | User interaction, API communication, and DOM updates |
| `README.md`  | Project documentation                                |

> The Cloudflare Worker backend is deployed separately and is not included in this repository.

---

## Technical Skills Demonstrated

### Frontend

* HTML
* CSS
* JavaScript
* DOM manipulation
* Event handling
* Responsive UI development

### AI / LLM

* Large Language Model integration
* Groq API
* OpenAI-compatible API interfaces
* Prompt engineering
* Context grounding
* Controlled text generation
* Model fallback strategies

### Backend & Cloud

* Cloudflare Workers
* Serverless architecture
* REST-style API communication
* CORS
* Environment secrets
* Client/server separation

### Software Engineering

* Asynchronous programming
* JSON request/response handling
* Input validation
* Error handling
* API integration
* Basic input sanitization
* Fault-tolerant request handling

---

## Limitations

The current implementation has several intentional limitations:

* The Cloudflare Worker source is maintained separately from this repository.
* Portfolio knowledge is provided through a static system prompt rather than a retrieval system.
* Conversation history is not persisted across requests.
* The application depends on external LLM API availability.
* There is no formal automated benchmark for response quality.
* There is no vector database or document retrieval pipeline.

These limitations also provide clear directions for future development.

---

## Future Directions

Potential improvements include:

### Retrieval-Augmented Generation

Replace the static prompt with a retrieval pipeline backed by a structured portfolio knowledge base.

### Persistent Multi-Turn Context

Maintain conversation history so the assistant can answer follow-up questions using previous turns.

### Response Evaluation

Introduce an evaluation framework measuring:

* factual consistency,
* relevance,
* response latency,
* hallucination rate,
* and user satisfaction.

### Model Comparison

Benchmark different LLMs using the same portfolio context and evaluation dataset.

### Prompt Robustness Testing

Evaluate how the system behaves under:

* ambiguous questions,
* adversarial prompts,
* unsupported questions,
* and attempts to elicit information outside the provided context.

### Observability

Add structured logging and monitoring for:

* request latency,
* model failures,
* rate limits,
* fallback frequency,
* and response errors.

---

## Outcome

The result is a publicly deployed conversational portfolio system that connects a static browser interface to a serverless LLM backend.

The project demonstrates an end-to-end LLM application architecture:

```text
User Interaction
       ↓
Frontend Application
       ↓
Serverless API Layer
       ↓
Prompt / Context Construction
       ↓
LLM Inference
       ↓
Structured Response
       ↓
User Interface
```

Rather than presenting AI as an isolated model call, the project demonstrates how an LLM can be incorporated into a complete software system with API boundaries, security considerations, validation, failure handling, and deployment infrastructure.

---

## Demonstration

An interactive live demonstration of the conversational interface is deployed and accessible at:

**[https://drishtichaudhary.github.io/ai-portfolio-assistant/](https://drishtichaudhary.github.io/ai-portfolio-assistant/)**

---

## Contact

* **Name:** Drishti Chaudhary
* **Email:** [drishtichaudhary616@gmail.com](mailto:drishtichaudhary616@gmail.com)
* **LinkedIn:** [https://www.linkedin.com/in/drishti-chaudhary-047855206](https://www.linkedin.com/in/drishti-chaudhary-047855206)
* **GitHub:** [https://github.com/drishtichaudhary](https://github.com/drishtichaudhary)
* **Portfolio:** [https://drishtichaudhary.github.io/Portfolio-site/](https://drishtichaudhary.github.io/Portfolio-site/)

```
