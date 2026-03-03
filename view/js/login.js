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
function validarLogin() {
  const email = emailLogin.value.trim()
  const senha = senhaLogin.value
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  let isValid = true

  // Verificar se os campos foram preenchidos
  if (email === "" || senha === "") {
    alert("Todos os campos devem ser preenchidos!")
    isValid = false
    return isValid
  }

  if (!emailRegex.test(email)) {
    window.alert('Digite um email válido')
    isValid = false
    return isValid
  }

  window.alert('Login efetuado com sucesso! ✓')
  window.location.href = "./tarefa.html"
  return true
}

// ===================== Validação do Cadastro =====================
function validarCadastro() {
    const nome = nomeCadastro.value.trim()
    const email = emailCadastro.value.trim()
    const senha = senhaCadastro.value
    const confirmarSenha = confirmarSenhaCadastro.value

    let isValid = true;
  
  // Verificar se os campos foram preenchidos
  if (nome === "" || email === "" || senha === "" || confirmarSenha === "") {
    alert("Todos os campos devem ser preenchidos!");
    isValid = false;
    return isValid;
  }

  //Validar nome e sobrenome
  if (nome.split(" ").length < 2) {
    window.alert('Digite seu nome completo (Nome e sobrenome)!')
    isValid = false
    return isValid
  }

  // Verificar se o email está válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    window.alert('Digite um email válido')
    isValid = false
    return isValid
  }

  // Verificando se senha tem mais de 6 digitos
  if (senha.length < 6) {
    window.alert('A senha deve conter mais de 6 digitos!')
    isValid = false
    return isValid
  }

  // Verificando se senha tem letras e números
  const temLetras = /[a-zA-Z]/.test(senha)
  const temNumeros = /[0-9]/.test(senha)
  if (!temLetras || !temNumeros) {
    window.alert('A senha deve conter letras e números!')
    isValid = false
    return isValid
  }

  // Verificando se confirmar senha é a mesma que a senha
  if (senha !== confirmarSenha) {
    window.alert('As senhas não coincidem!')
    isValid = false
    return isValid
  }

// Se tudo foi validado
window.alert('Cadastro efetuado com sucesso! ✓')
window.location.href = "./tarefa.html"
return true
}