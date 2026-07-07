import styled from 'styled-components';

export const ContentWrapper = styled.div`
    height: calc(100% - 80px);
    color: var(--standard-text-color);

    * {
        font-family: var(--standard-font-family) !important;
    }

    .actionButtons {
        display: flex;
        gap: 20px;
        flex-direction: row;
        align-items: center;
        margin-bottom: 20px;
        justify-content: space-between;
        .createCategoryForm {
            display: flex;
            gap: 20px;
        }
    }

`;

export const CategoryListStyles = styled.ul`
    overflow-y: auto;
    max-height: calc(100vh - 260px);
    &, ul {
        padding: 0;
        li {
            margin-bottom: 10px;
            display: flex;
            align-items: center;

            .item-buttons {
                display: flex;
                gap: 10px;
            }
        }
    }

    & > li {
        font-weight: bold;
        background-color: #d0dcea;
        border-radius: 5px;
        padding: 10px;
        margin-top: 10px;
        justify-content: space-between;
    }

    .item-description {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .rule-item-buttons {
        margin-left: auto;
    }

    .rule-priority-input {
        width: 70px;
    }

    .rules-section {
        border-left: 2px solid var(--standard-text-color);
        margin: 20px;
        padding: 20px;
        margin-right: 0;
        padding-right: 0;

        ul {
            margin-top: 10px;
        }
    }

    .rule-item {
        background-color: #e8e8e8;
        padding: 10px;
        border-radius: 5px;
    }

    .edit-rule-form, .edit-category-form, .add-rule-form {
        display: flex;
        gap: 10px;
    }

    .rule-description {
        span {
            font-size: 0.9em;
            color: var(--hover-text-color);
        }
    }
`;