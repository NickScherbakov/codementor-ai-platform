# System Requirements

Complete hardware and software requirements for running CodeMentor AI platform.

## Minimum Requirements (Development)

### CPU/RAM
- **Processor**: Dual-core CPU @ 2.0 GHz minimum
- **RAM**: 8 GB (4 GB for AI Engine models alone)
- **Disk**: 15 GB free space (includes ML models cache)
- **OS**: Linux, macOS, or Windows (with Docker/WSL2)

### Software
- Node.js 18+ (Frontend/Backend)
- Python 3.9+ (AI Engine)
- Docker & Docker Compose (recommended)

### Use Case
- Local development
- Testing and prototyping
- Small-scale learning groups (<50 concurrent users)

---

## Recommended Requirements (Production)

### CPU/RAM
- **Processor**: Quad-core CPU @ 2.5 GHz+ (Intel/AMD)
- **RAM**: 16 GB minimum (8 GB minimum for production, 8+ GB for AI models)
- **GPU**: Optional but recommended for faster AI responses
  - NVIDIA GPU with CUDA support (RTX 3060 or better)
  - 6GB+ VRAM for parallel inference
- **Disk**: 20 GB SSD (faster database operations)
- **OS**: Ubuntu 20.04+ or CentOS 8+

### Network
- 1 Gbps+ network connection
- Low-latency connection to MongoDB/Redis servers

### Use Case
- Production deployment
- 50-500 concurrent users
- AI response time <3 seconds
- 99.9% uptime SLA

---

## Component-Specific Requirements

### Frontend (Next.js)
- **RAM**: 512 MB per deployment
- **Disk**: 500 MB for build artifacts
- **CPU**: Minimal (mostly client-side rendering)

### Backend (Node.js + Express)
- **RAM**: 1-2 GB
- **CPU**: 1-2 cores
- **Database**: MongoDB 4.4+ or MongoDB Atlas

### AI Engine (Python Flask)

#### TinyLlama-1.1B (Chat Model)
- **Model Size**: 2.2 GB on disk
- **RAM Required**: 
  - **CPU Mode**: 3-4 GB (running the model)
  - **GPU Mode**: 2 GB (optimized inference)
- **CPU**: Intel/AMD with AVX2 support
- **Inference Time**:
  - **CPU**: 1-3 seconds per response
  - **GPU (NVIDIA)**: <1 second per response

#### CodeT5-Small (Code Analysis)
- **Model Size**: 500 MB on disk
- **RAM Required**:
  - **CPU Mode**: 1-2 GB
  - **GPU Mode**: 1 GB
- **Inference Time**:
  - **CPU**: 1-2 seconds
  - **GPU**: <500ms

#### Total AI Engine Requirements
- **Disk**: 2.7 GB (both models)
- **RAM**: 4-6 GB for concurrent requests
- **GPU**: Optional (6GB+ VRAM for parallel processing)

### Database (MongoDB)
- **Disk**: 5-10 GB minimum (depends on user data)
- **RAM**: 2-4 GB
- **I/O**: SSD recommended for performance

### Cache (Redis)
- **RAM**: 1-2 GB
- **Disk**: 500 MB (optional persistence)
- **CPU**: Minimal

---

## Environment-Specific Configurations

### 🏠 Local Development (Single Machine)
```
Total Requirements:
- CPU: Dual-core
- RAM: 8 GB
- Disk: 15 GB SSD
- Network: Local only
```

**Setup:**
```bash
docker-compose up  # All services in Docker
# OR manual setup with separate terminals
```

### 🖥️ Production Server
```
Total Requirements:
- CPU: Quad-core
- RAM: 16 GB (or 32 GB with high traffic)
- Disk: 20 GB SSD
- Network: 1 Gbps+
```

**Recommended Deployment:**
```bash
docker-compose -f docker-compose.prod.yml up
# With Kubernetes for auto-scaling
```

### ☁️ Cloud Deployment (AWS/GCP/Azure)

#### Recommended Instance Types
- **Frontend**: t3.small (2 vCPU, 2 GB RAM)
- **Backend**: t3.medium (2 vCPU, 4 GB RAM)
- **AI Engine**: t3.large (2 vCPU, 8 GB RAM) or g4dn.xlarge (GPU)
- **Database**: db.t3.medium (2 vCPU, 4 GB RAM)

---

## GPU Setup (Optional Performance Boost)

### NVIDIA GPU Support

**Requirements:**
- NVIDIA GPU with Compute Capability 7.0+ (RTX series or better)
- CUDA 11.8+ installed
- cuDNN 8.0+

**Installation:**
```bash
# Install CUDA-enabled PyTorch
cd ai-engine
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# Models automatically use GPU if available
python main.py
```

**Performance Improvement:**
- TinyLlama inference: 3s → <1s (3x faster)
- CodeT5 inference: 2s → 500ms (4x faster)
- Cost trade-off: GPU power consumption vs faster responses

---

## Scaling Considerations

### Small Deployment (<50 users)
- Single 8GB machine with Docker
- MongoDB shared hosting (Atlas)
- Redis from Docker container
- 1-2 AI Engine instances

### Medium Deployment (50-500 users)
- Separate servers for each service
- Load balancer for APIs
- MongoDB replica set
- 3-5 AI Engine instances (auto-scaling)
- Redis cluster for caching

### Large Deployment (500+ users)
- Kubernetes cluster with 5+ nodes
- MongoDB Atlas with sharding
- Redis Cluster
- 10+ AI Engine replicas
- CDN for static content
- Multiple availability zones

---

## Verification Checklist

Before running the platform, verify:

### System Check
```bash
# Check available RAM
free -h  # Linux/macOS
# or use Task Manager (Windows)

# Check disk space
df -h  # Linux/macOS
# or use "Disk Management" (Windows)

# Check Python version
python --version  # Should be 3.9+

# Check Node version
node --version   # Should be 18+
```

### Docker Check
```bash
docker --version        # Should be 20.10+
docker-compose --version # Should be 1.29+
```

### Network Check
```bash
# Test connectivity
ping github.com
curl https://api.github.com/  # Check internet
```

---

## Troubleshooting

### "Out of Memory" Error
- **Cause**: AI models need 3-4GB
- **Solution**: 
  - Increase available RAM
  - Close other applications
  - Use GPU if available
  - Reduce concurrent request handling

### "CUDA out of memory"
- **Cause**: GPU VRAM insufficient
- **Solution**:
  - Use smaller GPU batch sizes
  - Switch to CPU mode
  - Use GPU with more VRAM (RTX 4090 vs RTX 3060)

### Slow AI Responses (>5 seconds)
- **Cause**: CPU inference or overloaded server
- **Solution**:
  - Use GPU acceleration
  - Reduce server load
  - Optimize model cache
  - Add more AI Engine instances

### MongoDB Connection Issues
- **Cause**: Database server not running
- **Solution**:
  - Start MongoDB: `docker-compose up mongo`
  - Check connection string in `.env`
  - Verify firewall rules

---

## Performance Benchmarks

### On Recommended Hardware (Quad-core + 16GB RAM)

| Component | Metric | Performance |
|-----------|--------|-------------|
| Frontend | Page Load | <1s |
| API Endpoint | Response Time | <200ms |
| AI Tutor Chat | Response Time | 2-3s (CPU), <1s (GPU) |
| Code Analysis | Response Time | 1-2s (CPU), 500ms (GPU) |
| Challenge Generation | Response Time | <500ms |
| Database Query | Response Time | <100ms |

### Throughput
- Frontend: 1000+ requests/sec
- Backend API: 500+ requests/sec
- AI Engine: 50+ requests/sec (depends on hardware)
- Database: 1000+ queries/sec

---

## Licensing Notes

- **PyTorch**: BSD License (free)
- **TinyLlama**: Apache 2.0 (free, commercial use allowed)
- **CodeT5**: BSD-3-Clause (free, commercial use allowed)
- **All dependencies**: Check `requirements.txt` for licenses

**No paid licenses required** for the AI models!

---

## Support

For hardware recommendations or performance issues:
1. Check [AI Engine README](ai-engine/README.md)
2. See [Performance Benchmarks](docs/performance/benchmarks.md)
3. Open an issue on [GitHub](https://github.com/NickScherbakov/codementor-ai-platform/issues)
