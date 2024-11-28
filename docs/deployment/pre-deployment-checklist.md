# Pre-deployment Checklist

## Code Quality
- [ ] All tests pass (`npm run verify`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] Code coverage > 80% (`npm run test:coverage`)

## Security
- [ ] Environment variables configured
- [ ] API keys rotated
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] File upload validation
- [ ] SQL injection prevention
- [ ] XSS protection

## Performance
- [ ] Lighthouse score > 90
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] API response times < 200ms
- [ ] Caching configured
- [ ] CDN configured

## Infrastructure
- [ ] Database backups configured
- [ ] Monitoring set up
- [ ] Error tracking enabled
- [ ] SSL certificates valid
- [ ] DNS records configured
- [ ] Cloudflare rules set 