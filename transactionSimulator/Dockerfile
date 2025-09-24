# Use the Node.js 18 base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies first
COPY package*.json ./
# Install all dependencies including devDependencies for development
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build

# Command to start the app, any additional parameters will be appended
ENTRYPOINT ["npm", "run", "start"]