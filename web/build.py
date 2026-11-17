"""말문 English 웹앱 버전 만들기.

    python web/build.py

malmun-english.html(아티팩트 페이지)에 문서 머리말과 web/shim.js 를 붙여 index.html 을 만들고,
icons/ 에 설치용 아이콘을 만든다. 앱을 고친 뒤에는 이 스크립트를 다시 돌려 index.html 을 맞춘다.
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
p = lambda *a: os.path.join(ROOT, *a)


def icon(px, maskable=False):
    k = 16; S = 64 * k
    bg, fg = (23, 97, 110, 255), (255, 255, 255, 255)
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, S - 1, S - 1], radius=0 if maskable else 15 * k, fill=bg)
    art = Image.new('RGBA', (S, S), (0, 0, 0, 0)); a = ImageDraw.Draw(art)
    a.rounded_rectangle([9 * k, 13 * k, 55 * k, 45 * k], radius=8 * k, fill=fg)
    a.polygon([(21 * k, 44 * k), (31 * k, 44 * k), (21 * k, 54 * k)], fill=fg)
    font = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 20 * k)
    a.text((32 * k, 29.5 * k), 'Aa', font=font, fill=bg, anchor='mm')
    if maskable:  # 가장자리가 잘려도 그림이 남도록 안쪽 72%로 줄인다
        s = int(S * .72); art = art.resize((s, s), Image.LANCZOS)
        im.alpha_composite(art, ((S - s) // 2, (S - s) // 2))
    else:
        im.alpha_composite(art)
    return im.resize((px, px), Image.LANCZOS)


os.makedirs(p('icons'), exist_ok=True)
icon(192).save(p('icons', 'icon-192.png'), optimize=True)
icon(512).save(p('icons', 'icon-512.png'), optimize=True)
icon(512, True).convert('RGB').save(p('icons', 'icon-maskable-512.png'), optimize=True)

page = open(p('malmun-english.html'), encoding='utf-8').read()
shim = open(p('web', 'shim.js'), encoding='utf-8').read()
assert '</script' not in shim
head = ('<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        '<meta name="theme-color" content="#17616e">\n'
        '<meta name="mobile-web-app-capable" content="yes">\n'
        '<link rel="manifest" href="manifest.webmanifest">\n'
        '<script>\n' + shim + '</script>\n')
open(p('index.html'), 'w', encoding='utf-8', newline='\n').write(head + page)
print('index.html', len(head) + len(page), 'bytes')
