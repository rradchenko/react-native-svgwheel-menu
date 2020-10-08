import React, { Component } from 'react';
import { Easing, Animated } from 'react-native';
import {Surface, Group, Rectangle, Shape} from '@react-native-community/art';
import Svg, { Circle, G, Text, Path, Line, Use } from 'react-native-svg';
const Animatee = {
  G: Animated.createAnimatedComponent(G),
  Path: Animated.createAnimatedComponent(Path),
  Text: Animated.createAnimatedComponent(Text),
}

import * as shape from 'd3-shape';
import * as d3 from 'd3';

export default class GeneratePath extends Component {

  constructor(props) {
    super(props);
    this.state= {
      fillColor: new Animated.Value(0),
      scaleX: new Animated.Value(0),
      fullOpacity: false,
      B1: new Animated.Value(0)
    };
    this.animatedValue = new Animated.Value(1);
  }

  componentDidMount() {
    this.executeMe();
  }

  async executeMe () {
    Animated.parallel([
        Animated.timing(this.state.fillColor, {
          toValue: 1,
          duration: 50,
          delay: 50 * this.props.idx,
          easing: Easing.bounce,
          useNativeDriver: true
        }),
        Animated.stagger(0.5, [

          this.timing('B1'),

        ])
        ]).start();
   
  }

  timing(id) {
    return Animated.sequence([
      Animated.timing(
        this.state[id],
        { toValue: 1, duration: 50 + 50 * this.props.idx, useNativeDriver: true }
      ),
      Animated.timing(
        this.state[id],
        { toValue: 0, duration: 50 + 50 * this.props.idx, useNativeDriver: true }
      )
    ])
  }

  pass(data, name, idx) {
      this.props.onPress(data, name, idx);
  }

  longPress(data, name, idx) {
    this.setState({ fullOpacity: true });
    if(this.props.passed) {
      this.props.onLongPress(data, name, idx);
    }
    else{
      // null;
    }
  }

  afterLongPressOut() {
    if(this.props.noChild) {
      null;
    }
    else {
      this.setState({ fullOpacity: false });
      if(this.props.passed) {
        this.props.onPressOut();
      }
      else{
        // null;
      } 
    }
  }

  interp(id, value) {
    return this.state[id].interpolate({
      inputRange: [0, 1],
      outputRange: value,
    })
  }

  render() {
    var { section, idx } = this.props;
    return (
      <Animatee.G
            y={this.interp('B1', [0, -1])}
            x={this.interp('B1', [0, 1])}
            scaleX={this.interp('B1', [1, .85])}
            scaleY={this.interp('B1', [1, .85])}
      >
     <Animatee.Path
             opacity={this.interp('fillColor', [0, 1])}
             onPress= {()=> this.pass(section.data, section.data.itemName, idx)}
             delayLongPress = {500}
             delayPressOut= {this.props.delayPressOut}
             onLongPress= {()=> this.longPress(section.data, section.data.itemName, idx)}
             onPressOut= {()=> this.afterLongPressOut()}
             key={this.props.key}
             d={this.props.path(this.props.section)}
             stroke= 'white'
             strokeWidth={1}>
      </Animatee.Path>
      </Animatee.G>
    );
  }
}