import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GameSettings, TriviaResponse } from "../types";

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          category: { type: Type.STRING },
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correct_index: { type: Type.INTEGER },
          short_explanation: { type: Type.STRING },
          source_style_note: { type: Type.STRING },
        },
        required: [
          "id",
          "difficulty",
          "category",
          "question",
          "options",
          "correct_index",
          "short_explanation",
          "source_style_note",
        ],
      },
    },
  },
  required: ["questions"],
};

export const generateQuestions = async (settings: GameSettings): Promise<TriviaResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  let promptInstruction = "";
  
  if (settings.comparativeSource !== 'None') {
    // COMPARATIVE MODE PROMPT
    promptInstruction = `
      MODE: COMPARATIVE RELIGIOUS STUDIES.
      You must generate questions that explicitly cross-reference the Bible with: ${settings.comparativeSource}.
      
      SPECIFIC INSTRUCTIONS FOR SOURCES:
      - If "Babylonian & Sumerian": Focus on the Epic of Gilgamesh (Flood), Enuma Elish (Creation/Tehom vs Tiamat), Code of Hammurabi (Law parallels), and the Babylonian Theodicy (Job parallels).
      
      - If "Egyptian & Book of Thoth": Focus on the Instruction of Amenemope (Prov 22 parallels), The Book of Thoth (Hermeticism, Logos theology), Hymn to the Aten (Psalm 104), and the concept of Ma'at vs Righteousness.
      
      - If "Canaanite & Ugaritic": Focus on the Baal Cycle (Storm God imagery in Psalms), the Council of El (Divine Council in Ps 82), and linguistic parallels in Ugaritic texts.
      
      - If "Zoroastrian (Avesta)": Focus on the influence of Persian dualism on Second Temple Judaism, the development of Angelology/Demonology, the Saoshyant (Messiah figure), and Resurrection concepts.
      
      - If "Eastern (Gita/Tao)": Focus on the Bhagavad Gita (Theophany/Arjuna vs Moses on Sinai), Tao Te Ching (The Way vs The Logos), and mystical parallels in Wisdom Literature.
      
      - If "Hellenistic & Greek": Focus on Plato's influence on the New Testament (Hebrews/John), Stoicism in Paul's writings (Acts 17), and the concept of the Logos.
      
      - If "Dead Sea Scrolls": Focus on the Qumran Community, the Manual of Discipline, "Sons of Light vs Sons of Darkness", and textual variants found in the DSS (e.g., 1 Samuel or Jeremiah differences).
      
      - If "Enoch & The Watchers": Focus on 1 Enoch, the Book of Giants, the "Sons of God" (Gen 6), the connection to Jude and 2 Peter, and the development of the Devil/Satan figure distinct from the OT "Accuser".
      
      - If "Gnostic & Apocryphal": Focus on the Nag Hammadi library, Gospel of Thomas (Sayings tradition), Gospel of Judas, Gospel of Mary, and the concept of "Secret Knowledge" (Gnosis) vs Orthodox faith.

      The goal is to show the *relationship* and shared heritage, implying the Bible is part of a larger ancient conversation.
    `;
  } else {
    // STANDARD BIBLE MODE PROMPT
    promptInstruction = `
      MODE: DEEP BIBLICAL SCHOLARSHIP.
      Focus on ${settings.category}.
      Explore textual variants, authorship anomalies (Documentary Hypothesis), and linguistic depth (Greek/Hebrew definitions).
    `;
  }

  const systemPrompt = `
    You are the "Hidden Bible Trivia" engine. Your goal is to explore the historical and literary roots of the Bible, often challenging tradition with scholarship.
    
    CORE PHILOSOPHY:
    We are not dismantling faith, but we are digging deep. We want to show how the Bible connects to the "Babylonian Tablets," Egyptian Scrolls, and other ancient wisdom.
    Treat the user like a university student of comparative religion.
    
    REQUIREMENTS:
    1. **Questions must be academic and surprising.**
    2. **Short Explanation** must be a mini-lesson. For example, "Scholars believe Psalm 104 is directly adapted from the Egyptian Hymn to the Aten."
    3. **Tone:** Respectful, deep, scholarly, curious. 
    
    ${promptInstruction}
  `;

  const userPrompt = `Generate ${settings.count} questions. 
  Difficulty: ${settings.difficulty}.
  Format: JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini.");
    }

    const data = JSON.parse(text) as TriviaResponse;
    return data;
  } catch (error) {
    console.error("Error fetching trivia:", error);
    throw error;
  }
};