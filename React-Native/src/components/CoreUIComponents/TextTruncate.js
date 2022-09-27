import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default class TextTruncate extends Component {
  static propTypes = {
    numberOfLines: PropTypes.number,
    initExpanded: PropTypes.bool,
    expansionDuration: PropTypes.number,
    collapsionDuration: PropTypes.number,
    expandorActiveOpacity: PropTypes.number,
    collapsarActiveOpacity: PropTypes.number,
    expandorStyle: PropTypes.any,
    collapsarStyle: PropTypes.any,
    renderExpandor: PropTypes.func,
    renderCollapsar: PropTypes.func,
    onExpandorPress: PropTypes.func,
    onCollapsarPress: PropTypes.func,
    onExpand: PropTypes.func,
    onCollapse: PropTypes.func,
  };
  static defaultProps = {
    expandorActiveOpacity: 0.8,
    collapsarActiveOpacity: 0.8,
    initExpanded: false,
    expansionDuration: 300,
    collapsionDuration: 300,
  };

  _heightAnimatedValue;
  _fullHeight;
  _truncatedHeight;

  constructor(props) {
    super(props);
    const {initExpanded} = this.props;
    this.state = {
      truncatedHeight: undefined,
      fullHeight: undefined,
      expanded: initExpanded,
    };
  }

  render() {
    const {style, numberOfLines, ...restProps} = this.props;
    const {expanded} = this.state;
    let truncatorView;
    const _numberOfLines = expanded ? undefined : numberOfLines;
    if (expanded) {
      truncatorView = this.renderCollapsar();
    } else {
      if (
        (this._truncatedHeight &&
          this._fullHeight &&
          this._truncatedHeight < this._fullHeight) ||
        !this._fullHeight ||
        !this._truncatedHeight
      ) {
        truncatorView = this.renderExpandor();
      }
    }
    return (
      <View style={styles.container}>
        <Animated.View
          style={{
            height: this._heightAnimatedValue,
            overflow: 'hidden',
          }}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              opacity: 0,
            }}
            onLayout={this.onFullViewLayout}>
            <Text {...this.props} numberOfLines={undefined} />
          </View>
          <View onLayout={expanded ? undefined : this.onLayout}>
            <Text {...this.props} numberOfLines={_numberOfLines} />
          </View>
        </Animated.View>
        {truncatorView}
      </View>
    );
  }

  onLayout = event => {
    const {truncatedHeight, expanded} = this.state;
    const height = event.nativeEvent.layout.height;
    if (!this._heightAnimatedValue) {
      this._heightAnimatedValue = new Animated.Value(height);
    }
    if (expanded) {
      this._fullHeight = height;
      this._truncatedHeight = height;
    } else {
      this._truncatedHeight = height;
    }
    if (!truncatedHeight) {
      this.setState({
        truncatedHeight: height,
      });
    }
  };
  onFullViewLayout = event => {
    const {fullHeight} = this.state;
    const height = event.nativeEvent.layout.height;
    this._fullHeight = height;
    if (!fullHeight) {
      this.setState({
        fullHeight: height,
      });
    }
  };

  renderExpandor = () => {
    const {expandorActiveOpacity, expandorStyle, renderExpandor} = this.props;
    if (renderExpandor) {
      return (
        <TouchableOpacity
          style={[styles.truncatorContainer, expandorStyle]}
          activeOpacity={expandorActiveOpacity}
          onPress={this._onExpandorPress}>
          {renderExpandor()}
        </TouchableOpacity>
      );
    }
    return null;
  };
  renderCollapsar = () => {
    const {
      collapsarActiveOpacity,
      collapsarStyle,
      renderCollapsar,
    } = this.props;
    if (renderCollapsar) {
      return (
        <TouchableOpacity
          style={[styles.truncatorContainer, collapsarStyle]}
          activeOpacity={collapsarActiveOpacity}
          onPress={this._onCollapsarPress}>
          {renderCollapsar()}
        </TouchableOpacity>
      );
    }
    return null;
  };

  _onExpandorPress = () => {
    const {onExpandorPress} = this.props;
    this.expand();
    onExpandorPress && onExpandorPress();
  };

  expand = () => {
    const {expanded} = this.state;
    const {expansionDuration, renderExpandor} = this.props;
    if (this._fullHeight > 0 && !expanded && renderExpandor) {
      Animated.timing(this._heightAnimatedValue, {
        toValue: this._fullHeight,
        duration: expansionDuration,
      }).start();
      this.setState({
        expanded: true,
      });
    }
  };
  _onCollapsarPress = () => {
    const {onCollapsarPress} = this.props;
    this.collapse();
    onCollapsarPress && onCollapsarPress();
  };
  collapse = () => {
    const {expanded} = this.state;
    const {renderCollapsar, collapsionDuration} = this.props;
    if (expanded && renderCollapsar) {
      if (this._truncatedHeight > 0) {
        Animated.timing(this._heightAnimatedValue, {
          toValue: this._truncatedHeight,
          duration: collapsionDuration,
        }).start();
      } else {
        LayoutAnimation.easeInEaseOut();
      }
      this.setState({
        expanded: false,
      });
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {onExpand, onCollapse} = this.props;
    if (prevState.expanded !== this.state.expanded) {
      if (this.state.expanded) {
        onExpand && onExpand();
      } else {
        onCollapse && onCollapse();
      }
    }
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
  },
  truncatorContainer: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
});
