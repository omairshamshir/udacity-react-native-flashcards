import React from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { white, gray, black } from '../utils/colors';
import { saveDeckTitle } from '../api';

export default class AddDeck extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: '' };
  }

  onSubmit = () => {
    const title = this.state.title;
    this.setState({ title: '' }, () =>
      saveDeckTitle(title).then(() => {
        this.props.navigation.goBack();
        this.props.navigation.navigate('DeckDetail', { deckId: title });
      })
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>What is the title of your new deck?</Text>
        <TextInput
          style={styles.input}
          placeholder="Deck Title"
          onChangeText={text => {
            this.setState({ title: text });
          }}
          value={this.state.title}
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

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: white
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    width: '60%',
    textAlign: 'center',
    marginBottom: 20
  },
  submitBtn: {
    backgroundColor: black,
    color: white,
    fontWeight: 'bold',
    padding: 20
  },
  input: {
    padding: 10,
    margin: 10,
    backgroundColor: white,
    color: black,
    width: '80%'
  }
});
