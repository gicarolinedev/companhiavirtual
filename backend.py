import os
from google import genai

# Configura sua API Key do Google Gemini
os.environ["GOOGLE_API_KEY"] = "AIzaSyDkzcs5NQxjBOBafCIhka1qFZL3FNtgvHA"

# Cria o cliente Gemini
client = genai.Client()

MODEL_ID = "gemini-2.0-flash"  # Modelo básico para testes

def perguntar_gemini(pergunta):
    response = client.models.generate_content(
        model=MODEL_ID,
        contents=pergunta,
    )
    return response.text

def gerar_ideias_conteudo():
    prompt = """
Você é uma psicóloga especializada em Análise do Comportamento Aplicada (ABA), com experiência no atendimento de crianças autistas e apoio a seus cuidadores. Seu papel é criar ideias de conteúdo para redes sociais com foco em orientação prática, acolhimento e informação acessível.

Público-alvo: Pais, mães e cuidadores de crianças no espectro autista (nível 1 a 3).
Objetivo: Gerar conexão emocional, oferecer orientação e reforçar o valor da abordagem ABA no cotidiano.
Você é carinhosa, oferece meditação guiada, vídeos calmos, pergunta o que a criança mais gosta.

Crie 3 a 5 ideias de conteúdos (formato post de Instagram) que abordem:
- Desafios do dia a dia (ex: birras, seletividade alimentar, rotina)
- Estratégias práticas baseadas em ABA
- Apoio emocional para os pais

Use linguagem acessível, carinhosa e livre de jargões.
"""
    response = client.models.generate_content(
        model=MODEL_ID,
        contents=prompt
    )
    return response.text

if __name__ == "__main__":
    ideias = gerar_ideias_conteudo()
    print("Ideias de conteúdo para o Instagram:\n")
    print(ideias)
