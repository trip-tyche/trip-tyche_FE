import { useEffect } from 'react';

import { css, Global, keyframes } from '@emotion/react';

import backgroundImage from '@/assets/images/background-mobile.webp';
import LoginButton from '@/domains/user/components/LoginButton';
import { OAUTH_CONFIG } from '@/libs/apis/shared/constants';

/* ─── static data ─── */
const MARQUEE_ITEMS = [
    'PARIS', 'TOKYO', 'SEOUL', 'NEW YORK', 'LONDON',
    'BALI', 'ISTANBUL', 'BARCELONA', 'KYOTO', 'AMSTERDAM',
];

const TESTIMONIALS = [
    {
        quote: '사진을 찍는 것만으로 여행 일지가 완성됐어요. 정말 마법 같아요.',
        name: '김지현',
        seed: 'portrait-woman-1',
    },
    {
        quote: '친구들과 실시간으로 공유하니 함께 여행하는 느낌이에요.',
        name: '이승준',
        seed: 'portrait-man-2',
    },
    {
        quote: '보딩패스 형태의 티켓이 너무 예뻐서 앨범에 저장해뒀어요.',
        name: '박소연',
        seed: 'portrait-woman-3',
    },
];

/* ─── keyframes ─── */
const marqueeAnim = keyframes`
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
`;

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0);    }
`;

const scaleIn = keyframes`
    from { opacity: 0; transform: scale(0.92) translateY(20px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);    }
`;

/* ─── scroll-reveal global ─── */
const globalStyles = css`
    .reveal {
        opacity: 0;
        transform: translateY(28px);
        transition:
            opacity   0.8s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .reveal.in   { opacity: 1; transform: translateY(0); }
    .reveal-d1   { transition-delay: 0.1s; }
    .reveal-d2   { transition-delay: 0.2s; }
    .reveal-d3   { transition-delay: 0.3s; }

    @media (prefers-reduced-motion: reduce) {
        .reveal { opacity: 1; transform: none; transition: none; }
    }
`;

/* ─── component ─── */
const SigninPage = () => {
    const handleLoginButtonClick = (provider: keyof typeof OAUTH_CONFIG.PATH) => {
        window.location.href = OAUTH_CONFIG.PATH[provider];
    };

    useEffect(() => {
        if (!document.getElementById('outfit-font')) {
            const link = document.createElement('link');
            link.id = 'outfit-font';
            link.rel = 'stylesheet';
            link.href =
                'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap';
            document.head.appendChild(link);
        }

        const els = document.querySelectorAll<Element>('.reveal');
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) e.target.classList.add('in');
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -30px 0px' },
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    return (
        <>
            <Global styles={globalStyles} />
            <main css={wrap}>

                {/* ── HERO ── */}
                <section css={hero}>
                    <img src={backgroundImage} css={heroBgImg} alt="" aria-hidden="true" />
                    <div css={heroGrad} aria-hidden="true" />
                    <div css={heroInner}>
                        <p css={eyebrow}>여행의 기억을 담다</p>
                        <h1 css={h1}>
                            사진 한 장으로<br />
                            그려지는<br />
                            나만의 여행 지도
                        </h1>
                        <p css={heroCopy}>
                            찍는 순간마다 자동 완성되는 여행 티켓.
                            <br />위치, 날짜, 경로를 모두 담아드려요.
                        </p>
                        <a href="#auth" css={heroCta}>지금 시작하기</a>
                    </div>
                </section>

                {/* ── MARQUEE ── */}
                <div css={marqueeWrap} aria-hidden="true">
                    <div css={marqueeTrack}>
                        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                            <span key={i} css={marqItem}>
                                <span css={marqDot} />
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── FEATURES BENTO ── */}
                <section css={bento}>
                    <p css={sectionEyebrow} className="reveal">여행 기록의 재발견</p>
                    <h2 css={h2} className="reveal">
                        여행을 기록하는<br />새로운 방법
                    </h2>
                    <p css={sectionCopy} className="reveal reveal-d1">
                        사진의 메타데이터가 당신의 여행을 자동으로 구성합니다
                    </p>

                    {/* 2-col grid · Row 1: span2 · Row 2: span1+span1 · Row 3: span2 → 0 gaps */}
                    <div css={bentoGrid}>
                        <div css={[card, cardLarge]} className="reveal reveal-d1">
                            <img
                                src="https://picsum.photos/seed/boarding-ticket/800/480"
                                css={cardImg}
                                alt="자동 여행 티켓 예시"
                            />
                            <div css={cardGrad}>
                                <p css={cardLabel}>자동 여행 티켓</p>
                                <p css={cardSub}>GPS 메타데이터로 보딩패스가 자동 생성됩니다</p>
                            </div>
                        </div>

                        <div css={[card, cardHalf, cardDark]} className="reveal reveal-d1">
                            <span css={accentBar('#0071e3')} />
                            <p css={cardLabelLight}>실시간 공유</p>
                            <p css={cardSubLight}>친구와 즉시 공유</p>
                            <span css={decorCircle('#0071e3')} />
                        </div>

                        <div css={[card, cardHalf, cardLight]} className="reveal reveal-d2">
                            <span css={accentBar('#34d399')} />
                            <p css={cardLabelDark}>경로 재생</p>
                            <p css={cardSubDark}>실제 이동 경로 애니메이션</p>
                            <span css={decorCircle('#34d399')} />
                        </div>

                        <div css={[card, cardLarge]} className="reveal">
                            <img
                                src="https://picsum.photos/seed/world-map/800/400"
                                css={[cardImg, cardImgMono]}
                                alt="여행 경로 지도"
                            />
                            <div css={cardGrad}>
                                <p css={cardLabel}>지도 & 타임라인</p>
                                <p css={cardSub}>위치와 날짜로 정리된 이중 뷰 갤러리</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── TESTIMONIALS ── */}
                <section css={quotesSec}>
                    <div css={quotesIntro} className="reveal">
                        <p css={quoteEyebrow}>여행자들의 이야기</p>
                        <h2 css={quoteH2}>
                            기억은 흐릿해져도<br />
                            티켓은 남아요
                        </h2>
                    </div>

                    <div css={quoteList}>
                        {TESTIMONIALS.map((t, i) => (
                            <div
                                key={i}
                                css={quoteCard}
                                className="reveal"
                                style={{ transitionDelay: `${i * 0.13}s` }}
                            >
                                <p css={quoteBody}>"{t.quote}"</p>
                                <div css={quoteMeta}>
                                    <div
                                        css={quoteAvatar}
                                        style={{
                                            backgroundImage: `url(https://picsum.photos/seed/${t.seed}/80/80)`,
                                        }}
                                    />
                                    <span css={quoteName}>{t.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── AUTH / ACTION ── */}
                <section id="auth" css={authSec}>
                    <img src={backgroundImage} css={authBgImg} alt="" aria-hidden="true" />
                    <div css={authOvl} aria-hidden="true" />
                    <div css={authInner}>
                        <p css={authEyebrow}>무료로 시작하기</p>
                        <h2 css={authH2} className="reveal">
                            다음 여행을<br />
                            기록할 준비됐나요?
                        </h2>
                        <div css={authBtns}>
                            <div className="reveal reveal-d1">
                                <LoginButton provider="kakao" onClick={() => handleLoginButtonClick('KAKAO')} />
                            </div>
                            <div className="reveal reveal-d2">
                                <LoginButton provider="google" onClick={() => handleLoginButtonClick('GOOGLE')} />
                            </div>
                        </div>
                    </div>
                    <footer css={footerBar}>
                        <span css={footerBrand}>TRIPTYCHE</span>
                        <span css={footerNote}>© 2025 All rights reserved.</span>
                    </footer>
                </section>

            </main>
        </>
    );
};

export default SigninPage;

/* ════════════════════════════════════════════
   STYLES
════════════════════════════════════════════ */

/* page shell */
const wrap = css`
    overflow-x: hidden;
    width: 100%;
    font-family: 'Outfit', -apple-system, 'SF Pro Text', sans-serif;
`;

/* ── hero ── */
const hero = css`
    position: relative;
    height: 100dvh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`;

const heroBgImg = css`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.82) contrast(1.06) saturate(1.08);
`;

const heroGrad = css`
    position: absolute;
    inset: 0;
    background: linear-gradient(
        170deg,
        rgba(0, 0, 0, 0.06) 0%,
        rgba(0, 5, 20, 0.72) 100%
    );
    z-index: 1;
`;

const heroInner = css`
    position: relative;
    z-index: 2;
    padding: 0 24px 80px;
    animation: ${fadeUp} 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
`;

const eyebrow = css`
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.55);
    margin-bottom: 16px;
`;

/* H1: max-width 100% on 24px-padded container = 327px on 375px device.
   clamp(2.2rem, 8vw, 3.8rem) ≈ 30px at 375px → 3 explicit lines via <br/> = within 2-3 rule */
const h1 = css`
    font-size: clamp(2.2rem, 8vw, 3.8rem);
    font-weight: 800;
    line-height: 1.12;
    letter-spacing: -0.03em;
    color: #ffffff;
    text-shadow: 0 4px 32px rgba(0, 0, 0, 0.28);
    margin-bottom: 20px;
    max-width: 100%;
`;

const heroCopy = css`
    font-size: 14px;
    line-height: 1.75;
    color: rgba(255, 255, 255, 0.72);
    margin-bottom: 32px;
`;

const heroCta = css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #ffffff;
    color: #0f172a;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.2px;
    padding: 14px 28px;
    border-radius: 100px;
    text-decoration: none;
    animation: ${scaleIn} 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    @media (hover: hover) {
        &:hover {
            transform: scale(1.03) translateY(-2px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }
    }
    &:active { transform: scale(0.97); }
`;

/* ── marquee ── */
const marqueeWrap = css`
    overflow: hidden;
    background: #0f172a;
    padding: 16px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const marqueeTrack = css`
    display: flex;
    width: max-content;
    animation: ${marqueeAnim} 32s linear infinite;
`;

const marqItem = css`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 18px;
    font-family: 'Outfit', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.5);
    white-space: nowrap;
`;

const marqDot = css`
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #0071e3;
    flex-shrink: 0;
`;

/* ── bento ── */
const bento = css`
    padding: 72px 20px 80px;
    background: #f8fafc;
`;

const sectionEyebrow = css`
    font-family: 'Outfit', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #0071e3;
    margin-bottom: 12px;
`;

const h2 = css`
    font-family: 'Outfit', sans-serif;
    font-size: clamp(1.75rem, 6vw, 2.8rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.03em;
    color: #0f172a;
    margin-bottom: 12px;
`;

const sectionCopy = css`
    font-size: 13px;
    line-height: 1.7;
    color: #64748b;
    margin-bottom: 36px;
`;

/* 2-col grid · 3 rows · grid-auto-flow: dense · 0 empty cells */
const bentoGrid = css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-flow: dense;
    gap: 10px;
`;

const card = css`
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    @media (hover: hover) {
        &:hover img { transform: scale(1.05); }
    }
`;

/* Row 1 & 3: span 2 */
const cardLarge = css`
    grid-column: span 2;
    min-height: 200px;
`;

/* Row 2: two span-1 cards */
const cardHalf = css`
    grid-column: span 1;
    min-height: 168px;
    padding: 22px 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const cardDark = css`
    background: #0f172a;
`;

const cardLight = css`
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.06);
`;

const cardImg = css`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
`;

const cardImgMono = css`
    filter: grayscale(40%) contrast(1.05) brightness(0.88);
`;

const cardGrad = css`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 18px 18px 20px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.78) 0%, transparent 100%);
`;

const cardLabel = css`
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.3px;
    margin-bottom: 3px;
`;

const cardSub = css`
    font-size: 12px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.75);
`;

const cardLabelLight = css`
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.2px;
    margin-top: auto;
`;

const cardSubLight = css`
    font-size: 12px;
    color: rgba(255, 255, 255, 0.52);
`;

const cardLabelDark = css`
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.2px;
    margin-top: auto;
`;

const cardSubDark = css`
    font-size: 12px;
    color: #64748b;
`;

const accentBar = (color: string) => css`
    display: block;
    width: 28px;
    height: 3px;
    border-radius: 100px;
    background: ${color};
    flex-shrink: 0;
`;

const decorCircle = (color: string) => css`
    position: absolute;
    bottom: -20px;
    right: -20px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: ${color};
    opacity: 0.1;
    pointer-events: none;
`;

/* ── testimonials ── */
const quotesSec = css`
    padding: 80px 20px 88px;
    background: #0f172a;
`;

const quotesIntro = css`
    margin-bottom: 40px;
`;

const quoteEyebrow = css`
    font-family: 'Outfit', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.35);
    margin-bottom: 14px;
`;

const quoteH2 = css`
    font-family: 'Outfit', sans-serif;
    font-size: clamp(1.75rem, 6vw, 2.8rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.03em;
    color: #ffffff;
`;

const quoteList = css`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const quoteCard = css`
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 24px 20px;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: border-color 0.25s ease;
    @media (hover: hover) {
        &:hover { border-color: rgba(255, 255, 255, 0.16); }
    }
`;

const quoteBody = css`
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    line-height: 1.75;
    color: rgba(255, 255, 255, 0.82);
    font-style: italic;
    margin-bottom: 18px;
`;

const quoteMeta = css`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const quoteAvatar = css`
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    border: 1.5px solid rgba(255, 255, 255, 0.15);
    flex-shrink: 0;
`;

const quoteName = css`
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
`;

/* ── auth / action ── */
const authSec = css`
    position: relative;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const authBgImg = css`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(25%) brightness(0.42) contrast(1.08);
`;

const authOvl = css`
    position: absolute;
    inset: 0;
    background: linear-gradient(
        170deg,
        rgba(0, 5, 30, 0.88) 0%,
        rgba(0, 0, 0, 0.92) 100%
    );
    z-index: 1;
`;

const authInner = css`
    position: relative;
    z-index: 2;
    flex: 1;
    padding: 120px 24px 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const authEyebrow = css`
    font-family: 'Outfit', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 16px;
`;

const authH2 = css`
    font-family: 'Outfit', sans-serif;
    font-size: clamp(2rem, 7.5vw, 3.6rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.04em;
    color: #ffffff;
    margin-bottom: 52px;
`;

const authBtns = css`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const footerBar = css`
    position: relative;
    z-index: 2;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.07);
`;

const footerBrand = css`
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.45);
`;

const footerNote = css`
    font-size: 11px;
    color: rgba(255, 255, 255, 0.28);
`;
