import { chromium, Browser, BrowserContext, Page } from 'playwright';

export interface TradingViewBrowserConfig {
  username: string;
  password: string;
  headless?: boolean;
  timeout?: number;
}

export interface ScriptAccessRequest {
  username: string;
  scriptIds: string[];
  duration: string; // e.g., "7d", "30d", "lifetime"
  tier: 'basic' | 'pro' | 'enterprise';
}

export class TradingViewBrowserService {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private config: TradingViewBrowserConfig;
  private isAuthenticated = false;

  constructor(config: TradingViewBrowserConfig) {
    this.config = {
      headless: true,
      timeout: 30000,
      ...config
    };
  }

  async initialize(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // Launch browser with anti-detection measures
      this.browser = await chromium.launch({
        headless: this.config.headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      });

      this.context = await this.browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        extraHTTPHeaders: {
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });

      this.page = await this.context.newPage();
      
      // Set timeouts
      this.page.setDefaultTimeout(this.config.timeout!);
      
      return { success: true, message: 'Browser initialized successfully' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to initialize browser' 
      };
    }
  }

  async authenticate(): Promise<{ success: boolean; message?: string; error?: string }> {
    if (!this.page) {
      return { success: false, error: 'Browser not initialized' };
    }

    try {
      console.log('🌐 Navigating to TradingView...');
      await this.page.goto('https://www.tradingview.com/accounts/signin/', {
        waitUntil: 'networkidle'
      });

      console.log('🔐 Filling login form...');
      await this.page.waitForSelector('input[name="username"]', { timeout: 10000 });
      
      await this.page.fill('input[name="username"]', this.config.username);
      await this.page.fill('input[name="password"]', this.config.password);

      // Handle potential CAPTCHA
      console.log('🤖 Checking for CAPTCHA...');
      const captchaElement = await this.page.$('.recaptcha-checkbox-border');
      
      if (captchaElement) {
        console.log('⚠️ CAPTCHA detected - manual intervention may be required');
        
        // In production, you might want to:
        // 1. Pause automation and notify admin
        // 2. Use CAPTCHA solving service
        // 3. Switch to headful mode for manual solving
        
        if (!this.config.headless) {
          console.log('💡 Running in headful mode - please solve CAPTCHA manually');
          console.log('⏳ Waiting 60 seconds for manual CAPTCHA solving...');
          await this.page.waitForTimeout(60000);
        } else {
          return { 
            success: false, 
            error: 'CAPTCHA detected - requires manual intervention or headless bypass' 
          };
        }
      }

      console.log('🚀 Submitting login form...');
      await this.page.click('button[type="submit"], .tv-signin-dialog__toggle-password-visibility ~ button');
      
      // Wait for redirect or error
      await Promise.race([
        this.page.waitForURL('https://www.tradingview.com/', { timeout: 15000 }),
        this.page.waitForSelector('.tv-signin-dialog__error', { timeout: 5000 })
      ]);

      // Check for authentication success
      const currentUrl = this.page.url();
      if (currentUrl.includes('tradingview.com') && !currentUrl.includes('signin')) {
        console.log('✅ Authentication successful');
        this.isAuthenticated = true;
        return { success: true, message: 'Successfully authenticated with TradingView' };
      }

      // Check for error messages
      const errorElement = await this.page.$('.tv-signin-dialog__error');
      if (errorElement) {
        const errorText = await errorElement.textContent();
        return { success: false, error: `Authentication failed: ${errorText}` };
      }

      return { success: false, error: 'Authentication failed - unknown reason' };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication process failed' 
      };
    }
  }

  async grantScriptAccess(request: ScriptAccessRequest): Promise<{ success: boolean; results: any[]; errors: string[] }> {
    if (!this.isAuthenticated || !this.page) {
      return { 
        success: false, 
        results: [], 
        errors: ['Not authenticated or browser not initialized'] 
      };
    }

    const results: any[] = [];
    const errors: string[] = [];

    try {
      for (const scriptId of request.scriptIds) {
        console.log(`📝 Granting access to script ${scriptId} for user ${request.username}`);
        
        try {
          // Navigate to script management page
          await this.page.goto(`https://www.tradingview.com/pine_perm/add/?script_id_part=${scriptId}`, {
            waitUntil: 'networkidle'
          });

          // Wait for the form to load
          await this.page.waitForSelector('input[name="username_recip"]', { timeout: 10000 });

          // Fill the username field
          await this.page.fill('input[name="username_recip"]', request.username);

          // Set duration based on tier and request
          await this.setAccessDuration(request.duration, request.tier);

          // Submit the form
          await this.page.click('button[type="submit"], .btn-primary');

          // Wait for success/error response
          await this.page.waitForTimeout(2000);

          // Check for success/error messages
          const successElement = await this.page.$('.alert-success, .success');
          const errorElement = await this.page.$('.alert-danger, .error');

          if (successElement) {
            const successText = await successElement.textContent();
            results.push({
              scriptId,
              username: request.username,
              success: true,
              message: successText
            });
            console.log(`✅ Access granted for script ${scriptId}`);
          } else if (errorElement) {
            const errorText = await errorElement.textContent();
            errors.push(`Script ${scriptId}: ${errorText}`);
            console.log(`❌ Failed to grant access for script ${scriptId}: ${errorText}`);
          } else {
            results.push({
              scriptId,
              username: request.username,
              success: true,
              message: 'Access granted (no explicit confirmation)'
            });
            console.log(`✅ Access likely granted for script ${scriptId}`);
          }

        } catch (scriptError) {
          const errorMsg = scriptError instanceof Error ? scriptError.message : 'Unknown error';
          errors.push(`Script ${scriptId}: ${errorMsg}`);
          console.log(`❌ Error granting access for script ${scriptId}: ${errorMsg}`);
        }
      }

      return {
        success: errors.length === 0,
        results,
        errors
      };

    } catch (error) {
      return {
        success: false,
        results,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      };
    }
  }

  private async setAccessDuration(duration: string, tier: string): Promise<void> {
    if (!this.page) return;

    const durationMap: { [key: string]: { type: string; value: string } } = {
      '7d': { type: 'd', value: '7' },
      '30d': { type: 'd', value: '30' },
      '90d': { type: 'd', value: '90' },
      '1y': { type: 'd', value: '365' },
      'lifetime': { type: 'lifetime', value: '' }
    };

    const tierDurationMap: { [key: string]: string } = {
      'basic': '30d',
      'pro': '90d', 
      'enterprise': '1y'
    };

    // Use requested duration or default based on tier
    const actualDuration = duration === 'auto' ? tierDurationMap[tier] : duration;
    const durationConfig = durationMap[actualDuration] || durationMap['30d'];

    try {
      // Select duration type dropdown
      const durationTypeSelector = 'select[name="duration_type"]';
      await this.page.waitForSelector(durationTypeSelector, { timeout: 5000 });
      await this.page.selectOption(durationTypeSelector, durationConfig.type);

      // Fill duration number if not lifetime
      if (durationConfig.type !== 'lifetime' && durationConfig.value) {
        const durationNumberSelector = 'input[name="duration_number"]';
        await this.page.waitForSelector(durationNumberSelector, { timeout: 5000 });
        await this.page.fill(durationNumberSelector, durationConfig.value);
      }

    } catch (error) {
      console.log(`⚠️ Could not set duration, using default: ${error}`);
    }
  }

  async validateUsername(username: string): Promise<{ valid: boolean; suggestions?: string[] }> {
    if (!this.isAuthenticated || !this.page) {
      return { valid: false };
    }

    try {
      // Use TradingView's username hint API through browser
      const response = await this.page.evaluate(async (username) => {
        const response = await fetch(`https://www.tradingview.com/username_hint/${encodeURIComponent(username)}`);
        return await response.json();
      }, username);

      return {
        valid: Array.isArray(response) && response.length > 0,
        suggestions: Array.isArray(response) ? response : []
      };

    } catch (error) {
      console.log(`⚠️ Username validation error: ${error}`);
      return { valid: false };
    }
  }

  async cleanup(): Promise<void> {
    try {
      if (this.page) await this.page.close();
      if (this.context) await this.context.close();
      if (this.browser) await this.browser.close();
    } catch (error) {
      console.log(`⚠️ Cleanup error: ${error}`);
    }
    
    this.page = null;
    this.context = null;
    this.browser = null;
    this.isAuthenticated = false;
  }
}

export function createTradingViewBrowserService(): TradingViewBrowserService | null {
  const username = process.env.TRADINGVIEW_USERNAME;
  const password = process.env.TRADINGVIEW_PASSWORD;
  
  if (!username || !password) {
    console.error('TradingView credentials not configured');
    return null;
  }
  
  return new TradingViewBrowserService({ 
    username, 
    password,
    headless: process.env.NODE_ENV === 'production'
  });
}