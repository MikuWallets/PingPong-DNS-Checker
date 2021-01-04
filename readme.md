# EleNas Server Live Checker
a.k.a PingPongChecker

## DNS changer using Cloudflare API

유료로 failover dns 관리하기는 돈이 없고 그냥 레코드 추가해두니 RR DNS로 서브회선에 접근하는게 ㅈ같아서 만듦 ~~스불재~~

## What is it doing?
1. 5초마다 메인 회선에 http 리퀘 쏜다
2. 응답이 누적으로 4회 안오면 DNS 레코드 전환 시작
3. 서브회선 ip로 리퀘 잘 오는지 먼저 확인
4. 서브회선도 안오면 (1회) 그냥 둘다 뒤진거라고 보고 아무것도 안함 ~~기도메타~~
5. 메인 회선이 4회 이상 응답이 오면 DNS레코드 원복

## Problem
설치되어있는 방화벽에서 분명 Tier 1 Tier 2 구분 해놨는데 서브회선으로 전환을 똑바로 못함
메인 회선이 빠졌는데 서브 회선으로 아웃바운드가 안나오는듯
서브 회선 인바운드, 메인 회선 아웃바운드 처리를 하다보니 끊어지면 응답이 없어짐. 시간을 두고 봐야 하나 고민