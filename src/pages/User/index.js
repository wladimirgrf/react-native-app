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
  Loading,
} from './styles';

class User extends Component {
  constructor() {
    super().state = {
      stars: [],
      page: 1,
      refreshing: false,
      loading: true,
    };
  }

  async componentDidMount() {
    this.handleLoad();
  }

  handleLoad = async () => {
    const { navigation } = this.props;
    const { stars, page } = this.state;

    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`, {
      params: { page },
    });

    this.setState({
      stars: page >= 2 ? [...stars, ...response.data] : response.data,
      page,
      refreshing: false,
      loading: false,
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

  handleNavigate = uri => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { uri });
  };

  render() {
    const { navigation } = this.props;
    const { stars, refreshing, loading } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {!loading ? (
          <Stars
            data={stars}
            onRefresh={this.handleRefresh}
            refreshing={refreshing}
            onEndReachedThreshold={0}
            onEndReached={this.handleLoadMore}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleNavigate(item.html_url)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        ) : (
          <Loading />
        )}
      </Container>
    );
  }
}

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('user').name,
});

export default User;
