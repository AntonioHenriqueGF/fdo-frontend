import styled from 'styled-components';

export const ImportListWrapper = styled.div`
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: var(--background-color, #f9f9f9);

  ul {
    list-style-type: none;
    padding: 0;

    li {
      margin-bottom: 8px;
      background-color: #fff;
      padding: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      .import-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        p {
          margin: 0;
        }

        button {
          font-family: var(--standard-font-family);
        }
      }
    }
  }
`;
