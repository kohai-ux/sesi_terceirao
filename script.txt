class Tarefa {
    #status;
  
    constructor(titulo, descricao, responsavel) {
      if (!titulo || !descricao || !responsavel) {
        throw new Error("Todos os campos são obrigatórios.");
      }
      this.titulo = titulo;
      this.descricao = descricao;
      this.responsavel = responsavel;
      this.#status = "Pendente";
    }
  
    get status() {
      return this.#status;
    }
  
    alterarStatus() {
      const estados = ["Pendente", "Em Andamento", "Concluída"];
      const idx = estados.indexOf(this.#status);
      this.#status = estados[(idx + 1) % estados.length];
    }
  }
  
  const tarefas = [];
  
  document.getElementById("tarefa-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const responsavel = document.getElementById("responsavel").value;
  
    try {
      const novaTarefa = new Tarefa(titulo, descricao, responsavel);
      tarefas.push(novaTarefa);
      atualizarTabela();
      e.target.reset();
    } catch (erro) {
      alert(erro.message);
    }
  });
  
  function atualizarTabela() {
    const tbody = document.querySelector("#tabela-tarefas tbody");
    tbody.innerHTML = "";
  
    tarefas.forEach((tarefa, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${tarefa.titulo}</td>
        <td>${tarefa.responsavel}</td>
        <td>${tarefa.status}</td>
        <td>
          <button onclick="alterarStatus(${index})">Alterar Status</button>
          <button onclick="removerTarefa(${index})">Remover</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  
    atualizarResumo();
  }
  
  function alterarStatus(index) {
    tarefas[index].alterarStatus();
    atualizarTabela();
  }
  
  function removerTarefa(index) {
    tarefas.splice(index, 1);
    atualizarTabela();
  }
  
  function atualizarResumo() {
    const contagem = { "Pendente": 0, "Em Andamento": 0, "Concluída": 0 };
    tarefas.forEach(t => contagem[t.status]++);
    document.getElementById("resumo-status").textContent = 
      `Pendente: ${contagem["Pendente"]} | Em Andamento: ${contagem["Em Andamento"]} | Concluída: ${contagem["Concluída"]}`;
  }
  