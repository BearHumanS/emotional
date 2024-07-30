#!/bin/sh

# 상위 디렉터리로 이동
cd ../

# output 디렉터리 생성
mkdir -p output

# emotional 디렉터리의 모든 파일을 output 디렉터리로 복사
cp -R ./emotional/* ./output

# output 디렉터리를 emotional 디렉터리로 복사
cp -R ./output ./emotional/

# 권한 문제를 피하기 위해 필요한 권한 설정
chmod -R 775 ./output
chmod -R 775 ./emotional/output

# 추가로 권한 문제를 방지하기 위해 다음을 포함
sudo chown -R $(whoami):$(whoami) /codebuild/output/root
sudo chmod -R 775 /codebuild/output/root
