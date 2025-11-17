/**
 * 将 Git SSH URL 转换为 HTTP(S) URL
 * 支持 GitHub, GitLab, Gitea, Bitbucket 等常见平台
 * 
 * @param sshUrl - SSH 格式的 Git 远程 URL
 * @param useHttps - 是否使用 HTTPS 协议，默认为 true
 * @returns HTTP(S) 格式的 URL
 * 
 * @example
 * // GitHub
 * convertSshToHttp('git@github.com:user/repo.git')
 * // 返回: 'https://github.com/user/repo.git'
 * 
 * // GitLab
 * convertSshToHttp('git@gitlab.com:user/repo.git')
 * // 返回: 'https://gitlab.com/user/repo.git'
 * 
 * // 自定义域名
 * convertSshToHttp('git@git.example.com:user/repo.git')
 * // 返回: 'https://git.example.com/user/repo.git'
 * 
 * // 带端口号
 * convertSshToHttp('ssh://git@github.com:22/user/repo.git')
 * // 返回: 'https://github.com/user/repo.git'
 */
export function convertSshToHttp(sshUrl: string, useHttps: boolean = true): string {
  // 移除首尾空格
  sshUrl = sshUrl.trim();
  
  // 处理已经是 HTTP(S) URL 的情况
  if (sshUrl.startsWith('http://') || sshUrl.startsWith('https://')) {
    return sshUrl;
  }
  
  const protocol = useHttps ? 'https' : 'http';
  let host: string;
  let path: string;
  
  // 匹配 ssh:// 开头的格式: ssh://git@host:port/path
  const sshProtocolMatch = sshUrl.match(/^ssh:\/\/(?:([^@]+)@)?([^:\/]+)(?::(\d+))?\/?(.*)$/);
  if (sshProtocolMatch) {
    host = sshProtocolMatch[2];
    path = sshProtocolMatch[4];
    return `${protocol}://${host}/${path}`;
  }
  
  // 匹配标准 SCP 格式: git@host:path 或 user@host:path
  const scpMatch = sshUrl.match(/^(?:([^@]+)@)?([^:]+):(.+)$/);
  if (scpMatch) {
    host = scpMatch[2];
    path = scpMatch[3];
    
    // 移除路径开头的斜杠(如果有)
    path = path.replace(/^\/+/, '');
    
    return `${protocol}://${host}/${path}`;
  }
  
  // 如果都不匹配，抛出错误
  throw new Error(`无法解析的 SSH URL 格式: ${sshUrl}`);
}
