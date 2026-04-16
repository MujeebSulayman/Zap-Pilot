# Zap Pilot ⚡

An automated yield application designed to remove crypto complexity and enable users to instantly move fiat from local bank accounts into decentralized yield strategies. Powered by **LI.FI Earn** and **LI.FI Composer**.

## Product Vision
- **No Crypto Knowledge Required**: Abstracted wallet provisioning and gasless transactions.
- **Direct NGN On-Ramp**: Deposit securely using stable local bank infrastructure.
- **Top Markets**: Browse LI.FI's curated index of the highest-yielding DeFi protocols.
- **Track & Withdraw**: Real-time portfolio syncing through LI.FI Earn's indexers.

## Tech Stack
- Frontend: Next.js (App Router), TailwindCSS, Zustand, React Query
- Backend: Next.js API Routes (Serverless), Prisma ORM, Node.js
- Database: PostgreSQL
- Integrations: LI.FI Earn API, Composer, Managed Wallet Abstractions

## Local Setup Instructions

1. **Clone and Install**
   ```bash
   git clone <repository>
   cd ZapPilot
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Note: Ensure your `DATABASE_URL` points to an active PostgreSQL database instance. You can run one via Docker or use a service like Supabase.*

3. **Database Configuration**
   Initialize the database schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
   *(Or run `npx prisma migrate dev` if extending migrations.)*

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## LI.FI Integration Setup (Important)

In `services/lifi.service.ts`, we interface directly with `https://li.quest/v1`. 
- Valid `LIFI_API_KEY` is supported but not strictly required for local dev of free endpoints. Add it to `.env` if you experience rate limits.
- The Composer Quote generation uses the `vault.address` correctly as the `toToken` in deposits.

Enjoy auto-yielding without the friction! 🚀
