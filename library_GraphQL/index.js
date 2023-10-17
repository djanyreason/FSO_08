const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { GraphQLError } = require('graphql');

const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');

require('dotenv').config();

const MONGODB_URI = process.env.LIBRARYDB_URI;

console.log('connecting to', MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {};
      if (Object.hasOwn(args, 'author')) {
        const author = await Author.findOne({ name: args.author });
        filter.author = author._id;
      }
      if (Object.hasOwn(args, 'genre')) {
        filter.genres = args.genre;
      }
      return Book.find(filter);
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => context.currentUser
  },
  Book: {
    author: async (root) => Author.findById(root.author)
  },
  Author: {
    bookCount: async (root) =>
      Book.collection.countDocuments({ author: root._id })
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        });
      }

      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError('Creating author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          });
        }
      }

      const book = new Book({ ...args, author });
      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError('Creating book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        });
      }

      return book;
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        });
      }

      const theAuthor = await Author.findOne({ name: args.name });

      if (!args.setBornTo) theAuthor.born = null;
      else theAuthor.born = args.setBornTo;

      try {
        await theAuthor.save();
      } catch (error) {
        throw new GraphQLError('Saving Author failed', {
          extensions: {
            coe: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        });
      }

      return theAuthor;
    },
    createUser: async (root, args) => {
      const user = new User({ ...args });

      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id
      };

      return { value: jwt.sign(userForToken, process.env.SECRET) };
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
