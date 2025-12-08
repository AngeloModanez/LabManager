const express = require('express');
const { consultarHorarios } = require('../controllers/horarioController');

const router = express.Router();

/**
 * @swagger
 * /api/v1/horarios:
 *   get:
 *     summary: Consulta horários com filtros
 *     tags: [Horários]
 *     parameters:
 *       - in: query
 *         name: laboratorioId
 *         schema:
 *           type: string
 *         description: Filtrar por ID do laboratório
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
 *         name: semestre
 *         schema:
 *           type: string
 *         description: Filtrar por semestre
 *       - in: query
 *         name: diaSemana
 *         schema:
 *           type: string
 *         description: Filtrar por dia da semana
 *     responses:
 *       200:
 *         description: Horários organizados por turno e dia da semana
 */
router.get('/', consultarHorarios);

module.exports = router;
