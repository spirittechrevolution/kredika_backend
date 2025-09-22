import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, relationship, integer, float, select, timestamp } from '@keystone-6/core/fields';

const Installment = list({
  access: allowAll,
  ui: {
    isHidden: true, // Masqué de l'interface d'administration principale
  },
  fields: {
    // Référence à la réservation de crédit
    creditReservation: relationship({
      ref: 'CreditReservation.installments',
      many: false,
    }),
    
    // Numéro de l'échéance (1, 2, 3...)
    installmentNumber: integer({
      validation: { isRequired: true, min: 1 },
    }),
    
    // Date d'échéance
    dueDate: timestamp({
      validation: { isRequired: true },
    }),
    
    // Montant dû
    amount: float({
      validation: { isRequired: true, min: 0 },
    }),
    
    // Statut du paiement
    status: select({
      options: [
        { label: 'En attente', value: 'pending' },
        { label: 'Payé', value: 'paid' },
        { label: 'En retard', value: 'late' },
        { label: 'Annulé', value: 'cancelled' },
      ],
      defaultValue: 'pending',
      ui: { displayMode: 'select' },
    }),
    
    // Informations de paiement
    paidDate: timestamp(),
    paidAmount: float(),
    paymentMethod: select({
      options: [
        { label: 'Espèces', value: 'cash' },
        { label: 'Wave', value: 'wave' },
        { label: 'Orange Money', value: 'orange_money' },
        { label: 'Carte bancaire', value: 'card' },
        { label: 'Virement', value: 'transfer' },
      ],
    }),
    
    // Référence de transaction
    transactionReference: text(),
    
    // Notes
    notes: text({
      ui: { displayMode: 'textarea' },
    }),
  },
  hooks: {
    validateInput: async ({ resolvedData, addValidationError }) => {
      // Vérifier que si le statut est 'paid', les informations de paiement sont renseignées
      if (resolvedData.status === 'paid') {
        if (!resolvedData.paidDate) {
          addValidationError('La date de paiement est requise lorsque le statut est "Payé"');
        }
        if (!resolvedData.paidAmount || resolvedData.paidAmount <= 0) {
          addValidationError('Le montant payé doit être supérieur à 0');
        }
        if (!resolvedData.paymentMethod) {
          addValidationError('La méthode de paiement est requise');
        }
      }
    },
  },
});

export default Installment;
