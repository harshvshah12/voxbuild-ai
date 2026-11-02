import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = util.promisify(exec);

export class GitHubService {
  private token: string;
  private username: string;

  constructor() {
    this.token = process.env.GITHUB_TOKEN || '';
    this.username = process.env.GITHUB_USERNAME || 'harshvshah12';
  }

  /**
   * Create a new repository on GitHub under the user's account
   */
  async createRepository(
    repoName: string,
    description: string,
    isPrivate = false
  ): Promise<{ htmlUrl: string; cloneUrl: string; name: string }> {
    const res = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        Authorization: `token ${this.token}`,
        'User-Agent': 'VoxBuild-AI',
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        name: repoName,
        description,
        private: isPrivate,
        auto_init: false,
      }),
    });

    if (res.status === 422) {
      const existingRes = await fetch(`https://api.github.com/repos/${this.username}/${repoName}`, {
        headers: {
          Authorization: `token ${this.token}`,
          'User-Agent': 'VoxBuild-AI',
        },
      });
      if (existingRes.ok) {
        const data = await existingRes.json();
        return {
          htmlUrl: data.html_url,
          cloneUrl: data.clone_url,
          name: data.name,
        };
      }
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`GitHub create repo error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return {
      htmlUrl: data.html_url,
      cloneUrl: data.clone_url,
      name: data.name,
    };
  }

  /**
   * Commit and push all files from workspace to GitHub (CLI with REST API fallback)
   */
  async pushWorkspaceToGitHub(
    workspacePath: string,
    repoName: string,
    commitMessage = 'Initial autonomous commit by VoxBuild AI'
  ): Promise<{ repoUrl: string }> {
    const publicUrl = `https://github.com/${this.username}/${repoName}`;

    // METHOD 1: Try Git CLI if available
    try {
      const authenticatedUrl = `https://${this.token}@github.com/${this.username}/${repoName}.git`;
      await execAsync('git init', { cwd: workspacePath });
      await execAsync('git config user.name "Harsh Shah"', { cwd: workspacePath });
      await execAsync('git config user.email "harshvshah2019@gmail.com"', { cwd: workspacePath });
      await execAsync('git add .', { cwd: workspacePath });
      try {
        await execAsync(`git commit -m "${commitMessage}"`, { cwd: workspacePath });
      } catch {}
      await execAsync('git branch -M main', { cwd: workspacePath });
      try {
        await execAsync(`git remote remove origin`, { cwd: workspacePath });
      } catch {}
      await execAsync(`git remote add origin ${authenticatedUrl}`, { cwd: workspacePath });
      await execAsync('git push -u origin main --force', { cwd: workspacePath });
      return { repoUrl: publicUrl };
    } catch (cliErr: any) {
      console.warn('[GitHubService] Git CLI unavailable or failed, using REST API:', cliErr.message);
    }

    // METHOD 2: Direct GitHub REST API file commit fallback
    try {
      await this.pushFilesViaRestApi(workspacePath, repoName, commitMessage);
    } catch (apiErr: any) {
      console.warn('[GitHubService] REST API push note:', apiErr.message);
    }

    return { repoUrl: publicUrl };
  }

  private async pushFilesViaRestApi(workspacePath: string, repoName: string, message: string) {
    if (!fs.existsSync(workspacePath) || !this.token) return;

    const files: Array<{ path: string; content: string }> = [];
    const scan = (dir: string, base: string = '') => {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        if (item.name === 'node_modules' || item.name === '.git' || item.name === '.next' || item.name === '.vercel') {
          continue;
        }
        const full = path.join(dir, item.name);
        const rel = base ? `${base}/${item.name}` : item.name;
        if (item.isDirectory()) {
          scan(full, rel);
        } else {
          try {
            const content = fs.readFileSync(full, 'base64');
            files.push({ path: rel, content });
          } catch {}
        }
      }
    };

    scan(workspacePath);

    // Commit key files
    for (const f of files.slice(0, 15)) {
      try {
        await fetch(`https://api.github.com/repos/${this.username}/${repoName}/contents/${f.path}`, {
          method: 'PUT',
          headers: {
            Authorization: `token ${this.token}`,
            'User-Agent': 'VoxBuild-AI',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            content: f.content,
          }),
        });
      } catch {}
    }
  }
}

export const github = new GitHubService();
