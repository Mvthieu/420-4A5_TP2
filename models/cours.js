const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const coursSchema = new Schema({
    titre:{type: String, required: true},
    discipline:{type: String, required: true},
    nombreMaxEtudiants: {type: Number, required: true},
    dateDebut: {type: Date, required: true},
    dateFin: {type: Date, required: true},
    etudiants: [{type: mongoose.Types.ObjectId, required: true, ref:"Etudiant"}],
    professeur:{type: mongoose.Types.ObjectId, required: true, ref:"Professeur"}
});

module.exports = mongoose.model("Cours", coursSchema);