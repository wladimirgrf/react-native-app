import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from '../../services/api';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

class User extends Component {
  constructor() {
    super().state = {
      stars: [],
      page: 1,
      refreshing: false,
    };
  }

  async componentDidMount() {
    this.handleLoad();
  }

  handleLoad = async () => {
    const { navigation } = this.props;
    const { stars, page } = this.state;

    console.tron.log(`page:${page}`);

    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`, {
      params: { page },
    });

    this.setState({
      stars: page >= 2 ? [...stars, ...response.data] : response.data,
      page,
      refreshing: false,
    });
  };

  handleLoadMore = () => {
    this.setState(
      state => ({
        page: state.page + 1,
      }),
      this.handleLoad
    );
  };

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true,
        stars: [],
      },
      this.handleLoad
    );
  };

  render() {
    const { navigation } = this.props;
    const { stars, refreshing } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        <Stars
          data={stars}
          onRefresh={this.handleRefresh}
          refreshing={refreshing}
          onEndReachedThreshold={0}
          onEndReached={this.handleLoadMore}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <Starred>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />
      </Container>
    );
  }
}

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('user').name,
});

export default User;
