import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { gray, black, white } from '../utils/colors';
import { getAllDecks } from '../api';

export default class DecksList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { decks: [] };
  }

  componentDidMount() {
    this.loadDecks();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.currentScreen === 'DecksList') {
      this.loadDecks();
    }
  }

  loadDecks = () => getAllDecks().then(data => this.setState({ decks: Object.values(data ? data : []) }));

  render() {
    return (
      <FlatList
        style={styles.container}
        data={this.state.decks}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => <Deck key={item.title} {...item} screenProps={{ ...this.props }} />}
      />
    );
  }
}

const Deck = props => (
  <TouchableOpacity
    style={styles.deck}
    onPress={() => props.screenProps.navigation.navigate('DeckDetail', { deckId: props.title })}
  >
    <Text style={styles.deckTitle}>{props.title}</Text>
    <Text style={styles.deckCards}>{props.questions.length} Cards</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  deck: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: gray,
    backgroundColor: white
  },
  deckTitle: {
    fontSize: 20
  },
  deckCards: {
    fontSize: 16,
    color: gray
  }
});
