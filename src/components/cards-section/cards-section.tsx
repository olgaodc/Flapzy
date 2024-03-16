import React, { useEffect, useState } from 'react';
import styles from './cardsSection.module.css';
import Card from '../card/card';
import Container from '../container/container';
import Spiner from '../spiner/spiner';
import ErrorImage from '../../assets/opps-error.png';

type PictureProps = {
  farm: string;
  server: string;
  id: string;
  secret: string;
  title: string;
  owner: string;
  ownerName: string;
};

type PicturesProps = PictureProps[];

const Empty = () => {
  return (
    <div className={styles.empty}>
      <img className={styles.emptyImage} src={ErrorImage} alt="No pictures" />
      <div className={styles.emptyText}>Images not found</div>
    </div>
  )
}

const CardsSection = () => {
  const [pictures, setPictures] = useState<PicturesProps>([]);
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [inputText, setInputText] = useState('');

  const defaultTags = 'surreal,art,colorful';

  const nextPage = () => {
    setPage(page + 1);
  }

  useEffect(() => {
    getData(page, inputText || defaultTags);
    // eslint-disable-next-line
  }, [page]);

  const getData = async (page: number, inputText: string) => {
    try {
      const response = await fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.REACT_APP_API_KEY}&tags=${inputText}&page=${page}&per_page=9&format=json&nojsoncallback=1`)
      const data = await response.json();
      const picturesArr = data.photos.photo;

      if (picturesArr) {
        const updatedPictures = await Promise.all(picturesArr.map(async (picture: PictureProps) => {
          const ownerName = await getAuthorName(picture.owner);
          return { ...picture, ownerName };
        }));

        const uniquePictures = updatedPictures.filter(picture => !pictures.some(existingPicture => existingPicture.id === picture.id));

        setPictures((prev) => [...prev, ...uniquePictures]);
        setLoaded(true);
        // console.log(uniquePictures);
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

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setPictures([]);
    setLoaded(false);
    getData(page, inputText)
  }

  const SearchBox = () => {
    return (
      <form className={styles.searchBox} id='searchBox' onSubmit={handleSearch} >
        <input
          type='text'
          name='inputText'
          placeholder='Enter tag, e.g dogs,red'
          autoComplete='off'
          maxLength={30}
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
        />
        <button type='submit'>Search</button>
      </form>
    )
  }

  return (
    <div className={styles.picturesSectionWrapper} id='picturesSection'>
      <Container>
        <h2 className={styles.title}>Explore over <span>2 billion</span> images</h2>
        <SearchBox />
        {loaded ? (
          <div className={styles.picturesSection} id='picturesSection'>
            {pictures.length > 0 ? (
              pictures.map((picture: PictureProps, index) => (
                <Card
                  key={picture.id}
                  id={picture.id}
                  pictureName={picture.title}
                  authorName={picture.ownerName}
                  pictureUrl={`https://live.staticflickr.com/${picture.server}/${picture.id}_${picture.secret}.jpg`}
                  isLast={index === pictures.length - 1}
                  nextPage={nextPage}
                />
              ))
            ) : <Empty />
            }
          </div>
        ) : <Spiner />
        }
      </Container>
    </div>
  )
}

export default CardsSection