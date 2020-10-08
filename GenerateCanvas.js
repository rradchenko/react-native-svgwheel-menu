import React, { Component } from 'react';
import { Platform, StyleSheet, View, TouchableWithoutFeedback, TouchableNativeFeedback, Animated, Easing, ImageBackground, BackHandler, Dimensions, Alert } from 'react-native';
import {Surface, Group, Rectangle, Shape} from '@react-native-community/art';
import { Text as Textual } from 'react-native';
import Svg, { Circle, G, Text, Path, Line, Use } from 'react-native-svg';
import { Container, Content, StyleProvider, Header, Icon, Toast } from 'native-base';
const Animatee = {
  G: Animated.createAnimatedComponent(G),
  Path: Animated.createAnimatedComponent(Path),
  Text: Animated.createAnimatedComponent(Text)
}
import Entypo from 'react-native-vector-icons/Entypo';
import GenerateArcText from './GenerateText';
import GeneratePath from './GeneratePath';
import HoverPath from './hoverPath';
import HoverText from './hoverText';

const width = 320;
const height = 320;

const pieWidth = 150;


import * as shape from 'd3-shape';
import * as d3 from 'd3';


var devheight = Dimensions.get('window').height;
class GenerateCanvas extends Component {
  constructor() {
    super();
    this.state = {
      parentAngles: [],
      colorBoolean: false,
      backup: [],
      helperColor: [],
      childAngles: [],
      colorStack: [],
      level2ChildAngles: [],
      hoverAngles: [],
      nameOfChild: '',
      nameOfChildLevel2: '',
      depth: 0,
      vulnerable: false,
      update: false,
      currentIndex: -1,
      abortAnimation: false,
      semiCircle: false,
      noChild: false,
      useNativeDriver: true
    };
    this.onParentClick = this.onParentClick.bind(this);
    this.illusionView = this.illusionView.bind(this);
    this.clickOnChildItem = this.clickOnChildItem.bind(this);
    this.eliminateIllusion = this.eliminateIllusion.bind(this);
    this.oR = 80;
    this.iR = 30;
    this.path = d3.arc().outerRadius(this.oR).padAngle(0).innerRadius(this.iR).cornerRadius(0);
    this.path2 = d3.arc().outerRadius(84).padAngle(0).innerRadius(44).cornerRadius(0);
    this.arc = d3.arc();
  }

  componentWillMount() {
    const tempArray = [];
    this.props.userPurchases.map((item) => {
      if (item.parent === '0.0') {
        tempArray.push(item);
      }
    });

    const sectionAngles = d3.pie().value((d) => d.price)(tempArray);
    if(sectionAngles.length == 1) {
      this.setState({ vulnerable: true });
      sectionAngles.startAngle = 0
      sectionAngles.endAngle = Math.PI * 2
    }
    this.setState({ parentAngles: sectionAngles });
  }

  clickOnChildTitle() {
    var tempArray = [];
    tempArray = Object.assign(this.state.backup)
    this.setState({ update: !this.state.update });
    this.setState({ parentAngles: tempArray, abortAnimation: false });
    this.setState({ childAngles: [] });
  }

  clickOnLevel2ChildTitle() {
    const tempArray = [];
    this.setState({ update: !this.state.update, abortAnimation: false });
    this.setState({ level2ChildAngles: [], depth: 2});
  }

  clickOnChildItem(data, name, idx) {
    var depth = this.state.depth
    if(depth === this.props.depth) {
      return this.props.clickEvent(data, name);
    }

  else {
    this.setState({ nameOfChildLevel2: name});
    const tempArray = [];
    this.props.userPurchases.map((item) => {
      if (item.parent === data.id) {
        tempArray.push(item);
      }
    });

    if(tempArray.length>0) {
      this.setState({ depth: 3 });
    }
    this.pushMeToStackLevel2(data, tempArray.length, idx);
    const sectionAngles = d3.pie().value((d) => d.price)(tempArray);
    this.setState({ level2ChildAngles: sectionAngles });
    if(this.props.semiCircle) {
      var newOne = this.halfCircleHelper(sectionAngles);
      this.setState({ level2ChildAngles: newOne });
    }
  }
  }

  onSecondParentClick(data, name) {
    this.setState({ nameOfChildLevel2: name });
    const tempArray = [];
    this.props.userPurchases.map((item) => {
      if (item.parent === data.id) {
        tempArray.push(item);
      }
    });

    const sectionAngles = d3.pie().value((d) => d.price)(tempArray);
    if(sectionAngles.length == 1) {
      this.setState({ vulnerable: true });
      sectionAngles.startAngle = 0;
      sectionAngles.endAngle = Math.PI * 2;
    }
    this.setState({ level2ChildAngles: sectionAngles });
  }

  returnColorBrightness(rgbcode) {
    var r = parseInt(rgbcode.slice(1, 3), 16),
        g = parseInt(rgbcode.slice(3, 5), 16),
        b = parseInt(rgbcode.slice(5, 7), 16),
        HSL = this.rgbToHsl(r, g, b),
        RGB;
        return (HSL[2] * 100);
  }

  colorLuminance(rgbcode, brightness) {
     var r = parseInt(rgbcode.slice(1, 3), 16),
        g = parseInt(rgbcode.slice(3, 5), 16),
        b = parseInt(rgbcode.slice(5, 7), 16),
        HSL = this.rgbToHsl(r, g, b),
        RGB;
        
      RGB = this.hslToRgb(HSL[0], HSL[1], brightness / 100);
      rgbcode = '#'
          + this.convertToTwoDigitHexCodeFromDecimal(RGB[0])
          + this.convertToTwoDigitHexCodeFromDecimal(RGB[1])
          + this.convertToTwoDigitHexCodeFromDecimal(RGB[2]);
    
      return rgbcode;
  }

  convertToTwoDigitHexCodeFromDecimal(decimal){
    var code = Math.round(decimal).toString(16);
    
    (code.length > 1) || (code = '0' + code);
    return code;
  }

  rgbToHsl(r, g, b){
      r /= 255, g /= 255, b /= 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;

      if(max == min){
          h = s = 0;
      }else{
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch(max){
              case r: h = (g - b) / d + (g < b ? 6 : 0); break;
              case g: h = (b - r) / d + 2; break;
              case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
      }

      return [h, s, l];
  }

  hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l;
    }else{
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = this.hue2rgb(p, q, h + 1/3);
        g = this.hue2rgb(p, q, h);
        b = this.hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
  }

  hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
  }

  halfCircleHelper (incoming) {
    var hex
    var newOne = []
    var len = incoming.length;
    incoming.map((item, idx)=> {
      hex = Object.assign(item)
        if(hex.startAngle === 0) {
          hex.startAngle = Math.PI + (Math.PI / 2)
          hex.endAngle = hex.startAngle + (hex.endAngle/2)
        }
        else {
          hex.startAngle = newOne[idx-1].endAngle
          hex.endAngle = hex.startAngle + Math.PI/len
          if(newOne[idx-1].endAngle >= (Math.PI*2)) {
            hex.startAngle = newOne[idx-1].endAngle - Math.PI*2
            hex.endAngle = hex.startAngle + Math.PI/len
          }
        }
    newOne.push(hex)
    });
    return newOne;
  }

  componentDidMount() {

    this.handleAndroidBackButton(this.exitAlert)

    if(this.props.semiCircle === true) {
      const newOne = this.halfCircleHelper(this.state.parentAngles);
      this.setState({parentAngles: newOne})
    }

    let point = this.state.parentAngles.length;
    let pointer = this.props.pieColorArray.length;
    if(point > pointer) {
      let _l = point - pointer
      this.setState({
        colorBoolean: true
      });
      const helperColor = []
      for(i=0;i<_l;i++) {
        helperColor.push(this.props.pieColorArray[0])
      }
      for(i=0;i<pointer;i++) {
        helperColor.push(this.props.pieColorArray[i])
      }
      helperColor.concat(this.props.pieColorArray)
      this.setState({
        helperColor: helperColor
      });
    }
  }

  onParentClick(data, name, idx) {
   /* var a = [];
    a = Object.assign(this.state.parentAngles)
    this.setState({ backup: a });
    this.setState({ nameOfChild: name, depth: 2});
    const tempArray = [];
    this.props.userPurchases.map((item) => {
      if (item.parent === data.id) {
        tempArray.push(item);
      }
    });

    if(tempArray.length === 0) {
      this.setState({ hoverAngles: [],
                      noChild: true });
    }

    if(tempArray.length > 0) {
      this.setState({ noChild: false });      
      this.pushMeToStack(data, tempArray.length, idx);

      const sectionAngles = d3.pie().value((d) => d.price)(tempArray);
      if(sectionAngles.length == 1) {
        this.setState({ vulnerable: true });
        sectionAngles.startAngle = 0;
        sectionAngles.endAngle = Math.PI * 2;
      }
      if(this.props.semiCircle === true) {
        const newOne = this.halfCircleHelper(sectionAngles);
        this.setState({ childAngles: newOne });
      }
      else {
        this.setState({ childAngles: sectionAngles });
      }
    }*/
    return this.props.onClickEvent(data, name); 

  }

  pushMeToStackLevel2(getter, trackerLength, idx) {
    let len = getter.length;
    let myColors = '';
    var finCol = [];
  
    myColors = this.state.colorStack[idx];
    finCol.push(myColors);
    const brgns = Math.floor(this.returnColorBrightness(finCol[0]));

    const z = [];
    for (i = 0, temp = brgns; i <= trackerLength; i++ , temp = temp + 5) {
      z.push(temp);
    }
    var res;

    for (i=0;i<z.length;i++) {
      res = this.colorLuminance(myColors, z[i]);
      finCol.push(res);
    }
    for(i=0;i<finCol.length;i++) {
      if(finCol[i] === '#ffffff' && finCol[i-1] != '#ffffff')
      finCol[i] = finCol[i-1]
    }
    this.setState({ colorStack2: finCol });
  }

  pushMeToStack(getter, trackerLength, idx) {
    let len = getter.length;
    let myColors = '';
    var finCol = [];
  
    if(this.state.colorBoolean) {
      myColors = this.state.helperColor[idx];
      finCol.push(this.state.helperColor[idx]);
    }
    else { 
      myColors = this.props.pieColorArray[idx];
      finCol.push(this.props.pieColorArray[idx]);
    }
    const brgns = Math.floor(this.returnColorBrightness(finCol[0]));

    const z = [];
    for (i = 0, temp = brgns; i <= trackerLength; i++ , temp = temp + 6) {
      z.push(temp);
    }
    var res;

    for (i=0;i<z.length;i++) {
      res = this.colorLuminance(myColors, z[i]);
      finCol.push(res);
    }
    for(i=0;i<finCol.length;i++) {
      if(finCol[i] === '#ffffff' && finCol[i-1] != '#ffffff' || finCol[i] === '#000000' && finCol[i-1] != '#000000')
      finCol[i] = finCol[i-1]
    }
    finCol.push(finCol[finCol.length - 1 ])
    this.setState({ colorStack: finCol });
  }

  truncate(string) {
    if (string.length > 12) return string.substring(0, 8) + '...';
    else return string;
  }


  illusionView(data, name, idx) {
    this.setState({ nameOfChild: name, depth: 2, noChild: false});
    const tempArray = [];
    this.props.userPurchases.map((item) => {
      if (item.parent === data.id) {
        tempArray.push(item);
      }
    });

    this.setState({ idx: idx });

    if(tempArray.length > 0) {
      this.iR = 14
      this.oR = 44
      this.path = d3.arc().outerRadius(this.oR).padAngle(0).innerRadius(this.iR);
      this.setState({ abortAnimation: true });
      this.setState({ currentIndex: idx });
    }

    this.pushMeToStack(data, tempArray.length, idx);
    const sectionAngles = d3.pie().value((d) => d.price)(tempArray);
    if(sectionAngles.length == 1) {
      this.setState({ vulnerable: true });
      sectionAngles.startAngle = 0;
      sectionAngles.endAngle = Math.PI * 2;
    }

    else {

    var parentAngles = []
    parentAngles = Object.assign(this.state.parentAngles)
    this.setState({ backup: parentAngles})
    this.setState({ hoverAngles: sectionAngles });
    if(this.props.semiCircle) {
      var el;
      el = this.halfCircleHelper(sectionAngles);
      this.setState({ hoverAngles: el });
      }
    }
    this.iR= 30
    this.oR= 80
    this.path = d3.arc().outerRadius(this.oR).padAngle(0).innerRadius(this.iR);
    setTimeout(() => {
      return this.props.onClickEvent(data, name); 
    }, 300)
  }

  callAnytime(data) {
    var tempArray = []
    this.props.userPurchases.map((item) => {
      if (item.parent === data.id) {
        tempArray.push(item);
      }
    });
    if(tempArray.length ===0 ) return false;
    else return true;
  }

  eliminateIllusion(data, name, idx) {
   /* var a= []
    this.setState({ currentIndex: -1 });

    if(arguments.length === 0) {
        a = Object.assign(this.state.backup)
        this.setState({ parentAngles: a, abortAnimation: false });
        this.setState({ nameOfChild: 'Home' });
    }
    else {
      this.setState({ depth: 2 });
      this.clickOnChildItem(data, name, idx);
    }

    return this.props.clickEvent(data, name); */
  }

  exitAlert(){
    Alert.alert(
      'Confirm Exit',
      'Exit ORS',
      [
        {text: 'Cancel', onPress: () => BackHandler.removeEventListener()},
        {text: 'OK', onPress: () => BackHandler.exitApp()},
      ],
      { cancelable: true }
    )
  }

  handleAndroidBackButton(callback){
    BackHandler.addEventListener('hardwareBackPress', () => {
      callback();
      return true;
    });
  }

  removeAndroidBackButtonHandler(){
    BackHandler.removeEventListener('hardwareBackPress', () => {});
  }

  callToHighlightPathSectorOnHover(idx) {
    if(this.state.currentIndex === idx) {
      return 1
    }
    else {
      if(this.state.abortAnimation && !this.state.noChild) {
        return 0.4
      }
      else {
        return 1
      }
    }
  }

  render() {
    if(this.state.childAngles.length == 0 && this.state.level2ChildAngles.length == 0) {
      return(
          <View style= {this.props.semiCircle ? styles.semiMainView : styles.mainView}>
            <Svg viewBox="-100 -100 200 200" width={width} height={height}>
          <G width={width / 2} height={height / 2}>
            <Circle cx="0" cy="0" r={this.state.abortAnimation && !this.state.noChild ? "14" : "30"} fill="#eedfcc"
              
             />
            <Text fontSize="8" x={0} y={this.props.semiCircle?-4:4} textAnchor="middle" >
              {this.props.homeTitle}
            </Text>
            {this.state.parentAngles.map((section, idx) => (
               <TouchableNativeFeedback
              >
              <G
              opacity= {this.callToHighlightPathSectorOnHover(idx)}
              fill= {this.state.colorBoolean ? this.state.helperColor[idx] : this.props.pieColorArray[idx]}
              >

              <GeneratePath
              
              onPress= {this.onParentClick}
              onLongPress= {this.illusionView}
              onPressOut= {this.eliminateIllusion}
              delayLongPress = {500}
              delayPressOut = {this.props.holdHoverLayer}
              passed= {true}
              noChild= {this.state.noChild}
              currentIndex= {this.state.currentIndex}
              idx= {idx}
              abort= {this.state.abortAnimation}
              section= {section}
              path={this.path}
              key= {idx}
              d= {this.path(section)}
              />

              <GenerateArcText 
              textColor= {this.props.textColor}
              noChild= {this.state.noChild}
              section= {section}
              idx= {idx}
              passed= {this.state.abortAnimation ? true : false}
              path={this.path}
              semi= {this.props.semiCircle}
              />
            </G>
            </TouchableNativeFeedback>
              
          ))}

          {this.state.abortAnimation ? (this.state.hoverAngles.map((section, idx) => (
                         <TouchableWithoutFeedback
                          onPress= {()=> this.eliminateIllusion(section.data, section.data.itemName, idx)}
                         >
                        <Animatee.G
                        fill= {this.state.colorStack[this.state.currentIndex]}
                        >
          
                        <HoverPath
                        idx= {idx}
                        section= {section}
                        path={this.path2}
                        key= {idx}
                        d= {this.path2(section)}
                        />
          
                        <HoverText 
                        section= {section}
                        idx= {idx}
                        textColor= {this.props.textColor}
                        hover= {true}
                        path={this.path2}
                        semi= {this.props.semiCircle}
                        />
                      </Animatee.G>
                      </TouchableWithoutFeedback>
                        
                    ))) : null}
        </G>
    </Svg>
          </View>
        );
    }

    if(this.state.childAngles.length > 1 && this.state.level2ChildAngles.length === 0) {
      return(
          <View style= {this.props.semiCircle ? styles.semiMainView : styles.mainView}>
            <Svg viewBox="-100 -100 200 200" width={width} height={height}>
          <G width={width / 2} height={height / 2}>
            <Circle cx="0" cy="0" r="30" fill={this.state.colorStack[0]}
            onPress={() => this.clickOnChildTitle()}
             />
            <Text fontSize="8" x={0} y={this.props.semiCircle?-4:4} textAnchor="middle">
                                        {this.truncate(this.state.nameOfChild)}
                  </Text>

            {this.state.childAngles.map((section, idx) => (
              
              <Animatee.G
              fill={this.state.colorStack[idx+2]}
              >

              <GeneratePath 
              onPress= {this.clickOnChildItem}
              passed= {false}

              idx= {idx}
              section= {section}
              key= {idx}
              path= {this.path}
              d= {this.path(section)}
              />

              <GenerateArcText 
              section= {section}
              idx= {idx}
              textColor= {this.props.textColor}
              passed= {false}
              path= {this.path}
              semi= {this.props.semiCircle}
              />
            </Animatee.G>
              
          ))}
      </G>
    </Svg>  
          </View>
      );
    }

    if(this.state.level2ChildAngles.length > 1) {
      return(
          <View style= {this.props.semiCircle ? styles.semiMainView : styles.mainView}>
            <Svg
                viewBox = "-100 -100 200 200"
                 width={width}
                 height={height}>
                <G width = {width/2} height={height/2}>
                  < Circle
                   cx = "0"
                   cy = "0"
                   onPress={()=> this.clickOnLevel2ChildTitle()}
                   r = "30"
                   fill = {this.state.colorStack2[0]} />
                    <Text
                      onPress={()=> this.clickOnLevel2ChildTitle()}
                      fill="black"
                      fontSize="8"
                      x={0}
                      y={this.props.semiCircle?-4:4}
                      textAnchor = "middle">{this.state.nameOfChildLevel2}</Text>
                   { this.state.level2ChildAngles.map((section, idx) => (
                               <Animatee.G
                                fill={this.state.colorStack2[idx+2]}
                                >

                                <GeneratePath 
                                onPress={this.clickOnChildItem}
                                passed= {false}

                                idx= {idx}
                                section= {section}
                                key= {idx}
                                path= {this.path}
                                d= {this.path(section)}
                                />

                                <GenerateArcText 
                                section= {section}
                                textColor= {this.props.textColor}
                                idx= {idx}
                                passed= {false}
                                path= {this.path}
                                semi= {this.props.semiCircle}
                                />
                            </Animatee.G>
                                     ))}
                             </G>
             </Svg>  
          </View>
      );
    }

    else {
      return (
          <View style= {styles.mainView}>
            <Text numberOfLines= {3} style= {{alignSelf: 'center', fontSize: 20}}>
              There happens to be some problem with userPurchases prop..!
            </Text>
          </View>
        );
    }
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  semiMainView: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'flex-end',
    marginBottom: -150,
  }
});

export default GenerateCanvas;