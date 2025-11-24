const express = require('express');
const {
  criarBloco,
  listarBlocos,
  buscarBlocoPorId,
  atualizarBloco,
  atualizarBlocoParcial,
  removerBloco
} = require('../controllers/blocoController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Bloco:
 *       type: object
 *       required:
 *         - turno
 *         - dia_da_semana
 *         - inicio
 *         - fim
 *         - ordem
 *         - status
 *       properties:
 *         turno:
 *           type: string
 *           enum: [manhã, tarde, noite]
 *           description: Turno do bloco
 *         dia_da_semana:
 *           type: string
 *           enum: [segunda, terça, quarta, quinta, sexta, sábado]
 *           description: Dia da semana do bloco
 *         inicio:
 *           type: string
 *           pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'
 *           description: Horário de início (HH:mm)
 *         fim:
 *           type: string
 *           pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'
 *           description: Horário de fim (HH:mm)
 *         ordem:
 *           type: number
 *           minimum: 1
 *           description: Ordem do bloco no turno/dia
 *         status:
 *           type: boolean
 *           description: Status ativo/inativo do bloco
 */

/**
 * @swagger
 * /api/v1/blocos:
 *   post:
 *     summary: Cria um novo bloco de horário
 *     tags: [Blocos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bloco'
 *           example:
 *             turno: "tarde"
 *             dia_da_semana: "segunda"
 *             inicio: "13:20"
 *             fim: "14:10"
 *             ordem: 1
 *             status: true
 *     responses:
 *       201:
 *         description: Bloco criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Conflito de unicidade ou sobreposição
 */
router.post('/', criarBloco);

/**
 * @swagger
 * /api/v1/blocos:
 *   get:
 *     summary: Lista todos os blocos de horário
 *     tags: [Blocos]
 *     parameters:
 *       - in: query
 *         name: turno
 *         schema:
 *           type: string
 *           enum: [manhã, tarde, noite]
 *         description: Filtrar por turno
 *       - in: query
 *         name: dia_da_semana
 *         schema:
 *           type: string
 *           enum: [segunda, terça, quarta, quinta, sexta, sábado]
 *         description: Filtrar por dia da semana
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *         description: Filtrar por status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Itens por página
 *     responses:
 *       200:
 *         description: Lista de blocos de horário
 */
router.get('/', listarBlocos);

/**
 * @swagger
 * /api/v1/blocos/{id}:
 *   get:
 *     summary: Busca um bloco por ID
 *     tags: [Blocos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do bloco
 *     responses:
 *       200:
 *         description: Bloco encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Bloco'
 *       404:
 *         description: Bloco não encontrado
 */
router.get('/:id', buscarBlocoPorId);

/**
 * @swagger
 * /api/v1/blocos/{id}:
 *   put:
 *     summary: Atualiza um bloco de horário
 *     tags: [Blocos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do bloco
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bloco'
 *     responses:
 *       200:
 *         description: Bloco atualizado com sucesso
 *       404:
 *         description: Bloco não encontrado
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Conflito de unicidade ou sobreposição
 */
router.put('/:id', atualizarBloco);

/**
 * @swagger
 * /api/v1/blocos/{id}:
 *   patch:
 *     summary: Atualização parcial de um bloco
 *     tags: [Blocos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do bloco
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               turno:
 *                 type: string
 *                 enum: [manhã, tarde, noite]
 *               dia_da_semana:
 *                 type: string
 *                 enum: [segunda, terça, quarta, quinta, sexta, sábado]
 *               inicio:
 *                 type: string
 *               fim:
 *                 type: string
 *               ordem:
 *                 type: number
 *               status:
 *                 type: boolean
 *           example:
 *             turno: "tarde"
 *             dia_da_semana: "terça"
 *             inicio: "14:00"
 *             fim: "14:50"
 *             ordem: 2
 *             status: false
 *     responses:
 *       200:
 *         description: Bloco atualizado com sucesso
 *       404:
 *         description: Bloco não encontrado
 */
router.patch('/:id', atualizarBlocoParcial);

/**
 * @swagger
 * /api/v1/blocos/{id}:
 *   delete:
 *     summary: Remove um bloco de horário
 *     tags: [Blocos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do bloco
 *     responses:
 *       204:
 *         description: Bloco removido com sucesso
 *       404:
 *         description: Bloco não encontrado
 */
router.delete('/:id', removerBloco);

module.exports = router;