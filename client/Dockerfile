# Use the official Node.js image
FROM node:20

# Create and change to the frontend directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the frontend application
COPY . .

# Expose the frontend port
EXPOSE 3000

# Start the frontend application
CMD ["npm", "start"]
