# The Clean Room HVAC Matrix: A Digital Journey Through Precision Engineering

*A Story of How Technology Meets Cleanroom Design*

## Table of Contents
1. [The Beginning: A Digital Cleanroom Revolution](#the-beginning-a-digital-cleanroom-revolution)
2. [The Tools of the Trade: Our Digital Arsenal](#the-tools-of-the-trade-our-digital-arsenal)
3. [The Architecture: Building the Digital Foundation](#the-architecture-building-the-digital-foundation)
4. [The Journey: From Landing to Logout](#the-journey-from-landing-to-logout)
5. [The Magic Behind the Numbers: Mathematical Wizardry](#the-magic-behind-the-numbers-mathematical-wizardry)
6. [The Memory Palace: Where Data Lives](#the-memory-palace-where-data-lives)
7. [The Digital Conversations: How Systems Talk](#the-digital-conversations-how-systems-talk)
8. [The Launch: Taking Flight](#the-launch-taking-flight)
9. [The Workshop: Building Your Own](#the-workshop-building-your-own)

## The Beginning: A Digital Cleanroom Revolution

*Once upon a time, in the world of precision engineering...*

Imagine a world where creating the perfect cleanroom environment was as simple as filling out a digital form. Where complex HVAC calculations that once took engineers weeks to complete could be done in minutes. Where pharmaceutical companies, semiconductor manufacturers, and biotechnology firms could design their critical environments with the precision of a digital maestro.

This is the story of **STERI Clean Air**, a revolutionary platform born from the minds at Arrant Dynamics, a division of Arrant Tech IND, Pvt. Ltd. It's not just an application; it's a digital transformation of how we think about cleanroom design.

### The Quest for Precision

Our heroes set out on a mission to solve the age-old problems of cleanroom design:

**The Challenge**: Traditional cleanroom HVAC design required:
- Weeks of manual calculations
- Complex spreadsheet management
- Multiple software tools that didn't communicate
- Risk of human error in critical calculations
- Difficulty in maintaining compliance standards

**The Solution**: A unified digital platform that brings together:
- **The Digital Form**: A guided, multi-step journey that feels like having an expert consultant by your side
- **The Calculation Engine**: A mathematical wizard that performs complex HVAC calculations in real-time
- **The Standards Library**: Built-in support for international standards (ISO 14644, EU GMP, FDA)
- **The Design Generator**: Automatic Bill of Design (BOD) creation
- **The Memory System**: Secure storage and retrieval of all project data
- **The Export Portal**: Professional reports and specifications at your fingertips

### The Industries We Serve

Our digital platform serves the guardians of precision across multiple realms:

🏭 **The Pharmaceutical Realm**: Where life-saving medicines are crafted in environments so clean, a single particle could spell disaster.

🔬 **The Semiconductor Kingdom**: Where the tiniest components power our digital world, requiring environments cleaner than a surgical suite.

🧬 **The Biotechnology Frontier**: Where scientists push the boundaries of life itself, needing perfect conditions for their experiments.

🏥 **The Medical Device Empire**: Where devices that save lives are manufactured with uncompromising precision.

🚀 **The Aerospace Domain**: Where components must survive the harshest conditions while being built in the cleanest environments.

🍃 **The Food & Beverage Realm**: Where the food we eat is processed in environments that rival pharmaceutical standards.

## The Tools of the Trade: Our Digital Arsenal

*Every great craftsman needs the finest tools...*

Our digital workshop is equipped with the most advanced tools of the modern web, carefully chosen to create an experience that's both powerful and elegant.

### The Frontend Forge: Where User Interfaces Are Born

**The Foundation**: Next.js 15.3.5 - Our React framework is like having a master architect who knows exactly how to build fast, scalable applications. It's the foundation upon which our entire digital castle is built.

**The Interface Builder**: React 19.0.0 - This is our paintbrush, our chisel, our tool for creating interfaces so intuitive that users feel like they're having a conversation with an expert.

**The Type Guardian**: TypeScript 5 - Our vigilant sentinel that ensures every piece of code is perfect before it reaches our users. No errors shall pass!

**The Stylist**: Tailwind CSS 4 - Our design system that makes every pixel perfect, every color harmonious, every layout responsive.

**The Accessibility Champion**: Radix UI - Our commitment to making sure everyone can use our platform, regardless of their abilities.

**The Icon Master**: Lucide React - Our collection of symbols that speak a universal language, guiding users through their journey.

**The Form Wizard**: React Hook Form + Zod - Our dynamic duo that makes form validation feel like magic, catching errors before they happen.

**The Messenger**: React Hot Toast - Our way of whispering helpful messages to users, celebrating their successes and gently guiding them through challenges.

### The Backend Stronghold: Where Logic Lives

**The API Gateway**: Next.js API Routes - Our digital receptionist that welcomes every request and ensures it reaches the right destination.

**The Memory Keeper**: MySQL 2 - Our vast library where every project, every calculation, every piece of data finds its permanent home.

**The Security Guard**: JWT + bcryptjs - Our twin guardians that protect user accounts with military-grade security.

**The Task Master**: Server Actions - Our efficient workers who handle complex operations behind the scenes, never bothering the user with technical details.

### The Workshop Tools: For the Builders

**The Runtime**: Node.js - Our digital workshop where everything comes to life.

**The Package Manager**: pnpm/npm - Our inventory system that keeps track of every tool and dependency.

**The Code Inspector**: ESLint - Our quality control inspector who ensures every line of code meets our high standards.

### The Specialized Instruments

**The Map Navigator**: Leaflet & React Leaflet - Our digital cartographer that helps users pinpoint exact locations for their projects.

**The Data Artist**: Recharts - Our visualization wizard that transforms numbers into beautiful, understandable charts.

**The Global Communicator**: React Phone Number Input - Our international diplomat that handles phone numbers from every corner of the world.

**The Time Keeper**: Date-fns - Our temporal specialist who manages all things time-related.

**The Memory Assistant**: js-cookie - Our helpful assistant who remembers user preferences and keeps them logged in.

## The Architecture: Building the Digital Foundation

*Every great structure needs a solid foundation...*

Our digital castle is built with a modular architecture that's both elegant and functional. Think of it as a well-organized city where each district has its own purpose, yet they all work together harmoniously.

### The Digital City Layout

```
🏰 The Clean Room Digital Kingdom
├── 🏛️  app/                          # The Royal Palace (Next.js App Router)
│   ├── 🌍 (public)/                 # The Public Square (landing page)
│   ├── 🔒 (private)/                # The Inner Sanctum (protected dashboards)
│   ├── 📡 api/                      # The Communication Tower (API endpoints)
│   └── 🎭 layout.tsx                # The Grand Entrance (root layout)
├── 📋 forms/                        # The Workshop District (main application)
│   ├── 🏗️  app/                      # The Construction Site (forms app structure)
│   ├── 🧩 components/               # The Component Factory (reusable UI)
│   ├── 📚 lib/                      # The Knowledge Library (business logic)
│   └── 🖼️  public/                   # The Art Gallery (static assets)
├── 🔧 components/                   # The Tool Shed (shared UI components)
├── ⚡ actions/                      # The Power Station (server actions)
├── 🗄️  lib/                          # The Archive (database utilities)
├── 📝 interfaces/                   # The Blueprint Office (TypeScript types)
└── 🌐 public/                       # The Public Gallery (global assets)
```

### The Architectural Philosophy

**The Modular Kingdom**: Each component is like a specialized craftsman in our digital kingdom. They each have their own expertise, but they work together to create something greater than the sum of their parts.

**The Component Guild**: Our UI components are organized like a medieval guild system:
- **The Master Craftsmen** (`/components/ui/`): The most skilled artisans who create the finest tools
- **The Specialist Artisans** (`/forms/components/`): Experts in specific crafts like form building
- **The Apprentices** (individual components): Learning and growing under the guidance of masters

**The Knowledge Keepers**: Our business logic is carefully organized in libraries (`/lib/` directories) where wisdom is stored and shared.

**The Type Guardians**: TypeScript interfaces act as our digital scribes, ensuring that every piece of data is properly documented and understood.

## The Journey: From Landing to Logout

*Follow our hero's journey through the digital realm...*

Every great adventure begins with a single step. Our users embark on a digital quest to create the perfect cleanroom environment, guided by our intelligent platform every step of the way.

### The Epic Journey Map

```
🌍 The Landing Realm    🔐 The Authentication Gate    🏰 The Dashboard Kingdom
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Welcome,       │───▶│  Prove Your     │───▶│  Your Digital   │
│  Traveler!      │    │  Identity       │    │  Workshop       │
│  (Public)       │    │  (Modal)        │    │  (Protected)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Hero's Tale    │    │  Magic Token    │    │  The Quest      │
│  Features       │    │  Creation       │    │  Begins:        │
│  Testimonials   │    │  Role Assignment│    │  Multi-Step     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │ The Completion  │
                                              │ Celebration:    │
                                              │ Report Export   │
                                              │ Victory Logout  │
                                              └─────────────────┘
```

### Chapter 1: The Welcome Realm - Where Every Journey Begins

**Location**: The Landing Page (`/`)
**Story File**: `app/(public)/page.tsx`

*Our hero arrives at the grand gates of the STERI Clean Air kingdom...*

As our user approaches the digital realm, they are greeted by a magnificent landing page that tells the story of precision engineering. It's not just a website; it's a digital welcome mat that invites them into a world of possibilities.

#### The Grand Entrance Features

**The Hero's Banner**: A stunning display showcasing STERI Clean Air's mission, complete with the Arrant Dynamics logo and a compelling call-to-action that beckons: "Start Your Cleanroom Journey Here!"

**The Arsenal Showcase**: A gallery of our platform's capabilities - like a medieval armory displaying the finest weapons, but these are digital tools for creating perfect environments.

**The Kingdom Tour**: A section dedicated to the industries we serve, each presented as a unique realm with its own challenges and requirements.

**The Testimonials Hall**: Stories from satisfied customers, like epic tales of victory, showcasing how our platform has transformed their cleanroom design processes.

**The Navigation Beacon**: A clear path forward with options to either begin their journey ("Get Started") or return to familiar territory ("Sign In").

#### The Digital Conversations

**The Silent Watchers**: Our landing page doesn't need to make API calls - it's like a friendly innkeeper who simply needs to show you the way. The real magic happens when you decide to venture further.

**The State Keepers**: React hooks quietly manage the modal states, like invisible servants waiting to assist when called upon.

**The Path Finders**: URL parameters act as secret codes that tell our system exactly which door to open when you're ready to proceed.

### Chapter 2: The Authentication Gate - Proving Your Worth

**Story Files**: `app/(public)/_components/login.tsx`, `app/(public)/_components/register.tsx`

*Our hero stands before the great authentication gate, where identity is proven and trust is established...*

#### The Registration Ritual - Becoming a Member of the Guild

**The Sacred Process**:
```
🗝️  The Key Creation Ritual
User Intent → Guardian Check → Magic Spell → Database Quest → Guild Membership
     │              │              │              │              │
     ▼              ▼              ▼              ▼              ▼
New Member → Identity Verify → Password Enchant → Royal Archive → Welcome
```

**The Tale Unfolds**:

1. **The Call to Adventure**: Our hero clicks "Get Started" or "Create Account," signaling their intent to join our digital guild.

2. **The Registration Scroll**: A magical form appears in a floating sheet, ready to capture the essential details of our new member.

3. **The Information Gathering**: Our hero provides their name, email, and creates a secret password - their digital signature.

4. **The Strength Test**: As they type their password, our system provides real-time feedback, like a master craftsman guiding an apprentice. Green checkmarks appear as each requirement is met.

5. **The Sacred Submission**: When ready, our hero submits their information, triggering the `registerUser()` spell.

6. **The Guardian's Check**: Our system first searches the royal archives to ensure no one else has claimed this email address.

7. **The Password Enchantment**: Using the ancient art of bcrypt with 10 salt rounds, we transform their password into an unbreakable magical seal.

8. **The Guild Registration**: A new entry is created in the `user_profiles` table, marking our hero as a new member with "user" privileges.

9. **The Chronicle Entry**: Every action is recorded in the `login_history` scrolls for future reference.

10. **The Welcome Feast**: Success is celebrated with a toast notification, and our hero is guided to the login portal.

**The Magical Backend Conversations**:
- **The Registration Spell**: `actions/users-mysql.ts::registerUser()` - Our master wizard who handles the entire process
- **The Archive Keepers**: MySQL prepared statements ensure no malicious code can breach our defenses
- **The Security Enchanters**: bcryptjs with 10 salt rounds creates passwords so secure that even the most powerful hackers cannot break them
- **The Chronicle Scribes**: Every registration attempt is logged for security and audit purposes

#### Login Process Flow
```
Credentials → Validation → Database Check → JWT Generation → Cookie Storage → Redirect
     │            │             │              │              │              │
     ▼            ▼             ▼              ▼              ▼              ▼
Email/Pass → Zod Schema → User Lookup → Token Sign → Browser → Role-based URL
```

1. User enters email and password
2. **Client Validation**: Zod schema validation for email format and password length
3. **Server Action**: Calls `loginUser` server action
4. **Database Verification**:
   - User lookup: `SELECT * FROM user_profiles WHERE email = ?`
   - Password verification: `bcrypt.compare(password, hashedPassword)`
   - Active status check: `is_active` field validation
5. **JWT Generation**: `jwt.sign({ id, email }, JWT_SECRET, { expiresIn: "1d" })`
6. **Session Management**:
   - Token stored in HTTP-only cookies
   - Role information stored in separate cookie
   - Last login timestamp updated
7. **Login History**: Comprehensive audit logging with IP, user agent, success/failure
8. **Role-based Redirect**:
   - Admin: `/admin/dashboard`
   - User: `/user/dashboard`

**Internal API Usage**:
- **Server Action**: `actions/users-mysql.ts::loginUser()`
- **Database Operations**: User lookup, password verification, login tracking
- **Security**: bcrypt comparison, JWT signing, cookie management
- **Audit Trail**: Complete login attempt logging

#### Logout Process Flow
```
Logout Click → Server Action → Cookie Clearing → Redirect → Notification
     │              │              │              │           │
     ▼              ▼              ▼              ▼           ▼
Button Press → logoutUser() → Remove Tokens → Home Page → Success Toast
```

**File**: `components/ui/logout-button.tsx`
1. User clicks logout button
2. **Server Action**: Calls `logoutUser()` (minimal server-side cleanup)
3. **Client Cleanup**: 
   - Remove JWT token cookie
   - Remove role cookie
   - Clear any cached user data
4. **Navigation**: Redirect to landing page (`/`)
5. **Feedback**: Toast notification confirms successful logout

**Internal API Usage**:
- **Server Action**: `actions/users-mysql.ts::logoutUser()`
- **Cookie Management**: `js-cookie` library for client-side cookie removal
- **State Cleanup**: React state reset and navigation

### 3. User Dashboard Flow
**File**: `app/(private)/user/dashboard/page.tsx`

```
JWT Token → Role Check → Dashboard Access → Form Interface → Step Navigation
     │           │             │               │               │
     ▼           ▼             ▼               ▼               ▼
Auth Header → User Role → Protected Route → Multi-Step → Progress Tracker
```

After successful login, users access their dashboard featuring:
- **Project Header**: STERI Clean Air branding with logout option
- **Form Interface**: Multi-step cleanroom specification form
- **Progress Tracking**: Visual stepper showing current step
- **Data Persistence**: Form data saved between steps

**Internal API Usage**:
- **Authentication Check**: JWT token validation on protected routes
- **Role-based Access**: User vs Admin dashboard routing
- **State Management**: React useState for form data and step tracking
- **Auto-calculation**: Real-time unique ID generation and form validation

### 4. Multi-Step Form Process
**File**: `forms/app/page.tsx`

#### Complete Form Flow Architecture
```
Step 1 → Validation → Step 2 → Validation → Step 3 → Calculations → Submission
   │         │          │         │          │          │            │
   ▼         ▼          ▼         ▼          ▼          ▼            ▼
Customer → Required → Technical → Required → Room → HVAC → Database
  Info      Fields      Specs      Fields    Data   Engine    Storage
```

#### Step 1: Customer & Project Information
**File**: `forms/components/form-step-one.tsx`

**Data Collection Flow**:
```
User Input → Real-time Validation → Auto-generation → Next Step
     │              │                      │              │
     ▼              ▼                      ▼              ▼
Form Fields → Zod Schema → Unique ID → Step 2 Access
```

- Customer name and address
- Branch/unit name
- Project/product name
- **Location Integration**: Map selection with coordinates
- Contact information (phone, email)
- Additional information
- **Auto-generated Unique ID**: Based on customer and project names

**Internal API Usage**:
- **Location Service**: Leaflet map integration for coordinate capture
- **Auto-calculation**: Real-time unique ID generation using customer/project initials
- **Validation**: Zod schema validation for required fields
- **State Management**: React useState for form data persistence

#### Step 2: Technical Specifications
**File**: `forms/components/form-step-two.tsx`

**Specification Flow**:
```
Standards → Classification → System Type → Environmental → Calculations
     │           │              │             │              │
     ▼           ▼              ▼             ▼              ▼
ISO/EU/FDA → ISO 5-9 → HVAC Type → Temp/RH → Auto Values
```

- Standard selection (ISO 14644, EU GMP, FDA)
- Cleanroom classification (ISO 5, ISO 6, etc.)
- System type selection (Air Heating, Air Cooling, Ventilation)
- Temperature and humidity requirements
- **Air Changes Calculation**: Auto-calculated based on classification
- Filter specifications and AHU details
- **Static Pressure**: Auto-calculated from pressure drop selections

**Internal API Usage**:
- **Standards Data**: `forms/lib/standards-data.ts` for classification options
- **Air Changes**: `forms/lib/class-air-charges-data.ts` for auto-calculation
- **Conditional Logic**: System type determines available options
- **Real-time Updates**: Form state updates trigger dependent calculations

#### Step 3: Room Specifications & Calculations
**File**: `forms/components/form-step-three.tsx`

**Calculation Flow**:
```
Room Data → HVAC Engine → Real-time Results → Output Selection → Payment
     │           │              │                 │              │
     ▼           ▼              ▼                 ▼              ▼
Dimensions → Calculations → Summary Display → BOQ/BOD/BOM → Checkout
```

- Room addition and configuration
- **HVAC Calculation Engine**: Real-time calculations using `forms/lib/hvac-calculator-engine.ts`
- Output selection (BOQ, BOD, BOM, etc.)
- **Payment Integration**: Stripe/payment gateway for premium outputs
- Real-time calculation results display

**Internal API Usage**:
- **HVAC Calculator**: `forms/lib/hvac-calculator-engine.ts` for complex calculations
- **BOD Service**: `forms/lib/bod-service.ts` for Bill of Design generation
- **Form Submission**: `forms/app/api/forms/submit/route.ts` for data persistence
- **Payment API**: Integration with payment processing for premium outputs

### 5. Form Completion Flow
**File**: `forms/components/form-completion.tsx`

**Completion Flow Architecture**:
```
Form Submit → Database Save → Success Display → Action Options → Navigation
     │              │              │               │              │
     ▼              ▼              ▼               ▼              ▼
Validation → MySQL Insert → Confirmation → Report/New/Logout → Dashboard
```

Upon form submission:
1. **Form Validation**: Final validation of all required fields
2. **Database Persistence**: 
   - `INSERT INTO form_submissions` with all form data
   - JSON serialization for complex fields (location_data, filters, ahu_specs)
   - Unique ID constraint validation
3. **Success Confirmation**: Visual confirmation with unique ID
4. **Summary Display**: Customer, technical, and calculation summaries
5. **Action Options**:
   - Download final report (JSON format)
   - View all submissions in dashboard
   - Create new specification
   - Navigate to dashboard
   - Logout

**Internal API Usage**:
- **Form Submission**: `forms/app/api/forms/submit/route.ts`
- **Database Operation**: `lib/database-mysql.ts::saveFormSubmission()`
- **Report Generation**: Client-side JSON report creation and download
- **Navigation**: React Router for dashboard and logout flows

## Internal API Architecture

### API Route Structure
```
/api/
├── database/
│   ├── setup-database/route.ts      # Database initialization
│   ├── test-connection/route.ts     # Connection testing
│   ├── test-operations/route.ts     # CRUD operations testing
│   └── view-all/route.ts            # Database content viewing
├── forms/
│   └── submit/route.ts              # Form submission endpoint
└── mysql/
    ├── setup-database/route.ts      # MySQL schema setup
    ├── test-connection/route.ts     # MySQL connection test
    └── test-operations/route.ts     # MySQL operations test
```

### Server Actions Architecture
```
actions/
└── users-mysql.ts                   # User authentication actions
    ├── registerUser()               # User registration
    ├── loginUser()                  # User authentication
    ├── logoutUser()                 # Session termination
    ├── getLoginStats()              # Login statistics
    └── getUserLoginSummary()        # User activity summary
```

### Database Layer Architecture
```
lib/
├── mysql.ts                         # MySQL connection and query execution
├── database-mysql.ts                # Form data database operations
└── database-config.ts               # Database configuration
```

### Business Logic Architecture
```
forms/lib/
├── hvac-calculator-engine.ts        # Core HVAC calculations
├── hvac-calculations.ts             # HVAC calculation utilities
├── bod-service.ts                   # Bill of Design service
├── standards-data.ts                # Cleanroom standards data
├── class-air-charges-data.ts        # Air changes data
└── sample-hvac-data.ts              # Sample data for testing
```

## Mathematical Calculations

### HVAC Calculation Engine
**Files**: `forms/lib/hvac-calculator-engine.ts`, `forms/lib/hvac-calculations.ts`

#### Core Calculation Methods

##### 1. Psychrometric Calculations
```typescript
// Saturation vapor pressure using Tetens formula
function calculateSaturationVaporPressure(tempC: number): number {
  return 6.1078 * Math.pow(10, (7.5 * tempC) / (237.3 + tempC))
}

// Humidity ratio calculation
function calculateHumidityRatio(tempC: number, rhPercent: number): number {
  const rhFrac = clamp(rhPercent / 100, 0, 1)
  const pws = calculateSaturationVaporPressure(tempC)
  const pw = rhFrac * pws
  return (WATER_AIR_MOLECULAR_RATIO * pw) / (ATMOSPHERIC_PRESSURE - pw)
}
```

##### 2. Air Flow Calculations
- **Room CFM**: `(Volume × Air Changes Per Hour) / 60`
- **Fresh Air CFM**: `Total CFM × (Fresh Air Percentage / 100)`
- **Exhaust Air CFM**: `Total CFM × (Exhaust Percentage / 100)`
- **Dehumidification CFM**: Based on moisture load calculations

##### 3. Heat Load Calculations
- **Sensible Heat Load**: People + Equipment + Lighting + Fresh Air
- **Latent Heat Load**: Moisture removal requirements
- **Total Heat Load**: Sensible + Latent heat loads

##### 4. AHU Sizing
- **Width/Height**: Based on CFM requirements using lookup tables
- **Length**: Base length + Filter stages + Cooling coil rows
- **Blower Model**: Determined by CFM capacity

##### 5. Pipe Sizing
```typescript
function calculatePipeSize(flowLps: number, velocityMs: number): number {
  const qM3s = flowLps / 1000
  const dReq = Math.sqrt((4 * qM3s) / (Math.PI * velocityMs))
  const dMm = dReq * 1000
  return roundUpToStandardSize(dMm)
}
```

#### How Users Can View Calculations

##### Real-Time Display
- **Step 3 Interface**: Live calculation results as users input room data
- **Summary Cards**: Total area, CFM, AC load, and power consumption
- **Detailed Breakdown**: Individual room calculations

##### Export Options
- **JSON Reports**: Complete calculation data with assumptions
- **CSV Export**: Tabular format for spreadsheet analysis
- **BOD Generation**: Bill of Design with detailed specifications

##### Calculation Transparency
- **Assumptions Log**: All calculation assumptions tracked
- **Formula Documentation**: Clear mathematical basis
- **Unit Conversions**: Support for metric and imperial units
- **Validation Checks**: Input validation and error handling

### BOD (Bill of Design) Service
**File**: `forms/lib/bod-service.ts`

Advanced calculation service providing:
- **Asynchronous Processing**: Background calculation handling
- **Progress Tracking**: Real-time calculation status
- **Summary Generation**: Project-wide totals and averages
- **Error Handling**: Comprehensive error management

## Database Schema

### Core Tables

#### 1. User Profiles Table
```sql
CREATE TABLE user_profiles (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL
);
```

#### 2. Form Submissions Table
```sql
CREATE TABLE form_submissions (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  -- Customer & Project Details
  customer_name VARCHAR(255) NOT NULL,
  customer_address TEXT NOT NULL,
  branch_name VARCHAR(255) NOT NULL,
  project_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  location_data JSON,
  unique_id VARCHAR(255) NOT NULL UNIQUE,
  -- Technical Specifications
  standard VARCHAR(100) NOT NULL,
  classification VARCHAR(100) NOT NULL,
  system_type VARCHAR(255) NOT NULL,
  max_temp VARCHAR(50) NOT NULL,
  min_temp VARCHAR(50) NOT NULL,
  max_rh VARCHAR(50) NOT NULL,
  min_rh VARCHAR(50) NOT NULL,
  air_changes VARCHAR(50),
  filters JSON,
  ahu_specs JSON,
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 3. Login History Table
```sql
CREATE TABLE login_history (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36),
  email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_role VARCHAR(50) NOT NULL,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  success BOOLEAN DEFAULT true,
  failure_reason TEXT,
  FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);
```

### Database Configuration
**File**: `lib/mysql.ts`

- **Connection Pooling**: Efficient database connections
- **Error Handling**: Comprehensive error management
- **Transaction Support**: ACID compliance for data integrity
- **Query Optimization**: Indexed columns for performance

## API Endpoints & Internal Usage

### Authentication Endpoints (Server Actions)
**File**: `actions/users-mysql.ts`

#### `registerUser(payload: Partial<IUser>)`
**Internal Flow**:
```
Client Form → Server Action → Database Check → Password Hash → User Insert → Login Log
     │              │              │              │              │           │
     ▼              ▼              ▼              ▼              ▼           ▼
Registration → registerUser() → Email Check → bcrypt.hash() → INSERT → Audit Log
```

**Database Operations**:
- `SELECT * FROM user_profiles WHERE email = ?` - Check existing user
- `INSERT INTO user_profiles (name, email, password, role, is_active)` - Create user
- `INSERT INTO login_history` - Log registration attempt

#### `loginUser(email: string, password: string)`
**Internal Flow**:
```
Credentials → Server Action → User Lookup → Password Check → JWT Generate → Cookie Set
     │              │              │              │              │           │
     ▼              ▼              ▼              ▼              ▼           ▼
Login Form → loginUser() → SELECT user → bcrypt.compare() → jwt.sign() → Response
```

**Database Operations**:
- `SELECT * FROM user_profiles WHERE email = ?` - Find user
- `UPDATE user_profiles SET last_login = NOW() WHERE id = ?` - Update login time
- `INSERT INTO login_history` - Log login attempt

#### `logoutUser()`
**Internal Flow**:
```
Logout Click → Server Action → Cookie Clear → Redirect
     │              │              │           │
     ▼              ▼              ▼           ▼
Button Press → logoutUser() → Client Cleanup → Navigation
```

### Form Management Endpoints

#### `POST /forms/api/forms/submit`
**File**: `forms/app/api/forms/submit/route.ts`

**Internal Flow**:
```
Form Data → API Route → Validation → Database Save → Response
     │           │           │           │           │
     ▼           ▼           ▼           ▼           ▼
Step 3 Submit → POST /submit → Data Check → MySQL Insert → Success
```

**Database Operations**:
- `INSERT INTO form_submissions` with JSON serialized fields
- Unique ID constraint validation
- Timestamp tracking (created_at, updated_at)

#### Form Data Processing
**File**: `lib/database-mysql.ts`

**`saveFormSubmission(formData: FormData)`**:
```
Form Data → Type Conversion → JSON Serialization → MySQL Insert → Response
     │           │                  │                │           │
     ▼           ▼                  ▼                ▼           ▼
Client Data → FormSubmission → JSON.stringify() → INSERT → Success/Error
```

### Database Management Endpoints

#### `POST /api/mysql/setup-database`
**File**: `app/api/mysql/setup-database/route.ts`

**Internal Flow**:
```
Setup Request → API Route → Schema Execution → Table Creation → Response
     │              │              │               │           │
     ▼              ▼              ▼               ▼           ▼
Admin Action → POST /setup → SQL Execution → CREATE TABLE → Status
```

#### `GET /api/database/view-all`
**File**: `app/api/database/view-all/route.ts`

**Internal Flow**:
```
View Request → API Route → Database Query → Data Retrieval → JSON Response
     │              │              │               │           │
     ▼              ▼              ▼               ▼           ▼
Admin Panel → GET /view-all → SELECT * → MySQL Result → Formatted JSON
```

### BOD (Bill of Design) API Endpoints

#### `POST /forms/api/bod/calculate`
**File**: `forms/app/api/bod/calculate/route.ts`

**Internal Flow**:
```
Calculation Request → API Route → BOD Service → Async Processing → Status Response
         │               │            │              │               │
         ▼               ▼            ▼              ▼               ▼
Step 3 Submit → POST /calculate → bodService.startCalculation() → Background → ID
```

**BOD Service Flow**:
```
Form Data → HVAC Inputs → Calculation Engine → Results → Summary → Storage
     │           │              │               │         │         │
     ▼           ▼              ▼               ▼         ▼         ▼
Room Specs → Convert → calculateHVAC() → Room Results → Summary → Map Storage
```

#### `GET /forms/api/bod/status/:id`
**File**: `forms/app/api/bod/status/route.ts`

**Internal Flow**:
```
Status Request → API Route → BOD Service → Status Check → Progress Response
     │               │            │              │               │
     ▼               ▼            ▼              ▼               ▼
Client Poll → GET /status/:id → bodService.getCalculation() → Status → JSON
```

### Real-time Data Flow Examples

#### User Registration Flow
```
1. User fills registration form
2. Client validation (Zod schema)
3. Form submission to registerUser() server action
4. Database email uniqueness check
5. Password hashing with bcrypt
6. User record insertion
7. Login history logging
8. Success response with redirect to login
```

#### Form Submission Flow
```
1. User completes all 3 steps
2. Final validation on Step 3
3. POST request to /forms/api/forms/submit
4. Data transformation to database format
5. JSON serialization of complex fields
6. MySQL INSERT operation
7. Unique ID validation
8. Success response with confirmation
```

#### HVAC Calculation Flow
```
1. User adds room specifications
2. Real-time calculation trigger
3. HVAC calculation engine processes data
4. Psychrometric calculations
5. Heat load computations
6. AHU sizing calculations
7. Results displayed in UI
8. Data available for export/report generation
```

### Error Handling & Validation

#### Authentication Errors
- Invalid credentials → Login history logging with failure reason
- Duplicate email → Registration rejection with clear message
- Inactive account → Account status check with admin notification

#### Form Validation Errors
- Required field validation → Step navigation prevention
- Data type validation → Real-time field highlighting
- Database constraint errors → Unique ID regeneration

#### Calculation Errors
- Invalid input data → Error logging with user notification
- Calculation failures → Fallback to default values
- Service unavailability → Graceful degradation with retry options

## Deployment Guide

### Environment Variables
Create `.env.local` file with:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=clean_room_db
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup
1. Create MySQL database
2. Run schema from `database-schema-complete.sql`
3. Insert default admin user
4. Verify table creation and indexes

### Production Deployment
1. **Build Application**: `npm run build`
2. **Start Production Server**: `npm start`
3. **Configure Reverse Proxy**: Nginx or Apache
4. **SSL Certificate**: HTTPS configuration
5. **Environment Variables**: Production database credentials

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Development Setup

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- npm/pnpm package manager

### Installation Steps
1. **Clone Repository**: `git clone <repository-url>`
2. **Install Dependencies**: `npm install` or `pnpm install`
3. **Environment Setup**: Copy `.env.example` to `.env.local`
4. **Database Setup**: Run SQL schema and configure connection
5. **Development Server**: `npm run dev`

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Structure Guidelines
- **Components**: Use TypeScript interfaces for props
- **Forms**: Implement Zod validation schemas
- **API Routes**: Use Next.js API route handlers
- **Database**: Use prepared statements for security
- **Styling**: Follow Tailwind CSS conventions

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint validation
- **E2E Tests**: Complete user flow testing
- **Database Tests**: Data integrity verification

## Security Considerations

### Authentication Security
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure token generation and validation
- **Session Management**: Proper token expiration
- **Login Tracking**: Comprehensive audit logging

### Data Security
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Prepared statements
- **XSS Protection**: Content sanitization
- **CSRF Protection**: Token-based validation

### Infrastructure Security
- **Environment Variables**: Secure credential management
- **Database Access**: Connection pooling and encryption
- **HTTPS Enforcement**: SSL/TLS configuration
- **Error Handling**: Secure error messages

## Performance Optimization

### Frontend Optimization
- **Code Splitting**: Dynamic imports for route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching Strategy**: Browser and CDN caching

### Backend Optimization
- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Efficient database connections
- **API Caching**: Response caching strategies
- **Compression**: Gzip/Brotli compression

### Monitoring and Analytics
- **Performance Metrics**: Core Web Vitals tracking
- **Error Monitoring**: Comprehensive error logging
- **User Analytics**: Usage pattern analysis
- **Database Monitoring**: Query performance tracking

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Maintained By**: Arrant Dynamics, Division of Arrant Tech IND, Pvt. Ltd.
