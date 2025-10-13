# Security Policy

## Supported Versions

We actively support the following versions of CodeMentor AI Platform:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 🚨 For Critical Security Issues

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please:

1. **Email us directly**: security@codementor-ai.com
2. **Include the following information**:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Any suggested fixes (if available)

### 📧 Email Template

```
Subject: [SECURITY] Vulnerability Report for CodeMentor AI Platform

Description:
[Detailed description of the security issue]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Impact:
[Description of potential impact]

Environment:
- OS: [Operating System]
- Browser: [If applicable]
- Version: [Platform version]

Additional Information:
[Any other relevant details]
```

### 🕐 Response Timeline

- **Initial Response**: Within 48 hours
- **Assessment**: Within 1 week
- **Fix Timeline**: Depends on severity
  - Critical: 24-72 hours
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: Next scheduled release

### 🏆 Security Hall of Fame

We recognize security researchers who help keep CodeMentor AI secure:

- *Be the first to help us improve our security!*

### 🛡️ Security Best Practices for Contributors

When contributing to the project:

1. **Never commit secrets**: Use environment variables for all sensitive data
2. **Validate inputs**: Always validate and sanitize user inputs
3. **Use HTTPS**: Ensure all external communications use secure protocols
4. **Keep dependencies updated**: Regularly update npm and pip packages
5. **Follow OWASP guidelines**: Apply security best practices in web development

### 📋 Common Security Areas

Please pay special attention to:

- **Authentication & Authorization**: JWT handling, session management
- **Input Validation**: Code execution sandbox, user inputs
- **API Security**: Rate limiting, input sanitization
- **Data Protection**: User data privacy, encryption at rest
- **Infrastructure**: Container security, environment configuration

### 🔒 Vulnerability Disclosure Policy

- We request a **90-day disclosure timeline** to allow proper fixes
- We will acknowledge your contribution in our security advisories
- We may offer recognition in our contributors list (with your permission)
- We do not currently offer monetary bounties, but we greatly appreciate responsible disclosure

### 📞 Contact Information

- **Security Team**: security@codementor-ai.com
- **General Contact**: support@codementor-ai.com
- **GitHub Issues**: For non-security related issues only

---

Thank you for helping keep CodeMentor AI Platform and our users safe! 🛡️