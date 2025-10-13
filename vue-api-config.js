// Configuration API pour Vue.js - Connexion avec Keystone.js
// Ce fichier contient la configuration pour connecter votre frontend Vue.js au backend Keystone.js

// Configuration de base
const API_CONFIG = {
  // URL de votre backend Keystone.js
  baseURL: 'http://localhost:4000',
  
  // Endpoints GraphQL
  graphqlEndpoint: '/api/graphql',
  
  // Configuration pour les requêtes HTTP
  headers: {
    'Content-Type': 'application/json',
  },
  
  // Configuration pour les cookies (si vous utilisez l'authentification)
  withCredentials: true,
}

// Configuration pour Apollo Client (recommandé pour GraphQL)
export const apolloConfig = {
  uri: `${API_CONFIG.baseURL}${API_CONFIG.graphqlEndpoint}`,
  credentials: 'include', // Pour inclure les cookies de session
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
}

// Configuration pour Axios (alternative pour les requêtes HTTP simples)
export const axiosConfig = {
  baseURL: API_CONFIG.baseURL,
  withCredentials: API_CONFIG.withCredentials,
  headers: API_CONFIG.headers,
}

// Fonctions utilitaires pour l'authentification
export const authUtils = {
  // URL pour la connexion
  signInUrl: `${API_CONFIG.baseURL}/api/auth/signin`,
  
  // URL pour la déconnexion
  signOutUrl: `${API_CONFIG.baseURL}/api/auth/signout`,
  
  // Fonction pour vérifier si l'utilisateur est connecté
  async checkAuthStatus() {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/api/auth/session`, {
        credentials: 'include',
      })
      return response.ok ? await response.json() : null
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error)
      return null
    }
  },
}

// Exemples de requêtes GraphQL pour vos entités principales
export const graphqlQueries = {
  // Requête pour récupérer tous les utilisateurs
  getUsers: `
    query GetUsers {
      users {
        id
        name
        email
        createdAt
      }
    }
  `,
  
  // Requête pour récupérer tous les produits
  getProducts: `
    query GetProducts {
      products {
        id
        name
        description
        price
        createdAt
      }
    }
  `,
  
  // Requête pour récupérer toutes les commandes
  getOrders: `
    query GetOrders {
      orders {
        id
        totalAmount
        status
        createdAt
        customer {
          id
          name
          email
        }
        items {
          id
          quantity
          product {
            id
            name
            price
          }
        }
      }
    }
  `,
  
  // Requête pour créer un nouvel utilisateur
  createUser: `
    mutation CreateUser($data: UserCreateInput!) {
      createUser(data: $data) {
        id
        name
        email
        createdAt
      }
    }
  `,
  
  // Requête pour créer un nouveau produit
  createProduct: `
    mutation CreateProduct($data: ProductCreateInput!) {
      createProduct(data: $data) {
        id
        name
        description
        price
        createdAt
      }
    }
  `,
}

export default API_CONFIG
