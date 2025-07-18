# Base image
FROM node:18

# Tạo thư mục app
WORKDIR /app

# Copy package.json và lock file trước để cache
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy phần còn lại của code
COPY . .

# Build NestJS (ra thư mục dist/)
RUN npm run build

# Mở port
EXPOSE 3000

# Chạy app đã build
CMD ["node", "dist/main"]
