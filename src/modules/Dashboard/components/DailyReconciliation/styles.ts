import styled from 'styled-components';

export const IntervalSelectorWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`;

export const IntervalButton = styled.button<{ active: boolean }>`
    border-color: ${(props) => (props.active ? '#007bff' : '#f0f0f0')};
    border: 4px solid ${(props) => (props.active ? '#007bff' : '#f0f0f0')};
    padding: 5px 10px;
    margin: 0 5px;
    cursor: pointer;
    border-radius: 4px;
    transition: border 0.3s, color 0.3s;
    font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
`;