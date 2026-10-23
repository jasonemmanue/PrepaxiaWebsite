# Génère les visuels WebP du site (public/visuels) à partir des images des stores.
# Usage : python -I outils/visuels_stores.py <dossier Prepaxia-Stores extrait> public/visuels
# Les sources ne sont que lues. Voir CLAUDE.md, « Visuels ».
import sys, os
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)
IPH = os.path.join(src, 'AppleStore', 'iPhone 6,9 pouces (1290x2796)')
IPAD = os.path.join(src, 'iPad', 'iPad 13 pouces (2064x2752)')
THEMES = {'Sombre': 'sombre', 'Clair': 'clair'}

def webp(im, nom, largeurs, q=80):
    for w in largeurs:
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(os.path.join(dst, f'{nom}-{w}.webp'), 'WEBP', quality=q, method=6)
    print(nom, im.size)

for T, t in THEMES.items():
    a = Image.open(os.path.join(IPH, T, '02-duo-gauche.png')).convert('RGB')
    b = Image.open(os.path.join(IPH, T, '03-duo-droite.png')).convert('RGB')
    duo = Image.new('RGB', (a.width + b.width, a.height))
    duo.paste(a, (0, 0)); duo.paste(b, (a.width, 0))
    webp(duo.crop((0, 230, duo.width, 2650)), f'heros-{t}', [640, 1200])
    for n in ['01-preparateur-ia', '04-reflechir', '05-ce-qui-te-manque', '06-attentes-du-jury',
              '07-epreuves-inedites', '08-communaute', '09-corrector', '10-generator']:
        webp(Image.open(os.path.join(IPH, T, n + '.png')).convert('RGB'), f'tel-{n[3:]}-{t}', [420, 760])
    for n in ['01-preparateur-ia', '02-ce-qui-te-manque', '03-corrector', '04-generator', '05-progres', '06-communaute']:
        webp(Image.open(os.path.join(IPAD, T, n + '.png')).convert('RGB'), f'tab-{n[3:]}-{t}', [480, 960])
