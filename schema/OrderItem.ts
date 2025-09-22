import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, integer, float, relationship, select } from '@keystone-6/core/fields';

const OrderItem = list({
  access: allowAll,
  ui: {
    isHidden: true, // Masqué de l'interface d'administration principale
  },
  fields: {
    // Référence à la commande parente
    order: relationship({ 
      ref: 'Order.items',
      many: false,
    }),
    
    // Référence au produit
    product: relationship({
      ref: 'Product',
      many: false,
    }),
    
    // Informations sur le produit (snapshot au moment de la commande)
    productName: text({ validation: { isRequired: true } }),
    productImage: text(),
    
    // Informations de prix et quantité
    quantity: integer({ 
      validation: { isRequired: true, min: 1 },
      defaultValue: 1,
    }),
    
    unitPrice: float({ validation: { isRequired: true } }),
    totalPrice: float({ validation: { isRequired: true } }),
    
    // Méthode de paiement pour cet article
    paymentMethod: select({
      options: [
        { label: 'Paiement comptant', value: 'cash' },
        { label: 'Crédit', value: 'credit' },
      ],
      defaultValue: 'cash',
    }),
    
    // Référence au vendeur
    seller: relationship({
      ref: 'User',
      many: false,
    }),
  },
  hooks: {
    resolveInput: async ({ resolvedData, context }) => {
      // Si un produit est sélectionné mais que le nom ou le prix n'est pas encore défini
      if (resolvedData.product) {
        const product = await context.query.Product.findOne({
          where: { id: resolvedData.product.connect.id },
          query: 'name image cashPrice seller { id }',
        });
        
        if (product) {
          // Mettre à jour les informations du produit
          resolvedData.productName = product.name;
          resolvedData.productImage = product.image;
          
          // Définir le vendeur
          if (product.seller) {
            resolvedData.seller = { connect: { id: product.seller.id } };
          }
          
          // Si le prix unitaire n'est pas défini, utiliser le prix de base du produit
          if (!resolvedData.unitPrice) {
            resolvedData.unitPrice = product.cashPrice;
          }
        }
      }
      
      // Calculer le prix total
      if (resolvedData.quantity && resolvedData.unitPrice) {
        resolvedData.totalPrice = resolvedData.quantity * resolvedData.unitPrice;
      }
      
      return resolvedData;
    },
  },
});

export default OrderItem;
