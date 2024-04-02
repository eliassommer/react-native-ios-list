import React, {
  Children,
  ReactElement,
  cloneElement,
  PropsWithChildren,
} from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  StyleSheet,
  useColorScheme, // Import useColorScheme
} from 'react-native';
import { colors } from '../../utils';
import { Caption } from '../Caption';
import { ListStyleProvider } from '../ListStyleProvider';
import { RowProps } from '../Row';

export type ListProps = PropsWithChildren<{
  inset?: boolean;
  sideBar?: boolean;
  hideDividers?: boolean;
  header?: string | ReactElement<any>;
  footer?: string | ReactElement<any>;
  backgroundColor?: string;
  containerBackgroundColor?: string;
  dividerColor?: string;
  headerColor?: string;
  footerColor?: string;
  style?: StyleProp<ViewStyle>;
}>;

export const List = ({
  inset = false,
  sideBar = false,
  hideDividers = false,
  header,
  footer,
  backgroundColor,
  containerBackgroundColor,
  headerColor = colors.systemgray,
  footerColor = colors.systemgray,
  dividerColor = colors.systemgray3,
  style,
  children,
}: ListProps) => {
  const scheme = useColorScheme(); // Use the hook to detect theme

  // Adjust the colors based on the theme
  const dynamicColors = {
    backgroundColor: scheme === 'dark' ? colors.darkModeBackground : colors.lightModeBackground,
    containerBackgroundColor: scheme === 'dark' ? colors.darkModeBackground : colors.lightModeBackground,
    headerColor: scheme === 'dark' ? colors.darkModeText : colors.lightModeText,
    footerColor: scheme === 'dark' ? colors.darkModeText : colors.lightModeText,
    dividerColor: scheme === 'dark' ? colors.darkModeDivider : colors.lightModeDivider,
  };

  const listStyle = inset ? 'insetGrouped' : 'grouped';

  return (
    <ListStyleProvider sideBar={sideBar} dividerColor={dynamicColors.dividerColor}>
      <View
        style={[
          getOuterContainerStyles(listStyle),
          { backgroundColor: dynamicColors.containerBackgroundColor },
        ]}
      >
        {header && <Caption caption={header} color={dynamicColors.headerColor} />}
        <View
          style={[
            getContainerStyles(listStyle),
            { backgroundColor: dynamicColors.backgroundColor, borderColor: dynamicColors.dividerColor },
            style,
          ]}
        >
          {Children.map(children, (child: ReactElement<RowProps>, index) =>
            cloneElement(child, {
              hideDivider: hideDividers || index === Children.count(children) - 1,
              ...child.props,
            })
          )}
        </View>
        {footer && <Caption caption={footer} color={dynamicColors.footerColor} />}
      </View>
    </ListStyleProvider>
  );
};

const getOuterContainerStyles = (type: string) => {
  switch (type) {
    case 'grouped':
      return styles.groupedOuterContainer;
    case 'insetGrouped':
      return styles.insetGroupedOuterContainer;
    default:
      return styles.groupedOuterContainer;
  }
};

const getContainerStyles = (type: string) => {
  switch (type) {
    case 'grouped':
      return styles.groupedContainer;
    case 'insetGrouped':
      return styles.insetGroupedContainer;
    default:
      return styles.groupedContainer;
  }
};

const styles = StyleSheet.create({
  groupedOuterContainer: {
    width: '100%',
    backgroundColor: colors.transparent,
  },
  insetGroupedOuterContainer: {
    width: '90%',
    backgroundColor: colors.transparent,
    alignSelf: 'center',
  },
  groupedContainer: {
    backgroundColor: colors.white, // This will be overridden by dynamic colors
    borderBottomWidth: StyleSheet.hairlineWidth * 1.2,
    borderTopWidth: StyleSheet.hairlineWidth * 1.2,
  },
  insetGroupedContainer: {
    backgroundColor: colors.white, // This will be overridden as well
    borderRadius: 10,
    overflow: 'hidden',
  },
  // Add definitions for darkModeBackground, lightModeBackground, etc., in your colors utility
});
