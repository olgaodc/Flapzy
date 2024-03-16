import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './card.module.css';

type CardProps = {
  id: string;
  pictureName: string;
  authorName: string;
  pictureUrl: string;
  isLast: boolean;
  nextPage: () => void;
}

type PictureProps = {
  id: string;
  pictureName: string;
  authorName: string;
  pictureUrl: string;
};

const Card: FC<CardProps> = ({
  id,
  pictureName,
  authorName,
  pictureUrl,
  isLast,
  nextPage,
}) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [favourite, setFavourite] = useState(false);
  const [favouritesList, setFavouritesList] = useState<PictureProps[]>([]);

  useEffect(() => {
    const storedFavourites = localStorage.getItem('favouritesList');
    if (storedFavourites) {
      const favourites: PictureProps[] = JSON.parse(storedFavourites);
      const isFavourite = favourites.some(favourite => favourite.id === id);
      setFavourite(isFavourite);
    }
  }, [])

  useEffect(() => {
    if (imageRef.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          const imageUrl = (entry.target as HTMLElement).dataset.src;
          if (imageUrl) {
            setImageUrl(imageUrl);
          }
          observer.unobserve(entry.target);
          if(isLast) {
            nextPage();
          };
        }
      },
        {
          rootMargin: '70%',
        });

      observer.observe(imageRef.current);
    }

  }, [imageRef, isLast]);

  const handleClick = () => {
    setFavourite(!favourite);

    const picture = {
      id: id,
      pictureName: pictureName,
      authorName: authorName,
      pictureUrl: pictureUrl
    };

    if (!favourite) {
      addToFavourites(picture);
    } else {
      removeFromFavourites(picture);
    }
  }

  const addToFavourites = (picture: PictureProps) => {
    let savedFavourites = JSON.parse(localStorage.getItem('favouritesList') || '[]' );
    savedFavourites = Array.isArray(savedFavourites) ? savedFavourites : [];
    const updatedFavourites = [...savedFavourites, picture];
    localStorage.setItem('favouritesList', JSON.stringify(updatedFavourites));
    
    setFavouritesList(updatedFavourites);
    setFavourite(true);
  }

  const removeFromFavourites = (picture: PictureProps) => {
  const existingFavourites = JSON.parse(localStorage.getItem('favouritesList')!);
  const updatedFavourites = existingFavourites.filter((item: PictureProps) => item.id !== picture.id);
  localStorage.setItem('favouritesList', JSON.stringify(updatedFavourites));


  setFavouritesList(updatedFavourites);
  setFavourite(false);
  }

  return (
    <div
      className={styles.card}
      key={id}
    >
      <img
        className={styles.cardImage} 
        loading="lazy"
        src={imageUrl}
        data-src={pictureUrl}
        alt={pictureName}
        ref={imageRef}
      />
      <div className={styles.cardInfo}>
        <div className={styles.pictureName}>{pictureName}</div>
        <div className={styles.line} />
        <div className={styles.authorName}>{authorName}</div>
        <button 
          className={`${styles.cardButton} ${favourite ? styles.favourite : ''}`}
          onClick={handleClick}
        >
          Favourite
        </button>
      </div>
    </div>
  )
}

export default Card