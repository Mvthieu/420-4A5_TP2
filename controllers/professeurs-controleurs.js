const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const Cours = require("../models/cours");
const Professeur = require("../models/professeur");

const getProfesseurById = async (req, res, next) => {
    const profId = req.params.profId;
    let professeur;
    try {
        professeur = await Professeur.findById(profId);
    } catch (erreur){
        return next(
            new HttpErreur("Erreur lors de la récupération du professeur", 500)
        );
    }
    if(!professeur){
        return next(new HttpErreur("Aucun professeur trouvé pour l'id fourni", 404));
    };
    res.json({professeur: professeur.toObject({getters: true})});
};

const ajouterProfesseur = async (req, res, next) => {
    const { prenom, nom, embauche } = req.body;
    const nouveauProf = new Professeur({
      prenom,
      nom,
      embauche,
      cours: []
    });
  
    
  
    try {
  
      
      await nouveauProf.save();
    } catch (err) {
      const erreur = new HttpErreur("Ajout de professeur échoué", 500);
      return next(erreur);
    }
    res.status(201).json({ professeur: nouveauProf });
  };

  const supprimerProfesseur = async (req, res, next) => {
    const profId = req.params.profId;
    let professeur;
    try {
        professeur = await Professeur.findById(profId).populate("cours");
    } catch {
      return next(
        new HttpErreur("Erreur lors de la suppression d'un professeur", 500)
      );
    }
    if(!professeur){
      return next(new HttpErreur("Impossible de trouver le professeur", 404));
    }
    let cours;
    try{
        cours = await Cours.findOne({professeur: professeur});
      
      await professeur.remove();
      await cours.remove();
  
    }catch{
      return next(
        new HttpErreur("Erreur lors de la suppression du professeur", 500)
      );
    }
    res.status(200).json({ message: "Professeur supprimé" });
  };

  const updateProfesseur = async (req, res, next) => {
    const { nom, prenom } = req.body;
    const profId = requete.params.profId;
  
    let professeur;
  
    try {
      professeur = await Professeur.findById(profId);
      professeur.nom = nom;
      professeur.prenom = prenom;
      await professeur.save();
    } catch {
      return next(
        new HttpErreur("Erreur lors de la mise à jour du professeur", 500)
      );
    }
  
    res.status(200).json({ professeur: professeur.toObject({ getters: true }) });
  };

  const ajouterCours = async (req, res, next) => {
    const { titre, discipline } = req.body;
    const profId = req.params.profId;
    
  
    let unProfesseur;
  
    try {
        unProfesseur = await Professeur.findById(profId);
      
    } catch {
      
      return next(new HttpErreur("Ajout d'un cours à un professeur échoué", 500));
    }
  
    if (!unProfesseur) {
      return next(new HttpErreur("Professeur non trouvé selon le id"), 504);
    }

    const nouveauCours = new Cours({
        titre,
        discipline,
        nombreMaxEtudiants: 30,
        dateDebut: "2023-01-01",
        dateFin: "2023-06-06",
        etudiants:[],
        professeur: unProfesseur,
      });
  
    try {
  
      
      await nouveauCours.save();
      unProfesseur.cours.push(nouveauCours);
      await unProfesseur.save();
    } catch (err) {
      const erreur = new HttpErreur("Ajout d'un cours à un professeur échoué", 500);
      return next(erreur);
    }
    res.status(201).json({ professeur: unProfesseur });
  };


  exports.ajouterProfesseur = ajouterProfesseur;
  exports.getProfesseurById = getProfesseurById;
  exports.updateProfesseur = updateProfesseur;
  exports.supprimerProfesseur = supprimerProfesseur;
  exports.ajouterCours = ajouterCours;