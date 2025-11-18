# Contributing to DevOverflow 🤝

Thank you for your interest in contributing to DevOverflow! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### 1. Fork the Repository

Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/devoverflow.git
cd devoverflow
```

### 3. Add Upstream Remote

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/devoverflow.git
```

### 4. Install Dependencies

```bash
npm run setup:install
```

### 5. Set Up Environment

```bash
npm run setup:env
```

### 6. Set Up Database

```bash
npm run setup:db
```

### 7. Start Development

```bash
npm run dev
```

## 🔄 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 2. Make Your Changes

- Write clean, readable code
- Follow the coding standards
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run tests
cd server && npm test
cd client && npm test

# Check linting
cd server && npm run lint
cd client && npm run lint

# Build to ensure no errors
npm run build
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 5. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Create Pull Request

Go to the original repository and click "New Pull Request".

## 💻 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use meaningful variable names

```typescript
// Good
interface User {
  id: string;
  email: string;
  name: string;
}

async function getUserById(id: string): Promise<User> {
  return await prisma.user.findUnique({ where: { id } });
}

// Bad
async function getUser(x: any): Promise<any> {
  return await prisma.user.findUnique({ where: { id: x } });
}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Extract reusable logic into custom hooks

```typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}

// Bad
export function Button(props: any) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### NestJS Services

- Use dependency injection
- Keep services focused on single responsibility
- Use proper error handling
- Add logging for important operations

```typescript
// Good
@Injectable()
export class QuestionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async findById(id: string): Promise<Question> {
    try {
      const question = await this.prisma.question.findUnique({
        where: { id },
      });
      
      if (!question) {
        throw new NotFoundException(`Question ${id} not found`);
      }
      
      return question;
    } catch (error) {
      this.logger.error(`Error finding question ${id}:`, error);
      throw error;
    }
  }
}
```

### File Organization

```
src/
├── module-name/
│   ├── module-name.module.ts
│   ├── module-name.controller.ts
│   ├── module-name.service.ts
│   ├── dto/
│   │   ├── create-module.dto.ts
│   │   └── update-module.dto.ts
│   └── entities/
│       └── module.entity.ts
```

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

```bash
feat(questions): add sorting by popularity

Add ability to sort questions by number of votes and views.
Includes new API endpoint and UI controls.

Closes #123

---

fix(auth): resolve token expiration issue

Fixed bug where JWT tokens were expiring too quickly.
Updated token expiration time to 24 hours.

Fixes #456

---

docs(readme): update installation instructions

Added more detailed steps for Windows users.
Included troubleshooting section.
```

### Scope

The scope should be the name of the module affected:
- `questions`
- `answers`
- `auth`
- `ui`
- `api`
- `mobile`
- etc.

## 🔍 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Commit messages follow guidelines
- [ ] Branch is up to date with main

### PR Title

Use the same format as commit messages:

```
feat(questions): add sorting by popularity
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, PR will be merged
4. Your contribution will be credited

## 🧪 Testing

### Backend Tests

```bash
cd server

# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

### Frontend Tests

```bash
cd client

# Unit tests
npm test

# E2E tests (if available)
npm run test:e2e
```

### Writing Tests

```typescript
// Example: Service test
describe('QuestionsService', () => {
  let service: QuestionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [QuestionsService, PrismaService],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should find question by id', async () => {
    const mockQuestion = { id: '1', title: 'Test' };
    jest.spyOn(prisma.question, 'findUnique').mockResolvedValue(mockQuestion);

    const result = await service.findById('1');
    expect(result).toEqual(mockQuestion);
  });
});
```

## 📚 Documentation

### Code Comments

- Add comments for complex logic
- Use JSDoc for functions and classes
- Keep comments up to date

```typescript
/**
 * Finds a question by ID and increments view count
 * @param id - The question ID
 * @returns The question with updated view count
 * @throws NotFoundException if question not found
 */
async findById(id: string): Promise<Question> {
  // Implementation
}
```

### README Updates

- Update README.md for new features
- Add examples for new APIs
- Update installation steps if needed

### API Documentation

- Update Swagger/OpenAPI docs
- Add request/response examples
- Document error responses

## 🐛 Reporting Bugs

### Before Reporting

- Check if bug already reported
- Try to reproduce the bug
- Gather relevant information

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 96]
- Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of desired solution

**Describe alternatives you've considered**
Alternative solutions or features

**Additional context**
Mockups, examples, etc.
```

## 🎯 Areas for Contribution

### Good First Issues

Look for issues labeled `good first issue` - these are great for newcomers!

### Help Wanted

Issues labeled `help wanted` need community contributions.

### Priority Areas

- Bug fixes
- Performance improvements
- Documentation
- Test coverage
- Accessibility
- Mobile features
- AI improvements

## 📧 Getting Help

- **Discord**: Join our [Discord server](https://discord.gg/devoverflow)
- **Email**: dev@devoverflow.com
- **Issues**: Open an issue on GitHub

## 🙏 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the project

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to DevOverflow! 🎉
