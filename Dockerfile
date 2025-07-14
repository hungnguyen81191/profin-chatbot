# Sử dụng image Node.js chính thức
FROM node:18

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy toàn bộ project (trừ những thứ trong .dockerignore)
COPY . .

# Cài đặt phụ thuộc
RUN npm install

# Build NestJS
RUN npm run build

# Mở port 3000 (hoặc bạn đang dùng port nào thì mở port đó)
EXPOSE 3000

# Chạy app
CMD ["node", "dist/main"]
# Hoặc nếu bạn muốn chạy với ts-node (dùng cho môi trường phát triển)
# CMD ["npm", "run", "start:dev"]