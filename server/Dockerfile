# Use Node.js Alpine base image
FROM node:18-alpine3.18

# Install required build tools for bcrypt
RUN apk add --no-cache \
    make \
    g++ \
    python3

# Create and set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies, ensuring bcrypt is built from source
RUN npm install

# Copy the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]






# Use Node.js base image
# FROM node:18-alpine3.18

# # Create and set working directory inside the container
# WORKDIR /app

# # Copy package.json and package-lock.json into the container
# COPY package*.json ./

# # Install dependencies, including bcrypt
# RUN apk add --no-cache python3 make g++ \
#  && npm install 

# # Copy the rest of the application code into the container
# COPY . .

# # Compile TypeScript files to the dist folder
# RUN npm run build

# # Expose the port the app runs on
# EXPOSE 3000

# # Start the application
# CMD [ "npm","run","start" ]