// API base url
// const API_URL = "http://localhost:8080";
const API_URL = "http://135.232.112.135:8080";

// Helpers de JWT
function getToken() {
    return localStorage.getItem("token");
}

/**
 * Retorna o payload do JWT (decodificado) ou null caso não exista token.
 */
function parseJWT(token) {
    if (!token) return null;
    try {
        const base64Payload = token.split('.')[1];
        return JSON.parse(atob(base64Payload));
    } catch (e) {
        return null;
    }
}

// Função para fazer logout
function logout() {
    localStorage.removeItem("token");
    window.location.href = "../index.html";
}

// Dados do usuário logado
let usuarioId = null;
let usuarioAtual = {};

// Carregar dados do usuário ao abrir a página
document.addEventListener("DOMContentLoaded", async function() {
    const token = getToken();
    console.log("Token obtido:", token);
    
    // Se não tiver token, redireciona para login
    if (!token) {
        console.log("Sem token, redirecionando para login");
        window.location.href = "../index.html";
        return;
    }

    // Extrai o email do JWT
    const payload = parseJWT(token);
    console.log("Payload do JWT:", payload);
    
    if (!payload) {
        console.log("Erro ao decodificar JWT");
        window.location.href = "../index.html";
        return;
    }
    
    // O 'sub' contém o email
    const email = payload.sub;
    console.log("Email extraído do JWT:", email);
    
    if (!email) {
        console.log("Email não encontrado no JWT");
        toastError("Erro: Email não encontrado no token");
        setTimeout(() => window.location.href = "../index.html", 1500);
        return;
    }

    // Buscar o ID do usuário no backend procurando pelo email
    await buscarUsuarioPorEmail(email);
});

/**
 * Busca o usuário pelo email e extrai seu ID
 */
async function buscarUsuarioPorEmail(email) {
    try {
        const token = getToken();
        console.log("Buscando usuário pelo email:", email);
        
        // Vamos tentar buscar na rota de busca por email ou tentar diferentes IDs
        // Primeiro, tente fazer uma requisição para obter informações do usuário logado
        const resposta = await fetch(`${API_URL}/user/email/${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (resposta.ok) {
            const usuario = await resposta.json();
            usuarioId = usuario.id;
            console.log("Usuario ID encontrado:", usuarioId);
            await carregarDadosUsuario();
        } else {
            console.log("Rota /user/email/{email} não encontrada, tentando alternativa...");
            // Se não houver rota de email, tente obter o ID consultando repositório
            await buscarIdPorOutraForm(email, token);
        }
    } catch (erro) {
        console.error("Erro ao buscar usuário por email:", erro);
    }
}

/**
 * Tenta buscar o ID por outra forma (usando a UserService)
 */
async function buscarIdPorOutraForm(email, token) {
    try {
        // Já que não há rota de email, vamos armazenar o email no localStorage
        // durante o login e usar isso aqui
        const emailArmazenado = localStorage.getItem("userEmail");
        console.log("Email armazenado:", emailArmazenado);
        
        if (emailArmazenado) {
            // Faremos uma chamada diferente
            const resposta = await fetch(`${API_URL}/login`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            
            if (resposta.ok) {
                const usuario = await resposta.json();
                usuarioId = usuario.id;
                console.log("Usuario ID encontrado pela alternativa:", usuarioId);
                await carregarDadosUsuario();
            }
        } else {
            toastError("Email não encontrado. Faça login novamente.");
            setTimeout(() => window.location.href = "../index.html", 1500);
        }
    } catch (erro) {
        console.error("Erro na busca alternativa:", erro);
        toastError("Erro ao carregar dados do usuário.");
    }
}

/**
 * Carrega os dados do usuário do backend e preenche os campos
 */
async function carregarDadosUsuario() {
    try {
        const token = getToken();
        console.log("Token:", token ? "Existe" : "Não existe");
        console.log("Usuario ID:", usuarioId);
        
        const url = `${API_URL}/user/${usuarioId}`;
        console.log("Fazendo requisição para:", url);
        
        const resposta = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Status da resposta:", resposta.status);
        console.log("OK:", resposta.ok);

        if (resposta.ok) {
            usuarioAtual = await resposta.json();
            console.log("Dados do usuário:", usuarioAtual);
            
            // Preencher os campos com os dados do usuário
            document.getElementById("nome").value = usuarioAtual.nome;
            document.getElementById("email").value = usuarioAtual.email;
            document.getElementById("senha").value = "";
            document.getElementById("confirmarSenha").value = "";
        } else if (resposta.status === 401) {
            toastError("Sua sessão expirou. Faça login novamente.");
            setTimeout(() => logout(), 1500);
        } else {
            const textoErro = await resposta.text();
            console.error("Erro na resposta:", resposta.status, textoErro);
            toastError("Erro ao carregar dados do usuário. Status: " + resposta.status);
        }
    } catch (erro) {
        console.error("Erro ao carregar dados do usuário:", erro);
        toastError("Não foi possível conectar ao servidor. Erro: " + erro.message);
    }
}

/**
 * Salvar alterações do perfil
 */
async function salvarTarefa() {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const novaSenha = document.getElementById("senha").value;
    const confirmarNovaSenha = document.getElementById("confirmarSenha").value;

    // Validações
    if (nome === "" || email === "") {
        toastWarning("Nome e email são obrigatórios!");
        return false;
    }

    // Validar nome completo
    if (nome.split(" ").length < 2) {
        toastError("Digite seu nome completo (Nome e sobrenome)!");
        return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        toastError("Digite um email válido!");
        return false;
    }

    // Se preencheu nova senha, valida
    if (novaSenha !== "" || confirmarNovaSenha !== "") {
        if (novaSenha !== confirmarNovaSenha) {
            toastError("A nova senha e a confirmação não coincidem!");
            return false;
        }

        if (novaSenha === "") {
            toastWarning("Por favor, preencha a nova senha!");
            return false;
        }

        if (novaSenha.length < 6) {
            toastError("A nova senha deve conter no mínimo 6 caracteres!");
            return false;
        }

        const temLetras = /[a-zA-Z]/.test(novaSenha);
        const temNumeros = /[0-9]/.test(novaSenha);
        if (!temLetras || !temNumeros) {
            toastError("A nova senha deve conter letras e números!");
            return false;
        }
    }

    // Preparar dados para envio
    const dadosAtualizacao = {
        nome: nome,
        email: email
    };

    // Apenas incluir senha se foi preenchida
    if (novaSenha !== "") {
        dadosAtualizacao.senha = novaSenha;
    }

    try {
        const token = getToken();
        console.log("Dados sendo enviados:", dadosAtualizacao);
        console.log("URL:", `${API_URL}/user/${usuarioId}`);
        console.log("Token existe:", !!token);
        
        const resposta = await fetch(`${API_URL}/user/${usuarioId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(dadosAtualizacao)
        });

        console.log("Status da resposta:", resposta.status);
        console.log("OK:", resposta.ok);

        if (resposta.ok) {
            toastSuccess("Perfil atualizado com sucesso!");
            // Limpar campos de senha
            document.getElementById("senha").value = "";
            document.getElementById("confirmarSenha").value = "";
            // Recarregar dados
            await carregarDadosUsuario();
            return true;
        } else if (resposta.status === 401) {
            toastError("Sua sessão expirou. Faça login novamente.");
            setTimeout(() => logout(), 1500);
        } else if (resposta.status === 409) {
            toastError("Este email já está em uso. Por favor, escolha outro.");
        } else if (resposta.status === 400) {
            const erro = await resposta.text();
            console.error("Erro 400 do servidor:", erro);
            toastError("Erro ao atualizar perfil: " + erro);
        } else {
            const erro = await resposta.text();
            console.error("Erro do servidor:", resposta.status, erro);
            toastError("Erro ao atualizar perfil. Status: " + resposta.status);
        }
        return false;
    } catch (erro) {
        console.error("Erro na requisição de atualização:", erro);
        toastError("Não foi possível conectar ao servidor.");
        return false;
    }
}

/**
 * Cancelar edição
 */
function cancelar() {
    // Limpar campos de senha
    document.getElementById("senha").value = "";
    document.getElementById("confirmarSenha").value = "";
    
    // Recarregar dados
    carregarDadosUsuario();
}
