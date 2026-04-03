from __future__ import annotations

from pathlib import Path
import csv
import json
import sys


def parse_blank_labels(raw: str) -> list[str]:
    labels = [item.strip() for item in raw.replace(",", "|").split("|")]
    return [label for label in labels if label]


def build_record(row: dict[str, str]) -> dict[str, object]:
    return {
        "id": row["question_id"],
        "subjectId": row["subject_id"],
        "topicId": row["topic_id"],
        "levelId": row["level_id"],
        "type": "text",
        "question": row.get("display_html") or row["rewritten_prompt"],
        "answer": row["answer"],
        "blankLabels": parse_blank_labels(row["blank_labels"]),
        "explanation": {
            "assetType": "text",
            "assetLabel": "老师标准讲解",
            "assetUrl": None,
            "summary": row["teacher_explanation"],
            "steps": [],
            "followUp": ""
        },
        "sourcePdf": row["source_pdf"],
        "sourceImage": row["page_image"],
        "rewrittenPrompt": row["rewritten_prompt"],
        "notes": row["notes"],
    }


def main() -> int:
    if len(sys.argv) < 3:
        print("Usage: python build_question_json_from_manifest.py <input_csv> <output_json>")
        return 1

    input_csv = Path(sys.argv[1])
    output_json = Path(sys.argv[2])

    if not input_csv.exists():
        print(f"Manifest not found: {input_csv}")
        return 1

    questions = []
    with input_csv.open("r", encoding="utf-8-sig", newline="") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            if row.get("status") != "ready_for_import":
                continue
            if not row.get("rewritten_prompt") or not row.get("answer"):
                continue
            questions.append(build_record(row))

    output_json.parent.mkdir(parents=True, exist_ok=True)
    output_json.write_text(
        json.dumps({"questions": questions}, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    print(f"Wrote {len(questions)} ready questions to {output_json}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
