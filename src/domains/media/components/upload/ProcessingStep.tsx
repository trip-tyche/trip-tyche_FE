import { css } from '@emotion/react';
import { AlertCircle, Loader } from 'lucide-react';

import AlertBox from '@/shared/components/common/AlertBox';
import Progress from '@/shared/components/common/Progress';
import { COLORS } from '@/shared/constants/style';

interface ProcessingStepProps {
    progress: { metadata: number };
}

const ProcessingStep = ({ progress }: ProcessingStepProps) => {
    return (
        <div css={container}>
            <main>
                <div css={progressContainer}>
                    <Progress title='전체 진행률' count={progress.metadata} size='lg' />
                </div>
                <AlertBox
                    theme='primary'
                    title='사진 정보를 읽어오는 중...'
                    description='위치, 날짜 정보를 추출하고 있어요.'
                    icon={<Loader size={16} color={COLORS.PRIMARY} style={{ animation: 'spin 1s linear infinite' }} />}
                />
            </main>

            <AlertBox
                description='처리 중에는 화면을 나가지 마세요. 약 5초 정도 소요됩니다. 위치 및 날짜 정보가 없는 사진은 후에 정보를 직접 추가할 수 있습니다.'
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

const progressContainer = css`
    margin-bottom: 24px;
`;

export default ProcessingStep;
