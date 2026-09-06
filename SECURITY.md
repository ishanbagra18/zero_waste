# Security Policy for ZeroWaste 🛡️

ZeroWaste takes the security of our platform, APIs, user authentication, and food donor/recipient data seriously. We appreciate the efforts of security researchers and open-source contributors in helping keep our community safe.

---

## Supported Versions

Only the latest release/main branch of ZeroWaste is actively supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| Main    | :white_check_mark: |
| < 1.0.0 | :x:                |

---

## Reporting a Vulnerability

If you discover a security vulnerability in ZeroWaste, please report it privately rather than creating a public GitHub issue.

### Preferred Reporting Method

- **Email**: Contact the repository maintainers or send an email detailing the security issue.
- **GitHub Security Advisories**: If available, submit a report via the "Security" tab -> "Report a vulnerability" on GitHub.

### What to Include in Your Report

To help us triage and resolve the issue quickly, please include:
1. **Description**: A summary of the vulnerability and its potential impact.
2. **Components Affected**: Specify affected modules (`backend/routes/user.js`, JWT auth middleware, OTP verification state, Socket.io channels, Docker setup, etc.).
3. **Steps to Reproduce**: Detailed steps, proof-of-concept script, or HTTP requests illustrating the issue.
4. **Environment**: Operating System, Node.js version, browser used.

---

## Security Scope & Focus Areas

Key areas where security rigor is required in ZeroWaste:

- **Authentication & JWT**: Ensuring secure cookie flags (`HttpOnly`, `SameSite`), token expiration, and proper password hashing (`bcrypt`).
- **Authorization & Role Guards**: Verifying proper access control between `vendor`, `NGO`, and `volunteer` endpoints.
- **Dual-Phase OTP State Machine**: Preventing race conditions or unauthorized state overrides during food pickup and delivery handoffs.
- **Environment Secrets**: Ensuring API keys (`BOT_API_KEY`, `CLOUD_NAME`, `JWT_TOKEN`) are never hardcoded or exposed to client bundles.
- **Input Validation**: Sanitizing user input in registration, food creation forms, and direct messaging to prevent XSS or Injection vulnerabilities.

---

## Vulnerability Disclosure Timeline

1. **Acknowledgment**: We will acknowledge receipt of your security report within 48 hours.
2. **Investigation**: We will investigate and attempt to reproduce the vulnerability within 5 business days.
3. **Patch & Release**: If verified, we will develop a patch and deploy an update as promptly as possible.
4. **Public Disclosure**: Once a fix is released, we will credit the reporter (unless anonymity is requested) in our release notes.

Thank you for helping keep ZeroWaste secure! ♻️
