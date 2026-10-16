# Senaryo metnini sessizlik tespitinden çıkan konuşma parçalarına hizalar; PH dizisini yazdırır.
import sys, re, subprocess
mp3, md = sys.argv[1], sys.argv[2]
dur = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',mp3]))
out = subprocess.run(['ffmpeg','-i',mp3,'-af','silencedetect=n=-35dB:d=0.2','-f','null','-'],capture_output=True,text=True).stderr
st = [float(x) for x in re.findall(r'silence_start: ([0-9.]+)', out)]; en = [float(x) for x in re.findall(r'silence_end: ([0-9.]+)', out)]
segs, cur = [], 0.0
for a, b in zip(st, en):
    if a - cur > 0.15: segs.append((cur, a))
    cur = b
if dur - cur > 0.15: segs.append((cur, dur))
s = open(md).read(); txt = s.split('## Konuşma metni')[1].split('\n',1)[1].split('## Kapanış')[0]
for a, b in [r.split('=>') for r in sys.argv[3:]]: txt = txt.replace(a, b)
W = txt.split(); L = [len(w)+1 for w in W]
rate = sum(e-a for a, e in segs) / sum(L)
M, N = len(segs), len(W)
INF = 1e9; best = [[INF]*(N+1) for _ in range(M+1)]; arg = [[0]*(N+1) for _ in range(M+1)]
best[0][0] = 0
for k in range(1, M+1):
    d = segs[k-1][1] - segs[k-1][0]
    for j in range(1, N+1):
        acc = 0
        for i in range(j-1, -1, -1):
            acc += L[i]
            if best[k-1][i] >= INF: continue
            c = (d - rate*acc)**2 + (0 if re.search(r'[.,;:?!]$', W[j-1]) else 0.6)
            if best[k-1][i] + c < best[k][j]: best[k][j] = best[k-1][i] + c; arg[k][j] = i
            if rate*acc > d*2.5: break
parts, j = [], N
for k in range(M, 0, -1):
    i = arg[k][j]; parts.append((segs[k-1][0], segs[k-1][1], ' '.join(W[i:j]))); j = i
parts.reverse()
print(f'const DUR = {dur:.2f};           // ses süresi')
print('const PH = [')
print(',\n'.join(f' [{a:.2f},{b:.2f},"{t}"]' for a, b, t in parts))
print('];')
