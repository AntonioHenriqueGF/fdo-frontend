import styled from 'styled-components';

export const ContentPadStyle = styled.div`
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;

    font-family: var(--standard-font-family);
    color: var(--standard-text-color);

    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);

    height: calc(100% - 40px);
    overflow-y: auto;

    h2 {
        position: sticky;
    }
`;

export const ContentPadSmallStyle = styled.div`
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;

    font-family: var(--standard-font-family);
    color: var(--standard-text-color);

    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);

    h2 {
        position: sticky;
    }
`;