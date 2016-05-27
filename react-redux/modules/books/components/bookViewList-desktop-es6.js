const Modal = ReactBootstrap.Modal;

import BooksMenuBar from './booklist-menubar/booksMenuBar';
import BookSubjectSetterDesktop from './bookSubjectSetter-desktop';
import SubjectEditModal from './subject-edit/subjectEditModal';
import BootstrapButton from 'root-components/bootstrapButton';
import ManualBookEntry from 'root-components/manualBookEntry';

class BookViewListDesktop extends React.Component{
    constructor(props){
        super();

        this.state = { booksSubjectsModalShown: false, editSubjectsFor: [], subjectsAdding: [], subjectsRemoving: [], editingSubject: null };
    }
    setSort(column){
        let currentSort = this.props.bookSearch.sort;
        let newDirection = 1;
        if (currentSort === column){
            newDirection = this.props.bookSearch.sortDirection == 1 ? -1 : 1;
        }

        this.props.setSortOrder(column, newDirection);
    }
    render(){
        let potentialSortIcon = <i className={'fa fa-angle-' + (this.props.bookSearch.sortDirection == 1 ? 'up' : 'down')}></i>,
            sortIconIf = column => column == this.props.bookSearch.sort ? potentialSortIcon : null;

        return (
            <div style={{ minHeight: 500 }}>
                <BooksMenuBar
                    selectedBooksCount={this.props.books.selectedBooksCount}
                    allSubjects={this.props.subjects.list}
                ></BooksMenuBar>

                { this.props.books.list.length ?
                <div style={{ paddingLeft: 15, paddingRight: 15, paddingBottom: 15 }}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>&nbsp;&nbsp;&nbsp;&nbsp;</th>
                                <th></th>
                                <th><a className="no-underline" onClick={() => this.setSort('title')}>Title {sortIconIf('title')}</a></th>
                                <th>Author</th>
                                <th>Genres</th>
                                <th><a className="no-underline" onClick={() => this.setSort('_id')}>Added {sortIconIf('_id')}</a></th>
                                <th>ISBN</th>
                                <th>Published</th>
                                <th><a className="no-underline" onClick={() => this.setSort('pages')}>Pages {sortIconIf('pages')}</a></th>
                            </tr>
                        </thead>
                        <tbody>
                        { this.props.subjects.loaded ? this.props.books.list.map(book =>
                            <tr key={book._id}>
                                <td>
                                    <input type="checkbox" onClick={() => this.props.toggleSelectBook(book._id)} checked={this.props.books.selectedBooks[book._id]} />
                                </td>
                                <td><img src={book.smallImage} /></td>
                                <td>{book.title}<br /><a onClick={() => this.props.editBook(book)}><i className="fa fa-fw fa-pencil show-on-hover-parent-td"></i></a></td>
                                <td>
                                    <ul className="list-unstyled">
                                        {book.authors.map(author => <li>{author}</li>)}
                                    </ul>
                                </td>
                                <td>
                                    { book.subjectObjects.map(s => <div key={s._id}><span className="label label-default">{s.name}</span></div>) }
                                    <div style={{ marginTop: 5 }}>
                                        <button className="btn btn-default btn-xs" onClick={() => this.props.enableSubjectModificationSingleBook(book._id)}>Modify</button>
                                    </div>
                                </td>
                                <td>{book.dateAddedDisplay}</td>
                                <td>{book.isbn}</td>
                                <td>{book.publisher}{book.publisher ? <br /> : null}{book.publicationDate}</td>
                                <td>{book.pages}</td>
                            </tr>
                        ) : null}
                        </tbody>
                    </table>
                </div>
                : (this.props.loading ?
                <div className="alert alert-warning">
                    No books found
                </div> : null)
                }
                <BookSubjectSetterDesktop subjects={this.props.subjects}></BookSubjectSetterDesktop>
                <SubjectEditModal
                    editSubjectsPacket={this.props.subjects.editSubjectsPacket}
                    subjects={this.props.subjects.list}>
                </SubjectEditModal>


                <ManualBookEntry
                    title={this.props.bookEdit.editingBook ? `Edit ${this.props.bookEdit.editingBook.title}` : ''}
                    dragTitle={this.props.bookEdit.editingBook ? `Click or drag to upload a ${this.props.bookEdit.editingBook.smallImage ? 'new' : ''} cover image` : ''}
                    bookToEdit={this.props.bookEdit.editingBook}
                    isOpen={this.props.bookEdit.isEditing}
                    isSaving={this.props.bookEdit.editingBookSaving}
                    isSaved={this.props.bookEdit.editingBookSaved}
                    saveBook={book => this.props.saveEditingBook(book)}
                    saveMessage={'Saved'}
                    onClosing={this.props.stopEditingBook} />

            </div>
        );
    }
}

export default BookViewListDesktop;