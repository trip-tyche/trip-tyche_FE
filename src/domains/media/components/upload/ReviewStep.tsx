import { AlertCircle, Check } from 'lucide-react';

import AlertBox from '@/shared/components/common/AlertBox';

const ReviewStep = () => {
    return (
        <div>
            <AlertBox
                theme='success'
                title='사진 처리 완료'
                description='33장의 사진이 성공적으로 처리되었습니다'
                icon={<Check size={16} />}
            />

            <AlertBox
                theme='warning'
                title='일부 사진에 정보가 누락되었습니다'
                description='위치 정보가 없는 사진 5장, 날짜 정보가 없는 사진 2장이 있습니다. 걱정 마세요! 여행을 등록한 후 사진 관리 화면에서 직접 정보를 추가할 수 있습니다.'
                icon={<AlertCircle size={16} />}
            />
        </div>
    );
};

export default ReviewStep;
