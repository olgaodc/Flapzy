import React from 'react';
import Container from '../container/container';
import styles from './header.module.css';

const Header = () => {
  return (
    <div className={styles.headerWrapper}>
      <Container>
        <div className={styles.header}>
          <div className={styles.logo}>Flapzy</div>
          <div>Favoutites</div>
        </div>
      </Container>
    </div>
  )
}

export default Header