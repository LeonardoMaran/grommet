import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import { colorForName, colorIsDark } from '../../utils';

import { withForwardRef, withTheme } from '../hocs';

import StyledBox, { StyledBoxGap } from './StyledBox';

import doc from './doc';

const styledComponents = {
  div: StyledBox,
}; // tag -> styled component

class Box extends Component {
  static contextTypes = {
    grommet: PropTypes.object,
  }

  static childContextTypes = {
    grommet: PropTypes.object,
  }

  static defaultProps = {
    direction: 'column',
    margin: 'none',
    pad: 'none',
    responsive: true,
    tag: 'div',
  };

  getChildContext() {
    const { grommet } = this.context;
    const { background, theme } = this.props;
    if (background) {
      let dark = false;
      if (typeof background === 'object') {
        dark = background.dark;
      } else {
        const color = colorForName(background, theme);
        if (color) {
          dark = colorIsDark(color);
        }
      }
      return {
        grommet: { ...grommet, dark },
      };
    }
    return {};
  }

  render() {
    const {
      a11yTitle,
      children,
      direction,
      elevation, // munged to avoid styled-components putting it in the DOM
      fill, // munged to avoid styled-components putting it in the DOM
      forwardRef,
      gap,
      overflow, // munged to avoid styled-components putting it in the DOM
      responsive,
      tag,
      theme,
      wrap, // munged to avoid styled-components putting it in the DOM
      ...rest
    } = this.props;
    const { grommet } = this.context;

    let StyledComponent = styledComponents[tag];
    if (!StyledComponent) {
      StyledComponent = StyledBox.withComponent(tag);
      styledComponents[tag] = StyledComponent;
    }

    let contents = children;
    if (gap) {
      contents = [];
      let firstIndex;
      Children.forEach(children, (child, index) => {
        if (child) {
          if (firstIndex === undefined) {
            firstIndex = index;
          } else {
            contents.push((
              <StyledBoxGap
                key={index}
                gap={gap}
                directionProp={direction}
                responsive={responsive}
                theme={theme}
              />
            ));
          }
        }
        contents.push(child);
      });
    }

    return (
      <StyledComponent
        aria-label={a11yTitle}
        innerRef={forwardRef}
        directionProp={direction}
        elevationProp={elevation}
        fillProp={fill}
        overflowProp={overflow}
        wrapProp={wrap}
        responsive={responsive}
        theme={theme}
        grommet={grommet}
        {...rest}
      >
        {contents}
      </StyledComponent>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  doc(Box);
}

export default compose(
  withTheme,
  withForwardRef, // needed for RangeSelector
)(Box);
