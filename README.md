# Knowledge Management System

A comprehensive enterprise knowledge management platform built with Next.js, designed to handle large-scale organizational documentation, policies, and procedures.

## Features

### Core Capabilities
- **Role-Based Access Control (RBAC)**: Visitor, Contributor, Steward, Owner, and Admin roles
- **Content Management**: Support for SOPs, Policies, Standards, Job Aids, Forms, FAQs, and more
- **Workflow Management**: Governed publishing with review and approval processes
- **Advanced Search**: Full-text search with metadata facets and filters
- **Content Versioning**: Track changes and manage document lifecycles
- **Analytics Dashboard**: Usage metrics, content coverage, and KPI tracking
- **Mobile Responsive**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: WCAG 2.2 AA compliant

### Information Architecture
- **Domain Organization**: Engineering, Operations, Compliance, Sales, Marketing
- **Content Types**: 11 predefined content types with custom templates
- **Metadata System**: Comprehensive tagging and categorization
- **Cross-References**: Related content linking and dependencies
- **Lifecycle Management**: Draft → Review → Published → Deprecated

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google OAuth credentials (for authentication)

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd knowledge-management-system
npm install
```

### 2. Database Setup

```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb km_system

# Set up Prisma
npx prisma generate
npx prisma db push
```

### 3. Environment Configuration

Copy `.env.local` and update with your settings:

```bash
cp .env.local .env.local
```

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/km_system"

# NextAuth.js
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Architecture

### Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: Tailwind CSS, Headless UI, Heroicons
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation

### Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── (pages)/           # Application pages
├── components/            # React components
│   ├── dashboard/         # Dashboard widgets
│   ├── layout/           # Layout components
│   └── search/           # Search functionality
├── lib/                  # Utility libraries
│   ├── auth.ts           # Authentication config
│   ├── prisma.ts         # Database client
│   ├── rbac.ts           # Role-based access control
│   └── utils.ts          # Helper functions
└── types/                # TypeScript type definitions
```

## Database Schema

The system uses a comprehensive database schema supporting:

- **Users**: Authentication and role management
- **Content**: Documents with full metadata
- **Domains**: Organizational structure
- **Workflow**: Review and approval processes
- **Analytics**: Usage tracking and metrics
- **Audit**: Complete change logging

### Key Models

- `User` - User accounts with roles
- `Content` - Main content items (SOPs, Policies, etc.)
- `Domain` - Organizational domains
- `ReviewTask` - Workflow approvals
- `ContentVersion` - Version history
- `Tag` - Content categorization
- `AuditLog` - Change tracking

## User Roles & Permissions

### Role Hierarchy
1. **Visitor** - Read access to public/internal content
2. **Contributor** - Create and edit own content
3. **Steward** - Approve content, manage domain
4. **Owner** - System configuration, user management
5. **Admin** - Full system access

### Permission Matrix
- Content creation: Contributor+
- Content approval: Steward+
- User management: Admin only
- Analytics access: Steward+
- System configuration: Owner+

## Content Types

The system supports 11 predefined content types:

1. **SOP** - Standard Operating Procedures
2. **Policy** - Organizational policies
3. **Standard** - Technical/quality standards
4. **Work Instruction** - Detailed procedures
5. **Job Aid** - Quick reference materials
6. **Form/Template** - Reusable forms
7. **FAQ** - Frequently asked questions
8. **Tech Note** - Technical documentation
9. **Release Notes** - Change announcements
10. **Decision Log** - Decision records
11. **Dashboard** - Embedded analytics

## Workflow System

### Publishing Workflow
1. **Draft** - Author creates content
2. **Review** - Assigned to domain steward
3. **Approval** - Steward approves/rejects
4. **Published** - Live and searchable
5. **Scheduled Review** - Automatic review reminders
6. **Deprecated** - End-of-life with successor links

### Review Requirements
- Policy/SOP: Dual approval (Steward + Compliance)
- Standard documents: Single steward approval
- Emergency publish: 24-hour retrospective review

## Search & Discovery

### Search Features
- Full-text search across all content
- Metadata facet filtering
- Saved search queries
- Auto-suggestions and synonyms
- People search integration

### Facet Filters
- Domain (Engineering, Operations, etc.)
- Content Type (SOP, Policy, etc.)
- Lifecycle State (Draft, Published, etc.)
- Sensitivity Level (Public, Internal, Restricted)
- Date ranges and review status

## Analytics & KPIs

### Dashboard Metrics
- Content coverage by domain
- Review currency (% up-to-date)
- Search success rates
- User engagement analytics
- Top content and zero-result queries

### Leadership Reporting
- Monthly health reports
- Content lifecycle metrics
- Usage patterns by role
- Time-to-publish analytics

## Development

### Running Tests

```bash
npm run test
npm run test:coverage
```

### Type Checking

```bash
npm run type-check
```

### Database Management

```bash
# Reset database
npx prisma db reset

# View data
npx prisma studio

# Generate new migration
npx prisma migrate dev --name description
```

### Code Quality

```bash
# ESLint
npm run lint
npm run lint:fix

# Format code
npm run format
```

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables (Production)

```env
DATABASE_URL="production-database-url"
NEXTAUTH_SECRET="production-secret"
NEXTAUTH_URL="https://yourdomain.com"
GOOGLE_CLIENT_ID="production-client-id"
GOOGLE_CLIENT_SECRET="production-client-secret"
```

### Docker Deployment

```bash
# Build image
docker build -t knowledge-management .

# Run container
docker run -p 3000:3000 knowledge-management
```

## Security Considerations

- All routes protected by authentication middleware
- Role-based content access controls
- SQL injection protection via Prisma
- XSS protection through React
- CSRF protection via NextAuth.js
- Content sensitivity levels enforced
- Audit logging for all changes

## Performance Targets

- Search results: < 1.5s p95
- Page load: < 2.5s LCP
- Support: 50k+ documents, 10k+ users
- Concurrent reads: 1k+ users

## Contributing

1. Create feature branch from `main`
2. Make changes with tests
3. Run quality checks: `npm run lint && npm run type-check`
4. Submit pull request with description

## License

Enterprise license - Internal use only

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.
