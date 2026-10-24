#!/bin/sh
# Полная сборка сайта из исходников (см. README)
set -e
cd "$(dirname "$0")"
cd src && cp base.html tomsk.html \
  && python3 places/main.py . >/dev/null && python3 places/catalog_ui.py . >/dev/null \
  && python3 places/venues_ui.py . ../data/venues.json >/dev/null \
  && python3 places/style_ui.py . >/dev/null && python3 places/pick_ui.py . >/dev/null && cd ..
rm -rf podborki udivi-menya
python3 src/pages.py src/tomsk.html .
rm -rf mesto
python3 src/venue/select_pages.py
python3 src/venue_pages.py src/tomsk.html .
python3 src/scenarios.py src/tomsk.html .

python3 src/catalog_import_ui.py
