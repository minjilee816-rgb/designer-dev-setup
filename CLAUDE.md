# Project Guidelines

## GitHub Best Practices
- NEVER push directly to main. Always create a feature branch first.
- Branch naming: feature/description, fix/description, or update/description
- Commit often with clear messages describing what and why (not "changes" or "stuff")
- Always pull latest from main before creating a new branch: git pull origin main
- Push your branch and create a Pull Request (PR) for review before merging
- After PR is merged, delete the feature branch
- Standard flow: branch → commit → push → PR → review → merge

## HeyMarvin MCP Usage
When using HeyMarvin to search customer research:
- Start broad with "search" to find relevant projects and transcripts
- Use "ask" for synthesized answers across all research data (takes 10-55 seconds)
- Use "get_file_summary" for a quick overview of a specific interview before reading the full content
- Use "get_file_content" only when you need exact quotes or detailed analysis
- Always specify the product area in queries: "TurboTax", "QuickBooks", "Credit Karma", "Mailchimp"
- For best results, ask follow-up questions that drill into specific themes found in initial search
- When building a spec from research, cite specific customer quotes and interview sources

## Code Quality
- Use the project's design system components for ALL UI (never custom CSS for things the design system provides)
- Check accessibility with the ids-accessibility skill
- Use realistic data in prototypes, not lorem ipsum
- Include loading and error states in all data-fetching components
