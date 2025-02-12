---
title: Sensitive Data Redaction
description:
layout: ../../layouts/MainLayout.astro
mascot: Cute
---

**Sensitive data can be redacted to maintain privacy and security.**

## Enabling Sensitive Data Redaction  

Redaction works by running a script continuously. The script examines all traffic going from the **Workers to the browser**—and only that traffic.  

For example, if a display filter is used, only the traffic that passes the filter will be examined. Additionally, if no traffic is flowing from the Workers to the browser, the script remains idle.  

The script analyzes structured payloads and redacts what is perceived to be sensitive information.  

The redaction script can be activated as-is by selecting and enabling it from the script templates.  

![Activate the redaction script](/redact.png)  

The redaction process is performed **at the source**, at the individual **Worker level**, ensuring that sensitive information never travels over the network.  

## What is Redacted  

You can examine the script to see what data is redacted and from where. Essentially, the script processes all **headers, cookies, and JSON request and response payloads**. Values of keys considered sensitive are replaced with the string `[redacted]`.  

![Redacted sensitive information](/redact2.png)  

For illustration purposes, see this **code snippet** copied from the redaction script. You can inspect the entire script in the template section as demonstrated above.  

```javascript
var sensitiveFields = [
  // Authentication and Authorization
  "password", "pwd", "pass", "passwd", "secret",
  "token", "access_token", "refresh_token", "id_token", "session_token",
  "auth_token", "authentication_token", "api_token", "jwt", "oauth_token",
  "bearer_token", "client_token", "secret_token", "security_token",
  "apikey", "api_key", "api_secret", "client_id", "client_secret",
  "auth_code", "authorization_code", "login_token", "session_id",

  // Personally Identifiable Information (PII)
  "email", "username", "user_id", "user", "phone", "phone_number",
  "address", "street", "city", "state", "zip", "zipcode", "country",
  "firstname", "lastname", "fullname", "name", "dob", "date_of_birth",
  "ssn", "social_security_number", "nid", "national_id",
  "passport_number", "driver_license", "dl_number",

  // Payment and Financial Information
  "credit_card", "cc", "ccn", "card_number", "cvv", "cvc",
  "expiry_date", "expiration_date", "iban", "swift", "routing_number",
  "bic", "bank_account", "account_number", "balance",

  // Security and Encryption
  "private_key", "public_key", "ssh_key", "ssl_key", "encryption_key",
  "key", "api_secret_key", "secret_key", "cert", "certificate",
  "fingerprint", "security_question", "security_answer", "pin",
  "otp", "one_time_password", "recovery_key", "secure_code",

  // Healthcare Information
  "health_id", "medical_record", "insurance_number", "policy_number",
  "diagnosis", "treatment", "prescription", "patient_id",

  // Cookies and Tokens
  "cookie", "set-cookie", "csrf_token", "xsrf_token", "csrf", "xsrf",
  "tracking_cookie", "session_cookie", "authentication_cookie",

  // Miscellaneous
  "id", "user_key", "user_secret", "authenticator",
  "security_code", "access_code", "key_id", "app_key", "app_secret",
  "device_id", "mac_address", "serial_number", "imei", "hostname",
  "ip_address", "geolocation", "location", "coordinates"
];

var sensitiveHeaderFields = [
  // Authorization and Tokens
  "authorization", "proxy-authorization", "x-api-key", "x-auth-token",
  "x-access-token", "x-session-id", "x-session-token", "cookie",
  "x-csrf-token", "x-xsrf-token", "csrf-token", "xsrf-token",
  "x-client-id", "x-client-secret", "x-authentication-token",
  "x-refresh-token", "x-bearer-token", "x-auth-code",

  // Custom Header Variations
  "x-user-id", "x-username", "x-email", "x-password",
  "x-token", "x-id-token", "x-oauth-token", "x-api-secret",
  "x-authorization", "x-credentials", "x-signature",
  "x-hmac-signature", "x-request-signature", "x-webhook-signature",
  "x-hmac-key", "x-encryption-key", "x-secret-key",
  "x-client-key", "x-public-key", "x-private-key",

  // Session and Cookies
  "set-cookie", "x-cookie", "x-cookie-id", "x-tracking-cookie",
  "x-session-cookie", "x-auth-cookie"
];
```
## Customization  

The script can be customized to meet specific user needs and hosted locally for better control and flexibility.
