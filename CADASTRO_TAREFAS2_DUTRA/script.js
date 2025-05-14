class Tarefa {
            constructor(titulo, descricao, responsavel, status = "Pendente",id = Number) {
                if (!titulo || !descricao || !responsavel) {
                    throw new Error("Preencha todos os campos obrigatórios.");
                }

                this.titulo = titulo;
                this.descricao = descricao;
                this.responsavel = responsavel;
                this.status = status;
                this.id = id;
            }

            proximoStatus() {
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

                fetch('http://localhost:3000/tarefas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novaTarefa)
                })
                .then(res => res.json())
                .then(tarefaSalva => {
                    tarefas.push(new Tarefa(
                        tarefaSalva.titulo,
                        tarefaSalva.descricao,
                        tarefaSalva.responsavel,
                        tarefaSalva.status,
                        tarefaSalva.id
                    ));
                    exibirTarefas();
                    e.target.reset();
                });
            } catch (error) {
                alert("Erro ao criar tarefa. " + error.message);
            }
        });

        function exibirTarefas() {
            const listaTarefas = document.querySelector("#lista-tarefas tbody");
            listaTarefas.innerHTML = "";

            tarefas.forEach((tarefa, index) => {
                const row = listaTarefas.insertRow();
                row.setAttribute("data-id", tarefa.id);

                row.insertCell(0).textContent = tarefa.titulo;
                row.insertCell(1).textContent = tarefa.descricao;
                row.insertCell(2).textContent = tarefa.responsavel;
                row.insertCell(3).textContent = tarefa.status;

                // Botão de mudar status
                const btnStatus = document.createElement("button");
                btnStatus.textContent = "Mudar Status";
                btnStatus.addEventListener("click", function () {
                    tarefa.proximoStatus();
                    fetch(`http://localhost:3000/tarefas/${tarefa.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: tarefa.status })
                    })
                    .then(() => exibirTarefas());
                });
                row.insertCell(4).appendChild(btnStatus);

                // Botão de remover
                const btnRemover = document.createElement("button");
                btnRemover.textContent = "Remover";
                btnRemover.classList.add("btn-remove");
                btnRemover.addEventListener("click", function () {
                    fetch(`http://localhost:3000/tarefas/${tarefa.id}`, {
                        method: 'DELETE'
                    })
                    .then(() => {
                        tarefas.splice(index, 1);
                        exibirTarefas();
                    });
                });
                row.insertCell(5).appendChild(btnRemover);
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

        function carregarTarefas() {
            fetch('http://localhost:3000/tarefas')
                .then(res => res.json())
                .then(data => {
                    tarefas.length = 0; // limpa array atual
                    data.forEach(t => {
                        tarefas.push(new Tarefa(t.titulo, t.descricao, t.responsavel, t.status, t.id));
                    });
                    exibirTarefas();
                });
        }

        document.addEventListener("DOMContentLoaded", carregarTarefas);