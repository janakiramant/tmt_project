# Build stage
FROM node:20-slim AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite app for production
RUN npm run build

# Production stage
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Install 'serve', a static file serving package
RUN npm install -g serve

# Copy only the built static files from the build stage
COPY --from=build /app/dist ./dist

# Cloud Run defaults to port 8080, but provides the PORT environment variable
EXPOSE 8080

# Serve the static files on the port specified by Cloud Run
CMD ["sh", "-c", "serve -s dist -l tcp://0.0.0.0:${PORT:-8080}"]
