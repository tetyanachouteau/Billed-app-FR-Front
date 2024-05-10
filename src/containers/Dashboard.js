//composant complexe qui gère et les interactions
// pour afficher, éditer et gérer les factures 
//dans le tableau de bord d'administration. 
//Elle utilise des méthodes asynchrones pour 
//interagir avec le magasin de données et 
//effectuer des opérations de update et de récupération de données.

import {
  formatDate
} from '../app/format.js'
import DashboardFormUI from '../views/DashboardFormUI.js'
import BigBilledIcon from '../assets/svg/big_billed.js'
import {
  ROUTES_PATH
} from '../constants/routes.js'
import USERS_TEST from '../constants/usersTest.js'
import Logout from "./Logout.js"

export const filteredBills = (data, status) => {
  return (data && data.length) ?
    data.filter(bill => {
      let selectCondition

      // in jest environment
      if (typeof jest !== 'undefined') {
        selectCondition = (bill.status === status)
      }
      /* istanbul ignore next */
      else {
        // Vérifie si l'environnement est de production
        const userEmail = JSON.parse(localStorage.getItem("user")).email
        selectCondition =
          (bill.status === status) &&
          ![...USERS_TEST, userEmail].includes(bill.email)
      }

      return selectCondition
    }) : []
}

// Fonction pour générer une carte de facture
export const card = (bill) => {
  const firstAndLastNames = bill.email.split('@')[0]
  const firstName = firstAndLastNames.includes('.') ?
    firstAndLastNames.split('.')[0] : ''
  const lastName = firstAndLastNames.includes('.') ?
    firstAndLastNames.split('.')[1] : firstAndLastNames

  return (`
    <div class='bill-card' id='open-bill${bill.id}' data-testid='open-bill${bill.id}'>
      <div class='bill-card-name-container'>
        <div class='bill-card-name'> ${firstName} ${lastName} </div>
        <span class='bill-card-grey'> ... </span>
      </div>
      <div class='name-price-container'>
        <span> ${bill.name} </span>
        <span> ${bill.amount} € </span>
      </div>
      <div class='date-type-container'>
        <span> ${formatDate(bill.date)} </span>
        <span> ${bill.type} </span>
      </div>
    </div>
  `)
}

// Fonction pour générer des cartes de factures à partir d'un tableau de factures
export const cards = (bills) => {
  return bills && bills.length ? bills.map(bill => card(bill)).join("") : ""
}

// Fonction pour obtenir le statut en fonction de l'index

export const getStatus = (index) => {
  switch (index) {
    case 1:
      return "pending"
    case 2:
      return "accepted"
    case 3:
      return "refused"
  }
}
//Classe principale exportée
export default class {
  constructor({
    document,
    onNavigate,
    store,
    bills,
    localStorage
  }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store

   // Le constructeur utilise jQuery pour sélectionner des éléments HTML 
   //avec les identifiants #arrow-icon1, #arrow-icon2, et #arrow-icon3, 
   //qui représentent probablement des icônes fléchées. Il ajoute ensuite 
   //des écouteurs d'événements click à ces éléments. Lorsque l'un de ces 
   //éléments est cliqué, il appelle la méthode handleShowTickets avec 
   //l'argument correspondant (1, 2, ou 3) ainsi que les factures (bills).

//Instanciation de Logout : Le constructeur instancie également la classe 
//Logout avec les dépendances localStorage et onNavigate.
// la gestion des événements liés aux icônes de flèche et de l'initialisation de 
//la fonctionnalité de déconnexion via l'instanciation de la classe Logout.
    $('#arrow-icon1').click((e) => this.handleShowTickets(e, bills, 1))
    $('#arrow-icon2').click((e) => this.handleShowTickets(e, bills, 2))
    $('#arrow-icon3').click((e) => this.handleShowTickets(e, bills, 3))
    new Logout({
      localStorage,
      onNavigate
    })
  }
  // Gère le clic sur l'icône de l'œil pour afficher la modale
  handleClickIconEye = () => {
    const billUrl = $('#icon-eye-d').attr("data-bill-url")
    const imgWidth = Math.floor($('#modaleFileAdmin1').width() * 0.8)
    $('#modaleFileAdmin1').find(".modal-body").html(`<div style='text-align: center;'><img width=${imgWidth} src=${billUrl} alt="Bill"/></div>`)
    if (typeof $('#modaleFileAdmin1').modal === 'function') $('#modaleFileAdmin1').modal('show')
  }

  // Gère l'édition d'une facture, update son statut et affiche
  //formulaire d'édition
  handleEditTicket(e, bill, bills) {
    if (this.counter === undefined || this.id !== bill.id) this.counter = 0
    if (this.id === undefined || this.id !== bill.id) this.id = bill.id
    if (this.counter % 2 === 0) {
      bills.forEach(b => {
        $(`#open-bill${b.id}`).css({
          background: '#0D5AE5'
        })
      })
      $(`#open-bill${bill.id}`).css({
        background: '#2A2B35'
      })
      $('.dashboard-right-container div').html(DashboardFormUI(bill))
      $('.vertical-navbar').css({
        height: '150vh'
      })
      this.counter++
    } else {
      $(`#open-bill${bill.id}`).css({
        background: '#0D5AE5'
      })

      $('.dashboard-right-container div').html(`
        <div id="big-billed-icon" data-testid="big-billed-icon"> ${BigBilledIcon} </div>
      `)
      $('.vertical-navbar').css({
        height: '120vh'
      })
      this.counter++
    }
    $('#icon-eye-d').click(this.handleClickIconEye)
    $('#btn-accept-bill').click((e) => this.handleAcceptSubmit(e, bill))
    $('#btn-refuse-bill').click((e) => this.handleRefuseSubmit(e, bill))
  }

  //Je suis connecté en tant qu'administrateur RH, je déplie une liste de tickets
  // (par exemple : statut "validé"), je sélectionne un ticket, puis 
  //je déplie une seconde liste (par exemple : statut "refusé"),
  // je ne peux plus sélectionner un ticket de la première liste. 
// pourvoir déplier plusieurs listes, et consulter les tickets de chacune
// des deux listes.

  handleAcceptSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: 'accepted',
      commentAdmin: $('#commentary2').val()
    }
    this.updateBill(newBill)
    this.onNavigate(ROUTES_PATH['Dashboard'])
  }

  handleRefuseSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: 'refused',
      commentAdmin: $('#commentary2').val()
    }
    this.updateBill(newBill)
    this.onNavigate(ROUTES_PATH['Dashboard'])
  }
  //Gère l'affichage des factures en fonction du statut sélectionné (en attente, acceptée, refusée).
  handleShowTickets(e, bills, index) {
    if (this.counter === undefined || this.index !== index) this.counter = 0
    if (this.index === undefined || this.index !== index) this.index = index
    if (this.counter % 2 === 0) {
      $(`#arrow-icon${this.index}`).css({
        transform: 'rotate(0deg)'
      })
      $(`#status-bills-container${this.index}`)
        .html(cards(filteredBills(bills, getStatus(this.index))))
      this.counter++
    } else {
      $(`#arrow-icon${this.index}`).css({
        transform: 'rotate(90deg)'
      })
      $(`#status-bills-container${this.index}`)
        .html("")
      this.counter++
    }
    //pour chaque facture présente dans le tableau bills, 
    //un gestionnaire de clic est ajouté à l'élément HTML 
    //ayant l'ID open-bill${bill.id} dans le conteneur spécifique 
    //#status-bills-container${this.index}. 
    //Lorsque cet élément est cliqué,
    // la méthode handleEditTicket est appelée avec 
    //les paramètres appropriés (l'événement, la facture et le tableau complet des factures).
    bills.forEach(bill => {
      //[bug report - exe4] L'event sur les ligne de facture ne doivent concerner que les factures du regroupement
      // déplié sinon il ne retourve pas le container et on n'arrive pas à sélectionner la facture
      // ajout d'élement de contexte (quel liste) !!!!!!!!!!!!!!#status-bills-container${this.index}       
      $(`#status-bills-container${this.index} #open-bill${bill.id}`).click((e) => this.handleEditTicket(e, bill, bills))
    })

    return bills

  }
  //Récupère toutes les factures de tous les utilisateurs 
  //à partir du magasin (store).
  getBillsAllUsers = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then(snapshot => {
          const bills = snapshot
            .map(doc => ({
              id: doc.id,
              ...doc,
              date: doc.date,
              status: doc.status
            }))
          return bills
        })
        .catch(error => {
          throw error;
        })
    }
  }
  //update les données d'une facture dans le magasin.
  // not need to cover this function by tests
  /* istanbul ignore next */
  updateBill = (bill) => {
    if (this.store) {
      return this.store
        .bills()
        .update({
          data: JSON.stringify(bill),
          selector: bill.id
        })
        .then(bill => bill)
        .catch(console.log)
    }
  }
}