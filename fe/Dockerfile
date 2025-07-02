# Giai đoạn build
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build

# Giai đoạn chạy bằng Nginx
FROM nginx:alpine

# Copy file cấu hình Nginx của bạn vào container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy thư mục build React vào thư mục web của Nginx
COPY --from=build /app/build /usr/share/nginx/html
