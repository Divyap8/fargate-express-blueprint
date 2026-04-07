# Multi-stage build - minimises final image size 
 
# Stage 1 - Install dependencies 
FROM node:20-alpine AS builder 
WORKDIR /app 
COPY package*.json ./ 
RUN npm ci --only=production 
 
# Stage 2 - Runtime image 
FROM node:20-alpine AS runtime 
 
# Non-root user - containers should never run as root 
RUN addgroup -S appgroup && adduser -S appuser -G appgroup 
 
WORKDIR /app 
COPY --from=builder /app/node_modules ./node_modules 
COPY app.js . 
 
USER appuser 
EXPOSE 3000 
 
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \ 
  CMD wget -qO- http://localhost:3000/health || exit 1 
 
CMD ["node", "app.js"]
