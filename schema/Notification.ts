import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, relationship, select, timestamp } from '@keystone-6/core/fields';

const Notification = list({
  access: allowAll,
  fields: {
    // Client destinataire
    customer: relationship({
      ref: 'Customer',
      many: false,
    }),
    
    // Type de notification
    type: select({
      options: [
        { label: 'Rappel de paiement', value: 'payment_reminder' },
        { label: 'Paiement réussi', value: 'payment_success' },
        { label: 'Produit réservé', value: 'product_reserved' },
        { label: 'Échéance proche', value: 'upcoming_payment' },
        { label: 'Paiement en retard', value: 'late_payment' },
      ],
      validation: { isRequired: true },
      ui: { displayMode: 'select' },
    }),
    
    // Contenu de la notification
    title: text({ validation: { isRequired: true } }),
    message: text({
      ui: { displayMode: 'textarea' },
      validation: { isRequired: true },
    }),
    
    // Référence à l'élément concerné
    relatedOrder: relationship({
      ref: 'Order',
      many: false,
    }),
    
    relatedInstallment: relationship({
      ref: 'Installment',
      many: false,
    }),
    
    // Statut d'envoi
    status: select({
      options: [
        { label: 'En attente', value: 'pending' },
        { label: 'Envoyée', value: 'sent' },
        { label: 'Échouée', value: 'failed' },
      ],
      defaultValue: 'pending',
      ui: { displayMode: 'select' },
    }),
    
    // Canaux d'envoi (stocké sous forme de texte JSON)
    channels: text({
      ui: { 
        itemView: { fieldMode: 'edit' },
        description: 'Configuration des canaux de notification au format JSON' 
      },
      defaultValue: JSON.stringify({
        sms: true,
        email: false,
        push: false,
      }, null, 2)
    }),
    
    // Suivi de lecture
    read: select({
      options: [
        { label: 'Non lue', value: 'unread' },
        { label: 'Lue', value: 'read' },
      ],
      defaultValue: 'unread',
      ui: { 
        displayMode: 'select',
        itemView: { fieldMode: 'edit' },
        description: 'Statut de lecture de la notification'
      },
    }),
    
    // Dates importantes
    scheduledAt: timestamp(),
    sentAt: timestamp(),
    readAt: timestamp(),
    
    // Métadonnées (stocké sous forme de texte JSON)
    metadata: text({
      ui: { 
        itemView: { fieldMode: 'edit' },
        description: 'Métadonnées supplémentaires au format JSON. Peut contenir des données spécifiques au type de notification.',
        displayMode: 'textarea',
        createView: { fieldMode: 'edit' }
      },
      defaultValue: '{}',
      isFilterable: false,
      isOrderable: false
    }),
    
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
  },
  ui: {
    label: 'Notifications',
    description: 'Gestion des notifications envoyées aux utilisateurs',
  },
});

export default Notification;
