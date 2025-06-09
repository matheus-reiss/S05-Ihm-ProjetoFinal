document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("lista-ingressos");
  const telaLista = document.getElementById("tela-ingressos");
  const telaDetalhe = document.getElementById("tela-ingresso-detalhe");

  const ingressos = JSON.parse(localStorage.getItem("ingressos")) || [];

  // Se houver ingressos salvos, exibe os cards
  if (ingressos.length > 0) {
    ingressos.forEach((dados) => {
      const card = document.createElement("div");
      card.className = "ingresso-card";

      card.innerHTML = `
      <div class="event-card">
        <img src="${dados.imagem}" alt="${dados.nome}">
        <h2>${dados.nome}</h2>
        <p>🗓️ ${dados.data}</p>
        <button class="botao-azul">Exibir Inscrição</button>
      </div>
    `;

      card.querySelector("button").addEventListener("click", () => {
        exibirIngresso(dados);
      });

      lista.appendChild(card);
    });
  } else {
    lista.innerHTML = `<p style="color:#888;">Nenhum ingresso encontrado.</p>`;
  }

  // Botão voltar para a tela de lista de ingressos
  document.getElementById("voltar-btn").addEventListener("click", () => {
    telaDetalhe.style.display = "none";
    telaLista.style.display = "block";
  });
});

// Exibe os dados detalhados de um ingresso e gera o QR Code
function exibirIngresso(dados) {
  document.getElementById("tela-ingressos").style.display = "none";
  document.getElementById("tela-ingresso-detalhe").style.display = "block";

  document.getElementById("ingresso-nome-evento").textContent = dados.nome;
  document.getElementById("ingresso-data").textContent = dados.data;
  document.getElementById("ingresso-local").textContent = dados.local;
  document.getElementById("ingresso-preco").textContent = dados.preco;

  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = ""; // limpa QR antigo

  // Gera ID curto para o ingresso
  const ticketId = gerarIdCurto();

  // Remove acentos e limita a 3 palavras do nome do evento
  const nomeLimpo = dados.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ").slice(0, 3).join(" ");

  // Texto que será codificado no QR Code
  let textoQR = `ID:${ticketId} EV:${nomeLimpo} DT:${dados.data}`;

  console.log("Texto QR:", textoQR);
  console.log("Tamanho:", textoQR.length);

  // Se o texto for muito longo ou tiver caracteres Unicode, usar apenas o ID
  if (textoQR.length > 100 || containsUnicode(textoQR)) {
    textoQR = `ID:${ticketId}`;
  }

  gerarQR(qrContainer, textoQR);
}

// Gera o QR Code na tela com o texto fornecido
function gerarQR(container, texto) {
  try {

    // Aguarda  para garantir a renderização do container
    setTimeout(() => {
      new QRCode(container, {
        text: texto,
        width: 150,
        height: 150,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.L  // Menor nível de correção de erro (permite mais dados)
      });
      console.log("QR Code gerado com sucesso!");
    }, 100);

  } catch (error) {
    console.error("Erro ao gerar QR:", error);
    container.innerHTML = `
      <p style="color:red">Erro ao gerar QR Code</p>
      <button onclick="tentarNovamente('${texto}')">Tentar Novamente</button>
    `;
  }
}

// Gera um ID curto único (6 dígitos do timestamp + 4 caracteres aleatórios)
function gerarIdCurto() {
  const timestamp = Date.now().toString().slice(-6); // últimos 6 dígitos
  const random = Math.random().toString(36).substr(2, 4); // 4 caracteres
  return `${timestamp}${random}`.toUpperCase();
}

// Gera novamente o QR Code com um novo ID caso falhe
function tentarNovamente(texto) {
  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = "";

  // Tenta com texto ainda mais simples
  const textoSimples = gerarIdCurto();
  gerarQR(qrContainer, textoSimples);
}

// Verifica se a string possui caracteres Unicode fora do padrão ASCII
function containsUnicode(str) {
  return /[^\u0000-\u007F]/.test(str);
}