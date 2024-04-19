/**
 * @jest-environment jsdom
 */

import {
  fireEvent,
  screen,
  waitFor
} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"

//[exe5 - ajout import]
import {
  ROUTES_PATH
} from "../constants/routes.js";
import {
  localStorageMock
} from "../__mocks__/localStorage.js";

//[exementor - POST Mentor] test d'intégration POST
import mockStore from "../__mocks__/store.js"

import router from "../app/Router.js";
//[exe5 - ajout import]

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    // [exe5] On créer le context de la page pour tous les tests
    beforeEach(async () => {
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
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('file'))
    })
    // [/exe5] 
    //[exeMentor POST- ajouter test contrôle sur jpg,png,jpeg]
    //2 tests, bon format tdd;, ok pdf, validation
    test("Then I can select file and choose png file", () => {
      // espionne la console
      const logSpy = jest.spyOn(global.console, 'log');
      // Récupère l'input file (selection du fichier d'image)
      const fileInput = screen.getByTestId("file");

      // Créer un objet de type File avec un nom de fichier et un type correspondant à .png
      const file = new File(["blabla"], "test.png", {
        type: "image/png"
      });

      // Simuler le changement de fichier en déclenchant un événement de changement sur l'input de fichier
      fireEvent.change(fileInput, {
        target: {
          files: [file]
        }
      });

      // Attendre que le changement soit pris en compte
      waitFor(() => {
        // vérifie qu'il n'y a pas d'erreur dans la console
        expect(logSpy).not.toHaveBeenCalledWith("Pas bon format de fichier");
      });

      console.log(fileInput.value);
    });
    test("Then I can select file and choose jpg file", () => {
      // espionne la console
      const logSpy = jest.spyOn(global.console, 'log');

      // Récupère l'input file (selection du fichier d'image)
      const fileInput = screen.getByTestId("file");

      // Créer un objet de type File avec un nom de fichier et un type correspondant à .jpg
      const file = new File(["blabla"], "test.jpg", {
        type: "image/jpg"
      });

      // Simuler le changement de fichier en déclenchant un événement de changement sur l'input de fichier
      fireEvent.change(fileInput, {
        target: {
          files: [file]
        }
      });

      // Attendre que le changement soit pris en compte
      waitFor(() => {
        // vérifie qu'il n'y a pas d'erreur dans la console
        expect(logSpy).not.toHaveBeenCalledWith("Pas bon format de fichier");
      });
    });
    test("Then I can select file and choose jpeg file", () => {
      // espionne la console
      const logSpy = jest.spyOn(global.console, 'log');

      // Récupère l'input file (selection du fichier d'image)
      const fileInput = screen.getByTestId("file");

      // Créer un objet de type File avec un nom de fichier et un type correspondant à .jpeg
      const file = new File(["blabla"], "test.jpeg", {
        type: "image/jpeg"
      });

      // Simuler le changement de fichier en déclenchant un événement de changement sur l'input de fichier
      fireEvent.change(fileInput, {
        target: {
          files: [file]
        }
      });

      // Attendre que le changement soit pris en compte
      waitFor(() => {
        // vérifie qu'il n'y a pas d'erreur dans la console
        expect(logSpy).not.toHaveBeenCalledWith("Pas bon format de fichier");
      });
    });
    test("Then I can't select file and choose pdf file", () => {
      // espionne la console
      const logSpy = jest.spyOn(global.console, 'log');

      // Récupère l'input file (selection du fichier d'image)
      const fileInput = screen.getByTestId("file");

      // Créer un objet de type File avec un nom de fichier et un type correspondant à .pdf
      const file = new File(["blabla"], "test.pdf", {
        type: "image/pdf"
      });

      // Simuler le changement de fichier en déclenchant un événement de changement sur l'input de fichier
      fireEvent.change(fileInput, {
        target: {
          files: [file]
        }
      });

      // Attendre que le changement soit pris en compte
      waitFor(() => {
        // vérifie qu'il n'y a pas d'erreur dans la console
        expect(logSpy).toHaveBeenCalledWith("Pas bon format de fichier");
      });
    });
    //[/exeMentor POST- ajouter test contrôle sur jpg,png,jpeg]
    test("Then I fill the form, submit and get a new bill in the bills page", () => {
      // espionne la console
      const logSpy = jest.spyOn(global.console, 'log');

      // Récupère l'input file (selection du fichier d'image)
      const fileInput = screen.getByTestId("file");

      // Créer un objet de type File avec un nom de fichier et un type correspondant à .pdf
      const file = new File(["blabla"], "test.png", {
        type: "image/png"
      });

      // Simuler le changement de fichier en déclenchant un événement de changement sur l'input de fichier
      fireEvent.change(fileInput, {
        target: {
          files: [file]
        }
      });

      // Attendre que le changement soit pris en compte
      waitFor(() => {
        // vérifie qu'il n'y a pas d'erreur dans la console
        expect(logSpy).not.toHaveBeenCalledWith("Pas bon format de fichier");
      });

      // remplissage des autres champs du formulaire
      screen.getByTestId("expense-type").value = "Transports";
      screen.getByTestId("expense-name").value = "Test Expense";
      screen.getByTestId("amount").value = 100;
      screen.getByTestId("datepicker").value = "01/01/2099";
      screen.getByTestId("vat").value = 12;
      screen.getByTestId("pct").value = 20;
      screen.getByTestId("commentary").value = "test";

      const form = screen.getByTestId("form-new-bill");
      fireEvent.submit(form);

      waitFor(() => {
        // on vérifie qu'on est sur la page de factures 
        // on cherchant l'icon oeil
        expect(screen.getByTestId("icon-eye")).toBeTruthy()
      });

    });

    //[exementor - POST Mentor] test d'intégration POST
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
      })

      test("fetches messages from an API and fails with 500 message error", async () => {

        mockStore.bills.mockImplementationOnce(() => {
          return {
            // Car quand on envoye une nouvelle note de frais on appelle la méthode update du store (NewBill.js ligne 99)
            // ici on dit qu'elle retourne une erreur 500
            update: () => {
              return Promise.reject(new Error("Erreur 500"))
            }
          }
        })

        // Récupère l'input file (selection du fichier d'image)
        const fileInput = screen.getByTestId("file");

        // Créer un objet de type File avec un nom de fichier et un type correspondant à .png
        const file = new File(["blabla"], "test.png", {
          type: "image/png"
        });

        // Simuler le changement de fichier en déclenchant un événement de changement sur l'input de fichier
        fireEvent.change(fileInput, {
          target: {
            files: [file]
          }
        });

        // remplissage des autres champs du formulaire
        screen.getByTestId("expense-type").value = "Transports";
        screen.getByTestId("expense-name").value = "Test Expense";
        screen.getByTestId("amount").value = 100;
        screen.getByTestId("datepicker").value = "01/01/2099";
        screen.getByTestId("vat").value = 12;
        screen.getByTestId("pct").value = 20;
        screen.getByTestId("commentary").value = "test";


        const form = screen.getByTestId("form-new-bill");
        fireEvent.submit(form);

        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur/)
        expect(message).toBeTruthy()
      })
    })
  })
})