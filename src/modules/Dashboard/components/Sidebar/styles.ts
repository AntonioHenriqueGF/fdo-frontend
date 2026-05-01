import styled from 'styled-components';

export const SidebarWrapper = styled.aside<{ $isOpen: boolean }>`
    width: ${({ $isOpen }) => ($isOpen ? '250px' : '44px')};
    padding: 10px;
    transition: width var(--standard-transition); /* Smooth transition */

    a {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;

        text-decoration: none;
        color: var(--standard-text-color);
        padding: 10px;
        border-radius: 8px;

        white-space: nowrap;
        overflow: hidden;

        transition: background-color var(--standard-transition), color var(--standard-transition); /* Smooth transition */

        &:hover {
            color: var(--hover-text-color);

            background-color: var(--hover-background-color);
        }

        &.active {
            color: var(--active-text-color);
            background-color: var(--active-background-color);

            &:hover {
                cursor: default;
                background-color: var(--active-background-color);
                color: var(--active-text-color);
            }
        }
    }
`;