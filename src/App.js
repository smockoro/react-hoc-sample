import React, { Component } from 'react';

class App extends Component {
  render() {
    const Dagobah = withDagobah(PlanetBranch);
    return (
      <section>
        <h1>HOC!</h1>
        <Dagobah />
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
      fetch("https://swapi.co/api/planets/5")
        .then(res => res.json())
        .then(
          planet => this.setState({ loading: false, planet }),
          error => this.setState({ loading: false, error })
        );
    }

    render() {
      return <PlanetViewComponent {...this.state} />;
    }
  }


export default App;
