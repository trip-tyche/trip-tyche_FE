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
            return 70 + Math.floor(progress.upload * 0.15);
        }
        return 0;
    };

    return (
        <div css={container}>
            <main>
                <div css={totalProgressContainer}>
                    <Progress title='전체 진행률' count={getTotalProgress()} size='lg' />
                </div>
                <AlertBox
                    theme='primary'
                    title='메타데이터 추출 중...'
                    description='사진에서 위치와 날짜 정보를 추출하고 있습니다.'
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
                description='처리 중에는 화면을 나가지 마세요. 이 과정은 약 10초 정도 소요됩니다. 위치 및 날짜 정보가 없는
                        사진은 후에 수동으로 정보를 추가할 수 있습니다.'
                icon={<AlertCircle size={20} color={'#4b5563'} />}
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
