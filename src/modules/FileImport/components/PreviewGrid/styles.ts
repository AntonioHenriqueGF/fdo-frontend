import styled from "styled-components";

export const GridWrapper = styled.table`
    border-collapse: collapse;

    .header-row {
        background-color: #7adaae !important;
    }

    .data-row {
        background-color: #f39199 !important;
    }

    .index-header {
        background-color: #bbbbbb;
        text-align: left;
    }

    th {
        border: 1px solid #ddd;
        padding: 4px;
    }

    td {
        border: 1px solid #ddd;
        padding: 4px;

        &:first-child {
            background-color: #bbbbbb;
        }
    }
`;