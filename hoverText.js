import React, { Component } from 'react';
import { Platform, StyleSheet, View, Easing, ImageBackground, Animated, BackHandler } from 'react-native';
import {Surface, Group, Rectangle, Shape} from '@react-native-community/art';
import Svg, { Circle, G, Text, Path, Line, Use, Image } from 'react-native-svg';
const Animatee = {
  G: Animated.createAnimatedComponent(G),
  Path: Animated.createAnimatedComponent(Path),
  Text: Animated.createAnimatedComponent(Text),
}

import * as shape from 'd3-shape';
import * as d3 from 'd3';


export default class HoverText extends Component {

  constructor(props) {
    super(props);
    this.state= {
      fillColor: new Animated.Value(0),
      scaleX: new Animated.Value(0)
    };
  }

  componentWillMount() {
    this.executeMe();
  }

  executeMe() {
    Animated.parallel([
        Animated.timing(this.state.fillColor, {
          toValue: 1,
          duration: 50,
          delay: 50 * this.props.idx,
          useNativeDriver: true
        }),
        Animated.sequence([
          Animated.timing(this.state.scaleX, {
          toValue: 1,
          duration: 50,
          delay: 50 * this.props.idx,
          useNativeDriver: true
        })
        ])
        ]).start();
  }

  truncate(string) {
    if(this.props.semi) {
      if(this.props.hover) {
        if (string.length >= 4) return string.substring(0, 3) + '...';
          else return string;  
        }
      else {
        if (string.length >= 7) return string.substring(0, 5) + '...';
          else return string;  
        }
      }

    else {
      if(this.props.hover) {
        if (string.length >= 6) return string.substring(0, 5) + '...';
          else return string;
        }
      else {
        if (string.length > 10) return string.substring(0, 9) + '...';
          else return string;
      }
      }
  }

  render() {
     const anim = { transform: [{translateX: this.state.scaleX}] }
    return (
      <Animatee.G>

      <Animatee.Text
            opacity={this.state.fillColor.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        })}
          fontSize="8"
          fill= {this.props.textColor}
          x={this.props.path.centroid(this.props.section)[0]}
          y={this.props.path.centroid(this.props.section)[1] + 10}
          textAnchor="middle">
          {this.truncate(this.props.section.data.itemName)}
      <Image 
        height={20} 
        width={20} 
        x={this.props.path.centroid(this.props.section)[0] - 10}
        y={this.props.path.centroid(this.props.section)[1] - 18}
        href={{ uri: this.props.section.data.icon }}/>
        </Animatee.Text>
      </Animatee.G>
    );
  }
}