# 🪐 Track and Crack: Zero-Gravity Astronaut Health Telemetry

A futuristic health tracking application built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. Designed around the physiology of deep-space orbital missions, it monitors biometrics, circadian sleep, osmotic hydration, and neuro-vestibular stress with a dynamic, gamified **Gravity Score ($G$-Score)**.

---

## 🌟 Key Features

1. **Orbital Mission HUD (`/`):**
   - Central holographic Gravity Score reactor gauge with real-time rotational vector arcs.
   - 4-Quadrant live biometric cards: Cardiac ECG pulse waveform, 16x Solar Circadian Hypnogram, Osmotic Hydration (+250mL / +500mL quick boluses), and Neuro-Vestibular (SAS) stress meter.
   - Interactive Biometric Tuner drawer to simulate astronaut physiological changes in real time.
   - Guided 4-7-8 orbital decompression box breathing modal.
   - Daily "Crack the Void" anti-atrophy missions with kinetic visual shockwave rewards.

2. **Bio-Telemetry Matrix (`/telemetry`):**
   - High-resolution cardiac pulse wave velocity and HRV RMSSD spectrum.
   - Sleep architecture timeline tracking REM/Deep phases across orbital day/night cycles.
   - Cephalic fluid redistribution index monitoring venous pooling in zero-G.
   - ARED mechanical bone loading index with daily tonnage targets.
   - 7-Sol gravitational trajectory log.

3. **Zero-G Training Chamber (`/training`):**
   - ARED simulated gravity squats & deadlifts counter with bone load calculations.
   - **Interactive Saccadic Eye-Tracking Drill:** A browser minigame where cadets tap quantum targeting reticles to reset inner-ear otolith disorientation and measure reaction latency.
   - EVA Cardio Thrusters (Zone 2/5 aerobic endurance timer).

4. **Station Crew Fleet Telemetry (`/crew`):**
   - Live roster of station specialists (Commander Vance, Dr. Romanov, Specialist Chen, Cadet Lin).
   - ISS-7 Station Deconditioning Shield health bar.
   - Co-op orbital survival streak counter and interactive morale/hydration pings.

5. **HALO-9 AI Flight Surgeon (`/doctor`):**
   - Autonomous AI medical assistant that diagnoses live biometrics and prescribes anti-atrophy regimens.
   - 1-click diagnostic chips and conversational aerospace medicine chat.

6. **Cadet Induction Protocol (`/onboarding`):**
   - 4-step scripted onboarding flow with airlock depressurization, biosensor pairing handshake, callsign dossier configuration, and first "Crack" countermeasure routine.

---

## 🚀 Getting Started

### Local Development
```bash
# Install dependencies (already installed)
npm install

# Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Launch
```bash
# Compile optimized production build
npm run build

# Start production server
npm start
```

---

## 🌐 One-Click Deployments

### Deploy to Vercel
1. Push this repository to GitHub / GitLab / Bitbucket.
2. Go to [Vercel](https://vercel.com/new).
3. Select your repository. Next.js 14 settings are auto-detected.
4. Click **Deploy**!

### Deploy to Netlify
1. Go to [Netlify](https://app.netlify.com/).
2. Select your repository.
3. Build command: `npm run build`
4. Publish directory: `.next`

### Deploy with Docker
```dockerfile
FROM node:18-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```
