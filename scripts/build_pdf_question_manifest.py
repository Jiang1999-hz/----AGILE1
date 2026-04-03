from __future__ import annotations

from pathlib import Path
import csv
import sys


CSV_HEADERS = [
    "question_id",
    "source_pdf",
    "page_image",
    "page_number",
    "subject_id",
    "topic_id",
    "level_id",
    "status",
    "original_prompt",
    "rewritten_prompt",
    "display_html",
    "answer",
    "blank_labels",
    "teacher_explanation",
    "notes",
]


def main() -> int:
    if len(sys.argv) < 3:
        print("Usage: python build_pdf_question_manifest.py <image_dir> <output_csv> [source_pdf_name]")
        return 1

    image_dir = Path(sys.argv[1])
    output_csv = Path(sys.argv[2])
    source_pdf = sys.argv[3] if len(sys.argv) > 3 else ""

    if not image_dir.exists():
        print(f"Image directory not found: {image_dir}")
        return 1

    images = sorted(image_dir.glob("*.png"))
    output_csv.parent.mkdir(parents=True, exist_ok=True)

    with output_csv.open("w", newline="", encoding="utf-8-sig") as fh:
        writer = csv.DictWriter(fh, fieldnames=CSV_HEADERS)
        writer.writeheader()
        for index, image in enumerate(images, start=1):
            writer.writerow(
                {
                    "question_id": f"sequence-{index:03d}",
                    "source_pdf": source_pdf,
                    "page_image": image.as_posix(),
                    "page_number": index,
                    "subject_id": "math2",
                    "topic_id": "sequence",
                    "level_id": "basic",
                    "status": "pending_rewrite",
                    "original_prompt": "",
                    "rewritten_prompt": "",
                    "display_html": "",
                    "answer": "",
                    "blank_labels": "",
                    "teacher_explanation": "",
                    "notes": "",
                }
            )

    print(f"Wrote manifest for {len(images)} images to {output_csv}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
