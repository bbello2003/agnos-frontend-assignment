# Agnos Frontend Developer Assignment

A responsive, real-time patient input form and staff monitoring system built with Next.js and Supabase Realtime.

## Overview

This project was developed as part of the Agnos Frontend Developer Candidate Assignment.

## Live Demo

**Deployed Application:**
https://agnos-frontend-assignment-ten.vercel.app/

## Features

- Patient information form with required and optional fields
- Real-time patient updates in the staff view
- Patient activity states: Active, Inactive, and Submitted
- Form validation with field-level error messages
- International phone number input with country selection
- Country and language options loaded from an external API
- Responsive layout for mobile, tablet, and desktop screens
- Stale realtime events are ignored to prevent older data overwriting newer data
- Reset event clears the staff view when a new patient starts the form

## Tech Stack

- Next.js 16 with App Router
- React 19 and TypeScript
- Tailwind CSS
- React Hook Form and Zod
- Supabase Realtime Broadcast
- `react-phone-number-input`
- Vercel

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- A Supabase project with Realtime enabled

### Installation

```bash
npm install
```

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev       # Start the development server
npm run lint      # Run ESLint
npx tsc --noEmit  # Run TypeScript checking
npm run build     # Create a production build
npm run start     # Start the production server
```

## Usage

1. Open `/patient` in one browser or device.
2. Open `/staff` in another browser or device.
3. Enter patient information in the patient form.
4. The staff view receives the form data through Supabase Realtime.
5. The staff status changes based on the latest patient activity.
6. Submitting the form changes the status to Submitted.

Both pages must use the same Supabase environment variables and realtime channel.

## Project Structure

```text
app/
	layout.tsx              Root layout, metadata, viewport, and global styles
	page.tsx                Home page with links to both interfaces
	globals.css             Global and form styling
	patient/page.tsx        Patient form route
	staff/page.tsx          Staff monitoring route

components/
	patient/PatientForm.tsx Patient form, validation, and realtime publishing
	staff/StaffView.tsx     Staff realtime subscription and patient display

lib/
	realtime.ts             Shared channel and event names
	supabase.ts             Supabase client setup
	validation.ts           Zod patient form schema

types/
	patient.ts              Patient data type
	country.ts              Country API response type
	language.ts             Language API response type
```

## Component Architecture

### PatientForm

`PatientForm` owns the patient form state using React Hook Form. It renders all patient fields, applies the Zod resolver, loads country and language options, and publishes realtime events through Supabase.

The form sends an `active` update when a patient changes a field. On submit, it sends a `submitted` update. When the form connects, it sends a reset event so the staff view does not display stale information from a previous session.

### StaffView

`StaffView` subscribes to the shared Supabase Broadcast channel. It displays every patient field and derives the patient status from incoming events. If no update is received for five seconds, an active patient becomes inactive. Submitted patients remain submitted.

## Real-time Synchronization Flow

```text
   PatientForm
		|
		| Supabase Broadcast: patient-update
		| payload: patient, status, updatedAt
		v
Supabase Realtime Channel: patient-room
		|
		v
    StaffView
		|
		| Update patient details and status
		v
Staff interface
```

The application uses these shared identifiers:

- `patient-update`: publishes patient data and status
- `patient-reset`: clears the current patient data
- `patient-room`: shared realtime channel name

Each update includes an ISO timestamp. `StaffView` compares it with the latest received timestamp and ignores older events that arrive late.

## Design Decisions

- The patient form uses a single-column layout on small screens and a two-column grid for suitable fields on larger screens.
- Field labels and validation messages remain visible for accessibility and quick scanning.
- Form controls use stable heights and widths to avoid layout shifts across browsers.
- The staff view uses compact information fields and a visible status indicator so staff can scan updates quickly.

## Deployment

The application is deployed on Vercel.

The following environment variables are required:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

## Notes

- This project uses Supabase Realtime Broadcast and does not persist patient data in a database.
- Country and language lists are loaded from `countries.dev` at runtime.