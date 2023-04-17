const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");

const HttpErreur = require("../models/http-erreur");

const Etudiant = require("../models/etudiant");

const Cours = require("../models/cours");
const getEtudiantById = async (req, res, next) => {
  const etudiantId = req.params.etudiantId;
  let etudiant;
  try {
    etudiant = await Etudiant.findById(etudiantId);
  } catch (erreur) {
    return next(
      new HttpErreur("Erreur lors de la récupération de l'étudiant", 500)
    );
  }
  if (!etudiant) {
    return next(new HttpErreur("Aucun étudiant trouvé pour l'id fourni", 404));
  }
  res.json({ etudiant: etudiant.toObject({ getters: true }) });
};

const ajouterEtudiant = async (req, res, next) => {
  const { prenom, nom } = req.body;
  const nouvelEtudiant = new Etudiant({
    prenom,
    nom,
    inscription: "2023-01-01",
    cours: [],
  });
  try {
    await nouvelEtudiant.save();
  } catch (err) {
    const erreur = new HttpErreur("Ajout de l'étudiant échoué", 500);
    return next(erreur);
  }
  res.status(201).json({ etudiant: nouvelEtudiant });
};

const supprimerEtudiant = async (req, res, next) => {
  const etudiantId = req.params.etudiantId;
  let etudiant;
  try {
    etudiant = await Etudiant.findById(etudiantId).populate("cours");
  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression de l'étudiant", 500)
    );
  }
  if (!etudiant) {
    return next(new HttpErreur("Impossible de trouver l'étudiant", 404));
  }
  try {
    await Cours.updateMany({}, { $pull: { etudiants: etudiantId } });
    await etudiant.deleteOne();
  } catch (err) {
    console.log(err);
    return next(
      new HttpErreur("Erreur lors de la suppression d'un étudiant", 500)
    );
  }
  res.status(200).json({ message: "Étudiant supprimé" });
};

const updateEtudiant = async (req, res, next) => {
  const { inscription } = req.body;
  const etudiantId = req.params.etudiantId;

  let etudiant;

  try {
    etudiant = await Etudiant.findById(etudiantId);
    etudiant.inscription = inscription;
    await etudiant.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la mise à jour de l'étudiant", 500)
    );
  }

  res.status(200).json({ etudiant: etudiant.toObject({ getters: true }) });
};

const inscrireEtudiant = async (req, res, next) => {
  const { titre } = req.body;
  const etudiantId = req.params.etudiantId;

  let cours;
  let etudiant;

  try {
    cours = await Cours.findOne({ titre: titre });
    etudiant = await Etudiant.findById(etudiantId);
  } catch {
    return next(
      new HttpErreur("Inscription d'un étudiant à un cours échoué", 500)
    );
  }

  if (!etudiant) {
    return next(new HttpErreur("Étudiant non trouvé selon le id"), 504);
  }
  if (!cours) {
    return next(new HttpErreur("Cours non trouvé selon le titre"), 504);
  }

  try {
    etudiant.cours.push(cours);
    await etudiant.save();
    cours.etudiants.push(etudiant);
    await cours.save();
  } catch (err) {
    console.log(err);
    const erreur = new HttpErreur(
      "Inscription d'un étudiant à un cours échoué",
      500
    );
    return next(erreur);
  }
  res.status(201).json({ etudiant: etudiant });
};

exports.ajouterEtudiant = ajouterEtudiant;
exports.getEtudiantById = getEtudiantById;
exports.updateEtudiant = updateEtudiant;
exports.supprimerEtudiant = supprimerEtudiant;
exports.inscrireEtudiant = inscrireEtudiant;
