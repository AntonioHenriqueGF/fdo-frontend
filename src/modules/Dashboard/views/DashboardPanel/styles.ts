import styled from 'styled-components';

// As many ~380px cards per row as the screen fits, a single column on phones
export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 380px), 1fr));
  gap: 16px;
`;
