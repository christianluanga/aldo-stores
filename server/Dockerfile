# server/Dockerfile

# Use node version matching your development environment
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install --legacy-peer-deps

# Install ts-node globally (or locally)
RUN npm install -g ts-node

# Copy the rest of the application code
COPY . .

COPY src/graphql /app/src/graphql
# Expose port 4000 (or the port your backend application listens on)
EXPOSE 4000

# Command to run your application
CMD ["npm", "start"]
