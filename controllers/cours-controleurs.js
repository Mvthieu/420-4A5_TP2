const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");

const HttpErreur = require("../models/http-erreur");

const Cours = require("../models/cours.js");
const Professeur = require("../models/professeur.js");

const getCoursById = async (req, res, next) => {
  const coursId = req.params.coursId;
  let cours;
  try {
    cours = await Cours.findById(coursId);
  } catch (erreur) {
    return next(new HttpErreur("Erreur lors de la récupération du cours", 500));
  }
  if (!cours) {
    return next(new HttpErreur("Aucun cours trouvé pour l'id fourni", 404));
  }
  res.json({ cours: cours.toObject({ getters: true }) });
};

const creerCours = async (req, res, next) => {
  const { titre, discipline, professeur } = req.body;
  const nouveauCours = new Cours({
    titre,
    discipline,
    nombreMaxEtudiants: 30,
    dateDebut: "2023-01-01",
    dateFin: "2023-06-06",
    etudiants: [],
    professeur,
  });

  let unProfesseur;

  try {
    unProfesseur = await Professeur.findById(professeur);
  } catch {
    return next(new HttpErreur("Création de cours échouée", 500));
  }

  if (!unProfesseur) {
    return next(new HttpErreur("Professeur non trouvé selon le id"), 504);
  }

  try {
    await nouveauCours.save();
    unProfesseur.cours.push(nouveauCours);
    await unProfesseur.save();
  } catch (err) {
    const erreur = new HttpErreur("Création de cours échouée", 500);
    return next(erreur);
  }
  res.status(201).json({ cours: nouveauCours });
};

const supprimerCours = async (req, res, next) => {
  const coursId = req.params.coursId;
  let cours;
  try {
    cours = await Cours.findById(coursId).populate("professeur");
  } catch {
    return next(new HttpErreur("Erreur lors de la suppression du cours", 500));
  }
  if (!cours) {
    return next(new HttpErreur("Impossible de trouver le cours", 404));
  }
  try {
    await cours.deleteOne();
    cours.professeur.cours.pull(cours);
    await cours.professeur.save();
  } catch (err) {
    console.log(err);
    return next(new HttpErreur("Erreur lors de la suppression du cours", 500));
  }
  res.status(200).json({ message: "Cours supprimé" });
};

const updateCours = async (req, res, next) => {
  const { dateDebut, dateFin } = req.body;
  const coursId = req.params.coursId;

  let cours;

  try {
    cours = await Cours.findById(coursId);
    cours.dateDebut = dateDebut;
    cours.dateFin = dateFin;
    await cours.save();
  } catch {
    return next(new HttpErreur("Erreur lors de la mise à jour du cours", 500));
  }

  res.status(200).json({ cours: cours.toObject({ getters: true }) });
};

exports.creerCours = creerCours;
exports.getCoursById = getCoursById;
exports.updateCours = updateCours;
exports.supprimerCours = supprimerCours;
