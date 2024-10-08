# Use the official Node.js LTS Slim image as the base
FROM node:lts-slim AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker caching for dependencies
COPY package*.json ./

# Install dependencies using npm 
RUN npm install

# Copy the rest of the application code, excluding unnecessary files using .dockerignore
COPY . .

# Build the application (for Next.js or similar frameworks)
RUN npm run build

# Use a smaller base image for the runtime
FROM node:lts-slim AS runner

# Set the working directory
WORKDIR /app

# Copy only necessary artifacts from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Set NODE_ENV to production
ENV NODE_ENV=production

# Expose the appropriate port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
