#!/bin/bash
# CodeMentor AI - Setup Script
# Быстрая установка всех зависимостей для AI Console

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║   CodeMentor AI Engine - Setup Script                 ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Python version
echo -e "${BLUE}[1/4]${NC} Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo -e "${GREEN}✓${NC} Python $python_version"

# Install PyTorch
echo ""
echo -e "${BLUE}[2/4]${NC} Installing PyTorch (CPU-optimized)..."
echo "This may take a few minutes on first install..."
pip install -q torch --index-url https://download.pytorch.org/whl/cpu
echo -e "${GREEN}✓${NC} PyTorch installed"

# Install other dependencies
echo ""
echo -e "${BLUE}[3/4]${NC} Installing AI Engine dependencies..."
pip install -q transformers flask flask-cors scikit-learn redis python-dotenv
echo -e "${GREEN}✓${NC} Dependencies installed"

# Make console executable
echo ""
echo -e "${BLUE}[4/4]${NC} Setting up console..."
chmod +x ai_console.py
chmod +x ai_console_demo.py
echo -e "${GREEN}✓${NC} Console ready"

# Final message
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║           Setup Complete! 🎉                          ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Ready to use!${NC}"
echo ""
echo "Next steps:"
echo ""
echo -e "  ${YELLOW}Interactive Console:${NC}"
echo "    python ai_console.py"
echo ""
echo -e "  ${YELLOW}Demo Mode:${NC}"
echo "    python ai_console_demo.py"
echo ""
echo -e "  ${YELLOW}REST API Server:${NC}"
echo "    python main.py"
echo ""
echo "For more information, see CONSOLE_QUICKSTART.md"
echo ""
