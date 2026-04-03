# PDF To Text Workflow

## Goal

Move from copyright-risky raw page screenshots toward a maintainable question bank:

1. Extract PDF pages into local images.
2. Crop white margins for easier review.
3. Generate a manifest CSV for each source question page.
4. Rewrite each question slightly before database import.
5. Import the rewritten questions into the quiz system.

## Local Database Note

This branch uses Node's `pg` driver for the local import pipeline.

- Prisma CLI remains available for schema work.
- Local Windows runtime currently hits a TLS handshake issue when Prisma connects to Supabase.
- The pipeline scripts therefore connect through `pg` with SSL enabled and a pooled Supabase URL.

## Current Constraints

- This PDF is image-heavy and has almost no useful text layer.
- Local machine currently does not have a production-ready Japanese math OCR engine.
- So the stable path is:
  - `PDF -> page images -> manifest CSV -> manual/lightly assisted rewrite -> database`

## Scripts

### 1. Extract PDF pages

```powershell
.\.venv-ocr\Scripts\python.exe .\scripts\extract_pdf_pages.py "<pdf path>"
```

### 2. Crop white margins

```powershell
.\.venv-ocr\Scripts\python.exe .\scripts\crop_white_margins.py "<input dir>"
```

### 3. Generate question manifest CSV

```powershell
.\.venv-ocr\Scripts\python.exe .\scripts\build_pdf_question_manifest.py "<image dir>" "<output csv>" "13、数列22.pdf"
```

### 4. Convert approved rows into question-bank JSON

```powershell
.\.venv-ocr\Scripts\python.exe .\scripts\build_question_json_from_manifest.py ".\data\sequence-question-manifest.csv" ".\data\sequence-question-bank.json"
```

### 5. Test database connectivity

```powershell
npm.cmd run db:test
```

### 6. Import rewritten questions into PostgreSQL

```powershell
npm.cmd run pipeline:import
```

You can also import any JSON file explicitly:

```powershell
node .\scripts\import-question-bank.js ".\data\your-question-bank.json"
```

## Suggested CSV Editing Flow

For each row:

- `original_prompt`: raw extracted/typed prompt
- `rewritten_prompt`: slightly modified version for copyright safety
- `display_html`: final exam-style HTML used by the student UI
- `answer`: canonical answer string
- `blank_labels`: grouped blanks like `A|B|C|D` or `AB|C|D|E|FGH|I`
- `teacher_explanation`: optional for later

If `display_html` is filled, the pipeline will use it as the runtime question body.
If it is blank, the pipeline falls back to `rewritten_prompt`.

### What `blank_labels` means

This is not “one box per single character” by default.

It follows the real answer groups of the question:

- `A|B|C|D` means 4 inputs
- `AB|C|D|E|FGH|I` means 6 inputs
- `JK|LMN` means 2 inputs

So it is the grouping rule that drives the UI answer boxes.

## Next Step

Use the manifest as the working document for question-by-question rewriting, then mark approved rows as `ready_for_import`, export them into JSON, and import them into PostgreSQL through the pipeline script.
