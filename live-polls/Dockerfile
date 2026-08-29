# Stage 1: Build React application
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# API URL used by Vite during build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build React application
RUN npm run build


# Stage 2: Nginx
FROM nginx:alpine

# Copy production build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]