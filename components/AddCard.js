import React from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { black, white } from '../utils/colors';
import { styles } from './AddDeck';
import { addCardToDeck } from '../api';

export default class AddCard extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTintColor: white,
    headerStyle: {
      backgroundColor: black
    },
    title: `Add Card for ${navigation.state.params.deckId}`
  });

  onSubmit = () => {
    const { question, answer } = this.state;
    const { deckId } = this.props.navigation.state.params;
    this.setState({ question: '', answer: '' }, () =>
      addCardToDeck(deckId, { question, answer }).then(() => this.props.navigation.goBack())
    );
  };

  state = {
    question: '',
    answer: ''
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Question"
          onChangeText={text => {
            this.setState({ question: text });
          }}
          value={this.state.question}
          spellCheck={false}
          underlineColorAndroid={black}
        />
        <TextInput
          style={styles.input}
          placeholder="Answer"
          onChangeText={text => {
            this.setState({ answer: text });
          }}
          value={this.state.answer}
          spellCheck={false}
          underlineColorAndroid={black}
        />
        <TouchableOpacity onPress={this.onSubmit}>
          <Text style={styles.submitBtn}>Submit</Text>
        </TouchableOpacity>
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100} />
      </View>
    );
  }
}
