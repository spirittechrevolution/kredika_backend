import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, relationship, select, timestamp } from '@keystone-6/core/fields';

const Customer = list({
  access: allowAll,
  fields: {
    // Référence à l'utilisateur
    user: relationship({
      ref: 'User',
      many: false,
    }),
    
    // Informations personnelles
    firstName: text({ validation: { isRequired: true } }),
    lastName: text({ validation: { isRequired: true } }),
    phone: text({ 
      validation: { isRequired: true },
      isIndexed: 'unique',
    }),
    email: text({
      validation: { isRequired: false },
      isIndexed: 'unique',
    }),
    
    // Adresse
    address: text({
      ui: { 
        itemView: { fieldMode: 'edit' },
        description: 'Adresse complète du client' 
      },
    }),
    
    // Statut
    status: select({
      options: [
        { label: 'Actif', value: 'active' },
        { label: 'Bloqué', value: 'blocked' },
      ],
      defaultValue: 'active',
      ui: { 
        itemView: { fieldMode: 'edit' },
        description: 'Statut du compte client' 
      },
    }),
    
    // Historique crédit (stocké sous forme de texte JSON)
    creditHistory: text({
      ui: { description: 'Historique de crédit du client au format JSON' },
      defaultValue: JSON.stringify({
        totalOrders: 0,
        completedPayments: 0,
        latePayments: 0,
        currentActiveCredits: 0
      }, null, 2)
    }),
    
    // Dates importantes
    registrationDate: timestamp({
      defaultValue: { kind: 'now' },
    }),
    lastOrderDate: timestamp(),
    
    // Relations
    orders: relationship({
      ref: 'Order.customer',
      many: true,
    }),
    creditReservations: relationship({
      ref: 'CreditReservation.customer',
      many: true,
    }),
    
    // Métadonnées
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
    updatedAt: timestamp({
      defaultValue: { kind: 'now' },
      db: { updatedAt: true },
    }),
  },
  ui: {
    label: 'Clients',
    description: 'Gestion des clients de la plateforme',
  },
});

export default Customer;
