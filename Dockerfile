FROM node:14-slim

WORKDIR /app

# Copy only package.json and package-lock.json initially
COPY package.json package-lock.json ./api/

# Install dependencies
WORKDIR /app/api
RUN npm install

# Copy the rest of the application code
COPY ./api /app/api
COPY ./client /app/client

# Expose port (assuming your app runs on port 3001)
# EXPOSE 3001

# Start the application
CMD ["npm", "start"]
