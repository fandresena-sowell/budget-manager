# Monthly Budget Manager

A comprehensive personal finance application built with Quasar Framework and Firebase to help users track, manage, and analyze their monthly finances. This hybrid app works across web and mobile platforms with a mobile-first design approach.

## Project Overview

The Monthly Budget Manager provides:
- User authentication and profile management
- Income source tracking with recurring entries
- Expense tracking with receipt uploads
- Monthly budget planning by categories
- Visual reports and spending analysis
- Cloud synchronization across devices

## Tech Stack

- **Frontend**: Quasar Framework (Vue.js 3 with Composition API)
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **State Management**: Pinia
- **Build Tools**: Quasar CLI
- **Testing**: Vitest

## Development Process

### Adding Tasks to TODO.md

To add a new task to the project:

1. Identify a specific, focused aspect of the application that needs to be implemented
2. Open the `.cursor/docs/TODO.md` file
3. Add a new task entry following the existing format:
   ```
   - [ ] TASK-XXX: Brief description of the task
   ```
4. Ensure each task has a unique ID and is scoped to be completable in 2-6 hours

### Creating Task Files

To generate a detailed task file for any task in `.cursor/docs/TODO.md`:

1. Create a prompt for Claude 3.7 Sonnet with the following structure:

```
Using the task template file at .cursor/docs/task-template.md, please generate a detailed task file for the TODO.md task: [TASK-XXX: Task description]

The task should be stored in the .cursor/docs/tasks/ folder as TASK-XXX.md and should include:
- Clear requirements based on the project specifications
- Specific implementation steps
- Success criteria for completion
- Any dependencies on other tasks
- Relevant notes for implementation

Please reference the project specifications in .cursor/docs/INIT.md for guidance on requirements and technical approach.
```

2. After receiving the task file, review it for completeness and accuracy
3. Place the file in the `.cursor/docs/tasks/` directory with the appropriate task ID filename

## Project Documentation

- [Project Specifications](.cursor/docs/INIT.md) - Detailed overview of the project requirements and architecture
- [Task Template](.cursor/docs/task-template.md) - Template for creating structured task files
- [Task List](.cursor/docs/TODO.md) - Comprehensive list of development tasks

## Getting Started

1. Clone this repository
2. Install dependencies with `npm install`
3. Run the development server with `quasar dev`
4. Follow the tasks in `.cursor/docs/TODO.md` to implement features

## Project Maintenance

- Follow the development workflow outlined in `.cursor/docs/TODO.md`
- Keep the `CHANGELOG.md` updated as tasks are completed
- Maintain clean code practices and thorough documentation
- Submit changes using conventional commit messages 