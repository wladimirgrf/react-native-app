import React from 'react';
import PropTypes from 'prop-types';

import { Browser, Loading } from './styles';

function Repository({ navigation }) {
  const uri = navigation.getParam('uri');

  return (
    <Browser
      renderLoading={() => <Loading />}
      startInLoadingState
      source={{ uri }}
    />
  );
}

Repository.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

Repository.navigationOptions = () => ({
  headerBackTitle: '',
});

export default Repository;
