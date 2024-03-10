import React, { useEffect, useState } from 'react';
import styles from './cardsSection.module.css';
import Card from '../card/card';
import Container from '../container/container';

type PictureProps = {
  farm: string;
  server: string;
  id: string;
  secret: string;
  title: string;
  owner: string;
  ownerName: string;
};

type PicturesProps = Array<PictureProps> | null;

const CardsSection = () => {
  const [pictures, setPictures] = useState<PicturesProps>();

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const getData = async () => {
    try {
      const response = await fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.REACT_APP_API_KEY}&tags=surreal&per_page=20&format=json&nojsoncallback=1`)
      const data = await response.json();
      const picturesArr = data.photos.photo;

      if (picturesArr) {
        const updatedPictures = await Promise.all(picturesArr.map(async (picture: PictureProps) => {
          const ownerName = await getAuthorName(picture.owner);
          return { ...picture, ownerName };
        }));
        setPictures(updatedPictures);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const getAuthorName = async (nsid: string) => {
    try {
      const response = await fetch(`https://api.flickr.com/services/rest/?method=flickr.people.getInfo&api_key=${process.env.REACT_APP_API_KEY}&user_id=${nsid}&format=json&nojsoncallback=1`);
      const data = await response.json();
      const ownerName = data.person.realname;

      if (ownerName) {
        return ownerName._content;
      } else {
        return 'Unknown author';
      }
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div className={styles.picturesSectionWrapper}>
      <Container>
        <div className={styles.picturesSection}>
          {pictures && pictures.map((picture: PictureProps) => (
            <Card
              key={picture.id}
              id={picture.id}
              pictureName={picture.title}
              authorName={picture.ownerName}
              pictureUrl={`https://live.staticflickr.com/${picture.server}/${picture.id}_${picture.secret}.jpg`}
            />
          ))}
        </div>
      </Container>
    </div>
  )
}

export default CardsSection