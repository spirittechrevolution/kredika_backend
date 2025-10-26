import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🧹 Starting database cleanup...');

    // Nettoyer dans l'ordre inverse des dépendances (respecter les clés étrangères)
    console.log('🗑️  Deleting notifications...');
    await prisma.notification.deleteMany({});

    console.log('🗑️  Deleting mobile transactions...');
    await prisma.mobileTransaction.deleteMany({});

    console.log('🗑️  Deleting installments...');
    await prisma.installment.deleteMany({});

    console.log('🗑️  Deleting credit reservations...');
    await prisma.creditReservation.deleteMany({});

    console.log('🗑️  Deleting order items...');
    await prisma.orderItem.deleteMany({});

    console.log('🗑️  Deleting orders...');
    await prisma.order.deleteMany({});

    console.log('🗑️  Deleting products...');
    await prisma.product.deleteMany({});

    console.log('🗑️  Deleting customers...');
    await prisma.customer.deleteMany({});

    console.log('🗑️  Deleting sellers...');
    await prisma.seller.deleteMany({});

    console.log('🗑️  Deleting platform settings...');
    await prisma.platformSetting.deleteMany({});

    console.log('🗑️  Deleting users...');
    await prisma.user.deleteMany({
      where: {
        email: {
          not: 'admin@admin.com'
        }
      }
    });

    console.log('✅ Database cleanup completed successfully!');
    console.log('💡 Admin user (admin@admin.com) has been preserved.');
    console.log('💡 You can now run "npm run seed" to populate the database with fresh data.');

  } catch (error) {
    console.error('❌ Error during database cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
