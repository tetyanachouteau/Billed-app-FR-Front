// BillsUI.js

import BillsUI from "./_tests_/BillsUI.js"

// Ajoutez des filtres pour afficher uniquement les données appropriées pour l'utilisateur connecté
const filterBillsForUser = (bills, userType) => {
  if (userType === 'Employee') {
    // Filtrez les factures pour afficher uniquement celles de l'utilisateur connecté en tant qu'employé
    const currentUserEmail = JSON.parse(localStorage.getItem('user')).email;
    return bills.filter(bill => bill.email === currentUserEmail);
  } else {
    // Pour d'autres types d'utilisateurs ou administrateurs, affichez toutes les factures
    return bills;
  }
}

const displayBills = (bills, userType) => {
  const filteredBills = filterBillsForUser(bills, userType);
  // Affichez les factures filtrées dans l'interface utilisateur
  // Ajoutez le code pour afficher les factures dans l'interface utilisateur en fonction du type d'utilisateur
}

import {
  render,
  screen
} from '@testing-library/react';
import BillsUI from '../views/BillsUI.js'; // Importez le composant à tester
import {
  bills
} from '../fixtures/bills.js'; // Importez les données de test

describe('Bills UI', () => {
      test('should display bills for employee', () => {
          // Simuler le type d'utilisateur connecté comme employé
          const userType = 'Employee';
          // Rendre l'interface utilisateur des factures avec les données de test
          render( < BillsUI data = {
              bills
            }
            userType = {
              userType
            }
            />);
            // Ajoutez des assertions pour vérifier que les factures appropriées sont affichées pour l'employé
          });
      });

    export default displayBills;


    //Pour le test unitaire GET pour les factures (bills),
    // assurez-vous que vous testez le bon comportement lorsque
    // les données sont récupérées. simuler
    // une réponse de l'API pour les factures et vérifier si 
    //les données sont correctement affichées dans votre composant.

    //Pour le test unitaire POST pour la création de nouvelles factures 
    //(newbill), vous devrez simuler la soumission d'un formulaire
    // de création de facture et vérifier que les données sont 
    //correctement envoyées à l'API.