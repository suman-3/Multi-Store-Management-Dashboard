#  Multi Store - one platform to manage dashboard

Built with the Next.js 14 App Router, Firebase, TypeScript, Tailwind & Clerk Auth


## Features

- 🛠️ Complete Dashboard built from scratch in Next.js 14
- 💳  Admin dashboard to manage orders
- 💻 All API endpoint to fetch the data
- 🖥️ File uploads
- 🌟 Clean, modern UI on top of shadcn-ui
- 🔑 Authentication using KindClerk
- ✉️ Beautiful toast notification
- ⌨️ 100% written in TypeScript
- 🎁 ...much more

### Prerequisites

**Node version 18.x.x** or above

### Cloning the repository

```shell
git clone https://github.com/suman-3/Multi-Store-Management-Dashboard.git
```

### Install packages

```shell
npm i
```

### Setup .env file


```js
# clerk configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# firebase configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_api_key
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_api_key
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_api_key
NEXT_PUBLIC_FIREBASE_APP_ID=your_api_key

# to show github star count
GIHUB_REPO_LINK=

```

### Start the app

```shell
npm run dev
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
