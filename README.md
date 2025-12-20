# Bhaasha Setu (Indian Script Transliterator)

**Bhaasha Setu** is an advanced AI-powered chatbot designed to bridge linguistic barriers across India. It specializes in **transliterating** text between various Indian scripts, enabling users to read content in their familiar script while preserving the original phonetic sound and language.

> **Core Principle:**  
> **"Only change the script, never the language or meaning."**
>
> 💡 **Inspiration:** This project is inspired by a real-world problem statement from the **Smart India Hackathon (SIH)**, addressing India’s vast linguistic diversity.

---

## 🚀 Features

### 🔤 Smart Transliteration
- Converts text from one Indian script to another **without changing the language**
- Maintains **phonetic accuracy**, pronunciation, and readability

### 🔁 Dual Output System
- **Transliteration Output:** Same language, different script
- **Translation Output:** Meaning of the content for better understanding

### 🎙️ Voice-Enabled Interaction
- **Voice Input:** Speak in your language instead of typing
- **Voice Output:** Hear both **transliteration and translation** in natural-sounding speech
- Enables **hands-free and accessibility-friendly usage**

### 🌐 Multi-Language Support
- Integrated **language selector dropdown** with multiple Indian languages, as shown in the UI:
  - Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati
  - Kannada, Malayalam, Punjabi
  - English (India)
- Instant switching between source and target scripts

### 🖼️ Multi-Modal Input
- **Text Input:** Type directly into the chat
- **Image Upload:** Extract text from images containing Indian script and transliterate it

### 🧠 Context-Aware Processing
- Preserves:
  - Formatting
  - Punctuation
  - Numbers
  - Capitalization
- Ensures output feels **natural and authentic**

---

## 📜 Supported Scripts

### North Indian Scripts
- Devanagari (Hindi, Marathi, Sanskrit)
- Bengali–Assamese
- Gujarati
- Odia (Oriya)
- Gurmukhi (Punjabi)

### South Indian Scripts
- Tamil
- Telugu
- Kannada
- Malayalam

---

## 🛠️ Tech Stack

- **Frontend:** React 19
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **AI Integration:** Groq API  
  - Model: `meta-llama/llama-4-maverick-17b-128e-instruct`
- **Speech Features:**
  - Voice Input (Speech-to-Text)
  - Voice Output (Text-to-Speech)

---

## ⚙️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/bhaasha-setu.git
    cd bhaasha-setu
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your Groq API key:
    ```env
    VITE_GROQ_API_KEY=your_groq_api_key_here
    VITE_GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Build for production:**
    ```bash
    npm run build
    ```

## 📖 Usage

1.  Open the application in your browser.
2.  **Type a message** in any Indian language/script.
3.  **Or Upload an Image** containing text.
4.  The bot will process your input and provide the transliterated text along with a translation.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
