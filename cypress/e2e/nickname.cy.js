const TOKENS = {
    AT: import.meta.env.VITE_TEST_AT,
    RT: import.meta.env.VITE_TEST_RT,
    DOMAIN: '.triptychetest.shop',
};

describe('닉네임 수정 테스트', () => {
    beforeEach(() => {
        cy.setCookie('access_token', TOKENS.AT, { domain: TOKENS.DOMAIN });
        cy.setCookie('refresh_token', TOKENS.RT, { domain: TOKENS.DOMAIN });
        cy.visit('/setting');
    });

    it('설정 페이지 접근', () => {
        cy.contains('설정').should('be.visible'); // 요소가 화면에 보이는지 확인
    });

    it("'닉네임 수정' 버튼 클릭", () => {
        cy.get('li').contains('닉네임 수정').click(); // 요소 찾기 / "닉네임 수정" 텍스트가 있는 요소 찾기 / 찾았다면 해당 요소
        cy.get('h1').contains('닉네임 변경').should('be.visible');
    });

    it('닉네임을 입력하고 변경할 수 있다', () => {
        cy.get('li').contains('닉네임 수정').click();
        cy.get('input[type="text"]').clear().type('홍길동');
        cy.get('button').contains('닉네임 변경하기').click();

        cy.contains('닉네임이 변경되었습니다').should('be.visible');
    });
});
