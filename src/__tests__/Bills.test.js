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
  ROUTES,
  ROUTES_PATH
} from "../constants/routes.js";
import {
  localStorageMock
} from "../__mocks__/localStorage.js";

// exe5.1 : ajout du mock store - bills bouchonnées GET
import mockStore from "../__mocks__/store.js"

import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

// exe5.1 : ajout du mock store au contexte jest GET
jest.mock("../app/store", () => mockStore)

// exe5 : ajout de la fonction jest userevent
import userEvent from '@testing-library/user-event'

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
      //EXE5EXEPT attente de 'icon active sur la page (surbrillance) to-do write expect expression
      //vérifier si la classe de l'icône de la fenêtre contient la classe "active-icon" 
      //indiquant que l'icône est active. Si la chaîne correspond au modèle d'expression régulière,
      // le test passe avec succès. si = à active-icon
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

  })

  //[exe5.2 - 80%]
  describe('Given I am connected as Employee and I am on bill page and I clicked on a bill', () => {
    describe('When I click on the icon eye', () => {
      test('A modal should be called', () => {
        // bouchon le stockage local avec les données d'un employé
        Object.defineProperty(window, 'localStorage', {
          value: localStorageMock
        })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))

        // Crée le container (controlleur) basé sur cet interface, les facture, le localstorage,...
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({
            pathname
          })
        }

        const billContainer = new Bills({
          document,
          onNavigate,
          store: null,
          localStorage: window.localStorage
        })

        // créer l'interface HTML avec le tableau de factures bouchonné
        // Attention : il faut que la UI soit appeler après la création du container
        // sinon double events
        document.body.innerHTML = BillsUI({
          data: bills.slice(-1)
        })

        // Récupère l'event du click sur l'oeil dans le container
        // Attention l'evenement envoi l'icon et pas l'event complet (voir container/Bill.js l14)
        //jest!!! donner info
        const handleClickIconEye = jest.fn((e) => billContainer.handleClickIconEye(e.target))

        // récupère le oeil dans l'interface
        const eye = screen.getByTestId('icon-eye')
        console.log(eye.getAttribute("data-bill-url"))
        eye.addEventListener('click', handleClickIconEye)
        // Click
        userEvent.click(eye)
//maintenant (fn) jest est au courant, declancher click sur icon eye
//qui avec screen va faire que jest va recuperer l'événement pour simuler le functionement du click desouss
//quand on fait expeted  f? fonction a était appllée? si vi -test est ok
        // vérifier que l'event est appelé
        expect(handleClickIconEye).toHaveBeenCalled()
      })
    })
    describe('When I click on the new bill button', () => {
      test('A new bill form page should open', () => {
        // bouchon le stockage local avec les données d'un employé
        Object.defineProperty(window, 'localStorage', {
          value: localStorageMock
        })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))

        // créer l'interface HTML avec le tableau de factures bouchonné
        document.body.innerHTML = BillsUI({
          data: bills,
          loading: false,
          error: false
        })

        // Crée le container (controlleur) basé sur cet interface, les facture, le localstorage,...
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({
            pathname
          })
        }
        const store = null
        const billContainer = new Bills({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage
        })

        // Récupère l'event du click sur new bill dans le container
        const handleClickNewBill = jest.fn(billContainer.handleClickNewBill)

        // récupère le button new bill dans l'interface
        const newbill = screen.getByTestId('btn-new-bill')
        newbill.addEventListener('click', handleClickNewBill);
        // Click
        userEvent.click(newbill)

        // vérifier que l'event est appelé
        expect(handleClickNewBill).toHaveBeenCalled()

        // récupère le formulaire de la page new bill
        waitFor(() => {
          expect(screen.getByTestId("form-new-bill"))
        });
      })
    })
  })

  //[exe5.1 - GET Mentor] test d'intégration GET
  // remove "as admin"
  describe("Given I am a user connected", () => {
    // dashboard -> bill list
    describe("When I navigate to Bill list", () => {
      test("fetches bills from mock API GET", async () => {
        //pour stocker la chaîne JSON dans le stockage local sous la clé "user".
        localStorage.setItem("user", JSON.stringify({
          // Admin -> Employee
          type: "Employee",
          email: "a@a"
        }));
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.Bills)
        //voir plus bas //autrement: titre de la page
        //await waitFor(() => screen.getAllByTestId("icon-eye"))
        //expect(screen.getAllByTestId("icon-eye")).toBeTruthy()

        await waitFor(() => screen.getByText("Mes notes de frais"))
        expect(screen.getByText("Mes notes de frais")).toBeTruthy()
      })
      // waitFor pour attendre que les icônes "eye" soient rendues à l'écran. 
      //Cette fonction prend une fonction de rappel en argument qui sera exécutée 
      //à plusieurs reprises jusqu'à ce que l'expression retournée soit évaluée à true.
      // screen.getAllByTestId("icon-eye") pour sélectionner toutes les icônes "eye" 
      //à l'aide de leur attribut data-testid.
      //expect pour vérifier que le nombre d'icônes "eye" rendues est supérieur à zéro, 
      //ce qui garantit qu'au moins une icône est rendue à l'écran.
      //Cela assure que les icônes "eye" sont rendues avec succès dans composant après l'attente. 
      //Si elles ne sont pas rendues, le test échouera avec un message indiquant qu'il n'a pas réussi 
      //à trouver les icônes "eye".


      describe("When an error occurs on API", () => {
        beforeEach(() => {
          jest.spyOn(mockStore, "bills")
          Object.defineProperty(
            window,
            'localStorage', {
              value: localStorageMock
            }
          )
          window.localStorage.setItem('user', JSON.stringify({
            // Admin -> Employee
            type: "Employee",
            email: "a@a"
          }))
          const root = document.createElement("div")
          root.setAttribute("id", "root")
          document.body.appendChild(root)
          router()
        })
        test("fetches bills from an API and fails with 404 message error", async () => {

          mockStore.bills.mockImplementationOnce(() => {
            return {
              list: () => {
                return Promise.reject(new Error("Erreur 404"))
              }
            }
          })
          window.onNavigate(ROUTES_PATH.Bills)
          await new Promise(process.nextTick);
          const message = await screen.getByText(/Erreur 404/)
          expect(message).toBeTruthy()
        })

        test("fetches messages from an API and fails with 500 message error", async () => {

          mockStore.bills.mockImplementationOnce(() => {
            return {
              list: () => {
                return Promise.reject(new Error("Erreur 500"))
              }
            }
          })

          window.onNavigate(ROUTES_PATH.Bills)
          await new Promise(process.nextTick);
          const message = await screen.getByText(/Erreur 500/)
          expect(message).toBeTruthy()
        })
      })
    })
  })
})