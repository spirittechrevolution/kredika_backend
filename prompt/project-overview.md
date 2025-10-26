# Aperçu du Projet Kredika Backend

## 📌 Description Générale
Kredika est une plateforme de gestion de crédit et de vente, construite avec KeystoneJS 6 (basé sur Node.js et TypeScript). L'application permet de gérer des clients, des produits, des commandes, des réservations de crédit et des transactions mobiles.

## 🏗️ Architecture Technique

### Stack Technique
- **Backend**: KeystoneJS 6 (Node.js/TypeScript)
- **Base de données**: PostgreSQL
- **Authentification**: Système d'authentification intégré de Keystone
- **API**: GraphQL (générée automatiquement par Keystone)

### Structure des Dossiers
- `/schema` - Contient les modèles de données
- `/scripts` - Scripts utilitaires (seed, mocks)
- `/migrations` - Fichiers de migration de base de données
- `/prompt` - Documentation et ressources pour les développeurs

## 📊 Modèles de Données Principaux

### Utilisateurs & Rôles
- **User**: Comptes utilisateurs avec rôles (admin, vendeur, client)
- **Seller**: Informations spécifiques aux vendeurs
- **Customer**: Profils clients avec historique de crédit

### Gestion Commerciale
- **Product**: Catalogue des produits
- **Order**: Commandes clients
- **OrderItem**: Articles des commandes

### Gestion de Crédit
- **CreditReservation**: Réservations de crédit
- **Installment**: Échéanciers de paiement
- **MobileTransaction**: Transactions mobiles

### Autres
- **Notification**: Système de notification
- **PlatformSetting**: Paramètres de la plateforme

## 🔄 Points d'API
L'API GraphQL est disponible à l'adresse `/api/graphql` avec une interface GraphiQL à `/api/graphiql`.

## 🔧 Configuration
- **Port**: 4000 (configurable via `.env`)
- **Base de données**: PostgreSQL (configurée dans `keystone.ts`)
- **CORS**: Configuré pour accepter les requêtes depuis plusieurs origines locales (3000, 5173, 5174, 8080)

## 🚀 Démarrage Rapide
1. Installer les dépendances: `npm install`
2. Configurer les variables d'environnement (`.env`)
3. Lancer en mode développement: `npm run dev`
4. Accéder à l'interface d'administration: `http://localhost:4000`

## 📈 Points d'Extension
- Système d'authentification personnalisé
- Intégration avec des passerelles de paiement
- Système de notifications en temps réel
- API REST supplémentaire si nécessaire

## 🔒 Sécurité
- Authentification requise pour les opérations sensibles
- Gestion des sessions sécurisée
- Validation des entrées utilisateur

## 📝 Notes pour les Développeurs
- Toujours utiliser TypeScript pour une meilleure maintenabilité
- Suivre la structure existante pour les nouveaux modèles
- Utiliser les scripts de seed pour les données de test
- Documenter les nouvelles fonctionnalités dans ce fichier
