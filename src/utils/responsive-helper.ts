import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';

// import Config from 'react-native-config';

/**
 * The Design Resolution of Assets and screens as decided and provided by design teams
 *
 * @export Type interface of resolution
 * @interface DesignResolutionType
 */
export interface DesignResolutionType {
  width: number;
  height: number;
}

/**
 * Setting the base Design Resolution of artboard as provided by Designers, For one project ideally it should be set only once
 */
let designResolution: DesignResolutionType = {
  width: parseInt('375', 10),
  height: parseInt('812', 10),
};

/**
 * Width Percentage of element
 * Converts dimension into percentage in accordance to design artboard guidelines and Design resolutions values.
 *
 *
 * @param dimension Directly taken from Design wireframes
 * @returns {string} Width Percentage e.g, '25%' in accordance with design guidelines and design resolutions
 */
export const wp = (dimension: number) => {
  return widthPercentageToDP((dimension / designResolution?.width) * 100 + '%');
};
/**
 * Height Percentage of element
 * Converts with dimension into percentage in accordance to design artboard guidelines and Design resolutions values.
 *
 *
 * @param dimension Directly taken from Design wireframes
 * @returns {string} Height percentage e.g '10%' in accordance with design guidelines and design resolutions
 */
export const hp = (dimension: number) => {
  return heightPercentageToDP(
    (dimension / designResolution?.height) * 100 + '%',
  );
};
