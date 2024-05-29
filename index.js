const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const upload = multer({ dest: 'uploads/' });
const { parse } = require('csv-parse/sync');
const MODEL_NAME = "gemini-1.0-pro";

dotenv.config();

const express = require("express");
const app = express();
const port = 8081; // Changed port to avoid conflict

const cors = require("cors");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send({ message: "Gemini AI working well" });
});

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
  temperature: 0.5,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

app.get("/gemini", async (req, res) => {
  console.log({ text:  req.query.text });
  const requestq = { text:(await req.query.text).replace(/\s+/g, ' ').trim() };
  const prompt = requestq.text;
  try {
    const chat = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: "your name is Herman"}],
        },
        {
          role: "model",
          parts: [{ text: "My name is Ghilli, Developed by Herman."}],
        },
        {
          role: "user",
          parts: [{ text: "Who are you?"}],
        },
        {
          role: "model",
          parts: [{ text: "My name is Ghilli, a large multi-modal model, trained by Herman."}],
        },
        {
          role: "user",
          parts: [{ text: "who is herman?"}],
        },
        {
          role: "model",
          parts: [{ text: "Herman is a FullStack developer."}],
        },
        {
          role: "user",
          parts: [{ text: "I am give the multiple json data so you compain the datas then give the answer. I need string only. Do not give me the code or table"}],
        },
        {
          role: "model",
          parts: [{ text: "ok I compain all the json data then give it answer"}],
        },
      
      ],
    });
    const result = await chat.sendMessage(`${prompt}`);
    const response = result.response;
    const text = response.text()
    console.log(text);
    return res.status(200).send({ question: prompt, answer: text });
  } catch (e) {
    console.error("Error generating content:", e);
    res.status(500).json({ message: e.message });
  }
});
app.listen(port, () => {
  console.log(`The Gemini-api running at http://localhost:${port}`);
});
