const express = require('express');
const {
  criarAula,
  listarAulas,
  buscarAulaPorId,
  atualizarAula,
  removerAula
} = require('../controllers/aulaController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Aula:
 *       type: object
 *       required:
 *         - semestre
 *         - cursoId
 *         - disciplinaId
 *         - professorId
 *         - laboratorioId
 *         - diaSemana
 *         - blocos
 *         - dataInicio
 *         - dataFim
 *       properties:
 *         semestre:
 *           type: string
 *           description: Semestre da aula (formato YYYY/1 ou YYYY/2)
 *           pattern: ^\d{4}\/[12]$
 *         cursoId:
 *           type: string
 *           description: ID do curso
 *         disciplinaId:
 *           type: string
 *           description: ID da disciplina
 *         professorId:
 *           type: string
 *           description: ID do professor
 *         laboratorioId:
 *           type: string
 *           description: ID do laboratório
 *         diaSemana:
 *           type: string
 *           enum: [Segunda, Terça, Quarta, Quinta, Sexta, Sábado]
 *           description: Dia da semana
 *         blocos:
 *           type: array
 *           items:
 *             type: string
 *           description: Array de IDs dos blocos
 *         dataInicio:
 *           type: string
 *           format: date
 *           description: Data de início da aula
 *         dataFim:
 *           type: string
 *           format: date
 *           description: Data de fim da aula
 */

/**
 * @swagger
 * /api/v1/aulas:
 *   post:
 *     summary: Cria uma nova aula
 *     tags: [Aulas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aula'
 *           example:
 *             semestre: "2024/1"
 *             cursoId: "507f1f77bcf86cd799439011"
 *             disciplinaId: "507f1f77bcf86cd799439012"
 *             professorId: "507f1f77bcf86cd799439013"
 *             laboratorioId: "507f1f77bcf86cd799439014"
 *             diaSemana: "Segunda"
 *             blocos: ["507f1f77bcf86cd799439015"]
 *             dataInicio: "2024-03-01"
 *             dataFim: "2024-07-15"
 *     responses:
 *       201:
 *         description: Aula criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Conflito de horário
 */
router.post('/', criarAula);

/**
 * @swagger
 * /api/v1/aulas:
 *   get:
 *     summary: Lista todas as aulas
 *     tags: [Aulas]
 *     parameters:
 *       - in: query
 *         name: cursoId
 *         schema:
 *           type: string
 *         description: Filtrar por ID do curso
 *       - in: query
 *         name: disciplinaId
 *         schema:
 *           type: string
 *         description: Filtrar por ID da disciplina
 *       - in: query
 *         name: professorId
 *         schema:
 *           type: string
 *         description: Filtrar por ID do professor
 *       - in: query
 *         name: laboratorioId
 *         schema:
 *           type: string
 *         description: Filtrar por ID do laboratório
 *       - in: query
 *         name: diaSemana
 *         schema:
 *           type: string
 *         description: Filtrar por dia da semana
 *       - in: query
 *         name: semestre
 *         schema:
 *           type: string
 *         description: Filtrar por semestre
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
 *         description: Lista de aulas
 */
router.get('/', listarAulas);

/**
 * @swagger
 * /api/v1/aulas/{id}:
 *   get:
 *     summary: Busca uma aula por ID
 *     tags: [Aulas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da aula
 *     responses:
 *       200:
 *         description: Aula encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Aula'
 *       404:
 *         description: Aula não encontrada
 */
router.get('/:id', buscarAulaPorId);

/**
 * @swagger
 * /api/v1/aulas/{id}:
 *   put:
 *     summary: Atualiza uma aula
 *     tags: [Aulas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da aula
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aula'
 *     responses:
 *       200:
 *         description: Aula atualizada
 *       404:
 *         description: Aula não encontrada
 *       409:
 *         description: Conflito de horário
 */
router.put('/:id', atualizarAula);

/**
 * @swagger
 * /api/v1/aulas/{id}:
 *   delete:
 *     summary: Remove uma aula
 *     tags: [Aulas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da aula
 *     responses:
 *       204:
 *         description: Aula removida
 *       404:
 *         description: Aula não encontrada
 */
router.delete('/:id', removerAula);

module.exports = router;