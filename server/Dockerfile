
FROM node:20

# Set working directory inside the container
WORKDIR /app

COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install --legacy-peer-deps

RUN npm install -g ts-node

COPY . .

RUN mkdir -p /app/dist/graphql
COPY src/graphql/*.graphql /app/dist/graphql/

# Expose port 4000 (or the port your backend application listens on)
EXPOSE 4000

# Command to run your application
CMD ["npm", "start"]
