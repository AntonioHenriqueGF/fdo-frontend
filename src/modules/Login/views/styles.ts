import styled from 'styled-components';

export const LoginFormWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;
    background-color: var(--background-color);

    .content-pad {
        padding: 2rem;
        background-color: #fff;
        width: 100%;
        max-width: 400px;
        margin: 20px;
        font-family: var(--standard-font-family);
        
        & > form {
            display: flex;
            gap: 2rem;
            flex-direction: column;

            h1 {
                color: var(--standard-text-color);
                margin: 0;
            }

            .mode-switch-link {
                background: none;
                border: none;
                color: var(--standard-text-color);
                cursor: pointer;
                font-size: 0.875rem;
                padding: 0;
                text-decoration: underline;
            }

            .mode-switch-link:disabled {
                cursor: not-allowed;
                opacity: 0.6;
            }
    
            button {
                font-weight: bold;
            }
        }
        
    }
`;