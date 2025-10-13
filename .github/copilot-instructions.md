# Kredika Backend — Copilot Instructions

## Project Overview
This is a Keystone 6-based headless backend for the Kredika platform, focused on credit-based product sales, order management, and mobile money integration. The architecture is modular, with each domain entity defined in its own file under `schema/` and composed in `schema.ts`.

## Key Files & Structure
- `keystone.ts`: Main entry, configures database, lists, and session/auth.
- `auth.ts`: Sets up authentication (User/email/password, stateless sessions, initFirstItem for dev only).
- `schema.ts`: Aggregates all entity schemas from `schema/`.
- `schema/`: Contains all domain models (User, Product, Order, CreditReservation, etc.), each as a Keystone list.
- `PlatformSetting.ts`: Centralizes global business rules and feature toggles (credit, mobile money, commissions, notifications).

## Data & Relationships
- **User**: Roles (admin, seller, customer), business info, status, timestamps.
- **Product**: Pricing (cash/credit), seller, commission, installment plans.
- **Order**: Links to customer, seller, items, credit reservations, status, payment method.
- **CreditReservation**: Tied to order/product/customer, tracks payment plan, status, installments.
- **Installment**: Linked to CreditReservation, enforces payment validation via hooks.
- **Customer/Seller**: Reference User, store business/personal info, credit history, commission settings.
- **MobileTransaction**: Handles mobile money payments, links to orders/installments/customers.
- **Notification**: Manages user notifications, channels, status, metadata.

## Developer Workflows
- **Start Dev Server:** `npm run dev` (uses SQLite by default)
- **Build:** `npm run build`
- **Production Start:** `npm run start`
- **Database Provider:** Change in `keystone.ts` (`provider: 'sqlite'` or `'postgresql'`)
- **Auth:** Controlled via `auth.ts` and `keystone.ts` (`isAccessAllowed`)
- **GraphQL API:** Available at `/api/graphql` (default: `http://localhost:3000/api/graphql`)

## Patterns & Conventions
- **Access Control:** Default is `allowAll` for rapid prototyping; tighten for production.
- **Entity Snapshots:** Order, CreditReservation, and OrderItem store snapshots of related data for audit/history.
- **Business Logic:** Use Keystone hooks (e.g., Installment validation, OrderItem resolveInput) for enforcing rules.
- **JSON Fields:** Many business configs (commissions, notification channels/settings) are stored as JSON in text fields for flexibility.
- **Timestamps:** Most entities have `createdAt` and `updatedAt` (auto-managed).
- **UI Customization:** Extensive use of Keystone UI config for admin panel clarity.

## Integration Points
- **Mobile Money:** Configured via `PlatformSetting.mobileMoneyConfig` (Wave, Orange Money).
- **Notifications:** Configurable channels and metadata in `Notification` and `PlatformSetting`.
- **Commission Logic:** Seller and platform commission rates are JSON-configurable.

## Example: Adding a New Entity
1. Create a new file in `schema/` (e.g., `Loan.ts`).
2. Export a Keystone list with fields, relationships, and UI config.
3. Import and add to `lists` in `schema.ts`.

## Cautions
- **Do not use `initFirstItem` in production.** Remove from `auth.ts`.
- **Access control is permissive by default.** Review before deploying.
- **Business rules are often stored as JSON in text fields.** Parse and validate as needed in hooks/services.

---
For more details, see `README.md` and individual schema files. Ask for clarification if any workflow or pattern is unclear.
