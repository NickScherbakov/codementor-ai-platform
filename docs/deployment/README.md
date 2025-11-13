# CodeMentor AI Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying CodeMentor AI in various environments, from development to enterprise production setups. The platform supports multiple deployment strategies to meet different scalability and infrastructure requirements.

## Deployment Options

### 1. 🐳 Docker Compose (Recommended for Development/Small Production)
- **Best for**: Development, testing, small production deployments
- **Complexity**: Low
- **Scalability**: Limited to single host
- **Setup time**: 10-15 minutes

### 2. ☸️ Kubernetes (Recommended for Enterprise)
- **Best for**: Production, high availability, auto-scaling
- **Complexity**: Medium to High
- **Scalability**: Horizontal scaling across multiple nodes
- **Setup time**: 30-60 minutes

### 3. 🌐 Cloud Platforms (AWS/GCP/Azure)
- **Best for**: Managed services, global distribution
- **Complexity**: Medium
- **Scalability**: Cloud-native scaling
- **Setup time**: 45-90 minutes

### 4. 🖥️ Manual Installation
- **Best for**: Custom environments, learning purposes
- **Complexity**: High
- **Scalability**: Manual scaling
- **Setup time**: 2-3 hours

## Quick Start Deployment Matrix

| Environment | Users | Resources | Deployment Method | Estimated Cost |
|-------------|-------|-----------|-------------------|----------------|
| Development | 1-5 | 4GB RAM, 2 CPU | Docker Compose | Free |
| Small Team | 10-50 | 8GB RAM, 4 CPU | Docker Compose | $50-100/month |
| Startup | 100-1K | 16GB RAM, 8 CPU | Kubernetes | $200-500/month |
| Enterprise | 1K-10K+ | Auto-scaling | Cloud K8s | $1K-5K+/month |

## Prerequisites

### System Requirements

#### Minimum Requirements (Development)
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **OS**: Linux, macOS, or Windows with WSL2

#### Recommended Requirements (Production)
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 50GB+ SSD
- **OS**: Ubuntu 20.04+ or CentOS 8+

#### Enterprise Requirements
- **CPU**: 8+ cores per node
- **RAM**: 16GB+ per node
- **Storage**: 100GB+ SSD with backup
- **Network**: Load balancer, CDN
- **Monitoring**: Prometheus, Grafana, logging

### Software Dependencies

```bash
# Required for all deployments
- Docker 20.10+
- Docker Compose 2.0+
- Git

# Required for Kubernetes deployments
- kubectl 1.24+
- Helm 3.8+

# Required for manual installation
- Node.js 18+
- Python 3.9+
- MongoDB 5.0+
- Redis 7.0+
- Nginx 1.20+
```

## Environment Variables

### Core Configuration

Create a `.env` file with the following variables:

```bash
# Application Environment
NODE_ENV=production
PORT=3000
API_PORT=3001
AI_ENGINE_PORT=5000

# Database Configuration
MONGODB_URI=mongodb://mongodb:27017/codementor-ai
REDIS_URL=redis://redis:6379

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# AI Configuration
OPENAI_API_KEY=your-openai-api-key
AI_MODEL=gpt-3.5-turbo
AI_MAX_TOKENS=1000

# External Services
JUDGE0_API_URL=http://judge0:2358
JUDGE0_API_KEY=your-judge0-api-key

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Monitoring (Optional)
SENTRY_DSN=your-sentry-dsn
PROMETHEUS_ENABLED=true
GRAFANA_ADMIN_PASSWORD=admin123

# Security
CORS_ORIGIN=https://your-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Storage (Optional)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=codementor-ai-uploads
AWS_REGION=us-east-1
```

### Security Best Practices

```bash
# Generate secure secrets
openssl rand -hex 32  # For JWT_SECRET
openssl rand -hex 32  # For REFRESH_TOKEN_SECRET

# Use environment-specific values
# Development
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug

# Production
NODE_ENV=production
DEBUG=false
LOG_LEVEL=info
SECURE_COOKIES=true
TRUST_PROXY=true
```

## Docker Compose Deployment

### Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  # Frontend - Next.js Application
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
      target: production
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
      - NEXT_PUBLIC_AI_ENGINE_URL=https://ai.yourdomain.com
    depends_on:
      - backend
      - ai-engine
    networks:
      - codementor-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Backend - Node.js API Server
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/codementor-ai
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - mongodb
      - redis
    networks:
      - codementor-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # AI Engine - Python Flask Service
  ai-engine:
    build:
      context: ./ai-engine
      dockerfile: Dockerfile.prod
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - REDIS_URL=redis://redis:6379
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - DATABASE_URL=mongodb://mongodb:27017/codementor-ai
    depends_on:
      - redis
      - mongodb
    networks:
      - codementor-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # MongoDB Database with Replica Set
  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=${MONGODB_PASSWORD}
      - MONGO_INITDB_DATABASE=codementor-ai
    volumes:
      - mongodb_data:/data/db
      - ./scripts/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
      - ./backups:/backups
    networks:
      - codementor-network
    restart: unless-stopped
    command: mongod --replSet rs0 --bind_ip_all
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis Cache & Session Store
  redis:
    image: redis:7.2-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
      - ./config/redis.conf:/usr/local/etc/redis/redis.conf
    networks:
      - codementor-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Nginx Reverse Proxy & Load Balancer
  nginx:
    image: nginx:1.25-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./config/nginx/ssl:/etc/ssl/certs:ro
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - frontend
      - backend
      - ai-engine
    networks:
      - codementor-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Code Execution Sandbox (Judge0)
  judge0:
    image: judge0/judge0:1.13.0
    ports:
      - "2358:2358"
    environment:
      - REDIS_HOST=redis
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      - POSTGRES_HOST=postgres-judge
      - POSTGRES_DB=judge0
      - POSTGRES_USER=judge0
      - POSTGRES_PASSWORD=${POSTGRES_JUDGE_PASSWORD}
    depends_on:
      - redis
      - postgres-judge
    networks:
      - codementor-network
    privileged: true
    restart: unless-stopped

  # PostgreSQL for Judge0
  postgres-judge:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=judge0
      - POSTGRES_USER=judge0
      - POSTGRES_PASSWORD=${POSTGRES_JUDGE_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - codementor-network
    restart: unless-stopped

  # Monitoring - Prometheus
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./config/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=30d'
      - '--web.enable-lifecycle'
    networks:
      - codementor-network
    restart: unless-stopped

  # Monitoring - Grafana
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3002:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD}
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_INSTALL_PLUGINS=grafana-piechart-panel
    volumes:
      - grafana_data:/var/lib/grafana
      - ./config/grafana/dashboards:/etc/grafana/provisioning/dashboards:ro
      - ./config/grafana/datasources:/etc/grafana/provisioning/datasources:ro
    depends_on:
      - prometheus
    networks:
      - codementor-network
    restart: unless-stopped

  # Log Aggregation - Loki
  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    volumes:
      - ./config/loki/loki.yml:/etc/loki/local-config.yaml:ro
      - loki_data:/loki
    networks:
      - codementor-network
    restart: unless-stopped

  # Log Collection - Promtail
  promtail:
    image: grafana/promtail:latest
    volumes:
      - ./config/promtail/promtail.yml:/etc/promtail/config.yml:ro
      - ./logs:/var/log:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
    depends_on:
      - loki
    networks:
      - codementor-network
    restart: unless-stopped

networks:
  codementor-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16

volumes:
  mongodb_data:
    driver: local
  redis_data:
    driver: local
  postgres_data:
    driver: local
  prometheus_data:
    driver: local
  grafana_data:
    driver: local
  loki_data:
    driver: local
```

### Deployment Commands

```bash
# 1. Clone repository
git clone https://github.com/codementor-ai/platform.git
cd platform

# 2. Set up environment variables
cp .env.example .env.production
# Edit .env.production with your values

# 3. Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Initialize database
docker-compose -f docker-compose.prod.yml exec mongodb mongosh --eval "rs.initiate()"

# 5. Verify deployment
docker-compose -f docker-compose.prod.yml ps
curl http://localhost/health

# 6. View logs
docker-compose -f docker-compose.prod.yml logs -f

# 7. Stop services
docker-compose -f docker-compose.prod.yml down
```

### SSL/TLS Configuration

Create `config/nginx/nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }
    
    upstream backend {
        server backend:3001;
    }
    
    upstream ai-engine {
        server ai-engine:5000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    # Main application
    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        ssl_certificate /etc/ssl/certs/fullchain.pem;
        ssl_certificate_key /etc/ssl/certs/privkey.pem;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # API Backend
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Authentication endpoints (stricter rate limiting)
        location /api/auth/ {
            limit_req zone=auth burst=10 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # AI Engine
        location /ai/ {
            proxy_pass http://ai-engine/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket support
        location /socket.io/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }

    # Monitoring (restrict access)
    server {
        listen 443 ssl http2;
        server_name monitoring.yourdomain.com;

        ssl_certificate /etc/ssl/certs/fullchain.pem;
        ssl_certificate_key /etc/ssl/certs/privkey.pem;

        # Basic auth for monitoring
        auth_basic "Monitoring Access";
        auth_basic_user_file /etc/nginx/.htpasswd;

        location /grafana/ {
            proxy_pass http://grafana:3000/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /prometheus/ {
            proxy_pass http://prometheus:9090/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## Backup and Recovery

### Automated Backup Script

Create `scripts/backup.sh`:

```bash
#!/bin/bash

# CodeMentor AI Backup Script
# Usage: ./scripts/backup.sh [daily|weekly|monthly]

set -e

BACKUP_TYPE=${1:-daily}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/${BACKUP_TYPE}"
RETENTION_DAYS=30

# Create backup directory
mkdir -p ${BACKUP_DIR}

echo "Starting ${BACKUP_TYPE} backup at $(date)"

# MongoDB Backup
echo "Backing up MongoDB..."
docker-compose exec -T mongodb mongodump \
    --host localhost:27017 \
    --db codementor-ai \
    --gzip \
    --archive > ${BACKUP_DIR}/mongodb_${TIMESTAMP}.gz

# Redis Backup
echo "Backing up Redis..."
docker-compose exec -T redis redis-cli --rdb /data/dump.rdb BGSAVE
docker cp $(docker-compose ps -q redis):/data/dump.rdb ${BACKUP_DIR}/redis_${TIMESTAMP}.rdb

# Application Data Backup
echo "Backing up application data..."
tar -czf ${BACKUP_DIR}/app_data_${TIMESTAMP}.tar.gz \
    ./uploads \
    ./logs \
    ./config \
    ./.env.production

# Upload to S3 (if configured)
if [ ! -z "$AWS_S3_BACKUP_BUCKET" ]; then
    echo "Uploading to S3..."
    aws s3 sync ${BACKUP_DIR} s3://${AWS_S3_BACKUP_BUCKET}/codementor-ai/${BACKUP_TYPE}/
fi

# Cleanup old backups
echo "Cleaning up old backups..."
find ${BACKUP_DIR} -name "*.gz" -mtime +${RETENTION_DAYS} -delete
find ${BACKUP_DIR} -name "*.rdb" -mtime +${RETENTION_DAYS} -delete
find ${BACKUP_DIR} -name "*.tar.gz" -mtime +${RETENTION_DAYS} -delete

echo "Backup completed successfully at $(date)"
```

### Recovery Procedures

```bash
# MongoDB Recovery
docker-compose exec -T mongodb mongorestore \
    --host localhost:27017 \
    --db codementor-ai \
    --gzip \
    --archive < /backups/mongodb_backup.gz

# Redis Recovery
docker cp /backups/redis_backup.rdb $(docker-compose ps -q redis):/data/dump.rdb
docker-compose restart redis

# Application Data Recovery
tar -xzf /backups/app_data_backup.tar.gz -C ./
```

## Monitoring and Alerting

### Prometheus Configuration

Create `config/prometheus/prometheus.yml`:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'codementor-backend'
    static_configs:
      - targets: ['backend:3001']
    metrics_path: '/metrics'

  - job_name: 'codementor-ai-engine'
    static_configs:
      - targets: ['ai-engine:5000']
    metrics_path: '/metrics'

  - job_name: 'mongodb-exporter'
    static_configs:
      - targets: ['mongodb-exporter:9216']

  - job_name: 'redis-exporter'
    static_configs:
      - targets: ['redis-exporter:9121']

  - job_name: 'nginx-exporter'
    static_configs:
      - targets: ['nginx-exporter:9113']
```

### Alert Rules

Create `config/prometheus/alert_rules.yml`:

```yaml
groups:
  - name: codementor-ai-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is {{ $value }} seconds"

      - alert: DatabaseConnectionFailure
        expr: mongodb_up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "MongoDB connection failure"
          description: "MongoDB is not responding"

      - alert: RedisConnectionFailure
        expr: redis_up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Redis connection failure"
          description: "Redis is not responding"

      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value | humanizePercentage }}"

      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage"
          description: "CPU usage is {{ $value }}%"

      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) < 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Low disk space"
          description: "Disk space is {{ $value | humanizePercentage }} full"
```

This deployment guide provides a comprehensive foundation for running CodeMentor AI in production environments with proper monitoring, security, and scalability considerations.