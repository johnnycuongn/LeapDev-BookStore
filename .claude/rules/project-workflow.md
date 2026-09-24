# Project workflow

- This is an assessed take-home: reviewers read the commit history. Make one logical change per commit with a message that explains *why* (e.g. `fix: reverse spread order so edits are not overwritten by the original book`).
- Run `pnpm build` before committing. It is the only type-check gate in this repo.
- When the README asks for an explanation (component library choice, bug fix), write it into `README.md` under the matching numbered item, in the candidate's voice, two to five sentences.
- Do not add dependencies without a reason that would survive a code review. Prefer one component library over several overlapping ones.
- Keep `public/data.json` as the seed data source. Do not move it to a database or API unless asked.
- Do not delete or rename existing cover images in `public/images/covers/`.
