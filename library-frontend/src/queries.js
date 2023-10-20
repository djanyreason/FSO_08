import { gql } from '@apollo/client';

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`;

export const ALL_BOOKS = gql`
  query {
    allBooks {
      author {
        bookCount
        born
        id
        name
      }
      id
      published
      title
      genres
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      author {
        bookCount
        born
        id
        name
      }
      id
      published
      title
      genres
    }
  }
`;

export const UPDATE_BIRTH = gql`
  mutation updateBirthYear($name: String!, $setBornTo: Int) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      bookCount
      born
      id
      name
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const FIND_USER = gql`
  query {
    me {
      favoriteGenre
      id
      username
    }
  }
`;

export const ALL_GENRES = gql`
  query {
    allBooks {
      genres
    }
  }
`;

export const BOOKS_BY_GENRE = gql`
  query BBG($genre: String) {
    allBooks(genre: $genre) {
      author {
        bookCount
        born
        id
        name
      }
      id
      published
      title
      genres
    }
  }
`;

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      author {
        bookCount
        born
        id
        name
      }
      id
      published
      title
      genres
    }
  }
`;
