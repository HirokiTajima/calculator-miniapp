# Calculator MiniApp

A World App MiniApp calculator with World ID wallet authentication.

## Prerequisites

Before running this application, you need to:

1. Create a World App MiniApp at [World Developer Portal](https://developer.worldcoin.org/)
2. Get your `APP_ID` from the portal
3. Create a `.env.local` file in the root directory (see `.env.example`)

## Environment Variables

Create a `.env.local` file with the following variable:

```
NEXT_PUBLIC_APP_ID=your_world_app_id_here
```

Replace `your_world_app_id_here` with your actual World App ID from the developer portal.

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **World ID Wallet Authentication**: Uses MiniKit's `walletAuth` command for secure authentication
- **Device Level Verification**: No Orb verification required
- **Persistent Authentication**: Auth data stored in localStorage for 7 days
- **Scientific Calculator**: Full-featured calculator with trigonometric, logarithmic, and algebraic functions
- **Responsive UI**: Modern, mobile-friendly interface with Tailwind CSS

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
