// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from '@keystone-6/core'

// to keep this file tidy, we define our schema in a different file
import { lists } from './schema'

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from './auth'

export default withAuth(
  config({
    db: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL || 'postgresql://postgres:admin@localhost:5555/keystone_db',
    },
    server: {
      port: 4000, // Port Keystone (adapter selon besoin)
      cors: {
        origin: [
          'http://localhost:5173', // Port par défaut de Vite/Vue
          'http://localhost:5174', // Port alternatif Vite/Vue
          'http://localhost:8080', // Port classique Vue CLI
          'http://localhost:3000', // Port de ton front actuel
        ],
        credentials: true,
      },
    },
    lists,
    session,
  })
)
