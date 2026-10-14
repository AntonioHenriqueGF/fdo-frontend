import styled from 'styled-components';

export const ChartCardWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 16px;

  background-color: #fff;
  border: 1px solid #dde3ec;
  border-radius: 8px;
`;

export const ChartCardHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;

  h3 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
  }

  .headline {
    font-size: 1.1rem;
    font-weight: 700;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
`;

export const ChartCardBody = styled.div`
  width: 100%;
  min-width: 0;
`;
