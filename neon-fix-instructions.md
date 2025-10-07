# Instructions to Fix Neon Database Connection

## Option 1: Get New Connection String from Neon Dashboard

1. Go to https://neon.tech/
2. Sign in to your account
3. Navigate to your project dashboard
4. Click on your database project
5. Go to "Connection Details" or "Settings"
6. Copy the new connection string
7. Update the DATABASE_URL in .env.local

## Option 2: Check if Database is Paused

Neon databases auto-pause after inactivity:

1. Go to your Neon dashboard
2. Check if the database shows as "Paused"
3. Click "Resume" if needed
4. Wait for it to become active

## Option 3: Create New Database

If the current one is not accessible:

1. Create a new database in Neon
2. Copy the new connection string
3. Run the migration commands to set up tables

## Current Connection Details

Your current connection string points to:

- Host: ep-red-cloud-a5mnm4yb.us-east-2.aws.neon.tech
- Database: neondb
- User: neondb_owner

If you get a new connection string, update it in .env.local file.
