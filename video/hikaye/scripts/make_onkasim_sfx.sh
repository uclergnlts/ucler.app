#!/bin/sh
# 10 Kasım videosunun ek sesleri (ffmpeg ile sentez; telif yok). video/hikaye klasöründen çalıştır.
set -e
cd public/sfx
PH="180*t+if(lt(t\,4)\,37.5*t*t\,300*t-600)-3.18*cos(2*PI*0.3*t)"
ffmpeg -y -loglevel error -f lavfi -i "aevalsrc='0.22*min(t/1.5\,1)*(sin(2*PI*($PH))+0.55*sin(4*PI*($PH))+0.3*sin(6*PI*($PH)))':s=44100:d=78" -af "lowpass=f=2600,aecho=0.8:0.6:180|420:0.35|0.2,afade=t=out:st=74:d=4" -ac 2 -b:a 160k siren.mp3
ffmpeg -y -loglevel error -f lavfi -i "anoisesrc=color=brown:amplitude=0.5:d=60:seed=3" -af "lowpass=f=500,highpass=f=60,volume=0.6,afade=t=in:d=2" -ac 2 -b:a 128k wind.mp3
ffmpeg -y -loglevel error -f lavfi -i "aevalsrc='0.06*(sin(2*PI*220*t)+sin(2*PI*261.63*t)+sin(2*PI*329.63*t)+0.5*sin(2*PI*110*t))*(0.6+0.4*sin(2*PI*t/8))*if(lt(mod(t\,16)\,8)\,1\,0)+0.06*(sin(2*PI*174.61*t)+sin(2*PI*220*t)+sin(2*PI*261.63*t)+0.5*sin(2*PI*87.31*t))*(0.6+0.4*sin(2*PI*t/8))*if(gte(mod(t\,16)\,8)\,1\,0)':s=44100:d=64" -af "lowpass=f=1800,aecho=0.8:0.7:300|700:0.4|0.25,afade=t=in:d=3" -ac 2 -b:a 160k pad-yas.mp3
echo tamam
