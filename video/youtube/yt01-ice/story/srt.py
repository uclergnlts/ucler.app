import json, re, wave, os, textwrap
S='studio/projects/yt01-ice/story/'
shots=json.load(open(S+'shots.json')); st={s['id']:s['start'] for s in shots['shots']}
anch=json.load(open(S+'lines.json'))['anchors']
md=open('/mnt/project-files/youtube-yatay/YT-01-anlatim-metni.md').read().split('\n')
T={'EN':{},'TR':{},'ES':{},'AR':{}}
for l in md:
    c=[x.strip() for x in l.strip().strip('|').split('|')]
    if not c[0].isdigit(): continue
    n=int(c[0])
    if len(c)==5: T['EN'][n]=c[3]; T['TR'][n]=c[4]
    elif len(c)==3: T['ES'][n]=c[1]; T['AR'][n]=c[2]
def ts(x):
    ms=int(round(x*1000)); return f"{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}"
def chunks(txt):
    # split into sentences, then group so each cue <= 84 chars
    sents=re.split(r'(?<=[.!?؟])\s+',txt); out=[]; cur=''
    for s in sents:
        if cur and len(cur)+1+len(s)>84: out.append(cur); cur=s
        else: cur=(cur+' '+s).strip()
    out.append(cur); return out
os.makedirs('/mnt/project-files/youtube-yatay/altyazi',exist_ok=True)
for L in T:
    assert len(T[L])==34,(L,len(T[L]))
    cues=[]
    for i,(a,off) in enumerate(anch):
        w=wave.open(f'vo/{L}_{i+1:02d}.wav'); d=w.getnframes()/w.getframerate()
        t0=st[a]+off; parts=chunks(T[L][i+1]); tot=sum(len(p) for p in parts); t=t0
        for p in parts:
            dd=d*len(p)/tot; cues.append((t,t+dd,'\n'.join(textwrap.wrap(p,42)))); t+=dd
    with open(f'/mnt/project-files/youtube-yatay/altyazi/YT-01-{L}.srt','w',encoding='utf-8') as f:
        for k,(a,b,x) in enumerate(cues):
            e=min(b+0.25,cues[k+1][0]-0.02) if k+1<len(cues) else b+0.25
            f.write(f"{k+1}\n{ts(a)} --> {ts(e)}\n{x}\n\n")
    print(L,len(cues),ts(cues[-1][1]))
