# Source Code to Website Converter

A Next.js application that allows you to convert HTML source code into a functional website preview with the ability to extract and download images.

## Features

- Paste HTML source code and instantly preview the rendered result
- Extract all images from the HTML source
- Select and download images individually or in bulk
- Responsive design that works on desktop and mobile devices
- Sandbox mode for safe script execution in the preview

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Radix UI](https://www.radix-ui.com/) - Headless UI primitives
- [Lucide React](https://lucide.dev/) - Icon library

## Prerequisites

- Node.js 18.x or later
- npm or yarn or pnpm

## Getting Started

### Clone the repository

```bash
git clone https://github.com/yourusername/source-code-converter.git
cd source-code-converter


## Step one Install dependencies

```npm install
# or
yarn install
# or
pnpm Install

## Step two Run Development server 

```npm run dev
# or
yarn dev
# or
pnpm dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Paste your HTML source code into the left textarea
2. Click the "Convert" button
3. View the rendered HTML in the "Preview" tab
4. Switch to the "Images" tab to see all images found in the HTML
5. Select the images you want to download
6. Click "Download Selected" to save the images to your device

## Project Structure

source-code-converter/
├── app/
│   ├── layout.tsx      # Main layout component
│   └── page.tsx        # Home page component
├── components/
│   ├── ui/             # UI components from shadcn/ui
│   └── SourceCodeConverter.tsx  # Main converter component
├── styles/
│   └── globals.css     # Global styles and Tailwind directives
└── lib/
    └── utils.ts        # Utility functions


## Customization

You can customize the UI by modifying the Tailwind theme in `tailwind.config.ts` and the global styles in `styles/globals.css`.

## Deployment

This project can be easily deployed to Vercel: [https://vercel.com/](Vercel)
