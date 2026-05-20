# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments from Jenkins
ARG NEXT_PUBLIC_AUTH_BASE_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_CATALOG_BASE_URL
ARG NEXT_PUBLIC_PIPELINE_BASE_URL

# Export to Next.js build environment
ENV NEXT_PUBLIC_AUTH_BASE_URL=$NEXT_PUBLIC_AUTH_BASE_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_CATALOG_BASE_URL=$NEXT_PUBLIC_CATALOG_BASE_URL
ENV NEXT_PUBLIC_PIPELINE_BASE_URL=$NEXT_PUBLIC_PIPELINE_BASE_URL

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build


# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start", "--", "-H", "0.0.0.0"]