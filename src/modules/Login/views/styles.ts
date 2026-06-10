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
    
            button {
                font-weight: bold;
            }
        }
        
    }
`;

export const LoginForm = styled.form`
`;