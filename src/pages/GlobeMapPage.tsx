import { useEffect, useMemo, useRef, useState } from 'react';

import { css, keyframes } from '@emotion/react';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useNavigate } from 'react-router-dom';

import { useTripTicketList } from '@/domains/trip/hooks/queries';
import { Trip } from '@/domains/trip/types';
import { ROUTES } from '@/shared/constants/route';

/* ─── constants ─────────────────────────────────────────── */
const R = 0.78;
const DOT_STEP = 1.8;           // degrees between dots
const VISIT_RADIUS = 9;         // degrees — dot turns blue if within this range of a visited centroid
const DOT_SIZE = 0.0075;
const LAND_MASK_URL = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-day.jpg';

const CENTROIDS: Record<string, [number, number]> = {
    'SOUTH KOREA': [37.5, 127.0], 'KOREA': [37.5, 127.0],
    'JAPAN': [36.2, 138.2],
    'CHINA': [35.9, 104.2],
    'TAIWAN': [23.7, 121.0],
    'HONG KONG': [22.4, 114.1],
    'SINGAPORE': [1.3, 103.8],
    'THAILAND': [15.9, 100.9],
    'VIETNAM': [14.1, 108.3],
    'INDONESIA': [-0.8, 113.9],
    'MALAYSIA': [4.2, 109.5],
    'PHILIPPINES': [13.0, 122.0],
    'CAMBODIA': [12.6, 104.9],
    'MYANMAR': [17.1, 96.9],
    'LAOS': [17.6, 102.5],
    'MONGOLIA': [46.9, 103.8],
    'INDIA': [20.6, 78.9],
    'SRI LANKA': [7.9, 80.8],
    'NEPAL': [28.4, 84.1],
    'PAKISTAN': [30.4, 69.3],
    'BANGLADESH': [23.7, 90.4],
    'FRANCE': [46.2, 2.2],
    'ITALY': [41.9, 12.6],
    'SPAIN': [40.5, -3.7],
    'GERMANY': [51.2, 10.5],
    'UNITED KINGDOM': [55.4, -3.4], 'UK': [55.4, -3.4],
    'PORTUGAL': [39.4, -8.2],
    'GREECE': [39.1, 21.8],
    'NETHERLANDS': [52.1, 5.3],
    'SWITZERLAND': [46.8, 8.2],
    'AUSTRIA': [47.5, 14.6],
    'BELGIUM': [50.5, 4.5],
    'CZECH REPUBLIC': [50.1, 15.5],
    'HUNGARY': [47.2, 19.5],
    'POLAND': [51.9, 19.1],
    'CROATIA': [45.1, 15.2],
    'NORWAY': [60.5, 8.5],
    'SWEDEN': [60.1, 18.6],
    'DENMARK': [56.3, 9.5],
    'FINLAND': [61.9, 25.8],
    'ICELAND': [64.9, -19.0],
    'IRELAND': [53.4, -8.2],
    'ROMANIA': [45.9, 24.9],
    'UKRAINE': [48.4, 31.2],
    'RUSSIA': [61.5, 105.3],
    'TURKEY': [38.9, 35.2],
    'GEORGIA': [42.3, 43.4],
    'SERBIA': [44.0, 21.0],
    'UNITED STATES': [37.1, -95.7], 'USA': [37.1, -95.7],
    'CANADA': [56.1, -106.3],
    'MEXICO': [23.6, -102.6],
    'CUBA': [21.5, -79.5],
    'COSTA RICA': [9.7, -83.8],
    'PANAMA': [8.5, -80.8],
    'BRAZIL': [-14.2, -51.9],
    'ARGENTINA': [-38.4, -63.6],
    'CHILE': [-35.7, -71.5],
    'PERU': [-9.2, -75.0],
    'COLOMBIA': [4.6, -74.1],
    'ECUADOR': [-1.8, -78.2],
    'AUSTRALIA': [-25.3, 133.8],
    'NEW ZEALAND': [-40.9, 174.9],
    'UAE': [23.4, 53.8], 'UNITED ARAB EMIRATES': [23.4, 53.8],
    'QATAR': [25.4, 51.2],
    'SAUDI ARABIA': [24.0, 45.0],
    'ISRAEL': [31.0, 34.9],
    'JORDAN': [30.6, 36.2],
    'OMAN': [21.5, 55.9],
    'BAHRAIN': [26.0, 50.6],
    'KUWAIT': [29.3, 47.5],
    'LEBANON': [33.9, 35.5],
    'IRAN': [32.4, 53.7],
    'EGYPT': [26.8, 30.8],
    'MOROCCO': [31.8, -7.1],
    'TUNISIA': [33.9, 9.5],
    'SOUTH AFRICA': [-30.6, 22.9],
    'KENYA': [-0.0, 37.9],
    'TANZANIA': [-6.4, 34.9],
    'ETHIOPIA': [9.1, 40.5],
    'NIGERIA': [9.1, 8.7],
    'MALDIVES': [3.2, 73.2],
    'UZBEKISTAN': [41.4, 64.6],
    'KAZAKHSTAN': [47.2, 67.0],
};

/* ─── helpers ───────────────────────────────────────────── */
const toVec3 = (lat: number, lng: number, r: number): THREE.Vector3 => {
    const phi   = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
         r * Math.cos(phi),
         r * Math.sin(phi) * Math.sin(theta),
    );
};

const parseCountry = (str: string) => {
    const [emoji = '', nameKo = '', nameEn = ''] = str.split('/');
    return { emoji, nameKo, nameEn: nameEn.trim().toUpperCase() };
};

/* ─── types ─────────────────────────────────────────────── */
interface SelectedMark {
    nameKo: string;
    nameEn: string;
    emoji: string;
    trips: Trip[];
}

/* ─── component ─────────────────────────────────────────── */
const GlobeMapPage = () => {
    const navigate    = useNavigate();
    const mountRef    = useRef<HTMLDivElement>(null);
    const pinsRef     = useRef<THREE.Mesh[]>([]);
    const [selected, setSelected]     = useState<SelectedMark | null>(null);
    const [dotsReady, setDotsReady]   = useState(false);

    const { data: tripsResult, isLoading } = useTripTicketList(true);
    const trips: Trip[] = tripsResult?.success
        ? (tripsResult as { success: true; data: Trip[] }).data
        : [];

    const countriesMap = useMemo(() => {
        const map = new Map<string, { trips: Trip[]; nameKo: string; emoji: string }>();
        trips.forEach((trip) => {
            const { nameEn, nameKo, emoji } = parseCountry(trip.country);
            if (!map.has(nameEn)) map.set(nameEn, { trips: [], nameKo, emoji });
            map.get(nameEn)!.trips.push(trip);
        });
        return map;
    }, [trips]);

    useEffect(() => {
        if (!document.getElementById('outfit-font')) {
            const link = document.createElement('link');
            link.id = 'outfit-font';
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap';
            document.head.appendChild(link);
        }
    }, []);

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        const W = container.clientWidth;
        const H = container.clientHeight;

        /* scene setup */
        const scene    = new THREE.Scene();
        const camera   = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
        camera.position.set(0, 0, 3.0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(W, H);
        renderer.setClearColor(0xffffff, 1);
        container.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 1));

        /* invisible sphere — gives OrbitControls something to target */
        scene.add(new THREE.Mesh(
            new THREE.SphereGeometry(R, 32, 32),
            new THREE.MeshBasicMaterial({ visible: false }),
        ));

        /* orbit controls */
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping   = true;
        controls.dampingFactor   = 0.05;
        controls.rotateSpeed     = 0.45;
        controls.autoRotate      = true;
        controls.autoRotateSpeed = 0.45;
        controls.minDistance     = 2.0;
        controls.maxDistance     = 7.0;
        controls.enablePan       = false;
        controls.enableZoom      = false;

        /* visited centroids list */
        const visitedCentroids: Array<[number, number]> = [];
        countriesMap.forEach((_, nameEn) => {
            const c = CENTROIDS[nameEn];
            if (c) visitedCentroids.push(c);
        });

        const rings: Array<{ mesh: THREE.Mesh; t: number }> = [];

        /* ── build dot globe from land mask ── */
        const img = new Image();
        img.crossOrigin = 'anonymous';

        const buildDots = (pixels: Uint8ClampedArray, CW: number, CH: number) => {
            const isLand = (lat: number, lng: number): boolean => {
                const px  = Math.min(CW - 1, Math.max(0, Math.floor((lng + 180) / 360 * CW)));
                const py  = Math.min(CH - 1, Math.max(0, Math.floor((90 - lat) / 180 * CH)));
                const idx = (py * CW + px) * 4;
                const r   = pixels[idx], g = pixels[idx + 1], b = pixels[idx + 2];
                return !(b > r * 1.2 && b > g * 1.1 && b > 100);
            };

            const isNearVisited = (lat: number, lng: number): boolean => {
                for (const [clat, clng] of visitedCentroids) {
                    if (Math.hypot(lat - clat, lng - clng) < VISIT_RADIUS) return true;
                }
                return false;
            };

            const grayPos: THREE.Vector3[] = [];
            const bluePos: THREE.Vector3[] = [];

            for (let lat = -88; lat <= 88; lat += DOT_STEP) {
                for (let lng = -180; lng < 180; lng += DOT_STEP) {
                    if (!isLand(lat, lng)) continue;
                    const pos = toVec3(lat, lng, R);
                    if (visitedCentroids.length > 0 && isNearVisited(lat, lng)) {
                        bluePos.push(pos);
                    } else {
                        grayPos.push(pos);
                    }
                }
            }

            const dotGeo  = new THREE.CircleGeometry(DOT_SIZE, 5);
            const dummy   = new THREE.Object3D();
            const UP      = new THREE.Vector3(0, 0, 1);

            const addMesh = (positions: THREE.Vector3[], color: number) => {
                if (!positions.length) return;
                const mat  = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
                const mesh = new THREE.InstancedMesh(dotGeo, mat, positions.length);
                positions.forEach((pos, i) => {
                    dummy.position.copy(pos);
                    dummy.quaternion.setFromUnitVectors(UP, pos.clone().normalize());
                    dummy.updateMatrix();
                    mesh.setMatrixAt(i, dummy.matrix);
                });
                mesh.instanceMatrix.needsUpdate = true;
                scene.add(mesh);
            };

            addMesh(grayPos, 0xc4cad6);   // unvisited land — light gray
            addMesh(bluePos, 0x3b82f6);   // visited country region — blue

            /* clickable pins for visited countries */
            pinsRef.current = [];
            countriesMap.forEach(({ trips: ct, nameKo, emoji }, nameEn) => {
                const coords = CENTROIDS[nameEn];
                if (!coords) return;
                const [lat, lng] = coords;
                const pos    = toVec3(lat, lng, R);
                const normal = pos.clone().normalize();

                const pin = new THREE.Mesh(
                    new THREE.SphereGeometry(0.028, 12, 12),
                    new THREE.MeshBasicMaterial({ color: 0x1d4ed8 }),
                );
                pin.position.copy(pos);
                pin.userData = { nameEn, nameKo, emoji, trips: ct };
                scene.add(pin);
                pinsRef.current.push(pin);

                const ring = new THREE.Mesh(
                    new THREE.RingGeometry(0.038, 0.06, 32),
                    new THREE.MeshBasicMaterial({
                        color: 0x3b82f6, transparent: true, opacity: 0.6,
                        side: THREE.DoubleSide, depthWrite: false,
                    }),
                );
                ring.position.copy(pos);
                ring.quaternion.setFromUnitVectors(UP, normal);
                scene.add(ring);
                rings.push({ mesh: ring, t: Math.random() });
            });

            setDotsReady(true);
        };

        img.onload = () => {
            try {
                const CW = 720, CH = 360;
                const cvs = document.createElement('canvas');
                cvs.width = CW; cvs.height = CH;
                const ctx = cvs.getContext('2d')!;
                ctx.drawImage(img, 0, 0, CW, CH);
                const pixels = ctx.getImageData(0, 0, CW, CH).data;
                buildDots(pixels, CW, CH);
            } catch {
                /* CORS fallback: dots based on centroids only */
                buildDots(new Uint8ClampedArray(0), 0, 0);
            }
        };
        img.onerror = () => buildDots(new Uint8ClampedArray(0), 0, 0);
        img.src = LAND_MASK_URL;

        /* pointer hit detection */
        let dragged = false, downX = 0, downY = 0;
        const onDown = (e: PointerEvent) => { dragged = false; downX = e.clientX; downY = e.clientY; };
        const onMove = (e: PointerEvent) => { if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) dragged = true; };
        const onUp   = (e: PointerEvent) => {
            if (dragged) return;
            const rect = renderer.domElement.getBoundingClientRect();
            const x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
            const y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
            const ray = new THREE.Raycaster();
            ray.setFromCamera(new THREE.Vector2(x, y), camera);
            const hits = ray.intersectObjects(pinsRef.current);
            if (hits.length > 0) {
                const { nameEn, nameKo, emoji, trips: t } = hits[0].object.userData;
                setSelected({ nameEn, nameKo, emoji, trips: t });
                controls.autoRotate = false;
            } else {
                setSelected(null);
                controls.autoRotate = true;
            }
        };
        renderer.domElement.addEventListener('pointerdown', onDown);
        renderer.domElement.addEventListener('pointermove', onMove);
        renderer.domElement.addEventListener('pointerup',   onUp);

        /* resize */
        const onResize = () => {
            const w = container.clientWidth, h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', onResize);

        /* render loop */
        let id: number;
        const animate = () => {
            id = requestAnimationFrame(animate);
            rings.forEach((r) => {
                r.t = (r.t + 0.007) % 1;
                r.mesh.scale.setScalar(1 + r.t * 2.2);
                (r.mesh.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - r.t);
            });
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(id);
            renderer.domElement.removeEventListener('pointerdown', onDown);
            renderer.domElement.removeEventListener('pointermove', onMove);
            renderer.domElement.removeEventListener('pointerup',   onUp);
            window.removeEventListener('resize', onResize);
            controls.dispose();
            renderer.dispose();
            if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
        };
    }, [countriesMap]);

    const countryCount = countriesMap.size;

    return (
        <div css={page}>
            {/* header */}
            <div css={header}>
                <button css={backBtn} onClick={() => navigate(ROUTES.PATH.MAIN)} aria-label="뒤로">
                    <ChevronLeft size={20} />
                </button>
                <span css={headerTitle}>내 여행 지구본</span>
                {trips.length > 0 && (
                    <div css={statsPill}>
                        <span css={statsNum}>{countryCount}</span>
                        <span css={statsLabel}>개국</span>
                    </div>
                )}
            </div>

            {/* globe canvas */}
            <div ref={mountRef} css={canvas} />

            {/* legend */}
            {!isLoading && dotsReady && !selected && (
                <div css={legend}>
                    <span css={legendDot(false)} />
                    <span css={legendText}>미방문</span>
                    <span css={legendDot(true)} />
                    <span css={legendText}>방문</span>
                </div>
            )}

            {/* stats bar */}
            {!isLoading && trips.length > 0 && dotsReady && !selected && (
                <div css={statsBar}>
                    <div css={statsItem}>
                        <span css={statsItemNum}>{countryCount}</span>
                        <span css={statsItemLabel}>방문 국가</span>
                    </div>
                    <div css={statsDivider} />
                    <div css={statsItem}>
                        <span css={statsItemNum}>{trips.length}</span>
                        <span css={statsItemLabel}>총 여행</span>
                    </div>
                    <div css={statsDivider} />
                    <div css={statsItem}>
                        <MapPin size={12} css={pinIconBlue} />
                        <span css={statsItemLabel}>핀을 탭하세요</span>
                    </div>
                </div>
            )}

            {/* country bottom sheet */}
            {selected && (
                <div css={backdrop} onClick={() => setSelected(null)}>
                    <div css={card} onClick={(e) => e.stopPropagation()}>
                        <div css={handle} />
                        <div css={cardHead}>
                            <div css={cardEmojiWrap}>
                                <span css={cardEmoji}>{selected.emoji}</span>
                            </div>
                            <div css={cardHeadText}>
                                <p css={cardNameKo}>{selected.nameKo}</p>
                                <p css={cardNameEn}>{selected.nameEn}</p>
                            </div>
                            <div css={cardBadgeWrap}>
                                <span css={cardBadgeNum}>{selected.trips.length}</span>
                                <span css={cardBadgeLabel}>번 방문</span>
                            </div>
                        </div>
                        <div css={tripList}>
                            {selected.trips.map((trip, i) => (
                                <button
                                    key={trip.tripKey}
                                    css={tripRow(i)}
                                    onClick={() => navigate(ROUTES.PATH.TRIP.ROOT(trip.tripKey!))}
                                >
                                    <span css={tripIndex}>{String(i + 1).padStart(2, '0')}</span>
                                    <div css={tripInfo}>
                                        <p css={tripTitle}>{trip.tripTitle}</p>
                                        <p css={tripDate}>
                                            {dayjs(trip.startDate).format('YY.MM.DD')} — {dayjs(trip.endDate).format('YY.MM.DD')}
                                        </p>
                                    </div>
                                    <ChevronRight size={14} css={tripArrow} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* loading */}
            {(!dotsReady) && (
                <div css={loadingWrap}>
                    <div css={loadingOrb} />
                    <p css={loadingText}>지구본 로딩 중</p>
                </div>
            )}

            {/* empty */}
            {!isLoading && trips.length === 0 && dotsReady && (
                <div css={emptyWrap}>
                    <div css={emptyOrb}>
                        <MapPin size={18} css={emptyIcon} />
                    </div>
                    <p css={emptyTitle}>아직 여행 기록이 없어요</p>
                    <p css={emptySub}>티켓을 만들면 지구본에 표시됩니다</p>
                </div>
            )}
        </div>
    );
};

export default GlobeMapPage;

/* ════════════════════════════════════════════
   STYLES
════════════════════════════════════════════ */

const slideUp = keyframes`
    from { transform: translateY(20px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
`;

const fadeIn = keyframes`
    from { opacity: 0; }
    to   { opacity: 1; }
`;

const sheetUp = keyframes`
    from { transform: translateY(100%); }
    to   { transform: translateY(0);    }
`;

const orbPulse = keyframes`
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.5); }
`;

/* ─── page ───────────────────────────────── */
const page = css`
    position: relative;
    height: 100dvh;
    background: radial-gradient(ellipse at 50% 48%, #eef2ff 0%, #f8faff 50%, #ffffff 100%);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: 'Outfit', -apple-system, sans-serif;
`;

/* ─── header ─────────────────────────────── */
const header = css`
    position: absolute;
    top: 0; left: 0; right: 0;
    z-index: 40;
    height: 58px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,0,0,0.05);
    animation: ${fadeIn} 0.4s ease both;
`;

const backBtn = css`
    width: 34px; height: 34px;
    border: none;
    background: #f3f4f6;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #374151;
    cursor: pointer; flex-shrink: 0;
    transition: background 0.15s, transform 0.15s;
    -webkit-tap-highlight-color: transparent;
    &:active { background: #e5e7eb; transform: scale(0.9); }
`;

const headerTitle = css`
    flex: 1;
    font-size: 15px; font-weight: 700;
    color: #111827;
    letter-spacing: -0.3px;
`;

const statsPill = css`
    display: flex; align-items: baseline; gap: 2px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 100px;
    padding: 4px 10px;
    flex-shrink: 0;
`;

const statsNum = css`
    font-size: 13px; font-weight: 800;
    color: #2563eb;
    letter-spacing: -0.3px;
`;

const statsLabel = css`
    font-size: 10px; font-weight: 500;
    color: #60a5fa;
`;

/* ─── canvas ─────────────────────────────── */
const canvas = css`
    flex: 1;
    width: 100%;
    cursor: grab;
    &:active { cursor: grabbing; }
`;

/* ─── legend ─────────────────────────────── */
const legend = css`
    position: absolute;
    top: 70px; right: 16px;
    z-index: 20;
    display: flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.88);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0,0,0,0.06);
    border-radius: 100px;
    padding: 5px 12px;
    animation: ${fadeIn} 0.5s ease 0.4s both;
`;

const legendDot = (visited: boolean) => css`
    width: 7px; height: 7px;
    border-radius: 50%;
    background: ${visited ? '#3b82f6' : '#c4cad6'};
    flex-shrink: 0;
`;

const legendText = css`
    font-size: 10px; font-weight: 500;
    color: #6b7280;
`;

/* ─── stats bar ──────────────────────────── */
const statsBar = css`
    position: absolute;
    bottom: 32px; left: 50%; transform: translateX(-50%);
    z-index: 20;
    display: flex; align-items: center;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(0,0,0,0.07);
    border-radius: 100px;
    padding: 10px 4px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
    white-space: nowrap;
    animation: ${slideUp} 0.5s cubic-bezier(0.22,1,0.36,1) 0.3s both;
`;

const statsItem = css`
    display: flex; align-items: center; gap: 5px;
    padding: 0 16px;
`;

const statsItemNum = css`
    font-size: 15px; font-weight: 800;
    color: #111827;
    letter-spacing: -0.4px;
`;

const statsItemLabel = css`
    font-size: 11px; font-weight: 400;
    color: #9ca3af;
`;

const statsDivider = css`
    width: 1px; height: 14px;
    background: #e5e7eb;
    flex-shrink: 0;
`;

const pinIconBlue = css`color: #3b82f6; flex-shrink: 0;`;

/* ─── bottom sheet ───────────────────────── */
const backdrop = css`
    position: absolute; inset: 0;
    z-index: 50;
    display: flex; flex-direction: column; justify-content: flex-end;
    background: rgba(0,0,0,0.15);
    backdrop-filter: blur(1px);
    -webkit-backdrop-filter: blur(1px);
    animation: ${fadeIn} 0.2s ease both;
`;

const card = css`
    background: #ffffff;
    border: 1px solid rgba(0,0,0,0.06);
    border-bottom: none;
    border-radius: 24px 24px 0 0;
    padding: 12px 20px 48px;
    box-shadow: 0 -8px 40px rgba(0,0,0,0.08);
    animation: ${sheetUp} 0.38s cubic-bezier(0.22,1,0.36,1) both;
`;

const handle = css`
    width: 32px; height: 3px;
    background: #e5e7eb;
    border-radius: 100px;
    margin: 0 auto 20px;
`;

const cardHead = css`
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f3f4f6;
`;

const cardEmojiWrap = css`
    width: 44px; height: 44px;
    background: #f9fafb;
    border: 1px solid #f3f4f6;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
`;

const cardEmoji = css`font-size: 26px; line-height: 1;`;

const cardHeadText = css`flex: 1; min-width: 0;`;

const cardNameKo = css`
    font-size: 18px; font-weight: 800;
    color: #111827; letter-spacing: -0.4px;
    margin-bottom: 2px;
`;

const cardNameEn = css`
    font-size: 10px; font-weight: 500;
    color: #9ca3af;
    letter-spacing: 1.8px; text-transform: uppercase;
`;

const cardBadgeWrap = css`
    text-align: right; flex-shrink: 0;
`;

const cardBadgeNum = css`
    display: block;
    font-size: 22px; font-weight: 800;
    color: #2563eb; letter-spacing: -0.5px;
    line-height: 1;
`;

const cardBadgeLabel = css`
    font-size: 10px; font-weight: 400;
    color: #93c5fd;
`;

const tripList = css`display: flex; flex-direction: column;`;

const tripRow = (i: number) => css`
    display: flex; align-items: center; gap: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #f9fafb;
    cursor: pointer; background: none;
    border-left: none; border-right: none; border-top: none;
    width: 100%; text-align: left;
    -webkit-tap-highlight-color: transparent;
    transition: opacity 0.15s;
    animation: ${slideUp} 0.3s cubic-bezier(0.22,1,0.36,1) ${i * 0.055}s both;
    &:last-child { border-bottom: none; }
    &:active { opacity: 0.5; }
`;

const tripIndex = css`
    font-size: 10px; font-weight: 700;
    color: #d1d5db;
    letter-spacing: 0.3px;
    min-width: 18px;
    flex-shrink: 0;
`;

const tripInfo = css`flex: 1; min-width: 0;`;

const tripTitle = css`
    font-size: 14px; font-weight: 600;
    color: #111827;
    letter-spacing: -0.2px;
    margin-bottom: 3px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
`;

const tripDate = css`
    font-size: 11px; font-weight: 400;
    color: #9ca3af;
`;

const tripArrow = css`color: #d1d5db; flex-shrink: 0;`;

/* ─── loading ────────────────────────────── */
const loadingWrap = css`
    position: absolute; inset: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 12px; z-index: 10; pointer-events: none;
`;

const loadingOrb = css`
    width: 10px; height: 10px;
    border-radius: 50%;
    background: #3b82f6;
    animation: ${orbPulse} 1.4s ease-in-out infinite;
`;

const loadingText = css`
    font-size: 12px; font-weight: 500;
    color: #9ca3af;
    letter-spacing: 0.3px;
`;

/* ─── empty ──────────────────────────────── */
const emptyWrap = css`
    position: absolute;
    bottom: 90px; left: 0; right: 0;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    z-index: 10; pointer-events: none;
    animation: ${slideUp} 0.5s cubic-bezier(0.22,1,0.36,1) 0.5s both;
`;

const emptyOrb = css`
    width: 44px; height: 44px;
    border-radius: 50%;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
`;

const emptyIcon = css`color: #d1d5db;`;

const emptyTitle = css`
    font-size: 15px; font-weight: 700;
    color: #374151;
    letter-spacing: -0.3px;
`;

const emptySub = css`
    font-size: 12px; font-weight: 400;
    color: #9ca3af;
`;
