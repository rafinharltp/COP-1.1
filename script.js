// ===== DADOS GLOBAIS =====
let receitas = []
let despesasFixas = []
let despesasVariaveis = []

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", () => {
  inicializarAno()
  inicializarTabs()
  inicializarAnimacoes()
  carregarDados()
  atualizarResumo()
})

// ===== CONFIGURAÇÃO DO ANO =====
function inicializarAno() {
  const yearSelect = document.getElementById("year")
  if (yearSelect) {
    const currentYear = new Date().getFullYear()
    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
      const option = document.createElement("option")
      option.value = year
      option.textContent = year
      if (year === currentYear) {
        option.selected = true
      }
      yearSelect.appendChild(option)
    }
  }
}

// ===== SISTEMA DE ABAS =====
function inicializarTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab")

      // Remove active class de todos os botões e conteúdos
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Adiciona active class ao botão clicado e conteúdo correspondente
      this.classList.add("active")
      const targetContent = document.getElementById(targetTab)
      if (targetContent) {
        targetContent.classList.add("active")
        // Adiciona animação ao mostrar o conteúdo
        targetContent.style.animation = "none"
        setTimeout(() => {
          targetContent.style.animation = "fadeInUp 0.5s ease-out"
        }, 10)
      }
    })
  })
}

// ===== ANIMAÇÕES DE SCROLL =====
function inicializarAnimacoes() {
  // Intersection Observer para animações no scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "fadeInUp 0.8s ease-out forwards"
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Observa elementos para animação
  const elementsToAnimate = document.querySelectorAll(".Funcionalidades > div, .container, .tab-content")
  elementsToAnimate.forEach((el) => {
    observer.observe(el)
  })
}

// ===== FUNÇÕES DE RECEITAS =====
function adicionarReceita() {
  const descricao = document.getElementById("descricao-receita")
  const valor = document.getElementById("valor-receita")

  if (validarEntrada(descricao.value, valor.value)) {
    const receita = {
      id: Date.now(),
      descricao: descricao.value,
      valor: Number.parseFloat(valor.value),
    }

    receitas.push(receita)
    atualizarListaReceitas()
    atualizarResumo()
    salvarDados()

    // Limpar campos com animação
    limparCamposComAnimacao(descricao, valor)

    // Feedback visual
    mostrarFeedback("Receita adicionada com sucesso!", "success")
  }
}

function removerReceita(id) {
  receitas = receitas.filter((receita) => receita.id !== id)
  atualizarListaReceitas()
  atualizarResumo()
  salvarDados()
  mostrarFeedback("Receita removida!", "info")
}

function atualizarListaReceitas() {
  const lista = document.getElementById("lista-receitas")
  if (!lista) return

  lista.innerHTML = ""
  receitas.forEach((receita) => {
    const li = criarItemLista(receita, "removerReceita")
    lista.appendChild(li)
  })
}

// ===== FUNÇÕES DE DESPESAS FIXAS =====
function adicionarFixa() {
  const descricao = document.getElementById("descricao-fixa")
  const valor = document.getElementById("valor-fixa")

  if (validarEntrada(descricao.value, valor.value)) {
    const despesa = {
      id: Date.now(),
      descricao: descricao.value,
      valor: Number.parseFloat(valor.value),
    }

    despesasFixas.push(despesa)
    atualizarListaFixas()
    atualizarResumo()
    salvarDados()

    limparCamposComAnimacao(descricao, valor)
    mostrarFeedback("Despesa fixa adicionada!", "success")
  }
}

function removerFixa(id) {
  despesasFixas = despesasFixas.filter((despesa) => despesa.id !== id)
  atualizarListaFixas()
  atualizarResumo()
  salvarDados()
  mostrarFeedback("Despesa fixa removida!", "info")
}

function atualizarListaFixas() {
  const lista = document.getElementById("lista-fixas")
  if (!lista) return

  lista.innerHTML = ""
  despesasFixas.forEach((despesa) => {
    const li = criarItemLista(despesa, "removerFixa")
    lista.appendChild(li)
  })
}

// ===== FUNÇÕES DE DESPESAS VARIÁVEIS =====
function adicionarVariavel() {
  const descricao = document.getElementById("descricao-variavel")
  const valor = document.getElementById("valor-variavel")

  if (validarEntrada(descricao.value, valor.value)) {
    const despesa = {
      id: Date.now(),
      descricao: descricao.value,
      valor: Number.parseFloat(valor.value),
    }

    despesasVariaveis.push(despesa)
    atualizarListaVariaveis()
    atualizarResumo()
    salvarDados()

    limparCamposComAnimacao(descricao, valor)
    mostrarFeedback("Despesa variável adicionada!", "success")
  }
}

function removerVariavel(id) {
  despesasVariaveis = despesasVariaveis.filter((despesa) => despesa.id !== id)
  atualizarListaVariaveis()
  atualizarResumo()
  salvarDados()
  mostrarFeedback("Despesa variável removida!", "info")
}

function atualizarListaVariaveis() {
  const lista = document.getElementById("lista-variaveis")
  if (!lista) return

  lista.innerHTML = ""
  despesasVariaveis.forEach((despesa) => {
    const li = criarItemLista(despesa, "removerVariavel")
    lista.appendChild(li)
  })
}

// ===== FUNÇÕES UTILITÁRIAS =====
function criarItemLista(item, funcaoRemover) {
  const li = document.createElement("li")
  li.innerHTML = `
        <span>${item.descricao}: R$ ${item.valor.toFixed(2)}</span>
        <button onclick="${funcaoRemover}(${item.id})" class="btn-remover">Remover</button>
    `
  li.style.animation = "slideInLeft 0.3s ease-out"
  return li
}

function validarEntrada(descricao, valor) {
  if (!descricao.trim()) {
    mostrarFeedback("Por favor, insira uma descrição!", "error")
    return false
  }

  if (!valor || isNaN(valor) || Number.parseFloat(valor) <= 0) {
    mostrarFeedback("Por favor, insira um valor válido!", "error")
    return false
  }

  return true
}

function limparCamposComAnimacao(descricao, valor) {
  // Animação de limpeza
  descricao.style.transform = "scale(0.95)"
  valor.style.transform = "scale(0.95)"

  setTimeout(() => {
    descricao.value = ""
    valor.value = ""
    descricao.style.transform = "scale(1)"
    valor.style.transform = "scale(1)"
    descricao.focus()
  }, 150)
}

// ===== CÁLCULOS E RESUMO =====
function calcularTotal(array) {
  return array.reduce((total, item) => total + item.valor, 0)
}

function atualizarResumo() {
  const totalReceitas = calcularTotal(receitas)
  const totalFixas = calcularTotal(despesasFixas)
  const totalVariaveis = calcularTotal(despesasVariaveis)
  const saldo = totalReceitas - totalFixas - totalVariaveis

  // Atualizar elementos do DOM com animação
  atualizarElementoComAnimacao("total-receitas", totalReceitas.toFixed(2))
  atualizarElementoComAnimacao("total-fixas", totalFixas.toFixed(2))
  atualizarElementoComAnimacao("total-variaveis", totalVariaveis.toFixed(2))
  atualizarElementoComAnimacao("saldo", saldo.toFixed(2))

  // Mudar cor do saldo baseado no valor
  const saldoElement = document.getElementById("saldo")
  if (saldoElement) {
    const saldoContainer = saldoElement.parentElement
    if (saldo >= 0) {
      saldoContainer.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    } else {
      saldoContainer.style.background = "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
    }
  }
}

function atualizarElementoComAnimacao(id, valor) {
  const elemento = document.getElementById(id)
  if (elemento) {
    elemento.style.transform = "scale(1.1)"
    elemento.style.transition = "transform 0.2s ease"

    setTimeout(() => {
      elemento.textContent = valor
      elemento.style.transform = "scale(1)"
    }, 100)
  }
}

// ===== SISTEMA DE FEEDBACK =====
function mostrarFeedback(mensagem, tipo = "info") {
  // Remove feedback anterior se existir
  const feedbackAnterior = document.querySelector(".feedback-message")
  if (feedbackAnterior) {
    feedbackAnterior.remove()
  }

  const feedback = document.createElement("div")
  feedback.className = `feedback-message feedback-${tipo}`
  feedback.textContent = mensagem

  // Estilos do feedback
  Object.assign(feedback.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "1rem 2rem",
    borderRadius: "10px",
    color: "white",
    fontWeight: "600",
    zIndex: "1000",
    animation: "slideInLeft 0.3s ease-out",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
  })

  // Cores baseadas no tipo
  const cores = {
    success: "#10b981",
    error: "#ef4444",
    info: "#3b82f6",
  }

  feedback.style.background = cores[tipo] || cores.info

  document.body.appendChild(feedback)

  // Remove após 3 segundos
  setTimeout(() => {
    feedback.style.animation = "fadeOut 0.3s ease-out"
    setTimeout(() => feedback.remove(), 300)
  }, 3000)
}

// ===== PERSISTÊNCIA DE DADOS =====
function salvarDados() {
  const dados = {
    receitas,
    despesasFixas,
    despesasVariaveis,
    timestamp: Date.now(),
  }

  try {
    localStorage.setItem("calculadoraOrcamento", JSON.stringify(dados))
  } catch (error) {
    console.error("Erro ao salvar dados:", error)
    mostrarFeedback("Erro ao salvar dados!", "error")
  }
}

function carregarDados() {
  try {
    const dados = localStorage.getItem("calculadoraOrcamento")
    if (dados) {
      const dadosParsed = JSON.parse(dados)
      receitas = dadosParsed.receitas || []
      despesasFixas = dadosParsed.despesasFixas || []
      despesasVariaveis = dadosParsed.despesasVariaveis || []

      // Atualizar todas as listas
      atualizarListaReceitas()
      atualizarListaFixas()
      atualizarListaVariaveis()
      atualizarResumo()

      mostrarFeedback("Dados carregados com sucesso!", "success")
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error)
    mostrarFeedback("Erro ao carregar dados salvos!", "error")
  }
}

// ===== FUNCIONALIDADES EXTRAS =====
function exportarDados() {
  const dados = {
    receitas,
    despesasFixas,
    despesasVariaveis,
    resumo: {
      totalReceitas: calcularTotal(receitas),
      totalFixas: calcularTotal(despesasFixas),
      totalVariaveis: calcularTotal(despesasVariaveis),
      saldo: calcularTotal(receitas) - calcularTotal(despesasFixas) - calcularTotal(despesasVariaveis),
    },
    dataExportacao: new Date().toLocaleString("pt-BR"),
  }

  const dataStr = JSON.stringify(dados, null, 2)
  const dataBlob = new Blob([dataStr], { type: "application/json" })

  const link = document.createElement("a")
  link.href = URL.createObjectURL(dataBlob)
  link.download = `orcamento_${new Date().toISOString().split("T")[0]}.json`
  link.click()

  mostrarFeedback("Dados exportados com sucesso!", "success")
}

function limparTodosDados() {
  if (confirm("Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.")) {
    receitas = []
    despesasFixas = []
    despesasVariaveis = []

    atualizarListaReceitas()
    atualizarListaFixas()
    atualizarListaVariaveis()
    atualizarResumo()
    salvarDados()

    mostrarFeedback("Todos os dados foram limpos!", "info")
  }
}

// ===== ANIMAÇÃO DE FADE OUT PARA FEEDBACK =====
const style = document.createElement("style")
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
`
document.head.appendChild(style)

// ===== EVENTOS DE TECLADO =====
document.addEventListener("keydown", (e) => {
  // Enter para adicionar itens
  if (e.key === "Enter") {
    const activeTab = document.querySelector(".tab-content.active")
    if (activeTab) {
      const button = activeTab.querySelector("button")
      if (button) {
        button.click()
      }
    }
  }

  // Ctrl+S para salvar (previne comportamento padrão)
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault()
    salvarDados()
    mostrarFeedback("Dados salvos!", "success")
  }
})

// ===== RESPONSIVIDADE AVANÇADA =====
function ajustarLayoutResponsivo() {
  const isMobile = window.innerWidth <= 768
  const container = document.querySelector(".container")

  if (container && isMobile) {
    container.style.margin = "1rem"
    container.style.padding = "2rem 1rem"
  }
}

window.addEventListener("resize", ajustarLayoutResponsivo)
ajustarLayoutResponsivo() // Executar na inicialização
