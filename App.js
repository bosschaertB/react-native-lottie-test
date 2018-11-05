import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View, 
    Animated,
    Easing,
    Slider,
    Switch,
    Image,
    TouchableOpacity
  } from 'react-native';
import LottieView from 'lottie-react-native';
import ExamplePicker from './ExamplePicker';

const AnimatedSlider = Animated.createAnimatedComponent(Slider);

const playIcon = require('./images/play.png');
const pauseIcon = require('./images/pause.png');
const loopIcon = require('./images/loop.png');
const inverseIcon = require('./images/inverse.png');

const makeExample = (name, getJson, width) => ({ name, getJson, width });
const EXAMPLES = [
  makeExample('Hamburger Arrow (200 px)', () => require('./animations/HamburgerArrow.json'), 200),
  makeExample('Line Animation', () => require('./animations/LineAnimation.json')),
  makeExample('Twitter Heart', () => require('./animations/TwitterHeart.json')),
  makeExample('BB 8', () => require('./animations/bb8.json')),
  makeExample('Plate', () => require('./animations/plate.json')),
  makeExample('Building', () => require('./animations/building_evolution_animation.json')),
  makeExample('Delete', () => require('./animations/delete_bubble.json')),
  makeExample('Favorite', () => require('./animations/favorite.json')),
  makeExample('Menu', () => require('./animations/menu_button.json')),
  makeExample('Filter', () => require('./animations/filter_button.json')),
  makeExample('Edit', () => require('./animations/edit_button.json')),
  makeExample('Notification', () => require('./animations/notification.json')),
  makeExample('Geometry', () => require('./animations/geometry.json')),
  makeExample('Day Of The Dead', () => require('./animations/day_of_the_dead.json')),
  makeExample('Deadpool', () => require('./animations/deadpool.json')),
  makeExample('Material Loading', () => require('./animations/material_loading_animation_2.json'))
];

export default class App extends Component {
  state = {
    example: EXAMPLES[0],
    duration: 3000,
    isPlaying: true,
    isInverse: false,
    loop: true,
  };

manageAnimation = shouldPlay => {
    if (!this.state.progress) {
      if (shouldPlay) {
        this.anim.play();
      } else {
        this.anim.reset();
      }
    } else {
      this.state.progress.setValue(0);

      if (shouldPlay) {
        Animated.timing(this.state.progress, {
          toValue: 1,
          duration: this.state.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => {
          this.setState({ isPlaying: false });
        });
      }
    }

    this.setState({ isPlaying: shouldPlay });
  };

  onPlayPress = () => this.manageAnimation(!this.state.isPlaying);
  stopAnimation = () => this.manageAnimation(false);

  onInversePress = () => this.setState(state => ({ isInverse: !state.isInverse }));
  onProgressChange = progress => this.state.progress.setValue(progress);
  onDurationChange = duration => this.setState({ duration });

  setAnim = anim => {
    this.anim = anim;
  };

  render() {
    const { duration, isPlaying, isInverse, progress, loop, example } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <ExamplePicker
          example={example}
          examples={EXAMPLES}
          onChange={(e, index) => {
            this.stopAnimation();
            this.setState({ example: EXAMPLES[index] });
          }}
        />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <LottieView
            ref={this.setAnim}
            autoPlay={!progress}
            style={[example.width && { width: example.width }, isInverse && styles.lottieViewInvse]}
            source={example.getJson()}
            progress={progress}
            loop={loop}
            enableMergePathsAndroidForKitKatAndAbove
          />
        </View>
        <View style={{ paddingBottom: 20, paddingHorizontal: 10 }}>
          <View style={styles.controlsRow}>
            <TouchableOpacity
              onPress={() => {
                this.stopAnimation();
                this.setState(state => ({ loop: !state.loop }));
              }}
              disabled={!!progress}
            >
              <Image
                style={[
                  styles.controlsIcon,
                  loop && styles.controlsIconEnabled,
                  !!progress && styles.controlsIconDisabled,
                ]}
                resizeMode="contain"
                source={loopIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playButton} onPress={this.onPlayPress}>
              <Image
                style={styles.playButtonIcon}
                resizeMode="contain"
                source={isPlaying ? pauseIcon : playIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onInversePress}>
              <Image style={styles.controlsIcon} resizeMode="contain" source={inverseIcon} />
            </TouchableOpacity>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}
          >
            <Text>Use Imperative API:</Text>
            <View />
            <Switch
              onValueChange={i => {
                this.stopAnimation();
                this.setState(() => ({
                  progress: !i ? new Animated.Value(0) : undefined,
                }));
              }}
              value={!progress}
            />
          </View>
          <View style={{ paddingBottom: 10 }}>
            <View>
              <Text>Progress:</Text>
            </View>
            <AnimatedSlider
              minimumValue={0}
              maximumValue={1}
              value={progress || 0}
              onValueChange={this.onProgressChange}
              disabled={!progress}
            />
          </View>
          <View>
            <View>
              <Text>Duration: ({Math.round(duration)}ms)</Text>
            </View>
            <Slider
              step={50}
              minimumValue={50}
              maximumValue={4000}
              value={duration}
              onValueChange={this.onDurationChange}
              disabled={!progress}
            />
          </View>
        </View>
      </View>
    );
  }
}

const PLAY_BUTTON_SIZE = 60;
const styles = StyleSheet.create({
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  playButton: {
    width: PLAY_BUTTON_SIZE,
    height: PLAY_BUTTON_SIZE,
    borderRadius: PLAY_BUTTON_SIZE / 2,
    backgroundColor: '#1d8bf1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonIcon: {
    width: 16,
    height: 16,
  },
  controlsIcon: {
    width: 24,
    height: 24,
    padding: 8,
  },
  controlsIconEnabled: {
    tintColor: '#1d8bf1',
  },
  controlsIconDisabled: {
    tintColor: '#aaa',
  },
  lottieView: {
    flex: 1,
  },
  lottieViewInvse: {
    backgroundColor: 'black',
  },
});
