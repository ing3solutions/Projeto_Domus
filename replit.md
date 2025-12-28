# Domus - SaaS de Gestão de Condomínios

## Overview

Domus is a premium SaaS application for condominium management (gestão de condomínios). The system provides comprehensive tools for building administrators and residents to manage tickets/issues, deadlines, documents, service providers, reservations, deliveries, announcements, and units.

The application follows an "Apple-style" clean design with a forest green and beige/cream color palette. It's built as a full-stack TypeScript application with a React frontend and Express backend, using PostgreSQL with Prisma ORM for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with Vite as the build tool
- **Styling**: Tailwind CSS with custom theme variables defined in `src/styles/theme.css`
- **UI Components**: shadcn/ui component library (Radix UI primitives) located in `src/app/components/ui/`
- **Icons**: Lucide React for consistent iconography
- **State Management**: React useState hooks for local component state
- **Design System**: Custom color palette using CSS variables (`--brand-dark`, `--brand-sidebar`, `--brand-active`, etc.)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Server Location**: `server/src/index.ts`
- **API Pattern**: RESTful endpoints prefixed with `/api/`
- **Port Configuration**: Frontend on port 5000, Backend on port 3001

### Database Layer
- **ORM**: Prisma with PostgreSQL adapter (`@prisma/adapter-pg`)
- **Schema Location**: `prisma/schema.prisma`
- **Generated Client**: `src/generated/prisma/`
- **Connection**: Uses `DATABASE_URL` environment variable

### Data Models
The system includes the following core entities:
- **Condominio**: Multi-tenant main entity (building/complex)
- **User**: Users with roles (ADMIN, SINDICO, MORADOR, PORTEIRO)
- **Chamado**: Tickets/issues with status, priority, and type tracking
- **Evento**: Events and deadlines (assemblies, maintenance, inspections)
- **Documento**: Document management with categories and visibility
- **Prestador**: Service provider contracts
- **Espaco/Reserva**: Common area spaces and reservations
- **Encomenda**: Package/delivery tracking
- **Aviso**: Announcements with priority levels
- **Bloco/Unidade**: Building blocks and units
- **Veiculo/Pet**: Vehicle and pet registration per resident

### Application Modules
1. **Dashboard**: KPI cards and activity feed
2. **Chamados**: Issue/ticket management with filtering
3. **Prazos**: Calendar and deadline tracking
4. **Reservas**: Common area booking system
5. **Encomendas**: Package delivery tracking
6. **Avisos**: Digital announcement board
7. **Unidades**: Building unit and resident census
8. **Documentos**: File manager with folder structure
9. **Prestadores**: Service provider management
10. **Configurações**: Settings and preferences

### Layout Structure
- Fixed header with search and notifications
- Sidebar navigation (desktop) / Bottom navigation (mobile)
- Responsive design with mobile-first approach
- Modal-based forms for create/edit operations

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connected via `DATABASE_URL` environment variable
- **Prisma ORM**: Database client with PostgreSQL adapter

### Authentication
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT-based authentication (prepared but not fully implemented)

### UI Libraries
- **@radix-ui/***: Headless UI components (dialogs, dropdowns, etc.)
- **@mui/material**: Material UI components (supplementary)
- **embla-carousel-react**: Carousel functionality
- **react-day-picker**: Date picker component
- **vaul**: Drawer component
- **cmdk**: Command palette
- **recharts**: Chart visualization

### Development Tools
- **TypeScript**: Type safety throughout the codebase
- **Vite**: Frontend build tool and dev server
- **tsx**: TypeScript execution for server
- **concurrently**: Running frontend and backend simultaneously

## Recent Changes (December 2024)

### New Frontend Modules Added
- **Reservas**: Complete booking system for common areas (salão de festas, churrasqueira, academia) with date selection and status tracking
- **Encomendas**: Package management system for concierge with search, filtering, and delivery status updates
- **Avisos**: Digital announcement board with priority levels (urgente, manutenção, informativo) and CRUD operations
- **Unidades**: Hierarchical view of blocks, units, and residents with vehicle and pet registration

### Navigation Updates
- Sidebar updated with 10 application sections with proper icons
- Mobile bottom navigation includes "Mais" (More) button with expandable menu for all sections
- Responsive design ensures all modules are accessible on all device sizes

### Deployment Configuration
- Configured for autoscale deployment with `npm run build` and `npm run start`