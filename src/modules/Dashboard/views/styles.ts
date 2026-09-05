import type { CSSProperties } from '@mui/material';
import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 10px;

  * {
    font-family: var(--standard-font-family);
  }

  .drawer-button {
    padding: 10px;
    color: var(--standard-text-color);
    height: 44px;
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

  .logout-button {
    position: absolute;
    right: 10px;
    margin: 10px;

    font-weight: bold;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
    gap: 10px;

    .logo-icon {
      width: 60px;
      height: 60px;
    }

    .drawer-button {
      position: absolute;
      left: 10px;
    }
  }
`;

export const ContentWrapper = styled.div`
  display: flex;

  .page-content {
    transition: width var(--standard-transition);
  }

  .page-content.closed {
    margin: 10px;
    width: 100%;
    height: calc(100vh - 89px);
  }

  .page-content.open {
    margin: 10px;
    width: 100%;
    height: calc(100vh - 89px);
    width: calc(100vw - 124px);
  }

  @media (max-width: 600px) {
    .page-content {
      height: calc(100vh - 159px) !important;
      width: calc(100vw - 20px) !important;
    }
  }
`;

export const headerStyles = {
  logoutButton: {
    fontFamily: 'var(--standard-font-family)',
    color: 'var(--action-button-color)',
  } as CSSProperties,
};
