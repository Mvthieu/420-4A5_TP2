const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const Cours = require("../models/cours");
const Professeur = require("../models/professeur");

const getCoursById = async (req, res, next) => {
    const coursId = req.params.coursId;
    let cours;
    try {
        cours = await Cours.findById(coursId);
    } catch (erreur){
        return next(
            new HttpErreur("Erreur lors de la récupération du cours", 500)
        );
    }
    if(!cours){
        return next(new HttpErreur("Aucun cours trouvé pour l'id fourni", 404));
    };
    res.json({cours: cours.toObject({getters: true})});
};

const creerCours = async (req, res, next) => {
    const { titre, discipline, professeur } = req.body;
    const nouveauCours = new Cours({
      titre,
      discipline,
      nombreMaxEtudiants: 30,
      dateDebut: "2023-01-01",
      dateFin: "2023-06-06",
      etudiants:[],
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