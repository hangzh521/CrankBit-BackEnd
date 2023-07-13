# Specify the base image
FROM node:18-alpine

# Create a directory for the app
WORKDIR /app

# Copy the package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the app files
COPY . .

#Use ARG command to define a build-time variable for each environment variable I want to pass.
ARG MONGO_URI
ARG JWT_SECRET
ARG JWT_LIFETIME
ARG JWT_SECRET_KEY
ARG PORT
ARG EMAIL_SERVER_PASSWORD
ARG EMAIL_SERVER_PORT
ARG EMAIL_SERVER_HOST
ARG EMAIL_FROM
ARG EMAIL_SERVER_USER
ARG SENDGRID_API_KEY

# Use  ENV command to set the environment variables inside the container
ENV MONGO_URI=${MONGO_URI}
ENV JWT_SECRET=${JWT_SECRET}
ENV JWT_LIFETIME=${JWT_LIFETIME}
ENV JWT_SECRET_KEY=${JWT_SECRET_KEY}
ENV PORT=${PORT}
ENV EMAIL_SERVER_PASSWORD=${EMAIL_SERVER_PASSWORD}
ENV EMAIL_SERVER_PORT=${EMAIL_SERVER_PORT}
ENV EMAIL_SERVER_HOST=${EMAIL_SERVER_HOST}
ENV EMAIL_FROM=${EMAIL_FROM}
ENV EMAIL_SERVER_USER=${EMAIL_SERVER_USER}
ENV SENDGRID_API_KEY=${SENDGRID_API_KEY}

# Build the app
RUN npm run build 

# Backed server is running at 8080
EXPOSE 8080

# Start the app

CMD ["npm", "start"]
