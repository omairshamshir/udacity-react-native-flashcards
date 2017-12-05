import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { black, white } from '../utils/colors';
import { getDeck } from '../api';
import { gray } from '../utils/colors';

export default class DeckDetail extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTintColor: white,
    headerStyle: {
      backgroundColor: black
    },
    title: navigation.state.params.deckId
  });

  state = {};

  getDeckDetails = () =>
    getDeck(this.props.navigation.state.params.deckId).then(data => this.setState({ ...data }));

  componentDidMount() {
    this.getDeckDetails();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.currentScreen === 'DeckDetail') {
      this.getDeckDetails();
    }
  }

  renderStartQuizButton(id) {
    if (this.state.questions && this.state.questions.length) {
      return (
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('QuizMode', { ...this.state, deckId: id })}
        >
          <Text style={styles.quizStartBtn}>Start Quiz</Text>
        </TouchableOpacity>
      );
    }
    return null;
  }

  render() {
    const id = this.props.navigation.state.params.deckId;
    return (
      <View style={styles.container}>
        <Text style={styles.deckTitle}>{id}</Text>
        <Text style={styles.cardsCount}>{this.state.questions && this.state.questions.length} Cards</Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('AddCard', { deckId: id })}>
          <Text style={styles.addCardBtn}>Add Card</Text>
        </TouchableOpacity>
        {this.renderStartQuizButton(id)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: white
  },
  deckTitle: {
    fontSize: 20
  },
  cardsCount: {
    fontSize: 16,
    color: gray,
    margin: 5
  },
  addCardBtn: {
    backgroundColor: white,
    color: black,
    fontWeight: 'bold',
    padding: 20,
    borderWidth: 1,
    borderColor: black,
    margin: 10
  },
  quizStartBtn: {
    backgroundColor: black,
    color: white,
    fontWeight: 'bold',
    padding: 20
  }
});
