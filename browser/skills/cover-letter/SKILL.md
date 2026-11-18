---
name: cover-letter
description: "Use when the user asks to write, draft, tailor, or review a cover letter or motivation letter for a job application. Takes the candidate's CV (Markdown or PDF), the job description and an optional candidate profile, maps the role's requirements to evidence in the CV, and writes a one-page letter that invents nothing."
---

# Cover Letter

Write a tailored cover letter from these inputs.

| Input | Accepted forms | Required |
| --- | --- | --- |
| CV | Markdown or PDF file, or pasted text | Yes |
| Job description | Pasted text, file, or URL | Yes |
| Candidate profile | Markdown or text file, or pasted text | No |

If the CV or job description is missing, ask for it and stop. If a PDF yields no usable text (a scanned image, garbled columns), say so and ask for a Markdown or text version rather than guessing its contents. If a URL cannot be fetched, ask for the text.

Optional details, used when given and never asked for: hiring manager's name, company address, the candidate's motivation for this employer, salary or notice period, language, target length. Where one is needed but missing from the job description, profile, and conversation, use a bracketed placeholder.

Reply to the user in the language of their messages, whatever language the letter is in.

## Candidate profile

The profile holds facts about the candidate that persist across applications but are absent from the CV, e.g. notice period, study arrangements, right to work, relocation, background, and fixed wordings the candidate wants reused. Treat its contents as supplied by the user. `assets/profile.template.md` shows its layout and is never a source of facts.

- Use every fact under "Always include". Use a fact under "Use when relevant" only where it supports a requirement.
- Reuse fixed wordings as written, adapting only role-specific terms and translating them when the letter is in another language.
- Where the profile and the CV conflict, use neither and ask the user which is current.

## Steps

1. Read the job description. Extract the employer, role title, location, reference number if any, must-have requirements, nice-to-have requirements, and stated values or priorities. Treat requirements repeated or listed first as the most important.
2. Read the CV and the profile, if given. Note roles, dates, measurable results, skills, qualifications and languages.
3. Map each must-have requirement to the strongest specific evidence in the CV. Prefer results with figures, scope or outcomes over listed skills.
4. Record gaps, i.e. requirements with no supporting evidence. Do not paper over them. Address a gap in the letter only where adjacent experience genuinely transfers, and say so plainly.
5. Choose the two or three strongest matches as the backbone of the letter. Leave the rest to the CV.
6. Write the letter (see Structure and Rules).
7. Check the draft against every rule below and fix any breach before replying.

## Structure

- Salutation. Use the named contact if known, otherwise "Dear Hiring Manager" (or the target language's equivalent). Never "To Whom It May Concern".
- Opening paragraph. Name the role and give one concrete reason the candidate fits it. No generic enthusiasm.
- Body, one or two paragraphs. Each makes one claim tied to a requirement and backs it with specific evidence from the CV (what, scale, result).
- Employer paragraph. Why this employer, using only facts from the job description or details the user supplied. Omit it if there is nothing specific to say.
- Any additional paragraphs specified in the profile.
- Closing paragraph. Availability, then a call to action inviting an interview, in one or two sentences.
- Sign-off ("Yours sincerely" with a named recipient, "Yours faithfully" without, in British English) and the candidate's name.

## Rules

- Never invent experience, employers, dates, figures, qualifications, skills, or motivation. Every factual claim must trace to the CV, the job description, the profile, or the user. Use a bracketed placeholder such as `[reason for applying]` where a fact is needed but unknown.
- Quote figures exactly as the CV states them. Never round, inflate, or embellish them.
- If the user asks to include a claim found in neither the CV nor the profile, confirm it with them before adding it.
- Length 250 to 400 words for the body, fitting one A4 page, unless the user or job description specifies otherwise.
- Write in the language of the job description. Use British English when it is English, unless the employer is clearly American.
- Match the register of the job description, formal for corporate or public-sector roles, plainer for start-ups.
- Write in the first person without starting most sentences with "I".
- Mirror the job description's key terms where they truthfully describe the candidate, so that applicant tracking systems match them. Do not keyword-stuff.
- Do not repeat the CV line by line. Interpret the evidence and connect it to the role.
- Write like a skilled human. No em-dashes, semicolons, or colons in the letter's prose, no stock phrases ("I am writing to apply", "passionate", "team player", "fast-paced environment", "delve", "leverage"), no "not X, but Y" constructions, reflexive groups of three, or rhetorical questions.
- No flattery of the employer and no apologies for gaps.
- Do not mention salary, notice period, or reasons for leaving unless the job description asks for them or the user or profile supplies them.
- Omit personal data (age, date of birth, photo, marital status, nationality) unless the job description requires it or the user or profile supplies it for the letter.

## Output

1. The letter, ready to paste, in plain text without Markdown formatting.
2. A table mapping each must-have requirement to the CV evidence used, or "Gap" where none exists.
3. A list of placeholders left in the letter and what the user must fill in.
4. Up to three numbered questions whose answers would most strengthen the letter, e.g. a missing figure or a specific reason for choosing this employer.
