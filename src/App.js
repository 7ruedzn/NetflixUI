import React, {useEffect, useState} from 'react';
import Tmdb from './tmdb';
import MovieRow from './components/MovieRow';
import './App.css';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState([]);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(()=>{
    const loadAll = async () => {
      //pegando a lista de todos os filmes;
      let list = await Tmdb.getHomeList();
      setMovieList(list);
      console.log(list);

      //Pegando o Featured

      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      console.log(chosenInfo);
      setFeaturedData(chosenInfo);
    }

    loadAll();
  }, []);


  //Basicamente monitora o scroll da tela. De padrão o Header fica transparente, caso o usuário
  //comece a usar o scroll, o Header fica preto.
  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true);
      }else {
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, []);


  return (
    <div className="page">

      <Header black={blackHeader}/>

      {featuredData && 
      <FeaturedMovie item={featuredData}/>
      }


      <section className='lists'>
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items}    />
        ))}
      </section>
      <footer>
        UIclone by <strong>7ruedzn</strong><br></br>
        Direitos de imagem pertencem a <strong>Netflix</strong><br></br>
        API by <strong>TMDB.org</strong><br></br>
      </footer>

      {movieList.length <= 0 && 
        <div className='loading'>
          <img src='https://media.wired.com/photos/592744d3f3e2356fd800bf00/master/w_2000,c_limit/Netflix_LoadTime.gif' />
        </div>
      }
    </div>
  );
}