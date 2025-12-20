# Bhaasha Setu (Indian Script Transliterator)

**Bhaasha Setu** is an advanced AI-powered chatbot designed to bridge linguistic barriers across India. It specializes in **transliterating** text between various Indian scripts, enabling users to read content in their familiar script while preserving the original phonetic sound and language.

> **Core Principle:** "Only change the script, never the language or meaning."
>
> 💡 **Inspiration:** This project idea is based on a problem statement from the **Smart India Hackathon (SIH)**.

## 🚀 Features

*   **Smart Transliteration:** Converts text from one script to another while maintaining accurate pronunciation.
*   **Dual Output System:**
    *   **Transliteration:** The original content rendered in the target script.
    *   **Translation:** The meaning of the content in the same language.
*   **Multi-Modal Input:**
    *   **Text:** Type directly into the chat.
    *   **Images:** Upload images containing Indian script text for extraction and conversion.
*   **Context Aware:** Preserves formatting, punctuation, numbers, and capitalization.

## 📜 Supported Scripts

**North Indian:**
*   Devanagari (Hindi, Marathi, Sanskrit, Nepali)
*   Bengali–Assamese
*   Gujarati
*   Odia (Oriya)
*   Gurmukhi (Punjabi)
*   Kashmiri, Maithili, Dogri

**South Indian:**
*   Tamil
*   Telugu
*   Kannada
*   Malayalam

**Other / Ancient:**
*   Perso-Arabic (Urdu)
*   Sharada, Grantha
*   Brahmi, Kharosthi, Indus Script

## 🛠️ Tech Stack

*   **Frontend:** [React 19](https://react.dev/)
*   **Build Tool:** [Vite 7](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **AI Integration:** [Groq API](https://groq.com/) (Model: `meta-llama/llama-4-maverick-17b-128e-instruct`)

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
