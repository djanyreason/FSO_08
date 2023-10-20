const { GraphQLError } = require('graphql');
const { PubSub } = require('graphql-subscriptions');
const jwt = require('jsonwebtoken');
const Author = require('../models/author');
const Book = require('../models/book');
const User = require('../models/user');

const pubsub = new PubSub();

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
    me: (root, args, context) => {
      return context.currentUser;
    }
  },
  Book: {
    author: async (root) => Author.findById(root.author)
  },
  Author: {
    bookCount: async (root) => {
      if (!root.bookCount) {
        const count = await Book.collection.countDocuments({
          author: root._id
        });
        const theAuthor = await Author.findById(root._id);
        theAuthor.bookCount = count;
        try {
          await theAuthor.save();
        } catch (error) {
          throw new GraphQLError('Saving Author failed', {
            extensions: {
              code: 'SERVER_ERROR'
            }
          });
        }
        return count;
      } else return root.bookCount;
    }
    //      Book.collection.countDocuments({ author: root._id })
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

      const author = await Author.findOne({ name: args.author });
      if (!author) {
        const newAuthor = new Author({ name: args.author, bookCount: 1 });
        try {
          await newAuthor.save();
        } catch (error) {
          throw new GraphQLError('Creating author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          });
        }

        const book = new Book({ ...args, newAuthor });

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

        pubsub.publish('BOOK_ADDED', { bookAdded: book });

        return book;
      } else {
        if (author.bookCount) {
          try {
            author.bookCount += 1;
            await author.save();
          } catch (error) {
            throw new GraphQLError('Updating Author book count failed', {
              extensions: {
                code: 'FAILED_UPDATE',
                invalidArgs: author.name,
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

        pubsub.publish('BOOK_ADDED', { bookAdded: book });

        return book;
      }
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
      if (!theAuthor) {
        throw new GraphQLError('Invalid Author Name', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        });
      }

      if (!args.setBornTo) theAuthor.born = null;
      else theAuthor.born = args.setBornTo;

      try {
        await theAuthor.save();
      } catch (error) {
        throw new GraphQLError('Saving Author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        });
      }

      return theAuthor;
    },
    auditAuthorBookCount: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        });
      }

      const theAuthor = await Author.findOne({ name: args.name });
      if (!theAuthor) {
        throw new GraphQLError('Invalid Author Name', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        });
      }

      const bookCount = await Book.collection.countDocuments({
        author: theAuthor._id
      });

      try {
        theAuthor.bookCount = bookCount;
        await theAuthor.save();
      } catch (error) {
        throw new GraphQLError('Saving Author failed', {
          extensions: {
            code: 'UPDATE_FAILED',
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
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
};

module.exports = resolvers;
