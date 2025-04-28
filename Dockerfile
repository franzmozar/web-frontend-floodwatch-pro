FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create error pages for better debugging
RUN echo '<!DOCTYPE html><html><head><title>404 - Page Not Found</title><style>body{font-family:Arial,sans-serif;padding:40px;text-align:center;color:#333}h1{font-size:48px;color:#f44336}p{font-size:18px}</style></head><body><h1>404</h1><p>The page you are looking for cannot be found.</p><p><small>NAC FloodWatch Pro</small></p></body></html>' > /usr/share/nginx/html/404.html && \
  echo '<!DOCTYPE html><html><head><title>Server Error</title><style>body{font-family:Arial,sans-serif;padding:40px;text-align:center;color:#333}h1{font-size:48px;color:#f44336}p{font-size:18px}</style></head><body><h1>500</h1><p>Server error occurred. Please try again later.</p><p><small>NAC FloodWatch Pro</small></p></body></html>' > /usr/share/nginx/html/50x.html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]