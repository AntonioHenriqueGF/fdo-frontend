import styled from 'styled-components';

export const HeaderWrapper = styled.header`
    display: flex;
    align-items: center;
    gap: 20px;
    margin: 10px;

    button {
        padding: 10px;
        color: var(--standard-text-color);
        &:hover {
            background-color: var(--hover-background-color);
            color: var(--hover-text-color);
        }
    }

    h1 {
        font-size: 1.5rem;
        color: var(--standard-text-color);
        margin: 10px 0;
    }

    @media (max-width: 600px) {
        flex-direction: column;
        text-align: center;
        gap: 10px;

        .logo-icon {
            width: 60px;
            height: 60px;
        }

        button {
            position: absolute;
            left: 10px;
        }
    }
`;

export const ContentWrapper = styled.div`
    display: flex;

    .page-content {
        margin: 10px;
        width: 100%;
        height: calc(100vh - 89px);
    }
`;