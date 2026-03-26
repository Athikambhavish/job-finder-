# Environment Variables Setup for Render Deployment

## ⚠️ Database Connection Error on Render

The deployment failed because environment variables weren't set in Render. The app received the variable names literally instead of their values.

## ✅ How to Fix:

### Option 1: Set via Render Dashboard (Quick)
1. Go to your Render service: https://dashboard.render.com
2. Select your backend service
3. Click **"Environment"** 
4. Add these variables:
   ```
   SPRING_DATASOURCE_URL=postgres://[user]:[password]@[host]:[port]/[database]?sslmode=require
   SPRING_DATASOURCE_USERNAME=[your_db_username]
   SPRING_DATASOURCE_PASSWORD=[your_db_password]
   JWT_SECRET=[strong-random-jwt-secret-key]
   PORT=8080
   ```
5. Click **"Deploy"** to redeploy

⚠️ **Get credentials from Aiven dashboard** - see "Database Details" section below

### Option 2: Use Render Config File (Recommended)
The `render.yaml` file in this repo defines environment variable schemas. You still need to provide values in the dashboard, but this documents what's needed.

## 📝 Database Details (from Aiven)
- **Host**: pg-dfd0d1-job-portal-search.e.aivencloud.com
- **Port**: 17200
- **Database**: defaultdb
- **User**: avnadmin
- **SSL Mode**: require

## ⚠️ Security Notes
- **Never commit sensitive credentials** - the `.env` file is git-ignored for this reason
- Use `.env.example` as a template for your team
- On Render, secrets are encrypted and stored securely
- Consider rotating `JWT_SECRET` to a strong random value

## 🚀 After Setting Variables
1. Trigger a new deploy on Render
2. Monitor the deployment logs
3. Verify the app connects to the database successfully