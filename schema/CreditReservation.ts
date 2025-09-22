import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, relationship, integer, float, select, timestamp, json } from '@keystone-6/core/fields';

const CreditReservation = list({
  access: allowAll,
  fields: {
    // Références
    order: relationship({
      ref: 'Order.creditReservations',
      many: false,
    }),
    
    product: relationship({
      ref: 'Product',
      many: false,
    }),
    
    customer: relationship({
      ref: 'Customer.creditReservations',
      many: false,
    }),
    
    // Snapshot du produit au moment de la réservation
    productSnapshot: text({
      ui: { displayMode: 'textarea' },
    }),
    
    // Plan de paiement
    paymentPlan: text({
      ui: { displayMode: 'textarea' },
    }),
    
    // Statut de la réservation
    status: select({
      options: [
        { label: 'Réservée', value: 'reserved' },
        { label: 'Active', value: 'active' },
        { label: 'Terminée', value: 'completed' },
        { label: 'En défaut', value: 'defaulted' },
        { label: 'Annulée', value: 'cancelled' },
      ],
      defaultValue: 'reserved',
      ui: { displayMode: 'select' },
    }),
    
    // Échéancier des paiements
    installments: relationship({
      ref: 'Installment.creditReservation',
      many: true,
      ui: {
        displayMode: 'cards',
        cardFields: ['dueDate', 'amount', 'status'],
        inlineCreate: { fields: ['dueDate', 'amount'] },
        inlineEdit: { fields: ['status', 'paidDate', 'paidAmount'] },
      },
    }),
    
    // Dates importantes
    reservationDate: timestamp({
      defaultValue: { kind: 'now' },
    }),
    firstPaymentDate: timestamp(),
    expectedCompletionDate: timestamp(),
    actualCompletionDate: timestamp(),
    
    // Métadonnées
    notes: text({
      ui: { displayMode: 'textarea' },
    }),
    
    updatedAt: timestamp({
      defaultValue: { kind: 'now' },
      db: { updatedAt: true },
    }),
  },
  ui: {
    label: 'Réservations de crédit',
    description: 'Gestion des réservations de crédit clients',
  },
});

export default CreditReservation;
