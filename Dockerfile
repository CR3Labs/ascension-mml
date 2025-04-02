# Use the Node official image
# https://hub.docker.com/_/node
FROM node:20.11.1

# Add build arguments for API configuration
ARG API_KEY
ARG API_URL

# Make them available as environment variables during build
ENV API_KEY=$API_KEY
ENV API_URL=$API_URL

# Create and change to the app directory.
WORKDIR /app

# Copy local code to the container image
COPY . ./

# Install packages
RUN npm i

# Build the app
RUN npm run build

# Document that this container will listen on port 3000
EXPOSE 8080

# Serve the app
CMD ["npm", "run", "start"]