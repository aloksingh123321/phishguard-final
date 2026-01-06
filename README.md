# PhishGuard Pro - Enterprise Monolith

## Overview
PhishGuard Pro is an advanced AI-driven phishing detection platform. This repository is configured as a Monolith for Vercel deployment.

## Structure
- **/api**: Python Flask Backend (Serverless Functions)
- **/frontend**: Next.js Frontend
- **vercel.json**: Routing configuration
- **package.json**: Root build orchestrator

## Deployment
This project is designed to be deployed on Vercel with the **Root Directory** set to `.` (default).

### Vercel Settings
- **Root Directory:** `.` (Leave empty)
- **Framework Preset:** Next.js (or Other)
- **Build Command:** `npm run build` (Defined in root package.json)
