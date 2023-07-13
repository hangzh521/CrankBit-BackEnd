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

# Use  ENV command to set the environment variables inside the container
ENV MONGO_URI=${MONGO_URI}
ENV JWT_SECRET=${JWT_SECRET}
ENV JWT_LIFETIME=${JWT_LIFETIME}
# Build the app
RUN npm run build 

# Backed server is running at 8080
EXPOSE 8080

# Start the app

CMD ["npm", "start"]
