# STERI Clean Air - Client Documentation

**Developed by: Arrant Dynamics**  
*A Division of Arrant Tech IND, Pvt. Ltd.*

---

## Executive Summary

STERI Clean Air is an advanced web-based platform designed to revolutionize cleanroom HVAC design and specification. This digital solution streamlines the complex process of creating precise cleanroom environments, transforming weeks of manual calculations into minutes of efficient digital workflows.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [What Does This Platform Do?](#what-does-this-platform-do)
3. [Who Can Use This Platform?](#who-can-use-this-platform)
4. [Key Features & Capabilities](#key-features--capabilities)
5. [Technology Stack](#technology-stack)
6. [Platform Benefits](#platform-benefits)
7. [How It Works](#how-it-works)
8. [Security & Compliance](#security--compliance)
9. [Support & Contact](#support--contact)

---

## Project Overview

### What is STERI Clean Air?

STERI Clean Air is a comprehensive digital platform that automates and simplifies the design of cleanroom HVAC (Heating, Ventilation, and Air Conditioning) systems. It replaces traditional manual calculation methods with intelligent, automated processes that ensure accuracy, compliance, and efficiency.

### The Problem We Solve

Traditional cleanroom design involves:
- **Weeks of manual calculations** by specialized engineers
- **Multiple disconnected software tools** that don't communicate
- **High risk of human error** in critical calculations
- **Difficulty maintaining compliance** with international standards
- **Complex documentation** requirements for regulatory approval

### Our Solution

A unified digital platform that provides:
- **Guided Design Process**: Step-by-step interface that simplifies complex requirements
- **Automated Calculations**: Real-time HVAC calculations based on industry standards
- **Compliance Built-In**: Integrated support for ISO 14644, EU GMP, and FDA standards
- **Professional Documentation**: Automatic generation of Bills of Design (BOD)
- **Secure Data Management**: Cloud-based storage with role-based access control
- **Export Capabilities**: Professional reports in multiple formats

---

## What Does This Platform Do?

### Core Functionalities

#### 1. **Automated HVAC Design Calculations**
- Calculate air changes per hour based on cleanroom classification
- Compute heat loads (sensible and latent)
- Determine air handling unit (AHU) sizing
- Calculate required CFM (Cubic Feet per Minute) for each room
- Size supply and return ducting
- Determine filter requirements

#### 2. **Multi-Step Project Specification**
- **Step 1**: Customer & Project Information
  - Customer details and location mapping
  - Project identification with auto-generated unique IDs
  - Contact information management
  
- **Step 2**: Technical Specifications
  - Standard selection (ISO 14644, EU GMP, FDA)
  - Cleanroom classification (ISO 5 through ISO 9)
  - System type configuration
  - Temperature and humidity requirements
  - Filter specifications
  
- **Step 3**: Room Configuration & Results
  - Individual room specifications
  - Real-time calculation results
  - Summary of total requirements
  - Export options selection

#### 3. **Bill of Design (BOD) Generation**
- Comprehensive design documentation
- Equipment specifications
- Material requirements
- Installation guidelines
- Compliance certifications

#### 4. **User Management System**
- Secure user authentication
- Role-based access (Admin/User)
- Activity tracking and audit logs
- Multi-user collaboration support

#### 5. **Data Management & Reporting**
- Secure project storage
- Historical data retrieval
- Export to multiple formats (JSON, CSV, PDF)
- Dashboard for project overview

---

## Who Can Use This Platform?

### Target Industries

#### 🏭 **Pharmaceutical Manufacturing**
Design cleanrooms for drug production, compounding pharmacies, and sterile manufacturing facilities requiring strict contamination control.

#### 🔬 **Biotechnology & Life Sciences**
Create controlled environments for research laboratories, cell culture facilities, and genetic engineering labs.

#### 💊 **Medical Device Manufacturing**
Specify cleanrooms for implantable devices, surgical instruments, and diagnostic equipment production.

#### 🧪 **Semiconductor & Electronics**
Design ultra-clean environments for chip fabrication, wafer processing, and precision electronics assembly.

#### 🚀 **Aerospace & Defense**
Create controlled manufacturing environments for sensitive aerospace components and defense systems.

#### 🍃 **Food & Beverage Processing**
Design hygienic processing environments for aseptic food production and beverage manufacturing.

#### 🏥 **Healthcare Facilities**
Specify HVAC systems for hospital operating rooms, isolation rooms, and sterile compounding areas.

### User Roles

#### **End Users (Primary Users)**
- **HVAC Engineers**: Design and specify cleanroom systems
- **Facilities Managers**: Plan cleanroom installations and upgrades
- **Project Managers**: Oversee cleanroom construction projects
- **Compliance Officers**: Ensure regulatory compliance
- **Consultants**: Provide expert cleanroom design services

#### **Administrators**
- **System Administrators**: Manage user accounts and permissions
- **Company Managers**: Access all projects and reports
- **Quality Managers**: Audit and verify designs

---

## Key Features & Capabilities

### 1. **Intelligent Design Wizard**
- Guided step-by-step process
- Context-sensitive help and tooltips
- Real-time validation and error prevention
- Progress tracking and save functionality

### 2. **Standards Compliance**
- **ISO 14644**: International cleanroom standards
- **EU GMP**: European Good Manufacturing Practice
- **FDA Guidelines**: US Food & Drug Administration requirements
- Automatic classification-based recommendations

### 3. **Advanced Calculations**
- **Psychrometric Calculations**: Humidity and temperature analysis
- **Heat Load Analysis**: Comprehensive thermal calculations
- **Air Flow Calculations**: Supply, return, and exhaust air
- **Equipment Sizing**: AHU, filters, ducting, and piping
- **Energy Consumption**: Power requirements estimation

### 4. **Interactive Mapping**
- Location selection with interactive maps
- Geographic coordinates capture
- Multi-location project support
- Visual site representation

### 5. **Real-Time Results**
- Instant calculation updates
- Visual progress indicators
- Summary dashboards
- Detailed breakdown views

### 6. **Professional Documentation**
- Bill of Design (BOD) generation
- Bill of Quantities (BOQ) creation
- Bill of Materials (BOM) export
- Comprehensive technical specifications
- Compliance documentation

### 7. **Secure & Scalable**
- Enterprise-grade security
- Role-based access control
- Encrypted data transmission
- Regular automated backups
- Audit trail maintenance

---

## Technology Stack

### Why We Chose These Technologies

Our technology stack was carefully selected to deliver a platform that is **fast, secure, reliable, and user-friendly**.

#### **Frontend Technologies**

##### **Next.js 15.3.5** (React Framework)
- **Why**: Provides exceptional performance with server-side rendering
- **Benefits**: 
  - Lightning-fast page loads
  - SEO optimization
  - Excellent user experience
  - Scalable architecture

##### **React 19.0.0** (UI Library)
- **Why**: Industry-leading framework for building interactive interfaces
- **Benefits**:
  - Responsive and intuitive user interfaces
  - Component reusability
  - Large ecosystem of tools and libraries

##### **TypeScript 5**
- **Why**: Adds type safety to prevent errors
- **Benefits**:
  - Fewer bugs in production
  - Better code maintainability
  - Enhanced development experience
  - Improved documentation

##### **Tailwind CSS 4**
- **Why**: Modern utility-first CSS framework
- **Benefits**:
  - Consistent, professional design
  - Fully responsive on all devices
  - Fast development cycles
  - Easy customization

##### **Radix UI**
- **Why**: Accessible component library
- **Benefits**:
  - WCAG compliance for accessibility
  - Professional UI components
  - Consistent user experience
  - Keyboard navigation support

#### **Backend Technologies**

##### **MySQL 2**
- **Why**: Enterprise-grade relational database
- **Benefits**:
  - Reliable data storage
  - ACID compliance for data integrity
  - Excellent performance at scale
  - Industry-standard security

##### **Next.js API Routes**
- **Why**: Integrated backend solution
- **Benefits**:
  - Simplified architecture
  - Better performance
  - Reduced complexity
  - Lower maintenance costs

##### **JWT Authentication**
- **Why**: Industry-standard secure authentication
- **Benefits**:
  - Stateless authentication
  - Scalable across multiple servers
  - Mobile-friendly
  - High security

##### **bcryptjs**
- **Why**: Military-grade password encryption
- **Benefits**:
  - Unbreakable password security
  - Protection against brute-force attacks
  - Industry best practice

#### **Specialized Tools**

##### **React Leaflet** (Mapping)
- **Why**: Interactive map integration
- **Benefits**: Visual location selection and geographic data capture

##### **React Hook Form + Zod**
- **Why**: Advanced form validation
- **Benefits**: Real-time error detection and user guidance

##### **Recharts**
- **Why**: Data visualization
- **Benefits**: Clear presentation of calculation results

##### **Lucide React** (Icons)
- **Why**: Modern icon library
- **Benefits**: Consistent visual language

### Technology Benefits Summary

| Aspect | Technology | Benefit to You |
|--------|-----------|----------------|
| **Performance** | Next.js + React | Fast, responsive application |
| **Security** | JWT + bcryptjs + MySQL | Enterprise-grade data protection |
| **Reliability** | TypeScript + MySQL | Fewer errors, consistent data |
| **Accessibility** | Radix UI | Usable by everyone |
| **Scalability** | Modern stack | Grows with your business |
| **Maintenance** | Latest technologies | Long-term support and updates |

---

## Platform Benefits

### For Organizations

#### **Time Savings**
- Reduce design time from weeks to hours
- Eliminate manual calculation errors
- Streamline approval workflows
- Faster project turnaround

#### **Cost Reduction**
- Lower engineering costs
- Reduce rework and corrections
- Optimize equipment sizing
- Better resource allocation

#### **Quality Improvement**
- Standardized design processes
- Compliance guarantee
- Reduced error rates
- Professional documentation

#### **Competitive Advantage**
- Faster proposal generation
- More accurate quotations
- Professional presentation
- Better client satisfaction

### For Individual Users

#### **Ease of Use**
- Intuitive interface requiring minimal training
- Step-by-step guidance
- Built-in help and documentation
- Error prevention and validation

#### **Professional Results**
- Industry-standard calculations
- Compliance with international standards
- Professional documentation
- Export-ready reports

#### **Collaboration**
- Multi-user access
- Project sharing capabilities
- Version control
- Audit trail

---

## How It Works

### Simple 5-Step Process

#### **Step 1: Register & Login**
- Create your account with email verification
- Secure login with encrypted credentials
- Role-based access to appropriate features

#### **Step 2: Start New Project**
- Access the project dashboard
- Click "Create New Specification"
- Enter project details

#### **Step 3: Specify Requirements**
- **Customer Information**: Enter client and project details
- **Technical Specs**: Select standards, classification, and system type
- **Room Configuration**: Add rooms and specify dimensions

#### **Step 4: Review Calculations**
- Real-time HVAC calculations
- Review summary of requirements
- Verify all specifications
- Select output formats

#### **Step 5: Generate & Export**
- Generate Bill of Design
- Download professional reports
- Save project for future reference
- Share with team members

### Sample Workflow

```
Login → New Project → Customer Info → Technical Specs → Room Details → 
Calculate → Review Results → Generate BOD → Export → Done!
```

**Time Required**: 15-30 minutes (vs. weeks with manual methods)

---

## Security & Compliance

### Data Security

#### **Encryption**
- All data transmitted using HTTPS/TLS encryption
- Password hashing with bcrypt (10 salt rounds)
- Secure token-based authentication
- Database connection encryption

#### **Access Control**
- Role-based permissions (Admin/User)
- User activity logging
- Session management
- Automatic logout for inactive sessions

#### **Data Protection**
- Regular automated backups
- Data redundancy
- Disaster recovery procedures
- GDPR compliance ready

### Compliance Support

#### **International Standards**
- ISO 14644 (Cleanroom classification)
- EU GMP (Good Manufacturing Practice)
- FDA Guidelines (US regulations)
- Built-in compliance validation

#### **Audit Trail**
- Complete user activity logging
- Login history tracking
- Project modification history
- Timestamp documentation

#### **Quality Assurance**
- Validated calculation algorithms
- Regular accuracy verification
- Industry expert review
- Continuous improvement process

---

## Platform Requirements

### User Requirements

#### **Hardware**
- Modern computer or laptop
- Stable internet connection
- Minimum 4GB RAM recommended
- Screen resolution: 1280x720 or higher

#### **Software**
- Modern web browser:
  - Google Chrome (recommended)
  - Mozilla Firefox
  - Microsoft Edge
  - Safari (Mac)
- No additional software installation required

#### **Skills**
- Basic understanding of cleanroom concepts
- Familiarity with HVAC systems
- No programming knowledge required
- Training materials provided

### System Architecture

The platform operates on a **cloud-based infrastructure**:
- **99.9% uptime guarantee**
- **Automatic scaling** to handle demand
- **Regular backups** every 24 hours
- **24/7 monitoring** and support

---

## Getting Started

### For New Users

1. **Request Access**
   - Contact Arrant Dynamics for account creation
   - Receive welcome email with credentials
   - Access the platform URL

2. **Initial Setup**
   - Login with provided credentials
   - Complete user profile
   - Familiarize yourself with the dashboard

3. **First Project**
   - Follow the guided tutorial
   - Create a sample project
   - Explore all features
   - Review generated reports

4. **Training & Support**
   - Access online documentation
   - Watch video tutorials
   - Contact support for assistance
   - Join user community

### Training Resources

- **User Manual**: Comprehensive guide to all features
- **Video Tutorials**: Step-by-step walkthroughs
- **FAQ**: Common questions and answers
- **Live Support**: Direct assistance from experts
- **Webinars**: Regular training sessions

---

## Support & Contact

### Technical Support

**Email**: support@arrantdynamics.com  
**Phone**: [Your Contact Number]  
**Hours**: Monday - Friday, 9:00 AM - 6:00 PM

### Resources

- **Online Help Center**: help.arrantdynamics.com
- **Documentation**: docs.arrantdynamics.com
- **Video Tutorials**: videos.arrantdynamics.com
- **Community Forum**: forum.arrantdynamics.com

### Sales & Inquiries

**Email**: sales@arrantdynamics.com  
**Website**: www.arrantdynamics.com

### Updates & Announcements

- Regular feature updates
- Platform enhancement notifications
- Industry news and insights
- Best practices sharing

---

## Frequently Asked Questions

### General Questions

**Q: Is training required to use the platform?**  
A: Basic training is recommended but the interface is designed to be intuitive. Comprehensive tutorials and documentation are provided.

**Q: Can multiple users access the same project?**  
A: Yes, the platform supports multi-user collaboration with role-based access control.

**Q: What happens to my data?**  
A: All data is securely stored in encrypted databases with regular backups. You maintain full ownership of your project data.

### Technical Questions

**Q: What standards are supported?**  
A: ISO 14644, EU GMP, and FDA guidelines for cleanroom classification and design.

**Q: Can I export data to other formats?**  
A: Yes, you can export to JSON, CSV, and PDF formats. API integration is available for enterprise customers.

**Q: Is the platform mobile-friendly?**  
A: Yes, the platform is fully responsive and works on tablets and mobile devices, though desktop use is recommended for best experience.

### Pricing & Licensing

**Q: What is the pricing model?**  
A: Please contact our sales team for current pricing and licensing options tailored to your organization.

**Q: Is there a trial period?**  
A: Yes, we offer demonstration and trial periods for qualified organizations.

---

## Future Roadmap

### Planned Enhancements

- **Mobile Applications**: Native iOS and Android apps
- **Advanced Reporting**: Enhanced visualization and analytics
- **3D Modeling**: Visual cleanroom layout design
- **Equipment Database**: Integrated manufacturer catalogs
- **AI Assistance**: Intelligent design recommendations
- **Multi-language Support**: International language options
- **Integration APIs**: Connect with existing enterprise systems

---

## Conclusion

STERI Clean Air represents the future of cleanroom HVAC design. By combining advanced technology with deep industry knowledge, we've created a platform that makes precision engineering accessible, efficient, and reliable.

### Why Choose STERI Clean Air?

✅ **Save Time**: Weeks of work done in minutes  
✅ **Reduce Errors**: Automated calculations eliminate mistakes  
✅ **Ensure Compliance**: Built-in standards support  
✅ **Professional Results**: Industry-standard documentation  
✅ **Secure & Reliable**: Enterprise-grade security  
✅ **Expert Support**: Backed by Arrant Dynamics expertise  

---

## About Arrant Dynamics

Arrant Dynamics, a division of **Arrant Tech IND, Pvt. Ltd.**, specializes in innovative engineering solutions for critical environments. With years of experience in cleanroom design and HVAC engineering, we combine technical expertise with cutting-edge technology to deliver solutions that exceed industry standards.

### Our Mission
To transform complex engineering challenges into simple, efficient digital solutions that empower professionals and organizations worldwide.

### Our Commitment
- **Innovation**: Continuous improvement and feature development
- **Quality**: Industry-leading accuracy and reliability
- **Support**: Dedicated customer success team
- **Security**: Enterprise-grade data protection
- **Excellence**: Uncompromising standards in everything we do

---

**Document Version**: 1.0  
**Last Updated**: September 2025  
**For More Information**: Contact Arrant Dynamics

---

*STERI Clean Air - Precision Engineering, Digitally Delivered*

