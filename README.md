# React-Native SVGWheel Menu

This is a react-native component for IOS and Android that uses React Native SVG where you send the configuration as a prop and the Menu is rendered.

## Getting Started
```bat
 $ npm install react-native-svgwheel-menu --save
```
## Demo
![alt text](https://i.postimg.cc/MGZ1z844/s1.png)
![alt text](https://i.postimg.cc/RhHQs7rZ/Screenshot-1548160725.png)
![alt text](https://i.postimg.cc/HWc2kgJ1/Screenshot-1548160720.png)
![alt text](https://i.postimg.cc/0ydb59zv/Screenshot-1542871939.png)

```javascript
import GeneratePathCanvas from "react-native-svgwheel-menu";

const userPurchases = [
    {
        id: '1.1',
        parent: '0.0',
        itemName: 'US',
        price: 1,
        color: '',
        icon: 'https://networkImage.url'
    },
    {
        id: '1.2',
        parent: '0.0',
        itemName: 'ITALY',
        price: 1,
        color: '',
        icon: 'https://networkImage.url'
    },
    {
        id: '1.3',
        parent: '0.0',
        itemName: 'BELGIUM',
        price: 1,
        color: '',
        icon: 'https://networkImage.url'
    },
    {
        id: '1.4',
        parent: '0.0',
        itemName: 'POLAND',
        price: 1,
        color: '',
        icon: 'https://networkImage.url'
    },
    {
        id: '1.5',
        parent: '0.0',
        itemName: 'POLAND',
        price: 1,
        color: '',
        icon: 'https://networkImage.url'
    },
    {
        id: '1.6',
        parent: '0.0',
        itemName: 'URUGUAY',
        price: 1,
        color: '',
        icon: 'https://networkImage.url'
    },
    {
        id: '2.1',
        parent: '1.1',
        itemName: 'TEXAS',
        price: 1,
        color: '',
        icon: 'https://networkImage.url'
    },
    {
        id: '2.2',
        parent: '1.1',
        itemName: 'INDIANA',
        price: 1,
        color: '',
        icon: 'https://networkImage.url'
    },
    {
        id: '2.3',
        parent: '1.1',
        itemName: 'NEVADA',
        price: 1,
        color: '',
        icon: 'https://networkImage.url'
    },
    ...
];
class App extends Component {
    render() {
    return (
            <GeneratePathCanvas
                semiCircle={false}
                textColor= '#000000'
                depth={2}
                homeTitle='Home'
                userPurchases={userPurchases}
                holdHoverLayer= {2000}
                pieColorArray={pieColorArray}
                clickEvent={this.generatePathClickEvent} />
        );
    }
}
```

## Props
| Prop          | Required      | Description  |
| ------------- |:-------------:| ------------:|
| depth        | true          | A Number to define Levels of your Menu  |
| homeTitle     | true      |   A String to define the title at Level 1 |
| userPurchases     | true      |   An array of values to differentiate between parent and child levels |
| pieColorArray   | true | An array of colors in hex code |
| clickEvent | true      |   A function callback that handles child data and its name clicked at last level |
| semiCircle| true  | A boolean to define the menu to be Semicircle for True and Circle for False |
| holdHoverLayer| true  | A Number to pass as time in ms to hold hover layer |

## Stuff used to make this:

 * [react-native-svg](https://github.com/react-native-community/react-native-svg) for making the svg

