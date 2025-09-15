'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronDownIcon, ChevronRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

interface Content {
  id: string
  title: string
  summary: string
  contentType: string
  lifecycleState: string
  sensitivity: string
  domain: {
    name: string
    color?: string
  }
  owner: {
    id: string
    name: string | null
    email: string
    image?: string | null
  }
  createdAt: string
  updatedAt: string
  publishedAt?: string | null
  nextReviewDate?: string | null
}

interface DomainContentListProps {
  domainId: string
  domainName: string
  domainColor: string
  isExpanded: boolean
  onToggle: () => void
}

export function DomainContentList({
  domainId,
  domainName,
  domainColor,
  isExpanded,
  onToggle
}: DomainContentListProps) {
  const [content, setContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate comprehensive mock data for enterprise KM portal
  const generateMockContent = (domainId: string): Content[] => {
    const contentTypes = ['STANDARD', 'POLICY', 'SOP', 'WORK_INSTRUCTION', 'TECH_NOTE', 'FAQ', 'FORM_TEMPLATE', 'JOB_AID', 'RELEASE_NOTES', 'DECISION_LOG']
    const lifecycleStates = ['PUBLISHED', 'IN_REVIEW', 'NEEDS_UPDATE', 'DRAFT']
    const sensitivities = ['INTERNAL', 'RESTRICTED', 'PUBLIC']
    const authors = [
      'Sarah Johnson', 'Mike Chen', 'Alex Rodriguez', 'Lisa Wang', 'Jennifer Smith',
      'David Kim', 'Emma Wilson', 'Robert Garcia', 'Maria Torres', 'James Wilson',
      'Amy Parker', 'Kevin Lee', 'Rachel Green', 'Chris Brown', 'Jessica Davis',
      'Mark Anderson', 'Laura Miller', 'Tony Nguyen', 'Karen White', 'Steven Clark'
    ]

    const getRandomElement = (arr: string[]): string => arr[Math.floor(Math.random() * arr.length)]
    const getRandomDate = () => {
      const start = new Date(2023, 0, 1)
      const end = new Date()
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    }

    const domainContent: Record<string, { titles: string[], summaries: string[] }> = {
      'engineering': {
        titles: [
          'API Development Standards', 'Code Review Guidelines', 'Database Migration Procedures', 'Security Best Practices',
          'Testing Framework Documentation', 'Git Workflow Standards', 'Performance Monitoring Guide', 'Error Handling Protocols',
          'Microservices Architecture Guide', 'Container Deployment Standards', 'CI/CD Pipeline Configuration', 'Load Testing Procedures',
          'Authentication Implementation Guide', 'Logging and Monitoring Standards', 'API Rate Limiting Configuration', 'Database Optimization Techniques',
          'Frontend Development Standards', 'Mobile App Development Guide', 'Third-party Integration Standards', 'Data Validation Procedures',
          'Backup and Recovery Procedures', 'SSL Certificate Management', 'Environment Configuration Guide', 'Code Documentation Standards',
          'Version Control Best Practices', 'Dependency Management Guide', 'Build Process Documentation', 'Deployment Automation Scripts',
          'Incident Response Runbooks', 'Performance Tuning Guide', 'Security Vulnerability Assessment', 'Cross-browser Compatibility Guide',
          'Accessibility Standards', 'Responsive Design Guidelines', 'Progressive Web App Standards', 'WebSocket Implementation Guide',
          'GraphQL API Standards', 'RESTful API Design Patterns', 'Database Schema Design Guide', 'Caching Strategy Documentation',
          'Message Queue Configuration', 'Service Mesh Implementation', 'Kubernetes Deployment Guide', 'Docker Best Practices',
          'Infrastructure as Code Standards', 'Cloud Migration Procedures', 'Serverless Function Guidelines', 'Edge Computing Implementation',
          'Machine Learning Model Deployment', 'Data Pipeline Architecture', 'Real-time Analytics Setup', 'IoT Device Integration Guide',
          'Blockchain Development Standards', 'Cryptography Implementation Guide', 'OAuth 2.0 Integration Guide', 'SAML Configuration Procedures',
          'Multi-factor Authentication Setup', 'Password Policy Guidelines', 'Session Management Standards', 'CORS Configuration Guide',
          'WebRTC Implementation Guide', 'CDN Configuration Standards', 'DNS Management Procedures', 'Network Security Configuration',
          'VPN Setup Documentation', 'Firewall Rules Configuration', 'DDoS Protection Implementation', 'Penetration Testing Procedures',
          'Code Signing Certificate Guide', 'License Compliance Documentation', 'Open Source Usage Policy', 'Software Audit Procedures',
          'Technical Debt Management', 'Refactoring Guidelines', 'Legacy System Migration', 'System Architecture Documentation',
          'Design Pattern Implementation', 'SOLID Principles Guide', 'Clean Code Standards', 'Test-Driven Development Guide',
          'Behavioral Driven Development', 'Continuous Integration Setup', 'Continuous Deployment Pipeline', 'Blue-Green Deployment Strategy',
          'Canary Release Procedures', 'Feature Flag Implementation', 'A/B Testing Framework', 'Monitoring and Alerting Setup',
          'Application Performance Monitoring', 'Error Tracking Configuration', 'Log Aggregation Setup', 'Metrics Collection Guide',
          'Dashboard Creation Standards', 'Reporting Automation Guide', 'Data Visualization Standards', 'Business Intelligence Setup',
          'ETL Process Documentation', 'Data Warehouse Architecture', 'Big Data Processing Guide', 'Stream Processing Implementation',
          'Batch Processing Procedures', 'Data Quality Assurance', 'Data Governance Policies', 'Master Data Management',
          'Customer Data Platform Setup', 'GDPR Compliance Implementation', 'Data Retention Policies', 'Data Anonymization Procedures',
          'Disaster Recovery Planning', 'Business Continuity Procedures', 'High Availability Configuration', 'Failover Testing Guide',
          'Capacity Planning Documentation', 'Scaling Strategies Guide', 'Resource Optimization Procedures', 'Cost Management Guidelines',
          'Cloud Cost Optimization', 'License Management Procedures', 'Vendor Management Guidelines', 'SLA Management Documentation',
          'Technical Support Procedures', 'Escalation Process Guide', 'Change Management Procedures', 'Release Management Guide',
          'Configuration Management Standards', 'Asset Management Procedures', 'Inventory Tracking Systems', 'Hardware Lifecycle Management',
          'Software Lifecycle Management', 'End-of-Life Procedures', 'Technology Refresh Planning', 'Innovation Process Guide',
          'Research and Development Standards', 'Prototype Development Guide', 'MVP Development Procedures', 'Product Launch Checklist',
          'User Acceptance Testing Guide', 'Beta Testing Procedures', 'Production Readiness Checklist', 'Go-Live Procedures',
          'Post-Launch Monitoring Guide', 'Performance Baseline Documentation', 'SLI and SLO Definition', 'KPI Tracking Procedures',
          'Metrics Dashboard Setup', 'Automated Testing Standards', 'Manual Testing Procedures', 'Regression Testing Guide',
          'Integration Testing Standards', 'Unit Testing Best Practices', 'End-to-End Testing Guide', 'Performance Testing Standards',
          'Security Testing Procedures', 'Compliance Testing Guide', 'Accessibility Testing Standards', 'Usability Testing Procedures',
          'Cross-platform Testing Guide', 'Mobile Testing Standards', 'Browser Testing Procedures', 'API Testing Guidelines',
          'Database Testing Standards', 'Load Testing Best Practices', 'Stress Testing Procedures', 'Volume Testing Guide',
          'Chaos Engineering Principles', 'Site Reliability Engineering', 'DevOps Best Practices', 'Platform Engineering Guide'
        ],
        summaries: [
          'Comprehensive guidelines for API design, development, and maintenance.',
          'Best practices for conducting thorough and effective code reviews.',
          'Step-by-step procedures for managing database schema changes.',
          'Security protocols and standards for application development.',
          'Documentation for testing frameworks and methodologies.',
          'Standardized Git workflows and branching strategies.',
          'Guidelines for implementing performance monitoring solutions.',
          'Protocols for handling errors and exceptions in applications.',
          'Architecture patterns and best practices for microservices.',
          'Standards for containerization and deployment processes.',
          'Configuration and management of continuous integration pipelines.',
          'Procedures for conducting comprehensive load testing.',
          'Implementation guide for authentication and authorization systems.',
          'Standards for application logging and system monitoring.',
          'Configuration guidelines for API rate limiting and throttling.',
          'Techniques for optimizing database performance and queries.',
          'Standards and best practices for frontend development.',
          'Comprehensive guide for mobile application development.',
          'Standards for integrating with third-party services and APIs.',
          'Procedures for implementing robust data validation.',
          'Comprehensive backup and disaster recovery procedures.',
          'Management and renewal procedures for SSL certificates.',
          'Configuration guidelines for development environments.',
          'Standards for code documentation and inline comments.',
          'Best practices for version control and repository management.',
          'Guidelines for managing project dependencies and updates.',
          'Documentation of build processes and automation scripts.',
          'Automated deployment scripts and procedures.',
          'Runbooks for responding to production incidents.',
          'Guide for optimizing application and system performance.'
        ]
      },
      'operations': {
        titles: [
          'Incident Response Policy', 'Deployment Checklist', 'Server Maintenance Procedures', 'Monitoring and Alerting Setup',
          'Backup and Recovery Procedures', 'Capacity Planning Guide', 'Change Management Process', 'Release Management Procedures',
          'Service Level Agreement Management', 'Vendor Management Guidelines', 'Asset Management Procedures', 'Configuration Management Standards',
          'Network Operations Center Procedures', 'Help Desk Operation Manual', 'System Administration Guide', 'Database Administration Procedures',
          'Cloud Infrastructure Management', 'Disaster Recovery Planning', 'Business Continuity Procedures', 'Risk Management Framework',
          'Quality Assurance Procedures', 'Process Improvement Guidelines', 'Operational Excellence Standards', 'Service Catalog Management',
          'IT Service Management Framework', 'Problem Management Procedures', 'Knowledge Management Guidelines', 'Training and Development Plans',
          'Performance Management System', 'Resource Allocation Procedures', 'Budget Planning and Management', 'Cost Control Measures',
          'Procurement Process Guidelines', 'Contract Management Procedures', 'Supplier Evaluation Framework', 'Service Provider Management',
          'Technology Refresh Planning', 'Infrastructure Lifecycle Management', 'Hardware Replacement Procedures', 'Software Upgrade Guidelines',
          'Security Operations Center Procedures', 'Vulnerability Management Process', 'Patch Management Guidelines', 'Access Control Procedures',
          'Identity Management System', 'Privilege Access Management', 'Multi-factor Authentication Setup', 'Single Sign-On Configuration',
          'Password Policy Implementation', 'Data Loss Prevention Procedures', 'Encryption Key Management', 'Certificate Management Process',
          'Firewall Management Procedures', 'Network Segmentation Guidelines', 'VPN Administration Guide', 'DNS Management Procedures',
          'Load Balancer Configuration', 'CDN Management Guidelines', 'SSL Certificate Procedures', 'Domain Name Management',
          'Email System Administration', 'File Share Management', 'Backup System Operations', 'Storage Management Procedures',
          'Database Backup Procedures', 'Application Backup Guidelines', 'Data Archiving Procedures', 'Retention Policy Implementation',
          'Data Migration Procedures', 'System Integration Guidelines', 'API Gateway Management', 'Message Queue Administration',
          'Container Orchestration Guide', 'Kubernetes Cluster Management', 'Docker Registry Operations', 'Image Management Procedures',
          'CI/CD Pipeline Management', 'Build System Administration', 'Artifact Repository Management', 'Code Repository Operations',
          'Branch Management Procedures', 'Merge Conflict Resolution', 'Code Review Process', 'Quality Gate Implementation',
          'Testing Environment Management', 'Staging Environment Procedures', 'Production Environment Controls', 'Environment Promotion Guidelines',
          'Configuration Deployment Procedures', 'Feature Flag Management', 'Blue-Green Deployment Process', 'Canary Release Guidelines',
          'Rollback Procedures', 'Hot Fix Deployment Process', 'Emergency Change Procedures', 'Maintenance Window Planning',
          'System Health Monitoring', 'Application Performance Monitoring', 'Infrastructure Monitoring Setup', 'Log Management Procedures',
          'Metrics Collection Guidelines', 'Dashboard Creation Standards', 'Alert Configuration Procedures', 'Escalation Matrix Setup',
          'On-Call Procedures', 'Incident Classification System', 'Major Incident Management', 'Post-Incident Review Process',
          'Root Cause Analysis Procedures', 'Problem Resolution Tracking', 'Service Improvement Planning', 'Customer Communication Guidelines',
          'Status Page Management', 'Communication Protocol Standards', 'Escalation Path Documentation', 'Executive Briefing Procedures',
          'Reporting and Analytics Setup', 'KPI Tracking Procedures', 'Dashboard Maintenance Guidelines', 'Data Visualization Standards',
          'Business Intelligence Operations', 'Report Generation Procedures', 'Data Export Guidelines', 'Data Import Procedures',
          'ETL Process Management', 'Data Pipeline Operations', 'Data Quality Monitoring', 'Data Governance Implementation',
          'Master Data Management', 'Reference Data Management', 'Metadata Management Procedures', 'Data Catalog Maintenance',
          'Data Security Procedures', 'Data Privacy Implementation', 'GDPR Compliance Operations', 'Data Retention Management',
          'Data Disposal Procedures', 'Data Classification Guidelines', 'Information Security Management', 'Risk Assessment Procedures',
          'Threat Intelligence Operations', 'Security Incident Response', 'Forensic Investigation Procedures', 'Evidence Collection Guidelines',
          'Compliance Audit Procedures', 'Regulatory Reporting Guidelines', 'Policy Management Framework', 'Standard Operating Procedures',
          'Work Instruction Templates', 'Process Documentation Standards', 'Procedure Review Process', 'Training Material Development',
          'User Guide Creation', 'Technical Documentation Standards', 'Knowledge Base Management', 'FAQ Development Guidelines',
          'Help Desk Ticketing System', 'Customer Support Procedures', 'Service Request Management', 'User Account Management',
          'Access Request Procedures', 'Role-Based Access Control', 'Privilege Review Process', 'Account Deprovisioning Guidelines',
          'Onboarding Process Procedures', 'Offboarding Process Guidelines', 'Employee Lifecycle Management', 'Contractor Management Procedures',
          'Third-Party Access Management', 'Guest Access Procedures', 'Remote Access Guidelines', 'Mobile Device Management',
          'BYOD Policy Implementation', 'Device Encryption Procedures', 'Mobile Application Management', 'Endpoint Security Management',
          'Antivirus Management Procedures', 'Endpoint Detection Response', 'Device Compliance Monitoring', 'Software Asset Management',
          'License Management Procedures', 'Software Inventory Tracking', 'Usage Monitoring Guidelines', 'Compliance Reporting Procedures',
          'Audit Trail Management', 'Log Retention Procedures', 'Forensic Readiness Planning', 'Chain of Custody Procedures',
          'Digital Evidence Handling', 'Incident Documentation Standards', 'Investigation Report Templates', 'Legal Hold Procedures',
          'Records Management Guidelines', 'Document Control Procedures', 'Version Control Standards', 'Archive Management Procedures',
          'Retention Schedule Implementation', 'Disposal Certificate Management', 'Secure Destruction Procedures', 'Media Sanitization Guidelines',
          'Physical Security Procedures', 'Facility Access Control', 'Visitor Management System', 'Badge Management Procedures',
          'Security Camera Operations', 'Alarm System Management', 'Key Management Procedures', 'Lock Change Procedures',
          'Environmental Controls Management', 'HVAC System Operations', 'Fire Suppression System Management', 'Emergency Response Procedures',
          'Evacuation Procedures', 'First Aid Response Guidelines', 'Medical Emergency Procedures', 'Natural Disaster Response',
          'Pandemic Response Planning', 'Remote Work Procedures', 'Crisis Communication Plans', 'Media Relations Guidelines',
          'Public Relations Procedures', 'Social Media Management', 'Brand Protection Guidelines', 'Reputation Management Procedures'
        ],
        summaries: [
          'Comprehensive procedures for responding to system incidents and outages.',
          'Step-by-step checklist for production deployment processes.',
          'Regular maintenance procedures for server infrastructure.',
          'Configuration and management of monitoring and alerting systems.',
          'Procedures for data backup, recovery, and disaster planning.',
          'Guidelines for planning and managing system capacity.',
          'Process for managing changes to production systems.',
          'Procedures for coordinating and executing software releases.',
          'Management and monitoring of service level agreements.',
          'Guidelines for managing relationships with external vendors.',
          'Procedures for tracking and managing organizational assets.',
          'Standards for managing system and application configurations.',
          'Operating procedures for network operations centers.',
          'Manual for help desk operations and customer support.',
          'Comprehensive guide for system administration tasks.',
          'Procedures for database administration and maintenance.',
          'Management guidelines for cloud infrastructure resources.',
          'Planning and procedures for disaster recovery scenarios.',
          'Procedures for maintaining business operations during disruptions.',
          'Framework for identifying and managing operational risks.',
          'Quality assurance procedures for operational processes.',
          'Guidelines for continuous improvement of operational processes.',
          'Standards for achieving operational excellence.',
          'Management of IT service catalog and offerings.',
          'Framework for IT service management implementation.',
          'Procedures for problem identification and resolution.',
          'Guidelines for organizational knowledge management.',
          'Training and development plans for operational staff.',
          'System for managing operational performance metrics.',
          'Procedures for allocating resources across operations.'
        ]
      },
      'compliance': {
        titles: [
          'Data Privacy Policy', 'Security Audit Procedures', 'GDPR Compliance Framework', 'SOX Compliance Guidelines',
          'HIPAA Privacy Rule Implementation', 'PCI DSS Compliance Standards', 'ISO 27001 Implementation Guide', 'Risk Assessment Framework',
          'Business Continuity Planning', 'Disaster Recovery Procedures', 'Incident Response Framework', 'Vulnerability Management Process',
          'Third-Party Risk Assessment', 'Vendor Due Diligence Procedures', 'Contract Risk Evaluation', 'Supply Chain Security Standards',
          'Information Security Policy', 'Access Control Standards', 'Password Policy Guidelines', 'Multi-Factor Authentication Requirements',
          'Data Classification Framework', 'Information Handling Standards', 'Data Retention Policies', 'Data Disposal Procedures',
          'Encryption Standards', 'Key Management Procedures', 'Certificate Management Guidelines', 'PKI Implementation Framework',
          'Network Security Standards', 'Firewall Configuration Guidelines', 'VPN Security Requirements', 'Wireless Security Standards',
          'Endpoint Security Requirements', 'Mobile Device Management Policy', 'BYOD Security Guidelines', 'Remote Access Security Standards',
          'Email Security Standards', 'Web Security Guidelines', 'Application Security Requirements', 'Database Security Standards',
          'Cloud Security Framework', 'SaaS Security Assessment', 'IaaS Security Guidelines', 'PaaS Security Requirements',
          'DevSecOps Implementation Guide', 'Security Code Review Standards', 'Penetration Testing Procedures', 'Vulnerability Scanning Guidelines',
          'Security Awareness Training Program', 'Phishing Simulation Procedures', 'Social Engineering Prevention', 'Security Culture Development',
          'Incident Classification System', 'Security Incident Response Plan', 'Breach Notification Procedures', 'Forensic Investigation Guidelines',
          'Evidence Collection Standards', 'Chain of Custody Procedures', 'Digital Forensics Framework', 'Malware Analysis Procedures',
          'Threat Intelligence Program', 'Cyber Threat Hunting Procedures', 'Security Operations Center Guidelines', 'SIEM Implementation Framework',
          'Log Management Standards', 'Security Monitoring Procedures', 'Alert Response Guidelines', 'Security Metrics Framework',
          'Compliance Audit Framework', 'Internal Audit Procedures', 'External Audit Management', 'Audit Evidence Collection',
          'Audit Report Management', 'Finding Remediation Procedures', 'Compliance Gap Analysis', 'Control Testing Procedures',
          'Regulatory Reporting Framework', 'Compliance Dashboard Management', 'Policy Management Framework', 'Procedure Development Standards',
          'Control Documentation Requirements', 'Risk Register Management', 'Risk Treatment Planning', 'Risk Monitoring Procedures',
          'Business Impact Analysis', 'Recovery Time Objectives', 'Recovery Point Objectives', 'Crisis Management Framework',
          'Emergency Response Procedures', 'Communication Crisis Plan', 'Media Relations Guidelines', 'Stakeholder Communication Plan',
          'Legal Hold Procedures', 'eDiscovery Framework', 'Records Management Program', 'Document Retention Schedule',
          'Privacy Impact Assessment', 'Data Protection Impact Assessment', 'Privacy by Design Framework', 'Consent Management Procedures',
          'Data Subject Rights Framework', 'Right to be Forgotten Procedures', 'Data Portability Guidelines', 'Data Accuracy Standards',
          'Cross-Border Data Transfer Rules', 'Binding Corporate Rules Framework', 'Standard Contractual Clauses', 'Adequacy Decision Guidelines',
          'Employee Privacy Rights', 'HR Data Protection Guidelines', 'Workplace Monitoring Policy', 'Employee Consent Procedures',
          'Training Record Management', 'Certification Requirements', 'Professional Development Standards', 'Competency Assessment Framework',
          'Ethics and Conduct Policy', 'Code of Business Conduct', 'Conflict of Interest Guidelines', 'Gift and Entertainment Policy',
          'Anti-Bribery and Corruption Policy', 'Whistleblower Protection Program', 'Ethics Hotline Procedures', 'Investigation Framework',
          'Disciplinary Action Guidelines', 'Performance Management Standards', 'Employee Grievance Procedures', 'Harassment Prevention Policy',
          'Equal Opportunity Guidelines', 'Diversity and Inclusion Framework', 'Accommodation Procedures', 'Leave Management Policy',
          'Health and Safety Standards', 'Workplace Safety Procedures', 'Accident Reporting Guidelines', 'Safety Training Requirements',
          'Environmental Compliance Framework', 'Waste Management Procedures', 'Energy Management Standards', 'Sustainability Guidelines',
          'Carbon Footprint Reporting', 'Green IT Implementation', 'Environmental Impact Assessment', 'Recycling Program Guidelines',
          'Financial Controls Framework', 'Accounting Standards Implementation', 'Revenue Recognition Guidelines', 'Expense Management Policy',
          'Procurement Compliance Standards', 'Contract Management Framework', 'Purchase Order Procedures', 'Invoice Processing Guidelines',
          'Budget Management Standards', 'Financial Reporting Framework', 'Management Reporting Guidelines', 'Board Reporting Requirements',
          'Internal Controls Testing', 'Control Deficiency Management', 'Material Weakness Procedures', 'Significant Deficiency Guidelines',
          'Segregation of Duties Matrix', 'Authorization Limits Framework', 'Approval Workflow Standards', 'Delegation of Authority Guidelines',
          'Banking and Treasury Controls', 'Cash Management Procedures', 'Investment Policy Guidelines', 'Foreign Exchange Controls',
          'Tax Compliance Framework', 'Transfer Pricing Guidelines', 'International Tax Planning', 'VAT Compliance Procedures',
          'Customs and Trade Compliance', 'Export Control Procedures', 'Import Documentation Requirements', 'Trade Sanctions Compliance',
          'Anti-Money Laundering Framework', 'Know Your Customer Procedures', 'Suspicious Activity Reporting', 'Customer Due Diligence Guidelines',
          'Financial Crime Prevention', 'Fraud Detection Procedures', 'Investigation Response Framework', 'Recovery Action Guidelines',
          'Insurance Management Framework', 'Claims Management Procedures', 'Risk Transfer Guidelines', 'Coverage Assessment Framework',
          'Business License Management', 'Regulatory Registration Procedures', 'Permit Management Framework', 'Compliance Calendar Management',
          'Regulatory Change Management', 'Impact Assessment Framework', 'Implementation Planning Guidelines', 'Training Update Procedures',
          'Compliance Communication Plan', 'Awareness Campaign Guidelines', 'Newsletter Management Procedures', 'Training Delivery Standards',
          'E-Learning Development Guidelines', 'Training Effectiveness Measurement', 'Knowledge Assessment Framework', 'Certification Tracking Procedures',
          'Compliance Committee Charter', 'Committee Meeting Procedures', 'Decision Documentation Standards', 'Action Item Tracking Guidelines',
          'Escalation Matrix Framework', 'Issue Resolution Procedures', 'Executive Reporting Guidelines', 'Board Communication Standards',
          'Regulatory Relationship Management', 'Regulator Communication Guidelines', 'Examination Preparation Procedures', 'Response Management Framework',
          'Consent Order Management', 'Enforcement Action Response', 'Regulatory Settlement Procedures', 'Penalty Assessment Guidelines',
          'Public Disclosure Requirements', 'Transparency Reporting Framework', 'Stakeholder Communication Plan', 'Public Relations Guidelines',
          'Crisis Communication Procedures', 'Reputation Management Framework', 'Media Response Guidelines', 'Social Media Monitoring Procedures'
        ],
        summaries: [
          'Comprehensive data privacy policy covering collection, use, and protection.',
          'Detailed procedures for conducting comprehensive security audits.',
          'Framework for implementing GDPR compliance across the organization.',
          'Guidelines for Sarbanes-Oxley Act compliance and financial controls.',
          'Implementation guide for HIPAA Privacy Rule requirements.',
          'Standards for Payment Card Industry Data Security Standard compliance.',
          'Implementation guide for ISO 27001 information security management.',
          'Framework for conducting comprehensive organizational risk assessments.',
          'Planning procedures for maintaining business continuity.',
          'Detailed disaster recovery procedures and protocols.',
          'Framework for responding to security incidents and breaches.',
          'Process for managing and remediating security vulnerabilities.',
          'Assessment procedures for third-party vendor risks.',
          'Due diligence procedures for vendor evaluation and selection.',
          'Framework for evaluating risks in contractual agreements.',
          'Security standards for supply chain risk management.',
          'Comprehensive information security policy and procedures.',
          'Standards for implementing access control measures.',
          'Guidelines for creating and managing secure passwords.',
          'Requirements for multi-factor authentication implementation.',
          'Framework for classifying and handling sensitive information.',
          'Standards for proper handling of classified information.',
          'Policies governing data retention periods and procedures.',
          'Secure procedures for disposing of sensitive data.',
          'Standards for implementing encryption across the organization.',
          'Procedures for cryptographic key lifecycle management.',
          'Guidelines for digital certificate management and renewal.',
          'Framework for public key infrastructure implementation.',
          'Standards for securing network infrastructure and communications.',
          'Configuration guidelines for firewall security controls.'
        ]
      },
      'marketing': {
        titles: [
          'Brand Guidelines', 'Content Marketing Strategy', 'Social Media Policy', 'Digital Marketing Framework',
          'Brand Identity Standards', 'Logo Usage Guidelines', 'Typography Standards', 'Color Palette Guidelines',
          'Photography Style Guide', 'Video Production Standards', 'Graphic Design Guidelines', 'Website Design Standards',
          'Email Marketing Guidelines', 'Newsletter Design Templates', 'Campaign Development Process', 'Content Creation Workflow',
          'Editorial Calendar Management', 'Blog Content Standards', 'SEO Content Guidelines', 'Keyword Research Procedures',
          'Social Media Content Strategy', 'Platform-Specific Guidelines', 'Community Management Standards', 'Influencer Partnership Framework',
          'PR and Communications Strategy', 'Press Release Templates', 'Media Relations Guidelines', 'Crisis Communications Plan',
          'Event Marketing Procedures', 'Trade Show Guidelines', 'Conference Planning Standards', 'Webinar Production Guide',
          'Lead Generation Framework', 'Lead Nurturing Procedures', 'Marketing Automation Setup', 'CRM Integration Guidelines',
          'Customer Segmentation Strategy', 'Persona Development Framework', 'Customer Journey Mapping', 'Touchpoint Optimization Guide',
          'Marketing Attribution Framework', 'ROI Measurement Standards', 'KPI Tracking Procedures', 'Analytics Implementation Guide',
          'A/B Testing Framework', 'Conversion Optimization Guidelines', 'Landing Page Best Practices', 'Form Optimization Standards',
          'Paid Advertising Guidelines', 'Google Ads Best Practices', 'Social Media Advertising Standards', 'Display Advertising Framework',
          'Retargeting Campaign Guidelines', 'Programmatic Advertising Standards', 'Native Advertising Framework', 'Sponsored Content Guidelines',
          'Partnership Marketing Framework', 'Co-marketing Guidelines', 'Affiliate Program Management', 'Channel Partner Marketing',
          'Product Marketing Strategy', 'Product Launch Framework', 'Go-to-Market Planning', 'Competitive Analysis Framework',
          'Market Research Guidelines', 'Customer Feedback Collection', 'Survey Design Standards', 'Focus Group Procedures',
          'Brand Positioning Framework', 'Messaging Architecture Guidelines', 'Value Proposition Development', 'USP Definition Framework',
          'Customer Acquisition Strategy', 'Retention Marketing Framework', 'Loyalty Program Guidelines', 'Referral Program Standards',
          'Marketing Technology Stack', 'MarTech Integration Guidelines', 'Tool Evaluation Framework', 'Vendor Selection Criteria',
          'Data Management Platform Setup', 'Customer Data Platform Guidelines', 'Privacy-First Marketing Framework', 'Consent Management Procedures',
          'Compliance Marketing Guidelines', 'GDPR Marketing Compliance', 'CAN-SPAM Compliance Standards', 'Accessibility Guidelines',
          'Inclusive Marketing Framework', 'Diversity and Representation Guidelines', 'Cultural Sensitivity Standards', 'Global Marketing Guidelines',
          'Localization Framework', 'Translation Guidelines', 'Regional Adaptation Procedures', 'Market Entry Strategy',
          'International Campaign Guidelines', 'Cross-Cultural Communications', 'Local Partnership Framework', 'Regional Brand Adaptation',
          'Content Localization Standards', 'Multilingual SEO Guidelines', 'Regional Social Media Strategy', 'Local Compliance Requirements',
          'Brand Protection Guidelines', 'Trademark Usage Standards', 'Copyright Protection Procedures', 'Intellectual Property Framework',
          'Anti-Counterfeiting Measures', 'Brand Monitoring Procedures', 'Reputation Management Framework', 'Online Review Management',
          'Crisis Brand Management', 'Negative PR Response Plan', 'Social Media Crisis Management', 'Damage Control Procedures',
          'Customer Experience Strategy', 'Omnichannel Marketing Framework', 'Cross-Channel Consistency Guidelines', 'Personalization Strategy',
          'Dynamic Content Guidelines', 'Real-Time Marketing Framework', 'Trigger-Based Marketing Standards', 'Behavioral Targeting Guidelines',
          'Marketing Database Management', 'List Management Procedures', 'Data Quality Standards', 'Subscriber Management Framework',
          'Email Deliverability Guidelines', 'Spam Prevention Measures', 'Sender Reputation Management', 'List Hygiene Procedures',
          'Mobile Marketing Framework', 'App Marketing Guidelines', 'Push Notification Standards', 'SMS Marketing Procedures',
          'Location-Based Marketing Guidelines', 'Geofencing Campaign Standards', 'Mobile Advertising Framework', 'Responsive Design Requirements',
          'Video Marketing Strategy', 'YouTube Channel Guidelines', 'Video SEO Standards', 'Live Streaming Procedures',
          'Podcast Marketing Framework', 'Audio Content Guidelines', 'Voice Marketing Standards', 'Smart Speaker Optimization',
          'Emerging Technology Framework', 'AR/VR Marketing Guidelines', 'AI Marketing Applications', 'Chatbot Implementation Standards',
          'Voice Search Optimization', 'Visual Search Guidelines', 'IoT Marketing Framework', 'Blockchain Marketing Applications',
          'Sustainability Marketing Framework', 'Green Marketing Guidelines', 'Environmental Messaging Standards', 'CSR Communication Framework',
          'Purpose-Driven Marketing Guidelines', 'Social Impact Messaging', 'Community Engagement Framework', 'Cause Marketing Standards',
          'B2B Marketing Framework', 'Account-Based Marketing Guidelines', 'Sales Enablement Standards', 'Lead Scoring Procedures',
          'Sales and Marketing Alignment', 'Pipeline Management Framework', 'Customer Success Marketing', 'Upselling Marketing Guidelines',
          'Customer Advocacy Framework', 'Case Study Development Guidelines', 'Testimonial Collection Procedures', 'Reference Program Management',
          'Industry Thought Leadership', 'Expert Positioning Framework', 'Speaking Engagement Guidelines', 'Awards Program Strategy',
          'Innovation Marketing Framework', 'Technology Marketing Guidelines', 'Product Demo Standards', 'Technical Content Framework',
          'Developer Marketing Guidelines', 'API Documentation Standards', 'Technical Community Building', 'Open Source Marketing',
          'Startup Marketing Framework', 'Growth Hacking Guidelines', 'Viral Marketing Standards', 'Bootstrapped Marketing Procedures',
          'Enterprise Marketing Guidelines', 'Corporate Communication Standards', 'Executive Thought Leadership', 'Board Communication Framework',
          'Investor Relations Marketing', 'Stakeholder Communication Plan', 'Financial Communication Guidelines', 'Annual Report Framework',
          'Employee Advocacy Framework', 'Internal Communication Standards', 'Employee Social Media Guidelines', 'Brand Ambassador Program',
          'Training and Development Framework', 'Marketing Skills Development', 'Certification Requirements', 'Professional Development Standards',
          'Team Collaboration Guidelines', 'Cross-Functional Workflow Standards', 'Project Management Framework', 'Resource Allocation Guidelines',
          'Budget Planning and Management', 'ROI Optimization Framework', 'Cost Control Measures', 'Performance Review Standards',
          'Quality Assurance Framework', 'Creative Review Process', 'Brand Compliance Auditing', 'Performance Monitoring Procedures',
          'Competitive Intelligence Framework', 'Market Surveillance Procedures', 'Trend Analysis Guidelines', 'Opportunity Assessment Framework',
          'Innovation Pipeline Management', 'Experimental Marketing Framework', 'Pilot Program Guidelines', 'Scale-Up Procedures',
          'Marketing Operations Framework', 'Process Optimization Guidelines', 'Workflow Automation Standards', 'Efficiency Measurement Procedures',
          'Vendor Management Framework', 'Agency Relationship Guidelines', 'Freelancer Management Standards', 'Contractor Selection Criteria',
          'Legal Compliance Framework', 'Advertising Law Compliance', 'Marketing Regulation Guidelines', 'Terms and Conditions Standards',
          'Privacy Policy Guidelines', 'Data Protection Framework', 'Consumer Rights Compliance', 'Fair Trading Standards'
        ],
        summaries: [
          'Official brand guidelines covering visual identity and usage standards.',
          'Comprehensive strategy for content marketing initiatives and campaigns.',
          'Policy governing social media use and brand representation.',
          'Framework for digital marketing strategies and implementation.',
          'Standards for maintaining consistent brand identity across channels.',
          'Guidelines for proper logo usage and brand mark applications.',
          'Typography standards for consistent brand communication.',
          'Official color palette and usage guidelines for brand materials.',
          'Style guide for photography that aligns with brand identity.',
          'Production standards for video content and brand messaging.',
          'Design guidelines for maintaining visual brand consistency.',
          'Standards for website design and user experience consistency.',
          'Guidelines for email marketing campaigns and communications.',
          'Template designs for newsletter and email communications.',
          'Process for developing and executing marketing campaigns.',
          'Workflow procedures for creating and approving marketing content.',
          'Management system for editorial calendar and content planning.',
          'Content standards and guidelines for blog publications.',
          'SEO guidelines for optimizing content for search engines.',
          'Procedures for conducting keyword research and analysis.',
          'Strategy for social media content creation and distribution.',
          'Platform-specific guidelines for different social media channels.',
          'Standards for community management and social media engagement.',
          'Framework for establishing and managing influencer partnerships.',
          'Strategy for public relations and external communications.',
          'Templates and guidelines for press release development.',
          'Guidelines for managing media relationships and communications.',
          'Plan for managing communications during crisis situations.',
          'Procedures for planning and executing event marketing initiatives.',
          'Guidelines for trade show participation and representation.',
          'Standards for conference planning and execution.',
          'Production guide for webinar planning and delivery.'
        ]
      },
      'sales': {
        titles: [
          'Customer Onboarding Process', 'Sales Process Framework', 'Lead Qualification Standards', 'Proposal Development Guidelines',
          'CRM Management Procedures', 'Sales Pipeline Management', 'Territory Planning Framework', 'Account Management Standards',
          'Prospecting Guidelines', 'Cold Calling Best Practices', 'Email Outreach Templates', 'Social Selling Framework',
          'Product Demonstration Guidelines', 'Sales Presentation Standards', 'Objection Handling Framework', 'Closing Techniques Guide',
          'Contract Negotiation Procedures', 'Pricing Strategy Framework', 'Discount Approval Process', 'Terms and Conditions Guidelines',
          'Customer Relationship Management', 'Account Planning Framework', 'Strategic Account Guidelines', 'Key Account Management',
          'Sales Forecasting Procedures', 'Quota Management Framework', 'Territory Assignment Guidelines', 'Compensation Plan Structure',
          'Sales Training Program', 'Onboarding New Sales Staff', 'Product Knowledge Framework', 'Competitive Intelligence Guidelines',
          'Sales Methodology Implementation', 'SPIN Selling Techniques', 'Consultative Selling Framework', 'Solution Selling Process',
          'Customer Needs Assessment', 'Pain Point Identification', 'Value Proposition Development', 'Business Case Framework',
          'Sales Automation Tools', 'Lead Management System', 'Opportunity Management Process', 'Activity Tracking Standards',
          'Sales Performance Metrics', 'KPI Dashboard Management', 'Reporting Framework', 'Analytics Implementation Guide',
          'Customer Acquisition Strategy', 'Market Penetration Framework', 'Customer Retention Guidelines', 'Upselling Procedures',
          'Cross-Selling Framework', 'Customer Expansion Strategy', 'Renewal Process Guidelines', 'Win-Back Campaign Procedures',
          'Sales Operations Framework', 'Process Optimization Guidelines', 'Workflow Automation Standards', 'Efficiency Measurement Procedures',
          'Lead Generation Framework', 'Inbound Lead Management', 'Outbound Prospecting Guidelines', 'Referral Program Management',
          'Partner Channel Management', 'Channel Partner Guidelines', 'Reseller Support Framework', 'Channel Conflict Resolution',
          'Sales Enablement Framework', 'Content Management System', 'Sales Collateral Guidelines', 'Battle Cards Development',
          'Competitive Analysis Framework', 'Win/Loss Analysis Procedures', 'Market Intelligence Gathering', 'Competitor Monitoring Guidelines',
          'Customer Success Framework', 'Post-Sale Support Guidelines', 'Implementation Support Procedures', 'Customer Health Monitoring',
          'Renewal Strategy Framework', 'Contract Renewal Procedures', 'Expansion Opportunity Identification', 'At-Risk Account Management',
          'Sales Technology Stack', 'Tool Integration Guidelines', 'Platform Selection Criteria', 'User Adoption Framework',
          'Data Management Standards', 'Lead Data Quality Guidelines', 'Contact Information Management', 'Account Data Maintenance',
          'Privacy and Compliance Framework', 'GDPR Sales Compliance', 'Data Protection Guidelines', 'Consent Management Procedures',
          'Sales Communication Standards', 'Customer Communication Guidelines', 'Internal Communication Framework', 'Team Collaboration Standards',
          'Meeting Management Guidelines', 'Sales Call Procedures', 'Follow-up Standards', 'Documentation Requirements',
          'Proposal Management Framework', 'RFP Response Procedures', 'Bid Management Guidelines', 'Proposal Review Process',
          'Contract Management Framework', 'Legal Review Procedures', 'Risk Assessment Guidelines', 'Approval Workflow Standards',
          'Customer Onboarding Framework', 'Implementation Planning Guidelines', 'Project Management Standards', 'Success Milestone Tracking',
          'Training and Development Framework', 'Skills Assessment Procedures', 'Professional Development Planning', 'Certification Requirements',
          'Performance Management System', 'Goal Setting Framework', 'Performance Review Procedures', 'Improvement Planning Guidelines',
          'Coaching and Mentoring Framework', 'Sales Coaching Procedures', 'Peer Learning Programs', 'Knowledge Sharing Standards',
          'Territory Management Framework', 'Geographic Territory Planning', 'Account Assignment Procedures', 'Territory Optimization Guidelines',
          'Market Segmentation Framework', 'Customer Segmentation Guidelines', 'Vertical Market Strategies', 'Industry-Specific Approaches',
          'Pricing Strategy Framework', 'Competitive Pricing Guidelines', 'Value-Based Pricing Standards', 'Discount Management Procedures',
          'Revenue Management Framework', 'Revenue Recognition Guidelines', 'Billing Process Standards', 'Collections Procedures',
          'Customer Experience Framework', 'Journey Mapping Guidelines', 'Touchpoint Optimization Standards', 'Experience Measurement Procedures',
          'Digital Selling Framework', 'Virtual Selling Guidelines', 'Remote Presentation Standards', 'Online Demo Procedures',
          'Social Selling Framework', 'LinkedIn Selling Guidelines', 'Social Media Prospecting', 'Content Sharing Standards',
          'Event Sales Framework', 'Trade Show Guidelines', 'Conference Selling Procedures', 'Networking Event Standards',
          'Inside Sales Framework', 'Telemarketing Guidelines', 'Phone Sales Procedures', 'Remote Selling Standards',
          'Field Sales Framework', 'Face-to-Face Selling Guidelines', 'Customer Visit Procedures', 'Territory Travel Guidelines',
          'Channel Sales Framework', 'Partner Selling Guidelines', 'Distributor Management Standards', 'Channel Enablement Procedures',
          'Enterprise Sales Framework', 'Complex Sale Management', 'Long Cycle Selling Guidelines', 'Committee Selling Procedures',
          'SMB Sales Framework', 'Small Business Selling Guidelines', 'Quick Sale Procedures', 'High-Volume Sales Standards',
          'International Sales Framework', 'Cross-Cultural Selling Guidelines', 'Global Account Management', 'Export Sales Procedures',
          'Vertical Sales Framework', 'Industry-Specific Guidelines', 'Sector Expertise Development', 'Specialized Selling Procedures',
          'Product Sales Framework', 'Product-Specific Guidelines', 'Feature Benefit Selling', 'Technical Selling Procedures',
          'Service Sales Framework', 'Consultative Service Selling', 'Solution Selling Guidelines', 'Advisory Selling Procedures',
          'Subscription Sales Framework', 'Recurring Revenue Management', 'Subscription Renewal Guidelines', 'Usage-Based Selling',
          'Transactional Sales Framework', 'Quick Sale Guidelines', 'Order Processing Procedures', 'Fulfillment Coordination Standards',
          'New Customer Acquisition', 'Prospect Identification Guidelines', 'Cold Market Penetration', 'Customer Development Procedures',
          'Existing Customer Growth', 'Account Expansion Guidelines', 'Wallet Share Increase', 'Customer Lifetime Value Optimization',
          'Lost Customer Recovery', 'Win-Back Campaign Guidelines', 'Churn Prevention Procedures', 'Reactivation Strategies',
          'Sales Leadership Framework', 'Team Management Guidelines', 'Performance Leadership Standards', 'Motivational Leadership Procedures',
          'Sales Team Building', 'Team Development Guidelines', 'Collaboration Standards', 'Team Communication Procedures',
          'Change Management Framework', 'Process Change Guidelines', 'Technology Implementation Standards', 'Adoption Management Procedures',
          'Quality Assurance Framework', 'Sales Quality Standards', 'Process Auditing Guidelines', 'Compliance Monitoring Procedures',
          'Continuous Improvement Framework', 'Process Optimization Guidelines', 'Best Practice Identification', 'Innovation Implementation Standards',
          'Customer Feedback Management', 'Feedback Collection Guidelines', 'Survey Administration Procedures', 'Insight Implementation Framework',
          'Market Research Framework', 'Market Analysis Guidelines', 'Customer Research Procedures', 'Competitive Research Standards',
          'Sales Intelligence Framework', 'Market Intelligence Guidelines', 'Customer Intelligence Procedures', 'Competitive Intelligence Standards',
          'Risk Management Framework', 'Sales Risk Assessment', 'Customer Credit Guidelines', 'Deal Risk Management Procedures',
          'Compliance Framework', 'Regulatory Compliance Guidelines', 'Legal Compliance Standards', 'Ethical Selling Procedures',
          'Audit and Review Framework', 'Sales Audit Procedures', 'Process Review Guidelines', 'Compliance Audit Standards',
          'Documentation Framework', 'Record Keeping Guidelines', 'File Management Standards', 'Data Retention Procedures',
          'Reporting Framework', 'Sales Reporting Guidelines', 'Management Reporting Standards', 'Executive Reporting Procedures',
          'Budget Management Framework', 'Sales Budget Guidelines', 'Expense Management Standards', 'Cost Control Procedures',
          'Resource Management Framework', 'Resource Allocation Guidelines', 'Capacity Planning Standards', 'Utilization Optimization Procedures',
          'Vendor Management Framework', 'Supplier Selection Guidelines', 'Contract Management Standards', 'Performance Monitoring Procedures',
          'Partnership Framework', 'Strategic Partnership Guidelines', 'Joint Venture Standards', 'Alliance Management Procedures',
          'Innovation Framework', 'Sales Innovation Guidelines', 'Process Innovation Standards', 'Technology Innovation Procedures'
        ],
        summaries: [
          'Comprehensive guide for onboarding new customers effectively.',
          'Framework defining the standardized sales process and methodology.',
          'Standards for qualifying and prioritizing sales leads.',
          'Guidelines for developing compelling sales proposals.',
          'Procedures for managing customer relationship management systems.',
          'Framework for managing and optimizing the sales pipeline.',
          'Guidelines for planning and managing sales territories.',
          'Standards for managing key accounts and customer relationships.',
          'Best practices for identifying and reaching potential customers.',
          'Techniques and guidelines for effective cold calling.',
          'Template library for email outreach and communication.',
          'Framework for leveraging social media for sales activities.',
          'Guidelines for conducting effective product demonstrations.',
          'Standards for creating and delivering sales presentations.',
          'Framework for handling customer objections and concerns.',
          'Guide to various techniques for closing sales deals.',
          'Procedures for negotiating contracts and agreements.',
          'Framework for developing and implementing pricing strategies.',
          'Process for approving discounts and special pricing.',
          'Guidelines for standard terms and conditions in contracts.',
          'Framework for building and maintaining customer relationships.',
          'Guidelines for strategic account planning and management.',
          'Standards for managing strategic customer accounts.',
          'Framework for managing key accounts and relationships.',
          'Procedures for creating accurate sales forecasts.',
          'Framework for setting and managing sales quotas.',
          'Guidelines for assigning sales territories to team members.',
          'Structure and guidelines for sales compensation plans.',
          'Comprehensive training program for sales team development.',
          'Process for onboarding new sales team members.'
        ]
      }
    }

    const domainConfig = domainContent[domainId] || { titles: [], summaries: [] }
    const numDocs = 90 + Math.floor(Math.random() * 58) // 90-147 documents
    const content: Content[] = []

    for (let i = 0; i < numDocs; i++) {
      const titleIndex = i < domainConfig.titles.length ? i : Math.floor(Math.random() * domainConfig.titles.length)
      const summaryIndex = i < domainConfig.summaries.length ? i : Math.floor(Math.random() * domainConfig.summaries.length)

      const createdDate = getRandomDate()
      const updatedDate = new Date(createdDate.getTime() + Math.random() * (new Date().getTime() - createdDate.getTime()))
      const isPublished = Math.random() > 0.3 // 70% published
      const publishedDate = isPublished ? updatedDate : null

      content.push({
        id: `${domainId}-${i + 1}`,
        title: i < domainConfig.titles.length ? domainConfig.titles[i] : `${domainConfig.titles[titleIndex]} v${Math.floor(Math.random() * 5) + 1}`,
        summary: i < domainConfig.summaries.length ? domainConfig.summaries[i] : domainConfig.summaries[summaryIndex],
        contentType: getRandomElement(contentTypes),
        lifecycleState: getRandomElement(lifecycleStates),
        sensitivity: getRandomElement(sensitivities),
        domain: {
          name: domainId.charAt(0).toUpperCase() + domainId.slice(1),
          color: domainId === 'engineering' ? '#3B82F6' : domainId === 'operations' ? '#10B981' : domainId === 'compliance' ? '#EF4444' : domainId === 'marketing' ? '#F59E0B' : '#8B5CF6'
        },
        owner: {
          id: `user-${i + 1}`,
          name: getRandomElement(authors),
          email: `${getRandomElement(authors).toLowerCase().replace(' ', '.')}@example.com`
        },
        createdAt: createdDate.toISOString(),
        updatedAt: updatedDate.toISOString(),
        publishedAt: publishedDate?.toISOString() || null,
        nextReviewDate: Math.random() > 0.5 ? new Date(updatedDate.getTime() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString() : null
      })
    }

    return content
  }

  const fetchContent = useCallback(async () => {
    setLoading(true)
    setError(null)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      // Generate comprehensive mock data for enterprise KM portal
      const mockContent = generateMockContent(domainId)
      setContent(mockContent)
    } catch (err) {
      console.error('Content fetch error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [domainId])

  useEffect(() => {
    if (isExpanded && content.length === 0) {
      fetchContent()
    }
  }, [isExpanded, content.length, fetchContent])

  const getLifecycleStateBadge = (state: string) => {
    const stateStyles = {
      DRAFT: 'bg-gray-100 text-gray-800',
      IN_REVIEW: 'bg-yellow-100 text-yellow-800',
      PUBLISHED: 'bg-green-100 text-green-800',
      NEEDS_UPDATE: 'bg-orange-100 text-orange-800',
      ARCHIVED: 'bg-red-100 text-red-800',
      DEPRECATED: 'bg-red-100 text-red-800'
    }

    return stateStyles[state as keyof typeof stateStyles] || 'bg-gray-100 text-gray-800'
  }

  const getContentTypeIcon = () => {
    return <DocumentTextIcon className="h-4 w-4" />
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header - clickable to expand/collapse */}
      <div
        className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div
                className="w-8 h-8 rounded"
                style={{ backgroundColor: domainColor }}
              ></div>
            </div>
            <div className="ml-5 flex-1">
              <h3 className="text-sm font-medium text-gray-500 truncate">
                {domainName}
              </h3>
              <p className="text-lg font-medium text-gray-900">
                {content.length > 0 ? `${content.length} documents` : 'Click to expand'}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            {isExpanded ? (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Expandable content list */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {loading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-pulse">Checking for documents...</div>
            </div>
          )}

          {error && (
            <div className="p-4 text-center">
              <div className="text-red-500 mb-2">
                {error}
              </div>
              <button
                onClick={fetchContent}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-50"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && content.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No published documents found in this domain.
            </div>
          )}

          {!loading && !error && content.length > 0 && (
            <div className="divide-y divide-gray-200">
              {content.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 pt-1">
                      {getContentTypeIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          <a
                            href={`/content/${item.id}`}
                            className="hover:text-blue-600"
                          >
                            {item.title}
                          </a>
                        </h4>
                        <div className="flex items-center space-x-2 ml-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLifecycleStateBadge(item.lifecycleState)}`}>
                            {item.lifecycleState.toLowerCase()}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {item.contentType.toLowerCase()}
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {item.summary}
                      </p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span>By {item.owner.name || item.owner.email}</span>
                        <span className="mx-1">•</span>
                        <span>Updated {new Date(item.updatedAt).toLocaleDateString()}</span>
                        {item.publishedAt && (
                          <>
                            <span className="mx-1">•</span>
                            <span>Published {new Date(item.publishedAt).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}