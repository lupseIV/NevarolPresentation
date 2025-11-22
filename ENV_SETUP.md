# Environment Configuration Guide

This guide explains how to properly configure the environment variables in your `.env` file for the NevarolPresentation e-commerce application.

## Quick Start

1. Copy the example file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit the `.env` file with your specific values following the sections below.

## Environment Variables Explained

### DATABASE_URL

**Purpose:** Connection string for PostgreSQL database

**Default Value (Docker Setup):**
```
DATABASE_URL="postgresql://ecommerce:paroal123@localhost:1234/ecommerce?schema=public"
```

**Format:**
```
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

**Configuration:**
- If using the included `docker-compose.yml`, keep the default value
- For custom PostgreSQL installation, update with your credentials:
  - `USERNAME`: Your PostgreSQL username
  - `PASSWORD`: Your PostgreSQL password
  - `HOST`: Database server address (usually `localhost`)
  - `PORT`: Database port (default: `5432`, docker setup uses `1234`)
  - `DATABASE`: Database name (recommended: `ecommerce`)

### SESSION_SECRET

**Purpose:** Secret key used to sign session cookies and secure user sessions

**⚠️ IMPORTANT:** Never use the default value in production!

**How to Generate a Secure Secret:**

**Option 1: Using Node.js (Recommended)**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Using OpenSSL**
```bash
openssl rand -hex 32
```

**Option 3: Using Online Generator**
Visit: https://www.lastpass.com/features/password-generator (64+ characters)

**Example:**
```
SESSION_SECRET="a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"
```

**Requirements:**
- Minimum 32 characters (64+ recommended)
- Use random, unpredictable characters
- Must be different for each environment (development, staging, production)
- Keep it secret and never commit to version control

### EMAIL_HOST

**Purpose:** SMTP server hostname for sending emails

**Common Providers:**

**Gmail:**
```
EMAIL_HOST="smtp.gmail.com"
```

**Outlook/Hotmail:**
```
EMAIL_HOST="smtp-mail.outlook.com"
```

**Yahoo:**
```
EMAIL_HOST="smtp.mail.yahoo.com"
```

**SendGrid:**
```
EMAIL_HOST="smtp.sendgrid.net"
```

**Custom SMTP Server:**
```
EMAIL_HOST="mail.yourdomain.com"
```

### EMAIL_PORT

**Purpose:** SMTP server port

**Common Ports:**

**Port 587 (TLS/STARTTLS - Recommended):**
```
EMAIL_PORT="587"
```
- Most commonly used
- Supports TLS encryption
- Works with Gmail, Outlook, most providers

**Port 465 (SSL):**
```
EMAIL_PORT="465"
```
- Legacy SSL
- Some providers still use this

**Port 25 (Unsecured):**
```
EMAIL_PORT="25"
```
- Not recommended (unencrypted)
- Often blocked by ISPs

**Recommendation:** Use port `587` with TLS

### EMAIL_USER

**Purpose:** Email account username/address for SMTP authentication

**Format:**
```
EMAIL_USER="your-email@example.com"
```

**Examples:**

**Gmail:**
```
EMAIL_USER="myapp@gmail.com"
```

**Outlook:**
```
EMAIL_USER="myapp@outlook.com"
```

**Custom Domain:**
```
EMAIL_USER="noreply@yourdomain.com"
```

**Note:** Use the full email address as the username

### EMAIL_PASS

**Purpose:** Password for SMTP authentication

**⚠️ IMPORTANT:** For most providers, you MUST use an "App Password", not your regular email password!

**Gmail Setup (Step-by-Step):**

1. **Enable 2-Factor Authentication:**
   - Go to your Google Account settings
   - Navigate to Security
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "NevarolPresentation" or similar
   - Click "Generate"
   - Copy the 16-character password (remove spaces)

3. **Add to .env:**
   ```
   EMAIL_PASS="abcdabcdabcdabcd"
   ```

**Outlook/Hotmail Setup:**

1. Go to account settings
2. Navigate to Security → App passwords
3. Generate new app password
4. Use the generated password in .env

**Yahoo Setup:**

1. Go to Account Security
2. Generate app password
3. Use in .env

**Other Providers:**

For services like SendGrid, Mailgun, etc.:
- Use API key as password
- Check provider documentation for specific setup

**Example:**
```
EMAIL_PASS="abcdabcdabcdabcd"
```

### PORT

**Purpose:** Port number for the Express backend server

**Default:**
```
PORT=3000
```

**Configuration:**
- Keep as `3000` for standard setup
- Change if port 3000 is already in use
- Frontend is configured to call `localhost:3000`
- If you change this, update frontend API base URL in `frontend/src/app/services/*.service.ts`

## Complete .env File Example

### Development Setup (with Docker)

```env
DATABASE_URL="postgresql://ecommerce:paroal123@localhost:1234/ecommerce?schema=public"
SESSION_SECRET="dev-secret-change-this-in-production-use-crypto-random-bytes"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="mydevapp@gmail.com"
EMAIL_PASS="abcdabcdabcdabcd"
PORT=3000
```

### Production Setup Example

```env
DATABASE_URL="postgresql://produser:strongpassword@db.example.com:5432/ecommerce?schema=public"
SESSION_SECRET="a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="orders@yourdomain.com"
EMAIL_PASS="yourgeneratedapppassword"
PORT=3000
```

## Testing Email Configuration

After configuring your email settings, test them:

1. **Start the backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Create a test order:**
   - Log in to the application
   - Add items to cart
   - Complete checkout
   - Check your email for order confirmation

3. **Check logs:**
   - Backend console will show email sending status
   - Look for errors related to SMTP

## Troubleshooting

### Email Not Sending

**Problem:** "Invalid login" or "Authentication failed"
- ✅ **Solution:** Make sure you're using an App Password, not your regular email password
- ✅ **Solution:** Verify 2-factor authentication is enabled (required for Gmail)

**Problem:** "Connection timeout"
- ✅ **Solution:** Check firewall settings
- ✅ **Solution:** Verify EMAIL_PORT is correct (587 for most providers)
- ✅ **Solution:** Try different port (465 instead of 587)

**Problem:** "TLS/SSL error"
- ✅ **Solution:** Ensure port 587 is used with STARTTLS
- ✅ **Solution:** Try port 465 for legacy SSL

### Session Issues

**Problem:** Users getting logged out unexpectedly
- ✅ **Solution:** Ensure SESSION_SECRET is set and consistent
- ✅ **Solution:** Don't change SESSION_SECRET on a running server
- ✅ **Solution:** Use a long, random string (64+ characters)

### Database Connection

**Problem:** "Can't reach database server"
- ✅ **Solution:** Verify PostgreSQL is running (`docker ps` or `pg_isready`)
- ✅ **Solution:** Check DATABASE_URL credentials
- ✅ **Solution:** Wait 30-60 seconds after `docker-compose up -d` for database initialization

## Security Best Practices

1. **Never commit .env file to Git**
   - Already in `.gitignore`
   - Only commit `.env.example` with placeholder values

2. **Use different secrets for each environment**
   - Development, staging, production should all have unique SESSION_SECRET values

3. **Rotate secrets periodically**
   - Change SESSION_SECRET every 90 days
   - Change email passwords if compromised

4. **Use environment-specific email accounts**
   - Development: Use a test email account
   - Production: Use a professional, monitored email address

5. **Restrict email account permissions**
   - Use app passwords (revocable)
   - Don't use your personal email account
   - Monitor for unauthorized access

## Alternative Email Providers

If Gmail doesn't work for you, consider these alternatives:

### SendGrid (Recommended for Production)
- Free tier: 100 emails/day
- Easy API integration
- Better deliverability than Gmail
- Setup: https://sendgrid.com

### Mailgun
- Free tier: 5,000 emails/month
- Good for transactional emails
- Setup: https://www.mailgun.com

### Amazon SES
- Pay-as-you-go pricing
- Highly scalable
- Requires AWS account
- Setup: https://aws.amazon.com/ses

### SMTP2GO
- Free tier: 1,000 emails/month
- Simple setup
- Good documentation
- Setup: https://www.smtp2go.com

## Next Steps

After configuring your `.env` file:

1. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

2. **Run Database Migrations:**
   ```bash
   npm run prisma:migrate
   ```

3. **Seed Sample Data:**
   ```bash
   npm run seed
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

5. **Test the Application:**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000/api
   - Test login, cart, and checkout with email

## Need Help?

- Check [README.md](README.md) for general setup instructions
- Review [TESTING.md](TESTING.md) for testing procedures
- Consult [ARCHITECTURE.md](ARCHITECTURE.md) for system design details
- Check backend console logs for specific error messages
