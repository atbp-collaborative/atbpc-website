# Custom Developer Rules

This document outlines key rules, best practices, and guidelines that must be strictly followed when contributing to the codebase.

---

## 1. Code Quality & Architecture

### DRY (Don't Repeat Yourself)
* **Code Reuse**: Avoid duplicate logic across the codebase. Refactor repetitive code blocks, algorithms, or utility logic into shared components or helper files.
* **Refactoring**: If you notice similar patterns being repeated in multiple places, extract them into a centralized location.

### Separation of Concerns (SoC)
* **Helper Functions**: Place helper, utility, or business-logic functions in dedicated, separate helper files instead of mixing them with presentation/view layers.
* **Separate Views**: Keep views/components modular and focused. Do not mix unrelated view logic or multiple complex views in a single file. Each major UI section or page should have its own separate component file.
* **Logic vs. UI**: Keep rendering code distinct from heavy data-fetching or state-manipulation logic. Use custom hooks, controllers, or services to manage complex state or side-effects.

---

## 2. Component Reusability
* **Audit Existing UI**: Before writing any new UI snippet, custom style, or component from scratch, perform a search of the existing codebase to locate reusable components.
* **Extend Rather Than Duplicate**: If an existing component almost fits your needs, extend its properties (props) or config options rather than creating a duplicate or slightly modified copy.
* **Consistency**: Use established design tokens, theme configurations, and component sets to ensure visual and functional consistency across the application.

---

## 3. Implementation Plans
* **Deliver as Artifact**: Whenever proposing major changes, always deliver the implementation plan as a markdown artifact (`implementation_plan.md`).
* **Change Table Requirement**: Whenever applicable, represent proposed changes in a clear, structured table.
* **Table Schema**: The table must contain the following columns:
  | Change Description | Route | Files Affected | Type |
  
  *Where **Type** must be one of: `NEW`, `MODIFY`, or `DELETE`.*

---

## 4. PR Descriptions
* **On-Demand Only**: Do NOT deliver a PR description automatically for every change. Only generate and deliver a PR description when the user explicitly asks for one.
* **Standard Markdown**: When requested, always write and format PR descriptions using standard GitHub-flavored markdown (`.md` format).
* **Delivery Method**: Deliver the PR description inside a standard copyable markdown block directly in the conversation response (do NOT deliver it as an artifact).
* **Readable Structure**: Use clear headers, bulleted lists, bold text, and code blocks. Make it easy for reviewers to scan, understand the purpose, and follow the test/deployment steps.


