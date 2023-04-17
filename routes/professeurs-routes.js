const express = require("express");
const controllersProfesseur = require("../controllers/professeurs-controleurs");
const router = express.Router();

router.get("/:profId", controllersProfesseur.getProfesseurById);

router.post("/", controllersProfesseur.ajouterProfesseur);

router.patch("/:profId", controllersProfesseur.updateProfesseur);

router.post("/:profId/ajouterCours", controllersProfesseur.ajouterCours);

router.delete("/:profId", controllersProfesseur.supprimerProfesseur);

module.exports = router;
