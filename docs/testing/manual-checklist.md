# Manual Testing Checklist

## Core Framework
- [ ] Development server starts without errors
- [ ] Hot reload works correctly
- [ ] Environment variables are loaded
- [ ] TypeScript compilation succeeds
- [ ] ESLint shows no errors
- [ ] All pages load correctly

## Authentication
- [ ] Sign up with new email
- [ ] Verify email flow
- [ ] Sign in with existing account
- [ ] Password reset flow
- [ ] Protected routes redirect correctly
- [ ] Session persistence works
- [ ] Logout clears session

## AI Integration
- [ ] OpenAI generates responses
- [ ] Claude fallback works
- [ ] Rate limiting triggers correctly
- [ ] Token usage is tracked
- [ ] Costs are calculated accurately
- [ ] Error handling works

## File Storage
- [ ] File upload works
- [ ] Image optimization processes
- [ ] Storage limits enforce
- [ ] Secure URLs generate
- [ ] File types validate
- [ ] Large files handle correctly

## Payment System
- [ ] Stripe checkout flow
- [ ] Subscription activates
- [ ] Usage tracking updates
- [ ] Invoices generate
- [ ] Customer portal access
- [ ] Payment method updates
- [ ] Webhook processing

## Analytics & Email
- [ ] Events track correctly
- [ ] Email templates render
- [ ] Notifications send
- [ ] Dashboard displays data
- [ ] Error logging captures
- [ ] Performance metrics show 