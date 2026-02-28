# Digital Twin Dashboard

This repository hosts a **digital twin dashboard prototype** built as a full-stack Next.js application. It provides a web interface for monitoring and interacting with virtual representations of industrial machines and environments.

Users can view real-time telemetry, receive alerts, explore sustainability metrics, and access analytics. The demo combines Supabase for backend data storage and streaming with modern React components powered by TypeScript and Tailwind CSS.

## 📌 Key Features

- **Live telemetry charts** (temperature, vibration, machine status)
- **Alert system** with toast notifications and history
- **3D digital twin scene** preview and mini twin widget
- **Leaderboards & impact counters** for performance tracking
- **Analytics and trends** pages
- **Federation** support (multi-tenant view)
- **Settings panel** for user preferences

The interface is highly modular; components are organized in `components/dashboard` and `components/ui` folders for reuse.

## 🚀 Technologies 

The project uses the following languages/frameworks:

- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
- ![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=white)
- ![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)

## 🗂️ Project Structure

Brief overview of key folders:

- `app/` – Next.js App Router pages.
- `components/` – UI components and dashboard widgets.
- `hooks/` – Custom React hooks.
- `lib/` – Library and utility functions.

## ⚙️ Scripts

```bash
npm install      # Install dependencies
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production build
```

## ⚙️ Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Kumaran2048/Tata-Elxsi-TELIPORT-Prototype-.git
   cd digital-twin-dashboard
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
3. Create a `.env` file based on `.env.example` and configure Supabase keys.
4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.


## 📄 License

Specify license here if any. Feel free to add MIT, Apache, or other open-source license as appropriate.

