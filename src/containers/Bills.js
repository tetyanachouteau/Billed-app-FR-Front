import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"

export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
    if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill)
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
    if (iconEye) iconEye.forEach(icon => {
      icon.addEventListener('click', () => this.handleClickIconEye(icon))
    })
    new Logout({ document, localStorage, onNavigate })
  }

  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH['NewBill'])
  }

  //exe5.3 : pour pas que test plant.
  handleClickIconEye = (icon) => {
    console.log(icon)
    const billUrl = icon.getAttribute("data-bill-url")
    const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
    $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`)
    // exe5.3 : Comme dans container/Dashboard.js
    if (typeof $('#modaleFile').modal === 'function') $('#modaleFile').modal('show')
  }

  // document.getElementById pour récupérer l'élément modal avec l'ID "modaleFile".
  //document.querySelector pour sélectionner l'élément .modal-body à l'intérieur de la modale.
// innerHTML pour définir le contenu de la modal body avec une image dont l'URL 
//est récupérée à partir de l'attribut data-bill-url.
//offsetWidth pour obtenir la largeur de la modale et calculer la largeur de l'image.

//si la méthode modal est définie sur l'élément modal avant de l'appeler pour afficher la modale.
//HTML contient bien un élément avec l'ID "modaleFile" et une structure correspondante 
//à celle que vous utilisez avec jQuery.

  getBills = () => {
    if (this.store) {
      return this.store
      .bills()
      .list()
      .then(snapshot => {
        const bills = snapshot
          .map(doc => {
            try {
              return {
                ...doc,
                date: formatDate(doc.date),
                status: formatStatus(doc.status)
              }
            } catch(e) {
              // if for some reason, corrupted data was introduced, we manage here failing formatDate function
              // log the error and return unformatted date in that case
              console.log(e,'for',doc)
              return {
                ...doc,
                date: doc.date,
                status: formatStatus(doc.status)
              }
            }
          })
          console.log('length', bills.length)
        return bills
      })
    }
  }
}
