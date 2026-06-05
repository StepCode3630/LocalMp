<template>
  <footer :class="{ 'light-mode': !isDarkMode, 'dark-mode': isDarkMode }">
    <div class="footer-content">
      <div class="footer-left">
        <p>&copy; 2026 LocalMp</p>
      </div>

      <div class="footer-center">
        <a href="#" class="footer-link">Mentions légales</a>
        <span class="separator">-</span>
        <a href="#" class="footer-link">Politique de confidentialité</a>
      </div>

      <div class="footer-right">
        <button class="contact-btn">Contact</button>
        <a
          href="https://github.com/StepCode3630/LocalMp"
          target="_blank"
          class="github-btn"
          aria-label="GitHub"
        >
          <img src="../assets/github-dark.svg" alt="GitHub" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script></script>

<style scoped>
footer {
  padding: 2rem 1rem;
  margin-top: calc(2rem + 12px);
  transition: all 0.3s ease;
  background-color: var(--color-background-header);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-left {
  font-size: 0.9rem;
  font-weight: 500;
  color: #000;
}

.footer-left p {
  margin: 0;
}

.footer-center {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.footer-link {
  color: #000;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.footer-link:hover {
  opacity: 0.7;
}

.separator {
  margin: 0 0.5rem;
  color: #000;
}

.footer-right {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.contact-btn {
  background: none;
  border: none;
  color: #000;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.contact-btn:hover {
  opacity: 0.7;
}

.github-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  transition: opacity 0.3s ease;
}

.github-btn:hover {
  opacity: 0.7;
}

.github-btn svg {
  width: 24px;
  height: 24px;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1rem;
  }

  .footer-left,
  .footer-center,
  .footer-right {
    text-align: center;
    width: 100%;
  }
}
</style>
