import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, relationship, integer, float, select, timestamp } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';

const Order = list({
  access: allowAll,
  fields: {
    // Informations de base
    orderNumber: text({
      isIndexed: 'unique' as const,
      defaultValue: 'KRD-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    }),
    
    // Référence au client
    customer: relationship({
      ref: 'Customer.orders',
      many: false,
    }),
    
    // Référence au vendeur
    seller: relationship({
      ref: 'Seller.orders',
      many: false,
    }),
    
    // Informations du client (snapshot au moment de la commande)
    customerInfo: text({
      ui: { displayMode: 'textarea' },
    }),
    
    // Statut de la commande
    status: select({
      options: [
        { label: 'En attente', value: 'pending' },
        { label: 'Confirmée', value: 'confirmed' },
        { label: 'Réservée', value: 'reserved' },
        { label: 'Terminée', value: 'completed' },
        { label: 'Annulée', value: 'cancelled' },
      ],
      defaultValue: 'pending',
      ui: { displayMode: 'select' },
    }),
    
    // Méthode de paiement
    paymentMethod: select({
      options: [
        { label: 'Paiement comptant', value: 'cash' },
        { label: 'Crédit', value: 'credit' },
      ],
      defaultValue: 'cash',
      ui: { displayMode: 'select' },
    }),
    
    // Montant total
    totalAmount: float({ validation: { isRequired: true } }),
    
    // Articles de la commande
    items: relationship({
      ref: 'OrderItem.order',
      many: true,
      ui: {
        displayMode: 'cards',
        cardFields: ['product', 'quantity', 'unitPrice', 'totalPrice'],
        inlineCreate: { fields: ['product', 'quantity', 'unitPrice'] },
        inlineEdit: { fields: ['quantity', 'unitPrice'] },
      },
    }),
    
    // Réservations de crédit associées
    creditReservations: relationship({
      ref: 'CreditReservation.order',
      many: true,
    }),
    
    // Dates importantes
    orderDate: timestamp({
      defaultValue: { kind: 'now' },
    }),
    updatedAt: timestamp({
      defaultValue: { kind: 'now' },
      db: { updatedAt: true },
    }),
  },
  ui: {
    label: 'Commandes',
    description: 'Gestion des commandes clients',
  },
});

export default Order;
