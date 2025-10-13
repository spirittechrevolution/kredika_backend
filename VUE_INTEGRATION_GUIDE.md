# Guide d'intégration Vue.js avec Keystone.js

## Vue d'ensemble

Ce guide vous explique comment connecter votre frontend Vue.js à votre backend Keystone.js pour l'application Kredika.

## Prérequis

- Backend Keystone.js fonctionnel sur `http://localhost:4000`
- Frontend Vue.js (Vue 3 recommandé)
- Node.js et npm installés

## 1. Installation des dépendances

Dans votre projet Vue.js, installez les dépendances nécessaires :

```bash
# Pour GraphQL avec Apollo Client (recommandé)
npm install @apollo/client graphql

# Alternative avec Axios pour les requêtes HTTP simples
npm install axios

# Pour la gestion des cookies et sessions
npm install js-cookie
```

## 2. Configuration Apollo Client

Créez un fichier `apollo-client.js` dans votre projet Vue :

```javascript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

// Configuration de la connexion HTTP
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/api/graphql',
  credentials: 'include' // Important pour les cookies de session
})

// Configuration de l'authentification
const authLink = setContext((_, { headers }) => {
  // Récupérer le token depuis le localStorage si nécessaire
  const token = localStorage.getItem('auth-token')
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
})

// Création du client Apollo
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
})
```

## 3. Configuration dans main.js

Dans votre fichier `main.js` ou `main.ts` :

```javascript
import { createApp } from 'vue'
import { createApolloProvider } from '@vue/apollo-option'
import { apolloClient } from './apollo-client'
import App from './App.vue'

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
})

const app = createApp(App)
app.use(apolloProvider)
app.mount('#app')
```

## 4. Configuration des variables d'environnement

Créez un fichier `.env` dans votre projet Vue :

```env
VUE_APP_API_URL=http://localhost:4000
VUE_APP_GRAPHQL_ENDPOINT=/api/graphql
VUE_APP_ADMIN_URL=http://localhost:4000/admin
```

## 5. Service d'authentification

Créez un service d'authentification `authService.js` :

```javascript
import { gql } from '@apollo/client/core'

export const authService = {
  // Vérifier le statut d'authentification
  async checkAuthStatus(apolloClient) {
    try {
      const result = await apolloClient.query({
        query: gql`
          query GetCurrentUser {
            authenticatedItem {
              ... on User {
                id
                name
                email
                createdAt
              }
            }
          }
        `,
        fetchPolicy: 'network-only'
      })
      
      return result.data.authenticatedItem
    } catch (error) {
      console.log('Utilisateur non connecté')
      return null
    }
  },

  // Connexion
  async signIn(apolloClient, email, password) {
    try {
      const result = await apolloClient.mutate({
        mutation: gql`
          mutation SignIn($email: String!, $password: String!) {
            authenticateUserWithPassword(email: $email, password: $password) {
              ... on UserAuthenticationWithPasswordSuccess {
                sessionToken
                item {
                  id
                  name
                  email
                }
              }
              ... on UserAuthenticationWithPasswordFailure {
                message
              }
            }
          }
        `,
        variables: { email, password }
      })
      
      const authResult = result.data.authenticateUserWithPassword
      
      if (authResult.sessionToken) {
        // Stocker le token si nécessaire
        localStorage.setItem('auth-token', authResult.sessionToken)
        return { success: true, user: authResult.item }
      } else {
        return { success: false, error: authResult.message }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Déconnexion
  async signOut(apolloClient) {
    try {
      await apolloClient.mutate({
        mutation: gql`
          mutation SignOut {
            endSession
          }
        `
      })
      
      localStorage.removeItem('auth-token')
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
```

## 6. Composable Vue 3 pour l'authentification

Créez un composable `useAuth.js` :

```javascript
import { ref, computed } from 'vue'
import { apolloClient } from '../apollo-client'
import { authService } from '../services/authService'

export function useAuth() {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)

  const checkAuth = async () => {
    loading.value = true
    try {
      user.value = await authService.checkAuthStatus(apolloClient)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email, password) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await authService.signIn(apolloClient, email, password)
      
      if (result.success) {
        user.value = result.user
        return { success: true }
      } else {
        error.value = result.error
        return { success: false, error: result.error }
      }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    
    try {
      const result = await authService.signOut(apolloClient)
      
      if (result.success) {
        user.value = null
        return { success: true }
      } else {
        error.value = result.error
        return { success: false, error: result.error }
      }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    checkAuth,
    signIn,
    signOut
  }
}
```

## 7. Exemple d'utilisation dans un composant

```vue
<template>
  <div>
    <div v-if="loading">Chargement...</div>
    
    <div v-else-if="isAuthenticated">
      <h2>Bienvenue, {{ user.name }}!</h2>
      <button @click="signOut">Se déconnecter</button>
    </div>
    
    <div v-else>
      <form @submit.prevent="handleSignIn">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Mot de passe" required />
        <button type="submit" :disabled="loading">Se connecter</button>
      </form>
      
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'AuthExample',
  setup() {
    const { user, loading, error, isAuthenticated, checkAuth, signIn, signOut } = useAuth()
    const email = ref('')
    const password = ref('')

    onMounted(() => {
      checkAuth()
    })

    const handleSignIn = async () => {
      const result = await signIn(email.value, password.value)
      if (result.success) {
        email.value = ''
        password.value = ''
      }
    }

    return {
      user,
      loading,
      error,
      isAuthenticated,
      email,
      password,
      handleSignIn,
      signOut
    }
  }
}
</script>
```

## 8. Configuration CORS côté backend

Assurez-vous que votre `keystone.ts` est configuré correctement :

```typescript
export default withAuth(
  config({
    // ... autres configurations
    server: {
      port: 4000,
      cors: {
        origin: [
          'http://localhost:5173', // Vite
          'http://localhost:8080', // Vue CLI
          'http://localhost:3000', // Autre port
        ],
        credentials: true, // Important pour les cookies
      },
    },
    // ... reste de la configuration
  })
)
```

## 9. Gestion des erreurs

Créez un composable pour la gestion des erreurs `useErrorHandler.js` :

```javascript
import { ref } from 'vue'

export function useErrorHandler() {
  const error = ref(null)
  const isLoading = ref(false)

  const handleError = (err) => {
    console.error('Erreur:', err)
    error.value = err.message || 'Une erreur est survenue'
  }

  const clearError = () => {
    error.value = null
  }

  const executeWithErrorHandling = async (asyncFunction) => {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await asyncFunction()
      return result
    } catch (err) {
      handleError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    error,
    isLoading,
    handleError,
    clearError,
    executeWithErrorHandling
  }
}
```

## 10. Tests de connexion

Pour tester la connexion :

1. **Démarrer le backend Keystone.js** :
   ```bash
   npm run dev
   ```

2. **Démarrer le frontend Vue.js** :
   ```bash
   npm run serve
   # ou
   npm run dev
   ```

3. **Vérifier la connexion** :
   - Ouvrir `http://localhost:4000/admin` pour l'interface d'administration
   - Ouvrir `http://localhost:4000/api/graphql` pour tester GraphQL
   - Vérifier que votre application Vue.js peut faire des requêtes

## 11. Débogage

### Outils de débogage GraphQL

1. **GraphQL Playground** : `http://localhost:4000/api/graphql`
2. **Apollo Client DevTools** : Extension Chrome
3. **Console du navigateur** : Vérifier les erreurs réseau

### Problèmes courants

1. **CORS** : Vérifiez que l'URL de votre frontend est dans la liste CORS
2. **Cookies** : Assurez-vous que `credentials: 'include'` est configuré
3. **Ports** : Vérifiez que les ports ne sont pas en conflit
4. **Variables d'environnement** : Vérifiez que les URLs sont correctes

## 12. Déploiement

### Variables d'environnement de production

```env
VUE_APP_API_URL=https://votre-backend.com
VUE_APP_GRAPHQL_ENDPOINT=/api/graphql
```

### Configuration Apollo Client pour la production

```javascript
const httpLink = createHttpLink({
  uri: process.env.VUE_APP_API_URL + process.env.VUE_APP_GRAPHQL_ENDPOINT,
  credentials: 'include'
})
```

## Conclusion

Votre backend Keystone.js est maintenant prêt à être connecté à votre frontend Vue.js. Les fichiers d'exemple fournis vous donnent une base solide pour commencer le développement.

N'hésitez pas à adapter les composants selon vos besoins spécifiques et à étendre les fonctionnalités selon les exigences de votre application Kredika.
