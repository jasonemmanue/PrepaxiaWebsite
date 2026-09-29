# Site vitrine Prepaxia — Next.js 14 (sortie « standalone ») pour Railway.
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:20-alpine AS build
WORKDIR /app
# Variables du service Railway, disponibles au build (pages pré-rendues).
ARG API_URL=https://excellencia-api-production.up.railway.app
ARG SITE_URL=https://prepaxia.com
ENV API_URL=$API_URL SITE_URL=$SITE_URL NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
# Railway fournit $PORT ; forme « shell » pour que la variable soit développée.
CMD PORT=${PORT:-3000} HOSTNAME=0.0.0.0 node server.js
