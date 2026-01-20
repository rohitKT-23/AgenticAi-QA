# 🚀 Quick Start Guide - Agentic Test Generator

## 5-Minute Tutorial

### Step 1: Start the Application

```bash
cd d:/techcarrot/AgenticAi
npm install
npm start
```

Open browser: `http://localhost:3000`

---

## Example Use Cases

### 📝 Example 1: Simple Feature

**Input:**

```
Users can reset their password using their registered email address.
```

**Generated Tests:**

- ✅ Valid email - password reset successful
- ❌ Invalid email format - error displayed
- ❌ Unregistered email - error displayed
- ❌ Expired reset token - error displayed
- 🔒 SQL injection in email field - sanitized
- 🔒 XSS in email field - escaped

**Coverage:** 100%

---

### 📝 Example 2: File Upload Feature

**Input:**

```
Users can upload files up to 10MB.
Supported formats: PDF, JPG, PNG, DOCX
Users must be authenticated to upload files.
Files are scanned for viruses before storage.
Upload progress is shown to the user.
```

**Generated Tests:**

| ID     | Title                                | Type       | Priority |
| ------ | ------------------------------------ | ---------- | -------- |
| TC-001 | Upload - Valid scenario (Happy Path) | Functional | High     |
| TC-002 | Upload - Invalid input data          | Negative   | High     |
| TC-003 | Upload - Unauthorized access attempt | Negative   | High     |
| TC-004 | Upload - File Size = 0MB             | Boundary   | Medium   |
| TC-005 | Upload - File Size = 1MB             | Boundary   | Medium   |
| TC-006 | Upload - File Size = 9MB             | Boundary   | Medium   |
| TC-007 | Upload - File Size = 10MB            | Boundary   | Medium   |
| TC-008 | Upload - File Size = 11MB            | Boundary   | Medium   |
| TC-009 | Upload - SQL Injection attempt       | Security   | Critical |
| TC-010 | Upload - XSS attack prevention       | Security   | Critical |

**Coverage:** 100%

**AI Insights:**

- **Features Detected:** Upload
- **Actors:** User
- **Business Rules:** Max size: 10MB, Authentication required, Input validation required
- **Assumptions:** File type validation exists, Virus scanning may be performed

---

### 📝 Example 3: REST API Endpoint

**Input:**

```
POST /api/users - User Registration Endpoint

Required fields:
- email (string, valid email format, unique)
- password (string, min 8 chars, must include uppercase, lowercase, number, special char)
- name (string, 2-50 characters)

Returns:
- 201 Created on success with user object
- 400 Bad Request on validation error
- 409 Conflict if email already exists
- 429 Too Many Requests if rate limit exceeded (10 requests/minute)
```

**Generated Tests:**

1. **Functional Tests:**
   - Valid registration with all fields
   - Successful 201 response

2. **Negative Tests:**
   - Missing email field → 400
   - Missing password field → 400
   - Missing name field → 400
   - Invalid email format → 400
   - Password too short → 400
   - Password missing uppercase → 400
   - Password missing number → 400
   - Password missing special char → 400
   - Name too short (1 char) → 400
   - Name too long (51 chars) → 400
   - Duplicate email → 409

3. **Boundary Tests:**
   - Password exactly 8 chars → Success
   - Password 7 chars → Error
   - Name exactly 2 chars → Success
   - Name exactly 50 chars → Success
   - Name 1 char → Error
   - Name 51 chars → Error

4. **Security Tests:**
   - SQL injection in email → Sanitized
   - XSS in name field → Escaped
   - Password stored hashed → Verified

5. **Performance Tests:**
   - 10 requests in 1 minute → Success
   - 11 requests in 1 minute → 429

**Coverage:** 100%

---

### 📝 Example 4: E-commerce Checkout

**Input:**

```
Users can complete checkout with credit card payment.

Supported cards: Visa, Mastercard, American Express
Payment amount: $1 - $10,000
3D Secure authentication required for amounts > $100
Order confirmation email sent after successful payment
Failed payments are logged and user is notified
```

**Generated Tests:**

1. **Functional:**
   - Valid Visa card, amount $50 → Success
   - Valid Mastercard, amount $150 (3DS) → Success
   - Valid Amex, amount $5000 (3DS) → Success

2. **Negative:**
   - Invalid card number → Error
   - Expired card → Error
   - Insufficient funds → Error
   - Amount $0 → Error
   - Amount $10,001 → Error
   - Unsupported card (Discover) → Error

3. **Boundary:**
   - Amount $1 (min) → Success
   - Amount $0.99 → Error
   - Amount $100 (3DS threshold) → Success (no 3DS)
   - Amount $100.01 → Success (with 3DS)
   - Amount $10,000 (max) → Success
   - Amount $10,000.01 → Error

4. **Security:**
   - Card number not logged → Verified
   - CVV not stored → Verified
   - PCI compliance → Verified

**Coverage:** 100%

---

## Export Examples

### Gherkin (BDD) Format

```gherkin
Feature: Upload

Scenario: Valid scenario
  Given user has valid
  When user performs the action
  Then system should success

Scenario: Invalid input
  Given user has invalid
  When user performs the action
  Then system should error

Scenario: Unauthorized access
  Given user has unauthenticated
  When user performs the action
  Then system should denied
```

### JSON Format

```json
[
  {
    "id": "TC-001",
    "title": "Upload - Valid scenario (Happy Path)",
    "type": "Functional",
    "priority": "High",
    "risk": "High",
    "preconditions": [
      "User authentication is required",
      "File type validation exists"
    ],
    "steps": [
      "Navigate to the feature",
      "Enter valid input data",
      "Submit the request",
      "Verify successful completion"
    ],
    "expectedResult": "Operation completes successfully with appropriate confirmation"
  }
]
```

### Markdown Format

```markdown
# Test Cases

## TC-001: Upload - Valid scenario (Happy Path)

**Type:** Functional  
**Priority:** High  
**Risk:** High

**Preconditions:**

- User authentication is required
- File type validation exists

**Steps:**

1. Navigate to the feature
2. Enter valid input data
3. Submit the request
4. Verify successful completion

**Expected Result:** Operation completes successfully with appropriate confirmation

---
```

### CSV Format

```csv
ID,Title,Type,Priority,Risk,Preconditions,Steps,Expected Result
"TC-001","Upload - Valid scenario (Happy Path)","Functional","High","High","User authentication is required; File type validation exists","Navigate to the feature; Enter valid input data; Submit the request; Verify successful completion","Operation completes successfully with appropriate confirmation"
```

---

## Tips for Best Results

### ✅ DO:

1. **Be Specific:**

   ```
   ✅ "Users can upload files up to 10MB in PDF, JPG, PNG formats"
   ❌ "Users can upload files"
   ```

2. **Include Constraints:**

   ```
   ✅ "Password must be 8-20 characters with uppercase, lowercase, number"
   ❌ "Users need a password"
   ```

3. **Mention Authentication:**

   ```
   ✅ "Users must be logged in to access this feature"
   ❌ (Assume AI will infer)
   ```

4. **Specify Limits:**
   ```
   ✅ "Maximum 5 items per order, minimum 1"
   ❌ "Users can add items to cart"
   ```

### ❌ DON'T:

1. **Be Too Vague:**

   ```
   ❌ "The system should work"
   ❌ "Users can do stuff"
   ```

2. **Mix Multiple Features:**

   ```
   ❌ "Users can login, upload files, make payments, and send messages"
   ✅ Generate separately for each feature
   ```

3. **Use Technical Jargon Without Context:**
   ```
   ❌ "Implement OAuth2 flow"
   ✅ "Users authenticate using Google/Facebook login (OAuth2)"
   ```

---

## Quick Reference

### Keyboard Shortcuts

- **Ctrl + Enter** in textarea → Generate test cases

### Quick Examples

Click these buttons to try:

- 🔐 **Login Feature** - Authentication flow
- 📤 **File Upload** - File handling with constraints
- 💳 **Payment Processing** - E-commerce checkout
- 🔌 **REST API** - API endpoint testing

### Coverage Score Guide

| Score | Meaning                                                             |
| ----- | ------------------------------------------------------------------- |
| 100%  | All test types generated (Functional, Negative, Boundary, Security) |
| 80%   | Missing 1 test type                                                 |
| 60%   | Missing 2 test types                                                |
| < 60% | Incomplete coverage                                                 |

### Test Type Breakdown

- **Functional (30%)** - Happy path scenarios
- **Negative (30%)** - Error handling
- **Boundary (20%)** - Edge cases
- **Security (20%)** - Security vulnerabilities

---

## Troubleshooting

### Issue: No test cases generated

**Solution:** Make sure your input describes an actual feature or functionality.

### Issue: Coverage score is low

**Solution:**

- Check the checkboxes for Security, Boundary, and Negative tests
- Provide more details in your input

### Issue: Tests are too generic

**Solution:**

- Add specific constraints (size limits, formats, etc.)
- Mention authentication requirements
- Specify expected behaviors

---

## Next Steps

1. ✅ Try the examples above
2. ✅ Generate tests for your own features
3. ✅ Export to your preferred format
4. ✅ Integrate with your testing framework
5. ✅ Read `ARCHITECTURE.md` for deep dive

---

## API Usage (Programmatic)

### Generate Tests

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Users can upload files up to 10MB",
    "options": {
      "includeSecurity": true,
      "includeBoundary": true,
      "includeNegative": true
    }
  }'
```

### Export Tests

```bash
curl -X POST http://localhost:3000/api/export \
  -H "Content-Type: application/json" \
  -d '{
    "testCases": [...],
    "format": "gherkin"
  }'
```

### Get History

```bash
curl http://localhost:3000/api/history
```

---

## Success Metrics

After using this tool, you should see:

- ⚡ **60-80% reduction** in test design time
- 📈 **Better edge-case coverage** (boundary tests)
- 🔒 **Improved security testing** (SQL injection, XSS)
- 📊 **Consistent test quality** across features
- 🚀 **Faster onboarding** for new QA team members

---

**Ready to revolutionize your testing? Start generating! 🚀**

---

Made with ❤️ using Multi-Agent AI Architecture
