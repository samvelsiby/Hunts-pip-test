export interface TradingViewConfig {
  username: string;
  password: string;
}

export interface AccessDetails {
  username: string;
  pine_id: string;
  access_granted: boolean;
  expiry_date?: string;
  status?: string;
}

export interface TradingViewResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export interface TradingViewScript {
  id: string;
  title: string;
  short_description?: string;
  access_type?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
}

export class TradingViewService {
  private sessionId: string | null = null;
  private cookies: string[] = [];
  private config: TradingViewConfig;
  
  private readonly urls = {
    tvcoins: 'https://www.tradingview.com/tvcoins/details/',
    username_hint: 'https://www.tradingview.com/username_hint/',
    list_users: 'https://www.tradingview.com/pine_perm/list_users/',
    modify_access: 'https://www.tradingview.com/pine_perm/modify_user_expiration/',
    add_access: 'https://www.tradingview.com/pine_perm/add/',
    remove_access: 'https://www.tradingview.com/pine_perm/remove/',
    signin: 'https://www.tradingview.com/accounts/signin/',
    my_scripts: 'https://www.tradingview.com/pine_perm/get_scripts/',
    script_info: 'https://www.tradingview.com/pine_perm/get_script_info/'
  };

  constructor(config: TradingViewConfig) {
    this.config = config;
  }

  async initialize(): Promise<TradingViewResponse> {
    try {
      await this.authenticateWithTradingView();
      return { success: true, message: 'Successfully authenticated with TradingView' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      };
    }
  }

  private async authenticateWithTradingView(): Promise<void> {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };

    const formData = new URLSearchParams({
      username: this.config.username,
      password: this.config.password,
      remember: 'on'
    });

    const response = await fetch(this.urls.signin, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Authentication failed with status: ${response.status}`);
    }

    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      this.cookies = setCookieHeader.split(',').map(cookie => cookie.trim());
      
      const sessionCookie = this.cookies.find(cookie => cookie.startsWith('sessionid='));
      if (sessionCookie) {
        this.sessionId = sessionCookie.split('=')[1].split(';')[0];
      }
    }

    if (!this.sessionId) {
      throw new Error('Failed to obtain session ID from TradingView');
    }
  }

  private getAuthenticatedHeaders(): HeadersInit {
    return {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Cookie': this.cookies.join('; '),
      'X-Requested-With': 'XMLHttpRequest',
      'Referer': 'https://www.tradingview.com/'
    };
  }

  async validateUsername(username: string): Promise<TradingViewResponse> {
    if (!this.sessionId) {
      return { success: false, error: 'Not authenticated with TradingView' };
    }

    try {
      const response = await fetch(`${this.urls.username_hint}${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: this.getAuthenticatedHeaders()
      });

      if (!response.ok) {
        return { success: false, error: `Failed to validate username: ${response.status}` };
      }

      const data = await response.json();
      
      return {
        success: true,
        data: {
          valid: data.length > 0,
          suggestions: data,
          username: username
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to validate username'
      };
    }
  }

  async getAccessDetails(username: string, pineId: string): Promise<AccessDetails> {
    if (!this.sessionId) {
      throw new Error('Not authenticated with TradingView');
    }

    try {
      const formData = new URLSearchParams({
        script_id_part: pineId
      });

      const response = await fetch(this.urls.list_users, {
        method: 'POST',
        headers: {
          ...this.getAuthenticatedHeaders(),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get access details (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      
      const userAccess = data.find((user: any) => user.username === username);
      
      return {
        username,
        pine_id: pineId,
        access_granted: !!userAccess,
        expiry_date: userAccess?.expiry_date || undefined,
        status: userAccess?.status || 'no_access'
      };
    } catch (error) {
      throw new Error(`Failed to get access details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async addAccess(accessDetails: AccessDetails, durationType: string, durationNumber: number): Promise<TradingViewResponse> {
    if (!this.sessionId) {
      return { success: false, error: 'Not authenticated with TradingView' };
    }

    try {
      const formData = new URLSearchParams({
        script_id_part: accessDetails.pine_id,
        username_recip: accessDetails.username,
        duration_type: durationType,
        duration_number: durationNumber.toString()
      });

      const response = await fetch(this.urls.add_access, {
        method: 'POST',
        headers: {
          ...this.getAuthenticatedHeaders(),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `Failed to add access (${response.status}): ${errorText}` };
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
        message: `Successfully granted access to ${accessDetails.username} for ${durationNumber}${durationType}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add access'
      };
    }
  }

  async removeAccess(accessDetails: AccessDetails): Promise<TradingViewResponse> {
    if (!this.sessionId) {
      return { success: false, error: 'Not authenticated with TradingView' };
    }

    try {
      const formData = new URLSearchParams({
        script_id_part: accessDetails.pine_id,
        username_recip: accessDetails.username
      });

      const response = await fetch(this.urls.remove_access, {
        method: 'POST',
        headers: {
          ...this.getAuthenticatedHeaders(),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `Failed to remove access (${response.status}): ${errorText}` };
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
        message: `Successfully removed access for ${accessDetails.username}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove access'
      };
    }
  }

  async bulkManageAccess(
    username: string, 
    pineIds: string[], 
    action: 'grant' | 'remove', 
    duration?: { type: string; number: number }
  ): Promise<TradingViewResponse[]> {
    const results: TradingViewResponse[] = [];
    
    for (const pineId of pineIds) {
      const accessDetails = await this.getAccessDetails(username, pineId);
      
      if (action === 'grant' && duration) {
        results.push(await this.addAccess(accessDetails, duration.type, duration.number));
      } else if (action === 'remove') {
        results.push(await this.removeAccess(accessDetails));
      }
    }
    
    return results;
  }

  async getAllScripts(): Promise<TradingViewResponse> {
    if (!this.sessionId) {
      return { success: false, error: 'Not authenticated with TradingView' };
    }

    try {
      const response = await fetch(this.urls.my_scripts, {
        method: 'GET',
        headers: this.getAuthenticatedHeaders()
      });

      if (!response.ok) {
        return { success: false, error: `Failed to fetch scripts: ${response.status}` };
      }

      const data = await response.json();
      
      const scripts: TradingViewScript[] = data.map((script: any) => ({
        id: script.id || script.script_id_part || script.pine_id,
        title: script.title || script.name || 'Untitled Script',
        short_description: script.short_description || script.description,
        access_type: script.access_type || script.type,
        created_at: script.created_at || script.date_created,
        updated_at: script.updated_at || script.date_modified,
        status: script.status || 'unknown'
      }));

      return {
        success: true,
        data: scripts,
        message: `Found ${scripts.length} scripts`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch scripts'
      };
    }
  }

  async getScriptDetails(scriptId: string): Promise<TradingViewResponse> {
    if (!this.sessionId) {
      return { success: false, error: 'Not authenticated with TradingView' };
    }

    try {
      const formData = new URLSearchParams({
        script_id_part: scriptId
      });

      const response = await fetch(this.urls.script_info, {
        method: 'POST',
        headers: {
          ...this.getAuthenticatedHeaders(),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      if (!response.ok) {
        return { success: false, error: `Failed to fetch script details: ${response.status}` };
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: `Script details for ${scriptId}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch script details'
      };
    }
  }
}

export function createTradingViewService(): TradingViewService | null {
  const username = process.env.TRADINGVIEW_USERNAME;
  const password = process.env.TRADINGVIEW_PASSWORD;
  
  if (!username || !password) {
    console.error('TradingView credentials not configured');
    return null;
  }
  
  return new TradingViewService({ username, password });
}