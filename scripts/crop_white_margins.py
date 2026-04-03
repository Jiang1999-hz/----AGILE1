from pathlib import Path
import sys

from PIL import Image, ImageChops


def crop_image(source: Path, target: Path) -> bool:
    image = Image.open(source).convert("RGB")
    background = Image.new("RGB", image.size, (255, 255, 255))
    diff = ImageChops.difference(image, background)
    bbox = diff.getbbox()
    if not bbox:
        image.save(target)
        return False
    cropped = image.crop(bbox)
    cropped.save(target)
    return True


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python crop_white_margins.py <input_dir> [output_dir]")
        return 1

    input_dir = Path(sys.argv[1])
    output_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else input_dir.parent / f"{input_dir.name}-cropped"
    output_dir.mkdir(parents=True, exist_ok=True)

    files = sorted(input_dir.glob("*.png"))
    for file in files:
        target = output_dir / file.name
        crop_image(file, target)
        print(target)

    print(f"Cropped {len(files)} images into {output_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
