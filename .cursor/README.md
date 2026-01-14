# Cursor Rules Directory

This directory contains structured rules and patterns for AI assistants working on TheQRCode.io.

## File Structure

Each `.mdc` file in this directory provides specific guidance for different aspects of the codebase:

### Core Rules

- **`project-structure.mdc`** - Project architecture, directory structure, and key files
  - Always applies (`alwaysApply: true`)
  - Essential for understanding the codebase layout

- **`typescript-react-standards.mdc`** - TypeScript and React coding standards
  - Type safety patterns
  - Component patterns
  - React hooks usage

- **`nextjs-patterns.mdc`** - Next.js 15 specific patterns
  - App Router conventions
  - Server Components vs Client Components
  - Route handlers

### Backend Rules

- **`api-backend-patterns.mdc`** - API route development patterns
  - Applies to: `src/app/api/**/*`, `src/lib/**/*`
  - Authentication patterns
  - Error handling
  - Input validation
  - Database queries

- **`database-prisma.mdc`** - Database and Prisma ORM patterns
  - Applies to: `prisma/**/*`, `src/lib/prisma.ts`
  - Schema design
  - Query patterns
  - Transactions
  - Performance optimization

### Frontend Rules

- **`component-design.mdc`** - React component design patterns
  - Component structure
  - Props patterns
  - State management
  - Styling with Tailwind CSS

### Workflow Rules

- **`development-workflow.mdc`** - Development practices (not always applied)
  - Git workflow
  - Testing strategies
  - Code quality standards
  - Deployment processes

## How Rules Work

### Always Apply Rules
Files with `alwaysApply: true` are automatically included in AI context:
- `project-structure.mdc` - Always available

### Glob-Based Rules
Files with `globs` patterns are included when working on matching files:
- `api-backend-patterns.mdc` - Included when editing API routes or lib files
- `database-prisma.mdc` - Included when editing Prisma schema or database code
- `component-design.mdc` - Included when editing React components

### Manual Rules
Files without `alwaysApply` or `globs` are available but not automatically applied:
- `development-workflow.mdc` - Reference when needed

## Usage Guidelines

1. **Check project-structure.mdc first** - Always understand the overall architecture
2. **Follow glob-based rules** - They activate automatically for relevant files
3. **Reference workflow rules** - Use when working on specific tasks (testing, deployment, etc.)
4. **Combine rules** - Multiple rules can apply simultaneously

## Adding New Rules

When adding a new rule file:

1. **Use `.mdc` extension** - Markdown with frontmatter
2. **Set `alwaysApply: true`** - For core/always-needed rules
3. **Use `globs`** - For file-specific rules
4. **Add description** - Brief description in frontmatter
5. **Update this README** - Document the new rule

Example:
```markdown
---
globs: src/components/**/*
description: Component styling patterns
---

# Component Styling Patterns
...
```

## Rule Priority

1. **Project structure** - Always applies
2. **File-specific rules** - Apply based on globs
3. **Workflow rules** - Apply when referenced

## Best Practices

- **Keep rules focused** - One concern per file
- **Use examples** - Include code examples in rules
- **Update regularly** - Keep rules in sync with codebase changes
- **Reference external docs** - Link to detailed documentation in `docs/`

## Related Documentation

- **README.md** - Main project documentation
- **docs/AI_PROMPT.md** - Quick AI reference
- **docs/API_ENDPOINTS.md** - API endpoint reference
- **docs/DATA_MODEL.md** - Database schema reference
- **.ai-metadata.json** - Structured project metadata
