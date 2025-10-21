#!/usr/bin/env node

/**
 * Documentation Validation Script
 * 
 * This script validates various aspects of the documentation:
 * - Mermaid diagram syntax
 * - OpenAPI specification validity
 * - Link integrity
 * - Documentation coverage
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { execSync } = require('child_process');

class DocumentationValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.docsPath = path.join(__dirname, '../docs');
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📋',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    }[type];
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async validateMermaidDiagrams() {
    this.log('Validating Mermaid diagrams...');
    
    const architecturePath = path.join(this.docsPath, 'architecture');
    const files = fs.readdirSync(architecturePath).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join(architecturePath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Extract Mermaid code blocks
      const mermaidBlocks = content.match(/```mermaid\n([\s\S]*?)\n```/g);
      
      if (mermaidBlocks) {
        for (let i = 0; i < mermaidBlocks.length; i++) {
          const block = mermaidBlocks[i];
          const mermaidCode = block.replace(/```mermaid\n/, '').replace(/\n```/, '');
          
          try {
            // Create temporary file for validation
            const tempFile = path.join(__dirname, `temp_diagram_${i}.mmd`);
            fs.writeFileSync(tempFile, mermaidCode);
            
            // Validate using mermaid CLI (if available)
            try {
              execSync(`mmdc -i ${tempFile} -o /dev/null`, { stdio: 'pipe' });
              this.log(`✓ Mermaid diagram ${i + 1} in ${file} is valid`, 'success');
            } catch (error) {
              this.errors.push(`Invalid Mermaid syntax in ${file}, diagram ${i + 1}: ${error.message}`);
            }
            
            // Clean up temp file
            fs.unlinkSync(tempFile);
            
          } catch (error) {
            this.warnings.push(`Could not validate Mermaid diagram in ${file}: ${error.message}`);
          }
        }
      }
    }
  }

  async validateOpenAPISpec() {
    this.log('Validating OpenAPI specification...');
    
    const openApiPath = path.join(this.docsPath, 'api/openapi.yaml');
    
    if (!fs.existsSync(openApiPath)) {
      this.errors.push('OpenAPI specification file not found');
      return;
    }
    
    try {
      const content = fs.readFileSync(openApiPath, 'utf8');
      const spec = yaml.load(content);
      
      // Basic validation
      if (!spec.openapi) {
        this.errors.push('OpenAPI version not specified');
      }
      
      if (!spec.info || !spec.info.title || !spec.info.version) {
        this.errors.push('OpenAPI info section incomplete');
      }
      
      if (!spec.paths || Object.keys(spec.paths).length === 0) {
        this.errors.push('No API paths defined in OpenAPI spec');
      }
      
      // Count endpoints
      const endpointCount = Object.keys(spec.paths).reduce((count, path) => {
        return count + Object.keys(spec.paths[path]).length;
      }, 0);
      
      this.log(`✓ OpenAPI spec is valid with ${endpointCount} endpoints`, 'success');
      
    } catch (error) {
      this.errors.push(`Invalid OpenAPI specification: ${error.message}`);
    }
  }

  async validateLinks() {
    this.log('Validating internal links...');
    
    const markdownFiles = this.findMarkdownFiles(this.docsPath);
    const allFiles = new Set();
    
    // Collect all existing files
    markdownFiles.forEach(file => {
      const relativePath = path.relative(this.docsPath, file);
      allFiles.add(relativePath);
    });
    
    for (const file of markdownFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative(this.docsPath, file);
      
      // Find markdown links
      const links = content.match(/\[([^\]]+)\]\(([^)]+)\)/g);
      
      if (links) {
        for (const link of links) {
          const match = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
          if (match) {
            const linkPath = match[2];
            
            // Skip external links
            if (linkPath.startsWith('http') || linkPath.startsWith('mailto:')) {
              continue;
            }
            
            // Resolve relative path
            const fullPath = path.resolve(path.dirname(file), linkPath);
            const relativeToDocsPath = path.relative(this.docsPath, fullPath);
            
            if (!fs.existsSync(fullPath)) {
              this.errors.push(`Broken link in ${relativePath}: ${linkPath}`);
            }
          }
        }
      }
    }
  }

  findMarkdownFiles(dir) {
    const files = [];
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.findMarkdownFiles(fullPath));
      } else if (item.endsWith('.md')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  async validateDocumentationCoverage() {
    this.log('Checking documentation coverage...');
    
    // Check if all major sections exist
    const requiredSections = [
      'api/README.md',
      'api/openapi.yaml',
      'architecture/README.md',
      'deployment/README.md',
      'performance/README.md'
    ];
    
    for (const section of requiredSections) {
      const sectionPath = path.join(this.docsPath, section);
      if (!fs.existsSync(sectionPath)) {
        this.errors.push(`Missing required documentation section: ${section}`);
      } else {
        this.log(`✓ Found ${section}`, 'success');
      }
    }
    
    // Check if main documentation files exist
    const mainDocs = ['README.md', 'TUTORIAL.md', 'EXAMPLES.md'];
    for (const doc of mainDocs) {
      const docPath = path.join(this.docsPath, doc);
      if (!fs.existsSync(docPath)) {
        this.warnings.push(`Missing main documentation file: ${doc}`);
      }
    }
  }

  async run() {
    this.log('Starting documentation validation...', 'info');
    
    try {
      await this.validateMermaidDiagrams();
      await this.validateOpenAPISpec();
      await this.validateLinks();
      await this.validateDocumentationCoverage();
      
      // Report results
      this.log(`\n📊 Validation Results:`, 'info');
      this.log(`   Errors: ${this.errors.length}`, this.errors.length > 0 ? 'error' : 'success');
      this.log(`   Warnings: ${this.warnings.length}`, this.warnings.length > 0 ? 'warning' : 'success');
      
      if (this.errors.length > 0) {
        this.log('\n❌ Errors found:', 'error');
        this.errors.forEach(error => this.log(`   • ${error}`, 'error'));
      }
      
      if (this.warnings.length > 0) {
        this.log('\n⚠️  Warnings:', 'warning');
        this.warnings.forEach(warning => this.log(`   • ${warning}`, 'warning'));
      }
      
      if (this.errors.length === 0) {
        this.log('\n🎉 Documentation validation passed!', 'success');
        process.exit(0);
      } else {
        this.log('\n💥 Documentation validation failed!', 'error');
        process.exit(1);
      }
      
    } catch (error) {
      this.log(`Validation failed with error: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new DocumentationValidator();
  validator.run().catch(error => {
    console.error('❌ Validation script failed:', error);
    process.exit(1);
  });
}

module.exports = DocumentationValidator;