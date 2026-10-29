"""Deterministic synthetic QA documents. No personal or third-party files."""
import argparse
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PIL import Image, ImageDraw, ImageFont

parser = argparse.ArgumentParser()
parser.add_argument('--out', required=True, type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[2]
out = args.out.resolve()
if not out.is_relative_to(root) or not out.relative_to(root).parts[0].startswith('.qa-'):
    raise SystemExit('Use an owned .qa- directory')
out.mkdir(parents=True, exist_ok=True)
for name in ['native-121.pdf', 'scanned-one.pdf', 'mixed-three.pdf', 'scan.png']:
    if (out / name).exists():
        raise SystemExit('Refusing to replace fixture ' + name)

image = Image.new('RGB', (1200, 1500), 'white')
draw = ImageDraw.Draw(image)
font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 44)
lines = ['USEFULVERSE OCR TEST', 'Invoice number UV 2026 001', 'Total amount 123.45 USD']
for y, line in zip([150, 260, 370], lines):
    draw.text((100, y), line, font=font, fill='black')
image.save(out / 'scan.png')

def document(name):
    c = canvas.Canvas(str(out / name), pagesize=(576, 720), invariant=1, pageCompression=1)
    c.setTitle('UsefulVerse synthetic OCR QA')
    c.setAuthor('UsefulVerse QA')
    return c

c = document('native-121.pdf')
for page in range(1, 122):
    c.setFont('Helvetica', 20)
    c.drawString(36, 650, 'UsefulVerse OCR check page %03d.' % page)
    c.setFont('Helvetica', 14)
    c.drawString(36, 610, 'Local processing. Synthetic test document.')
    c.showPage()
c.save()
c = document('scanned-one.pdf')
c.drawImage(ImageReader(image), 0, 0, width=576, height=720)
c.showPage()
c.save()
c = document('mixed-three.pdf')
c.setFont('Helvetica', 28)
c.drawString(36, 650, 'A')
c.showPage()
c.drawImage(ImageReader(image), 0, 0, width=576, height=720)
c.showPage()
c.showPage()
c.save()
print('Created 3 deterministic synthetic PDFs and their source scan')
