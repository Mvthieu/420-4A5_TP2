const express = require("express");
const controllersEtudiant = require("../controllers/etudiants-controleurs");
const router = express.Router();

router.get("/:etudiantId", controllersEtudiant.getEtudiantById);

router.post("/", controllersEtudiant.ajouterEtudiant);

router.patch("/:etudiantId", controllersEtudiant.updateEtudiant);

router.patch("/:etudiantId/inscription", controllersEtudiant.inscrireEtudiant);

router.delete("/:etudiantId", controllersEtudiant.supprimerEtudiant);

module.exports = router;
