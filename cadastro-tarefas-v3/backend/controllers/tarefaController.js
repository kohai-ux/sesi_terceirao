const Tarefa = require("../models/Tarefa");

module.exports = {
  async listar(req, res) {
    const tarefas = await Tarefa.findAll();
    res.json(tarefas);
  },

  async criar(req, res) {
    try {
      const { titulo, descricao, responsavel } = req.body;
      const tarefa = await Tarefa.create({ titulo, descricao, responsavel });
      res.status(201).json(tarefa);
    } catch (erro) {
      res.status(400).json({ erro: erro.message });
    }
  },

  async alterarStatus(req, res) {
    const { id } = req.params;
    const tarefa = await Tarefa.findByPk(id);
    if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada." });

    const estados = ["Pendente", "Em Andamento", "Concluída"];
    const atual = estados.indexOf(tarefa.status);
    tarefa.status = estados[(atual + 1) % estados.length];
    await tarefa.save();
    res.json(tarefa);
  },

  async remover(req, res) {
    const { id } = req.params;
    const tarefa = await Tarefa.findByPk(id);
    if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada." });

    await tarefa.destroy();
    res.status(204).send();
  },
};
