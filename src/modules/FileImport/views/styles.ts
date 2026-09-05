import styled from 'styled-components';

export const ImportPanelSelectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: space-between;

  @media (max-width: 1050px) {
    flex-direction: column;
    gap: 10px;
  }
`;
