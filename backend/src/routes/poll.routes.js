const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

// MAESTRO
// POST   /api/polls              — crear encuesta
// GET    /api/polls              — listar mis encuestas
// GET    /api/polls/class/:id    — encuestas de una clase mía

// ALUMNO
// GET    /api/polls/student/class/:id  — encuestas de una clase con estado
// GET    /api/polls/:id                — obtener una encuesta
// POST   /api/polls/:id/responses      — enviar respuestas
// GET    /api/polls/:id/my-result      — ver mi resultado

router.post('/',                             pollController.createPoll);
router.get('/',                              pollController.getTeacherPolls);
router.get('/class/:claseId',                pollController.getClassPolls);
router.get('/student/class/:claseId',        pollController.getStudentClassPolls);
router.get('/:id',                           pollController.getPollById);
router.post('/:id/responses',                pollController.submitResponse);
router.get('/:id/my-result',                 pollController.getMyResult);

module.exports = router;

// Made with Bob
