describe('닉네임 수정 테스트', () => {
    it('설정 페이지 접근', () => {
        cy.visit('/setting');
        cy.contains('설정').should('be.visible'); // 요소가 화면에 보이는지 확인
    });

    it('닉네임 수정 버튼 클릭', () => {
        cy.visit('/setting');
        cy.get('li').contains('닉네임 수정').click(); // 요소 찾기 / "닉네임 수정" 텍스트가 있는 요소 찾기 / 찾았다면 해당 요소
        cy.get('h1').contains('닉네임 변경').should('be.visible');
    });
});
