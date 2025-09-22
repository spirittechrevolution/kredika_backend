# Kredika MVP - Attributs de Données Simplifiés

## 1. PRODUIT (Product) - Configuration Vendeur

### Informations de Base
 
{
  id: number,
  name: string,
  brand: string,
  model: string,
  category: string,
  description: string,
  image: string,
  images: string[], // galerie d'images
  sellerId: number, // ID du vendeur/fournisseur
  sku: string,
  stock: number,
  isActive: boolean,
  featured: boolean
}
  

### Configuration Prix par le Vendeur
 
{
  // Prix comptant
  cashPrice: number,
  currency: 'XOF',
  
  // Configuration crédit pré-définie par le vendeur
  creditAvailable: boolean,
  creditConfig: {
    // Prix total à crédit (vendeur peut ajuster)
    creditPrice: number, // peut être = cashPrice si pas de surcoût client
    
    // Acompte obligatoire pour sécuriser le produit
    downPayment: number, // montant fixé par le vendeur
    downPaymentPercentage: number, // % du prix pour info
    
    // Plan de paiement pré-configuré
    installmentPlan: {
      duration: number, // nombre de mois (ex: 3, 6, 12)
      installmentCount: number, // nombre de versements
      installmentAmount: number, // montant par versement
      frequency: 'weekly' | 'monthly', // fréquence choisie par vendeur
    },
    
    // Commission cachée côté vendeur (calcul interne)
    vendorCommission: {
      rate: number, // % commission sur le prix
      amount: number, // montant commission calculé
      totalVendorReceives: number // ce que recevra le vendeur
    }
  }
}
  

### Métadonnées Vendeur
 
{
  seller: {
    id: number,
    businessName: string,
    contactPhone: string,
    location: string,
    verifiedSeller: boolean
  },
  
  createdAt: Date,
  updatedAt: Date
}
  

## 2. COMMANDE SIMPLIFÉE (Order)

### Informations de Base
 
{
  id: number,
  orderNumber: string, // KRD-2024-001234
  customerId: number,
  customerInfo: {
    firstName: string,
    lastName: string,
    phone: string,
    email: string | null,
    address: string
  },
  
  status: 'pending' | 'confirmed' | 'reserved' | 'completed' | 'cancelled',
  paymentMethod: 'cash' | 'credit',
  totalAmount: number,
  orderDate: Date
}
  

### Articles Commandés
 
{
  items: [
    {
      productId: number,
      productName: string,
      productImage: string,
      sellerId: number,
      quantity: number,
      unitPrice: number, // prix comptant ou crédit selon choix
      totalPrice: number,
      paymentMethod: 'cash' | 'credit'
    }
  ]
}
  

## 3. RÉSERVATION CRÉDIT (CreditReservation)

### Détails de la Réservation
 
{
  id: number,
  orderId: number,
  productId: number,
  customerId: number,
  
  // Informations produit figées à la commande
  productSnapshot: {
    name: string,
    image: string,
    cashPrice: number,
    creditPrice: number
  },
  
  // Plan de paiement appliqué
  paymentPlan: {
    downPayment: number, // acompte versé
    remainingAmount: number, // montant restant à payer
    installmentAmount: number, // montant par versement
    installmentCount: number, // nombre de versements restants
    frequency: 'weekly' | 'monthly',
    duration: number // en mois
  },
  
  status: 'reserved' | 'active' | 'completed' | 'defaulted' | 'cancelled'
}
  

### Échéancier Simplifié
 
{
  installments: [
    {
      id: number,
      installmentNumber: number, // 1, 2, 3...
      dueDate: Date,
      amount: number,
      status: 'pending' | 'paid' | 'late',
      paidDate: Date | null,
      paidAmount: number,
      paymentMethod: 'cash' | 'wave' | 'orange_money' | null
    }
  ],
  
  // Dates importantes
  reservationDate: Date, // quand le produit a été réservé
  firstPaymentDate: Date, // première échéance
  expectedCompletionDate: Date,
  actualCompletionDate: Date | null
}
  

## 4. CLIENT SIMPLIFIÉ (Customer)

### Informations Essentielles
 
{
  id: number,
  firstName: string,
  lastName: string,
  phone: string, // obligatoire et unique
  email: string | null,
  
  // Adresse simple
  address: {
    street: string,
    neighborhood: string, // quartier
    city: string,
    region: string
  },
  
  // Statut simple
  status: 'active' | 'blocked',
  registrationDate: Date,
  lastOrderDate: Date | null,
  
  // Historique crédit basique
  creditHistory: {
    totalOrders: number,
    completedPayments: number,
    latePayments: number,
    currentActiveCredits: number
  }
}
  

## 5. PAIEMENT MOBILE MONEY (MVP)

### Configuration Mobile Money
 
{
  mobileMoneyConfig: {
    // Wave
    wave: {
      enabled: boolean,
      merchantId: string,
      environment: 'sandbox' | 'production'
    },
    
    // Orange Money
    orangeMoney: {
      enabled: boolean,
      merchantId: string,
      environment: 'sandbox' | 'production'
    }
  }
}
  

### Transaction Mobile Money
 
{
  mobileTransaction: {
    id: number,
    orderId: number,
    installmentId: number | null, // null si acompte
    
    // Détails transaction
    amount: number,
    currency: 'XOF',
    provider: 'wave' | 'orange_money',
    customerPhone: string,
    
    // Statuts simplifiés
    status: 'pending' | 'success' | 'failed',
    providerTransactionId: string | null,
    
    // Dates
    initiatedAt: Date,
    completedAt: Date | null,
    
    // Type de paiement
    paymentType: 'down_payment' | 'installment' | 'full_payment'
  }
}
  

## 6. VENDEUR/FOURNISSEUR (Seller)

### Profil Vendeur
 
{
  id: number,
  businessName: string,
  contactPerson: string,
  phone: string,
  email: string,
  
  // Adresse business
  businessAddress: {
    street: string,
    city: string,
    region: string
  },
  
  // Statut et vérifications
  status: 'active' | 'pending' | 'suspended',
  verified: boolean,
  registrationDate: Date,
  
  // Paramètres de commission
  commissionSettings: {
    // Commission par durée (ce que paiera le vendeur à la plateforme)
    commissionRates: {
      3: 0.03,   // 3 mois = 3% sur le prix du produit
      6: 0.05,   // 6 mois = 5%
      12: 0.08   // 12 mois = 8%
    },
    paymentSchedule: 'immediate' | 'on_completion' // quand prélever la commission
  }
}
  

## 7. TABLEAU DE BORD CLIENT (CustomerDashboard)

### Vue d'ensemble Client
 
{
  customerSummary: {
    customerId: number,
    
    // Commandes en cours
    activeReservations: [
      {
        productName: string,
        productImage: string,
        reservationDate: Date,
        nextPaymentDate: Date,
        nextPaymentAmount: number,
        remainingAmount: number,
        progressPercentage: number
      }
    ],
    
    // Statistiques
    stats: {
      totalProductsReserved: number,
      totalAmountPaid: number,
      totalRemainingAmount: number,
      completedPayments: number,
      upcomingPayments: number
    }
  }
}
  

## 8. CATALOGUE PRODUITS (ProductCatalog)

### Structure d'affichage
 
{
  catalogProduct: {
    id: number,
    name: string,
    brand: string,
    image: string,
    category: string,
    seller: string,
    
    // Prix affichés
    cashPrice: number,
    creditPrice: number | null,
    
    // Si crédit disponible
    creditInfo: {
      available: boolean,
      downPayment: number,
      installmentAmount: number,
      duration: number,
      frequency: string, // "12 versements mensuels"
      description: string // "Payez 50,000 FCFA maintenant, puis 25,000 FCFA/mois"
    } | null,
    
    stock: number,
    featured: boolean
  }
}
  

## 9. NOTIFICATIONS SIMPLES

### Notification Client
 
{
  notification: {
    id: number,
    customerId: number,
    type: 'payment_reminder' | 'payment_success' | 'product_reserved',
    title: string,
    message: string,
    
    // Channels MVP
    sms: boolean, // envoi SMS
    read: boolean,
    
    createdAt: Date,
    sentAt: Date | null
  }
}
  

## 10. CONFIGURATION SYSTÈME MVP

### Paramètres Plateforme
 
{
  platformSettings: {
    // Activation des fonctionnalités
    creditEnabled: boolean,
    mobileMoneyEnabled: boolean,
    
    // Limites MVP
    maxCreditDuration: 12, // mois maximum
    minDownPaymentPercentage: 20, // % minimum d'acompte
    
    // Commission plateforme sur les vendeurs
    platformCommissionRates: {
      3: 0.03,   // Commission plateforme = commission client
      6: 0.05,
      12: 0.08
    },
    
    // Paramètres business
    reservationExpiryDays: 3, // jours pour payer l'acompte
    maxActiveCreditsPerCustomer: 3
  }
}
  

Cette structure MVP simplifie considérablement la gestion tout en gardant l'essentiel :

**✅ Avantages pour le client :**
- Prix transparent (pas de commission visible)
- Plan de paiement clair et fixe
- Processus simple : acompte → réservation → versements

**✅ Avantages pour le vendeur :**
- Configuration facile de ses produits
- Commission calculée automatiquement
- Paiement garanti via la réservation

**✅ Avantages pour la plateforme :**
- Modèle économique clair (commission sur vendeurs)
- Fidélisation client (crédit sans surcoût)
- Simplicité de développement

Cette approche devrait effectivement attirer plus de clients vers le crédit !