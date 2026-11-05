# Local assistant integration

`skill-context.mjs` selects at most two relevant `SKILL.md` files for a question. It reads them from this local repository copy and returns bounded reference text. It sends no request to GitHub and reads no company data.

The `monthly-report-review` route is selected for requests to review an entire or monthly report. It supplies the shared review procedure to the MPL, GPL, and EIC Qwen relays. This makes the procedure available during a chat; it does not automatically run after an Excel-to-HTML build and it cannot inspect local files unless the assistant's environment explicitly supplies them. For an actual whole-report review, provide both the finalized source workbook and generated HTML in an approved file-capable workflow. Do not send restricted full report data to an external model without company authorization.

The MPL, GPL, and EIC relays look for this clone at `%USERPROFILE%\Desktop\GitHub-Clones\hk-finance-skills`. Set `HK_FINANCE_SKILLS_DIR` to another local clone path if needed. Keep this repository's accounting guidance under review; pull approved changes into the local clone before using them in the assistants.

Each relay's `GET /health` response includes `financeSkillsReady`. A chat response includes the selected skill names in `skills`. Company context is supplied separately by the corresponding assistant and never written into this repository.

The relays need restarting after `skill-context.mjs` changes. Edits to topic `SKILL.md` files are read on the next matching question.
