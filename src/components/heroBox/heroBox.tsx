import React from 'react';
import styles from './heroBox.module.css';
import Container from '../container/container';
import Header from '../header/header';

const HeroBox = () => {
  
  const handleClick = () => {
    let cardsSection = document.getElementById('picturesSection');
    cardsSection?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  return (
    <div className={styles.heroBoxWrapper}>
      <Header />
      <Container>
        <div className={styles.heroBox}>
          <div className={styles.subtitle}>find your</div>
          <h1 className={styles.title}>inspiration</h1>
          <button
            className={styles.heroBtn}
            onClick={handleClick}
          >
            Try for free
          </button>
        </div>
      </Container>
    </div>




  )
}

export default HeroBox