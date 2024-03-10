import React from 'react';
import styles from './container.module.css';

type ContainerProps = {
  children: React.ReactNode;
}

const Container = (props: ContainerProps) => {
  return (
    <div className={styles.container} {...props} />
  )
}

export default Container