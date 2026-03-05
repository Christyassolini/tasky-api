// API base url (ajuste se necessário)
// const API_URL = "http://localhost:8080";
const API_URL = "http://135.232.112.135:8080";

// helpers de JWT
function saveToken(token) {
    localStorage.setItem("token", token);
}

function getToken() {
    return localStorage.getItem("token");
}

function getTarefaPath() {
    return window.location.pathname.includes('/view/') ? './tarefa.html' : './view/tarefa.html';
}

if (getToken()) {
    window.location.href = getTarefaPath();
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

const loginContainer = document.getElementById("login-container")
const cadastroContainer = document.getElementById("cadastro-container")
const emailLogin = document.getElementById("email-login")
const senhaLogin = document.getElementById("senha-login")
const nomeCadastro = document.getElementById("nome-cadastro")
const emailCadastro = document.getElementById("email-cadastro")
const senhaCadastro = document.getElementById("senha-cadastro")
const confirmarSenhaCadastro = document.getElementById("confirmar-senha-cadastro")

// Mudar para o cadastro
function mostrarCadastro() {
    loginContainer.classList.remove("active");
    cadastroContainer.classList.add("active");
}

// Mudar para o cadastro
function mostrarLogin() {
    cadastroContainer.classList.remove("active");
    loginContainer.classList.add("active");
}

// ===================== Validação do Login =====================
async function validarLogin() {
  const email = emailLogin.value.trim()
  const senha = senhaLogin.value
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Validações locais
  if (email === "" || senha === "") {
    toastWarning("Todos os campos devem ser preenchidos!")
    return false
  }

  if (!emailRegex.test(email)) {
    toastError('Digite um email válido')
    return false
  }

  // Chamada ao back‑end para autenticar
  try {
    const resposta = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, senha: senha })
    })

    if (resposta.ok) {
      // o token chega via header Authorization
      const authHeader = resposta.headers.get("Authorization")
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7)
        saveToken(token)
        // Armazenar o email também para uso posterior
        localStorage.setItem("userEmail", email)
      }
            window.location.href = getTarefaPath()
      return true
    } else {
      const erro = await resposta.text()
      toastError(`Falha no login: ${erro}`)
      return false
    }
  } catch (erro) {
    console.error("Erro na requisição de login:", erro)
    toastError("Não foi possível conectar ao servidor.")
    return false
  }
}                            

// ===================== Validação do Cadastro =====================
async function validarCadastro() {
    const nome = nomeCadastro.value.trim()
    const email = emailCadastro.value.trim()
    const senha = senhaCadastro.value
    const confirmarSenha = confirmarSenhaCadastro.value

    // Verificar se os campos foram preenchidos
    if (nome === "" || email === "" || senha === "" || confirmarSenha === "") {
        toastWarning("Todos os campos devem ser preenchidos!");
        return false;
    }

    //Validar nome e sobrenome
    if (nome.split(" ").length < 2) {
        toastError('Digite seu nome completo (Nome e sobrenome)!')
        return false;
    }

    // Verificar se o email está válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        toastError('Digite um email válido')
        return false;
    }

    // Verificando se senha tem mais de 6 digitos
    if (senha.length < 6) {
        toastError('A senha deve conter mais de 6 digitos!')
        return false;
    }

    // Verificando se senha tem letras e números
    const temLetras = /[a-zA-Z]/.test(senha)
    const temNumeros = /[0-9]/.test(senha)
    if (!temLetras || !temNumeros) {
        toastError('A senha deve conter letras e números!')
        return false;
    }

    // Verificando se confirmar senha é a mesma que a senha
    if (senha !== confirmarSenha) {
        toastError('As senhas não coincidem!')
        return false;
    }

    // Enviar para o back‑end
    try {
        const resposta = await fetch(`${API_URL}/user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome: nome, email: email, senha: senha })
        });

        if (resposta.status === 201) {
            toastSuccess('Cadastro efetuado com sucesso! Faça o login.')
            setTimeout(() => mostrarLogin(), 1500);
            return true;
        } else if (resposta.status === 409) {
            toastError('Este email já está em uso. Por favor, escolha outro.');
            return false;
        } else {
            const erro = await resposta.text();
            console.error('Erro no cadastro:', erro);
            toastError('Falha ao cadastrar: ' + erro);
            return false;
        }
    } catch (erro) {
        console.error('Erro na requisição de cadastro:', erro);
        toastError('Não foi possível conectar ao servidor.');
        return false;
    }
}