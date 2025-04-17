import { useEffect, useState} from 'react';
import './App.css';
import Card from './components/Card/Card';
import { getAllPokemon, getPokemon} from './utils/pokemon.js';
import Navber from './components/Navbar/Navber.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, ButtonGroup } from 'react-bootstrap';

function App() {
  const initialURL = 'https://pokeapi.co/api/v2/pokemon/';
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextURL, setNextURL] = useState('');
  const [prevURL, setPrevURL] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // 画面サイズの変更を検知
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    
    // 初期表示時に実行
    handleResize();
    
    // リサイズイベントのリスナーを追加
    window.addEventListener('resize', handleResize);
    
    // クリーンアップ関数
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchPokemonData = async () => {
      //全てのポケモンデータ取得
      let res = await getAllPokemon(initialURL);
      //各ポケモンの詳細なデータを取得
      loadPokemon(res.results);
      setNextURL(res.next);
      setPrevURL(res.previous);
      setLoading(false);
    };
    fetchPokemonData();
  }, []);

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map(async (pokemon) => {
        let pokemonRecord = await getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  // ページトップに戻る関数
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handlePrevPage = async () => {
    if (!prevURL) return;
    setLoading(true);
    let data = await getAllPokemon(prevURL);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
    // ページトップに戻る
    scrollToTop();
  };

  const handleNextPage = async () => {
    if (!nextURL) return;
    setLoading(true);
    let data = await getAllPokemon(nextURL);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
    // ページトップに戻る
    scrollToTop();
  };

  // スマホサイズ用のレイアウト調整
  const renderPokemonCards = () => {
    if (isMobile) {
      // スマホサイズの場合、20個のポケモンを表示（3列×6行+2列）
      const displayPokemon = pokemonData.slice(0, 20);
      
      // 最初の18個（3列×6行）
      const firstRows = [];
      for (let i = 0; i < 18; i += 3) {
        if (i + 2 < displayPokemon.length) {
          firstRows.push(
            <Row key={`row-${i}`} className="justify-content-center mb-2">
              <Col xs={4} className="d-flex justify-content-center p-1">
                <Card pokemon={displayPokemon[i]} />
              </Col>
              <Col xs={4} className="d-flex justify-content-center p-1">
                <Card pokemon={displayPokemon[i+1]} />
              </Col>
              <Col xs={4} className="d-flex justify-content-center p-1">
                <Card pokemon={displayPokemon[i+2]} />
              </Col>
            </Row>
          );
        }
      }
      
      // 最後の2個（2列）
      let lastRow = null;
      if (displayPokemon.length >= 19) {
        lastRow = (
          <Row key="last-row" className="justify-content-center mb-2">
            <Col xs={6} className="d-flex justify-content-center p-1">
              <Card pokemon={displayPokemon[18]} />
            </Col>
            {displayPokemon.length >= 20 && (
              <Col xs={6} className="d-flex justify-content-center p-1">
                <Card pokemon={displayPokemon[19]} />
              </Col>
            )}
          </Row>
        );
      }
      
      return (
        <>
          {firstRows}
          {lastRow}
        </>
      );
    } else {
      // 通常のレイアウト（デスクトップサイズ）
      return (
        <Row className="justify-content-center">
          {pokemonData.map((pokemon, i) => {
            return (
              <Col key={i} xs={12} sm={6} md={4} className="mb-4 d-flex justify-content-center">
                <Card pokemon={pokemon} />
              </Col>
            );
          })}
        </Row>
      );
    }
  };

  return (
    <>
    <Navber />  
    <div className="App">
      {loading ? (
        <h1>ロード中...</h1>
      ) : (
        <>
        <Container className="pokemonCardContainer">
          {renderPokemonCards()}
        </Container>
        <div className='btn'>
          <ButtonGroup>
            <Button variant="primary" onClick={handlePrevPage} disabled={!prevURL}>前へ</Button>
            <Button variant="primary" onClick={handleNextPage} disabled={!nextURL}>次へ</Button>
          </ButtonGroup>
        </div>
        </>
      )}
    </div>
    </>
  );
}

export default App;
