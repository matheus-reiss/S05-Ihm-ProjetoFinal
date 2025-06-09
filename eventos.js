function mostrarInscricao(nome, data, local, descricao, preco) {
    // Esconde a tela de eventos
    document.getElementById('tela-eventos').style.display = 'none';

    // Mostra a tela de inscrição
    document.getElementById('tela-inscricao').style.display = 'block';

    // Preenche os dados
    document.getElementById('inscricao-nome').textContent = nome;
    document.getElementById('inscricao-data').textContent = data;
    document.getElementById('inscricao-local').textContent = local;
    document.getElementById('inscricao-descricao').textContent = descricao;
    document.getElementById('inscricao-preco').textContent = preco;
}

function voltarParaEventos() {
    document.getElementById('tela-inscricao').style.display = 'none';
    document.getElementById('tela-eventos').style.display = 'block';
}

function confirmarInscricao() {
    const nome = document.getElementById('inscricao-nome').textContent;
    const data = document.getElementById('inscricao-data').textContent;
    const local = document.getElementById('inscricao-local').textContent;
    const preco = document.getElementById('inscricao-preco').textContent;

    //passa as imagens do evento para tela de ingresso
    let imagem = "";
    if (nome === "Fundamentos de Design Thinking") {
        imagem = "img/Evento1.jpeg";
    } else if (nome === "Workshop de Comunicação") {
        imagem = "img/Evento2.jpeg";
    }

    const ingressos = JSON.parse(localStorage.getItem("ingressos")) || [];

    // Verifica se o evento já existe
    const jaInscrito = ingressos.some((evento) => evento.nome === nome && evento.data === data);

    if (jaInscrito) {
        alert("Você já está inscrito neste evento!");
        voltarParaEventos();
        return;
    }


    ingressos.push({ nome, data, local, preco,imagem });
    localStorage.setItem("ingressos", JSON.stringify(ingressos));

    alert("Inscrição confirmada com sucesso!");
    voltarParaEventos();
}