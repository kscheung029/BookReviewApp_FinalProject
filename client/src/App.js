import React, { useState } from 'react';
import BookCard from './Books.js';
import './App.css';
import {InputGroup, Input, InputGroupAddon, Button, FormGroup, Label, Spinner} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import axios from 'axios';

function App() {

  //Navbar
  function Navbar() {
    return (
  <nav className="navbar navbar-expand-lg navbar-light bg-dark">
    <img src="book-reader-solid.svg" alt=""/>
    <a className="navbar-brand ml-4 text-white"><h3 >Need Review A Book?</h3></a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ml-auto">
        <li className="nav-item active">
          <a className="nav-link text-white text-uppercase ml-3" href="/#">Home&nbsp;<i class="fas fa-home ml-1"></i><span class="sr-only">(current)</span></a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white text-uppercase ml-4 mr-4" href="/#">Login/Register</a>
        </li>
      </ul>
    </div>
  </nav>
    );
  }

  //header
  const Header = () => {
    return (
      <div className='header d-flex justify-content-center align-items-center flex-column'>
        <div className='filter'></div>
        <h1 className='searchBar text-white mb-3'>Search for Book</h1>
        <div style={{ width: '60%', zIndex: 2 }}>
          <InputGroup size='lg' className='mb-3'>
            <Input
              placeholder='Book Search'
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <Button color='secondary' onClick={handleSubmit}>
              <i className='fas fa-search'></i>
            </Button>
          </InputGroup>
          <div className='d-flex text-white justify-content-center'>
            <FormGroup>
              <Label for='maxResults'>Max Book</Label>
              <Input type='number' id='maxResults'
                placeholder='Max Results'
                value={maxResults}
                onChange={e => setMaxResults(e.target.value)}
              />
            </FormGroup>
            <FormGroup className='ml-5'>
              <Label for='startIndex'>Book Index</Label>
              <Input type='number' id='startIndex'
                placeholder='Start Index'
                value={startIndex}
                onChange={e => setStartIndex(e.target.value)}
              />
            </FormGroup>
          </div>
        </div>
      </div>
    );
  };

  // States
  const [maxResults, setMaxResults] = useState(10);
  const [startIndex, setStartIndex] = useState(1);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);

  // Handle Search
  const handleSubmit = () => {
    setLoading(true);
    if (maxResults > 40 || maxResults < 1) {
      toast.error('max results must be between 1 and 40');
    } else {
      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}&startIndex=${startIndex}`
        )
        .then(res => {
          if (startIndex >= res.data.totalItems || startIndex < 1) {
            toast.error(
              `max reults must be between 1 and ${res.data.totalItems}`
            );
          } else {
            if (res.data.items.length > 0) {
              setCards(res.data.items);
              setLoading(false);
            }
          }
        })
        .catch(err => {
          setLoading(true);
          console.log(err.response);
        });
    }
  };

  const handleCards = () => {
    if (loading) {
      return (
        <div className='d-flex justify-content-center mt-3'>
          <Spinner style={{ width: '3rem', height: '3rem' }} />
        </div>
      );
    } else {
      const items = cards.map((item, i) => {
        let thumbnail = '';
        if (item.volumeInfo.imageLinks) {
          thumbnail = item.volumeInfo.imageLinks.thumbnail;
        }

        return (
          <div className='col-lg-4 mb-3' key={item.id}>
            <BookCard
              thumbnail={thumbnail}
              title={item.volumeInfo.title}
              pageCount={item.volumeInfo.pageCount}
              language={item.volumeInfo.language}
              authors={item.volumeInfo.authors}
              publisher={item.volumeInfo.publisher}
              description={item.volumeInfo.description}
              previewLink={item.volumeInfo.previewLink}
              infoLink={item.volumeInfo.infoLink}
            />
          </div>
        );
      });

      return (
        <div className='container my-5'>
          <div className='row'>{items}</div>
        </div>
      );
    }
  };

  return (
    <div className='w-100 h-100'>
      {Navbar()}
      {Header()}
      {handleCards()}
      <ToastContainer />
    </div>
  );
}

export default App;
