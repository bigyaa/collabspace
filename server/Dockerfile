# Use Node.js LTS base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the server code
COPY . .

# Install Prisma CLI globally
RUN npx prisma generate

# Build TypeScript files
RUN npm run build

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]