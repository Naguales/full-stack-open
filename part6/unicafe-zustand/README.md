# Unicafe Zustand

This repository contains the solution for Full Stack Open Part 6 exercise `6.1: Unicafe revisited`.

The application recreates the original Unicafe feedback app from Part 1, but stores the feedback state with Zustand instead of React component state.

## Features

- Collects `good`, `neutral`, and `bad` feedback
- Shows `No feedback given` before any votes are submitted
- Displays the total feedback count
- Displays the average score
- Displays the positive feedback percentage

## State Management

Feedback is stored in the Zustand store defined in [`src/store.js`](src/store.js). The store tracks the three counters and exposes actions for incrementing them.

## Scripts

- `npm run dev` starts the Vite development server
- `npm run build` creates a production build
- `npm run preview` previews the production build locally
- `npm run lint` runs ESLint

## Course Context

This exercise is part of the [Full Stack Open](https://fullstackopen.com/en/) course, Part 6, which introduces state management with Redux and Zustand.
