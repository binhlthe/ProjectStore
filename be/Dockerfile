# Sử dụng image Java 17
FROM openjdk:17

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy file .war từ máy host vào container
COPY target/TestReact-0.0.1-SNAPSHOT.war app.war

# Lệnh để chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.war"]
