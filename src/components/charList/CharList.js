import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService()

    useEffect(() => {
        onRequest();
    }, [])

    const onRequest = (offset) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError)
    }

    const onCharListLoading = () => {
        setNewItemLoading(true);
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setLoading(loading => false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offlset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const onError = () => {
        setError(true);
        setLoading(loading => false);
    }

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    function renderItems(arr) {
        const items =  arr.map((item) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
                    key={item.id}
                    onClick={() => props.onCharSelected(item.id)}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }  

    const item = renderItems(charList)

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? item : null;
    return (
        <div className="char__list">
            <ul className="char__grid">     
                {errorMessage}
                {spinner}
                {content}
            </ul>
             <button
                 className="button button__main button__long"
                 disabled={newItemLoading}
                 style={{'display': charEnded ? 'none' : 'block'}}
                 onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;