import { test, expect } from '@playwright/test'

test.describe('Subscription Flow', () => {
  test('should complete subscription process', async ({ page }) => {
    await page.goto('/pricing')
    await page.click('text=Basic Plan')
    
    // Fill Stripe form
    const stripe = await page.frameLocator('iframe[name="stripe-card"]')
    await stripe.locator('[placeholder="Card number"]').fill('4242424242424242')
    await stripe.locator('[placeholder="MM / YY"]').fill('1234')
    await stripe.locator('[placeholder="CVC"]').fill('123')
    
    await page.click('text=Subscribe')
    
    await expect(page.locator('text=Subscription Active')).toBeVisible()
  })
}) 