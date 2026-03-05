const API_URL = "http://135.232.112.135:8080"
//const API_URL = "/api"

// JWT helpers
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

// Remove USER_ID constant; backend determina o usuário pelo token



// Ao carregar a página, valida o token e busca as tarefas
document.addEventListener("DOMContentLoaded", () => {
    if (!getToken()) {
        // usuário não autenticado
        window.location.href = "../index.html";
        return;
    }
    carregarTarefas()
})

// Buscar e listar tarefas
async function carregarTarefas() {
    let container = document.getElementById("tarefas-group");
    container.innerHTML = "<p>Carregando tarefas...</p>"

    try {
        let resposta = await fetch(`${API_URL}/task/user`, {
            headers: authHeaders()
        })

        if (!resposta.ok) {
            if (resposta.status === 401 || resposta.status === 403) {
                // token inválido ou expirado
                logout();
                return;
            }
            container.innerHTML = "<p>Erro ao carregar tarefas.</p>"
            return
        }

        let tarefas = await resposta.json() // Converte a resposta em array de objetos

        // Se não tiver nenhuma tarefa ainda
        if (tarefas.length === 0) {
            container.innerHTML = "<p>Nenhuma tarefa cadastrada ainda.</p>"
            return
        }

        // Limpa o container e renderiza cada tarefa
        container.innerHTML = ""
        tarefas.forEach(tarefa => {
            container.innerHTML += criarCardTarefa(tarefa)
        });

    } catch (erro) {
        console.error("Erro ao buscar tarefas:", erro)
        container.innerHTML = "<p>Não foi possível conectar ao servidor.</p>"
    }
}

// Cria o HTML de uma tarefa
function criarCardTarefa(tarefa) {
    // Usamos template literals para montar o HTML de cada card
    // O data-id guarda o ID da tarefa dentro do próprio elemento HTML
    return `
        <div class="tarefas-field" data-id="${tarefa.id}">
            <div class="nome-tarefa" onclick="toggleAccordion(this, event)">
                <h2>${tarefa.titulo}</h2>
                <span class="accordion-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg></span>
            </div>
            <div class="accordion-content" style="display: none;">
                <p class="accordion-description">${tarefa.description}</p>
            </div>
            <div class="btn-tarefas">
                <div class="dropdown-container">
                    <button onclick="toggleEditar(${tarefa.id})">
                        <div class="btn editar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                            <p>Editar</p>
                        </div>
                    </button>

                    <!-- Dropdown de edição — começa oculto -->
                    <div class="dropdown-menu" id="dropdown-${tarefa.id}" style="display: none;">
                        <div class="dropdown-item">
                            <label>Nome da tarefa:</label>
                            <input type="text" id="titulo-${tarefa.id}" value="${tarefa.titulo}">
                        </div>
                        <div class="dropdown-item">
                            <label>Descrição:</label>
                            <textarea id="desc-${tarefa.id}" maxlength="500">${tarefa.description}</textarea>
                        </div>
                        <div class="dropdown-actions">
                            <button class="btn-salvar" onclick="salvarEdicao(${tarefa.id})">Salvar</button>
                            <button class="btn-cancelar" onclick="toggleEditar(${tarefa.id})">Cancelar</button>
                        </div>
                    </div>
                </div>

                <div class="btn excluir" onclick="excluirTarefa(${tarefa.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    <p>Excluir</p>
                </div>
            </div>
        </div>
    `
}



// Abrir / Fechar accordion
function toggleAccordion(element, event) {
    // Evita que o clique no título abra o dropdown de edição
    const tarefasField = element.closest('.tarefas-field')
    const accordion = tarefasField.querySelector('.accordion-content')
    const icon = element.querySelector('.accordion-icon')

    // Verifica se está aberto
    const isOpen = accordion.style.display !== 'none'

    if (isOpen) {
        accordion.style.display = 'none'
        icon.style.transform = 'rotate(0deg)'
    } else {
        accordion.style.display = 'block';
        icon.style.transform = 'rotate(-180deg)'
    }
}

// Abrir / Fechar dropdown de edição


function toggleEditar(tarefaId) {
    const dropdown = document.getElementById(`dropdown-${tarefaId}`)
    const estaAberto = dropdown.classList.contains("active")

    // Fecha todos primeiro
    document.querySelectorAll(".dropdown-menu").forEach(d => {
        d.classList.remove("active")
        d.style.display = "none"
    })

    // Se estava fechado, abre. Se estava aberto, já fechou acima.
    if (!estaAberto) {
        dropdown.style.display = ""
        dropdown.classList.add("active")
    }
}

// Fecha ao clicar fora
document.addEventListener("click", (e) => {
    // Não fecha o accordion quando clica em elementos dentro dele
    if (!e.target.closest(".dropdown-container") && !e.target.closest(".accordion-content")) {
        document.querySelectorAll(".dropdown-menu").forEach(d => {
            d.classList.remove("active")
            d.style.display = "none"
        })
    }
})


// Salvar edição
async function salvarEdicao(tarefaId) {
    const novoTitulo = document.getElementById(`titulo-${tarefaId}`).value.trim()
    const novaDesc = document.getElementById(`desc-${tarefaId}`).value.trim()

    if (!novoTitulo) {
        toastWarning("O título não pode ficar vazio.");
        return
    }

    if (!novaDesc) {
        toastWarning("A descrição não pode ficar vazia.");
        return
    }

    // O PUT atualiza título e descrição; o backend usa o usuário do token
    const tarefaAtualizada = {
        titulo: novoTitulo,
        description: novaDesc
    };

    try {
        const resposta = await fetch(`${API_URL}/task/${tarefaId}`, {
            method: "PUT",
            headers: Object.assign({ "Content-Type": "application/json" }, authHeaders()),
            body: JSON.stringify(tarefaAtualizada)
        });

        if (resposta.status === 204) { // 204 = No Content (seu controller retorna isso)
            toastSuccess("Tarefa atualizada com sucesso!")
            carregarTarefas(); // Recarrega a lista para refletir a mudança
        } else {
            if (resposta.status === 401 || resposta.status === 403) {
                logout();
                return;
            }
            const erro = await resposta.text();
            console.error("Erro ao atualizar:", erro)
            toastError("Erro ao atualizar tarefa.");
        }

    } catch (erro) {
        console.error("Erro na requisição:", erro)
        toastError("Não foi possível conectar ao servidor.")
    }
}

// Excluir tarefa
async function excluirTarefa(tarefaId) {
    showConfirmModal("Tem certeza que deseja excluir esta tarefa?", async () => {
        try {
            const resposta = await fetch(`${API_URL}/task/${tarefaId}`, {
                method: "DELETE",
                headers: authHeaders()
            });

            if (resposta.status === 204) { // 204 = No Content
                toastSuccess("Tarefa excluída com sucesso!")
                carregarTarefas() // Recarrega a lista sem a tarefa excluída
            } else {
                if (resposta.status === 401 || resposta.status === 403) {
                    logout();
                    return;
                }
                toastError("Erro ao excluir tarefa.")
            }

        } catch (erro) {
            console.error("Erro na requisição:", erro)
            toastError("Não foi possível conectar ao servidor.")
        }
    });
}