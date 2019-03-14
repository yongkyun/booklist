import React, { useState, useReducer } from 'react';
import SearchModal from './searchModal';

import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TagsContext, useTagsState } from 'applicationRoot/tagsState';

const initialState = {
  selectedBooks: [],
  recommendations: [],
  recommendationsSearching: false,
  searchState: {
    tags: [],
    subjects: []
  }
};
function reducer(state, [type, payload]) {
  switch (type) {
    case 'setSearchState':
      return { ...state, searchState: payload };
  }
  return state;
}

export default props => {
  const tagsState = useTagsState();
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const [{ selectedBooks, recommendations, recommendationsSearching, searchState }, dispatch] = useReducer(reducer, initialState);

  const closeModal = () => setSearchModalOpen(false);
  const openModal = () => setSearchModalOpen(true);
  const setBookSearchState = searchState => dispatch(['searchState', searchState]);

  return (
    <TagsContext.Provider value={tagsState}>
      <div>
        <div className="row">
          <div className="col-xs-6">
            <div style={{ marginTop: '5px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Find some books, and get Amazon recommendations based on what's similar</div>
              <button className="btn btn-default" onClick={openModal}>
                <i className="fal fa-search" /> Search your books
              </button>
              {selectedBooks.length ? (
                recommendationsSearching ? (
                  <button disabled={true} className="btn btn-default btn-primary pull-right" onClick={props.findRecommendations}>
                    <i className="fa fa-fw fa-spin fa-spinner" /> Get Recommendations
                  </button>
                ) : (
                  <button className="btn btn-default btn-primary pull-right" onClick={props.findRecommendations}>
                    Get Recommendations
                  </button>
                )
              ) : null}
            </div>
            <br />
            <br />
            <table className="table table-condensed table-striped">
              <TransitionGroup component="tbody">
                {selectedBooks.map(book => (
                  <CSSTransition classNames="fade-transition" timeout={300} key={book._id}>
                    <DisplayBook key={book._id} book={book} />
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </table>
          </div>
          <div className="col-xs-6">
            <div style={{ marginTop: '5px' }}>
              {recommendations && recommendations.length ? (
                <>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Similar books found</div>
                  <table className="table table-condensed table-striped">
                    <tbody>
                      {recommendations.map(book => (
                        <DisplayRecommendation key={book._id} book={book} />
                      ))}
                    </tbody>
                  </table>
                </>
              ) : null}
            </div>
          </div>
        </div>
        <SearchModal isOpen={searchModalOpen} onHide={closeModal} {...{ setBookSearchState, searchState }} />
      </div>
    </TagsContext.Provider>
  );
};

const DisplayBook = props => {
  const removeBook = () => props.removeSelectedBook(props.book);

  const { book } = props;
  return (
    <tr>
      <td>
        <button onClick={removeBook} style={{ cursor: 'pointer' }} className="btn btn-xs btn-danger">
          Remove
        </button>
      </td>
      <td>
        <img crossOrigin="anonymous" src={book.smallImage} />
      </td>
      <td>
        {book.title}
        {book.authors && book.authors.length ? (
          <>
            <br />
            <span style={{ fontStyle: 'italic' }}>{book.authors.join(', ')}</span>
          </>
        ) : null}
      </td>
    </tr>
  );
};

const DisplayRecommendation = props => {
  let { book } = props;
  return (
    <tr>
      <td>
        <img crossOrigin="anonymous" src={book.smallImage} />
      </td>
      <td>
        {book.title}
        {book.authors && book.authors.length ? (
          <>
            <br />
            <span style={{ fontStyle: 'italic' }}>{book.authors.join(', ')}</span>
            <br />
            {book.isbn ? (
              <a
                target="_new"
                className="margin-right grid-hover-filter inline-filter"
                href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`}
              >
                <i className="fab fa-amazon" />
              </a>
            ) : null}
          </>
        ) : null}
      </td>
    </tr>
  );
};
