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
//exe1 : data factures
// trie les données de factures par date décroissante, 
//génère les lignes de tableau HTML correspondantes à partir de ces données triées, 
//puis les joint en une seule chaîne de caractères. 
//Si les données de factures sont vides ou non définies, une chaîne vide est retournée.
const rows = (data) => {
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


//exe1:  (data && data.length) : C'est une condition vérifiant si data existe et s'il contient des éléments. Cela garantit que la logique suivante n'est exécutée que si data est défini et qu'il contient au moins un élément.

//? ... : ... : C'est l'opérateur ternaire, qui est utilisé ici pour conditionner le choix entre deux valeurs à retourner en fonction de la condition précédente.

//data.sort((a, b) => ((a.date < b.date) ? 1 : -1)) : C'est la première partie de l'opérateur ternaire. Cela trie les données de factures par date décroissante en utilisant sort(). La fonction de comparaison passée à sort() renvoie 1 si a.date est inférieur à b.date, ce qui place a après b dans le tableau trié, et -1 dans le cas contraire, ce qui place a avant b.

//.map(bill => row(bill)) : C'est la deuxième partie de l'opérateur ternaire. Cela transforme chaque objet de facture trié en une ligne de tableau HTML en utilisant la fonction row.

//.join("") : Cela rejoint toutes les lignes de tableau HTML générées en une seule chaîne de caractères. Cette chaîne de caractères représente le contenu complet des lignes de tableau HTML.

//: "" : C'est la partie de la condition ternaire qui est exécutée si la condition initiale (data && data.length) est fausse, ce qui signifie que data est vide ou non défini. Dans ce cas, la chaîne vide "" est retournée.