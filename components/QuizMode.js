import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { black, white, green, red, gray, offwhite, lightGrey } from '../utils/colors';
import { setLocalNotification, clearLocalNotification } from '../utils/helpers';

const initialState = {
  correct: 0,
  incorrect: 0,
  currentQuestion: 0,
  questionCardFace: true,
  quizCompleted: false
};

export default class QuizMode extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTintColor: white,
    headerStyle: {
      backgroundColor: black
    },
    title: `Quiz: ${navigation.state.params.deckId}`
  });

  state = { ...initialState };

  componentWillMount() {
    this.animatedValue = new Animated.Value(0);
    this.value = 0;
    this.animatedValue.addListener(({ value }) => {
      this.value = value;
    });
    this.frontInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg']
    });
    this.backInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg']
    });
    this.frontOpacity = this.animatedValue.interpolate({
      inputRange: [89, 90],
      outputRange: [1, 0]
    });

    this.backOpacity = this.animatedValue.interpolate({
      inputRange: [89, 90],
      outputRange: [0, 1]
    });
    // References
    // https://github.com/browniefed/examples/blob/animated_basic/flip/animatedbasic/index.ios.js
    // https://github.com/facebook/react-native/issues/1973#issuecomment-262059217
  }
  flipCard() {
    this.setState(prevState => ({ questionCardFace: !prevState.questionCardFace }));
    return Animated.spring(this.animatedValue, {
      toValue: this.value >= 90 ? 0 : 180,
      friction: 8,
      tension: 10
    }).start();
  }

  onSubmit = answer => {
    Animated.spring(this.animatedValue, {
      toValue: 0
    }).start();
    this.setState(prevState => ({
      ...prevState,
      [answer]: prevState[answer] + 1,
      currentQuestion: prevState.currentQuestion + 1,
      questionCardFace: true,
      quizCompleted: prevState.currentQuestion + 1 === this.props.navigation.state.params.questions.length
    }));
    clearLocalNotification().then(setLocalNotification);
  };

  renderQuizCard() {
    const { questions } = this.props.navigation.state.params;
    const frontAnimatedStyle = {
      transform: [{ rotateY: this.frontInterpolate }]
    };
    const backAnimatedStyle = {
      transform: [{ rotateY: this.backInterpolate }]
    };
    return (
      <View style={styles.container}>
        <Text style={styles.cardNumber}>
          {this.state.currentQuestion + 1} / {questions.length}
        </Text>

        <View>
          <Animated.View style={[styles.flipCard, frontAnimatedStyle, { opacity: this.frontOpacity }]}>
            <Text style={styles.content}>Question: {questions[this.state.currentQuestion].question}</Text>
          </Animated.View>

          <Animated.View
            style={[backAnimatedStyle, styles.flipCard, styles.flipCardBack, { opacity: this.backOpacity }]}
          >
            <Text style={styles.content}>Answer: {questions[this.state.currentQuestion].answer}</Text>
          </Animated.View>
        </View>
        <TouchableOpacity onPress={() => this.flipCard()}>
          <Text style={styles.switchBtn}>
            {this.state.questionCardFace ? 'View Answer' : 'View Question'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.onSubmit('correct')}>
          <Text style={styles.correctBtn}>Correct</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.onSubmit('incorrect')}>
          <Text style={styles.incorrectBtn}>In Correct</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    if (this.state.quizCompleted) {
      const totalQuestions = this.props.navigation.state.params.questions.length;
      const { correct, incorrect } = this.state;
      return (
        <View style={quizResultStyles.container}>
          <Text style={quizResultStyles.heading}>Quiz Completed</Text>
          <Text style={quizResultStyles.incorrect}>
            {incorrect} answer(s) were incorrect.({(incorrect / totalQuestions * 100).toFixed(2)}%)
          </Text>
          <Text style={quizResultStyles.correct}>
            {correct} answer(s) were correct.({(correct / totalQuestions * 100).toFixed(2)}%)
          </Text>
          <Text style={quizResultStyles.total}>{totalQuestions} Total questions.</Text>
          <View style={quizResultStyles.actions}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Text style={quizResultStyles.actionsBtn}>Go Back!</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ ...initialState })}>
              <Text style={quizResultStyles.actionsBtn}>Restart Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return this.renderQuizCard();
    }
  }
}

const quizResultStyles = StyleSheet.create({
  container: {
    backgroundColor: white,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: black
  },
  correct: {
    color: green,
    margin: 10,
    fontWeight: 'bold',
    fontSize: 16
  },
  incorrect: {
    color: red,
    margin: 10,
    fontWeight: 'bold',
    fontSize: 16
  },
  total: {
    fontSize: 12,
    fontWeight: 'bold',
    color: gray
  },
  actions: {
    flexDirection: 'row'
  },
  actionsBtn: {
    backgroundColor: black,
    color: white,
    margin: 10,
    padding: 20,
    borderWidth: 1
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: white
  },
  cardNumber: {
    fontSize: 14,
    color: black,
    alignSelf: 'flex-start'
  },
  flipCard: {
    height: 200,
    width: 200,
    backgroundColor: lightGrey,
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    fontSize: 20,
    color: black,
    fontWeight: 'bold',
    width: 90
  },
  flipCardBack: {
    backgroundColor: offwhite,
    position: 'absolute',
    top: 0
  },
  switchBtn: {
    fontSize: 16,
    color: gray,
    fontWeight: 'bold',
    margin: 5
  },
  correctBtn: {
    backgroundColor: green,
    color: black,
    fontWeight: 'bold',
    padding: 20,
    borderWidth: 1,
    borderColor: black,
    margin: 10
  },
  incorrectBtn: {
    backgroundColor: red,
    color: white,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: black,
    padding: 20,
    margin: 10
  }
});
