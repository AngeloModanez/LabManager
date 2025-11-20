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
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do curso
 *           example: "Engenharia de Software"
 *         codigo:
 *           type: string
 *           description: Código do curso
 *           example: "ES001"
 *         instituicaoId:
 *           type: string
 *           description: ID da instituição
 *           example: "507f1f77bcf86cd799439011"
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
 *             nome: "Engenharia de Software"
 *             codigo: "ES001"
 *             instituicaoId: "507f1f77bcf86cd799439011"
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
 *                   example: "Já existe um curso com este nome nesta instituição"
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
 *         example: "507f1f77bcf86cd799439011"
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome (contém, case-insensitive)
 *         example: "engenharia"
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
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *           example:
 *             nome: "Engenharia de Software Atualizado"
 *             codigo: "ES002"
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
 *                   example: "Curso não encontrado"
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
 *         example: "507f1f77bcf86cd799439011"
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
 *                   example: "Curso não encontrado"
 */
router.delete('/:id', removerCurso);

module.exports = router;