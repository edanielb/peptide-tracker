import html, os
from article import *
from docx import Document
from docx.shared import Pt
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
e=html.escape
h=['<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">',
f'<title>{e(TITLE)}</title><meta name="description" content="{e(META)}">',
'<style>body{font-family:Georgia,system-ui,serif;max-width:720px;margin:2rem auto;padding:0 1rem;line-height:1.6;color:#222}h1{line-height:1.2}h2{margin-top:2rem}</style></head><body><article>',
f'<h1>{e(TITLE)}</h1>',
f'<img src="/Images/{e(FNAME)}.jpg" alt="{e(ALT)}" style="width:100%;max-width:720px;border-radius:8px;margin-bottom:1.5rem;" />',
f'<p>{e(HOOK)}</p>']
for t,ps in SECTIONS:
    h.append(f'<h2>{e(t)}</h2>')
    h+= [f'<p>{e(p)}</p>' for p in ps]
h.append(f'<p><em>{e(DISC)}</em></p>')
h.append(f'<p><strong>Source:</strong> <a href="{SRC_URL}" target="_blank" rel="noopener">{e(SRC_TITLE)}</a></p></article></body></html>')
htm="\n".join(h)
os.makedirs(root+"/archive",exist_ok=True)
open(f"{root}/archive/{FNAME}.html","w").write(htm)
open(f"{root}/public/articles/{FNAME}.html","w").write(htm)
d=Document(); d.styles['Normal'].font.size=Pt(12)
d.add_heading(TITLE,1); d.add_paragraph(HOOK)
for t,ps in SECTIONS:
    d.add_heading(t,2)
    for p in ps: d.add_paragraph(p)
d.add_paragraph().add_run(DISC).italic=True
p=d.add_paragraph(); p.add_run("Source: ").bold=True; p.add_run(f"{SRC_TITLE} - {SRC_URL}")
d.add_page_break()
d.add_heading("SEO & Publishing Metadata",1)
for k,v in [("Focus Keyword",KEYWORD),("Meta Description",META),("Word Count",str(len(body.split()))),("Source URL",SRC_URL)]:
    q=d.add_paragraph(); q.add_run(k+": ").bold=True; q.add_run(v)
d.add_paragraph().add_run("Secondary Keywords:").bold=True
for s in SECONDARY: d.add_paragraph(s,style="List Bullet")
d.add_paragraph().add_run("Internal Link Suggestions:").bold=True
for s in LINKS: d.add_paragraph(s,style="List Bullet")
d.add_page_break()
d.add_heading("Image Generation",1)
d.add_paragraph().add_run("IMAGE PROMPT:").bold=True
d.add_paragraph(IMG_PROMPT)
q=d.add_paragraph(); q.add_run("Suggested alt text: ").bold=True; q.add_run(ALT)
d.save(f"{root}/archive/{FNAME}.docx")
print("built")
