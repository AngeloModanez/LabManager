const express = require('express');
const {
  criarDisciplina,
  listarDisciplinas,
  buscarDisciplinaPorId,
  atualizarDisciplina,
  removerDisciplina
} = require('../controllers/disciplinaController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Disciplina:
 *       type: object
 *       required:
 *         - nome
 *         - cursoId
 *         - cargaHoraria
 *         - professorId
 *         - status
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome da disciplina
 *           minLength: 3
 *         cursoId:
 *           type: string
 *           description: ID do curso
 *         cargaHoraria:
 *           type: integer
 *           description: Carga horária da disciplina
 *           minimum: 1
 *         professorId:
 *           type: string
 *           description: ID do professor responsável
 *         status:
 *           type: boolean
 *           description: Status ativo/inativo
 *           default: true
 */

/**
 * @swagger
 * /api/v1/disciplinas:
 *   post:
 *     summary: Cria uma nova disciplina
 *     tags: [Disciplinas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Disciplina'
 *           example:
 *             nome: "Programação Orientada a Objetos"
 *             cursoId: "507f1f77bcf86cd799439011"
 *             cargaHoraria: 80
 *             professorId: "507f1f77bcf86cd799439012"
 *             status: true
 *     responses:
 *       201:
 *         description: Disciplina criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Nome já existe no curso
 */
router.post('/', criarDisciplina);

/**
 * @swagger
 * /api/v1/disciplinas:
 *   get:
 *     summary: Lista todas as disciplinas
 *     tags: [Disciplinas]
 *     parameters:
 *       - in: query
 *         name: cursoId
 *         schema:
 *           type: string
 *         description: Filtrar por ID do curso
 *       - in: query
 *         name: professorId
 *         schema:
 *           type: string
 *         description: Filtrar por ID do professor
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
 *         description: Lista de disciplinas
 */
router.get('/', listarDisciplinas);

/**
 * @swagger
 * /api/v1/disciplinas/{id}:
 *   get:
 *     summary: Busca uma disciplina por ID
 *     tags: [Disciplinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da disciplina
 *     responses:
 *       200:
 *         description: Disciplina encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Disciplina'
 *       404:
 *         description: Disciplina não encontrada
 */
router.get('/:id', buscarDisciplinaPorId);

/**
 * @swagger
 * /api/v1/disciplinas/{id}:
 *   put:
 *     summary: Atualiza uma disciplina
 *     tags: [Disciplinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da disciplina
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Disciplina'
 *     responses:
 *       200:
 *         description: Disciplina atualizada
 *       404:
 *         description: Disciplina não encontrada
 *       409:
 *         description: Nome já existe no curso
 */
router.put('/:id', atualizarDisciplina);



/**
 * @swagger
 * /api/v1/disciplinas/{id}:
 *   delete:
 *     summary: Remove uma disciplina
 *     tags: [Disciplinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da disciplina
 *     responses:
 *       204:
 *         description: Disciplina removida
 *       404:
 *         description: Disciplina não encontrada
 */
router.delete('/:id', removerDisciplina);

module.exports = router;