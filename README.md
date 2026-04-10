📌 Queue Management System

A real-time queue management system built to simulate how service counters (like in banks, clinics, or government offices) handle customer flow. The system allows admins to control queue progression while customers and display screens receive live updates instantly.

🧠 Overview

This project was created to solve a simple but common problem: organizing and displaying queue numbers efficiently across multiple service windows.

It includes three main views:

Admin Panel – controls the queue and manages service windows
Customer View – shows the current number being served
TV Display – a large-screen version for public viewing

All updates are synchronized in real-time using WebSockets.

⚙️ Features
Real-time queue updates across multiple screens
Admin authentication with session persistence
Dynamic window management (add/remove service windows)
Reset functionality with proper idle state (--)
Responsive UI for desktop and mobile
Clean, centered layout with modern styling
Separate routes for Admin, Customer, and Display views
🔧 Tech Stack
Frontend: React
Backend: Node.js + Express
Realtime: Socket.IO
Deployment: Vercel (frontend)
🚀 How It Works
Admin triggers the next queue number per window
Backend updates the current number and broadcasts it
All connected clients (customer + TV) update instantly
Windows can be dynamically added or removed in real-time
🎯 Purpose

This project demonstrates:

Real-time communication using WebSockets
State synchronization across multiple clients
UI/UX design for operational systems
Handling edge cases like reset states and refresh issues
📈 Future Improvements
Database integration (persistent queue and windows)
Role-based authentication
Multi-branch or multi-location support
Analytics dashboard for queue performance
