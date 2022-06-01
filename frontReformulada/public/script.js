class Requisicoes {
    async buscarTodosOsJogos() {
      const resposta = await fetch(`${baseUrl}/jogos`);
  
      const jogos = await resposta.json();
  
      listaDeJogos = jogos;
  
      return jogos;
    }
  
    async buscarJogoPorId(id) {
      const resposta = await fetch(`${baseUrl}/jogos/${id}`);
  
      if (resposta.status === 404) {
        return false;
      }
  
      const jogo = await resposta.json();
  
      return jogo;
    }
  
    async criarJogo(nome, descricao, foto, preco) {
      const jogo = {
        nome,
        descricao,
        foto,
        preco,
      };
  
      const resposta = await fetch(`${baseUrl}/jogos/criar-jogo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(jogo),
      });
  
      const novoJogo = await resposta.json();
  
      return novoJogo;
    }
  
    async atualizarJogo(id, nome, descricao, foto, preco) {
      const jogo = {
        nome,
        descricao,
        foto,
        preco,
      };
  
      const resposta = await fetch(`${baseUrl}/jogos/atualizar-jogo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(jogo),
      });
  
      const jogoAtualizado = await resposta.json();
  
      return jogoAtualizado;
    }
  
    async excluirJogo(id) {
      const resposta = await fetch(`${baseUrl}/jogos/excluir-jogo/${id}`, {
        method: "DELETE",
        mode: "cors",
      });
  
      if (resposta.status === 200) {
        return true;
      } else {
        return false;
      }
    }
  }
  
 
  
  const requisicoes = new Requisicoes();
  const baseUrl = "http://localhost:3000";
  let listaDeJogos = [];
  

  
  const imprimirTodosOsJogos = async () => {
    const jogos = await requisicoes.buscarTodosOsJogos();
  
    document.getElementById("JogoList").innerHTML = ``;
  
    jogos.forEach((elemento) => {
      document.getElementById("JogoList").insertAdjacentHTML(
        "beforeend",
        `
        <div class="CartaoJogo">
          <div class="CartaoJogo__infos">
            <h4>${elemento.nome}</h4>
            <span>R$${elemento.preco.toFixed(2)}</span>
            <p>${elemento.descricao}</p>
            <div>
              <button onclick="mostrarModalExclusao('${
                elemento._id
              }')" class="botao-excluir-jogo">APAGAR</button>
              <button onclick="mostrarModalEdicao('${
                elemento._id
              }')" class="botao-editar-jogo">EDITAR</button>
            </div>
          </div>
          <img src="./${elemento.foto}" alt="Jogo de Nome ${
          elemento.nome
        }" class="CartaoJogo__foto"/>
        </div>
        `
      );
    });
  };
  
  imprimirTodosOsJogos();
  
  const imprimirUmJogoPorId = async () => {
    document.getElementById("JogoPesquisado").innerHTML = "";
  
    const input = document.getElementById("inputBuscaNomeJogo");
    const nome = input.value;
  
    const JogoSelecionado = listaDeJogos.find((elem) => elem.nome === nome);
  
    if (JogoSelecionado === undefined) {
      const mensagemDeErro = document.createElement("p");
      mensagemDeErro.id = "mensagemDeErro";
      mensagemDeErro.classList.add("MensagemDeErro");
      mensagemDeErro.innerText = "Nenhum jogo encontrado";
  
      document.getElementById("JogoPesquisado").appendChild(mensagemDeErro);
    }
  
    const id = JogoSelecionado._id;
  
    const jogo = await requisicoes.buscarJogoPorId(id);
  
    if (jogo === false) {
      const mensagemDeErro = document.createElement("p");
      mensagemDeErro.id = "mensagemDeErro";
      mensagemDeErro.classList.add("MensagemDeErro");
      mensagemDeErro.innerText = "Nenhum jogo encontrado";
  
      document.getElementById("JogoPesquisado").appendChild(mensagemDeErro);
    } else {
      document.getElementById("JogoPesquisado").innerHTML = `
        <div class="CartaoJogo">
          <div class="CartaoJogo__infos">
            <h4>${jogo.nome}</h4>
            <span>R$${jogo.preco.toFixed(2)}</span>
            <p>${jogo.descricao}</p>
            <div>
              <button onclick="mostrarModalExclusao('${
                jogo._id
              }')" class="botao-excluir-jogo">APAGAR</button>
              <button onclick="mostrarModalEdicao('${
                jogo._id
              }')" class="botao-editar-jogo">EDITAR</button>
            </div>
          </div>
          <img src="./${jogo.foto}" alt="jogo nome ${
        jogo.nome
      }" class="Cartaojogo__foto"/>
        </div>
      `;
    }
  };
  
  const mostrarModalCriacao = () => {
    document.getElementById("fundoModalCriacao").style.display = "flex";
  };
  
  const mostrarModalExclusao = (id) => {
    document.getElementById("fundoModalExclusao").style.display = "flex";
  
    const botaoConfirmar = document.getElementById("botaoConfirmarExclusao");
  
    botaoConfirmar.addEventListener("click", async () => {
      const exclusao = await requisicoes.excluirJogo(id);
  
      if (exclusao) {
        mostrarNotificacao("sucesso", "Jogo excluído com sucesso");
      } else {
        mostrarNotificacao("erro", "jogo não encontrado");
      }
      esconderModalExclusao();
      imprimirTodosOsJogos();
    });
  };
  
  const mostrarModalEdicao = (id) => {
    document.getElementById("fundoModalEdicao").style.display = "flex";
  
    const jogo = listaDeJogos.find((elemento) => elemento._id === id);
  
    document.getElementById("inputJogoEdicao").value = jogo.nome;
    document.getElementById("inputPrecoEdicao").value = jogo.preco;
    document.getElementById("inputDescricaoEdicao").value = jogo.descricao;
    document.getElementById("inputFotoEdicao").value = jogo.foto;
  
    const botaoAtualizar = document.getElementById("botaoConfirmarEdicao");
  
    botaoAtualizar.addEventListener("click", async () => {
      const nome = document.getElementById("inputJogoEdicao").value;
      const preco = document.getElementById("inputPrecoEdicao").value;
      const descricao = document.getElementById("inputDescricaoEdicao").value;
      const foto = document.getElementById("inputFotoEdicao").value;
  
      await requisicoes.atualizarJogo(id, nome, descricao, foto, preco);
  
      esconderModalEdicao();
      imprimirTodosOsJogos();
    });
  };
  
  const mostrarNotificacao = (tipo, frase) => {
    const notificacaoSpan = document.getElementById("notificacaoSpan");
    const norificacaoA = document.getElementById("norificacaoA");
  
    if (tipo === "sucesso") {
      notificacaoSpan.innerText = "V";
      notificacaoSpan.classList.add("notificacao-span-sucesso");
    } else if (tipo === "erro") {
      notificacaoSpan.innerText = "X";
      notificacaoSpan.classList.add("notificacao-span-erro");
    }
  
    norificacaoA.innerText = frase;
  
    document.getElementById("notificacao").style.display = "flex";
  
    setTimeout(() => {
      esconderNotificacao();
    }, 5000);
  };
  
  const esconderModalCriacao = () => {
    document.getElementById("inputNome").value = " ";
    document.getElementById("inputPreco").value = "";
    document.getElementById("inputDescricao").value = "";
    document.getElementById("inputFoto").value = "";
  
    document.getElementById("fundoModalCriacao").style.display = "none";
  };
  
  const esconderModalExclusao = () => {
    document.getElementById("fundoModalExclusao").style.display = "none";
  };
  
  const esconderModalEdicao = () => {
    document.getElementById("fundoModalEdicao").style.display = "none";
  };
  
  const esconderNotificacao = () => {
    document.getElementById("notificacao").style.display = "none";
  };
  
  const cadastrarNovoJogo = async () => {
    const nome = document.getElementById("inputJogo").value;
    const preco = document.getElementById("inputPreco").value;
    const descricao = document.getElementById("inputDescricao").value;
    const foto = document.getElementById("inputFoto").value;
  
    const jogo = await requisicoes.criarJogo(nome, descricao, foto, preco);
  
    document.getElementById("JogoList").insertAdjacentHTML(
      "beforeend",
      `
      <div class="CartaoJogo">
        <div class="CartaoJogo__infos">
          <h4>${jogo.nome}</h4>
          <span>R$${jogo.preco.toFixed(2)}</span>
          <p>${jogo.descricao}</p>
          <div>
            <button onclick="mostrarModalExclusao('${
              jogo._id
            }')" class="botao-excluir-jogo">APAGAR</button>
            <button onclick="mostrarModalEdicao('${
              jogo._id
            }')" class="botao-editar-jogo">EDITAR</button>
          </div>
        </div>
        <img src="./${jogo.foto}" alt="Jogo nome ${
        jogo.nome
      }" class="CartaoJogo__foto"/>
      </div>
    `
    );
    mostrarNotificacao("sucesso", "Jogo criada com sucesso");
  
    esconderModalCriacao();
  };