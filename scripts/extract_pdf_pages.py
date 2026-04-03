from pathlib import Path
import sys

import fitz


def safe_stem(name: str) -> str:
    cleaned = []
    for ch in name:
        if ch.isalnum() or ch in ("-", "_"):
            cleaned.append(ch)
        elif ch in (" ", "、", "，", ".", "。"):
            cleaned.append("-")
    result = "".join(cleaned).strip("-")
    return result or "pdf"


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python extract_pdf_pages.py <pdf_path> [output_dir]")
        return 1

    pdf_path = Path(sys.argv[1])
    if not pdf_path.exists():
        print(f"PDF not found: {pdf_path}")
        return 1

    output_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("tmp") / "pdf-pages" / safe_stem(pdf_path.stem)
    output_dir.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(str(pdf_path))
    for index in range(doc.page_count):
        page = doc.load_page(index)
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
        target = output_dir / f"page-{index + 1:02d}.png"
        pix.save(str(target))
        print(target)

    print(f"Exported {doc.page_count} pages to {output_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
