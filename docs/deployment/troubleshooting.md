# Troubleshooting Guide - CodeMentor AI

## Overview

This guide helps you diagnose and resolve common issues when deploying and running CodeMentor AI. Issues are organized by component and severity level.

## Quick Diagnosis

### Health Check Commands

```bash
# Check all services status
docker-compose ps

# Check service logs
docker-compose logs -f [service-name]

# Check resource usage
docker stats

# Test API endpoints
curl -f http://localhost:3001/health
curl -f http://localhost:5000/health
curl -f http://localhost:3000/api/health
```

### Common Issues Quick Reference

| Symptom | Likely Cause | Quick Fix |
|---------|--------------|-----------|
| 502 Bad Gateway | Backend service down | `docker-compose restart backend` |
| AI responses timeout | OpenAI API key issue | Check `OPENAI_API_KEY` in `.env` |
| Database connection failed | MongoDB not ready | Wait 30s, check MongoDB logs |
| Redis connection refused | Redis service down | `docker-compose restart redis` |
| Frontend build fails | Node.js version mismatch | Use Node.js 18+ |

## Frontend Issues

### Build and Runtime Problems

#### Issue: Next.js Build Fails

```bash
# Error message
Error: Cannot resolve module 'some-package'

# Diagnosis
npm ls some-package
node --version  # Should be 18+

# Solutions
1. Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install

2. Check Node.js version
   nvm use 18
   npm install

3. Update dependencies
   npm update
   npm audit fix
```

#### Issue: Frontend Container Won't Start

```bash
# Check container logs
docker-compose logs frontend

# Common error: Port already in use
Error: listen EADDRINUSE: address already in use :::3000

# Solution: Kill process using port
lsof -ti:3000 | xargs kill -9
# Or change port in docker-compose.yml
```

#### Issue: Environment Variables Not Loading

```bash
# Check if .env file exists and has correct format
cat .env | grep NEXT_PUBLIC

# Ensure variables are prefixed with NEXT_PUBLIC_ for client-side
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AI_ENGINE_URL=http://localhost:5000

# Restart frontend after env changes
docker-compose restart frontend
```

### Performance Issues

#### Issue: Slow Page Loading

```bash
# Check bundle size
npm run build
npm run analyze  # If webpack-bundle-analyzer is configured

# Solutions:
1. Enable code splitting
2. Optimize images with next/image
3. Add service worker caching
4. Use CDN for static assets
```

## Backend Issues

### Database Connection Problems

#### Issue: MongoDB Connection Failed

```bash
# Error message
MongoNetworkError: failed to connect to server

# Diagnosis steps
1. Check MongoDB container status
   docker-compose ps mongodb
   
2. Check MongoDB logs
   docker-compose logs mongodb
   
3. Test connection manually
   docker-compose exec mongodb mongosh
   
4. Check network connectivity
   docker network ls
   docker network inspect codementor-network
```

**Solutions:**

```bash
# Solution 1: Restart MongoDB
docker-compose restart mongodb

# Solution 2: Check connection string
# Ensure MONGODB_URI in .env matches service name
MONGODB_URI=mongodb://mongodb:27017/codementor-ai

# Solution 3: Initialize replica set (if using replica set)
docker-compose exec mongodb mongosh --eval "rs.initiate()"

# Solution 4: Check disk space
df -h
# MongoDB needs sufficient disk space to start
```

#### Issue: Redis Connection Refused

```bash
# Error message
Error: Redis connection to redis:6379 failed - connect ECONNREFUSED

# Diagnosis
docker-compose exec redis redis-cli ping

# Solutions
1. Restart Redis
   docker-compose restart redis

2. Check Redis configuration
   docker-compose exec redis cat /etc/redis/redis.conf

3. Verify Redis password (if set)
   docker-compose exec redis redis-cli -a $REDIS_PASSWORD ping
```

### API Performance Issues

#### Issue: High Response Times

```bash
# Monitor API performance
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3001/api/challenges

# Create curl-format.txt:
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
```

**Optimization Steps:**

```javascript
// 1. Add database query optimization
const challenges = await Challenge.find(query)
  .select('title description difficulty createdAt')  // Only select needed fields
  .limit(20)
  .lean()  // Return plain objects instead of Mongoose documents

// 2. Add caching
const cacheKey = `challenges:${JSON.stringify(query)}`
let challenges = await redis.get(cacheKey)
if (!challenges) {
  challenges = await Challenge.find(query)
  await redis.setex(cacheKey, 300, JSON.stringify(challenges))  // Cache for 5 minutes
}

// 3. Add connection pooling
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
```

#### Issue: Memory Leaks

```bash
# Monitor memory usage
docker stats backend

# Check for memory leaks in Node.js
node --inspect backend/server.js
# Then use Chrome DevTools to profile memory

# Common causes and solutions:
1. Unclosed database connections
2. Event listeners not removed
3. Large objects not garbage collected
4. Circular references
```

**Prevention:**

```javascript
// Proper cleanup
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully')
  await mongoose.connection.close()
  await redis.quit()
  process.exit(0)
})

// Remove event listeners
const cleanup = () => {
  socket.removeAllListeners()
  clearInterval(intervalId)
}
```

## AI Engine Issues

### OpenAI API Problems

#### Issue: API Key Invalid or Expired

```bash
# Error message
openai.error.AuthenticationError: Incorrect API key provided

# Diagnosis
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
     https://api.openai.com/v1/models

# Solutions
1. Verify API key in OpenAI dashboard
2. Check environment variable
   echo $OPENAI_API_KEY
3. Ensure key has sufficient credits
4. Check API key permissions
```

#### Issue: Rate Limit Exceeded

```bash
# Error message
openai.error.RateLimitError: Rate limit reached

# Solutions
1. Implement exponential backoff
2. Add request queuing
3. Use multiple API keys (if allowed)
4. Upgrade OpenAI plan
```

**Implementation:**

```python
import time
import random
from functools import wraps

def retry_with_exponential_backoff(
    func,
    initial_delay: float = 1,
    exponential_base: float = 2,
    jitter: bool = True,
    max_retries: int = 3,
):
    @wraps(func)
    def wrapper(*args, **kwargs):
        num_retries = 0
        delay = initial_delay
        
        while True:
            try:
                return func(*args, **kwargs)
            except openai.error.RateLimitError as e:
                num_retries += 1
                if num_retries > max_retries:
                    raise e
                
                delay *= exponential_base * (1 + jitter * random.random())
                time.sleep(delay)
            except Exception as e:
                raise e
    
    return wrapper

@retry_with_exponential_backoff
def call_openai_api(prompt):
    return openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
```

### Python Environment Issues

#### Issue: Package Import Errors

```bash
# Error message
ModuleNotFoundError: No module named 'some_package'

# Diagnosis
pip list | grep some_package
python -c "import sys; print(sys.path)"

# Solutions
1. Install missing packages
   pip install -r requirements.txt

2. Check Python version
   python --version  # Should be 3.9+

3. Verify virtual environment
   which python
   echo $VIRTUAL_ENV

4. Rebuild container
   docker-compose build ai-engine --no-cache
```

#### Issue: GPU Not Available (if using GPU)

```bash
# Check GPU availability
nvidia-smi
docker run --gpus all nvidia/cuda:11.0-base nvidia-smi

# Solutions
1. Install NVIDIA Docker runtime
2. Update docker-compose.yml to use GPU
   deploy:
     resources:
       reservations:
         devices:
           - driver: nvidia
             count: 1
             capabilities: [gpu]
```

## Infrastructure Issues

### Docker and Container Problems

#### Issue: Container Out of Memory

```bash
# Error message
Container killed due to memory usage

# Diagnosis
docker stats
docker system df

# Solutions
1. Increase container memory limits
   deploy:
     resources:
       limits:
         memory: 2G

2. Optimize application memory usage
3. Add swap space to host
4. Use multi-stage builds to reduce image size
```

#### Issue: Disk Space Full

```bash
# Check disk usage
df -h
docker system df

# Cleanup
docker system prune -a
docker volume prune
docker image prune -a

# Prevent future issues
1. Set up log rotation
2. Regular cleanup cron jobs
3. Monitor disk usage
```

### Network and Connectivity Issues

#### Issue: Services Can't Communicate

```bash
# Error message
connect ECONNREFUSED backend:3001

# Diagnosis
docker network ls
docker network inspect codementor-network
docker-compose exec frontend ping backend

# Solutions
1. Ensure all services are on same network
2. Use service names for internal communication
3. Check port mappings
4. Verify firewall rules
```

#### Issue: External API Calls Failing

```bash
# Test external connectivity
docker-compose exec backend curl -I https://api.openai.com
docker-compose exec ai-engine ping 8.8.8.8

# Solutions
1. Check DNS resolution
2. Verify proxy settings
3. Check firewall rules
4. Test with different DNS servers
```

## Performance Troubleshooting

### High CPU Usage

```bash
# Identify CPU-intensive processes
docker stats
top -p $(docker inspect --format '{{.State.Pid}}' container_name)

# Solutions
1. Profile application code
2. Optimize algorithms
3. Add caching
4. Scale horizontally
5. Use connection pooling
```

### High Memory Usage

```bash
# Monitor memory usage
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Node.js memory profiling
node --max-old-space-size=4096 --inspect server.js

# Python memory profiling
pip install memory-profiler
python -m memory_profiler ai-engine/main.py
```

### Database Performance Issues

#### Slow Queries

```javascript
// Enable MongoDB profiling
db.setProfilingLevel(2, { slowms: 100 })

// Check slow queries
db.system.profile.find().limit(5).sort({ ts: -1 }).pretty()

// Solutions
1. Add appropriate indexes
2. Optimize query patterns
3. Use aggregation pipelines
4. Implement query caching
```

#### Index Optimization

```javascript
// Check index usage
db.collection.explain("executionStats").find(query)

// Create compound indexes
db.challenges.createIndex({ 
  "difficulty": 1, 
  "topics": 1, 
  "createdAt": -1 
})

// Monitor index performance
db.challenges.getIndexes()
db.stats()
```

## Monitoring and Alerting Setup

### Prometheus Alerts Not Firing

```yaml
# Check Prometheus configuration
curl http://localhost:9090/api/v1/rules

# Verify alert rules syntax
promtool check rules prometheus/alert_rules.yml

# Check AlertManager
curl http://localhost:9093/api/v1/alerts
```

### Grafana Dashboard Issues

```bash
# Check Grafana logs
docker-compose logs grafana

# Verify data source connection
curl -u admin:admin123 http://localhost:3002/api/datasources

# Import dashboard
curl -X POST \
  -H "Content-Type: application/json" \
  -d @dashboard.json \
  http://admin:admin123@localhost:3002/api/dashboards/db
```

## Security Issues

### SSL/TLS Certificate Problems

```bash
# Check certificate validity
openssl x509 -in certificate.crt -text -noout

# Test SSL connection
openssl s_client -connect yourdomain.com:443

# Renew Let's Encrypt certificates
certbot renew --dry-run
```

### Authentication Issues

```bash
# Test JWT token
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/users/profile

# Decode JWT (for debugging)
echo $TOKEN | cut -d. -f2 | base64 -d | jq
```

## Recovery Procedures

### Database Recovery

```bash
# Restore from backup
docker-compose exec mongodb mongorestore \
  --host localhost:27017 \
  --db codementor-ai \
  --archive=/backups/mongodb_backup.gz \
  --gzip

# Verify data integrity
docker-compose exec mongodb mongosh codementor-ai --eval "db.users.count()"
```

### Application Recovery

```bash
# Rolling restart
docker-compose restart backend
sleep 30
docker-compose restart ai-engine
sleep 30
docker-compose restart frontend

# Full recovery
docker-compose down
docker-compose up -d
```

## Getting Additional Help

### Log Collection

```bash
# Collect all logs
mkdir -p troubleshooting-logs
docker-compose logs > troubleshooting-logs/all-services.log
docker-compose logs backend > troubleshooting-logs/backend.log
docker-compose logs ai-engine > troubleshooting-logs/ai-engine.log
docker-compose logs mongodb > troubleshooting-logs/mongodb.log

# System information
docker version > troubleshooting-logs/docker-info.txt
docker-compose version >> troubleshooting-logs/docker-info.txt
uname -a >> troubleshooting-logs/system-info.txt
df -h >> troubleshooting-logs/system-info.txt
free -h >> troubleshooting-logs/system-info.txt
```

### Support Channels

- **GitHub Issues**: [Report bugs and issues](https://github.com/codementor-ai/platform/issues)
- **Discord Community**: [Get help from community](https://discord.gg/codementor-ai)
- **Email Support**: support@codementor-ai.com
- **Documentation**: [docs.codementor-ai.com](https://docs.codementor-ai.com)

### Creating Effective Bug Reports

Include the following information:

1. **Environment Details**
   - Operating system and version
   - Docker and Docker Compose versions
   - Hardware specifications

2. **Steps to Reproduce**
   - Exact commands run
   - Configuration files used
   - Expected vs actual behavior

3. **Logs and Error Messages**
   - Complete error messages
   - Relevant log excerpts
   - Screenshots if applicable

4. **Troubleshooting Attempted**
   - Steps already tried
   - Temporary workarounds found
   - Related issues or documentation consulted

This comprehensive troubleshooting guide should help resolve most common issues encountered when deploying and running CodeMentor AI.