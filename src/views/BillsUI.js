//les fichiers BillsUI.js et NewBillUI.js, qui 
//sont responsables de l'affichage des factures et 
//de la création de nouvelles factures respectivemen

import VerticalLayout from './VerticalLayout.js'
import ErrorPage from "./ErrorPage.js"
import LoadingPage from "./LoadingPage.js"

import Actions from './Actions.js'

const row = (bill) => {
  return (`
    <tr>
      <td>${bill.type}</td>
      <td>${bill.name}</td>
      <td>${bill.date}</td>
      <td>${bill.amount} €</td>
      <td>${bill.status}</td>
      <td>
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
    `)
}
// Fonction pour générer plusieurs lignes de tableau HTML à partir d'un tableau de données de factures
// trie les données de factures par date décroissante, 
//génère les lignes de tableau HTML correspondantes à partir de ces données triées, 
//puis les joint en une seule chaîne de caractères. 
//Si les données de factures sont vides ou non définies, une chaîne vide est retournée.
const rows = (data) => {
  //[bug report - exe1] Ajout du même tri par date ordre décoissant des factures pour faire passer le test
  // .sort((a, b) => ((a.date < b.date) ? 1 : -1))
  return (data && data.length) ? data.sort((a, b) => ((a.date < b.date) ? 1 : -1)).map(bill => row(bill)).join("") : ""
}


// Fonction principale exportée pour rendre la page de factures
export default ({
  data: bills,
  loading,
  error
}) => {

  //aria-labelledby="exampleModalCenterTitle" : Identifie l'élément qui décrit le titre de la modale. 
  //Dans ce cas, il s'agit de l'élément dont l'ID est exampleModalCenterTitle.
  //aria-hidden="true" : Indique que la modale est cachée et n'est pas actuellement 
  //affichée à l'utilisateur. Cela permet d'indiquer aux lecteurs 
  //d'écran que la modale n'est pas visible.

  const modal = () => (`
    <div class="modal fade" id="modaleFile" data-testid="modaleFile" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Justificatif</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          </div>
        </div>
      </div>
    </div>
  `)

  // Vérifie si la page est en cours de chargement
  if (loading) {
    return LoadingPage() // Renvoie la page de chargement
  } else if (error) {
    return ErrorPage(error) // Renvoie la page d'erreur avec le message d'erreur
  }

  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Mes notes de frais </div>
          <button type="button" data-testid='btn-new-bill' class="btn btn-primary">Nouvelle note de frais</button>
        </div>
        <div id="data-table">
        <table id="example" class="table table-striped" style="width:100%">
          <thead>
              <tr>
                <th>Type</th>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
          </thead>
          <tbody data-testid="tbody">
            ${rows(bills)}
          </tbody>
          </table>
        </div>
      </div>
      ${modal()}
    </div>`)
}