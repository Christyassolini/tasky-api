// API base url (local: Spring em 8080 | deploy: proxy /api)
const API_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:8080"
    : "/api"

function getToken() {
    return localStorage.getItem("token");
}

function authHeaders() {
    const token = getToken();
    return token ? { "Authorization": "Bearer " + token } : {};
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "../index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    if (!getToken()) {
        window.location.href = "../index.html";
    }
});

// Salvar tarefa
async function salvarTarefa() {
    // 🔒 Bloqueia múltiplos cliques enquanto está salvando
    const btnSalvar = document.querySelector("button[onclick='salvarTarefa()']");
    if (btnSalvar.disabled) {
        return; // Se já está desabilitado, não faz nada
    }

    // Pega valores digitados pelo usuário
    let titulo = document.getElementById("title").value.trim()
    let descricao = document.getElementById("desc").value.trim()

    // Validações
    if (!titulo) {
        toastWarning('Por favor, preencha o título da tarefa.')
        return
    }

    if (titulo.length > 25) {  // ⚠️ você tinha escrito "lenght" — erro de digitação!
        toastWarning('O título deve ter no máximo 25 caracteres.')
        return
    }

    if (!descricao) {
        toastWarning('Por favor, preencha a descrição da tarefa.')
        return
    }

    // 🔒 Desabilita o botão para evitar cliques múltiplos
    btnSalvar.disabled = true;
    btnSalvar.style.opacity = "0.5";
    btnSalvar.style.cursor = "not-allowed";
    const textoOriginal = btnSalvar.textContent;
    btnSalvar.textContent = "Salvando...";

    // Monta o objeto (o back‑end atribuirá o usuário com base no token)
    let novaTarefa = {
        titulo: titulo,
        description: descricao
    }

    // ✅ try/catch DENTRO da função
    try {
        let resposta = await fetch(`${API_URL}/task`, {
            method: "POST",
            headers: Object.assign({ "Content-Type": "application/json" }, authHeaders()),
            body: JSON.stringify(novaTarefa)
        })

        if (resposta.status === 201) {
            toastSuccess('Tarefa cadastrada com sucesso!')
            setTimeout(() => window.location.href = "./tarefa.html", 1500)
        } else {
            if (resposta.status === 401 || resposta.status === 403) {
                logout();
                return;
            }
            let erro = await resposta.text()
            console.error("Erro do servidor:", erro)
            toastError("Erro ao salvar tarefa. Abra o console (F12) para ver os detalhes.")
            
            // 🔓 Reabilita o botão em caso de erro
            btnSalvar.disabled = false;
            btnSalvar.style.opacity = "1";
            btnSalvar.style.cursor = "pointer";
            btnSalvar.textContent = textoOriginal;
        }

    } catch (erro) {
        console.error("Erro na requisição:", erro)
        toastError("Não foi possível conectar ao servidor. O back-end está rodando?")
        
        // 🔓 Reabilita o botão em caso de erro
        btnSalvar.disabled = false;
        btnSalvar.style.opacity = "1";
        btnSalvar.style.cursor = "pointer";
        btnSalvar.textContent = textoOriginal;
    }

} // ← a função só fecha aqui, depois do try/catch

// Cancela e volta para a lista
function cancelar() {
    window.location.href = "./tarefa.html"
}