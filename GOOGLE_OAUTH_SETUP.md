# Google OAuth Setup Guide

## Error: "Scheduler App has not completed the Google verification process"

If you're encountering the error message: "Scheduler App has not completed the Google verification process. The app is currently being tested, and can only be accessed by developer-approved testers," this is because the Google OAuth application is in testing mode.

## Solution

### For Developers

1. **Add Test Users**:
   - Go to your [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to your project
   - Go to "APIs & Services" > "OAuth consent screen"
   - In the "Test users" section, add the email addresses of all users who need access during testing
   - Save the changes

2. **Verify Configuration**:
   - Ensure your OAuth credentials are correctly set up
   - Check that the authorized redirect URIs include: `http://localhost:3000/api/auth/callback/google`
   - Verify that you've selected the correct scopes in the OAuth consent screen

3. **Environment Variables**:
   - Verify that your `.env` file contains the correct values for:
     ```
     GOOGLE_CLIENT_ID=your_client_id
     GOOGLE_CLIENT_SECRET=your_client_secret
     AUTH_URL=http://localhost:3000
     ```

### For Users

If you're trying to use this application:

1. Contact the developer to add your email address as a test user
2. Use the same Google account that was added as a test user when signing in
3. Be aware that in testing mode, the OAuth consent screen will show a warning about the app not being verified

## Going to Production

To remove this limitation and allow any user to sign in:

1. Complete the verification process with Google:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Fill out all required information
   - Submit for verification

2. The verification process may take several days to weeks, depending on the scopes requested

3. Once verified, the app will be available to all users without the "unverified app" warning

## Troubleshooting

- If you're still seeing the error after being added as a test user, try clearing your browser cookies and cache
- Ensure you're using the exact same Google account that was added as a test user
- Check the browser console for additional error details
- Verify that all required scopes are properly configured in both the Google Cloud Console and your application code