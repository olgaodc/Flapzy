import React from 'react';
import styles from './spiner.module.css';

const Spiner = () => {
  return (
    <div className={styles.spinerWrapper}>
      <div className={styles.spiner}>
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  )
}

export default Spiner