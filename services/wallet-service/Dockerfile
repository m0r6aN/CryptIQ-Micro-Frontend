# Use the official Node.js LTS Slim image as the base
FROM node:lts-slim AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Use a smaller base image for the runtime
FROM node:lts-slim AS runner

WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start the server
CMD ["node", "dist/index.js"]

# Expose the appropriate port
EXPOSE 5002
