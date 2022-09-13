import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';



const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [offset, setOffset] = useState(100);
    const [newComicsLoading, setNewComicsLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {getAllComics, loading, error} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewComicsLoading(false) : setNewComicsLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded);
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList < 8) {
            ended = true;
        }

        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setNewComicsLoading(false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended) 
    }

    const renderComicsList = (arr) => {
        const comicsItems = arr.map((item, i) => {
            return (
            <li 
            className="comics__item"
            key={i}>
                <Link to={`/comics/${item.id}`}>
                    <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                    <div className="comics__item-name">{item.title}</div>
                    <div className="comics__item-price">{item.price}</div>
                </Link>
            </li>
            )
        });

        return (
            <ul className="comics__grid">
                {comicsItems}
            </ul>
        )
    }

    const items = renderComicsList(comicsList);

    const spinner = loading && !newComicsLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    return (
        <div className="comics__list">
                {errorMessage}
                {spinner}
                {items}
            <button 
            className="button button__main button__long"
            disabled={newComicsLoading}
            style={{'display': comicsEnded ? 'none' : 'block'}}
            onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;