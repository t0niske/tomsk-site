# -*- coding: utf-8 -*-
"""Оборачивает собранную страницу в полноценный HTML-документ для хостинга:
doctype (режим стандартов), кодировка и viewport — без него телефоны рисуют страницу шириной 980px."""
import sys
HEAD = '''<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="{desc}">
<meta name="theme-color" content="#FFD43B">
'''
for path, desc in zip(sys.argv[1::2], sys.argv[2::2]):
    s = open(path, encoding='utf-8').read()
    if s.lstrip().lower().startswith('<!doctype'):
        continue
    open(path, 'w', encoding='utf-8').write(HEAD.format(desc=desc) + s)
    print('wrapped', path)
