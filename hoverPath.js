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

export default class HoverPath extends Component {

  constructor(props) {
    super(props);
    this.state= {
      fillColor: new Animated.Value(0),
      scaleX: new Animated.Value(0),
      B1: new Animated.Value(0)
    };
  }

  componentDidMount() {
    this.executeMe();
  }

  executeMe= async()=> {
    Animated.parallel([
        Animated.timing(this.state.fillColor, {
          toValue: 1,
          duration: 50,
          delay: 50 * this.props.idx,
          easing: Easing.bounce,
          useNativeDriver: true
        }),
        Animated.stagger(2, [

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

  interp(id, value) {
    return this.state[id].interpolate({
      inputRange: [0, 1],
      outputRange: value,
    })
  }

  render() {
     const anim = { transform: [{translateX: this.state.scaleX}] }
    return (
      <Animatee.G
            y={this.interp('B1', [0, -3])}
            x={this.interp('B1', [0, 1])}
            scaleX={this.interp('B1', [1, .9])}
      >
      <Animatee.Path
             opacity={this.state.fillColor.interpolate({
                           inputRange: [0, 1],
                           outputRange: [0, 1],
                         })}
             key={this.props.key}
             d={this.props.path(this.props.section)}
             stroke= 'white'
             strokeWidth={1}>
      </Animatee.Path>
      </Animatee.G>
    );
  }
}