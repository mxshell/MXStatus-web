# Technical Documentation

## Overview

**MXStatus** is a React-based web dashboard for monitoring the status of multiple machines, with a focus on GPU, user, and network information. The application is designed for clarity, responsiveness, and a "hacker" aesthetic, using a custom dark theme and modern UI/UX practices.

---

## Technical Design Choices

- **Framework**: Built with React (v17), using functional components and React Hooks for state and effect management.
- **State Management**: Local state is managed via React's `useState` and `useEffect`. LocalStorage is used for persisting user preferences (e.g., refresh interval, view key, display options).
- **Data Fetching**: Uses `axios` for HTTP requests to a backend API, with support for custom server endpoints and view keys.
- **Componentization**: The UI is highly modular, with reusable components for cards, badges, copyable text, and more.
- **Responsiveness**: Layouts and controls are responsive, adapting to mobile and desktop via CSS media queries.
- **Performance**: Includes a loading animation and ensures a minimum loading time for smooth transitions. Auto-refresh is supported with configurable intervals.
- **Accessibility**: Uses semantic HTML and accessible form controls, with focus and hover states for interactive elements.

---

## Main Libraries Used

- **React**: Core UI framework.
- **axios**: For HTTP requests to the backend API.
- **react-sortablejs** and **sortablejs**: (Listed as dependencies, but not directly used in the main code; possibly for future drag-and-drop features.)
- **Bootstrap 5**: Included via CDN for grid and utility classes, but most styling is custom.
- **Google Fonts**: "Source Code Pro" (monospace) and "Inter" (UI font) for a modern, technical look.
- **Testing**: `@testing-library/react`, `@testing-library/jest-dom`, and `@testing-library/user-event` for unit and integration tests.
- **web-vitals**: For measuring and reporting performance metrics.

> **Note:** TailwindCSS is listed as a dependency but is not actually used or configured in the codebase. All styling is custom via CSS.

---

## Styling Choices

- **Custom Theme**: All colors, spacing, and typography are defined via CSS variables in `index.css` (e.g., `--hacker-bg`, `--hacker-text-accent`).
- **Dark Mode**: The default and only theme is a dark, "hacker" style with neon green accents (`#00ff41`), inspired by terminal UIs.
- **Responsive Design**: Extensive use of media queries for font sizes, spacing, and layout adjustments on mobile and desktop.
- **Animations**: Subtle animations for loading, hover, and status indicators (e.g., pulse for online status, animated loading spinner).
- **Touch-Friendly**: Larger touch targets and spacing for mobile usability.
- **Custom Components**: Custom cards, badges, and containers with consistent border radius, shadows, and transitions.
- **Minimal Bootstrap**: Bootstrap is loaded but only lightly used; most layout and style is custom.

---

## Website Component Structure

### Top-Level

- **App.js**: Root component. Renders the main page (`PageMain`) and a footer.

### Main Page (`PageMain.js`)

- **CodeFlowBackground**: Animated code lines in the background for the welcome screen.
- **LoadingAnimation**: Full-screen loading spinner and status.
- **ErrorMessage**: Card for displaying connection or data errors.
- **Control Center**: UI for entering the view key, selecting server, toggling auto-refresh, and hiding offline machines.
- **Servers Grid**: Renders a list of `MachineCard` components, one for each machine.

### Machine Display (`MachineCard.js`)

- **Header**: Shows hostname, online/offline badge, GPU count, and a details toggle.
- **Details Section**: Expands to show:
  - **Last seen** and **uptime** (with copy-to-clipboard).
  - **GPU Information**: Rendered via `GPUv2` (one per GPU).
  - **User Information**: Rendered via `UsersLine` (online/offline users).
  - **IP Addresses**: Rendered via `IP` and `SingleIP` (with copy-to-clipboard).
- **Status Indicators**: Color-coded badges for online/offline, GPU presence, and more.

### Supporting Components

- **GPUv2**: Shows GPU utilization, temperature, memory usage, and model, with color-coded bars and badges.
- **UsersLine**: Lists online and offline users with `UserBadge` for each.
- **UserBadge**: Visual badge for a user, color-coded by online status.
- **CopyableText**: Inline text with click-to-copy and feedback animation.
- **DisplayPercent / DisplayRAM / DisplayTemp**: Utility components for formatting and color-coding percentages, RAM, and temperature.
- **Footer**: Simple, centered copyright.

---

## File Structure (Key Files)

```
mxstatus/
  src/
    App.js
    App.css
    index.js
    index.css
    components/
      PageMain.js
      MachineCard.js
      GPUv2.js
      UsersLine.js
      UserBadge.js
      CopyableText.js
      DisplayPercent.js
      DisplayRAM.js
      DisplayTemp.js
      IP.js
      SingleIP.js
      Footer.js
```

---

## Notable UI/UX Features

- **Animated Welcome Screen**: With code flow background and smooth transitions.
- **Copy-to-Clipboard**: For hostnames, IPs, and other key data.
- **Auto-Refresh**: User-configurable, with persistent settings.
- **Offline Filtering**: Option to hide offline machines for clarity.
- **Mobile-First**: All controls and cards are touch-friendly and responsive.
- **Status Feedback**: Real-time online/offline, GPU, and user status with color and animation.

---

## Summary

MXStatus is a modern, highly-customized React dashboard for machine status monitoring, with a strong focus on UX, clarity, and a distinctive "hacker" aesthetic. The codebase is modular, maintainable, and ready for extension (e.g., more metrics, drag-and-drop, or additional views).

---