import React, { Component } from 'react';

class App extends Component {
  render() {
    const Dagobah = withDagobah(PlanetBranch);
    const Planet = withPlanet(PlanetBranch, 1);
    const Planet2 = withPlanet(PlanetBranch, 3);
    const PlanetList = withPlanetList(PlanetListView);
    return (
      <section>
        <h1>HOC!</h1>
        <Dagobah />
        <h2>Planet Component based ID</h2>
        <Planet />
        <Planet2 />
        <h2>Planet List</h2>
        <PlanetList />
      </section>
    );
  }
}

class DataSourceContainer {
  getComments() {}

  addChangeListener() {}

  removeChangeListener() {}
}

const DataSource = new DataSourceContainer();


class CommentList extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}

const Comment = ({ comment }) => (
  <p>{comment.message}</p>
);

class BlogPost extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id),
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id),
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}

const TextBlock = ({ blogPost }) => (
  <p>{ blogPost.title }</p>
);

// -------------------------------------------------------- //
const LoadingView = () => <div>Loading...</div>;
const ErrorView = () => <div>Please try again</div>;
const PlanetView = ({ name, climate, terrain }) => (
  <div>
    <h2>{ name }</h2>
    <div>Climate: { climate }</div>
    <div>Terrain: { terrain }</div>
  </div>
);

const PlanetBranch = ({ loading, planet }) => {
  if (loading) {
    return <LoadingView />;
  } else if (planet) {
    return <PlanetView {...planet} />;
  } else {
    return <ErrorView />;
  }
};

const withDagobah = PlanetViewComponent => 
  class extends Component {
    state = { loading: true };

    componentDidMount() {
      fetch('https://swapi.co/api/planets/5')
        .then(res => res.json())
        .then(
          planet => this.setState({ loading: false, planet }),
          error => this.setState({ loading: false, error }),
        );
    }

    render() {
      return <PlanetViewComponent {...this.state} />;
    }
  };


const withPlanet = (PlanetViewComponent, id) =>
  class extends Component {
    state = { loading: true };

    componentDidMount() {
      fetch(`https://swapi.co/api/planets/${id}`)
        .then(res => res.json())
        .then(
          planet => this.setState({ loading: false, planet }),
          error => this.setState({ loading: false, error }),
        );
    }

    render() {
      return <PlanetViewComponent {...this.state} />
    }
  };

const withPlanetList = PlanetListViewComponent =>
  class extends Component {
    state = { count: 0 };

    componentDidMount() {
      fetch('https://swapi.co/api/planets')
        .then(res => res.json())
        .then(
          planets => this.setState({ count: planets.count }),
          error => this.setState({ count: -1, error }),
        );
    }

    render() {
      console.log(this.state.count);
      return <PlanetListViewComponent {...this.state} />
    }
  };

const PlanetListView = ({ count }) => {
  console.log(`Planet List View Component: count -> ${count}`);
  const planetList = [];
  if (count > 0) {
    for (let id = 1; id <= count; id += 1) {
      const Planet = withPlanet(PlanetBranch, id);
      console.log(Planet);
      planetList.push(Planet);
    }
    console.log(planetList);
    const MyPlanet = planetList[1];
    return (
      <div>
        <MyPlanet />
        {planetList}
      </div>
    );
  } else {
    return <ErrorView />;
  }
};

//---------------------------------------------------------------------------//



export default App;
