import { exec } from 'child_process';
import util from 'util';
import path from 'path';

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
      // Already exists - fetch existing repo info
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
   * Commit and push all files from the isolated project workspace to the remote GitHub repo
   */
  async pushWorkspaceToGitHub(
    workspacePath: string,
    repoName: string,
    commitMessage = 'Initial autonomous commit by VoxBuild AI'
  ): Promise<{ repoUrl: string }> {
    const authenticatedUrl = `https://${this.token}@github.com/${this.username}/${repoName}.git`;
    const publicUrl = `https://github.com/${this.username}/${repoName}`;

    try {
      // 1. Initialize git in workspace if not already initialized
      await execAsync('git init', { cwd: workspacePath });
      await execAsync('git config user.name "VoxBuild Autonomous Agent"', { cwd: workspacePath });
      await execAsync('git config user.email "voxbuild@antigravity.ai"', { cwd: workspacePath });

      // 2. Add all files
      await execAsync('git add .', { cwd: workspacePath });

      // 3. Commit
      try {
        await execAsync(`git commit -m "${commitMessage}"`, { cwd: workspacePath });
      } catch (commitErr: any) {
        // If nothing to commit, continue
        console.log('[GitHubService] Commit note:', commitErr.message);
      }

      // 4. Set main branch
      await execAsync('git branch -M main', { cwd: workspacePath });

      // 5. Add or set remote
      try {
        await execAsync(`git remote remove origin`, { cwd: workspacePath });
      } catch {
        // ignore if origin did not exist
      }
      await execAsync(`git remote add origin ${authenticatedUrl}`, { cwd: workspacePath });

      // 6. Push to GitHub
      await execAsync('git push -u origin main --force', { cwd: workspacePath });

      return { repoUrl: publicUrl };
    } catch (err: any) {
      console.error('[GitHubService] Push error:', err);
      throw new Error(`Failed to push workspace to GitHub: ${err.message}`);
    }
  }
}

export const github = new GitHubService();
