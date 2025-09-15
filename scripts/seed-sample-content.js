const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const sampleContent = [
  // Engineering Documents
  {
    title: "API Development Standards",
    summary: "Comprehensive guidelines for developing consistent and maintainable APIs across all engineering projects.",
    body: `# API Development Standards

## Overview
This document outlines the standards and best practices for API development within our organization.

## REST API Design Principles

### 1. Resource-Based URLs
- Use nouns, not verbs in URLs
- Use plural nouns for collections
- Example: \`/api/users\` not \`/api/getUsers\`

### 2. HTTP Methods
- GET: Retrieve data
- POST: Create new resources
- PUT: Update entire resources
- PATCH: Partial updates
- DELETE: Remove resources

### 3. Status Codes
- 200 OK: Successful GET, PUT, PATCH
- 201 Created: Successful POST
- 204 No Content: Successful DELETE
- 400 Bad Request: Invalid request
- 401 Unauthorized: Authentication required
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource doesn't exist
- 500 Internal Server Error: Server error

## Authentication
All APIs must implement JWT-based authentication with the following requirements:
- Token expiration: 24 hours
- Refresh token mechanism required
- Rate limiting: 1000 requests per hour per user

## Documentation
- All APIs must be documented using OpenAPI 3.0
- Include examples for all endpoints
- Document error responses

## Testing
- Unit tests required for all endpoints
- Integration tests for critical paths
- Performance testing for high-traffic endpoints`,
    contentType: "STANDARD",
    domainId: "engineering",
    sensitivity: "INTERNAL",
    lifecycleState: "PUBLISHED",
    reviewCycle: 12
  },
  {
    title: "Code Review Process SOP",
    summary: "Standard operating procedure for conducting thorough and effective code reviews to maintain code quality.",
    body: `# Code Review Process SOP

## Purpose
Establish a standardized process for code reviews to ensure code quality, knowledge sharing, and compliance with coding standards.

## Scope
This SOP applies to all code changes including features, bug fixes, and configuration updates.

## Procedure

### 1. Pre-Review Requirements
- [ ] Code is feature-complete
- [ ] Unit tests written and passing
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No merge conflicts

### 2. Creating Pull Request
1. Create descriptive PR title
2. Fill out PR template completely
3. Add relevant labels and assignees
4. Link related issues
5. Request review from 2+ team members

### 3. Review Process
**For Reviewers:**
- Review within 24 hours
- Check for:
  - Functionality correctness
  - Code clarity and maintainability
  - Security vulnerabilities
  - Performance implications
  - Test coverage

**Review Checklist:**
- [ ] Code follows style guidelines
- [ ] No security vulnerabilities introduced
- [ ] Error handling is appropriate
- [ ] Tests adequately cover new code
- [ ] Documentation is updated
- [ ] No breaking changes without migration plan

### 4. Approval Process
- **2 approvals required** for production code
- **1 approval required** for documentation/config
- All feedback must be addressed or acknowledged
- CI/CD pipeline must pass

### 5. Merge Requirements
- Squash commits for feature branches
- Use conventional commit messages
- Delete feature branch after merge

## Tools
- GitHub/GitLab for PR management
- SonarQube for code quality analysis
- SAST tools for security scanning`,
    contentType: "SOP",
    domainId: "engineering",
    sensitivity: "INTERNAL",
    lifecycleState: "PUBLISHED",
    reviewCycle: 6
  },
  {
    title: "Database Migration Guidelines",
    summary: "Technical note covering best practices for database schema migrations and data transformations.",
    body: `# Database Migration Guidelines

## Overview
This technical note provides guidelines for safe database migrations in production environments.

## Migration Principles

### 1. Backward Compatibility
- New migrations should not break existing code
- Use feature flags for schema changes
- Plan multi-step migrations for breaking changes

### 2. Rollback Strategy
- Every migration must be reversible
- Test rollback procedures in staging
- Document rollback steps

### 3. Performance Considerations
- Run heavy migrations during low-traffic periods
- Use batching for large data updates
- Monitor database performance during migrations

## Migration Process

### Pre-Migration
1. **Planning**
   - Document expected downtime
   - Identify affected services
   - Plan rollback procedure
   - Schedule during maintenance window

2. **Testing**
   - Test migration on staging environment
   - Verify data integrity after migration
   - Test application functionality
   - Benchmark performance impact

### During Migration
1. **Execution**
   - Take database backup
   - Enable maintenance mode if needed
   - Run migration scripts
   - Verify completion

2. **Validation**
   - Check data integrity
   - Verify application functionality
   - Monitor error logs
   - Confirm performance metrics

### Post-Migration
1. **Cleanup**
   - Remove old columns/tables (after grace period)
   - Update documentation
   - Remove feature flags
   - Archive migration artifacts

## Common Patterns

### Adding Columns
\`\`\`sql
-- Safe: Add nullable column
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Later: Add default value
UPDATE users SET phone = '' WHERE phone IS NULL;

-- Finally: Add NOT NULL constraint
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;
\`\`\`

### Removing Columns
\`\`\`sql
-- Step 1: Stop writing to column (code deployment)
-- Step 2: Remove column (after confirmation)
ALTER TABLE users DROP COLUMN old_field;
\`\`\`

## Monitoring
- Set up alerts for migration failures
- Monitor database performance metrics
- Track migration execution time
- Log all migration activities`,
    contentType: "TECH_NOTE",
    domainId: "engineering",
    sensitivity: "INTERNAL",
    lifecycleState: "PUBLISHED",
    reviewCycle: 12
  },

  // Operations Documents
  {
    title: "Incident Response Policy",
    summary: "Comprehensive policy for responding to and managing incidents to minimize impact and ensure rapid resolution.",
    body: `# Incident Response Policy

## Purpose
Establish clear procedures for incident detection, response, and resolution to minimize business impact and ensure service reliability.

## Definitions

**Incident**: Any unplanned interruption to an IT service or reduction in quality of service.

**Severity Levels:**
- **P0 (Critical)**: Complete service outage affecting all users
- **P1 (High)**: Major functionality unavailable affecting many users
- **P2 (Medium)**: Minor functionality issues affecting some users
- **P3 (Low)**: Cosmetic issues or edge cases

## Incident Response Team

### Roles and Responsibilities

**Incident Commander (IC)**
- Overall incident coordination
- Communication with stakeholders
- Decision making authority
- Post-incident review coordination

**Technical Lead**
- Technical investigation and resolution
- Coordinate with engineering teams
- Implement fixes and workarounds

**Communications Lead**
- Internal and external communications
- Status page updates
- Customer notifications

## Response Procedures

### 1. Detection and Alerting
- Automated monitoring alerts
- Customer reports via support channels
- Internal team notifications

### 2. Initial Response (Within 15 minutes)
1. Acknowledge the incident
2. Assess severity level
3. Form incident response team
4. Create incident tracking ticket
5. Begin initial investigation

### 3. Investigation and Containment
1. Identify root cause
2. Implement immediate containment
3. Document findings in incident ticket
4. Provide regular updates (every 30 minutes for P0/P1)

### 4. Resolution and Recovery
1. Implement permanent fix
2. Verify service restoration
3. Monitor for regression
4. Update status communications

### 5. Post-Incident Activities
1. Conduct post-incident review within 48 hours
2. Document lessons learned
3. Create action items for improvements
4. Update runbooks and procedures

## Communication Guidelines

### Internal Communications
- Use dedicated incident Slack channel
- Include severity, impact, and timeline in updates
- Notify stakeholders based on severity matrix

### External Communications
- Update status page within 30 minutes
- Send customer notifications for P0/P1 incidents
- Provide resolution timeline estimates

## Escalation Matrix

| Severity | Initial Response | Escalation Time | Stakeholders |
|----------|-----------------|-----------------|--------------|
| P0 | Immediate | 30 minutes | All hands, C-level |
| P1 | 15 minutes | 1 hour | Engineering, Operations |
| P2 | 1 hour | 4 hours | Team leads |
| P3 | 4 hours | Next business day | Team members |

## Training and Preparedness
- Quarterly incident response drills
- Annual policy review and updates
- New employee incident response training
- Regular runbook maintenance`,
    contentType: "POLICY",
    domainId: "operations",
    sensitivity: "INTERNAL",
    lifecycleState: "PUBLISHED",
    reviewCycle: 12
  },
  {
    title: "Server Maintenance Work Instructions",
    summary: "Step-by-step instructions for performing routine server maintenance including patching, updates, and health checks.",
    body: `# Server Maintenance Work Instructions

## Purpose
Provide detailed instructions for performing routine server maintenance to ensure system reliability and security.

## Scope
These instructions apply to all production and staging servers in our infrastructure.

## Prerequisites
- Administrative access to target servers
- Maintenance window approval
- Backup verification completed
- Change request approved

## Pre-Maintenance Checklist

### 1. Planning (24 hours before)
- [ ] Verify maintenance window
- [ ] Confirm backup completion
- [ ] Notify stakeholders
- [ ] Prepare rollback plan
- [ ] Check for critical business processes

### 2. Preparation (2 hours before)
- [ ] Connect to VPN
- [ ] Verify access to all systems
- [ ] Enable maintenance mode
- [ ] Take final backup snapshot
- [ ] Confirm monitoring alerts

## Maintenance Procedures

### Security Updates

#### Step 1: Package Updates
\`\`\`bash
# Update package lists
sudo apt update

# List available updates
sudo apt list --upgradable

# Install security updates only
sudo unattended-upgrade

# Verify updates
sudo apt list --installed | grep -i security
\`\`\`

#### Step 2: Kernel Updates
\`\`\`bash
# Check current kernel version
uname -r

# Install kernel updates if available
sudo apt install linux-image-generic

# Verify boot configuration
sudo update-grub
\`\`\`

#### Step 3: Service Restart
1. Check services requiring restart:
   \`\`\`bash
   sudo checkrestart
   \`\`\`

2. Restart services in order:
   - Application services
   - Web servers
   - Database connections
   - System services

3. Verify service status:
   \`\`\`bash
   sudo systemctl status <service-name>
   \`\`\`

### System Health Checks

#### Disk Space
\`\`\`bash
# Check disk usage
df -h

# Check for large files
sudo find / -type f -size +100M 2>/dev/null

# Clean package cache if needed
sudo apt autoremove
sudo apt autoclean
\`\`\`

#### Memory and CPU
\`\`\`bash
# Check memory usage
free -h

# Check CPU usage
top -n 1

# Check load average
uptime
\`\`\`

#### Network Connectivity
\`\`\`bash
# Test internal connectivity
ping -c 3 internal-server

# Test external connectivity
ping -c 3 8.8.8.8

# Check listening ports
sudo netstat -tlnp
\`\`\`

### Log Rotation and Cleanup

#### Application Logs
\`\`\`bash
# Rotate application logs
sudo logrotate -f /etc/logrotate.d/application

# Compress old logs
sudo find /var/log -name "*.log" -mtime +7 -exec gzip {} \;

# Remove very old logs
sudo find /var/log -name "*.gz" -mtime +30 -delete
\`\`\`

## Post-Maintenance Verification

### 1. Service Verification
- [ ] All critical services running
- [ ] Database connections working
- [ ] Web applications responding
- [ ] Monitoring alerts cleared

### 2. Performance Check
- [ ] Response times normal
- [ ] Resource utilization healthy
- [ ] No error spikes in logs
- [ ] User experience validated

### 3. Documentation
- [ ] Update maintenance log
- [ ] Document any issues encountered
- [ ] Update system inventory
- [ ] Notify completion to stakeholders

## Troubleshooting

### Common Issues

**Service Won't Start**
1. Check service logs: \`sudo journalctl -u service-name\`
2. Verify configuration files
3. Check file permissions
4. Restart dependencies first

**High Resource Usage**
1. Identify top processes: \`top\` or \`htop\`
2. Check for runaway processes
3. Review recent changes
4. Consider temporary scaling

**Network Issues**
1. Check firewall rules
2. Verify DNS resolution
3. Test routing tables
4. Check interface status

## Emergency Contacts
- Operations Team: ops-oncall@company.com
- Infrastructure Lead: +1-555-0123
- Emergency Escalation: +1-555-0199`,
    contentType: "WORK_INSTRUCTION",
    domainId: "operations",
    sensitivity: "INTERNAL",
    lifecycleState: "PUBLISHED",
    reviewCycle: 6
  },

  // Compliance Documents
  {
    title: "Data Privacy Policy",
    summary: "Comprehensive policy outlining data handling practices, privacy protection measures, and regulatory compliance requirements.",
    body: `# Data Privacy Policy

## Purpose
This policy establishes guidelines for the collection, use, storage, and protection of personal data in compliance with applicable privacy regulations including GDPR, CCPA, and other relevant laws.

## Scope
This policy applies to all employees, contractors, and third parties who handle personal data on behalf of the organization.

## Definitions

**Personal Data**: Any information relating to an identified or identifiable natural person.

**Data Subject**: An individual whose personal data is processed by the organization.

**Data Controller**: The entity that determines the purposes and means of processing personal data.

**Data Processor**: The entity that processes personal data on behalf of the data controller.

## Data Collection Principles

### 1. Lawfulness and Transparency
- Personal data must be collected for specified, explicit, and legitimate purposes
- Data subjects must be informed about data collection and processing
- Consent must be freely given, specific, informed, and unambiguous

### 2. Data Minimization
- Collect only personal data that is necessary for the stated purpose
- Avoid collecting excessive or irrelevant data
- Regularly review data collection practices

### 3. Purpose Limitation
- Personal data must not be processed for purposes incompatible with the original purpose
- New purposes require additional legal basis or consent
- Document purpose changes and notify data subjects

## Data Processing Requirements

### Legal Basis for Processing
Processing must be based on one of the following:
- Consent of the data subject
- Performance of a contract
- Compliance with legal obligation
- Protection of vital interests
- Performance of public task
- Legitimate interests (when balanced against individual rights)

### Data Subject Rights
Individuals have the right to:
- Access their personal data
- Rectification of inaccurate data
- Erasure ("right to be forgotten")
- Restriction of processing
- Data portability
- Object to processing
- Not be subject to automated decision-making

### Response Requirements
- Respond to requests within 30 days
- Verify identity before processing requests
- Document all requests and responses
- Escalate complex requests to privacy team

## Data Security Measures

### Technical Safeguards
- Encryption at rest and in transit
- Access controls and authentication
- Regular security assessments
- Incident response procedures

### Organizational Measures
- Privacy by design and default
- Regular staff training
- Data processing agreements with vendors
- Privacy impact assessments

## Data Retention and Disposal

### Retention Periods
| Data Category | Retention Period | Legal Basis |
|---------------|------------------|-------------|
| Customer Data | 7 years after contract end | Legal requirement |
| Employee Records | 7 years after employment end | Legal requirement |
| Marketing Data | Until consent withdrawn | Consent |
| Website Analytics | 26 months | Legitimate interest |

### Secure Disposal
- Use certified data destruction methods
- Document disposal activities
- Verify complete data removal
- Update data inventories

## International Data Transfers

### Transfer Mechanisms
- Adequacy decisions
- Standard contractual clauses
- Binding corporate rules
- Derogations for specific situations

### Documentation Requirements
- Transfer impact assessments
- Supplementary measures where needed
- Regular review of transfer arrangements
- Data subject notifications

## Incident Response

### Data Breach Procedures
1. **Immediate Response (0-72 hours)**
   - Contain the breach
   - Assess scope and impact
   - Notify privacy team
   - Document incident details

2. **Regulatory Notification (72 hours)**
   - Notify supervisory authority if required
   - Include required information
   - Submit through official channels
   - Maintain communication log

3. **Individual Notification**
   - Notify affected individuals if high risk
   - Use clear and plain language
   - Provide specific guidance
   - Offer assistance where appropriate

## Training and Awareness

### Mandatory Training
- Annual privacy training for all staff
- Role-specific training for data handlers
- New employee privacy orientation
- Regular updates on regulatory changes

### Training Content
- Privacy principles and requirements
- Individual rights and procedures
- Security best practices
- Incident reporting procedures

## Governance and Oversight

### Privacy Officer Responsibilities
- Monitor compliance with policy
- Conduct privacy impact assessments
- Manage data subject requests
- Liaise with regulatory authorities

### Regular Reviews
- Annual policy review and update
- Quarterly compliance assessments
- Data inventory maintenance
- Vendor privacy compliance monitoring

## Contact Information
- Privacy Officer: privacy@company.com
- Data Protection Hotline: +1-555-PRIVACY
- Incident Reporting: security@company.com`,
    contentType: "POLICY",
    domainId: "compliance",
    sensitivity: "INTERNAL",
    lifecycleState: "PUBLISHED",
    reviewCycle: 12
  },
  {
    title: "Vendor Risk Assessment Form",
    summary: "Standardized form for evaluating third-party vendors to ensure compliance with security and regulatory requirements.",
    body: `# Vendor Risk Assessment Form

## Instructions
Complete this form for all new vendors and annually for existing vendors. Submit to Compliance team for review before contract execution.

## Section 1: Vendor Information

**Vendor Name:** ________________________________

**Primary Contact:** ____________________________

**Email:** ____________________________________

**Phone:** ____________________________________

**Service/Product Description:**
________________________________________________
________________________________________________

**Contract Value:** $____________________________

**Contract Duration:** ___________________________

## Section 2: Risk Categories

### 2.1 Data Handling (Check all that apply)
- [ ] Vendor will NOT access our data
- [ ] Vendor will access customer data
- [ ] Vendor will access employee data
- [ ] Vendor will access financial data
- [ ] Vendor will access intellectual property
- [ ] Vendor will process payment information

**If any data access, describe types and purposes:**
________________________________________________
________________________________________________

### 2.2 Security Requirements
Rate each area (1=Poor, 2=Fair, 3=Good, 4=Excellent, N/A=Not Applicable):

**Access Controls**
- Multi-factor authentication: ___
- Role-based access: ___
- Regular access reviews: ___

**Data Protection**
- Encryption at rest: ___
- Encryption in transit: ___
- Data backup procedures: ___

**Security Monitoring**
- Intrusion detection: ___
- Log monitoring: ___
- Incident response plan: ___

**Compliance Certifications (Check all that apply)**
- [ ] SOC 2 Type II
- [ ] ISO 27001
- [ ] PCI DSS
- [ ] HIPAA compliant
- [ ] GDPR compliant
- [ ] Other: ________________________

### 2.3 Business Continuity
**Disaster Recovery Plan:** [ ] Yes [ ] No

**Business Continuity Plan:** [ ] Yes [ ] No

**RTO (Recovery Time Objective):** _______________

**RPO (Recovery Point Objective):** ______________

**Backup Vendor Available:** [ ] Yes [ ] No

### 2.4 Financial Stability
**Annual Revenue:** _____________________________

**Years in Business:** ___________________________

**Financial References:** [ ] Provided [ ] Requested

**Insurance Coverage:**
- General Liability: $________________________
- Professional Liability: $____________________
- Cyber Liability: $___________________________

## Section 3: Risk Assessment

### 3.1 Risk Level Determination
Based on the above factors, assign overall risk level:

- [ ] **Low Risk**: No data access, minimal business impact
- [ ] **Medium Risk**: Limited data access, moderate business impact
- [ ] **High Risk**: Extensive data access, significant business impact
- [ ] **Critical Risk**: Core business functions, regulatory implications

### 3.2 Risk Mitigation Measures Required

**For Medium Risk and above, identify required controls:**

**Contractual Requirements:**
- [ ] Data Processing Agreement (DPA)
- [ ] Business Associate Agreement (BAA)
- [ ] Service Level Agreement (SLA)
- [ ] Right to audit clause
- [ ] Data breach notification requirements
- [ ] Termination and data return procedures

**Technical Requirements:**
- [ ] Encryption specifications
- [ ] Access control requirements
- [ ] Logging and monitoring
- [ ] Vulnerability scanning
- [ ] Penetration testing

**Ongoing Monitoring:**
- [ ] Quarterly security reviews
- [ ] Annual risk re-assessment
- [ ] Continuous compliance monitoring
- [ ] Performance metrics tracking

## Section 4: Documentation Requirements

**Required Documents (attach all applicable):**
- [ ] SOC 2 Report
- [ ] ISO 27001 Certificate
- [ ] Cyber insurance policy
- [ ] Data security policies
- [ ] Incident response procedures
- [ ] Business continuity plan
- [ ] Financial statements
- [ ] Reference letters

## Section 5: Approvals

### Risk Assessment Completed By:
**Name:** ______________________________________

**Title:** _____________________________________

**Date:** ______________________________________

**Signature:** __________________________________

### Compliance Review:
**Reviewer Name:** ______________________________

**Risk Level Approved:** _________________________

**Additional Requirements:**
________________________________________________
________________________________________________

**Approval Date:** _______________________________

**Signature:** __________________________________

### Final Authorization:
**Department Head:** ____________________________

**Date:** ______________________________________

**Signature:** __________________________________

## Section 6: Review Schedule

**Next Review Due:** ____________________________

**Review Frequency:** ____________________________

**Review Owner:** _______________________________

---

*Submit completed form to compliance@company.com*
*For questions, contact Compliance team at +1-555-COMPLY*`,
    contentType: "FORM_TEMPLATE",
    domainId: "compliance",
    sensitivity: "INTERNAL",
    lifecycleState: "PUBLISHED",
    reviewCycle: 12
  }
]

async function seedContent() {
  try {
    console.log('Starting content seeding...')

    // First, ensure domains exist
    await prisma.domain.createMany({
      data: [
        {
          id: 'engineering',
          name: 'Engineering',
          slug: 'engineering',
          description: 'Technical documentation, SOPs, and standards',
          color: '#3B82F6',
          icon: 'code'
        },
        {
          id: 'operations',
          name: 'Operations',
          slug: 'operations',
          description: 'Operational procedures and guidelines',
          color: '#10B981',
          icon: 'cog'
        },
        {
          id: 'compliance',
          name: 'Compliance',
          slug: 'compliance',
          description: 'Regulatory and compliance documentation',
          color: '#EF4444',
          icon: 'shield'
        }
      ],
      skipDuplicates: true
    })

    // Create a default user if none exists
    let user = await prisma.user.findFirst()
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          name: 'System Administrator',
          role: 'ADMIN'
        }
      })
    }

    // Create sample content
    for (const content of sampleContent) {
      // Generate slug from title
      const slug = content.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      await prisma.content.create({
        data: {
          ...content,
          slug,
          ownerId: user.id,
          authorId: user.id,
          publishedAt: new Date(),
          nextReviewDate: new Date(Date.now() + content.reviewCycle * 30 * 24 * 60 * 60 * 1000)
        }
      })

      console.log(`Created: ${content.title}`)
    }

    console.log('✅ Content seeding completed successfully!')

  } catch (error) {
    console.error('❌ Error seeding content:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedContent()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })