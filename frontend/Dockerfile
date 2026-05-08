###################
### BUILD STAGE ###
###################

# Use official Node.js Alpine image from Docker Hub
FROM node:18.9.1-alpine3.16 AS build-stage

# Build the application
WORKDIR /app
COPY package*.json /app/

RUN npm install
COPY ./ /app/
RUN npm run build


########################
### PRODUCTION STAGE ###
########################

# Use official unprivileged Nginx image from Docker Hub
FROM nginx:1.29.3-alpine AS run-stage

# Prepare webapp and Nginx
WORKDIR /app

COPY --from=build-stage /app/build/ /app/

# nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Exponera port 8080, som Nginx lyssnar på
EXPOSE 8081

CMD ["nginx", "-g", "daemon off;"]