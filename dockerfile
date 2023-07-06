# Use Node.js 18 as the base image
FROM node:18

# Declare build-time variables 
ARG MONGO_URI
ARG JWT_SECRET
ARG JWT_LIFETIME

# set environment variables 
ENV MONGO_URI=$MONGO_URI
ENV JWT_SECRET=$JWT_SECRET
ENV JWT_LIFETIME=$JWT_LIFETIME

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy project source code to the working directory
COPY . .

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Expose the application port if needed
EXPOSE 8080

# # Start the application with PM2
# CMD ["npm", "run", "start:pm2"]

ENTRYPOINT npm run start:pm2 && tail -f /dev/null