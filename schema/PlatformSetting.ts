import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, integer, float, select, timestamp } from '@keystone-6/core/fields';

const PlatformSetting = list({
  access: allowAll,
  ui: {
    label: 'Paramètres de la plateforme',
    description: 'Configuration globale de la plateforme',
    listView: {
      initialColumns: ['id', 'name', 'isActive'],
      initialSort: { field: 'name', direction: 'ASC' },
    },
  },
  fields: {
    // Identification
    name: text({
      validation: { isRequired: true },
      defaultValue: 'Paramètres par défaut',
    }),
    
    // Activation des fonctionnalités
    isActive: select({
      options: [
        { label: 'Actif', value: 'true' },
        { label: 'Inactif', value: 'false' },
      ],
      defaultValue: 'true',
      ui: { displayMode: 'select' },
    }),
    
    creditEnabled: select({
      options: [
        { label: 'Activé', value: 'true' },
        { label: 'Désactivé', value: 'false' },
      ],
      defaultValue: 'true',
      ui: { displayMode: 'select' },
    }),
    
    mobileMoneyEnabled: select({
      options: [
        { label: 'Activé', value: 'true' },
        { label: 'Désactivé', value: 'false' },
      ],
      defaultValue: 'true',
      ui: { displayMode: 'select' },
    }),
    
    // Paramètres de crédit
    maxCreditDuration: integer({
      defaultValue: 12,
      label: 'Durée maximale de crédit (mois)',
    }),
    
    minDownPaymentPercentage: float({
      defaultValue: 20,
      label: 'Acompte minimum (%)',
      validation: { min: 0, max: 100 },
    }),
    
    // Configuration des commissions (stocké sous forme de texte JSON)
    platformCommissionRates: text({
      ui: { 
        itemView: { fieldMode: 'edit' },
        description: 'Taux de commission par durée de crédit au format JSON' 
      },
      defaultValue: JSON.stringify({
        3: 0.03,   // 3 mois = 3% de commission
        6: 0.05,   // 6 mois = 5%
        12: 0.08   // 12 mois = 8%
      }, null, 2)
    }),
    
    // Paramètres métier
    reservationExpiryDays: integer({
      defaultValue: 3,
      label: 'Jours avant expiration d\'une réservation',
    }),
    
    maxActiveCreditsPerCustomer: integer({
      defaultValue: 3,
      label: 'Nombre maximum de crédits actifs par client',
    }),
    
    // Configuration Mobile Money (stocké sous forme de texte JSON)
    mobileMoneyConfig: text({
      ui: { 
        itemView: { fieldMode: 'edit' },
        description: 'Configuration des services de paiement mobile au format JSON' 
      },
      defaultValue: JSON.stringify({
        wave: {
          enabled: true,
          merchantId: '',
          environment: 'sandbox'
        },
        orangeMoney: {
          enabled: true,
          merchantId: '',
          environment: 'sandbox'
        }
      }, null, 2)
    }),
    
    // Paramètres de notification (stocké sous forme de texte JSON)
    notificationSettings: text({
      ui: { 
        itemView: { fieldMode: 'edit' },
        description: 'Paramètres de notification au format JSON' 
      },
      defaultValue: JSON.stringify({
        paymentReminderDays: [1, 3], // Jours avant échéance pour rappel
        latePaymentReminderDays: [1, 3, 7], // Jours de retard pour relance
        defaultNotificationChannels: ['sms'],
      }, null, 2)
    }),
    
    // Métadonnées
    description: text({
      ui: { 
        itemView: { fieldMode: 'edit' },
        description: 'Description des paramètres' 
      },
    }),
    
    // Historique des modifications (stocké sous forme de texte JSON)
    changeHistory: text({
      ui: { 
        itemView: { fieldMode: 'edit' },
        description: 'Historique des modifications au format JSON' 
      },
      defaultValue: '[]'
    }),
    
    // Dates importantes
    lastUpdated: timestamp({
      defaultValue: { kind: 'now' },
      db: { updatedAt: true },
    }),
    
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
  },
  // Le champ lastUpdated sera mis à jour automatiquement par la base de données
  // grâce à la configuration db: { updatedAt: true } dans le champ
});

export default PlatformSetting;
