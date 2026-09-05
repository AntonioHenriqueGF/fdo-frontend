import styled from 'styled-components';

export const ImportPanelSelectionWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  justify-content: space-between;

  @media (max-width: 1050px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;
