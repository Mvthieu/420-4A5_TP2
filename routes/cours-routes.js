const express = require('express');
const controllersCours = require('../controllers/cours-controleurs');
const router = express.Router();

router.get('/:coursId', controllersCours.getCoursById);

router.post('/', controllersCours.creerCours);

router.patch('/:coursId', controllersCours.updateCours);

router.delete('/:coursId', controllersCours.supprimerCours);

module.exports = router;
