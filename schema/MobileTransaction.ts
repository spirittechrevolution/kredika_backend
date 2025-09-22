import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, relationship, select, timestamp, float } from '@keystone-6/core/fields';

const MobileTransaction = list({
  access: allowAll,
  fields: {
    // Références
    order: relationship({
      ref: 'Order',
      many: false,
    }),
    
    installment: relationship({
      ref: 'Installment',
      many: false,
    }),
    
    customer: relationship({
      ref: 'Customer',
      many: false,
    }),
    
    // Détails de la transaction
    amount: float({
      validation: { isRequired: true, min: 0 },
    }),
    
    currency: text({
      defaultValue: 'XOF',
    }),
    
    provider: select({
      options: [
        { label: 'Wave', value: 'wave' },
        { label: 'Orange Money', value: 'orange_money' },
      ],
      validation: { isRequired: true },
      ui: { displayMode: 'select' },
    }),
    
    customerPhone: text({
      validation: { isRequired: true },
    }),
    
    // Statut de la transaction
    status: select({
      options: [
        { label: 'En attente', value: 'pending' },
        { label: 'Réussie', value: 'success' },
        { label: 'Échouée', value: 'failed' },
      ],
      defaultValue: 'pending',
      ui: { displayMode: 'select' },
    }),
    
    providerTransactionId: text(),
    
    // Type de paiement
    paymentType: select({
      options: [
        { label: 'Acompte', value: 'down_payment' },
        { label: 'Versement', value: 'installment' },
        { label: 'Paiement complet', value: 'full_payment' },
      ],
      validation: { isRequired: true },
      ui: { displayMode: 'select' },
    }),
    
    // Logs et métadonnées
    providerResponse: text({
      ui: { displayMode: 'textarea' },
    }),
    
    initiatedAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
    
    completedAt: timestamp(),
    
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
    label: 'Transactions Mobile Money',
    description: 'Gestion des transactions de paiement mobile',
  },
});

export default MobileTransaction;
