# BookedUp Local Development Setup

## Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Initial Setup

### 1. Clone and Install Dependencies

```bash
# From the root directory
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Database Setup

#### Local PostgreSQL
1. Create a new PostgreSQL database:
```bash
createdb bookedup_dev
```

2. Set up environment variables:
```bash
cd server
cp .env.example .env
```

3. Update `.env` with your database credentials:
```
DATABASE_URL="postgresql://username:password@localhost:5432/bookedup_dev"
```

4. Run database migrations:
```bash
# From the server directory
npx prisma migrate dev
```

5. (Optional) Seed the database:
```bash
npx prisma db seed
```

### 3. Environment Variables

Create a `.env` file in the `server` directory with:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/bookedup_dev"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-secret-key-here"

# OpenAI API Key (for AI features)
OPENAI_API_KEY="your-openai-api-key"

# Server Port
PORT=5000
```

### 4. Running the Application

From the root directory:
```bash
npm run dev
```

This will start:
- React development server on http://localhost:3000
- Express API server on http://localhost:5000

## Migrating to Google Cloud

### Prerequisites
- Google Cloud CLI (`gcloud`) installed and authenticated
- Docker installed
- A Google Cloud Project with billing enabled

### 1. Cloud SQL Setup

```bash
# Create Cloud SQL instance
gcloud sql instances create bookedup-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1

# Create database
gcloud sql databases create bookedup \
  --instance=bookedup-db

# Create user
gcloud sql users create bookedup-user \
  --instance=bookedup-db \
  --password=<secure-password>
```

### 2. Cloud Run Configuration

Create a `Dockerfile` in the root directory:
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd client && npm install
RUN cd server && npm install

# Copy source code
COPY . .

# Build client and server
RUN cd client && npm run build
RUN cd server && npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy built application
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/build ./client/build
COPY --from=builder /app/server/package*.json ./server/
COPY --from=builder /app/server/prisma ./server/prisma

# Install production dependencies
RUN cd server && npm ci --only=production

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server/dist/index.js"]
```

### 3. Deploy to Cloud Run

```bash
# Build and push image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/bookedup

# Deploy to Cloud Run
gcloud run deploy bookedup \
  --image gcr.io/YOUR_PROJECT_ID/bookedup \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="DATABASE_URL=postgresql://bookedup-user:password@/bookedup?host=/cloudsql/YOUR_PROJECT_ID:us-central1:bookedup-db" \
  --set-env-vars="JWT_SECRET=your-production-secret" \
  --set-env-vars="OPENAI_API_KEY=your-api-key" \
  --add-cloudsql-instances YOUR_PROJECT_ID:us-central1:bookedup-db
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `pg_ctl status`
- Check connection string format
- Verify database exists: `psql -l`

### Port Conflicts
- Client runs on port 3000 by default
- Server runs on port 5000 by default
- Update ports in respective package.json proxy settings

### Missing Dependencies
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node version compatibility

### Prisma Issues
- Regenerate Prisma client: `npx prisma generate`
- Reset database: `npx prisma migrate reset` (WARNING: This will delete all data)