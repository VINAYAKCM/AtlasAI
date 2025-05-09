from fastapi import FastAPI, Request
from pydantic import BaseModel
import requests
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust if your frontend runs elsewhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SummarizeRequest(BaseModel):
    place_name: str
    reviews: list[str]

class SummarizeResponse(BaseModel):
    summary: str

class QARequest(BaseModel):
    place_name: str
    reviews: list[str]
    question: str
    place_details: dict  # Will contain all place information

class QAResponse(BaseModel):
    answer: str

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3.2:latest"

PROMPT_TEMPLATE = (
    "Summarize all the user reviews for {place_name} from Google Maps. Your summary should:\n"
    "- Accurately reflect both positive and negative feedback, giving a balanced view of the overall sentiment.\n"
    "- Highlight the most frequently mentioned aspects (such as service, cleanliness, ambiance, location, value, etc.), noting both strengths and weaknesses.\n"
    "- Mention if there are any notable trends or changes in reviews over time (for example, improvements or declines).\n"
    "- Emphasize any reviews or themes that many people agree with or find relatable.\n"
    "- Write clearly and concisely, making the summary easy to understand for someone who has not read the reviews.\n"
    "- Avoid adding information not present in the reviews.\n"
    "- Structure your summary so a new visitor can quickly grasp the general feeling and key points about the place.\n"
    "- Do NOT use any Markdown, asterisks, bullet points, or formatting symbols.\n"
    "- Write in clean, well-structured paragraphs only.\n"
    "- Split the summary into short, clear paragraphs with line breaks between them.\n"
    "- Keep the summary concise and not too long; users prefer brief, easy-to-read text.\n"
    "\nReviews:\n{reviews}\n\nSummary:"
)

QA_PROMPT_TEMPLATE = (
    "You are Atlas, an expert AI assistant for Google Maps users.\n"
    "You are given information about {place_name} including customer reviews and place details.\n"
    "Answer the user's question using the information provided.\n"
    "If the answer is not in the provided information, say you couldn't find that information.\n"
    "Write your answer in a clear, conversational style with proper line breaks for readability.\n"
    "Do NOT use any Markdown, bullet points, or formatting symbols.\n"
    "\nPlace Details:\n{place_details}\n\nReviews:\n{reviews}\n\nQuestion: {question}\n\nAnswer:"
)

@app.post("/summarize-reviews", response_model=SummarizeResponse)
def summarize_reviews(req: SummarizeRequest):
    prompt = PROMPT_TEMPLATE.format(
        place_name=req.place_name,
        reviews="\n".join(req.reviews)
    )
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False
    }
    response = requests.post(OLLAMA_URL, json=payload)
    response.raise_for_status()
    summary = response.json().get("response", "")
    return {"summary": summary.strip()}

@app.post("/qa", response_model=QAResponse)
def qa(req: QARequest):
    # Format place details into a readable string
    place_details_str = "\n".join([f"{k}: {v}" for k, v in req.place_details.items() if v is not None])
    
    prompt = QA_PROMPT_TEMPLATE.format(
        place_name=req.place_name,
        place_details=place_details_str,
        reviews="\n".join(req.reviews),
        question=req.question
    )
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False
    }
    response = requests.post(OLLAMA_URL, json=payload)
    response.raise_for_status()
    answer = response.json().get("response", "")
    return {"answer": answer.strip()} 