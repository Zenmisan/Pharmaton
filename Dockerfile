FROM node:26-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the code
COPY . .

# Expose the port the app runs on
EXPOSE 4000

# Start the application
CMD ["node", "server/index.js"]
