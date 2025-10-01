# Contributing to EcoDAO 🌱

Thank you for your interest in contributing to EcoDAO! We welcome contributions from developers, environmentalists, designers, and community organizers.

## 🤝 Ways to Contribute

### **🔧 Code Contributions**
- Smart contract improvements and optimizations
- Frontend features and UI enhancements
- Bug fixes and security improvements
- Test coverage expansion
- Documentation updates

### **🎨 Design Contributions**
- UI/UX improvements
- Brand and visual identity
- User experience research
- Accessibility enhancements

### **📚 Documentation**
- Technical documentation
- User guides and tutorials
- API documentation
- Translation and localization

### **🌍 Community**
- Bug reports and feature requests
- Community feedback and testing
- Educational content creation
- Partnership development

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- Git and GitHub account
- MetaMask or compatible Web3 wallet
- Basic knowledge of React/TypeScript (for frontend)
- Solidity knowledge (for smart contracts)

### **Development Setup**

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/verdao.git
   cd ecodao
   ```

2. **Install Dependencies**
   ```bash
   # Smart contracts
   cd contracts && npm install
   
   # Frontend
   cd ../frontend && npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy example environment files
   cp contracts/.env.example contracts/.env
   cp frontend/.env.example frontend/.env.local
   
   # Fill in your configuration values
   ```

4. **Run Tests**
   ```bash
   # Smart contract tests
   cd contracts && npm test
   
   # Frontend build test
   cd ../frontend && npm run build
   ```

## 🏗️ Development Workflow

### **Smart Contract Development**

```bash
cd contracts

# Compile contracts + generate types
npm run compile

# Run tests
npm run test

# Gas usage analysis
npm run gas-report

# Deploy to local network
npm run deploy:local

# Deploy to Amoy testnet
npm run deploy:amoy
```

### **Frontend Development**

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

### **Branch Strategy**

- **`master`** - Production-ready code
- **`develop`** - Integration branch for features
- **`feature/*`** - New features and improvements
- **`fix/*`** - Bug fixes
- **`docs/*`** - Documentation updates

### **Commit Messages**

Use conventional commit format:

```
type(scope): description

Examples:
feat(contracts): add reputation system to action verification
fix(frontend): resolve wallet connection timeout issue
docs(readme): update deployment instructions
test(contracts): add edge cases for governance voting
```

**Types:**
- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation
- `test` - Testing
- `refactor` - Code refactoring
- `style` - Code style changes
- `chore` - Maintenance tasks

## 🧪 Testing Guidelines

### **Smart Contract Testing**

- Write comprehensive tests for all new functionality
- Include edge cases and error conditions
- Test gas usage and optimization
- Use meaningful test descriptions

```solidity
describe("ActionRewards", function () {
  it("should reject action submission during cooldown period", async function () {
    // Test implementation
  });
});
```

### **Frontend Testing**

- Test component rendering and interactions
- Verify Web3 integration functionality
- Check responsive design across devices
- Ensure accessibility compliance

## 📋 Pull Request Process

### **Before Submitting**

1. **✅ Code Quality**
   - [ ] All tests pass (`npm test`)
   - [ ] Code follows project style guidelines
   - [ ] No linting errors (`npm run lint`)
   - [ ] TypeScript compilation successful

2. **✅ Documentation**
   - [ ] Code is well-commented
   - [ ] README updated if needed
   - [ ] API changes documented

3. **✅ Security**
   - [ ] No private keys or secrets committed
   - [ ] Smart contract changes reviewed for security
   - [ ] Input validation and error handling

### **Pull Request Template**

```markdown
## 📝 Description
Brief description of changes and motivation.

## 🔄 Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update

## 🧪 Testing
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing tests pass locally with my changes

## 📋 Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

### **Review Process**

1. **Automated Checks**
   - GitHub Actions CI/CD pipeline
   - Code quality and security scans
   - Test suite execution

2. **Human Review**
   - Code review by maintainers
   - Security review for smart contract changes
   - Design review for UI changes

3. **Deployment**
   - Merge to develop branch
   - Integration testing
   - Production deployment (master branch)

## 🏷️ Issue Guidelines

### **Bug Reports**

Use the bug report template and include:

- **Environment**: OS, browser, wallet version
- **Steps to reproduce**: Clear, numbered steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Error messages**: Copy exact text

### **Feature Requests**

Use the feature request template and include:

- **Problem statement**: What problem does this solve?
- **Proposed solution**: How should it work?
- **Alternatives considered**: Other approaches
- **User benefit**: Who benefits and how?
- **Implementation complexity**: High/medium/low estimate

## 🔒 Security

### **Responsible Disclosure**

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email: **security@ecodao.org**
3. Include detailed description and reproduction steps
4. Allow time for fix before public disclosure

### **Security Best Practices**

- Never commit private keys or secrets
- Use environment variables for sensitive data
- Follow smart contract security guidelines
- Report suspicious activity immediately

## 🎯 Areas for Contribution

### **🔥 High Priority**
- Smart contract gas optimization
- Mobile responsiveness improvements
- Accessibility compliance (WCAG 2.1)
- Additional test coverage
- Performance optimization

### **🌟 Feature Ideas**
- Multi-language support (i18n)
- Progressive Web App (PWA) capabilities
- Advanced analytics dashboard
- Carbon footprint calculator
- Community reputation system

### **🐛 Known Issues**
Check our [GitHub Issues](https://github.com/russell-henderson/verdao/issues) for current bugs and feature requests.

## 📚 Resources

### **Learning Materials**
- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Next.js Documentation](https://nextjs.org/docs)
- [wagmi Documentation](https://wagmi.sh/)
- [Hardhat Documentation](https://hardhat.org/docs)

### **Project-Specific Docs**
- [Architecture Guide](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [AI Assistant Instructions](.github/copilot-instructions.md)

## 🏆 Recognition

Contributors will be:

- Listed in our contributors section
- Credited in release notes
- Invited to community events
- Eligible for community NFT rewards
- Considered for core team positions

## 📞 Support

- **💬 Discord**: [Join our community](https://discord.gg/ecodao)
- **📧 Email**: developers@ecodao.org
- **🐦 Twitter**: [@EcoDAO_org](https://twitter.com/EcoDAO_org)
- **📋 GitHub Discussions**: [Project discussions](https://github.com/russell-henderson/verdao/discussions)

---

## 📄 Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 📜 License

By contributing to EcoDAO, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

**Happy coding! 🚀 Together we're building a more sustainable future through decentralized governance.**