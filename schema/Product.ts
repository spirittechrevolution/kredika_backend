import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, relationship, integer, float, select, timestamp, checkbox } from '@keystone-6/core/fields';

const Product = list({
  access: allowAll,
  fields: {
    // Informations de base
    name: text({ validation: { isRequired: true } }),
    brand: text(),
    model: text(),
    category: text(),
    description: text({ ui: { displayMode: 'textarea' } }),
    image: text(),
    images: text({ isOrderable: true }), // Stockage des URLs d'images
    sku: text({ isIndexed: 'unique' }),
    stock: integer({ defaultValue: 0 }),
    isActive: checkbox({ defaultValue: true }),
    featured: checkbox({ defaultValue: false }),
    
    // Configuration des prix
    cashPrice: float({ validation: { isRequired: true } }),
    currency: text({ defaultValue: 'XOF' }),
    
    // Configuration du crédit
    creditAvailable: checkbox({ defaultValue: false }),
    creditPrice: float(),
    downPayment: float(),
    downPaymentPercentage: integer(),
    
    // Plan de paiement
    installmentPlan: text({ ui: { displayMode: 'textarea' } }), // JSON stringifié pour plus de flexibilité
    
    // Commission vendeur
    vendorCommission: text({ ui: { displayMode: 'textarea' } }), // JSON stringifié
    
    // Référence au vendeur
    seller: relationship({
      ref: 'Seller.products',
      many: false,
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
    label: 'Produits',
    description: 'Gestion des produits disponibles à la vente',
  },
});

export default Product;
