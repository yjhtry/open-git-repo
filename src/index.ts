import { StatusBarAlignment, Uri, commands, env, extensions, window } from 'vscode'
import type { GitExtension } from '../types/vscode.git'

export function activate() {
  const statusBar = window.createStatusBarItem(StatusBarAlignment.Left, 0)
  statusBar.command = 'open-git-repo.open'
  statusBar.text = '$(github)'
  statusBar.tooltip = 'Open Git Repository'
  statusBar.show()

  commands.registerCommand('open-git-repo.open', async () => {
    try {
      const gitExtension = extensions.getExtension<GitExtension>('vscode.git')?.exports

      if (!gitExtension) {
        window.showInformationMessage('Git extension not found')
        return
      }

      const api = gitExtension.getAPI(1)

      const repo = api.repositories[0]

      if (repo.state.remotes.length === 0) {
        window.showInformationMessage('No remotes found')
        return
      }
      const remote = repo.state.remotes[0]

      if (!remote.fetchUrl) {
        window.showInformationMessage('No remote fetch url found')
        return
      }

      env.openExternal (Uri.parse (remote.fetchUrl))
    }
    catch (error) {
      window.showInformationMessage(`[open git repo error]: ${(error as any).message}`)
    }
  })
}

export function deactivate() {

}
