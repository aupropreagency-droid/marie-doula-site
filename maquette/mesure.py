import sys, json, os, glob
from playwright.sync_api import sync_playwright
ROOT=sys.argv[1]; port=sys.argv[2]
res={}
with sync_playwright() as pw:
    b=pw.chromium.launch()
    for f in sorted(glob.glob(os.path.join(ROOT,'apercu','*.html'))):
        n=os.path.basename(f); w=390 if ('Mobile' in n) else 1440
        p=b.new_page(viewport={'width':w,'height':900})
        p.goto(f'http://localhost:{port}/apercu/{n}', wait_until='load')
        res[n.replace('.html','.dc.html')]=p.evaluate('document.documentElement.scrollHeight'); p.close()
    b.close()
json.dump(res,open(os.path.join(ROOT,'heights.json'),'w'),indent=0); print(res)
