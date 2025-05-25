// Garante que o script só rode depois que o HTML completo for carregado
document.addEventListener("DOMContentLoaded", () => {
    // Seletores de elementos:
    // O input não tem um ID no seu HTML, então vamos pegá-lo pela classe.
    const input = document.querySelector(".message-input");
    // A área onde as mensagens são exibidas é a div com a classe "message-area".
    const chatbox = document.querySelector(".message-area");

    // Verifica se os elementos essenciais foram encontrados
    if (!input || !chatbox) {
        console.error("Erro: Elementos HTML essenciais (input ou chatbox) não encontrados no DOM.");
        // Se você quiser uma mensagem visível para o usuário, pode adicionar aqui:
        // alert("Erro ao carregar o chat. Por favor, recarregue a página.");
        return; // Sai da função se os elementos não forem encontrados
    }

    // Função para criar e adicionar uma bolha de mensagem
    function createMessage(text, sender = "user") {
        const message = document.createElement("div");
        // As bolhas de mensagem usam as classes "message-bubble" e "message-user" ou "message-bot"
        message.classList.add("message-bubble", `message-${sender}`);
        message.innerHTML = `<p>${text}</p>`;
        
        // Adiciona a nova mensagem ao final da área de chat
        chatbox.appendChild(message); 
        
        // Rolagem suave para a mensagem mais recente
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    // Função assíncrona para enviar a mensagem
    async function sendMessage() {
        const userText = input.value.trim(); // Pega o texto do input e remove espaços
        if (!userText) return; // Se a mensagem estiver vazia, não faz nada

        // 1. Mostrar mensagem do usuário
        createMessage(userText, "user");
        input.value = ""; // Limpa o input após enviar a mensagem

        // 2. Mensagem de carregamento ("Digitando...")
        const loadingMessage = document.createElement("div");
        loadingMessage.classList.add("message-bubble", "message-bot"); // Usa as classes de bolha
        loadingMessage.innerHTML = `<p>Digitando...</p>`;
        chatbox.appendChild(loadingMessage); // Adiciona ao final da chatbox
        chatbox.scrollTop = chatbox.scrollHeight;

        try {
            // 3. Fazer requisição POST para o backend
            const response = await fetch("/perguntar", { // Envia para a rota '/perguntar' do Flask
                method: "POST", // Método HTTP POST
                headers: {
                    "Content-Type": "application/json", // Informa que o corpo é JSON
                },
                body: JSON.stringify({ pergunta: userText }), // Converte o objeto JavaScript em string JSON
            });

            const data = await response.json(); // Analisa a resposta JSON do backend
            loadingMessage.remove(); // Remove a mensagem "Digitando..."

            // 4. Exibir resposta do bot
            if (data.resposta) {
                createMessage(data.resposta, "bot");
            } else {
                createMessage("Desculpe, algo deu errado com a resposta do Zizi. 😢", "bot");
            }
        } catch (error) { // Lida com erros de rede ou servidor
            loadingMessage.remove();
            createMessage("Erro ao se comunicar com o servidor. Verifique se o backend está rodando. 😢", "bot");
            console.error("Erro na comunicação com o backend:", error);
        }
    }

    // --- Adiciona Event Listeners para Enviar Mensagens ---
    
    // 1. Enviar mensagem ao pressionar Enter no campo de input
    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Previne o comportamento padrão (ex: quebra de linha no input)
            sendMessage();
        }
    });

    // 2. Adicionar funcionalidade aos botões de humor (Feliz, Triste, Ansioso)
    const moodButtons = document.querySelectorAll('.mood-button');
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            const moodText = button.textContent.trim(); // Pega o texto completo do botão (ex: "Estou me sentindo feliz.")
            if (input) { // Verifica se o input existe antes de tentar preenchê-lo
                input.value = moodText; // Preenche o input com o texto do humor
                sendMessage(); // Envia a mensagem automaticamente
            }
        });
    });

    // 3. Adicionar funcionalidade ao botão "Falar com Zizi"
    const falarComZiziButton = document.querySelector('.action-button.primary');
    if (falarComZiziButton) {
        falarComZiziButton.addEventListener('click', () => {
            // Quando este botão é clicado, podemos focar no input para o usuário começar a digitar.
            // Ou, se você quiser enviar uma mensagem específica, descomente e ajuste:
            // input.value = "Oi Zizi, vamos conversar!";
            // sendMessage();
            input.focus(); // Coloca o foco no campo de texto
        });
    }

    // (Os outros botões de ação 'Configurar para meu filho(a)' e 'Preciso de ajuda agora'
    // ainda não têm lógica JS associada aqui. Você pode adicionar conforme sua necessidade.)
});