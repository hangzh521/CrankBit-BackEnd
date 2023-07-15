# Use Node.js 18 as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Declare build-time variables 
ARG MONGO_URI
ARG JWT_SECRET
ARG JWT_SECRET_KEY
ARG JWT_LIFETIME
ARG PORT
ARG EMAIL_SERVER_PASSWORD
ARG EMAIL_SERVER_PORT
ARG EMAIL_SERVER_HOST
ARG EMAIL_FROM
ARG EMAIL_SERVER_USER
ARG SENDGRID_API_KEY

# set environment variables 
ENV MONGO_URI=$MONGO_URI
ENV JWT_SECRET=$JWT_SECRET
ENV JWT_SECRET_KEY=$JWT_SECRET_KEY
ENV JWT_LIFETIME=$JWT_LIFETIME
ENV PORT=$PORT
ENV EMAIL_SERVER_PASSWORD=$EMAIL_SERVER_PASSWORD
ENV EMAIL_SERVER_PORT=$EMAIL_SERVER_PORT
ENV EMAIL_SERVER_HOST=$EMAIL_SERVER_HOST
ENV EMAIL_FROM=$EMAIL_FROM
ENV EMAIL_SERVER_USER=$EMAIL_SERVER_USER
ENV SENDGRID_API_KEY=$SENDGRID_API_KEY

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

# Start the application with PM2
CMD ["npm", "start"]