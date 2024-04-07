//connecté en tant qu'employé, je saisis une note de frais avec un justificatif 
//qui a une extension différente de jpg, jpeg ou png, j'envoie. 
//J'arrive sur la page Bills, je clique sur l'icône "voir" pour consulter le justificatif : 
//la modale s'ouvre, mais il n'y a pas d'image. 

//Si je me connecte à présent en tant qu'Admin, et que je clique sur le ticket correspondant,
// le nom du fichier affiché est null. De même, lorsque je clique sur l'icône "voir" pour consulter le justificatif : la modale s'ouvre, mais il n'y a pas d'image.

// import { ROUTES_PATH } from '../constants/routes.js' // Importation du chemin des routes (commenté car non utilisé dans ce fichier)
import Logout from "./Logout.js" // Importation du composant de déconnexion

export default class NewBill { // Définition de la classe NewBill
  constructor({ document, onNavigate, store, localStorage }) { // Constructeur prenant en paramètres les éléments nécessaires
    this.document = document // Attribution de l'élément document
    this.onNavigate = onNavigate // Attribution de la fonction de navigation
    this.store = store // Attribution du magasin de données
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`) // Sélection du formulaire pour la création d'une nouvelle facture
    formNewBill.addEventListener("submit", this.handleSubmit) // Ajout d'un écouteur d'événements sur la soumission du formulaire
    const file = this.document.querySelector(`input[data-testid="file"]`) // Sélection du champ de fichier dans le formulaire
    file.addEventListener("change", this.handleChangeFile) // Ajout d'un écouteur d'événements pour détecter le changement de fichier
    this.fileUrl = null // Initialisation de l'URL du fichier à null
    this.fileName = null // Initialisation du nom du fichier à null
    this.billId = null // Initialisation de l'identifiant de la facture à null
    new Logout({ document, localStorage, onNavigate }) // Création d'une instance de Logout pour gérer la déconnexion
  }

  handleChangeFile = e => { // Méthode pour gérer le changement de fichier
    e.preventDefault() // Empêcher le comportement par défaut du formulaire
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0] // Sélection du fichier choisi
    const filePath = e.target.value.split(/\\/g) // Séparation du chemin du fichier
    const fileName = filePath[filePath.length-1] // Récupération du nom du fichier

    //[bug report - exe3] ne plus autoriser les fichiers autre que jpg, png, jpeg pour éviter le non 
    // afffichage de l'image dans la modale
    // Vérifier si le fichier est au format JPG, PNG ou JPEG
    const allowedExtensions = ["jpg", "jpeg", "png"]; // Extensions de fichier autorisées
    const fileExtension = fileName.split(".").pop().toLowerCase(); // Extension du fichier choisi

    if (!allowedExtensions.includes(fileExtension)) { // Si l'extension n'est pas autorisée
      e.target.value = ""; // Effacer la valeur du champ de fichier
      console.error("Pas bon format de fichier"); // Afficher un message d'erreur dans la console
      return; // Arrêter l'exécution de la méthode si le format n'est pas pris en charge
    }
    //[/bug report - exe3]

    const formData = new FormData() // Création d'un objet FormData pour envoyer le fichier
    const email = JSON.parse(localStorage.getItem("user")).email // Récupération de l'e-mail de l'utilisateur
    formData.append('file', file) // Ajout du fichier au FormData
    formData.append('email', email) // Ajout de l'e-mail au FormData

    this.store // Envoi du FormData au magasin de données pour créer une nouvelle facture
      .bills()
      .create({
        data: formData,
        headers: {
          noContentType: true
        }
      })
      .then(({fileUrl, key}) => { // Une fois que la facture est créée avec succès
        console.log(fileUrl) // Affichage de l'URL du fichier dans la console
        this.billId = key // Attribution de l'identifiant de la facture
        this.fileUrl = fileUrl // Attribution de l'URL du fichier
        this.fileName = fileName // Attribution du nom du fichier
      }).catch(error => console.error(error)) // Gestion des erreurs
  }

  handleSubmit = e => { // Méthode pour gérer la soumission du formulaire
    e.preventDefault() // Empêcher le comportement par défaut du formulaire
    console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value) // Affichage de la valeur du champ de date dans la console
    const email = JSON.parse(localStorage.getItem("user")).email // Récupération de l'e-mail de l'utilisateur depuis le stockage local
    const bill = { // Création d'un objet représentant la nouvelle facture
      email, // Attribution de l'e-mail de l'utilisateur
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value, // Récupération du type de dépense
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value, // Récupération du nom de la dépense
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value), // Récupération du montant de la dépense
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value, // Récupération de la date de la dépense
      vat: e.target.querySelector(`input[data-testid="vat"]`).value, // Récupération de la TVA
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20, // Récupération du pourcentage de TVA par défaut à 20%
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value, // Récupération du commentaire
      fileUrl: this.fileUrl, // Attribution de l'URL du fichier joint
      fileName: this.fileName, // Attribution du nom du fichier joint
      status: 'pending' // Attribution du statut de la facture (en attente)
    }
    this.updateBill(bill) // Mise à jour de la facture dans le magasin de données
    // this.onNavigate(ROUTES_PATH['Bills']) // Navigation vers la page des factures (commenté car ROUTES_PATH n'est pas importé)
  }

  // not need to cover this function by tests
  updateBill = (bill) => { // Méthode pour mettre à jour la facture dans le magasin de données
    if (this.store) { // Vérifier si le magasin de données est disponible
      this.store // Mettre à jour la facture dans le magasin de données
      .bills()
      .update({data: JSON.stringify(bill), selector: this.billId})
      .then(() => {
        // this.onNavigate(ROUTES_PATH['Bills']) // Navigation vers la page des factures (commenté car ROUTES_PATH n'est pas importé)
      })
      .catch(error => console.error(error)) // Gestion des erreurs
    }
  }
}
