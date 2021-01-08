// installed axios - npm i axios. What does axios do? axios make HTTP requests (calls)
  // import axios
// installed react router - npm i react-router-dom. What does router do? Router generates urls
  // import react-router-dom
  import React from 'react';
  import axios from 'axios';
  import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

  const WINES_URL = 'http://myapi-profstream.herokuapp.com/api/01ec85/wines/'
  const PERSONS_URL = 'http://myapi-profstream.herokuapp.com/api/c65293/persons/'
  const BOOKS_URL = 'http://myapi-profstream.herokuapp.com/api/219765/books/'

  class App extends React.Component {
    constructor(props) {
      super(props);
    }
    
    render() {
      return (
        <Router>
          <div>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/wines">Wines</Link>
              </li>
              <li>
                <Link to="/persons">Persons</Link>
              </li>
              <li>
                <Link to="/books">Books</Link>
              </li>
            </ul>
            <Switch>
              <Route path="/persons">
                <Persons />
              </Route>
              <Route path="/books">
                <Books />
              </Route>
              <Route path="/wines">
                <Wines />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>
      );
    }
  }

  class Home extends React.Component {
    render() {
      return(
        <h1>Welcome to the home component!</h1>
      )
    }
  }

  class Wines extends React.Component {
    constructor(props) {
      super(props);
      this.state = {}
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.selectWine = this.selectWine.bind(this);
      this.editWine = this.editWine.bind(this);
      this.submitEditedWine = this.submitEditedWine.bind(this);
    }

    async getWines() {
      try {
        const res = await axios.get(WINES_URL);
        this.setState({ wines: res.data });
      } catch(e) {
        console.error(e);
      }
    }

    componentDidMount() {
      this.getWines();
    }

    handleChange(e) {
      const { name, value } = e.target;
      // e.target.name
      // e.target.value
      this.setState({ [name]: value })
    }

    async handleSubmit(e) {
      e.preventDefault();
      // this.state.name
      // this.state.year
      // this.state.grapes
      const { name, year, grapes, country, region, description, picture, price } = this.state;
      const wine = { name, year, grapes, country, region, description, picture, price };
      try {
        const res = await axios.post(WINES_URL, wine);
        console.log(res.data);
        const updateRes = await axios.get(WINES_URL);
        this.setState({ wines: updateRes.data });
      } catch(e) {
        console.error(e.message);
      }
    }

    async handleDelete(id) {
      console.log(WINES_URL + id);
      try {
        const res = await axios.delete(WINES_URL + id); // target wine id
        console.log(res.data);
        const updateRes = await axios.get(WINES_URL);
        this.setState({ wines: updateRes.data });
      } catch(e) {
        console.error(e.message);
      }
    }

    selectWine(selectedWine) {
      this.setState({ selectedWine });
      // { selectedWine: selectedWine }
    }

    editWine(e) {
      const { name, value } = e.target;
      this.setState({ ...this.state, selectedWine: { ...this.state.selectedWine, [name]: value } })
    }

    async submitEditedWine(e) {
      e.preventDefault();
      try {
        const editedWine = this.state.selectedWine; // this obj has an id
        console.log(editedWine)
        // to send our patch to url + /:id
        const focusWine = WINES_URL + editedWine.id
        const res = await axios.patch(focusWine, editedWine);
        const resRefresh = await axios.get(WINES_URL);
        this.setState({ wines: resRefresh.data });
      } catch(e) {
        console.error(e);
      }
    }

    render() {
      return (
        <div className="wines">
          <ul>
            {/* render info */}
            {
              this.state.wines && this.state.wines.map(wine => (
                <li key={ wine.id }>
                  { wine.name }: price { wine.price } 
                  <button onClick={ () => this.handleDelete(wine.id) }>Delete wine</button>
                  <button onClick={ () => this.selectWine(wine) }>Edit wine</button>
                </li>
              ))
            }
          </ul>
          <form className="new-wine-form"
            onChange={ this.handleChange }
            onSubmit={ this.handleSubmit }>
            <label>
              Wine name:
              <input type="text" name="name" />
            </label>
            <label>
              Year wine was made:
              <input type="text" name="year" />
            </label>
            <label>
              Grapes used:
              <input type="text" name="grapes" />
            </label>
            <label>
              Country of wine:
              <input type="text" name="country" />
            </label>
            <label>
              Wine region:
              <input type="text" name="region" />
            </label>
            <label>
              Description of wine:
              <input type="text" name="description" />
            </label>
            <label>
              Picture url:
              <input type="text" name="picture" />
            </label>
            <label>
              Price:
              <input type="text" name="price" />
            </label>
            <input type="submit" />
          </form>

          <hr></hr>

          {/* we want to show the form */}
          {/* only after we select a wine */}
          {/* if this.state.selectedWine exists */}
          {/* render this form below */}
          {/* this.state.selectedWine && formBelow */}

          {
            this.state.selectedWine && <form className="wine-edit-form"
              onChange={ this.editWine }
              onSubmit={ this.submitEditedWine }>
              <label>
                Wine name:
                <input type="text" name="name" defaultValue={ this.state.selectedWine.name } />
              </label>
              <label>
                Year wine was made:
                <input type="text" name="year" defaultValue={ this.state.selectedWine.year } />
              </label>
              <label>
                Grapes used:
                <input type="text" name="grapes" defaultValue={ this.state.selectedWine.grapes } />
              </label>
              <label>
                Country of wine:
                <input type="text" name="country" defaultValue={ this.state.selectedWine.country } />
              </label>
              <label>
                Wine region:
                <input type="text" name="region" defaultValue={ this.state.selectedWine.region } />
              </label>
              <label>
                Description of wine:
                <input type="text" name="description" defaultValue={ this.state.selectedWine.description } />
              </label>
              <label>
                Picture url:
                <input type="text" name="picture" defaultValue={ this.state.selectedWine.picture } />
              </label>
              <label>
                Price:
                <input type="text" name="price" defaultValue={ this.state.selectedWine.price } />
              </label>
              <input type="submit" />
            </form>
          }
        </div>
      )
    }
  }


  class Persons extends React.Component {
    constructor(props) {
      super(props);
      this.state = {}
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    async getPersons() {
      try {
        const res = await axios.get(PERSONS_URL);
        this.setState({ persons: res.data });
      } catch(e) {
        console.error(e);
      }
    }
    
    componentDidMount() {
      this.getPersons();
    }

    handleChange(e) {
      const { name, value } = e.target;
      // e.target.name
      // e.target.value
      this.setState({ [name]: value })
    }

    async handleSubmit(e) {
      e.preventDefault();
      // this.state.name
      // this.state.year
      // this.state.grapes
      const { firstname, lastname, email, username } = this.state;
      const persons = { firstname, lastname, email, username };
      try {
        const res = await axios.post(PERSONS_URL, persons);
        console.log(res.data);
        const updateRes = await axios.get(PERSONS_URL);
        this.setState({ persons: updateRes.data });
      } catch(e) {
        console.error(e.message);
      }
    }

    async handleDelete(id) {
      try {
        const res = await axios.delete(PERSONS_URL + id); // target wine id
        console.log(res.data);
        const updateRes = await axios.get(PERSONS_URL);
        this.setState({ persons: updateRes.data });
      } catch(er) {
        console.error(er.message)
      }
    }

    render() {
      return (
        <div className="persons">
          <ul>
            {/* render info */}
            {
              this.state.persons && this.state.persons.map(persons => (
                <li>
                  { persons.firstname } { persons.lastname } <button onClick={ () => this.handleDelete(persons.id) }>Delete person</button>
                </li>
              ))
            }
          </ul>
          <form className="new-persons-form"
            onChange={ this.handleChange }
            onSubmit={ this.handleSubmit }>
            <label>
              First Name:
              <input type="text" name="firstname" />
            </label>
            <label>
              Last Name:
              <input type="text" name="lastname" />
            </label>
            <label>
              Email:
              <input type="text" name="email" />
            </label>
            <label>
              Username:
              <input type="text" name="username" />
            </label>
            <input type="submit" />
          </form>
        </div>
      )
    }
  }


class Books extends React.Component{
  constructor(props) {
    super(props);
    this.state = {}
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async getBooks() {
    try {
      const res = await axios.get(BOOKS_URL);
      this.setState({ books: res.data });
    } catch(e) {
      console.error(e);
    }
  }

  componentDidMount() {
    this.getBooks();
  }

  handleChange(e) {
    const { name, value } = e.target;
    // e.target.name
    // e.target.value
    this.setState({ [name]: value })
  }

  async handleSubmit(e) {
    e.preventDefault();
    // this.state.name
    // this.state.year
    // this.state.grapes
    const { title, author, release_date, image } = this.state;
    const books = { title, author, release_date, image };
    try {
      const res = await axios.post(BOOKS_URL, books);
      console.log(res.data);
      const updateRes = await axios.get(BOOKS_URL);
      this.setState({ books: updateRes.data });
    } catch(e) {
      console.error(e.message);
    }
  }

  async handleDelete(id) {
    try {
      const res = await axios.delete(BOOKS_URL + id); // target wine id
      console.log(res.data);
      const updateRes = await axios.get(BOOKS_URL);
      this.setState({ books: updateRes.data });
    } catch(er) {
      console.error(er.message)
    }
  }

  render() {
    return (
      <div className="books">
        <ul>
          {/* render info */}
          {
            this.state.books && this.state.books.map(books => (
              <li>
                { books.title } { books.author } <button onClick={ () => this.handleDelete(books.id) }>Delete book</button>
              </li>
            ))
          }
        </ul>
        <form className="new-book-form"
          onChange={ this.handleChange }
          onSubmit={ this.handleSubmit }>
          <label>
            Title:
            <input type="text" name="title" />
          </label>
          <label>
            Author:
            <input type="text" name="author" />
          </label>
          <label>
            Release Date:
            <input type="text" name="release_date" />
          </label>
          <label>
            Image:
            <input type="text" name="image" />
          </label>
          <input type="submit" />
        </form>
      </div>
    )
  }
}

  export default App;