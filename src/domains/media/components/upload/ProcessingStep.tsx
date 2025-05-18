import { css } from '@emotion/react';
import { AlertCircle, Loader } from 'lucide-react';

import { ImageProcessStatusType } from '@/domains/media/types';
import AlertBox from '@/shared/components/common/AlertBox';
import Progress from '@/shared/components/common/Progress';
import { COLORS } from '@/shared/constants/style';

interface ProcessingStepProps {
    currentProcess: ImageProcessStatusType;
    progress: { metadata: number; optimize: number; upload: number };
}

const ProcessingStep = ({ currentProcess, progress }: ProcessingStepProps) => {
    const getTotalProgress = () => {
        if (currentProcess === 'metadata') {
            return Math.floor(progress.metadata * 0.1);
        } else if (currentProcess === 'optimize') {
            return 10 + Math.floor(progress.optimize * 0.75);
        } else if (currentProcess === 'upload') {
            return 85 + Math.floor(progress.upload * 0.15);
        }
        return 0;
    };

    const getAlertBoxMessage = (currentProcess: ImageProcessStatusType) => {
        if (currentProcess === 'metadata') {
            return {
                title: '사진 정보 수집 중...',
                description: '소중한 추억의 장소와 날짜를 기억하고 있어요.',
            };
        } else if (currentProcess === 'optimize') {
            return {
                title: '사진 최적화 중...',
                description: '언제 어디서나 쉽게 볼 수 있도록 사진을 가볍게 만들고 있어요.',
            };
        } else if (currentProcess === 'upload') {
            return {
                title: '안전하게 저장 중...',
                description: '소중한 사진을 안전하게 저장하고 있어요.',
            };
        }
        return {
            title: '문제가 발생했나요?',
            description: '새로고침 및 서비스 종료 후 다시 이용해주세요.',
        };
    };

    return (
        <div css={container}>
            <main>
                <div css={totalProgressContainer}>
                    <Progress title='전체 진행률' count={getTotalProgress()} size='lg' />
                </div>
                <AlertBox
                    theme='primary'
                    title={getAlertBoxMessage(currentProcess).title}
                    description={getAlertBoxMessage(currentProcess).description}
                    icon={<Loader size={16} color={COLORS.PRIMARY} style={{ animation: 'spin 1s linear infinite' }} />}
                />
                <div css={progressContainer}>
                    <Progress title='메타데이터 추출' count={progress.metadata} />
                    <Progress title='이미지 최적화' count={currentProcess === 'metadata' ? 0 : progress.optimize} />
                    <Progress
                        title='클라우드 업로드'
                        count={currentProcess === 'metadata' || currentProcess === 'optimize' ? 0 : progress.upload}
                    />
                </div>
            </main>

            <AlertBox
                description='처리 중에는 화면을 나가지 마세요. 약 10초 정도 소요됩니다. 위치 및 날짜 정보가 없는
                        사진은 후에 정보를 직접 추가할 수 있습니다.'
                icon={<AlertCircle size={16} color={'#4b5563'} />}
            />
        </div>
    );
};

const container = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const totalProgressContainer = css`
    margin-bottom: 24px;
`;

const progressContainer = css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 24px 0;
`;

export default ProcessingStep;
