import json
TITLE="BPC-157 Before Surgery: Tell Your Surgeon"
FNAME="BPC-157 Before Surgery - Tell Your Surgeon"
META="Using BPC-157? A new surgeon's column says many patients inject it without telling their doctors. Here is what to know and what to ask before any procedure."
KEYWORD="BPC-157"
SECONDARY=["BPC-157 injections","compounded peptides","peptide safety","rotator cuff","tell your surgeon"]
LINKS=["How compounded peptides differ from FDA-approved drugs","BPC-157 and the FDA panel vote: what it means","What 'research use only' peptides really are"]
SRC_URL="https://www.healio.com/news/orthopedics/20261105/patients-are-injecting-peptides-ask-before-you-operate"
SRC_TITLE="Patients are injecting peptides: Ask before you operate (Healio Orthopedics Today, Nov 5, 2026)"
ALT="Person at a kitchen table writing a list, shoulder softly glowing, illustrating BPC-157 use before surgery"
HOOK="Would you tell your surgeon about an injection you bought online? Many people don't. A new column from a leading orthopedic editor says that silence is becoming a real problem, and BPC-157 is at the center of it."
SECTIONS=[
("What Is BPC-157?",[
"BPC-157 is a short chain of 15 amino acids, the building blocks of proteins. Chains this small are called peptides. Online, it is sold as a \"healing peptide\" for sore tendons, joints and muscles. Most people inject it under the skin.",
"Here is the catch. The U.S. Food and Drug Administration has not approved BPC-157 for any use. It sits in a gray zone. It is sold as a \"research chemical\" or made by compounding pharmacies, which mix custom medicines for individual patients. That is very different from a drug that passed a full safety review.",
"Interest has exploded anyway. Podcasts, gym forums and wellness clinics all talk about it. Which brings us to the new column, and why it matters to anyone with a sore joint."]),
("What Surgeons Are Seeing With BPC-157",[
"On November 5, 2026, Dr. Anthony Romeo, chief medical editor of Healio's Orthopedics Today, published a commentary with a simple message: ask patients about peptides before you operate. His reasons come with numbers.",
"He cites a 2026 preprint, meaning a study that has not yet been peer reviewed. It searched health records from more than 15 million patients and found 1,039 confirmed BPC-157 users. New users rose about 33-fold between 2020 and 2026. The shoulder was the most common injury site, and rotator cuff trouble was the most common condition. Patients had usually been using BPC-157 for about 60 days before a clinician wrote it down.",
"That last detail stands out. BPC-157 has no national drug code, so it doesn't appear on standard medication lists. Romeo says the true number is likely much higher.",
"The evidence behind the peptide is thin. Most animal work comes from a single lab. Only one human case series exists. FDA reviewers found no human studies of the injected route most patients use. Quality is a worry too. A separate 2026 preprint found wide swings in purity and content among research-grade peptides sold directly to consumers.",
"Meanwhile, the rules are shifting fast. In July 2026, an FDA advisory panel voted 8 to 6 to make BPC-157 and five other peptides eligible for compounding, against the advice of FDA staff. On October 28, HHS said it would use enforcement discretion for certain licensed pharmacies and physicians. Romeo warns that people may confuse \"compounded\" with \"FDA approved.\" They are not the same."]),
("Why BPC-157 Matters for You",[
"You may never need shoulder surgery. The lesson still applies to anything you take. Your care team can only protect you from what it knows about.",
"Surgery makes the point well. Doctors choose anesthesia, antibiotics and healing plans based on your full medication list. An unlisted injection is a blind spot. Infection is one of the biggest worries in any operating room, and nobody can vouch for the sterility of a vial bought online. Romeo also notes there is no established safe pause before elective surgery. That isn't reassuring. It is an honest admission that nobody has studied the question.",
"There is a cost angle too. If you hope BPC-157 will let you skip physical therapy or put off a needed repair, you could lose ground. The proven basics, like a proper diagnosis, rehab and a gradual return to activity, are less exciting. They do have real evidence behind them. Ask your doctor what role, if any, a peptide could play alongside them."]),
("What to Know Before Trying BPC-157",[
"Start with the plain facts. BPC-157 has no FDA-approved use. Human data is close to nonexistent. Most of what people cite comes from animals, and animals aren't people.",
"If you already use it, tell your doctor and your surgeon. Name the product, where you got it, the dose, how you inject it and how long you've taken it. Romeo urges clinicians to ask about peptides by name and write the answers down, so you shouldn't feel awkward bringing it up. Ask whether you should stop before a planned procedure, and how far ahead.",
"Athletes face another issue. The World Anti-Doping Agency bans BPC-157 both in and out of competition, and major pro leagues do too.",
"One more thing is on the horizon. A placebo-controlled pilot trial of BPC-157 after rotator cuff repair is scheduled to start in January 2027. That is the kind of evidence that can actually answer the question. Until then, treat this article as general information, not a recommendation for or against any treatment."]),
("The Bottom Line",[
"BPC-157 is popular, easy to find and poorly studied in people. The new column doesn't claim it works, and it doesn't claim it fails. It says doctors need to know when you use it. If you take BPC-157 or are thinking about it, talk with your doctor first, especially before surgery. Good human trials are coming. Until they land, being upfront with your care team is the safest move you can make."]),
]
DISC="Disclaimer: This article is for informational purposes only and is not medical advice. Always consult a qualified healthcare professional before starting any new supplement or therapy."
IMG_PROMPT=("A warm lifestyle scene of a middle-aged recreational tennis player sitting at a sunlit home kitchen table, writing a careful list in a notebook, one shoulder softly glowing amber to suggest a tendon under repair. Faint translucent anatomical lines of a shoulder joint and a few floating molecular chains drift near the glow, a subtle science overlay. Photographic style with gentle depth of field, no text, no syringes, no pills, no hospital setting. Palette of warm amber, honey gold and soft sage green, with a calm, hopeful, approachable mood.")
body=" ".join([HOOK]+[p for _,ps in SECTIONS for p in ps])
if __name__=="__main__":
    print(len(body.split()), len(META), len(TITLE), len(ALT))
