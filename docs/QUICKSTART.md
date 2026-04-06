# AetherCore Premium Frontend - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn/pnpm
- A code editor (VS Code recommended)

### Installation

```bash
# Navigate to project directory
cd "/home/direwolfe-x/HACKATON PROJECTS/AUTH0/AetherCore"

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```

The application will be available at: **http://localhost:3000**

---

## 📖 Project Navigation

### Landing Page
- **URL**: `http://localhost:3000`
- **Features**: Hero section, system status grid, feature cards, CTA buttons
- **State**: Public, no authentication required

### Dashboard
- **URL**: `http://localhost:3000/dashboard`
- **Features**: Threat feed, vault status, latency meter, system health
- **State**: Protected (requires authentication)
- **Note**: Use the "Connect via Auth0" button on landing page to authenticate

---

## 🎮 Interactive Elements

### Landing Page
1. **"Next-Gen Security Guardian" Badge** - Informational, no action
2. **"Connect via Auth0" Button** (with shimmer effect) - Click to authenticate
3. **System Status Cards** - Shows live metrics (static demo data)
4. **Feature Cards** - Hover for glow effect
5. **"Start Session" CTA** - Secondary action

### Dashboard
1. **System Status Grid** - 4 metric cards with scan-line animation
2. **Latency Meter** - Animated gauge (shows 34ms baseline)
3. **Vault Status** - Auth0 connection status
4. **Threat Feed** - Scrollable event log with timestamps
5. **Navigation** - Click navbar "Dashboard" link to access

---

## 🎨 Design Features to Explore

### Animations
- Hover any button to see glow effect
- Load dashboard to see staggered entrance animations
- Watch scan-line effect on status cards
- Observe breathing glow on vault status card

### Color Scheme
- **Deep Midnight Background**: #050505
- **Electric Cyan Accents**: #00F0FF
- **Warning Orange**: #FF4D00
- **Subtle Borders**: rgba(255, 255, 255, 0.1)

### Responsive Design
Try resizing your browser window to see:
- Mobile layout (< 640px)
- Tablet layout (640px - 1024px)
- Desktop layout (> 1024px)

---

## 🔧 Development Tips

### Editing Components
- **UI Components**: Edit files in `src/components/ui/`
- **Dashboard**: Edit files in `src/components/dashboard/`
- **Layout**: Edit `src/components/layout/`
- **Styles**: Update `src/styles/globals.css` for global changes

### Hot Reload
Changes will automatically reload in the browser. No restart needed!

### Debugging
- Open browser DevTools (F12)
- Check Console for any warnings/errors
- Use React Developer Tools extension for component inspection

---

## 📊 Demo Data

All demo data is currently **hardcoded** for preview purposes:
- System metrics (latency: 34ms, activity: 98%)
- Threat events (4 mock events with timestamps)
- Vault status (Auth0 connection simulation)
- User data (mock user: "Aether Operator")

To connect real data:
1. Replace mock data in component files
2. Add API calls in `src/lib/`
3. Update hooks to fetch live data

---

## 🔐 Authentication

### Current State
- Real Auth0 session handling via `@auth0/nextjs-auth0`
- Login, callback, logout, and profile routes are wired in the App Router
- The UI reads auth state with `useUser()` through `use-auth-state`

### To Set Up Auth0
1. Follow [docs/AUTH0_SETUP.md](docs/AUTH0_SETUP.md)
2. Create `.env.local` from [.env.example](.env.example)
3. Configure the callback, logout, and web origin URLs in Auth0
4. Start the app and verify `/api/auth/login` and `/api/auth/me`

---

## 📁 File Structure Quick Reference

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable React components
│  ├── ui/           # Atomic UI components
│  ├── dashboard/    # Dashboard-specific components
│  └── layout/       # Layout components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and config
└── styles/          # CSS and animations
```

---

## 🛠️ Available Scripts

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Check TypeScript types
npm run type-check  # (if configured)

# Run ESLint
npm run lint

# Fix linting issues
npm run lint --fix
```

---

## 🎯 Key Components to Explore

### Most Important Files
1. **src/app/page.tsx** - Landing page (hero + features)
2. **src/app/dashboard/page.tsx** - Dashboard (main view)
3. **src/components/layout/navbar.tsx** - Top navigation
4. **src/components/dashboard/system-status-grid.tsx** - Status cards
5. **src/styles/globals.css** - Animations and color variables

### Component Examples
- **GlassCard**: Reusable glass-panel with optional glow
- **GlassButton**: Interactive button with variants
- **LatencyMeter**: Animated gauge component
- **ThreatFeed**: Scrollable event list

---

## ⚡ Performance Notes

- **Fast Loading**: Optimized with Next.js 16
- **Smooth Animations**: GPU-accelerated with Framer Motion
- **Responsive**: Mobile-first design
- **Accessible**: WCAG-compliant contrast ratios

---

## 🌐 Deployment

Ready to deploy to:
- **Vercel** (1-click deployment)
- **Netlify** (via build output)
- **Docker** (containerize for any platform)

```bash
# Deploy to Vercel
vercel deploy

# View deployment
vercel --prod
```

---

## 📞 Troubleshooting

### Port 3000 Already In Use
```bash
# Use different port
npm run dev -- -p 3001
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Hot Reload Not Working
- Check if file is saved
- Hard refresh browser (Ctrl+Shift+R)
- Restart dev server

### TypeScript Errors
- These are normal during development
- Won't prevent build
- Run `npm run build` to validate

---

## 🎓 Learning Resources

### Docs
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev)

### Technologies Used
- **Next.js 16+**: React framework with SSR
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library

---

## ✨ Pro Tips

1. **Customize Colors**: Edit CSS variables in `globals.css`
2. **Add Components**: Create new files in `src/components/ui/`
3. **Modify Layout**: Edit `src/components/layout/navbar.tsx`
4. **Change Animations**: Update keyframes in `globals.css`
5. **Add Pages**: Create new folders in `src/app/`

---

## 📝 Notes

- All icons use `strokeWidth={1.5}` for consistent appearance
- Animations use Framer Motion for smooth performance
- Glassmorphism uses `backdrop-blur-xl` for premium effect
- Color palette is defined in CSS variables for easy customization
- Responsive design uses Tailwind's responsive prefixes (sm:, md:, lg:)

---

**Happy coding! 🚀**

For questions or issues, refer to the PROJECT_SUMMARY.md file for detailed information.
