/**
 * @jest-environment jsdom
 */

import {
  fireEvent,
  screen,
  waitFor
} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import {
  bills
} from "../fixtures/bills.js"
import {
  ROUTES_PATH
} from "../constants/routes.js";
import {
  localStorageMock
} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

//exe1:,tdd3, ligne 39 et 84 Test des actions sur une facture
//Test de l'ordre des factures :

//Le test Bills / les notes de frais s'affichent par ordre décroissant

//tests garantissent que l'interface utilisateur des factures
// fonctionne correctement pour un utilisateur connecté en tant 
//qu'employé, en vérifiant différents aspects tels que 
//la mise en surbrillance des icônes, l'ordre des factures et 
//la fonctionnalité des actions sur les factures.


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock
      })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      //vérifier si la classe de l'icône de la fenêtre contient la classe "active-icon" 
      //indiquant que l'icône est active. Si la chaîne correspond au modèle d'expression régulière,
      // le test passe avec succès.
      expect(windowIcon.getAttribute('class')).toEqual("active-icon")
    })

    //Test de l'icône de la fenêtre active :

    //test vérifie que lorsque l'utilisateur est connecté en tant qu'employé 
    //et accède à la page des factures, l'icône de la fenêtre dans la mise en page
    // verticale est mise en surbrillance (classe active).
    //Il simule une navigation vers la page des factures et attend 
    //que l'icône de la fenêtre soit rendue. Ensuite, il vérifie si 
    //la classe de l'icône de la fenêtre contient "active-icon".
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({
        data: bills
      })

      // en bas: vérifier si les dates affichées à l'écran sont triées dans l'ordre décroissant. 
      //Voici une explication détaillée : La première ligne de code récupère tous les éléments HTML
      // qui correspondent à un motif de date spécifique, probablement une date au 
      //format "YYYY-MM-DD". Ces éléments sont extraits du DOM et leur contenu HTML 
      //est stocké dans un tableau appelé dates.
      // comparaison appelée antiChrono. Cette fonction est utilisée par la méthode sort() 
      //pour trier les dates dans l'ordre anti-chronologique. 
      //Si la date a est considérée comme antérieure à la date b, la fonction renvoie 1, 
      //sinon elle renvoie -1.

      //Tri des dates : La troisième ligne de code crée une copie du tableau dates à l'aide 
      //de la syntaxe de spread ([...dates]) et trie cette copie en utilisant la fonction antiChrono. 
      //Le résultat trié est stocké dans un nouveau tableau appelé datesSorted.

      // Vérification du tri : La dernière ligne de code utilise l'assertion expect 
      //pour comparer le tableau original dates avec le tableau trié datesSorted. 
      //Si les deux tableaux sont égaux, cela signifie que les dates sont triées dans 
      //l'ordre anti-chronologique comme prévu, et le test réussit.
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    //exe1:,tdd3, ligne 39 et 84 Test des actions sur une facture
    //Test de l'ordre des factures :

    //test vérifie que les factures sont affichées dans l'ordre chronologique,
    // de la plus ancienne à la plus récente.
    //Il récupère les dates des factures, les trie dans l'ordre anti-chronologique 
    //(du plus récent au plus ancien) et vérifie si elles 
    //correspondent à l'ordre initial des dates.
    test("Then I can perform actions on a bill", () => {
      // Simuler le clic sur une action (détail : oeil)
      const bill = bills.slice(-1); // Sélectionner une facture pour le test
      document.body.innerHTML = BillsUI({
        data: bill
      });
      const actionButton = screen.getByTestId("icon-eye");
      fireEvent.click(actionButton);

      // Attendre que l'action soit effectuée
      waitFor(() => {
        expect(screen.getAllByTestId("modaleFile").getAttribute("aria-hidden")).toEqual("visible")
      });
    });

    //Test des actions sur une facture :

    //test vérifie qu'une action spécifique sur une facture peut être effectuée avec succès.
    //Il simule un clic sur un bouton d'action (l'icône de l'œil pour voir les détails d'une facture),
    // puis vérifie que la modale correspondante est affichée en attendant que 
    //son attribut "aria-hidden" devienne "visible".
    test("Then I can perform new bill action", () => {
      // Simuler le clic sur une action (new bill)
      const actionButton = screen.getByTestId("btn-new-bill");
      fireEvent.click(actionButton);

      // Attendre que l'action soit effectuée
      waitFor(() => {
        expect(screen.getByTestId("form-new-bill"))
      });
    });
  })
})