<p align="center"><img src="malmun-icon.png" width="96" alt="말문 English 아이콘"></p>

# 말문 English

자격증 시험 대비부터 회화까지 한 화면에서 공부하는 영어 학습 앱입니다. Claude 아티팩트로 게시해 사용합니다.

## 일러스트 예시

단어와 표현마다 뜻을 떠올리기 쉽게 웹툰풍 그림이 함께 나옵니다. 설정에서 끌 수 있습니다.

| deadline (마감) | discount (할인) | experiment (실험) | Cheer up. (기운 내) |
|:---:|:---:|:---:|:---:|
| <img src="ill/01.webp" width="180"> | <img src="ill/63.webp" width="180"> | <img src="ill/78.webp" width="180"> | <img src="ill/76.webp" width="180"> |

## 기능

| 탭 | 하는 일 |
|---|---|
| 홈 | 오늘의 표현, 오늘 할 공부, 연속 학습 일수 |
| 시험 | 문제 272문항 (TOEIC 8단원 72문항, 그 밖의 시험 각 4단원 40문항), 단원별 진행 표시 |
| 단어 | 단어장 3종 (TOEIC / 회화 / 학술) 각 30개, 카드마다 일러스트 |
| 회화 | AI와 영어로 대화 연습, 말하기 입력과 읽어 주기 |
| 첨삭 | 내가 쓴 영어 문장 고쳐 주기 |
| 계획 | 목표와 기간을 넣으면 하루 공부량을 짜 줌, 주간 요약 |
| 설정 | 색 테마 13종, 아트 테마 10종, 일러스트 켜기·끄기 |

## 파일 구성

```
malmun-english.html   앱 본체 (아티팩트 페이지 한 장)
index.html            웹앱 버전 (web/build.py가 만듦)
manifest.webmanifest  웹앱 설치 정보
sw.js                 오프라인 캐시
icons/                설치용 아이콘
web/                  웹앱 빌드 스크립트와 대체 동작 코드
ill/00.webp ~ 89.webp 단어·표현 일러스트 90장 (720×540)
malmun-icon.svg/.png  앱 아이콘
illust-trial/         그림 스타일을 고를 때 만든 시안
```

## 웹앱으로 설치하기

주소: https://yhjang0315-source.github.io/malmun-english/

Chrome이나 Edge로 위 주소를 열고 "설치"(또는 메뉴의 "앱 설치")를 누르면 홈 화면·바탕화면에 앱으로 깔립니다. iPhone·iPad는 Safari의 공유 버튼에서 "홈 화면에 추가"를 누릅니다.

웹앱 버전에서 되는 것과 안 되는 것:

| 기능 | 웹앱 버전 |
|---|---|
| 시험 문제, 단어장, 일러스트, 공부 계획, 테마 | 됨 |
| 발음 듣기, 말해서 입력 | 브라우저 기능으로 동작 (브라우저에 따라 다름) |
| 학습 기록 | 이 기기의 브라우저에만 저장 |
| AI 회화, 첨삭, 새 문제 만들기 | 안 됨 (Claude 아티팩트에서만 동작) |

`index.html`은 `python web/build.py`가 `malmun-english.html`에서 만들어 냅니다. 앱을 고친 뒤에는 다시 돌려 주세요.

## Claude 아티팩트로 쓰는 방법

1. Claude에서 `malmun-english.html`을 아티팩트로 게시합니다.
2. `ill/` 폴더의 그림을 같은 경로(`ill/NN.webp`)로 함께 게시합니다.
3. 게시된 아티팩트를 열어 사용합니다.

회화, 첨삭, 읽어 주기, 기록 저장은 Claude 아티팩트 기능을 쓰므로, HTML 파일만 브라우저로 열면 그 부분은 동작하지 않습니다.

## 만든 방법

- 앱 코드는 Claude와 함께 작성했습니다.
- 일러스트는 이미지 생성 AI로 만들었습니다. 86장은 GPT 이미지 모델, 4장(`ill/59`~`ill/62`)은 Canva입니다.
