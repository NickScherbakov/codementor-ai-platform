// mcp-servers/figma-codegen/src/index.ts
// MCP Server Entry Point для Figma Code Generation

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { FigmaClient } from './figma-client';
import { GitHubClient } from './github-client';
import { CodeGenerator } from './code-generator';
import { WebHookValidator } from './utils/webhook-validator';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3333;

// Middleware
app.use(express.json());

// Clients
const figmaClient = new FigmaClient(process.env.FIGMA_TOKEN!);
const githubClient = new GitHubClient(process.env.GITHUB_TOKEN!);
const codeGenerator = new CodeGenerator();
const webhookValidator = new WebHookValidator(process.env.WEBHOOK_SECRET!);

// ============= MCP Tools (как endpoints) =============

/**
 * Tool: parse_figma_components
 * Description: Parse components from Figma file
 */
app.post('/tools/parse_figma_components', async (req: Request, res: Response) => {
  try {
    const { fileKey } = req.body;

    if (!fileKey) {
      return res.status(400).json({ error: 'fileKey is required' });
    }

    console.log(`[MCP] Parsing components from Figma file: ${fileKey}`);

    const components = await figmaClient.getComponents(fileKey);
    
    res.json({
      success: true,
      count: components.length,
      components: components.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
      })),
    });
  } catch (error) {
    console.error('[MCP] Error parsing components:', error);
    res.status(500).json({ error: String(error) });
  }
});

/**
 * Tool: generate_react_component
 * Description: Generate React component from Figma component
 */
app.post('/tools/generate_react_component', async (req: Request, res: Response) => {
  try {
    const { fileKey, componentId, componentName } = req.body;

    if (!fileKey || !componentId || !componentName) {
      return res.status(400).json({ 
        error: 'fileKey, componentId, and componentName are required' 
      });
    }

    console.log(`[MCP] Generating React component: ${componentName}`);

    // Get component details from Figma
    const componentDetails = await figmaClient.getComponentDetails(fileKey, [componentId]);
    
    // Generate code
    const component = codeGenerator.generateReactComponent(componentName, componentDetails);
    const types = codeGenerator.generateTypeScript(componentName, componentDetails);
    const tests = codeGenerator.generateTests(componentName);

    res.json({
      success: true,
      component: {
        name: componentName,
        code: component,
        types,
        tests,
        figmaLink: `https://figma.com/design/${fileKey}?node-id=${componentId}`,
      },
    });
  } catch (error) {
    console.error('[MCP] Error generating component:', error);
    res.status(500).json({ error: String(error) });
  }
});

/**
 * Tool: generate_typescript_types
 * Description: Generate TypeScript types from Figma component props
 */
app.post('/tools/generate_typescript_types', async (req: Request, res: Response) => {
  try {
    const { componentName, componentDetails } = req.body;

    const types = codeGenerator.generateTypeScript(componentName, componentDetails);

    res.json({
      success: true,
      types,
    });
  } catch (error) {
    console.error('[MCP] Error generating types:', error);
    res.status(500).json({ error: String(error) });
  }
});

/**
 * Tool: create_github_pr
 * Description: Create GitHub PR with generated component code
 */
app.post('/tools/create_github_pr', async (req: Request, res: Response) => {
  try {
    const { 
      componentName, 
      componentCode, 
      typeCode, 
      testCode, 
      figmaLink 
    } = req.body;

    const owner = process.env.GITHUB_REPO_OWNER!;
    const repo = process.env.GITHUB_REPO_NAME!;
    const branchName = `figma/${componentName.toLowerCase().replace(/\//g, '-')}`;

    console.log(`[MCP] Creating GitHub PR: ${branchName}`);

    // Create branch
    await githubClient.createBranch(owner, repo, branchName);

    // Commit code
    const files: Record<string, string> = {
      [`src/components/${componentName}.tsx`]: componentCode,
      [`src/components/${componentName}.types.ts`]: typeCode,
      [`src/components/${componentName}.test.tsx`]: testCode,
    };

    await githubClient.commitCode(
      owner,
      repo,
      branchName,
      files,
      `chore: auto-generate component ${componentName} from Figma`
    );

    // Create PR
    const prNumber = await githubClient.createPullRequest(
      owner,
      repo,
      `🎨 [Figma] ${componentName}`,
      `Auto-generated from Figma Design\n\n**Figma Link:** [View Design](${figmaLink})\n\n## Changes\n- New component: ${componentName}\n- TypeScript types\n- Unit tests\n- Storybook story`,
      branchName
    );

    res.json({
      success: true,
      prNumber,
      url: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
    });
  } catch (error) {
    console.error('[MCP] Error creating PR:', error);
    res.status(500).json({ error: String(error) });
  }
});

// ============= WebHook Handler (Figma → MCP) =============

/**
 * Figma WebHook Endpoint
 * Triggered when component is updated in Figma
 */
app.post('/webhooks/figma', async (req: Request, res: Response) => {
  try {
    // Validate webhook signature
    const signature = req.headers['x-figma-signature'] as string;
    if (!webhookValidator.validate(JSON.stringify(req.body), signature)) {
      console.warn('[WebHook] Invalid signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { event_type, file_key, file_name, changes } = req.body;

    console.log(`[WebHook] Received event: ${event_type} from ${file_name}`);

    // Process changes
    if (event_type === 'FILE_UPDATE' && changes) {
      for (const change of changes) {
        // Trigger code generation
        console.log(`[WebHook] Processing change: ${change.node_name}`);
        
        // TODO: Call generate_react_component tool
        // TODO: Create PR automatically
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[WebHook] Error processing webhook:', error);
    res.status(500).json({ error: String(error) });
  }
});

// ============= Health Check =============

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ============= Info Endpoint =============

app.get('/info', (req: Request, res: Response) => {
  res.json({
    name: 'Figma Code Generation MCP Server',
    version: '1.0.0',
    tools: [
      {
        name: 'parse_figma_components',
        description: 'Parse components from Figma file',
        inputSchema: {
          type: 'object',
          properties: {
            fileKey: { type: 'string', description: 'Figma file key' },
          },
          required: ['fileKey'],
        },
      },
      {
        name: 'generate_react_component',
        description: 'Generate React component from Figma component',
        inputSchema: {
          type: 'object',
          properties: {
            fileKey: { type: 'string' },
            componentId: { type: 'string' },
            componentName: { type: 'string' },
          },
          required: ['fileKey', 'componentId', 'componentName'],
        },
      },
      {
        name: 'create_github_pr',
        description: 'Create GitHub PR with generated code',
        inputSchema: {
          type: 'object',
          properties: {
            componentName: { type: 'string' },
            componentCode: { type: 'string' },
            typeCode: { type: 'string' },
            testCode: { type: 'string' },
            figmaLink: { type: 'string' },
          },
          required: ['componentName', 'componentCode'],
        },
      },
    ],
  });
});

// ============= Error Handling =============

app.use((err: any, req: Request, res: Response) => {
  console.error('[Server] Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ============= Start Server =============

app.listen(port, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║  🎨 Figma Code Generation MCP Server             ║
║  Version: 1.0.0                                  ║
║  Status: Running ✅                              ║
╠═══════════════════════════════════════════════════╣
║  Endpoint: http://localhost:${port}                  ║
║  Health: http://localhost:${port}/health          ║
║  Info: http://localhost:${port}/info              ║
╠═══════════════════════════════════════════════════╣
║  Figma Token: ${process.env.FIGMA_TOKEN ? '✅ Configured' : '❌ Missing'}        ║
║  GitHub Token: ${process.env.GITHUB_TOKEN ? '✅ Configured' : '❌ Missing'}      ║
║  Webhook Secret: ${process.env.WEBHOOK_SECRET ? '✅ Configured' : '❌ Missing'}    ║
╚═══════════════════════════════════════════════════╝
  `);
});

export default app;
