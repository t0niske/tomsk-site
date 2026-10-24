import re
shell=open('shell.html').read()
import json,os
V=json.load(open('../../data/venues.json'))
V=dict(V,items=[v for v in V['items'] if v.get('origin')=='editor'])
picks='const VENUES0='+json.dumps(V,ensure_ascii=False,separators=(',',':'))+';\n'
js=picks+'\n'.join(open(f).read() for f in ['core.js','map2d.js','map3d.js','app.js'])
out=shell+'\n<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>\n<script>\n'+js+'\n</script>\n'
open('map.html','w').write(out)
open('all.js','w').write(js)
print(len(out))
