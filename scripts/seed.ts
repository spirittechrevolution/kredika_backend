
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // USERS
  const users = [];
  for (let i = 0; i < 3; i++) {
    users.push(await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone: faker.phone.number(),
        role: 'admin',
        businessName: '',
        businessAddress: '',
        isActive: 'active',
      },
    }));
  }
  for (let i = 0; i < 5; i++) {
    users.push(await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone: faker.phone.number(),
        role: 'seller',
        businessName: faker.company.name(),
        businessAddress: faker.location.streetAddress(),
        isActive: 'active',
      },
    }));
  }
  for (let i = 0; i < 10; i++) {
    users.push(await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone: faker.phone.number(),
        role: 'customer',
        businessName: '',
        businessAddress: '',
        isActive: 'active',
      },
    }));
  }

  // SELLERS
  const sellers = [];
  for (let i = 0; i < 5; i++) {
    sellers.push(await prisma.seller.create({
      data: {
        user: { connect: { id: users[3 + i].id } },
        businessName: users[3 + i].businessName,
        contactPerson: users[3 + i].name,
        phone: users[3 + i].phone,
        email: users[3 + i].email,
        businessAddress: users[3 + i].businessAddress,
        bankDetails: faker.finance.accountNumber(),
        status: 'active',
        verified: 'true',
        commissionSettings: JSON.stringify({ commissionRates: { 3: 0.03, 6: 0.05, 12: 0.08 }, paymentSchedule: 'on_completion' }),
      },
    }));
  }

  // CUSTOMERS
  const customers = [];
  for (let i = 0; i < 10; i++) {
    customers.push(await prisma.customer.create({
      data: {
        user: { connect: { id: users[8 + i].id } },
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: users[8 + i].phone,
        email: users[8 + i].email,
        address: faker.location.streetAddress(),
        status: 'active',
        creditHistory: JSON.stringify({ totalOrders: 0, completedPayments: 0, latePayments: 0, currentActiveCredits: 0 }),
      },
    }));
  }

  // PRODUCTS
  const products = [];
  const productSellerUserMap = [];
  for (let i = 0; i < 20; i++) {
    const sellerIdx = faker.number.int({ min: 0, max: sellers.length - 1 });
    const seller = sellers[sellerIdx];
    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        brand: faker.company.name(),
        model: faker.commerce.productMaterial(),
        category: faker.commerce.department(),
        description: faker.commerce.productDescription(),
        image: faker.image.urlPicsumPhotos(),
        images: faker.image.urlPicsumPhotos(),
        sku: faker.string.alphanumeric(10),
        stock: faker.number.int({ min: 10, max: 100 }),
        isActive: true,
        featured: faker.datatype.boolean(),
        cashPrice: faker.number.float({ min: 10000, max: 500000, fractionDigits: 2 }),
        currency: 'XOF',
        creditAvailable: true,
        creditPrice: faker.number.float({ min: 12000, max: 600000, fractionDigits: 2 }),
        downPayment: faker.number.float({ min: 2000, max: 50000, fractionDigits: 2 }),
        downPaymentPercentage: faker.number.int({ min: 10, max: 50 }),
        installmentPlan: JSON.stringify({ months: faker.helpers.arrayElement([3, 6, 12]), monthlyAmount: faker.number.float({ min: 5000, max: 50000, fractionDigits: 2 }) }),
        vendorCommission: JSON.stringify({ rate: faker.number.float({ min: 0.03, max: 0.08, fractionDigits: 2 }) }),
        seller: { connect: { id: seller.id } },
      },
    });
    products.push(product);
    productSellerUserMap.push({ productId: product.id, sellerUserId: seller.userId });
  }

  // ORDERS
  const orders = [];
  for (let i = 0; i < 15; i++) {
    const customer = customers[faker.number.int({ min: 0, max: customers.length - 1 })];
    const seller = sellers[faker.number.int({ min: 0, max: sellers.length - 1 })];
    orders.push(await prisma.order.create({
      data: {
        orderNumber: `KRD-2025-${faker.string.alphanumeric(6).toUpperCase()}`,
        customer: { connect: { id: customer.id } },
        seller: { connect: { id: seller.id } },
        customerInfo: `${customer.firstName} ${customer.lastName}, ${customer.phone}`,
        status: faker.helpers.arrayElement(['pending', 'confirmed', 'reserved', 'completed', 'cancelled']),
        paymentMethod: faker.helpers.arrayElement(['cash', 'credit']),
  totalAmount: faker.number.float({ min: 20000, max: 1000000, fractionDigits: 2 }),
        orderDate: faker.date.past(),
      },
    }));
  }

  // ORDER ITEMS
  const orderItems = [];
  for (const order of orders) {
    const numItems = faker.number.int({ min: 1, max: 5 });
    for (let i = 0; i < numItems; i++) {
      const product = products[faker.number.int({ min: 0, max: products.length - 1 })];
      // Récupérer le sellerUserId à partir de la correspondance
      const sellerUserId = productSellerUserMap.find(m => m.productId === product.id)?.sellerUserId;
      orderItems.push(await prisma.orderItem.create({
        data: {
          order: { connect: { id: order.id } },
          product: { connect: { id: product.id } },
          productName: product.name,
          productImage: product.image,
          quantity: faker.number.int({ min: 1, max: 3 }),
          unitPrice: product.cashPrice,
          totalPrice: product.cashPrice * faker.number.int({ min: 1, max: 3 }),
          paymentMethod: order.paymentMethod,
          seller: sellerUserId ? { connect: { id: sellerUserId } } : undefined,
        },
      }));
    }
  }

  // CREDIT RESERVATIONS
  const creditReservations = [];
  for (let i = 0; i < 10; i++) {
    const order = orders[faker.number.int({ min: 0, max: orders.length - 1 })];
    const product = products[faker.number.int({ min: 0, max: products.length - 1 })];
    const customer = customers[faker.number.int({ min: 0, max: customers.length - 1 })];
    creditReservations.push(await prisma.creditReservation.create({
      data: {
        order: { connect: { id: order.id } },
        product: { connect: { id: product.id } },
        customer: { connect: { id: customer.id } },
        productSnapshot: JSON.stringify(product),
  paymentPlan: JSON.stringify({ months: faker.helpers.arrayElement([3, 6, 12]), monthlyAmount: faker.number.float({ min: 5000, max: 50000, fractionDigits: 2 }) }),
        status: faker.helpers.arrayElement(['reserved', 'active', 'completed', 'defaulted', 'cancelled']),
        reservationDate: faker.date.past(),
      },
    }));
  }

  // INSTALLMENTS
  const installments = [];
  for (const reservation of creditReservations) {
    const numInstallments = faker.helpers.arrayElement([3, 6, 12]);
    for (let i = 1; i <= numInstallments; i++) {
      installments.push(await prisma.installment.create({
        data: {
          creditReservation: { connect: { id: reservation.id } },
          installmentNumber: i,
          dueDate: faker.date.future(),
          amount: faker.number.float({ min: 5000, max: 50000, fractionDigits: 2 }),
          status: faker.helpers.arrayElement(['pending', 'paid', 'late', 'cancelled']),
          paidDate: null,
          paidAmount: null,
          paymentMethod: null,
          transactionReference: faker.string.alphanumeric(12),
          notes: '',
        },
      }));
    }
  }

  // MOBILE TRANSACTIONS
  for (let i = 0; i < 10; i++) {
    const order = orders[faker.number.int({ min: 0, max: orders.length - 1 })];
    const installment = installments[faker.number.int({ min: 0, max: installments.length - 1 })];
    const customer = customers[faker.number.int({ min: 0, max: customers.length - 1 })];
    await prisma.mobileTransaction.create({
      data: {
        order: { connect: { id: order.id } },
        installment: { connect: { id: installment.id } },
        customer: { connect: { id: customer.id } },
        amount: installment.amount,
        currency: 'XOF',
        provider: faker.helpers.arrayElement(['wave', 'orange_money']),
        customerPhone: customer.phone,
        status: faker.helpers.arrayElement(['pending', 'success', 'failed']),
        providerTransactionId: faker.string.alphanumeric(10),
        paymentType: faker.helpers.arrayElement(['down_payment', 'installment', 'full_payment']),
        providerResponse: '{}',
        initiatedAt: faker.date.past(),
        completedAt: null,
      },
    });
  }

  // NOTIFICATIONS
  for (let i = 0; i < 10; i++) {
    const customer = customers[faker.number.int({ min: 0, max: customers.length - 1 })];
    const order = orders[faker.number.int({ min: 0, max: orders.length - 1 })];
    const installment = installments[faker.number.int({ min: 0, max: installments.length - 1 })];
    await prisma.notification.create({
      data: {
        customer: { connect: { id: customer.id } },
        type: faker.helpers.arrayElement(['payment_reminder', 'payment_success', 'product_reserved', 'upcoming_payment', 'late_payment']),
        title: faker.lorem.sentence(),
        message: faker.lorem.paragraph(),
        relatedOrder: { connect: { id: order.id } },
        relatedInstallment: { connect: { id: installment.id } },
        status: faker.helpers.arrayElement(['pending', 'sent', 'failed']),
        channels: JSON.stringify({ sms: true, email: false, push: false }),
        read: faker.helpers.arrayElement(['unread', 'read']),
        scheduledAt: faker.date.future(),
        sentAt: null,
        readAt: null,
        metadata: '{}',
      },
    });
  }

  // PLATFORM SETTING
  await prisma.platformSetting.create({
    data: {
      name: 'Paramètres par défaut',
      isActive: 'true',
      creditEnabled: 'true',
      mobileMoneyEnabled: 'true',
      maxCreditDuration: 12,
      minDownPaymentPercentage: 20,
      platformCommissionRates: JSON.stringify({ 3: 0.03, 6: 0.05, 12: 0.08 }),
      reservationExpiryDays: 3,
      maxActiveCreditsPerCustomer: 3,
      mobileMoneyConfig: JSON.stringify({ wave: { enabled: true, merchantId: '', environment: 'sandbox' }, orangeMoney: { enabled: true, merchantId: '', environment: 'sandbox' } }),
      notificationSettings: JSON.stringify({ paymentReminderDays: [1, 3], latePaymentReminderDays: [1, 3, 7], defaultNotificationChannels: ['sms'] }),
      description: 'Paramètres initiaux de la plateforme',
      changeHistory: '[]',
    },
  });

  console.log('Seed terminé avec succès !');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
