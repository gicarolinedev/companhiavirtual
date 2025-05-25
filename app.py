import os
from flask import Flask, request, jsonify, send_from_directory
from google import genai

app = Flask(__name__)

# Substitua pela sua API key real (sem aspas)
os.environ["GOOGLE_API_KEY"] = "AIzaSyDkzcs5NQxjBOBafCIhka1qFZL3FNtgvHA"

client = genai.Client()
MODEL_ID = "gemini-2.0-flash"

def perguntar_gemini(pergunta):
    response = client.models.generate_content(
        model=MODEL_ID,
        contents=pergunta,
    )
    return response.text

@app.route("/")
def index():
    return send_from_directory("static", "index.html")

@app.route("/perguntar", methods=["POST"])
def perguntar():
    data = request.json
    pergunta = data.get("pergunta", "")
    if not pergunta:
        return jsonify({"erro": "Pergunta não enviada"}), 400

    resposta = perguntar_gemini(pergunta)
    return jsonify({"resposta": resposta})

if __name__ == "__main__":
    app.run(debug=True)
