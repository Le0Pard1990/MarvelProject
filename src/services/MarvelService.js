import {useEffect} from 'react';
import {useHttp} from '../hooks/http.hook'

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    // ЗДЕСЬ БУДЕТ ВАШ КЛЮЧ, ЭТОТ КЛЮЧ МОЖЕТ НЕ РАБОТАТЬ
    const _apiKey = 'apikey=2e62f02601a7010153d9d073036c5904';
    const _baseCharOffset = 210;
    const _baseComicOffset = 100;

    const getAllCharacters = async (offset = _baseCharOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset = _baseComicOffset) => {
        const response = await request(`${_apiBase}comics?format=comic&limit=9&offset=${offset}&${_apiKey}`);
        return response.data.results.map(_transformComic)
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const _transformComic = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || 'There is no description',
            pageCount: comics.pageCount ? comics.pageCount : 'No information',
            price: comics.prices.price ? comics.prices.price + ' $' : 'Not available',
            language: comics.textObjects.language || 'en-us',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension
        }
    }

    useEffect(() => {
        console.log(getAllComics())
    }, [])
  
    useEffect(() => {
        console.log(getAllCharacters())
    }, [])


    return {loading: loading, error: error, getAllCharacters: getAllCharacters, getCharacter: getCharacter, clearError: clearError, getAllComics: getAllComics}
}

export default useMarvelService;