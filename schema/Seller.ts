import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, relationship, json, select, timestamp } from '@keystone-6/core/fields';

const Seller = list({
  access: allowAll,
  fields: {
    // Référence à l'utilisateur
    user: relationship({
      ref: 'User',
      many: false,
    }),
    
    // Informations de l'entreprise
    businessName: text({ validation: { isRequired: true } }),
    contactPerson: text({ validation: { isRequired: true } }),
    phone: text({ validation: { isRequired: true } }),
    email: text({ 
      validation: { isRequired: true },
      isIndexed: 'unique',
    }),
    
    // Adresse de l'entreprise
    businessAddress: text({
      ui: { 
        itemView: { fieldMode: 'edit' },
        description: 'Adresse complète de l\'entreprise' 
      },
    }),
    
    // Informations bancaires
    bankDetails: text({
      ui: { 
        itemView: { fieldMode: 'edit' },
        description: 'Détails bancaires de l\'entreprise' 
      },
    }),
    
    // Statut du vendeur
    status: select({
      options: [
        { label: 'Actif', value: 'active' },
        { label: 'En attente', value: 'pending' },
        { label: 'Suspendu', value: 'suspended' },
      ],
      defaultValue: 'pending',
      ui: { displayMode: 'select' },
    }),
    
    verified: select({
      options: [
        { label: 'Vérifié', value: 'true' },
        { label: 'Non vérifié', value: 'false' },
      ],
      defaultValue: 'false',
      ui: { displayMode: 'select' },
    }),
    
    // Paramètres de commission (stocké sous forme de texte JSON)
    commissionSettings: text({
      ui: { 
        itemView: { fieldMode: 'edit' },
        description: 'Paramètres de commission au format JSON' 
      },
      defaultValue: JSON.stringify({
        commissionRates: {
          3: 0.03,   // 3 mois = 3% sur le prix du produit
          6: 0.05,   // 6 mois = 5%
          12: 0.08   // 12 mois = 8%
        },
        paymentSchedule: 'on_completion' // quand prélever la commission
      }, null, 2)
    }),
    
    // Produits du vendeur
    products: relationship({
      ref: 'Product.seller',
      many: true,
    }),
    
    // Commandes associées
    orders: relationship({
      ref: 'Order.seller',
      many: true,
    }),
    
    // Dates importantes
    registrationDate: timestamp({
      defaultValue: { kind: 'now' },
    }),
    
    // Métadonnées
    notes: text({
      ui: { displayMode: 'textarea' },
    }),
    
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
    
    updatedAt: timestamp({
      defaultValue: { kind: 'now' },
      db: { updatedAt: true },
    }),
  },
  ui: {
    label: 'Vendeurs',
    description: 'Gestion des vendeurs et fournisseurs',
  },
});

export default Seller;
