"""Convertit le site généré en artboards .dc.html pour la maquette (canvas Design)."""
import re, sys, json, html, os
OUT, ROOT, V2 = sys.argv[1], sys.argv[2], sys.argv[3] == '1'
SRC = os.path.dirname(os.path.abspath(__file__))
BLOB = {'logo.png':'93dd444eafbabbafe3540ee650e60af1','marie-fauteuil.jpg':'4e80f6573a5d64626e0cb0bf89462561',
        'marie-cuisine-portage.jpg':'f3601f2f605c03bd22f2b20426131a03','marie-portrait.jpg':'59550717fa65d86ea8c06df1f1096aff',
        'soin-rebozo.jpg':'33ca4f299c0349dfa444ddb7239ba36f','rituel-mains.jpg':'da15759555af9b7acb3411425188caf1',
        'mama-blessing.jpg':'d87cc366ad1b0e55f8900ec9c2edced8'}
PAGES = [('accompagnement-prenatal','Prenatal'),('presence-naissance','Naissance'),('rendez-vous-postnatal','Postnatal'),
         ('soutien-post-partum','PostPartum'),('instant-rebozo','InstantRebozo'),('rituel-rebozo','RituelRebozo'),('mama-blessing','MamaBlessing')]
css = open(os.path.join(OUT,'styles.css')).read() + ('\n' + open(os.path.join(SRC,'mobile-v2.css')).read() if V2 else '')
css = css.replace('</', '<\\/')

def convert(page_html, mobile, service, titre, w, h):
    body = page_html.split('<body>',1)[1].rsplit('</body>',1)[0]
    body = re.sub(r'<script[^>]*></script>\n?', '', body)
    for f,b in BLOB.items(): body = body.replace(f'/images/{f}', f'/_blob/{b}')
    home = 'Mobile.dc.html' if mobile else 'Variante.dc.html'
    suffix = 'Mobile' if (mobile and V2) else ''
    def lien(m):
        u = m.group(1)
        if u.startswith('/#'): return f'href="{home}{u[1:]}"' if service else f'href="{u[1:]}"'
        if u == '/': return f'href="{home}"'
        for slug, nom in PAGES:
            if u == '/' + slug: return f'href="{nom}{suffix}.dc.html"'
        if u.startswith('/mentions'): return 'href="#"'
        return m.group(0)
    body = re.sub(r'href="(/[^"]*)"', lien, body)
    if service: body = body.replace('class="flottant"', 'class="flottant visible"')
    m = re.search(r'<details class="menu-mobile">\n<summary aria-label="Ouvrir le menu">(.*?)</summary>\n<nav class="menu-mobile-liste" aria-label="Menu">\n(.*?)\n</nav>\n</details>', body, re.S)
    if m:
        icone, liens = m.group(1), m.group(2)
        liens = liens.replace('<a href=', '<a onClick="{{fermer}}" href=')
        body = body.replace(m.group(0), f'''<div class="menu-mobile">
<button type="button" class="menu-btn {{{{classeBouton}}}}" onClick="{{{{basculer}}}}" aria-expanded="{{{{ouvert}}}}" aria-label="Menu">{icone}</button>
<sc-if value="{{{{ouvert}}}}" hint-placeholder-val="{{{{ false }}}}">
<nav class="menu-mobile-liste" aria-label="Menu">
{liens}
</nav>
</sc-if>
</div>''')
    if V2:
        def chap(m):
            inner = m.group(1).strip()
            ps = re.findall(r'<p[^>]*>.*?</p>', inner, re.S)
            first = ps[0]; rest = inner.replace(first, '', 1).strip()
            return (f'<div class="chapitre-texte version-complete">\n{inner}\n</div>\n'
                    f'<div class="chapitre-texte version-courte">\n{first}\n<details class="lire-suite"><summary>Lire la suite</summary>\n'
                    f'<div class="chapitre-texte">\n{rest}\n</div>\n</details>\n</div>')
        body = re.sub(r'<div class="chapitre-texte">\n(.*?)\n</div>\n</article>', lambda m: chap(m) + '\n</article>', body, flags=re.S)
        def avis(m):
            t = m.group(1)
            if len(html.unescape(t)) < 230: return m.group(0)
            return (f'<blockquote class="avis-complet">{t}</blockquote>\n<details class="avis-depli"><summary><blockquote class="avis-court">{t}</blockquote>'
                    f'<span class="lire">Lire la suite</span></summary><blockquote>{t}</blockquote></details>')
        body = re.sub(r'<blockquote>(« .*? »)</blockquote>', avis, body, flags=re.S)
        body = body.replace('<div class="grille" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:20px">',
                            '<div class="grille grille-avis" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:20px">')
    return f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>{html.escape(titre)}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&amp;family=DM+Sans:wght@400;500;600&amp;display=swap" rel="stylesheet">
<style>
body{{margin:0}}
{css}
</style>
</helmet>
<div class="page-maquette">
{body.strip()}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{w},"height":{h}}}}}'>
class Component extends DCLogic {{
  renderVals() {{
    const ouvert = !!(this.state && this.state.menu);
    return {{
      ouvert,
      classeBouton: ouvert ? 'ouvert' : '',
      basculer: () => this.setState({{ menu: !ouvert }}),
      fermer: () => this.setState({{ menu: false }})
    }};
  }}
}}
</script>
</body>
</html>
'''
hp=os.path.join(ROOT,'heights.json'); heights = json.load(open(hp)) if os.path.exists(hp) else {}
os.makedirs(os.path.join(ROOT,'apercu'), exist_ok=True)
os.makedirs(os.path.join(ROOT,'project'), exist_ok=True)
jobs = [('index.html','Variante.dc.html','Accueil',1440,False,False), ('index.html','Mobile.dc.html','Accueil mobile',390,True,False)]
for slug, nom in PAGES:
    jobs.append((slug+'.html', nom+'.dc.html', nom, 1440, False, True))
    if V2: jobs.append((slug+'.html', nom+'Mobile.dc.html', nom+' mobile', 390, True, True))
for src, dst, titre, w, mobile, service in jobs:
    h = heights.get(dst, 1000)
    dc = convert(open(os.path.join(OUT,src)).read(), mobile, service, titre, w, h)
    open(os.path.join(ROOT,'project',dst),'w').write(dc)
    helm = dc.split('<helmet>')[1].split('</helmet>')[0]; corps = dc.split('</helmet>')[1].split('</x-dc>')[0]
    open(os.path.join(ROOT,'apercu',dst.replace('.dc.html','.html')),'w').write(f'<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">{helm}</head><body>{corps}</body></html>')
    print(dst, w, h)
