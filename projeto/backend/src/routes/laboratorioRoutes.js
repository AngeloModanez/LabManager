const express = require('express');
const {
  criarLaboratorio,
  listarLaboratorios,
  buscarLaboratorioPorId,
  atualizarLaboratorio,
  atualizarLaboratorioParcial,
  removerLaboratorio
} = require('../controllers/laboratorioController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Laboratorio:
 *       type: object
 *       required:
 *         - nome
 *         - capacidade
 *         - status
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do laboratório
 *           minLength: 2
 *           maxLength: 120
 *         capacidade:
 *           type: integer
 *           description: Capacidade do laboratório
 *           minimum: 1
 *         localizacao:
 *           type: string
 *           description: Localização do laboratório
 *           maxLength: 200
 *         status:
 *           type: boolean
 *           description: Status ativo/inativo
 *           default: true
 */

/**
 * @swagger
 * /api/v1/laboratorios:
 *   post:
 *     summary: Cria um novo laboratório
 *     tags: [Laboratórios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Laboratorio'
 *           example:
 *             nome: "Laboratório de Informática 1"
 *             capacidade: 30
 *             localizacao: "Bloco A - Sala 101"
 *             status: true
 *     responses:
 *       201:
 *         description: Laboratório criado com sucesso
 *       409:
 *         description: Nome já existe
 */
router.post('/', criarLaboratorio);

/**
 * @swagger
 * /api/v1/laboratorios:
 *   get:
 *     summary: Lista todos os laboratórios
 *     tags: [Laboratórios]
 *     parameters:
 *       - in: query
 *         name: blocoId
 *         schema:
 *           type: string
 *         description: Filtrar por ID do bloco
 *       - in: query
 *         name: status
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
 *         description: Lista de laboratórios
 */
router.get('/', listarLaboratorios);

/**
 * @swagger
 * /api/v1/laboratorios/{id}:
 *   get:
 *     summary: Busca um laboratório por ID
 *     tags: [Laboratórios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do laboratório
 *     responses:
 *       200:
 *         description: Laboratório encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Laboratorio'
 *       404:
 *         description: Laboratório não encontrado
 */
router.get('/:id', buscarLaboratorioPorId);

/**
 * @swagger
 * /api/v1/laboratorios/{id}:
 *   put:
 *     summary: Atualiza um laboratório
 *     tags: [Laboratórios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do laboratório
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Laboratorio'
 *     responses:
 *       200:
 *         description: Laboratório atualizado
 *       404:
 *         description: Laboratório não encontrado
 */
router.put('/:id', atualizarLaboratorio);

/**
 * @swagger
 * /api/v1/laboratorios/{id}:
 *   patch:
 *     summary: Atualização parcial de um laboratório
 *     tags: [Laboratórios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do laboratório
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               capacidade:
 *                 type: integer
 *               localizacao:
 *                 type: string
 *               status:
 *                 type: boolean
 *           example:
 *             nome: "Laboratório Atualizado"
 *             capacidade: 35
 *             localizacao: "Bloco B - Sala 201"
 *             status: false
 *     responses:
 *       200:
 *         description: Laboratório atualizado com sucesso
 *       404:
 *         description: Laboratório não encontrado
 */
router.patch('/:id', atualizarLaboratorioParcial);

/**
 * @swagger
 * /api/v1/laboratorios/{id}:
 *   delete:
 *     summary: Remove um laboratório
 *     tags: [Laboratórios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do laboratório
 *     responses:
 *       204:
 *         description: Laboratório removido
 *       404:
 *         description: Laboratório não encontrado
 */
router.delete('/:id', removerLaboratorio);

module.exports = router;