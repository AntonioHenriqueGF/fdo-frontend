import styled from 'styled-components';

export const LoginFormWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: grid;
  place-items: center;
  padding: 24px;
  box-sizing: border-box;
  background:
    radial-gradient(
      circle at 12% 15%,
      rgba(36, 91, 143, 0.14),
      transparent 38%
    ),
    radial-gradient(
      circle at 90% 85%,
      rgba(18, 152, 125, 0.16),
      transparent 38%
    ),
    linear-gradient(145deg, #f3f7fb 0%, #e8eff8 55%, #f6f9fd 100%);

  .public-entry-layout {
    width: min(1200px, 100%);
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 24px;
    align-items: stretch;
  }

  .project-showcase {
    position: relative;
    border-radius: 16px;
    padding: 32px;
    color: #153659;
    background: linear-gradient(165deg, #ffffff 0%, #f3f7fd 100%);
    box-shadow: 0 14px 36px rgba(16, 41, 69, 0.14);
    border: 1px solid rgba(36, 91, 143, 0.16);
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow: hidden;
  }

  .project-showcase::after {
    content: '';
    position: absolute;
    right: -60px;
    top: -60px;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(36, 91, 143, 0.12) 0%,
      rgba(36, 91, 143, 0) 70%
    );
    pointer-events: none;
  }

  .project-showcase .eyebrow {
    margin: 0;
    width: fit-content;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #245b8f;
    font-weight: 700;
    background: rgba(36, 91, 143, 0.09);
    padding: 6px 10px;
    border-radius: 999px;
  }

  .project-showcase h1 {
    margin: 0;
    font-size: clamp(1.8rem, 2.5vw, 2.45rem);
    line-height: 1.15;
    color: #0e2a47;
  }

  .project-showcase .lead {
    margin: 0;
    max-width: 64ch;
    color: #2d4a67;
    line-height: 1.6;
  }

  .showcase-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .showcase-card {
    padding: 14px;
    border-radius: 10px;
    border: 1px solid rgba(36, 91, 143, 0.14);
    background: rgba(255, 255, 255, 0.74);
    backdrop-filter: blur(2px);
  }

  .showcase-card h2 {
    margin: 0 0 8px;
    font-size: 0.96rem;
    color: #173757;
  }

  .showcase-card p {
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.45;
    color: #365673;
  }

  .host-note {
    margin: 0;
    padding: 16px;
    border-radius: 12px;
    border: 1px solid rgba(36, 91, 143, 0.16);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.86),
      rgba(242, 248, 255, 0.9)
    );
  }

  .host-note h2 {
    margin: 0 0 8px;
    font-size: 1rem;
    color: #173757;
  }

  .host-note p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.55;
    color: #2f5477;
  }

  .tech-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tech-row span {
    font-size: 0.8rem;
    font-weight: 600;
    color: #103352;
    background: #e6eef7;
    border: 1px solid #d0dfef;
    border-radius: 999px;
    padding: 6px 10px;
  }

  .content-pad {
    padding: 2rem;
    margin: 0;
    font-family: var(--standard-font-family);
    border-radius: 16px;
    box-shadow: 0 14px 36px rgba(16, 41, 69, 0.14);

    & > form {
      display: flex;
      gap: 1.35rem;
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
        text-underline-offset: 2px;
        text-align: left;
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

  @media (max-width: 1060px) {
    .public-entry-layout {
      grid-template-columns: 1fr;
    }

    .showcase-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    padding: 12px;

    .project-showcase {
      padding: 20px;
    }

    .content-pad {
      padding: 1.25rem;
    }
  }
`;
