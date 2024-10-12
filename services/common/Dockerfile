# Use the official Node.js LTS Slim image
FROM node:lts-slim

# Set the working directory
WORKDIR /app

# Install app dependencies
# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Start the service
CMD ["npm", "start"]

# Expose the appropriate port
EXPOSE 5002
