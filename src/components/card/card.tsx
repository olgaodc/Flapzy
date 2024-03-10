import React, { FC } from 'react';
import styles from './card.module.css';

type Props = {
  id: string;
  pictureName: string;
  authorName: string;
  pictureUrl: string;
}

const Card: FC<Props> = ({
  id,
  pictureName,
  authorName,
  pictureUrl,
}) => {
  return (
    <div 
      className={styles.card} 
      key={id}
    >
      <img 
        className={styles.cardImage} 
        loading="lazy"
        src={pictureUrl} 
        alt={pictureName} 
      />
      <div className={styles.cardInfo}>
        <div className={styles.pictureName}>{pictureName}</div> 
        <div className={styles.line} />      
        <div className={styles.authorName}>{authorName}</div>
        <button className={styles.cardButton}>Favourite</button>
      </div>
    </div>
  )
}

export default Card