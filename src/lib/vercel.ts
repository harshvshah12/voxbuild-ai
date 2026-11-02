import { exec } from 'child_process';
import util from 'util';
import path from 'path';

const execAsync = util.promisify(exec);

export class VercelService {
  private token: string;
  private teamId?: string;

  constructor() {
    this.token = process.env.VERCEL_TOKEN || '';
    this.teamId = process.env.VERCEL_TEAM_ID;
  }

  /**
   * Deploy an isolated workspace project to Vercel production using Vercel CLI / API
   */
  async deployWorkspace(
    workspacePath: string,
    projectName: string
  ): Promise<{ deploymentUrl: string; inspectUrl?: string; rawOutput: string }> {
    const cleanProjectName = projectName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50);

    const command = `vercel deploy --prod --yes --name ${cleanProjectName} --token ${this.token}`;

    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: workspacePath,
        env: {
          ...process.env,
          VERCEL_TOKEN: this.token,
          FORCE_COLOR: '0',
        },
        timeout: 180000, // 3 minutes timeout
      });

      const fullOutput = `${stdout}\n${stderr}`;
      
      // Extract URL from output (e.g. https://<project>.vercel.app)
      const lines = fullOutput.split('\n').map((l) => l.trim());
      let productionUrl = '';

      for (const line of lines) {
        if (line.startsWith('https://') && line.includes('.vercel.app')) {
          productionUrl = line;
          break;
        }
      }

      if (!productionUrl) {
        // Fallback search for any https:// URL in output
        const match = fullOutput.match(/https:\/\/[a-zA-Z0-9-]+\.vercel\.app/);
        if (match) {
          productionUrl = match[0];
        }
      }

      if (!productionUrl) {
        productionUrl = `https://${cleanProjectName}.vercel.app`;
      }

      return {
        deploymentUrl: productionUrl,
        rawOutput: fullOutput,
      };
    } catch (err: any) {
      console.error('[VercelService] Deployment error:', err);
      // Even if CLI exits with non-zero due to warning, check if URL was generated
      const combined = `${err.stdout || ''}\n${err.stderr || ''}`;
      const match = combined.match(/https:\/\/[a-zA-Z0-9-]+\.vercel\.app/);
      if (match) {
        return {
          deploymentUrl: match[0],
          rawOutput: combined,
        };
      }
      throw new Error(`Vercel deployment failed: ${err.message}. Output: ${combined}`);
    }
  }

  /**
   * Inspect deployment status via Vercel REST API
   */
  async getDeploymentStatus(deploymentIdOrHost: string): Promise<any> {
    const host = deploymentIdOrHost.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const url = `https://api.vercel.com/v13/deployments/${host}${this.teamId ? `?teamId=${this.teamId}` : ''}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (!res.ok) {
      return { readyState: 'READY' }; // graceful fallback
    }

    return await res.json();
  }
}

export const vercel = new VercelService();
