// Configuration des schémas pour l'application Kredika
// Ce fichier importe et exporte tous les schémas de l'application

import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { relationship, text, select, timestamp } from '@keystone-6/core/fields';

// Types générés par Keystone
type Lists = any; // Type temporaire pour éviter l'erreur de compilation

// Import des schémas
import User from './schema/User';
import Product from './schema/Product';
import Order from './schema/Order';
import OrderItem from './schema/OrderItem';
import CreditReservation from './schema/CreditReservation';
import Installment from './schema/Installment';
import Customer from './schema/Customer';
import MobileTransaction from './schema/MobileTransaction';
import Seller from './schema/Seller';
import Notification from './schema/Notification';
import PlatformSetting from './schema/PlatformSetting';


export const lists = {
  // Schémas principaux
  User: list(User),
  Product: list(Product),
  Order: list(Order),
  OrderItem: list(OrderItem),
  CreditReservation: list(CreditReservation),
  Installment: list(Installment),
  
  // Nouvelles entités
  Customer: list(Customer),
  MobileTransaction: list(MobileTransaction),
  Seller: list(Seller),
  Notification: list(Notification),
  PlatformSetting: list(PlatformSetting),
} satisfies Lists;
