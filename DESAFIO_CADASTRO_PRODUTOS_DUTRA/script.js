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

document.getElementById("produto-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const preco = document.getElementById("preco").value;
    const quantidade = document.getElementById("quantidade").value;

    try {
        const novoProduto = new Produto(nome, preco, quantidade);

        const lista = document.getElementById("lista-produtos").getElementsByTagName("tbody")[0];
        const row = lista.insertRow(); 

        const cellNome = row.insertCell(0);
        const cellPreco = row.insertCell(1);
        const cellQuantidade = row.insertCell(2);
        const cellRemover = row.insertCell(3); 
        cellNome.textContent = novoProduto.nome;
        cellPreco.textContent = `R$${novoProduto.preco.toFixed(2)}`;
        cellQuantidade.textContent = novoProduto.quantidade;

        
        const btnRemover = document.createElement("button");
        btnRemover.textContent = "Remover";
        btnRemover.classList.add("btn-remover");
        btnRemover.addEventListener("click", function () {
            row.remove(); 
            calcularTotal();
        });
        cellRemover.appendChild(btnRemover);

       
        calcularTotal();

        e.target.reset();
    } catch (erro) {
        alert("Erro ao criar produto: " + erro.message);
    }
});

document.getElementById("limpar-tabela").addEventListener("click", function() {
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
