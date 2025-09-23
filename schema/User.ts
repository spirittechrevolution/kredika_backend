import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, password, timestamp, select } from '@keystone-6/core/fields';

const User = list({
  access: allowAll,
  fields: {
    // Informations de base
    name: text({ validation: { isRequired: true } }),
    email: text({
      validation: { isRequired: true },
      isIndexed: 'unique',
    }),
    password: password({ validation: { isRequired: true } }),
    
    // Informations personnelles
    phone: text({
      validation: { isRequired: false },
      isIndexed: 'unique',
    }),
    
    // Rôle de l'utilisateur
    role: select({
      options: [
        { label: 'Administrateur', value: 'admin' },
        { label: 'Vendeur', value: 'seller' },
        { label: 'Client', value: 'customer' },
      ],
      defaultValue: 'customer',
      ui: { displayMode: 'select' },
    }),
    
    // Informations de l'entreprise (pour les vendeurs)
    businessName: text(),
    businessAddress: text({
      ui: { displayMode: 'textarea' },
    }),
    
    // Statut du compte
    isActive: select({
      options: [
        { label: 'Actif', value: 'active' },
        { label: 'Inactif', value: 'inactive' },
        { label: 'Suspendu', value: 'suspended' },
      ],
      defaultValue: 'active',
      ui: { displayMode: 'select' },
    }),
    
    // Métadonnées
    lastLogin: timestamp(),
    createdAt: timestamp({
      defaultValue: { kind: 'now' },
    }),
    updatedAt: timestamp({
      defaultValue: { kind: 'now' },
      db: { updatedAt: true },
    }),
  },
  ui: {
    label: 'Utilisateurs',
    description: 'Gestion des utilisateurs de la plateforme',
  },
});

export default User;
