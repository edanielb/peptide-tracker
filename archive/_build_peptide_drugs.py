import html, re, os
from docx import Document
from docx.shared import Pt
ROOT=os.path.expanduser("~/mnt/peptide-index")
TITLE="Peptide Drugs: Can AI Make Them Safer?"
FNAME="Peptide Drugs - Can AI Make Them Safer"
META="Peptide drugs are booming, but safety setbacks still happen. See what a new review says about AI screening and what it means before you try peptide therapy."
KW="peptide drugs"
SRC_URL="https://www.frontiersin.org/journals/pharmacology/articles/10.3389/fphar.2026.1970939/full"
SRC_T="The next frontier of peptide therapeutics: from targeted conjugates (PDC/ODC) to AI-driven safety-by-design (Frontiers in Pharmacology, 2026)"
DISC="Disclaimer: This article is for informational purposes only and is not medical advice. Always consult a qualified healthcare professional before starting any new supplement or therapy."
ALT="Glowing peptide chain approaching a cell, symbolizing safer peptide drugs screened by AI"
IMG_PROMPT="A macro, microscopic view of a translucent, softly glowing peptide chain floating toward a rounded human cell, with a fine, delicate geometric mesh of light around it that suggests a computer model checking the molecule before it reaches the cell. Clean white and pale blue background with warm golden highlights on the peptide, shallow depth of field, gentle studio lighting. The mood is calm, hopeful and approachable, like a modern science magazine cover. No text, no labels, no syringes, pills or hospital settings."
SECTIONS=[
(None,[
"Why do so many promising drugs work in the lab and then stumble in real patients? A new review of peptide drugs says part of the answer is catching safety problems earlier. Its authors think artificial intelligence (AI) might help. They are careful to say it isn't proven yet."]),
("What Are Peptide Drugs?",[
"Peptides are short chains of amino acids, the building blocks of proteins. Your body makes thousands of them. Insulin is one. Peptide drugs copy or tweak these natural messengers to treat disease.",
"You probably know the best-known examples. GLP-1 medicines for diabetes and weight loss are peptide drugs. Their success has pulled the whole field into the spotlight, and the new review calls it a \"Peptide Renaissance.\"",
"Peptides sit in a middle zone. They are bigger than the small-molecule pills in your medicine cabinet. They are smaller than antibody drugs, which are large proteins. That in-between size gives them useful traits. They can bind tightly to a target, and some can reach tissue that bigger drugs struggle to enter.",
"There is a trade-off. Your stomach breaks peptides down, so many of them have to be injected. They also tend to leave the body quickly, which is why scientists keep looking for ways to make them last longer and aim them better."]),
("What the Research Found on Peptide Drugs",[
"The paper appeared in Frontiers in Pharmacology in November 2026. Franck Morceau, YoungJun Kim, Yong-Jun Kwon and Yong Jae Shin wrote it. It is a narrative review, which means the authors surveyed published work through June 2026 instead of running a new experiment. Think of it as a map of the field, not a fresh trial.",
"The authors sort peptide drugs by where their target sits: outside cells, on the cell surface, or inside cells. Then they look at conjugates. A conjugate is a drug linked to a carrier that steers it to a specific place. In cancer care, antibody-drug conjugates are the established standard. Peptide-drug conjugates are a smaller cousin that may spread into tumors more easily. The catch is that the body clears them fast. The review says their advantages show up mostly in lab studies, not in head-to-head patient trials.",
"The review also covers oligonucleotide-drug conjugates. These carry genetic-style molecules into cells to switch specific genes on or off. Approved versions work well in the liver. Reaching other organs is still a hard problem.",
"Then comes the sobering part. Melflufen lost its US approval in February 2024. A Sarepta program called SRP-5051 was stopped in November 2024 after kidney and magnesium-related effects in some participants.",
"The authors' answer is \"safety-by-design.\" Tools like AlphaFold 3, which predicts protein shapes, and pepADMET, which predicts toxicity, could flag risky candidates before they reach people. The authors call this a strategy, not a result. A small look back at past trials showed success rates close to the historical average, so it doesn't show that AI improves outcomes."]),
("Why Peptide Drugs Matter for You",[
"Most of us will never read a drug-development paper. This one still touches your life. If you or someone you love takes a GLP-1 medicine, you already live with a peptide drug. More are coming, aimed at cancer, metabolic disease and other conditions.",
"Drug failures cost more than money. They cost years of patient hope. Spotting a toxic candidate on a computer before anyone swallows or injects it would be a real win, if it works.",
"I'd keep my excitement in check, though. The review is upfront that AI hasn't been shown to lower costs or raise success rates. Treat it as a promising tool under test, not a fix. The simpler lesson is that peptides are a fast-moving field, and not every new compound will make it. Hype often runs ahead of the evidence.",
"One more thing to notice is the honesty in the review itself. The authors name the failures along with the wins. That is a good habit to look for whenever someone tells you about a new therapy."]),
("What to Know Before Trying Peptide Therapy",[
"Peptide therapy covers a huge range. Some peptide drugs are approved and well studied. Others are experimental. Many products sold online as \"research peptides\" have never been through the kind of safety testing this review describes. That gap is the one to watch.",
"If a doctor prescribes an approved peptide medicine, ask what it is for, what side effects to expect, and how long you would take it. Ask whether long-term safety data exists for people like you. Tell your doctor about every supplement and injectable you use, since interactions are possible.",
"Be wary of anyone selling a peptide with sweeping promises. The review shows that even carefully developed candidates can run into kidney or mineral-balance problems that only appear in people. A product with no clinical testing never had the chance to show them. If you are pregnant, have kidney disease or take several medicines, ask a clinician before trying anything new."]),
("The Bottom Line",[
"Peptide drugs are one of the busiest areas in medicine, and the success of GLP-1 treatments explains why. This new review argues that smarter safety screening, possibly AI-assisted, could help weak candidates fail earlier and cheaper. The authors admit the proof isn't in yet. Stay curious, ask your doctor good questions, and stick with peptide medicines that have real clinical evidence behind them."]),
]
SEC=["peptide therapy","GLP-1 medicines","peptide-drug conjugates","drug safety","AlphaFold 3"]
LINKS=["How GLP-1 medicines work and what the long-term data says","What peptide-drug conjugates could mean for cancer treatment","Why \"research use only\" peptides are not the same as approved medicines"]
body=" ".join(p for _,ps in SECTIONS for p in ps) if False else " ".join(p for _,ps in SECTIONS for p in ps)
wc=len(re.findall(r"\S+",body))
# keyword count
kwc=len(re.findall(KW,body.lower()))
print("words",wc,"meta",len(META),"kw in body",kwc,"alt",len(ALT))
# HTML
def esc(s): return html.escape(s)
h=[f'<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{esc(TITLE)}</title><meta name="description" content="{esc(META)}"><style>body{{font-family:Georgia,system-ui,serif;max-width:720px;margin:2rem auto;padding:0 1rem;line-height:1.6;color:#222}}h1{{line-height:1.2}}h2{{margin-top:2rem}}</style></head><body><article>',
f'<h1>{esc(TITLE)}</h1>',
f'<img src="/Images/{FNAME}.jpg" alt="{esc(ALT)}" style="width:100%;max-width:720px;border-radius:8px;margin-bottom:1.5rem;" />']
for hd,ps in SECTIONS:
    if hd: h.append(f'<h2>{esc(hd)}</h2>')
    for p in ps: h.append(f'<p>{esc(p)}</p>')
h.append(f'<p><em>{esc(DISC)}</em></p>')
h.append(f'<p><strong>Source:</strong> <a href="{SRC_URL}" target="_blank" rel="noopener">{esc(SRC_T)}</a></p></article></body></html>')
htmlout="\n".join(h)
for d in (os.path.join(ROOT,"archive"),os.path.join(ROOT,"public","articles")):
    os.makedirs(d,exist_ok=True)
    open(os.path.join(d,FNAME+".html"),"w",encoding="utf-8").write(htmlout)
# DOCX
doc=Document()
st=doc.styles["Normal"]; st.font.size=Pt(12)
doc.add_heading(TITLE,1)
for hd,ps in SECTIONS:
    if hd: doc.add_heading(hd,2)
    for p in ps: doc.add_paragraph(p)
p=doc.add_paragraph(); r=p.add_run(DISC); r.italic=True
p=doc.add_paragraph(); r=p.add_run("Source: "); r.bold=True; p.add_run(f"{SRC_T} - {SRC_URL}")
doc.add_page_break()
doc.add_heading("SEO & Publishing Metadata",1)
for k,v in [("Focus Keyword",KW),("Meta Description",f"{META} ({len(META)} characters)"),("Word Count",str(wc)),("Source URL",SRC_URL)]:
    p=doc.add_paragraph(); r=p.add_run(k+": "); r.bold=True; p.add_run(v)
p=doc.add_paragraph(); p.add_run("Secondary Keywords:").bold=True
for s in SEC: doc.add_paragraph(s,style="List Bullet")
p=doc.add_paragraph(); p.add_run("Internal Link Suggestions:").bold=True
for s in LINKS: doc.add_paragraph(s,style="List Bullet")
doc.add_page_break()
doc.add_heading("Image Generation",1)
p=doc.add_paragraph(); p.add_run("Image Prompt:").bold=True
doc.add_paragraph(IMG_PROMPT)
p=doc.add_paragraph(); p.add_run("Suggested Alt Text: ").bold=True; p.add_run(ALT)
doc.save(os.path.join(ROOT,"archive",FNAME+".docx"))
open(os.path.join(ROOT,".work","prompt.txt"),"w").write(IMG_PROMPT)
