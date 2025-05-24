import { chromium } from 'playwright';

const resolutions = [
  // Mobile
  { width: 360, height: 640 },
  { width: 375, height: 667 },
  { width: 414, height: 896 },
  // Tablet
  { width: 768, height: 1024 },
  { width: 810, height: 1080 },
  // Desktop
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
];

const pagesToTest = [
  { name: 'Landing Page', path: '/' },
  { name: 'Login Page', path: '/login' },
  { name: 'Register Page', path: '/register' },
  { name: 'Dashboard Page', path: '/dashboard' },
  { name: 'Vehicles Page', path: '/dashboard/vehicles' },
  { name: 'Trips Page', path: '/dashboard/trips' },
  { name: 'Expenses Page', path: '/dashboard/expenses' },
  { name: 'Tolls Page', path: '/dashboard/tolls' },
  { name: 'Toll Records Page', path: '/dashboard/toll-records' },
  { name: 'Reports Page', path: '/dashboard/reports' },
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  for (const pageInfo of pagesToTest) {
    for (const resolution of resolutions) {
      const page = await context.newPage();
      await page.setViewportSize(resolution);
      try {
        await page.goto(`http://localhost:5173${pageInfo.path}`, { waitUntil: 'networkidle' });
        // Add a small delay to ensure rendering is complete
        await page.waitForTimeout(1000); 
        const screenshotPath = `./screenshots/${pageInfo.name.toLowerCase().replace(/ /g, '_')}-${resolution.width}x${resolution.height}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Screenshot taken for ${pageInfo.name} at ${resolution.width}x${resolution.height}: ${screenshotPath}`);
      } catch (error) {
        console.error(`Error navigating to ${pageInfo.name} at ${resolution.width}x${resolution.height}: ${error.message}`);
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();
})();
