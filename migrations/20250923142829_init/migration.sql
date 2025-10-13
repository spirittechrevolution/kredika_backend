-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "role" TEXT DEFAULT 'customer',
    "businessName" TEXT NOT NULL DEFAULT '',
    "businessAddress" TEXT NOT NULL DEFAULT '',
    "isActive" TEXT DEFAULT 'active',
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "brand" TEXT NOT NULL DEFAULT '',
    "model" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "image" TEXT NOT NULL DEFAULT '',
    "images" TEXT NOT NULL DEFAULT '',
    "sku" TEXT NOT NULL DEFAULT '',
    "stock" INTEGER DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "cashPrice" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XOF',
    "creditAvailable" BOOLEAN NOT NULL DEFAULT false,
    "creditPrice" DOUBLE PRECISION,
    "downPayment" DOUBLE PRECISION,
    "downPaymentPercentage" INTEGER,
    "installmentPlan" TEXT NOT NULL DEFAULT '',
    "vendorCommission" TEXT NOT NULL DEFAULT '',
    "seller" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL DEFAULT 'KRD-2025-JMNP8O',
    "customer" TEXT,
    "seller" TEXT,
    "customerInfo" TEXT NOT NULL DEFAULT '',
    "status" TEXT DEFAULT 'pending',
    "paymentMethod" TEXT DEFAULT 'cash',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "orderDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "order" TEXT,
    "product" TEXT,
    "productName" TEXT NOT NULL DEFAULT '',
    "productImage" TEXT NOT NULL DEFAULT '',
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT DEFAULT 'cash',
    "seller" TEXT,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditReservation" (
    "id" TEXT NOT NULL,
    "order" TEXT,
    "product" TEXT,
    "customer" TEXT,
    "productSnapshot" TEXT NOT NULL DEFAULT '',
    "paymentPlan" TEXT NOT NULL DEFAULT '',
    "status" TEXT DEFAULT 'reserved',
    "reservationDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "firstPaymentDate" TIMESTAMP(3),
    "expectedCompletionDate" TIMESTAMP(3),
    "actualCompletionDate" TIMESTAMP(3),
    "notes" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Installment" (
    "id" TEXT NOT NULL,
    "creditReservation" TEXT,
    "installmentNumber" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT DEFAULT 'pending',
    "paidDate" TIMESTAMP(3),
    "paidAmount" DOUBLE PRECISION,
    "paymentMethod" TEXT,
    "transactionReference" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Installment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "user" TEXT,
    "firstName" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "status" TEXT DEFAULT 'active',
    "creditHistory" TEXT NOT NULL DEFAULT '{
  "totalOrders": 0,
  "completedPayments": 0,
  "latePayments": 0,
  "currentActiveCredits": 0
}',
    "registrationDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "lastOrderDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobileTransaction" (
    "id" TEXT NOT NULL,
    "order" TEXT,
    "installment" TEXT,
    "customer" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XOF',
    "provider" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL DEFAULT '',
    "status" TEXT DEFAULT 'pending',
    "providerTransactionId" TEXT NOT NULL DEFAULT '',
    "paymentType" TEXT NOT NULL,
    "providerResponse" TEXT NOT NULL DEFAULT '',
    "initiatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MobileTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seller" (
    "id" TEXT NOT NULL,
    "user" TEXT,
    "businessName" TEXT NOT NULL DEFAULT '',
    "contactPerson" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "businessAddress" TEXT NOT NULL DEFAULT '',
    "bankDetails" TEXT NOT NULL DEFAULT '',
    "status" TEXT DEFAULT 'pending',
    "verified" TEXT DEFAULT 'false',
    "commissionSettings" TEXT NOT NULL DEFAULT '{
  "commissionRates": {
    "3": 0.03,
    "6": 0.05,
    "12": 0.08
  },
  "paymentSchedule": "on_completion"
}',
    "registrationDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "customer" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL DEFAULT '',
    "relatedOrder" TEXT,
    "relatedInstallment" TEXT,
    "status" TEXT DEFAULT 'pending',
    "channels" TEXT NOT NULL DEFAULT '{
  "sms": true,
  "email": false,
  "push": false
}',
    "read" TEXT DEFAULT 'unread',
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformSetting" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Paramètres par défaut',
    "isActive" TEXT DEFAULT 'true',
    "creditEnabled" TEXT DEFAULT 'true',
    "mobileMoneyEnabled" TEXT DEFAULT 'true',
    "maxCreditDuration" INTEGER DEFAULT 12,
    "minDownPaymentPercentage" DOUBLE PRECISION DEFAULT 20,
    "platformCommissionRates" TEXT NOT NULL DEFAULT '{
  "3": 0.03,
  "6": 0.05,
  "12": 0.08
}',
    "reservationExpiryDays" INTEGER DEFAULT 3,
    "maxActiveCreditsPerCustomer" INTEGER DEFAULT 3,
    "mobileMoneyConfig" TEXT NOT NULL DEFAULT '{
  "wave": {
    "enabled": true,
    "merchantId": "",
    "environment": "sandbox"
  },
  "orangeMoney": {
    "enabled": true,
    "merchantId": "",
    "environment": "sandbox"
  }
}',
    "notificationSettings" TEXT NOT NULL DEFAULT '{
  "paymentReminderDays": [
    1,
    3
  ],
  "latePaymentReminderDays": [
    1,
    3,
    7
  ],
  "defaultNotificationChannels": [
    "sms"
  ]
}',
    "description" TEXT NOT NULL DEFAULT '',
    "changeHistory" TEXT NOT NULL DEFAULT '[]',
    "lastUpdated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE INDEX "Product_seller_idx" ON "Product"("seller");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_customer_idx" ON "Order"("customer");

-- CreateIndex
CREATE INDEX "Order_seller_idx" ON "Order"("seller");

-- CreateIndex
CREATE INDEX "OrderItem_order_idx" ON "OrderItem"("order");

-- CreateIndex
CREATE INDEX "OrderItem_product_idx" ON "OrderItem"("product");

-- CreateIndex
CREATE INDEX "OrderItem_seller_idx" ON "OrderItem"("seller");

-- CreateIndex
CREATE INDEX "CreditReservation_order_idx" ON "CreditReservation"("order");

-- CreateIndex
CREATE INDEX "CreditReservation_product_idx" ON "CreditReservation"("product");

-- CreateIndex
CREATE INDEX "CreditReservation_customer_idx" ON "CreditReservation"("customer");

-- CreateIndex
CREATE INDEX "Installment_creditReservation_idx" ON "Installment"("creditReservation");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "Customer_user_idx" ON "Customer"("user");

-- CreateIndex
CREATE INDEX "MobileTransaction_order_idx" ON "MobileTransaction"("order");

-- CreateIndex
CREATE INDEX "MobileTransaction_installment_idx" ON "MobileTransaction"("installment");

-- CreateIndex
CREATE INDEX "MobileTransaction_customer_idx" ON "MobileTransaction"("customer");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_email_key" ON "Seller"("email");

-- CreateIndex
CREATE INDEX "Seller_user_idx" ON "Seller"("user");

-- CreateIndex
CREATE INDEX "Notification_customer_idx" ON "Notification"("customer");

-- CreateIndex
CREATE INDEX "Notification_relatedOrder_idx" ON "Notification"("relatedOrder");

-- CreateIndex
CREATE INDEX "Notification_relatedInstallment_idx" ON "Notification"("relatedInstallment");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_seller_fkey" FOREIGN KEY ("seller") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customer_fkey" FOREIGN KEY ("customer") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_seller_fkey" FOREIGN KEY ("seller") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_fkey" FOREIGN KEY ("order") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_product_fkey" FOREIGN KEY ("product") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_seller_fkey" FOREIGN KEY ("seller") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditReservation" ADD CONSTRAINT "CreditReservation_order_fkey" FOREIGN KEY ("order") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditReservation" ADD CONSTRAINT "CreditReservation_product_fkey" FOREIGN KEY ("product") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditReservation" ADD CONSTRAINT "CreditReservation_customer_fkey" FOREIGN KEY ("customer") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Installment" ADD CONSTRAINT "Installment_creditReservation_fkey" FOREIGN KEY ("creditReservation") REFERENCES "CreditReservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobileTransaction" ADD CONSTRAINT "MobileTransaction_order_fkey" FOREIGN KEY ("order") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobileTransaction" ADD CONSTRAINT "MobileTransaction_installment_fkey" FOREIGN KEY ("installment") REFERENCES "Installment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MobileTransaction" ADD CONSTRAINT "MobileTransaction_customer_fkey" FOREIGN KEY ("customer") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_customer_fkey" FOREIGN KEY ("customer") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_relatedOrder_fkey" FOREIGN KEY ("relatedOrder") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_relatedInstallment_fkey" FOREIGN KEY ("relatedInstallment") REFERENCES "Installment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
