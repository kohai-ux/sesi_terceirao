class Tarefa {
    constructor(titulo, descricao, responsavel) {
        if (!titulo || !descricao || !responsavel) {
            throw new Error("Preencha todos os campos obrigatórios.");
        }

        this.titulo = titulo;
        this.descricao = descricao;
        this.responsavel = responsavel;
        this.status = "Pendente"; // Default status
    }

    atualizarStatus() {
        const statusOrder = ["Pendente", "Em progresso", "Concluída"];
        const currentIndex = statusOrder.indexOf(this.status);
        if (currentIndex < statusOrder.length - 1) {
            this.status = statusOrder[currentIndex + 1];
        }
    }
}

const tarefas = [];

document.getElementById("task-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const responsavel = document.getElementById("responsavel").value;

    try {
        const novaTarefa = new Tarefa(titulo, descricao, responsavel);
        tarefas.push(novaTarefa);
        exibirTarefas();
        e.target.reset();
    } catch (error) {
        alert("Erro ao criar tarefa. " + error.message);
    }
});

function exibirTarefas() {
    const listaTarefas = document.querySelector("#lista-tarefas tbody");
    listaTarefas.innerHTML = "";

    tarefas.forEach((tarefa, index) => {
        const row = listaTarefas.insertRow();
        row.insertCell(0).textContent = tarefa.titulo;
        row.insertCell(1).textContent = tarefa.descricao;
        row.insertCell(2).textContent = tarefa.responsavel;
        row.insertCell(3).textContent = tarefa.status;

        const statusButton = document.createElement("button");
        statusButton.textContent = "Mudar Status";
        statusButton.addEventListener("click", function () {
            tarefa.atualizarStatus();
            exibirTarefas();
        });
        row.insertCell(4).appendChild(statusButton);

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remover";
        removeButton.classList.add("btn-remove");
        removeButton.addEventListener("click", function () {
            tarefas.splice(index, 1);
            exibirTarefas();
        });
        row.insertCell(5).appendChild(removeButton);
    });

    atualizarContagemTarefas();
}

function atualizarContagemTarefas() {
    const contagem = {
        Pendente: 0,
        "Em progresso": 0,
        Concluída: 0,
    };

    tarefas.forEach(tarefa => {
        contagem[tarefa.status]++;
    });

    document.getElementById("total-tarefas").textContent = tarefas.length;
    document.getElementById("tarefas-pendentes").textContent = contagem.Pendente;
    document.getElementById("tarefas-em-progresso").textContent = contagem["Em progresso"];
    document.getElementById("tarefas-concluidas").textContent = contagem.Concluída;
}