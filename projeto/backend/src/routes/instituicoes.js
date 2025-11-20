const express = require('express');
const {
  criarInstituicao,
  listarInstituicoes,
  atualizarInstituicao,
  removerInstituicao
} = require('../controllers/instituicaoController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Instituicao:
 *       type: object
 *       required:
 *         - nome
 *         - cnpj
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome da instituição
 *         cnpj:
 *           type: string
 *           description: CNPJ da instituição
 *         email:
 *           type: string
 *           description: Email da instituição
 *         telefone:
 *           type: string
 *           description: Telefone da instituição
 *         endereco:
 *           type: string
 *           description: Endereço da instituição
 *         ativo:
 *           type: boolean
 *           description: Status ativo/inativo
 *           default: true
 */

/**
 * @swagger
 * /api/v1/instituicoes:
 *   post:
 *     summary: Cria uma nova instituição
 *     tags: [Instituições]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Instituicao'
 *     responses:
 *       201:
 *         description: Instituição criada com sucesso
 *       409:
 *         description: CNPJ já existe
 */
router.post('/', criarInstituicao);

/**
 * @swagger
 * /api/v1/instituicoes:
 *   get:
 *     summary: Lista todas as instituições
 *     tags: [Instituições]
 *     parameters:
 *       - in: query
 *         name: ativo
 *         schema:
 *           type: boolean
 *         description: Filtrar por status ativo
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome (contém)
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
 *         description: Lista de instituições
 */
router.get('/', listarInstituicoes);

/**
 * @swagger
 * /api/v1/instituicoes/{id}:
 *   put:
 *     summary: Atualiza uma instituição
 *     tags: [Instituições]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da instituição
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Instituicao'
 *     responses:
 *       200:
 *         description: Instituição atualizada
 *       404:
 *         description: Instituição não encontrada
 */
router.put('/:id', atualizarInstituicao);

/**
 * @swagger
 * /api/v1/instituicoes/{id}:
 *   delete:
 *     summary: Remove uma instituição
 *     tags: [Instituições]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da instituição
 *     responses:
 *       204:
 *         description: Instituição removida
 *       404:
 *         description: Instituição não encontrada
 */
router.delete('/:id', removerInstituicao);

module.exports = router;