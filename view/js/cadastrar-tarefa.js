const API_URL = "http://localhost:8080"

// Salvar tarefa
async function salvarTarefa() {

    // Pega valores digitados pelo usuário
    let titulo = document.getElementById("title").value.trim()
    let descricao = document.getElementById("desc").value.trim()
    let userId = document.getElementById("userId").value

    // Validações
    if (!titulo) {
        alert('Por favor, preencha o título da tarefa.')
        return
    }

    if (titulo.length > 25) {  // ⚠️ você tinha escrito "lenght" — erro de digitação!
        alert('O título deve ter no máximo 25 caracteres.')
        return
    }

    if (!descricao) {
        alert('Por favor, preencha a descrição da tarefa.')
        return
    }

    // Monta o objeto
    let novaTarefa = {
        titulo: titulo,
        description: descricao,
        user: {
            id: parseInt(userId)
        }
    }

    // ✅ try/catch DENTRO da função
    try {
        let resposta = await fetch(`${API_URL}/task`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novaTarefa)
        })

        if (resposta.status === 201) {
            alert('Tarefa cadastrada com sucesso!')
            window.location.href = "./tarefa.html"
        } else {
            let erro = await resposta.text()
            console.error("Erro do servidor:", erro)
            alert("Erro ao salvar tarefa. Abra o console (F12) para ver os detalhes.")
        }

    } catch (erro) {
        console.error("Erro na requisição:", erro)
        alert("Não foi possível conectar ao servidor. O back-end está rodando?")
    }

} // ← a função só fecha aqui, depois do try/catch

// Cancela e volta para a lista
function cancelar() {
    window.location.href = "./tarefa.html"
}