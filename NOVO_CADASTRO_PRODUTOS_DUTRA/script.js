class Produto {
    #preco;
    #quantidade;

    constructor(nome, preco, quantidade) {
        if (!nome || isNaN(preco) || isNaN(quantidade) || preco < 0 || quantidade < 0) {
            throw new Error("Dados inválidos para criar um produto.");
        }

        this.nome = nome;
        this.#preco = parseFloat(preco);
        this.#quantidade = parseInt(quantidade);
    }

    get preco() {
        return this.#preco;
    }

    get quantidade() {
        return this.#quantidade;
    }

    descricao() {
        return `Produto: ${this.nome}, Preço: R$${this.preco.toFixed(2)}, Quantidade: ${this.quantidade}`;
    }
}

let produtos = []; // Declarar o array produtos

document.getElementById("produto-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const preco = document.getElementById("preco").value;
    const quantidade = document.getElementById("quantidade").value;

    try {
        const novoProduto = new Produto(nome, preco, quantidade);

        // Enviar o produto para o servidor
        fetch('http://localhost:3000/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: novoProduto.nome,
                preco: novoProduto.preco,
                quantidade: novoProduto.quantidade
            })
        })
        .then(res => res.json())
        .then(produtoSalvo => {
            adicionarNaTabela(produtoSalvo);
            calcularTotal();
            e.target.reset();
        });
    } catch (erro) {
        alert("Erro ao criar produto: " + erro.message);
    }
});

function adicionarNaTabela(produto) {
    const lista = document.getElementById("lista-produtos").getElementsByTagName("tbody")[0];
    const row = lista.insertRow();

    // Adicionar o atributo data-id para identificar o produto
    row.setAttribute("data-id", produto.id);

    const cellNome = row.insertCell(0);
    const cellPreco = row.insertCell(1);
    const cellQuantidade = row.insertCell(2);
    const cellRemover = row.insertCell(3);

    cellNome.textContent = produto.nome;
    cellPreco.textContent = `R$${parseFloat(produto.preco).toFixed(2)}`;
    cellQuantidade.textContent = produto.quantidade;

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover";
    btnRemover.classList.add("btn-remover");
    btnRemover.addEventListener("click", function () {
        removerProduto(produto.id);
    });
    cellRemover.appendChild(btnRemover);
}

document.getElementById("limpar-tabela").addEventListener("click", function () {
    const listaProdutosTbody = document.getElementById("lista-produtos").getElementsByTagName("tbody")[0];

    while (listaProdutosTbody.firstChild) {
        listaProdutosTbody.removeChild(listaProdutosTbody.firstChild);
    }

    calcularTotal();
});

function calcularTotal() {
    const listaProdutosTbody = document.getElementById("lista-produtos").getElementsByTagName("tbody")[0];
    const rows = listaProdutosTbody.getElementsByTagName("tr");
    let valorTotal = 0;

    for (let row of rows) {
        const preco = parseFloat(row.cells[1].textContent.replace("R$", "").replace(",", "."));
        const quantidade = parseInt(row.cells[2].textContent);
        valorTotal += preco * quantidade;
    }

    document.getElementById("valor-total").textContent = `R$ ${valorTotal.toFixed(2)}`;
}

function carregarProdutos() {
    fetch('http://localhost:3000/produtos')
        .then(res => res.json())
        .then(data => {
            const listaProdutosTbody = document.getElementById("lista-produtos").getElementsByTagName("tbody")[0];
            listaProdutosTbody.innerHTML = ""; // Limpar a tabela antes de carregar os produtos

            produtos = data; // Atualizar o array produtos
            data.forEach(produto => {
                adicionarNaTabela(produto);
            });

            calcularTotal();
        });
}

document.addEventListener('DOMContentLoaded', carregarProdutos);

function removerProduto(id) {
    fetch(`http://localhost:3000/produtos/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        const tr = document.querySelector(`[data-id="${id}"]`);
        if (tr) {
            tr.remove();
        }
        calcularTotal();
    });
}