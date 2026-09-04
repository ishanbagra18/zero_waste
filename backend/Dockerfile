# docker file for zero waste
# Use Node 20 Alpine lightweight base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production || npm install --production

# Copy backend source code
COPY . .

# Expose backend port
EXPOSE 3002

# Set default environment variables
ENV PORT=3002
ENV NODE_ENV=production

# Command to launch backend
CMD ["node", "index.js"]
