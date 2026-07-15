import styled from 'styled-components';

export const DailyCategoryPanelWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;

    @media (max-width: 958px) {
        grid-template-columns: 1fr;
    }
`;