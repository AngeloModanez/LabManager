const express = require('express');
const {
  criarCurso,
  listarCursos,
  atualizarCurso,
  removerCurso
} = require('../controllers/cursoController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Curso:
 *       type: object
 *       required:
 *         - nome
 *         - instituicaoId
 *         - turnos
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do curso
 *           example: "Análise e Desenvolvimento de Sistemas"
 *         codigo:
 *           type: string
 *           description: Código do curso
 *           example: "ADS"
 *         instituicaoId:
 *           type: string
 *           description: ID da instituição
 *         turnos:
 *           type: array
 *           items:
 *             type: string
 *             enum: [manha, tarde, noite]
 *           description: Turnos do curso
 *         ativo:
 *           type: boolean
 *           description: Status ativo/inativo
 *           default: true
 *     CursoResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/Curso'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: ID do curso
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 *             instituicaoId:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nome:
 *                   type: string
 */

/**
 * @swagger
 * /api/v1/cursos:
 *   post:
 *     summary: Cria um novo curso
 *     tags: [Cursos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *           example:
 *             nome: "Análise e Desenvolvimento de Sistemas"
 *             codigo: "ADS"
 *             turnos: ["manha", "tarde"]
 *             instituicaoId: ""
 *             ativo: true
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CursoResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       409:
 *         description: Curso já existe nesta instituição
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/', criarCurso);

/**
 * @swagger
 * /api/v1/cursos:
 *   get:
 *     summary: Lista todos os cursos
 *     tags: [Cursos]
 *     parameters:
 *       - in: query
 *         name: instituicaoId
 *         schema:
 *           type: string
 *         description: Filtrar por ID da instituição
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome (contém, case-insensitive)
 *       - in: query
 *         name: ativo
 *         schema:
 *           type: boolean
 *         description: Filtrar por status ativo
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
 *         description: Lista de cursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CursoResponse'
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/', listarCursos);

/**
 * @swagger
 * /api/v1/cursos/{id}:
 *   put:
 *     summary: Atualiza um curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do curso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *           example:
 *             nome: "Engenharia de Software Atualizado"
 *             turnos: ["noite"]
 *             ativo: false
 *     responses:
 *       200:
 *         description: Curso atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CursoResponse'
 *       404:
 *         description: Curso não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       409:
 *         description: Nome já existe nesta instituição
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put('/:id', atualizarCurso);

/**
 * @swagger
 * /api/v1/cursos/{id}:
 *   delete:
 *     summary: Remove um curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do curso
 *     responses:
 *       204:
 *         description: Curso removido com sucesso
 *       404:
 *         description: Curso não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete('/:id', removerCurso);

module.exports = router;