export default {"1":"mutation deleteBook($_id: String) {\n  deleteBook(_id: $_id)\n}\n","2":"query GetBookDetails($_id: String, $publicUserId: String) {\n  getBook(_id: $_id, publicUserId: $publicUserId) {\n    Book {\n      editorialReviews {\n        source\n        content\n      }\n      similarBooks {\n        title\n        authors\n        smallImage\n        asin\n      }\n    }\n  }\n}\n","3":"query SearchBooks($page: Int, $pageSize: Int, $sort: BookSort, $publicUserId: String, $title_contains: String, $isRead: Boolean, $isRead_ne: Boolean, $subjects_containsAny: [String], $searchChildSubjects: Boolean, $tags_containsAny: [String], $authors_textContains: String, $publisher_contains: String, $subjects_count: Int, $pages_lt: Int, $pages_gt: Int, $ver: String, $cache: Int) {\n  allBooks(PAGE: $page, PAGE_SIZE: $pageSize, SORT: $sort, title_contains: $title_contains, isRead: $isRead, isRead_ne: $isRead_ne, subjects_containsAny: $subjects_containsAny, searchChildSubjects: $searchChildSubjects, tags_containsAny: $tags_containsAny, authors_textContains: $authors_textContains, publisher_contains: $publisher_contains, publicUserId: $publicUserId, subjects_count: $subjects_count, pages_lt: $pages_lt, pages_gt: $pages_gt, ver: $ver, cache: $cache) {\n    Books {\n      _id\n      title\n      isbn\n      ean\n      pages\n      smallImage\n      publicationDate\n      subjects\n      authors\n      publisher\n      tags\n      isRead\n      dateAdded\n    }\n    Meta {\n      count\n    }\n  }\n}\n","4":"query OfflineBookSync($page: Int, $pageSize: Int) {\n  allBooks(PAGE: $page, PAGE_SIZE: $pageSize) {\n    Books {\n      _id\n      title\n      isbn\n      pages\n      smallImage\n      publicationDate\n      subjects\n      authors\n      publisher\n      tags\n      isRead\n      dateAdded\n    }\n  }\n}\n","5":"mutation updateBook($_id: String, $book: BookMutationInput) {\n  updateBook(_id: $_id, Updates: $book) {\n    Book {\n      _id\n      title\n      isbn\n      smallImage\n      pages\n      publisher\n      publicationDate\n      authors\n    }\n  }\n}\n","6":"mutation updateBooksRead($_ids: [String], $updates: BookMutationInput) {\n  updateBooks(_ids: $_ids, Updates: $updates) {\n    success\n  }\n}\n","7":"mutation updateBooksSubjects($books: [String], $add: [String], $remove: [String]) {\n  remove: updateBooks(_ids: $books, Updates: {subjects_PULL: $remove}) {\n    success\n  }\n  add: updateBooks(_ids: $books, Updates: {subjects_ADDTOSET: $add}) {\n    success\n  }\n}\n","8":"mutation updateBooksTags($books: [String], $add: [String], $remove: [String]) {\n  remove: updateBooks(_ids: $books, Updates: {tags_PULL: $remove}) {\n    success\n  }\n  add: updateBooks(_ids: $books, Updates: {tags_ADDTOSET: $add}) {\n    success\n  }\n}\n","9":"query GetPublicUser($_id: String, $cache: Int) {\n  getPublicUser(_id: $_id, cache: $cache) {\n    PublicUser {\n      publicName\n      publicBooksHeader\n    }\n  }\n}\n","10":"query getBooksSubjects($subjectIds: [String], $searchChildSubjects: Boolean) {\n  allBooks(subjects_containsAny: $subjectIds, searchChildSubjects: $searchChildSubjects) {\n    Books {\n      subjects\n    }\n  }\n}\n","11":"query HomeModuleBooks($page: Int, $pageSize: Int, $sort: BookSort, $title: String, $isRead: Boolean, $isRead_ne: Boolean, $subjects: [String], $searchChildSubjects: Boolean, $tags: [String], $ver: String, $cache: Int) {\n  allBooks(PAGE: $page, PAGE_SIZE: $pageSize, SORT: $sort, title_contains: $title, isRead: $isRead, isRead_ne: $isRead_ne, subjects_containsAny: $subjects, searchChildSubjects: $searchChildSubjects, tags_containsAny: $tags, ver: $ver, cache: $cache) {\n    Books {\n      _id\n      title\n      isbn\n      smallImage\n      subjects\n      authors\n      tags\n      isRead\n    }\n    Meta {\n      count\n    }\n  }\n}\n","12":"query labelColors {\n  allLabelColors(SORT: {order: 1}) {\n    LabelColors {\n      _id\n      backgroundColor\n      order\n    }\n  }\n}\n","13":"query ($timestamp: Int) {\n  allBooks(timestamp_lte: $timestamp) {\n    Books {\n      _id\n      title\n      isbn\n      ean\n      pages\n      smallImage\n      publicationDate\n      subjects\n      authors\n      publisher\n      tags\n      isRead\n      dateAdded\n    }\n  }\n  allSubjects(timestamp_lte: $timestamp) {\n    Subjects {\n      _id\n      name\n      backgroundColor\n      textColor\n      path\n    }\n  }\n  allTags(timestamp_lte: $timestamp) {\n    Tags {\n      _id\n      name\n      backgroundColor\n      textColor\n      path\n    }\n  }\n  deletedBooks: allBooksDeleteds(deletedTimestamp_lte: $timestamp) {\n    _ids: BooksDeleteds {\n      _id\n    }\n  }\n  deletedSubjects: allSubjectsDeleteds(deletedTimestamp_lte: $timestamp) {\n    _ids: SubjectsDeleteds {\n      _id\n    }\n  }\n  deletedTags: allTagsDeleteds(deletedTimestamp_lte: $timestamp) {\n    _ids: TagsDeleteds {\n      _id\n    }\n  }\n}\n","14":"mutation createBook($book: BookInput) {\n  createBook(Book: $book) {\n    Book {\n      _id\n    }\n    success\n  }\n}\n","15":"query GetUserPublicSettings {\n  getUser {\n    User {\n      isPublic\n      publicName\n      publicBooksHeader\n    }\n  }\n}\n","16":"mutation updateUser($isPublic: Boolean, $publicBooksHeader: String, $publicName: String) {\n  updateUser(Updates: {isPublic: $isPublic, publicBooksHeader: $publicBooksHeader, publicName: $publicName}) {\n    User {\n      isPublic\n      publicBooksHeader\n      publicName\n    }\n  }\n}\n","17":"query allSubjects($publicUserId: String) {\n  allSubjects(publicUserId: $publicUserId, SORT: {name: 1}) {\n    Subjects {\n      _id\n      name\n      backgroundColor\n      textColor\n      path\n    }\n  }\n}\n","18":"mutation deleteSubject($_id: String) {\n  deleteSubject(_id: $_id)\n}\n","19":"mutation updateSubject($_id: String, $name: String, $backgroundColor: String, $textColor: String, $parentId: String) {\n  updateSubject(_id: $_id, name: $name, backgroundColor: $backgroundColor, textColor: $textColor, parentId: $parentId) {\n    _id\n    name\n    backgroundColor\n    textColor\n    path\n  }\n}\n","20":"mutation createTag($name: String, $backgroundColor: String, $textColor: String) {\n  createTag(Tag: {name: $name, backgroundColor: $backgroundColor, textColor: $textColor}) {\n    Tag {\n      _id\n      name\n      backgroundColor\n      textColor\n    }\n  }\n}\n","21":"mutation deleteTag($_id: String) {\n  deleteTag(_id: $_id)\n}\n","22":"query allTags($publicUserId: String) {\n  allTags(publicUserId: $publicUserId, SORT: {name: 1}) {\n    Tags {\n      _id\n      name\n      backgroundColor\n      textColor\n      path\n    }\n  }\n}\n","23":"mutation updateTag($_id: String, $name: String, $backgroundColor: String, $textColor: String) {\n  updateTag(_id: $_id, Updates: {name: $name, backgroundColor: $backgroundColor, textColor: $textColor}) {\n    Tag {\n      _id\n      name\n      backgroundColor\n      textColor\n    }\n  }\n}\n"}