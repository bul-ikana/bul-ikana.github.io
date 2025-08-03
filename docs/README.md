# BOOL - Interactive Hexagon Grid

An interactive one-page website featuring a tessellated hexagonal background where each hexagon is a 3D element that rotates based on cursor proximity. The site includes smooth dark/light mode theme switching with 0.75-second transitions.

## Features

- **Interactive 3D Hexagon Grid**: Mouse-responsive hexagons with subtle rotation and floating animations
- **Smooth Theme Switching**: Click anywhere to toggle between dark and light modes with coordinated 0.75s transitions
- **Modern Tech Stack**: Built with React, Three.js, TypeScript, and Tailwind CSS
- **Optimized Performance**: Instanced rendering and efficient update patterns for smooth 60fps

## Deployment

This is the production build optimized for GitHub Pages deployment.

## Theme System

- **Dark Mode** (default): Black background with medium grey hexagons
- **Light Mode**: White background with white hexagons and enhanced lighting
- **Smooth Transitions**: All elements (background, hexagons, lighting, UI) transition together in 0.75 seconds

## Architecture

- React Three Fiber for declarative 3D scene management
- Custom lighting system with smooth interpolation
- Zustand for lightweight state management
- Responsive design with mobile support