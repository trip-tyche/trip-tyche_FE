import { useState } from 'react';

import { css, keyframes } from '@emotion/react';
import {
    Bell, Settings, Plus, Edit, ImagePlus, Share2, Trash, ChevronLeft,
    Clock, User, MessageCircle, LogOut, Check, AlertCircle, Info,
} from 'lucide-react';

import backgroundImage from '@/assets/images/background-mobile.webp';
import characterImg from '@/assets/images/character-icon.png';

const SECTIONS = ['로그인', '메인', '알림', '설정', '컴포넌트'];

const MOCK_TRIPS = [
    {
        id: 1, isOwner: true, owner: 'marista',
        startDate: '2024.03.15', endDate: '2024.03.22',
        from: '대한민국', to: '일본',
        title: '도쿄 벚꽃 여행', hashtags: ['솔로트립', '인생뷰', '식도락여행'],
    },
    {
        id: 2, isOwner: false, owner: 'friend01',
        startDate: '2024.06.10', endDate: '2024.06.17',
        from: '대한민국', to: '프랑스',
        title: '파리에서의 7일', hashtags: ['커플여행', '럭셔리모먼트'],
    },
];

const MOCK_NOTIFICATIONS = [
    { id: 1, isRead: false, sender: 'friend01', message: '여행 티켓 공유 요청이 왔어요', date: '방금', time: '오전 10:23' },
    { id: 2, isRead: true, sender: 'admin', message: '도쿄 벚꽃 여행에 사진이 추가되었어요', date: '어제', time: '오후 3:45' },
    { id: 3, isRead: true, sender: 'travel_mate', message: '공유 요청을 수락했어요', date: '3일 전', time: '오전 9:12' },
];

const MARQUEE_ITEMS = ['PARIS', 'TOKYO', 'SEOUL', 'NEW YORK', 'LONDON', 'BALI', 'ISTANBUL', 'BARCELONA', 'KYOTO', 'AMSTERDAM'];

const DevPreviewPage = () => {
    const [activeSection, setActiveSection] = useState('로그인');
    const [activeTab, setActiveTab] = useState('여행');

    return (
        <div css={page}>
            {/* Top nav */}
            <div css={topNav}>
                {SECTIONS.map((s) => (
                    <button
                        key={s}
                        css={[navBtn, activeSection === s && navBtnActive]}
                        onClick={() => setActiveSection(s)}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* ─── 로그인 ─── */}
            {activeSection === '로그인' && (
                <div css={screenWrap}>
                    {/* Floating nav */}
                    <div css={floatingNav}><span css={floatingNavBrand}>TRIPTYCHE</span></div>

                    {/* Hero */}
                    <div css={signinHero}>
                        <img src={backgroundImage} css={signinBgImg} alt="" aria-hidden="true" />
                        <div css={signinGrad} />
                        <div css={signinInner}>
                            <p css={signinEyebrow}>여행의 기억을 담다</p>
                            <h1 css={signinH1}>
                                사진 한 장으로<br />
                                완성되는
                                <span css={signinPillImg} aria-hidden="true" />
                                <br />
                                나만의 여행
                            </h1>
                            <p css={signinCopy}>
                                찍는 순간마다 자동 완성되는 여행 티켓.
                                <br />위치, 날짜, 경로를 모두 담아드려요.
                            </p>
                            <span css={signinCta}>지금 시작하기</span>
                        </div>
                    </div>

                    {/* Marquee */}
                    <div css={marqueeWrap} aria-hidden="true">
                        <div css={marqueeTrack}>
                            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                                <span key={i} css={marqItem}>
                                    <span css={marqDot} />{item}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Bento */}
                    <div css={signinBento}>
                        <p css={bentoEyebrow}>여행 기록의 재발견</p>
                        <h2 css={bentoH2}>여행을 기록하는<br />새로운 방법</h2>
                        <div css={bentoGrid}>
                            <div css={[bentoCard, bentoLarge]}>
                                <img
                                    src="https://picsum.photos/seed/boarding-ticket/800/480"
                                    css={bentoImg}
                                    alt="자동 여행 티켓"
                                />
                                <div css={bentoOverlay}>
                                    <p css={bentoCardLabel}>자동 여행 티켓</p>
                                    <p css={bentoCardSub}>GPS 메타데이터로 보딩패스가 자동 생성됩니다</p>
                                </div>
                            </div>
                            <div css={[bentoCard, bentoHalf, bentoDark]}>
                                <span css={accentLine('#0071e3')} />
                                <p css={bentoDarkLabel}>실시간 공유</p>
                                <p css={bentoDarkSub}>친구와 즉시 공유</p>
                                <span css={bentoCircle('#0071e3')} />
                            </div>
                            <div css={[bentoCard, bentoHalf, bentoLight]}>
                                <span css={accentLine('#34d399')} />
                                <p css={bentoLightLabel}>경로 재생</p>
                                <p css={bentoLightSub}>실제 이동 경로 애니메이션</p>
                                <span css={bentoCircle('#34d399')} />
                            </div>
                            <div css={[bentoCard, bentoLarge]}>
                                <img
                                    src="https://picsum.photos/seed/world-map/800/400"
                                    css={[bentoImg, bentoImgMono]}
                                    alt="여행 경로 지도"
                                />
                                <div css={bentoOverlay}>
                                    <p css={bentoCardLabel}>지도 & 타임라인</p>
                                    <p css={bentoCardSub}>위치와 날짜로 정리된 이중 뷰 갤러리</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Testimonials */}
                    <div css={quotesSec}>
                        <p css={quoteEyebrow}>여행자들의 이야기</p>
                        <h2 css={quoteH2}>기억은 흐릿해져도<br />티켓은 남아요</h2>
                        <div css={quoteList}>
                            {[
                                { q: '사진을 찍는 것만으로 여행 일지가 완성됐어요. 정말 마법 같아요.', name: '김지현', seed: 'portrait-woman-1' },
                                { q: '보딩패스 형태의 티켓이 너무 예뻐서 앨범에 저장해뒀어요.', name: '박소연', seed: 'portrait-woman-3' },
                            ].map((t, i) => (
                                <div key={i} css={quoteCard}>
                                    <p css={quoteBody}>"{t.q}"</p>
                                    <div css={quoteMeta}>
                                        <div css={quoteAvatar} style={{ backgroundImage: `url(https://picsum.photos/seed/${t.seed}/80/80)` }} />
                                        <span css={quoteName}>{t.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Auth CTA */}
                    <div css={authCta}>
                        <img src={backgroundImage} css={authCtaBg} alt="" aria-hidden="true" />
                        <div css={authCtaOvl} />
                        <div css={authCtaInner}>
                            <p css={authEyebrow}>무료로 시작하기</p>
                            <h2 css={authH2}>다음 여행을<br />기록할 준비됐나요?</h2>
                            <div css={authBtns}>
                                <button css={kakaoBtn}>카카오로 5초안에 시작하기</button>
                                <button css={googleBtn}>Google 계정으로 시작하기</button>
                            </div>
                        </div>
                        <div css={authFooter}>
                            <span css={authFooterBrand}>TRIPTYCHE</span>
                            <span css={authFooterNote}>© 2025 All rights reserved.</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── 메인 ─── */}
            {activeSection === '메인' && (
                <div css={screenWrap}>
                    <header css={glassHeader}>
                        <span css={glassLogo}>TRIPTYCHE</span>
                        <div css={headerIcons}>
                            <div css={iconBtnWrap}>
                                <Bell css={iconBtn} />
                                <span css={headerBadge}>3</span>
                            </div>
                            <div css={iconBtnWrap}><Settings css={iconBtn} /></div>
                        </div>
                    </header>
                    <div css={mainContent}>
                        <div css={mainTitleRow}>
                            <div>
                                <h2 css={mainTitle}>나의 여행 티켓</h2>
                                <p css={mainSubtitle}>
                                    지금까지 <strong css={mainCount}>{MOCK_TRIPS.length}장</strong>의 티켓을 만들었어요
                                </p>
                            </div>
                            <button css={mainFab}><Plus size={22} color="#fff" /></button>
                        </div>
                        <div css={tripListWrap}>
                            {MOCK_TRIPS.map((trip, i) => (
                                <div key={trip.id} css={tripItemAnim(i)}>
                                    <TripCard trip={trip} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ─── 알림 ─── */}
            {activeSection === '알림' && (
                <div css={screenWrap}>
                    <header css={glassHeader}>
                        <div css={headerWithBack}>
                            <ChevronLeft size={20} color="#0071e3" />
                            <span css={glassLogo} style={{ fontSize: '16px', fontWeight: 600 }}>알림</span>
                        </div>
                    </header>
                    <div css={tabBar}>
                        {['여행', '안내'].map((t) => (
                            <button
                                key={t}
                                css={[tabBtn, activeTab === t && tabBtnActive]}
                                onClick={() => setActiveTab(t)}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <div css={notifList}>
                        {MOCK_NOTIFICATIONS.map((n, i) => (
                            <div key={n.id} css={[notifItem(n.isRead), notifItemAnim(i)]}>
                                <div css={notifAvatar(n.isRead)} />
                                <div css={notifContent}>
                                    <div css={notifHeaderRow}>
                                        <span css={notifSender}>{n.sender}</span>
                                        <span css={notifDate}>{n.date}</span>
                                    </div>
                                    <p css={notifMessage}>{n.message}</p>
                                    <div css={notifFooter}>
                                        <Clock size={11} color="rgba(0,0,0,0.32)" />
                                        <span css={notifTime}>{n.time}</span>
                                        {n.isRead
                                            ? <span css={statusBadge('success')}>수락됨</span>
                                            : <span css={statusBadge('pending')}>대기중</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ─── 설정 ─── */}
            {activeSection === '설정' && (
                <div css={screenWrap}>
                    <header css={glassHeader}>
                        <div css={headerWithBack}>
                            <ChevronLeft size={20} color="#0071e3" />
                            <span css={glassLogo} style={{ fontSize: '16px', fontWeight: 600 }}>설정</span>
                        </div>
                    </header>
                    <div css={settingContent}>
                        {/* Premium profile card */}
                        <div css={profileCard}>
                            <div css={profileShine} />
                            <div css={profileInner}>
                                <div css={avatarRing}>
                                    <img css={characterImgStyle} src={characterImg} alt="캐릭터" />
                                </div>
                                <div>
                                    <p css={travelerLabel}>여행자</p>
                                    <p css={nicknameText}>marista</p>
                                </div>
                            </div>
                        </div>

                        <ul css={settingGroup}>
                            {[
                                { icon: <User size={20} />, text: '닉네임 수정' },
                                { icon: <MessageCircle size={20} />, text: '문의하기' },
                            ].map(({ icon, text }) => (
                                <li key={text} css={settingRow}>
                                    <span css={settingIcon}>{icon}</span>
                                    <span css={settingText}>{text}</span>
                                    <ChevronLeft size={16} css={chevronRight} />
                                </li>
                            ))}
                        </ul>

                        <ul css={[settingGroup, settingGroupBottom]}>
                            <li css={settingRow}>
                                <span css={settingIcon}><LogOut size={20} /></span>
                                <span css={[settingText, logoutText]}>로그아웃</span>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {/* ─── 컴포넌트 ─── */}
            {activeSection === '컴포넌트' && (
                <div css={screenWrap}>
                    <header css={glassHeader}>
                        <div css={headerWithBack}>
                            <ChevronLeft size={20} color="#0071e3" />
                            <span css={glassLogo} style={{ fontSize: '16px', fontWeight: 600 }}>컴포넌트</span>
                        </div>
                    </header>
                    <div css={compContent}>
                        <p css={compLabel}>버튼</p>
                        <button css={btnPrimary}>주요 CTA — Apple Blue</button>
                        <button css={btnWhite}>보조 버튼 — 화이트</button>
                        <button css={btnDisabled} disabled>비활성화</button>
                        <button css={btnPill}>지금 시작하기 →</button>

                        <p css={compLabel}>알럿 박스</p>
                        <div css={alertBox('info')}><Info size={16} /><span>기본 안내 메시지입니다.</span></div>
                        <div css={alertBox('success')}><Check size={16} /><span>여행 티켓이 저장되었습니다.</span></div>
                        <div css={alertBox('error')}><AlertCircle size={16} /><span>오류가 발생했습니다. 다시 시도해주세요.</span></div>

                        <p css={compLabel}>배지</p>
                        <div css={badgeRow}>
                            <span css={statusBadge('success')}>수락됨</span>
                            <span css={statusBadge('error')}>거절됨</span>
                            <span css={statusBadge('pending')}>대기중</span>
                        </div>

                        <p css={compLabel}>해시태그</p>
                        <div css={hashRow}>
                            {['솔로트립', '인생뷰', '힐링스팟', '식도락여행'].map((t) => (
                                <span key={t} css={hashTag}><span css={hashSym}>#</span> {t}</span>
                            ))}
                        </div>

                        <p css={compLabel}>토스트</p>
                        <div css={toastPreview}>사진이 저장되었습니다</div>

                        <div css={spacer} />
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─── TripCard ─── */
const TripCard = ({ trip }: { trip: typeof MOCK_TRIPS[0] }) => (
    <div css={ticketCard}>
        <div css={ticketHeader(trip.isOwner)}>
            {[['PASSENGER', trip.owner], ['DATE', trip.startDate], ['DATE', trip.endDate], ['FLIGHT', 'TYCHE AIR']].map(([l, v]) => (
                <div key={l + v} css={ticketHeaderItem}>
                    <span css={ticketLabelSmall}>{l}</span>
                    <span css={ticketVal}>{v}</span>
                </div>
            ))}
        </div>
        <div css={ticketBody}>
            <div css={cities}>
                <span css={cityName}>{trip.from}</span>
                <div css={flightLine}>
                    <div css={flightDot} /><div css={flightLineSeg} />
                    <img css={charImg} src={characterImg} alt="" />
                    <div css={flightLineSeg} /><div css={flightDot} />
                </div>
                <span css={cityName}>{trip.to}</span>
            </div>
            <div css={tripTitleSec}>
                <span css={tripLbl}>TITLE</span>
                <span css={tripVal}>{trip.title}</span>
            </div>
            <div css={ticketFooter}>
                <div css={hashRowInline}>
                    {trip.hashtags.map((t) => (
                        <span key={t} css={hashTag}><span css={hashSym}>#</span> {t}</span>
                    ))}
                </div>
            </div>
        </div>
        <div css={ticketActions}>
            {[['수정', <Edit size={12} />], ['사진', <ImagePlus size={13} />], ['공유', <Share2 size={13} />], ['삭제', <Trash size={12} />]].map(([label, icon]) => (
                <button key={String(label)} css={actionBtn}>{icon}{label}</button>
            ))}
        </div>
    </div>
);

/* ════════════════════════════════════════════
   STYLES
════════════════════════════════════════════ */

const marqueeAnim = keyframes`
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
`;

const cardAnim = keyframes`
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
`;

/* ── shell ── */
const page = css`
    height: 100dvh;
    display: flex;
    flex-direction: column;
    background: #0a0a0f;
    font-family: 'Outfit', -apple-system, 'SF Pro Text', sans-serif;
    -webkit-font-smoothing: antialiased;
`;

const topNav = css`
    display: flex;
    background: #ffffff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    overflow-x: auto;
    flex-shrink: 0;
`;

const navBtn = css`
    flex: 1;
    min-width: 60px;
    padding: 10px 4px;
    border: none;
    border-bottom: 2.5px solid transparent;
    background: transparent;
    color: #64748b;
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
    white-space: nowrap;
    transition: color 0.15s;
`;

const navBtnActive = css`
    color: #0071e3;
    font-weight: 700;
    border-bottom-color: #0071e3;
`;

const screenWrap = css`
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    background: #f8fafc;
`;

/* ── shared glass header ── */
const glassHeader = css`
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding: 0 20px;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    z-index: 20;
`;

const glassLogo = css`
    font-family: 'Outfit', sans-serif;
    font-size: 17px;
    font-weight: 800;
    letter-spacing: -0.3px;
    color: #0071e3;
    user-select: none;
`;

const headerIcons = css`display: flex; align-items: center; gap: 4px;`;

const iconBtnWrap = css`
    position: relative;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
`;

const iconBtn = css`width: 20px; height: 20px; color: #475569;`;

const headerBadge = css`
    position: absolute;
    top: 4px; right: 4px;
    min-width: 14px; height: 14px;
    background: #0071e3; color: #fff;
    font-size: 9px; font-weight: 700;
    border-radius: 999px;
    display: flex; align-items: center; justify-content: center;
    padding: 0 3px;
`;

const headerWithBack = css`display: flex; align-items: center; gap: 4px;`;

/* ── 로그인 ── */
const floatingNav = css`
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 30;
    display: flex;
    justify-content: center;
    padding: 12px 0;
    background: transparent;
    pointer-events: none;
`;

const floatingNavBrand = css`
    background: rgba(10, 14, 26, 0.72);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 100px;
    padding: 8px 24px;
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.92);
`;

const signinHero = css`
    position: relative;
    height: 480px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    overflow: hidden;
    margin-top: -44px;
`;

const signinBgImg = css`
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    filter: brightness(0.82) contrast(1.06);
`;

const signinGrad = css`
    position: absolute; inset: 0;
    background: linear-gradient(170deg, rgba(0,0,0,0.06) 0%, rgba(0,5,20,0.72) 100%);
    z-index: 1;
`;

const signinInner = css`
    position: relative; z-index: 2;
    padding: 0 24px 40px;
`;

const signinEyebrow = css`
    font-family: 'Outfit', sans-serif;
    font-size: 10px; font-weight: 500;
    letter-spacing: 2.5px; text-transform: uppercase;
    color: rgba(255,255,255,0.55); margin-bottom: 14px;
`;

const signinH1 = css`
    font-family: 'Outfit', sans-serif;
    font-size: clamp(2rem, 8vw, 3.2rem);
    font-weight: 800; line-height: 1.12;
    letter-spacing: -0.03em;
    color: #fff;
    text-shadow: 0 4px 32px rgba(0,0,0,0.28);
    margin-bottom: 16px;
`;

const signinPillImg = css`
    display: inline-block;
    width: 60px; height: 24px; border-radius: 100px;
    background-image: url(${backgroundImage});
    background-size: cover; background-position: center top;
    vertical-align: middle; margin: 0 6px;
    border: 1.5px solid rgba(255,255,255,0.22);
`;

const signinCopy = css`
    font-size: 13px; line-height: 1.75;
    color: rgba(255,255,255,0.72); margin-bottom: 24px;
`;

const signinCta = css`
    display: inline-flex;
    background: #fff; color: #0f172a;
    font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 700;
    padding: 12px 24px; border-radius: 100px;
`;

const marqueeWrap = css`
    overflow: hidden; background: #0f172a;
    padding: 14px 0; flex-shrink: 0;
`;

const marqueeTrack = css`
    display: flex; width: max-content;
    animation: ${marqueeAnim} 32s linear infinite;
`;

const marqItem = css`
    display: flex; align-items: center; gap: 10px;
    padding: 0 16px;
    font-family: 'Outfit', sans-serif;
    font-size: 9px; font-weight: 600;
    letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,0.5); white-space: nowrap;
`;

const marqDot = css`
    width: 3px; height: 3px; border-radius: 50%;
    background: #0071e3; flex-shrink: 0;
`;

const signinBento = css`padding: 48px 20px 40px; background: #f8fafc;`;
const bentoEyebrow = css`
    font-family: 'Outfit', sans-serif;
    font-size: 9px; font-weight: 600;
    letter-spacing: 3px; text-transform: uppercase;
    color: #0071e3; margin-bottom: 10px;
`;
const bentoH2 = css`
    font-family: 'Outfit', sans-serif;
    font-size: clamp(1.5rem, 5vw, 2.2rem); font-weight: 800;
    line-height: 1.15; letter-spacing: -0.03em;
    color: #0f172a; margin-bottom: 8px;
`;

const bentoGrid = css`
    display: grid; grid-template-columns: 1fr 1fr;
    grid-auto-flow: dense; gap: 8px;
    margin-top: 24px;
`;
const bentoCard = css`border-radius: 14px; overflow: hidden; position: relative;`;
const bentoLarge = css`grid-column: span 2; min-height: 160px;`;
const bentoHalf = css`
    grid-column: span 1; min-height: 140px;
    padding: 18px 14px; display: flex; flex-direction: column; gap: 4px;
`;
const bentoDark = css`background: #0f172a;`;
const bentoLight = css`background: #fff; border: 1px solid rgba(0,0,0,0.06);`;
const bentoImg = css`width: 100%; height: 100%; object-fit: cover; display: block;`;
const bentoImgMono = css`filter: grayscale(40%) contrast(1.05) brightness(0.88);`;
const bentoOverlay = css`
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 14px 14px 16px;
    background: linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 100%);
`;
const bentoCardLabel = css`
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700;
    color: #fff; letter-spacing: -0.2px; margin-bottom: 2px;
`;
const bentoCardSub = css`font-size: 11px; line-height: 1.5; color: rgba(255,255,255,0.75);`;
const bentoDarkLabel = css`
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700;
    color: #fff; letter-spacing: -0.2px; margin-top: auto;
`;
const bentoDarkSub = css`font-size: 11px; color: rgba(255,255,255,0.52);`;
const bentoLightLabel = css`
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700;
    color: #0f172a; letter-spacing: -0.2px; margin-top: auto;
`;
const bentoLightSub = css`font-size: 11px; color: #64748b;`;
const accentLine = (color: string) => css`
    display: block; width: 24px; height: 3px;
    border-radius: 100px; background: ${color}; flex-shrink: 0;
`;
const bentoCircle = (color: string) => css`
    position: absolute; bottom: -16px; right: -16px;
    width: 64px; height: 64px; border-radius: 50%;
    background: ${color}; opacity: 0.1; pointer-events: none;
`;

const quotesSec = css`padding: 48px 20px 56px; background: #0f172a;`;
const quoteEyebrow = css`
    font-family: 'Outfit', sans-serif;
    font-size: 9px; font-weight: 600;
    letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,0.35); margin-bottom: 12px;
`;
const quoteH2 = css`
    font-family: 'Outfit', sans-serif;
    font-size: clamp(1.5rem, 5vw, 2.2rem); font-weight: 800;
    line-height: 1.15; letter-spacing: -0.03em;
    color: #fff; margin-bottom: 28px;
`;
const quoteList = css`display: flex; flex-direction: column; gap: 10px;`;
const quoteCard = css`
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px; padding: 20px 18px;
`;
const quoteBody = css`
    font-family: 'Outfit', sans-serif; font-size: 13px; line-height: 1.75;
    color: rgba(255,255,255,0.82); font-style: italic; margin-bottom: 14px;
`;
const quoteMeta = css`display: flex; align-items: center; gap: 10px;`;
const quoteAvatar = css`
    width: 30px; height: 30px; border-radius: 50%;
    background-size: cover; background-position: center;
    border: 1.5px solid rgba(255,255,255,0.15); flex-shrink: 0;
`;
const quoteName = css`
    font-family: 'Outfit', sans-serif; font-size: 11px;
    font-weight: 600; color: rgba(255,255,255,0.6);
`;

const authCta = css`
    position: relative; min-height: 360px;
    display: flex; flex-direction: column; flex-shrink: 0;
`;
const authCtaBg = css`
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; filter: grayscale(25%) brightness(0.42) contrast(1.08);
`;
const authCtaOvl = css`
    position: absolute; inset: 0;
    background: linear-gradient(170deg, rgba(0,5,30,0.88) 0%, rgba(0,0,0,0.92) 100%);
    z-index: 1;
`;
const authCtaInner = css`
    position: relative; z-index: 2; flex: 1;
    padding: 48px 24px 32px;
    display: flex; flex-direction: column; justify-content: center;
`;
const authEyebrow = css`
    font-family: 'Outfit', sans-serif; font-size: 9px; font-weight: 600;
    letter-spacing: 3px; text-transform: uppercase;
    color: rgba(255,255,255,0.4); margin-bottom: 12px;
`;
const authH2 = css`
    font-family: 'Outfit', sans-serif;
    font-size: clamp(1.8rem, 6vw, 2.8rem); font-weight: 800;
    line-height: 1.1; letter-spacing: -0.04em;
    color: #fff; margin-bottom: 32px;
`;
const authBtns = css`display: flex; flex-direction: column; gap: 10px;`;
const kakaoBtn = css`
    width: 100%; height: 46px; border: none; border-radius: 10px;
    background: #fee500; color: #1d1d1f;
    font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600;
    cursor: pointer;
`;
const googleBtn = css`
    width: 100%; height: 46px; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px;
    background: rgba(255,255,255,0.08); color: #fff;
    font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600;
    cursor: pointer;
`;
const authFooter = css`
    position: relative; z-index: 2;
    padding: 16px 24px;
    display: flex; justify-content: space-between; align-items: center;
    border-top: 1px solid rgba(255,255,255,0.07);
`;
const authFooterBrand = css`
    font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.45);
`;
const authFooterNote = css`font-size: 10px; color: rgba(255,255,255,0.28);`;

/* ── 메인 ── */
const mainContent = css`
    flex: 1; overflow: auto;
    padding: 20px 16px 32px;
    display: flex; flex-direction: column;
`;
const mainTitleRow = css`
    display: flex; justify-content: space-between;
    align-items: flex-start; margin-bottom: 20px;
`;
const mainTitle = css`
    font-family: 'Outfit', sans-serif;
    font-size: 26px; font-weight: 800;
    letter-spacing: -0.5px; color: #0f172a;
    line-height: 1.1; margin-bottom: 5px;
`;
const mainSubtitle = css`
    font-family: 'Outfit', sans-serif;
    font-size: 13px; color: #94a3b8;
`;
const mainCount = css`color: #0071e3; font-weight: 700;`;
const mainFab = css`
    width: 44px; height: 44px; border-radius: 50%; border: none;
    background: #0071e3; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(0,113,227,0.35); cursor: pointer;
`;
const tripListWrap = css`display: flex; flex-direction: column; gap: 12px;`;
const tripItemAnim = (i: number) => css`
    animation: ${cardAnim} 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.07}s both;
`;

/* ── 알림 ── */
const tabBar = css`
    display: flex; background: #fff;
    border-bottom: 1px solid rgba(0,0,0,0.08); flex-shrink: 0;
`;
const tabBtn = css`
    flex: 1; padding: 12px 0; border: none;
    border-bottom: 2px solid transparent;
    background: none; color: rgba(0,0,0,0.48);
    font-family: 'Outfit', sans-serif; font-size: 14px;
    cursor: pointer; transition: all 0.15s;
`;
const tabBtnActive = css`color: #0071e3; font-weight: 600; border-bottom-color: #0071e3;`;
const notifList = css`flex: 1; overflow: auto; background: #fff;`;
const notifItem = (read: boolean) => css`
    padding: 14px 16px; border-bottom: 1px solid rgba(0,0,0,0.06);
    display: flex; align-items: flex-start;
    background: ${read ? '#fff' : 'rgba(0,113,227,0.05)'};
`;
const notifItemAnim = (i: number) => css`
    animation: ${cardAnim} 0.45s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.05}s both;
`;
const notifAvatar = (read: boolean) => css`
    width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
    background: ${read ? '#f1f5f9' : 'rgba(0,113,227,0.12)'};
    position: relative;
    &::after {
        content: ''; display: ${read ? 'none' : 'block'};
        position: absolute; top: -2px; right: -2px;
        width: 10px; height: 10px; border-radius: 50%;
        background: #0071e3; border: 2px solid #fff;
    }
`;
const notifContent = css`flex: 1; margin-left: 12px; min-width: 0;`;
const notifHeaderRow = css`display: flex; justify-content: space-between; margin-bottom: 3px;`;
const notifSender = css`
    font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600;
    letter-spacing: -0.2px; color: #1d1d1f;
`;
const notifDate = css`font-size: 11px; color: rgba(0,0,0,0.48); white-space: nowrap; margin-left: 8px;`;
const notifMessage = css`font-size: 13px; letter-spacing: -0.2px; color: rgba(0,0,0,0.78); line-height: 1.5;`;
const notifFooter = css`display: flex; align-items: center; gap: 6px; margin-top: 5px;`;
const notifTime = css`font-size: 11px; color: rgba(0,0,0,0.48);`;

/* ── 설정 ── */
const settingContent = css`
    flex: 1; overflow: auto;
    padding: 16px 0 32px;
    display: flex; flex-direction: column;
    gap: 8px;
`;

const profileCard = css`
    position: relative;
    margin: 0 16px 4px;
    border-radius: 20px; overflow: hidden;
    background: linear-gradient(135deg, #0071e3 0%, #0055b3 100%);
    padding: 22px 20px;
    box-shadow: 0 8px 28px rgba(0,113,227,0.28);
`;
const profileShine = css`
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 80% 10%, rgba(255,255,255,0.18) 0%, transparent 55%);
    pointer-events: none;
`;
const profileInner = css`position: relative; display: flex; align-items: center; gap: 14px;`;
const avatarRing = css`
    width: 52px; height: 52px; border-radius: 50%;
    background: rgba(255,255,255,0.18);
    border: 1.5px solid rgba(255,255,255,0.32);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
`;
const characterImgStyle = css`width: 32px; height: 32px; object-fit: contain;`;
const travelerLabel = css`
    font-family: 'Outfit', sans-serif; font-size: 9px; font-weight: 500;
    letter-spacing: 2px; text-transform: uppercase;
    color: rgba(255,255,255,0.65); margin-bottom: 2px;
`;
const nicknameText = css`
    font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 700;
    letter-spacing: -0.4px; color: #fff; line-height: 1.15;
`;

const settingGroup = css`
    display: flex; flex-direction: column;
    background: #fff; border-radius: 16px;
    margin: 0 16px;
    overflow: hidden;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;
const settingGroupBottom = css`margin-top: 4px;`;
const settingRow = css`
    display: flex; align-items: center; height: 52px; padding: 0 16px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    &:last-child { border-bottom: none; }
`;
const settingIcon = css`color: #1d1d1f; display: flex; align-items: center;`;
const settingText = css`
    margin-left: 12px; flex: 1;
    font-family: 'Outfit', sans-serif; font-size: 15px;
    letter-spacing: -0.2px; color: #1d1d1f;
`;
const logoutText = css`color: #ef4444;`;
const chevronRight = css`transform: rotate(180deg); color: rgba(0,0,0,0.28);`;

/* ── 컴포넌트 ── */
const compContent = css`flex: 1; overflow: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px;`;
const compLabel = css`
    font-family: 'Outfit', sans-serif;
    font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
    color: rgba(0,0,0,0.32); margin-top: 8px;
`;
const btnPrimary = css`
    width: 100%; height: 46px; border: none; border-radius: 10px;
    background: #0071e3; color: #fff;
    font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 600;
    cursor: pointer;
`;
const btnWhite = css`
    width: 100%; height: 46px; border: 1px solid rgba(0,0,0,0.1); border-radius: 10px;
    background: #fafafc; color: #1d1d1f;
    font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 600;
    cursor: pointer;
`;
const btnDisabled = css`
    width: 100%; height: 46px; border: none; border-radius: 10px;
    background: rgba(0,0,0,0.1); color: rgba(0,0,0,0.28);
    font-family: 'Outfit', sans-serif; font-size: 15px;
    cursor: not-allowed;
`;
const btnPill = css`
    border: 1px solid #0071e3; border-radius: 100px;
    background: transparent; color: #0071e3;
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
    padding: 8px 20px; cursor: pointer; align-self: flex-start;
`;

const alertBox = (type: 'info' | 'success' | 'error') => {
    const c = {
        info: { bg: '#f8fafc', text: 'rgba(0,0,0,0.8)', icon: 'rgba(0,0,0,0.48)' },
        success: { bg: '#f0fdf4', text: '#065f46', icon: '#059669' },
        error: { bg: '#fff5f5', text: '#ef4444', icon: '#ef4444' },
    };
    return css`
        display: flex; align-items: center; gap: 10px;
        padding: 14px 16px; border-radius: 10px;
        background: ${c[type].bg}; color: ${c[type].text};
        font-family: 'Outfit', sans-serif; font-size: 13px; line-height: 1.5;
        svg { color: ${c[type].icon}; flex-shrink: 0; }
    `;
};

const statusBadge = (type: 'success' | 'error' | 'pending') => {
    const s = {
        success: { bg: '#f0fdf4', color: '#065f46' },
        error: { bg: '#fff5f5', color: '#ef4444' },
        pending: { bg: 'rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.48)' },
    };
    return css`
        padding: 3px 10px; border-radius: 100px;
        background: ${s[type].bg}; color: ${s[type].color};
        font-family: 'Outfit', sans-serif;
        font-size: 11px; font-weight: 600;
    `;
};

const badgeRow = css`display: flex; gap: 8px; flex-wrap: wrap;`;
const hashRow = css`display: flex; flex-wrap: wrap; gap: 6px;`;
const hashTag = css`
    background: rgba(0,0,0,0.06); color: rgba(0,0,0,0.6);
    padding: 4px 10px; border-radius: 100px;
    font-family: 'Outfit', sans-serif; font-size: 12px;
`;
const hashSym = css`color: #0071e3; font-weight: 700;`;
const toastPreview = css`
    padding: 14px 20px; border-radius: 14px;
    background: rgba(15,23,42,0.92); color: #fff;
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2); text-align: center;
`;
const spacer = css`height: 32px;`;

/* ── ticket card (메인 preview) ── */
const ticketCard = css`border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.12);`;
const ticketHeader = (own: boolean) => css`
    display: flex; justify-content: space-around;
    background: ${own ? '#0071e3' : '#0055d4'}; padding: 12px 8px;
`;
const ticketHeaderItem = css`display: flex; flex-direction: column; gap: 3px;`;
const ticketLabelSmall = css`font-size: 9px; color: rgba(255,255,255,0.48); letter-spacing: 0.6px; text-transform: uppercase;`;
const ticketVal = css`font-size: 11px; font-weight: 600; color: #fff;`;
const ticketBody = css`background: #f5f5f7; padding: 14px; display: flex; flex-direction: column; gap: 4px;`;
const cities = css`display: flex; align-items: center;`;
const cityName = css`font-size: 16px; font-weight: 700; letter-spacing: -0.3px; color: #1d1d1f;`;
const flightLine = css`flex: 1; display: flex; align-items: center; gap: 2px; margin: 0 8px;`;
const flightDot = css`width: 5px; height: 5px; border-radius: 50%; background: rgba(0,0,0,0.28); flex-shrink: 0;`;
const flightLineSeg = css`flex: 1; height: 1px; background: rgba(0,0,0,0.16);`;
const charImg = css`width: 28px; height: 28px; object-fit: contain; flex-shrink: 0;`;
const tripTitleSec = css`margin: 12px 0 0 2px; display: flex; flex-direction: column; gap: 4px;`;
const tripLbl = css`font-size: 9px; color: rgba(0,0,0,0.48); letter-spacing: 0.4px; text-transform: uppercase;`;
const tripVal2 = css`font-size: 13px; font-weight: 600; letter-spacing: -0.2px; color: #1d1d1f;`;
const ticketFooter = css`display: flex; justify-content: space-between; align-items: flex-end; margin-top: 8px;`;
const hashRowInline = css`display: flex; flex-wrap: wrap; gap: 4px;`;
const ticketActions = css`
    display: flex; justify-content: space-between;
    background: #fff; padding: 8px 12px;
    border-top: 1px solid rgba(0,0,0,0.06);
`;
const actionBtn = css`
    display: flex; align-items: center; gap: 4px;
    padding: 6px 8px; border: none; background: transparent;
    color: rgba(0,0,0,0.6);
    font-family: 'Outfit', sans-serif; font-size: 11px;
    cursor: pointer; border-radius: 6px;
`;

// alias to fix reference
const tripVal = tripVal2;

export default DevPreviewPage;
