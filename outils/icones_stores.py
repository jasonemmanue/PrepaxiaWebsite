# Logo du site (coins arrondis), favicon, icône Apple et image Open Graph, depuis les visuels des stores.
# Usage : python -I outils/icones_stores.py <dossier Prepaxia-Stores extrait> .
import sys, os
from PIL import Image, ImageDraw
src, site = sys.argv[1], sys.argv[2]
ic = Image.open(os.path.join(src, 'AppleStore', 'Icone (1024x1024)', 'icone-appstore-1024.png')).convert('RGB')

def arrondi(im, rayon):
    m = Image.new('L', (im.width * 4, im.height * 4), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, m.width - 1, m.height - 1), radius=rayon * 4, fill=255)
    out = im.convert('RGBA'); out.putalpha(m.resize(im.size, Image.LANCZOS)); return out

arrondi(ic.resize((512, 512), Image.LANCZOS), 115).save(os.path.join(site, 'public', 'logo.png'), optimize=True)
arrondi(ic.resize((64, 64), Image.LANCZOS), 14).save(os.path.join(site, 'app', 'icon.png'), optimize=True)
ic.resize((180, 180), Image.LANCZOS).save(os.path.join(site, 'app', 'apple-icon.png'), optimize=True)
fg = Image.open(os.path.join(src, 'PlayStore', 'Graphique de presentation (1024x500)', 'feature-graphic-sombre.png')).convert('RGB')
fg.save(os.path.join(site, 'app', 'opengraph-image.jpg'), quality=88)
print('ok', fg.size)
