---
description: Stage, typecheck, commit (auto-drafted message), and push to a named branch — with a main-branch guard and lint gate
argument-hint: "<branch-name>"
---

You are performing a safe, guided git push for this project.

**Input received:** $ARGUMENTS

Parse the input as:
- The entire argument → the **target branch name** to push to

---

## Step 1 — Guard: refuse if target is a protected branch

Check if the branch name is `main`, `master`, or `develop`.

If it is, **stop immediately** and print:

```
✗ Pushing directly to '<branch>' is not allowed.
  Create a feature branch instead, e.g.: feat/your-change-name
```

Do not proceed further.

---

## Step 2 — Show current working tree status

Run `git status` and display the output to the user so they can see exactly what is staged, unstaged, and untracked.

Then run `git diff --stat` to show a file-level summary of what has changed.

---

## Step 3 — Stage changes

Ask the user:
```
Stage all modified and untracked files? (yes / no)
```

- If **yes** → stage all changes using `git add` for the specific modified files shown in `git status` (prefer named files over `git add .` to avoid accidentally including `.env` or secrets)
- If **no** → stop and tell the user to manually stage what they need, then re-run `/git-push <branch>`

---

## Step 4 — Run quality gates

Run these two commands in sequence:

```bash
npm run typecheck
npm run lint
```

- If **both pass** (exit 0) → continue to Step 5
- If **either fails** → stop, show the error output, and print:

```
✗ Quality gate failed. Fix the errors above, then re-run /git-push <branch>.
  No commit was created.
```

Do not proceed until both gates pass.

---

## Step 5 — Draft a commit message

Run `git diff --cached` to read what is actually staged.

From the staged diff, draft a **conventional commit** message following this format:

```
<type>: <short summary in present tense, under 72 chars>
```

Choose `<type>` based on what changed:

| Type | When to use |
|---|---|
| `feat` | New feature or page object added |
| `fix` | Bug fix or broken locator corrected |
| `refactor` | Code restructured without behaviour change |
| `test` | New or updated test specs |
| `chore` | Config, deps, tooling changes |
| `docs` | Comments or documentation only |

Show the drafted message to the user:

```
Suggested commit message:
  "<type>: <summary>"

Press Enter to accept, or type your own message:
```

Wait for the user's response. Use their message if they provide one, otherwise use the drafted message.

---

## Step 6 — Commit

Create the commit using the confirmed message, always appending the co-author trailer:

```bash
git commit -m "<confirmed message>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

Show the commit hash and summary line after it is created.

---

## Step 7 — Push to branch

Push to the target branch, creating it on the remote if it does not exist yet:

```bash
git push -u origin <branch-name>
```

---

## Step 8 — Summary report

Print a clean summary:

```
✓ Pushed successfully

  Branch : <branch-name>
  Commit : <short-hash> <commit message>
  Files  : <count> file(s) changed
  Remote : origin/<branch-name>
```

---

## Example

**Command:**
```
/git-push feat/centralise-base-url
```

**What Claude does:**
1. Confirms `feat/centralise-base-url` is not a protected branch
2. Shows `git status` — 8 modified files
3. Asks to stage all → user says yes
4. Runs `npm run typecheck` ✓ and `npm run lint` ✓
5. Drafts: `"refactor: centralise base URL into ENV.baseUrl across all page objects"`
6. User presses Enter to accept
7. Commits with Co-Authored-By trailer
8. Runs `git push -u origin feat/centralise-base-url`
9. Prints summary with commit hash and remote branch name
