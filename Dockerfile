FROM node:20-slim

# Build tools needed for better-sqlite3 (native module compilation)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install deps (omit devDependencies — no Vite/ESLint needed on server)
COPY package*.json ./
RUN npm install --omit=dev

# Copy only the server source (not src/ client code)
COPY server/ ./server/

# /data will be the Railway volume mount point
RUN mkdir -p /data
ENV DATA_DIR=/data
ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "server/index.js"]
