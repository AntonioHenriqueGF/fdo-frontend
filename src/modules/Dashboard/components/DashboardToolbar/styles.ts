import styled from 'styled-components';

export const DashboardToolbarWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  .MuiToggleButton-root {
    padding: 4px 12px;
    font-weight: 600;
  }

  .date-range {
    display: flex;
    gap: 8px;
  }

  .categories {
    min-width: 220px;
    flex: 1;
    max-width: 360px;
  }

  @media (max-width: 600px) {
    .date-range,
    .categories {
      width: 100%;
      max-width: none;
    }

    .date-range > * {
      flex: 1;
    }
  }
`;
